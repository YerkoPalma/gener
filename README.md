# gener [![npm version](https://img.shields.io/npm/v/gener.svg?style=flat-square)](https://www.npmjs.com/package/gener) 
[![Build Status](https://img.shields.io/travis/YerkoPalma/gener/master.svg?style=flat-square)](https://travis-ci.org/YerkoPalma/gener) [![test coverage](https://img.shields.io/codecov/c/github/yerkopalma/gener/master.svg?style=flat-square)](https://codecov.io/github/yerkopalma/gener) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> Simple static ~~site~~ blog generator

## Install

```bash
$ npm install -g gener
```

## Usage

Give an input folder containing, at least:

- A `posts` folder containing your posts.
- A `config.json` file.

```bash
$ gener
```

This will generate three files containing your blog: `index.html`, `bundle.js` and `config.json`. Add those files to a static server and you are done.

## License

[MIT](/license) © [Yerko Palma](https://github.com/YerkoPalma).
