import $ from 'bianco.query'
import { add as addEvent, remove as removeEvent } from 'bianco.events'

const OBSERVER_CONFIG = { attributes: true, childList: true, characterData: true }
const DEFAULT_OPTIONS = {
  duration: 300,
  delay: 0,
  easing: 'ease-in-out',
  onEnd: noop,
  onCancel: noop,
  onStart: noop
}
const TIMER_OFFSET = 5 // ms

function noop() {}

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
 * @param   { Object } newProps - new element properties
 * @param   { Object } prevProps - old element properties
 * @param   { Object } opts - animation options
 */
function flip(el, newProps, prevProps, opts) {
  style(el, {
    opacity: prevProps.opacity,
    willChange: 'transform',
    transformOrigin: '0 0',
    transform: `
    translateX(${prevProps.left - newProps.left}px)
    translateY(${prevProps.top - newProps.top}px)
    scaleX(${prevProps.width / newProps.width})
    scaleY(${prevProps.height / newProps.height})
`
  })

  // force the reflow
  el.scrollTop

  style(el, {
    opacity: newProps.opacity,
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
 * Create a single animore object
 * @param   { HTMLElement } el - DOM node we need to animate
 * @param   { Object } opts - animations options
 * @returns { Object } ret
 * @returns { HTMLElement } ret.el - DOM element originally received
 * @returns { Function } ret.destroy - unsubscribe function
 */
function create(el, opts) {
  let isFrozen = false
  let isAnimating = false

  const
    props = inspect(el),
    // create an observer instance
    observer = new MutationObserver(apply)

  observer.observe(el, OBSERVER_CONFIG)

  function removeEvents() {
    removeEvent(el, 'transitionstart', opts.onStart)
    removeEvent(el, 'transitionend transitioncancel', cleanup)
  }

  function addEvents() {
    addEvent(el, 'transitionstart', opts.onStart)
    addEvent(el, 'transitionend transitioncancel', cleanup)
  }

  function apply() {
    if (isFrozen || isAnimating) return
    isAnimating = true
    addEvents()
    const newProps = inspect(el)
    flip(el, newProps, props, opts)
    Object.assign(props, newProps)
    // make sure the transition end will always be triggered
    // this will enable the testing of this script also in a node environment
    setTimeout(() => {
      if (isAnimating) {
        el.dispatchEvent(new Event('transitionend'))
      }
    }, opts.duration + TIMER_OFFSET)
  }

  // cleanup function triggered when the animations are complete
  function cleanup(...args) {
    removeEvents()
    style(el, {
      opacity: null,
      transition: null,
      transform: null,
      transformOrigin: null,
      willChange: null
    })
    opts[args[0].type === 'transitioncancel' ? 'onCancel' : 'onEnd'].apply(null, args)
    requestAnimationFrame(() => isAnimating = false)
  }

  return {
    el,
    freeze() {
      isFrozen = true
      return this
    },
    unfreeze() {
      isFrozen = false
      return this
    },
    apply() {
      apply()
      return this
    },
    destroy() {
      removeEvents()
      observer.disconnect()
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
export default function animore(el, opts = {}) {
  opts = Object.assign({}, DEFAULT_OPTIONS, opts)
  return $(el).map(e => create(e, opts))
}