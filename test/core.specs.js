const assert = require('assert')
// node js DOM polyfills
require('jsdom-global')()
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
        assert.equal(this.el, el)
        assert.equal(el.style.transform, null)
        done()
      }
    })[0]
    a.stash()
    el.style.marginTop = '20px'
    a.apply()
  })

  it('It throws if no stash was called before apply', () => {
    const el = dummyEl()
    const a = animore(el)[0]
    assert.throws(a.apply, Error)
  })
})
