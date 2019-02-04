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

const resolveTemplate = (template) => {
  const keys = template.split(':');
  if (keys.length === 1) {
    return getMarkdown(template);
  }

  if (keys[1].trim() === 'ignore') {
    const md = getMarkdown(keys[0]);
    return appendDocsifyIgnore(md);
  }
}

const installIncludeTemplatePlugin = (hook, vm) => {
  hook.beforeEach(content => {
    return content.replace(/%\[{([^\}]*)}\]/g, (_, path) => resolveTemplate(path.trim()));
  });
}

if (!window.$docsify) {
  window.$docsify = {};
}

window.$docsify.plugins = (window.$docsify.plugins || []).concat(installIncludeTemplatePlugin);