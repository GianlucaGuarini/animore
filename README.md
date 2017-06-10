# animore
Animore makes DOM state transitions easier
It uses internally the css transitions to animate 2 different states of the same DOM node. It was inspired by [riot-animore](https://github.com/riot/animore) and works thanks to the [flip technique](https://aerotwist.com/blog/flip-your-animations/) by Paul Lewis

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]

# Demos

- [The Gallery](https://cdn.rawgit.com/GianlucaGuarini/animore/master/demos/gallery.html)
- [The Box](https://cdn.rawgit.com/GianlucaGuarini/animore/master/demos/box.html)
- [The List](https://cdn.rawgit.com/GianlucaGuarini/animore/master/demos/list.html)
- [The Textarea](https://cdn.rawgit.com/GianlucaGuarini/animore/master/demos/textarea.html)

# Installation

Via npm
```shell
$ npm i animore -S
```

## Script import

Via `<script>`

```html
<script src="path/to/animore.js"></script>
```

Via ES2015 modules

```js
import animore from 'animore'
```

Via commonjs

```js
const animore = require('animore')
```

# Usage

## Simple transitions

You can pass a query or a DOM node to `animore` in the following way:

```js

const animaQuery = animore('.my-div')[0] // animore returns always an array!
const animaNode = animore(myDiv)[0] // DOM nodes are also valid
const animaList = animore([myDiv, myUl]) // an arrays are also valid
const animaNodeList = animore(myUl.children) // NodeLists are valid as well

```

Remeber to use `stash` and `apply` to create your transitions

```js
const anima = animore('.my-div')[0]
anima.stash() // store the previous DOM position
anima.el.style.marginTop = '300px'
anima.apply() // apply the transition
```


## Options

The animore factory function accepts 2 arguments `animore(el, options)` with the `options` object you can specify how your animations should behave:

```js
animore(myDiv, {
  duration: 300, // animation duration in ms
  easing: 'ease-in-out', // this should be a valid css easing function
  delay: 20, // animation delay
  onStart: function() { console.log('new animation started ')},
  onCancel: function() { console.log('animation canceled ')},
  onEnd: function() { console.log('animation ended ')}
})
```

# API

Any animore call will return an object with the following properties

## animore.stash

Store the current DOM node position and size

__@returns self__

## animore.apply

Apply the transition comparing the current DOM node state with its previous state (it can be called only after a `stash`)

__@returns self__

## animore.el

Reference to the DOM node queried

__@returns HTMLElement__

[travis-image]:https://img.shields.io/travis/GianlucaGuarini/animore.svg?style=flat-square
[travis-url]:https://travis-ci.org/GianlucaGuarini/animore

[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE.txt

[npm-version-image]:http://img.shields.io/npm/v/animore.svg?style=flat-square
[npm-downloads-image]:http://img.shields.io/npm/dm/animore.svg?style=flat-square
[npm-url]:https://npmjs.org/package/animore
