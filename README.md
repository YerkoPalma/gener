# gener [![npm version](https://img.shields.io/npm/v/gener.svg?style=flat-square)](https://www.npmjs.com/package/gener) 
[![Build Status](https://img.shields.io/travis/YerkoPalma/gener/master.svg?style=flat-square)](https://travis-ci.org/YerkoPalma/gener) [![test coverage](https://img.shields.io/codecov/c/github/yerkopalma/gener/master.svg?style=flat-square)](https://codecov.io/github/yerkopalma/gener) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> Simple static ~~site~~ blog generator

## Install

```bash
$ npm install -g gener
```

## Basic usage

`cd` to the folder where you want the dist files to be created, and run:

```bash
$ gener
```

This will create an `index.html` and `bundle.js` file, that is your blog, congratulations :tada:. Add those files to a static server and you are done.
Now for this to work, you need a `posts` folder, containing, at least, one post. A post is made of two files, a markdwon file and a json file, both with the same name.
The `md` file is the actual content of your post, in markdown format. The json file is a configuration file, you can add the next properties to that files:

- author (optional): An object with the data of the author of the post. It has a name (string) property and a social (object) property. Social properties are social network names (key) and links to its (value).
- date (optional): An object with three properties (day, motnh, year), all of them are 1 based integers.
- title: A string with the title of the post.
- subtitle: Subtitle of the post.
- tags(optional): An array of strings with the tags of the post.

## Customization

There are two things that can be customized: Global config, through `config.js` file, and layouts through `layouts` folder.

### Global config

In the root directory, you can add a `config.json` file. You can customize the following options:

- author: A string with the owner (you) of the site.
- name: The blog's name.
- domain: Blog domain, (will) add a CNAME file with this value.
- layout: The name of the layout to be used, by default use the `default` layout, if you change that, you should add layouts files to the `layouts` folder.
- styles: An array of strings containing stylesheets to be added to the `index.html` file.
- scripts: An array of js scripts. These are not added as script tags to the `index.html` file, they are runned after the view is mounted, otherwise, you wouldn't have access to the DOM of your blog.
- classes: An object with posible custom classes for your rendered post. Useful in case your layout is made with some framework, like [bootstrap](http://getbootstrap.com/), that make extensive use of css class to define styles.

### Layouts

To customize layouts, add a `layouts` folder in the root directory. The folder contains the custom layouts that you want to add, those layouts are [Handlebar](http://handlebarsjs.com/) files, with the name that you defined previously in your `config.json` file.
If there is a layout folder and no `layout` property in your config file, the layouts templates would be ignored.
Currently, there is two supported layouts, one for the list of posts and one for each post, and they should be named `<layout-name>.hbs` and `<layout-name>-post.hbs`.
For example, if you have a config file like this:

```json
{
    "name": "Some blog",
    "layout": "awesome"
}
```

You should have two layout files: `layouts/awesome.hbs` and `layouts/awesome-post.hbs`. Also, keep in mind that the post layout have access to each post config property and to a `content` property, with the html of your post, so you must [use triple braces](http://handlebarsjs.com/#html-escaping), and the main layout have access to the properties of the global config file and a `posts` property which is an array with the posts info.


## License

[MIT](/license) © [Yerko Palma](https://github.com/YerkoPalma).
