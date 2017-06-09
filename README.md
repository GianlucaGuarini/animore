# animore
Animore makes DOM state transitions easier
It uses internally the [`MutationObserver`](https://developer.mozilla.org/it/docs/Web/API/MutationObserver) API to determinate whether a DOM node should be transitioned to a different state. It was inspired by [riot-animore](https://github.com/riot/animore) and works thanks to the [flip technique](https://aerotwist.com/blog/flip-your-animations/) by Paul Lewis

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

## Simple automatic transitions

You can pass a query or a DOM node to `animore` and it will start watching its changes through a `MutationObserver` to trigger automatically the transitions.

```js

const anima = animore('.my-div')[0] // animore returns always an array!

anima.el.style.marginTop = '300px'
// animore will autimatically detect this change and transition the y position of the `div`

```

## Manual transitions

You can temporary `freeze` the watcher to trigger manually multiple transitions at same time:

```js

const anima = animore('.my-div')[0]

anima.freeze()
anima.el.style.marginTop = '300px'
anima.el.style.marginLeft = '500px'
anima.unfreeze().apply()
// animore will autimatically detect this change and transition the y position of the `div`

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

Any animore function will return an object with the following properties

## animore.destroy

Remove the DOM events disconnecting the MutationObserver internally created

### @returns self

## animore.apply

Apply manually an animation comparing the current DOM node state with its previous state

### @returns self

## animore.freeze

Freeze temporarily all the MutationObserver automatic updates

### @returns self

## animore.unfreeze

Re enable again the automatic transitions updates

### @returns self

## animore.el

Reference to the DOM node observed

### @returns HTMLElement


[travis-image]:https://img.shields.io/travis/GianlucaGuarini/animore.svg?style=flat-square
[travis-url]:https://travis-ci.org/GianlucaGuarini/animore

[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE.txt

[npm-version-image]:http://img.shields.io/npm/v/animore.svg?style=flat-square
[npm-downloads-image]:http://img.shields.io/npm/dm/animore.svg?style=flat-square
[npm-url]:https://npmjs.org/package/animore
