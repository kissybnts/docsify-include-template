# Docsify include template

[Docsify](https://github.com/docsifyjs/docsify/) plugin. It loads variables from json file specified.

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

## Installation

Put below script into `index.html`.
```html
<script src="//unpkg.com/docsify-include-template/dist/docsify-include-template.js"></script>
```

## Usage

### Basic usage

This plugin will replace `%[{ filename }]%` with the contents of the specified file.  

If your directory is like below and you want to include `template.md` and `hoge.md` into `README.md`,  
```
.
├── index.html
├── README.md
├── template.md
├── templates
│   └── hoge.md
└── .nojekyll
```

the, you can write like below.  
```
# README.md

%[{ template.md }]%

%[{ templates/hoge.md }]%
```

\* Please note that `filename` must include extension. e.g. `template.md`.  

### Docsify ignore

If you don't want to add subheaders witch are in template file, you can tell it to this plugin.
```
%[{ template.md:ignore }]%
```
This plugin will append `{docsify-ignore}` to the headers which are in the template file.

### Advanced usage

You can pass variables to template file.  

Full syntax in a file which includes template files is like this.
```markdown
%[{
<!-- f:filename -->
<!-- o:ignore -->
<!-- v:s:variablaname -->
Something you need
<!-- v:e:variablaname -->
}]%
```

- `<!-- f:filename -->`
    - This is required
    - It specifies the filename.  `filename` must include extension. e.g. `template.md`.
- `<!-- o:ignore -->`
    - This is optional
    - If you put this, this plugin will add `{docsify-ignore}` to the headers which are in the template file.
- `<!-- v:s:variablaname -->` `<!-- v:e:variablaname -->`
    - Set of these comments is required, at least one set
    - `v:s` represents the starting point of the variable
    - `v:e` represents the end point of the variable
    - You can put any markdown syntax between `v:s` and `v:e`, and it will be inserted into the template file 
    - `variablename` should not be duplicated within one `%[{  }]`

In template file, you can write `<!-- v:variablename -->` and it will be replaced by the variable. 

#### Example

If your `README.md` file which includes template file is like below, 
```markdown:README.md
# README.md

%[{
<!-- f:template.md -->
<!-- o:ignore -->
<!-- v:s:hoge -->
This part will be inserted into `template.md` file.  
You can use any markdown syntax.  
<!-- v:e:hoge -->
<!-- v:e:piyo -->
- piyo
- piyopiyo
- **piyo!**
<!-- v:e:piyo -->
}]%
```

And your template file is like below,

```markdown:template.md
## Hoge

<!-- v:hoge -->

## Piyo

<!-- v:piyo -->
```

Then, `README.md` will be like this.

```markdown:README.md
# README.md

## Hoge {docsify-ignore}

This part will be inserted into `template.md` file.  
You can use any markdown syntax.

## Piyo {docsify-ignore}

- piyo
- piyopiyo
- **piyo!**
```

