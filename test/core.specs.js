const assert = require('assert')
const raf = require('raf')
// node js DOM polyfills
require('jsdom-global')()
require('mutationobserver-shim')
global.MutationObserver = window.MutationObserver
global.requestAnimationFrame = raf
global.cancelAnimationFrame = raf.cancel
// require the lib
const animore = require('../')

describe('Animore core', () => {
  function dummyEl() {
    return document.createElement('div')
  }

  it('Can handle a simple animation', (done) => {
    const el = dummyEl()
    const a = animore(el, {
      onEnd() {
        assert.equal(el.style.transform, null)
        a.destroy()
        done()
      }
    })[0]

    el.style.marginTop = '20px'
  })

  it('The destroy method will properly unsubscribe all the listeners', (done) => {
    const el = dummyEl()
    const a = animore(el, {
      onEnd() {
        assert.ok(false)
      }
    })[0]

    el.style.marginTop = '20px'
    a.destroy()

    setTimeout(() => {
      done()
    }, 500)
  })
})
