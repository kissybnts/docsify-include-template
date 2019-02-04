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

This plugin will replace `$[{ filename }]` with the contents of the specified file.  

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

%[{ template.md }]

%[{ templates/hoge.md }]
```

\* Please note that `filename` must includes extension. e.g. `template.md`.  

### Docsify ignore

If you don't want to add subheaders wich are in template file, you can tell it to this plugin.
```
%[{ template.md:ignore }]
```
This plugin will append `{docsify-ignore}` to the headers which are in the template file.