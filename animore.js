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
    if (
        /^\[object (HTMLCollection|NodeList|Object)\]$/
          .test(Object.prototype.toString.call(els))
        && typeof els.length === 'number'
      )
      { return Array.from(els) }
    else
      // if it's a single node
      // it will be returned as "array" with one single entry
      { return [els] }
  }
  // this object could be looped out of the box
  return els
}

/**
 * Simple helper to find DOM nodes returning them as array like loopable object
 * @param   { String|DOMNodeList } selector - either the query or the DOM nodes to arraify
 * @param   { HTMLElement }        ctx      - context defining where the query will search for the DOM nodes
 * @returns { Array } DOM nodes found as array
 */
function $(selector, ctx) {
  return domToArray(typeof selector === 'string' ?
    (ctx || document).querySelectorAll(selector) :
    selector
  )
}

/**
 * Split a string into several items separed by spaces
 * @param   { String } l - events list
 * @returns { Array } all the events detected
 * @private
 */
var split = function (l) { return l.split(/\s/); };

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
    for (var el of els) el[method](e, cb, options || false);
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
  return els
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
  return els
}

var OBSERVER_CONFIG = { attributes: true, childList: true, characterData: true };
var DEFAULT_OPTIONS = {
  duration: 300,
  delay: 0,
  easing: 'ease-in-out',
  onEnd: noop,
  onCancel: noop,
  onStart: noop
};
var TIMER_OFFSET = 5; // ms

function noop() {}

/**
 * Inspect the transitionable properties of a DOM node
 * @param   { HTMLElement } el - DOM node to inspect
 * @returns { Object } transitionable properties like width, top...
 */
function inspect(el) {
  var ref = el.getBoundingClientRect();
  var left = ref.left;
  var top = ref.top;
  var height = ref.height;
  var width = ref.width;
  return {
    left: left,
    top: top,
    height: height,
    width: width,
    opacity: +(el.style.opacity || 1)
  }
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
 * @param   { Object } newProps - new element properties
 * @param   { Object } prevProps - old element properties
 * @param   { Object } opts - animation options
 */
function flip(el, newProps, prevProps, opts) {
  style(el, {
    opacity: prevProps.opacity,
    willChange: 'transform',
    transformOrigin: '0 0',
    transform: ("\n    translateX(" + (prevProps.left - newProps.left) + "px)\n    translateY(" + (prevProps.top - newProps.top) + "px)\n    scaleX(" + (prevProps.width / newProps.width) + ")\n    scaleY(" + (prevProps.height / newProps.height) + ")\n")
  });

  // force the reflow
  el.scrollTop;

  style(el, {
    opacity: newProps.opacity,
    transition: ("transform " + (opts.duration) + "ms " + (opts.easing) + " " + (opts.delay) + "ms"),
    transform: "\n    translateX(0)\n    translateY(0)\n    scaleX(1)\n    scaleY(1)\n"
  });
}

/**
 * Create a single animore object
 * @param   { HTMLElement } el - DOM node we need to animate
 * @param   { Object } opts - animations options
 * @returns { Object } ret
 * @returns { HTMLElement } ret.el - DOM element originally received
 * @returns { Function } ret.destroy - unsubscribe function
 */
function create(el, opts) {
  var isFrozen = false;
  var isAnimating = false;

  var
    props = inspect(el),
    // create an observer instance
    observer = new MutationObserver(apply);

  observer.observe(el, OBSERVER_CONFIG);

  function removeEvents() {
    remove(el, 'transitionstart', opts.onStart);
    remove(el, 'transitionend transitioncancel', cleanup);
  }

  function addEvents() {
    add(el, 'transitionstart', opts.onStart);
    add(el, 'transitionend transitioncancel', cleanup);
  }

  function apply() {
    if (isFrozen || isAnimating) { return }
    isAnimating = true;
    addEvents();
    var newProps = inspect(el);
    flip(el, newProps, props, opts);
    Object.assign(props, newProps);
    // make sure the transition end will always be triggered
    // this will enable the testing of this script also in a node environment
    setTimeout(function () {
      if (isAnimating) {
        el.dispatchEvent(new Event('transitionend'));
      }
    }, opts.duration + TIMER_OFFSET);
  }

  // cleanup function triggered when the animations are complete
  function cleanup() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    removeEvents();
    style(el, {
      opacity: null,
      transition: null,
      transform: null,
      transformOrigin: null,
      willChange: null
    });
    opts[args[0].type === 'transitioncancel' ? 'onCancel' : 'onEnd'].apply(null, args);
    requestAnimationFrame(function () { return isAnimating = false; });
  }

  return {
    el: el,
    freeze: function freeze() {
      isFrozen = true;
      return this
    },
    unfreeze: function unfreeze() {
      isFrozen = false;
      return this
    },
    apply: function apply$1() {
      apply();
      return this
    },
    destroy: function destroy() {
      removeEvents();
      observer.disconnect();
      return this
    }
  }
}

/**
 * Returns always an array containing
 * the destroy method to disconnect the MutationObserver instances created
 * and the result of the DOM query first argument of this function
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
  if ( opts === void 0 ) opts = {};

  opts = Object.assign({}, DEFAULT_OPTIONS, opts);
  return $(el).map(function (e) { return create(e, opts); })
}

return animore;

})));
