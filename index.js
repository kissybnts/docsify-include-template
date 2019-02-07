const appendDocsifyIgnore = (md) => {
  const splitted = md.split('\n');
  return splitted.reduce((acc, current) => {
    let sentence = current;
    if (current.indexOf('#') === 0) {
      sentence += ' {docsify-ignore}';
    }
    sentence += '\n';
    return acc + sentence;
  }, '');
}

const getMarkdown = (p) => {
  const path = /^\//g.test(p) ? p.substr(1) : p;
  try {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", path, false);
    xhttp.send(null);
    if (xhttp.status === 200) {
      return xhttp.responseText;
    }
  } catch (e) {
    console.error(`Failed to load ${p}.md`);
  }
  return `:fire: File not found %[{ ${p} }] :fire:`;
}

const resolveConfigForMultiLines = (t) => {
  const path = /\<\!-- *f:([\w\./_-]*) *--\>/g.exec(t)[1];
  const ignore = /\<\!-- *o:ignore *--\>/g.test(t);
  const regForVarName = /\<\!-- *v:s:([^( --\>)]*) *--\>/;
  const regForVarVal = /\<\!-- *v:s:.* *--\>(?:\n|\r|\r\n)([\s\S]*)\<\!-- *v:e/;
  const variables = t.match(/\<\!-- *v:s:([^( --\>)]*) *--\>(?:\n|\r|\r\n)([\s\S]*)\<\!-- *v:e:\1 *-->/g)
    .reduce((acc, curr) => {
      const k = regForVarName.exec(curr)[1];
      const v = regForVarVal.exec(curr)[1];
      acc[k] = v;
      return acc;
    }, {});
  return {
    path,
    variables,
    ignore,
  };
}

const resolveMultiLines = (t) => {
  const config = resolveConfigForMultiLines(t);
  const md = getMarkdown(config.path);
  const variables = config.variables;
  const replaced = md.replace(/\<\!-- *v:([^( --\>)]*) *--\>/g, (_, b) => variables[b] || '');
  if (config.ignore) {
    return appendDocsifyIgnore(replaced);
  }

  return replaced;
}

const resolveConfigForOneLine = (t) => {
  const r = /(.*):ignore/g.exec(t);
  if (r != null) {
    return {
      path: r[1].trim(),
      ignore: true,
    }
  }

  return {
    path: t,
    ignore: false,
  }
}

const resolveOneLine = (template) => {
  const config = resolveConfigForOneLine(template);

  const md = getMarkdown(config.path);

  if (config.ignore) {
    return appendDocsifyIgnore(md);
  }

  return md;
}

const installIncludeTemplatePlugin = (hook, vm) => {
  hook.beforeEach(content => {
    const one = content.replace(/%\[{([^\}\n\r]*)}\]%/g, (_, path) => resolveOneLine(path.trim()));
    return one.replace(/(\%\[\{)[\r\n]+([\s|\S]*?)[\r\n\s]+(\}\]\%)/g, (_, __, val) => resolveMultiLines(val));
  });
}

if (!window.$docsify) {
  window.$docsify = {};
}

window.$docsify.plugins = (window.$docsify.plugins || []).concat(installIncludeTemplatePlugin);
