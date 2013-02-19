var EE = require('events').EventEmitter

module.exports = every

function every(rate, install, uninstall, now) {
  install = install || function(fn) { return setInterval(fn, 0) }
  uninstall = uninstall || clearInterval
  now = now || function() { return Date.now() }

  var ee = new EE
    , paused = false
    , ival

  ee.rate = function(r) { if(r) { rate = r } return rate }
  ee.pause = function() { paused = true }
  ee.paused = function() { return paused }
  ee.resume = function() { paused = false }
  ee.destroy = function() { uninstall(ival); ival = null }

  var accum = 0
    , curr = 0
    , last = 0
    , dt = 0
    , whole_tick = 0

  ival = install(interval)

  return ee

  function interval() {
    if(paused) {
      last = now()
      accum = 0
      return
    }
    curr = now()
    dt = curr - last
    last = curr
    accum += dt
    if(accum < rate) {
      return
    }

    whole_tick = ((accum / rate)>>>0)

    if(whole_tick <= 0) {
      return
    }

    whole_tick *= rate

    ee.emit('data', whole_tick)
    accum -= whole_tick
  }
}
