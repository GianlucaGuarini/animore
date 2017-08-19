import $ from 'bianco.query'
import { add as addEvent, remove as removeEvent } from 'bianco.events'
import { has as hasAttr, set as setAttr, remove as removeAttr } from 'bianco.attr'

const DEFAULT_OPTIONS = {
  duration: 300,
  delay: 0,
  easing: 'ease-in-out',
  onEnd: noop,
  onCancel: noop,
  onStart: noop
}
const IS_ANIMATING_ATTR = 'is-animating'
const TIMER_OFFSET = 5 // ms
const ANIMORE_STRUCT = Object.seal({
  // fallback timer
  timer: null,
  /**
   * Cleanup function triggered when the animations will be complete
   * @returns { ANIMORE_STRUCT } self
   */
  clear(...args) {
    removeEvents.call(this)
    removeAttr(this.el, IS_ANIMATING_ATTR)
    style(this.el, {
      opacity: null,
      transition: null,
      transform: null,
      transformOrigin: null,
      willChange: null
    })
    this.opts[args[0].type === 'transitioncancel' ? 'onCancel' : 'onEnd'](args)

    return this
  },

  /**
   * Store the element initial properties
   * @returns { ANIMORE_STRUCT } self
   */
  stash() {
    this.props.old = inspect(this.el)
    return this
  },

  /**
   * Apply a flip animation
   * @returns { ANIMORE_STRUCT } self
   */
  apply() {
    if (!this.props.old) throw new Error('Make sure to trigger animore.stash() before any animore.apply()')
    this.props.new = inspect(this.el)
    setAttr(this.el, IS_ANIMATING_ATTR, IS_ANIMATING_ATTR)
    addEvents.call(this)
    flip(this.el, this.props, this.opts)
    Object.assign(this.props.old, this.props.new)

    // make sure the transition end will always be triggered
    // this will enable the testing of this script also in a node environment
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      if (hasAttr(this.el, IS_ANIMATING_ATTR)) {
        this.el.dispatchEvent(new Event('transitionend'))
      }
    }, this.opts.duration + TIMER_OFFSET)

    return this
  }
})

// noop function
function noop() {}

/**
 * Add all the event listeners to the animore.el
 * @this animore
 */
function addEvents() {
  addEvent(this.el, 'transitionstart', this.opts.onStart)
  addEvent(this.el, 'transitionend transitioncancel', this.clear)
}

/**
 * Remove all the event listeners from the animore.el
 * @this animore
 */
function removeEvents() {
  removeEvent(this.el, 'transitionstart', this.opts.onStart)
  removeEvent(this.el, 'transitionend transitioncancel', this.clear)
}

/**
 * Inspect the transitionable properties of a DOM node
 * @param   { HTMLElement } el - DOM node to inspect
 * @returns { Object } transitionable properties like width, top...
 */
function inspect(el) {
  const { left, top, height, width } = el.getBoundingClientRect()
  return {
    left,
    top,
    height,
    width,
    opacity: +(el.style.opacity || 1)
  }
}

/**
 * Simple function to apply style properties to a DOM node via js objects
 * @param   { HTMLElement } el - element that will be updated
 * @param   { Object } props - new css rules to apply to the element
 */
function style(el, props) {
  Object.keys(props).forEach(key => {
    el.style[key] = props[key]
  })
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
    transform: `
    translateX(${props.old.left - props.new.left}px)
    translateY(${props.old.top - props.new.top}px)
    scaleX(${props.old.width / props.new.width})
    scaleY(${props.old.height / props.new.height})
`
  })

  // force the reflow
  el.scrollTop

  style(el, {
    opacity: props.new.opacity,
    transition: `transform ${opts.duration}ms ${opts.easing} ${opts.delay}ms`,
    transform: `
    translateX(0)
    translateY(0)
    scaleX(1)
    scaleY(1)
`
  })
}

/**
 * Return an object linked to the context prototype but with all the methods bound to it
 * @param   { Object } src - object that will receive our bound methods
 * @param   { Array } methods - array containing all the methods we want to bind
 * @param   { * } context (optional) - context where we want to bind our methods
 * @returns { Object } new object linked to the src prototype
 */
function bind(src, methods, context) {
  if (!context) context = src
  methods.forEach(method => src[method] = src[method].bind(context))
  return Object.create(src)
}

/**
 * Factory funciton to create a single animore object
 * @param   { HTMLElement } el - DOM node we need to animate
 * @param   { Object } opts - animations options
 * @returns { Object } animore - animore object
 */
function create(el, opts = {}) {
  const animore = {}

  return Object.seal(bind(
    Object.assign(animore, ANIMORE_STRUCT, {
      el,
      opts:  bind(
        Object.assign(
          {},
          DEFAULT_OPTIONS,
          opts
        ),
        ['onStart', 'onEnd', 'onCancel'],
        animore
      ),
      props: {
        old: null,
        new: null
      }
    }),
    ['clear', 'stash', 'apply']
  ))
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
export default function animore(el, opts) {
  return $(el).map(e => create(e, opts))
}