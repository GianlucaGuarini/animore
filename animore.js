(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.animore = factory());
}(this, (function () { 'use strict';

/**
 * Converts any DOM node/s to a loopable array
 * @param   { HTMLElement|NodeList } els - single html element or a node list
 * @returns { Array } always a loopable object
 */
function domToArray(els) {
  // can this object be already looped?
  if (!Array.isArray(els)) {
    // is it a node list?
    if (/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(els)) && typeof els.length === 'number') return Array.from(els);else
      // if it's a single node
      // it will be returned as "array" with one single entry
      return [els];
  }
  // this object could be looped out of the box
  return els;
}

/**
 * Simple helper to find DOM nodes returning them as array like loopable object
 * @param   { String|DOMNodeList } selector - either the query or the DOM nodes to arraify
 * @param   { HTMLElement }        ctx      - context defining where the query will search for the DOM nodes
 * @returns { Array } DOM nodes found as array
 */
function $(selector, ctx) {
  return domToArray(typeof selector === 'string' ? (ctx || document).querySelectorAll(selector) : selector);
}

/**
 * Split a string into several items separed by spaces
 * @param   { String } l - events list
 * @returns { Array } all the events detected
 * @private
 */
var split = function split(l) {
  return l.split(/\s/);
};

/**
 * Set a listener for all the events received separated by spaces
 * @param   { HTMLElement|NodeList|Array } els     - DOM node/s where the listeners will be bound
 * @param   { String }                     evList  - list of events we want to bind or unbind space separated
 * @param   { Function }                   cb      - listeners callback
 * @param   { String }                     method  - either 'addEventListener' or 'removeEventListener'
 * @param   { Object }                     options - event options (capture, once and passive)
 * @private
 */
function manageEvents(els, evList, cb, method, options) {
  els = domToArray(els);

  split(evList).forEach(function (e) {
    for (var _iterator = els, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var el = _ref;
      el[method](e, cb, options || false);
    }
  });
}

/**
 * Set a listener for all the events received separated by spaces
 * @param   { HTMLElement|Array } els    - DOM node/s where the listeners will be bound
 * @param   { String }            evList - list of events we want to bind space separated
 * @param   { Function }          cb     - listeners callback
 * @param   { Object }            options - event options (capture, once and passive)
 * @returns { HTMLElement|NodeList|Array } DOM node/s and first argument of the function
 */
function add(els, evList, cb, options) {
  manageEvents(els, evList, cb, 'addEventListener', options);
  return els;
}

/**
 * Set a listener using from a list of events triggering the callback only once
 * @param   { HTMLElement|Array } els     - DOM node where the listeners will be bound
 * @param   { String }            evList  - list of events we want to bind space separated
 * @param   { Function }          cb      - listeners callback
 * @param   { Object }             options - event options (capture, once and passive)
 * @returns { HTMLElement|NodeList|Array }  DOM node/s and first argument of the function
 */


/**
 * Remove all the listeners for the events received separated by spaces
 * @param   { HTMLElement|Array } els     - DOM node/s where the events will be unbind
 * @param   { String }            evList  - list of events we want unbind space separated
 * @param   { Function }          cb      - listeners callback
 * @param   { Object }             options - event options (capture, once and passive)
 * @returns { HTMLElement|NodeList|Array }  DOM node/s and first argument of the function
 */
function remove(els, evList, cb, options) {
  manageEvents(els, evList, cb, 'removeEventListener', options);
  return els;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * Converts any DOM node/s to a loopable array
 * @param   { HTMLElement|NodeList } els - single html element or a node list
 * @returns { Object } always a loopable object
 */

function domToArray$1(els) {
  // can this object be already looped?
  if (!Array.isArray(els)) {
    // is it a node list?
    if (els.length) return Array.from(els);else
      // if it's a single node
      // it will be returned as "array" with one single entry
      return [els];
  }
  // this object could be looped out of the box
  return els;
}

var index$2 = domToArray$1;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var index = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', { value: true });

  function _interopDefault(ex) {
    return ex && (typeof ex === 'undefined' ? 'undefined' : _typeof(ex)) === 'object' && 'default' in ex ? ex['default'] : ex;
  }

  var domToArray = _interopDefault(index$2);

  /**
   * Normalize the return values, in case of a single value we avoid to return an array
   * @param   { Array } values - list of values we want to return
   * @returns { Array|String|Boolean } either the whole list of values or the single one found
   * @private
   */
  var normalize = function normalize(values) {
    return values.length === 1 ? values[0] : values;
  };

  /**
   * Parse all the nodes received to get/remove/check their attributes
   * @param   { HTMLElement|NodeList|Array } els    - DOM node/s to parse
   * @param   { String|Array }               name   - name or list of attributes
   * @param   { String }                     method - method that will be used to parse the attributes
   * @returns { Array|String } result of the parsing in a list or a single value
   * @private
   */
  function parseNodes(els, name, method) {
    var names = typeof name === 'string' ? [name] : name;
    return normalize(domToArray(els).map(function (el) {
      return normalize(names.map(function (n) {
        return el[method](n);
      }));
    }));
  }

  /**
   * Set any attribute on a single or a list of DOM nodes
   * @param   { HTMLElement|NodeList|Array } els   - DOM node/s to parse
   * @param   { String|Object }              name  - either the name of the attribute to set
   *                                                 or a list of properties as object key - value
   * @param   { String }                     value - the new value of the attribute (optional)
   * @returns { HTMLElement|NodeList|Array } the original array of elements passed to this function
   *
   * @example
   *
   * import { set } from 'bianco.attr'
   *
   * const img = document.createElement('img')
   *
   * set(img, 'width', 100)
   *
   * // or also
   * set(img, {
   *   width: 300,
   *   height: 300
   * })
   *
   */
  function set(els, name, value) {
    var _ref;

    var attrs = (typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : (_ref = {}, _ref[name] = value, _ref);
    var props = Object.keys(attrs);

    domToArray(els).forEach(function (el) {
      props.forEach(function (prop) {
        return el.setAttribute(prop, attrs[prop]);
      });
    });
    return els;
  }

  /**
   * Get any attribute from a single or a list of DOM nodes
   * @param   { HTMLElement|NodeList|Array } els   - DOM node/s to parse
   * @param   { String|Array }               name  - name or list of attributes to get
   * @returns { Array|String } list of the attributes found
   *
   * @example
   *
   * import { get } from 'bianco.attr'
   *
   * const img = document.createElement('img')
   *
   * get(img, 'width') // => '200'
   *
   * // or also
   * get(img, ['width', 'height']) // => ['200', '300']
   *
   * // or also
   * get([img1, img2], ['width', 'height']) // => [['200', '300'], ['500', '200']]
   */
  function get(els, name) {
    return parseNodes(els, name, 'getAttribute');
  }

  /**
   * Remove any attribute from a single or a list of DOM nodes
   * @param   { HTMLElement|NodeList|Array } els   - DOM node/s to parse
   * @param   { String|Array }               name  - name or list of attributes to remove
   * @returns { HTMLElement|NodeList|Array } the original array of elements passed to this function
   *
   * @example
   *
   * import { remove } from 'bianco.attr'
   *
   * remove(img, 'width') // remove the width attribute
   *
   * // or also
   * remove(img, ['width', 'height']) // remove the width and the height attribute
   *
   * // or also
   * remove([img1, img2], ['width', 'height']) // remove the width and the height attribute from both images
   */
  function remove(els, name) {
    return parseNodes(els, name, 'removeAttribute');
  }

  /**
   * Set any attribute on a single or a list of DOM nodes
   * @param   { HTMLElement|NodeList|Array } els   - DOM node/s to parse
   * @param   { String|Array }               name  - name or list of attributes to detect
   * @returns { Boolean|Array } true or false or an array of boolean values
   * @example
   *
   * import { has } from 'bianco.attr'
   *
   * has(img, 'width') // false
   *
   * // or also
   * has(img, ['width', 'height']) // => [false, false]
   *
   * // or also
   * has([img1, img2], ['width', 'height']) // => [[false, false], [false, false]]
   */
  function has(els, name) {
    return parseNodes(els, name, 'hasAttribute');
  }

  var index_next = {
    get: get,
    set: set,
    remove: remove,
    has: has
  };

  exports.set = set;
  exports.get = get;
  exports.remove = remove;
  exports.has = has;
  exports['default'] = index_next;
});

var index_1 = index.set;
var index_3 = index.remove;
var index_4 = index.has;

var DEFAULT_OPTIONS = {
  duration: 300,
  delay: 0,
  easing: 'ease-in-out',
  onEnd: noop,
  onCancel: noop,
  onStart: noop
};
var IS_ANIMATING_ATTR = 'is-animating';
var TIMER_OFFSET = 5; // ms
var ANIMORE_STRUCT = Object.seal({
  /**
   * Cleanup function triggered when the animations will be complete
   * @returns { ANIMORE_STRUCT } self
   */
  clear: function clear() {
    removeEvents.call(this);
    index_3(this.el, IS_ANIMATING_ATTR);
    style(this.el, {
      opacity: null,
      transition: null,
      transform: null,
      transformOrigin: null,
      willChange: null
    });

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.opts[args[0].type === 'transitioncancel' ? 'onCancel' : 'onEnd'](args);

    return this;
  },


  /**
   * Store the element initial properties
   * @returns { ANIMORE_STRUCT } self
   */
  stash: function stash() {
    this.props.old = inspect(this.el);
    return this;
  },


  /**
   * Apply a flip animation
   * @returns { ANIMORE_STRUCT } self
   */
  apply: function apply() {
    var _this = this;

    if (!this.props.old) throw new Error('Make sure to trigger animore.stash() before any animore.apply()');
    this.props.new = inspect(this.el);
    index_1(this.el, IS_ANIMATING_ATTR, IS_ANIMATING_ATTR);
    addEvents.call(this);
    flip(this.el, this.props, this.opts);
    Object.assign(this.props.old, this.props.new);

    // make sure the transition end will always be triggered
    // this will enable the testing of this script also in a node environment
    setTimeout(function () {
      if (index_4(_this.el, IS_ANIMATING_ATTR)) {
        _this.el.dispatchEvent(new Event('transitionend'));
      }
    }, this.opts.duration + TIMER_OFFSET);
    return this;
  }
});

// noop function
function noop() {}

/**
 * Add all the event listeners to the animore.el
 * @this animore
 */
function addEvents() {
  add(this.el, 'transitionstart', this.opts.onStart);
  add(this.el, 'transitionend transitioncancel', this.clear);
}

/**
 * Remove all the event listeners from the animore.el
 * @this animore
 */
function removeEvents() {
  remove(this.el, 'transitionstart', this.opts.onStart);
  remove(this.el, 'transitionend transitioncancel', this.clear);
}

/**
 * Inspect the transitionable properties of a DOM node
 * @param   { HTMLElement } el - DOM node to inspect
 * @returns { Object } transitionable properties like width, top...
 */
function inspect(el) {
  var _el$getBoundingClient = el.getBoundingClientRect(),
      left = _el$getBoundingClient.left,
      top = _el$getBoundingClient.top,
      height = _el$getBoundingClient.height,
      width = _el$getBoundingClient.width;

  return {
    left: left,
    top: top,
    height: height,
    width: width,
    opacity: +(el.style.opacity || 1)
  };
}

/**
 * Simple function to apply style properties to a DOM node via js objects
 * @param   { HTMLElement } el - element that will be updated
 * @param   { Object } props - new css rules to apply to the element
 */
function style(el, props) {
  Object.keys(props).forEach(function (key) {
    el.style[key] = props[key];
  });
}

/**
 * Apply a flip transition diffing the previous properties against the new ones received
 * @param   { HTMLElement } el - DOM element we want to animate
 * @param   { Object } props - object containing the old and new properties to animate
 * @param   { Object } opts - animation options
 */
function flip(el, props, opts) {
  style(el, {
    opacity: props.old.opacity,
    willChange: 'transform',
    transformOrigin: '0 0',
    transform: '\n    translateX(' + (props.old.left - props.new.left) + 'px)\n    translateY(' + (props.old.top - props.new.top) + 'px)\n    scaleX(' + props.old.width / props.new.width + ')\n    scaleY(' + props.old.height / props.new.height + ')\n'
  });

  // force the reflow
  el.scrollTop;

  style(el, {
    opacity: props.new.opacity,
    transition: 'transform ' + opts.duration + 'ms ' + opts.easing + ' ' + opts.delay + 'ms',
    transform: '\n    translateX(0)\n    translateY(0)\n    scaleX(1)\n    scaleY(1)\n'
  });
}

/**
 * Return an object linked to the context prototype but with all the methods bound to it
 * @param   { Object } src - object that will receive our bound methods
 * @param   { Array } methods - array containing all the methods we want to bind
 * @param   { * } context (optional) - context where we want to bind our methods
 * @returns { Object } new object linked to the src prototype
 */
function bind(src, methods, context) {
  if (!context) context = src;
  methods.forEach(function (method) {
    return src[method] = src[method].bind(context);
  });
  return Object.create(src);
}

/**
 * Factory funciton to create a single animore object
 * @param   { HTMLElement } el - DOM node we need to animate
 * @param   { Object } opts - animations options
 * @returns { Object } animore - animore object
 */
function create(el) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var animore = bind(Object.assign({}, ANIMORE_STRUCT, {
    el: el,
    opts: bind(Object.assign({}, DEFAULT_OPTIONS, opts), ['onStart', 'onEnd', 'onCancel'], animore),
    props: {
      old: null,
      new: null
    }
  }), ['clear', 'stash', 'apply']);
  return Object.seal(animore);
}

/**
 * Returns always an array containing all the animore objects
 * @param   { Array|String|HTMLElement } el - element/s we want to animate
 * @param   { Object } opts - options object
 * @param   { Number } opts.duration - transition duration
 * @param   { String } opts.easing - transition css easing function
 * @param   { Number } opts.delay - transition delay
 * @param   { Function } opts.onEnd - on transition end callback
 * @param   { Function } opts.onStart - on transition start callback
 * @param   { Function } opts.onCancel - on transition cancel callback
 * @returns { Array }
 */
function animore(el, opts) {
  return $(el).map(function (e) {
    return create(e, opts);
  });
}

return animore;

})));
