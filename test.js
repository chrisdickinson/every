var test = require('tape')
  , every = require('./index')
  , EE = require('events').EventEmitter

test('ticks are consistently integer multiples of the framerate', function(assert) {
  var ee = new EE
    , time = 0
    , install = function(fn) { ee.on('data', fn); return fn }
    , uninstall = function(fn) { ee.remove('data', fn) }
    , now = function() { return time }

  var timer = every(16, install, uninstall, now)
    , got

  timer.on('data', function(dt) {
    got = dt
  })

  ee.emit('data')
  assert.strictEqual(got, undefined)

  time = 32
  ee.emit('data')
  assert.strictEqual(got, 32)

  got = null
  time += 24
  ee.emit('data')
  assert.equal(got, 16)

  got = null
  time += 8
  ee.emit('data')
  assert.equal(got, 16)


  assert.end()
})

test('integration / destroy', function(assert) {
  var timer = every(16)

  timer.on('data', function(dt) {
    assert.ok(dt % 16 === 0, 'destroy')
  })

  setTimeout(function() {
    timer.destroy()
    assert.end()
  }, 100)
})

test('integration / rate', function(assert) {
  var timer = every(12)

  timer.rate(50)

  timer.on('data', function(dt) {
    assert.ok(dt % 50 === 0, 'rate')
  })

  setTimeout(function() {
    timer.destroy()
    assert.end()
  }, 100)
})

test('integration / pause + resume', function(assert) {
  var timer = every(10)
  
  timer.pause()

  timer.on('data', function(dt) {
    if(timer.paused()) {
      assert.fail('should be paused')
    }
    assert.ok(dt % 10 === 0, 'pause + resume')
  })

  setTimeout(function() {
    timer.resume()
  }, 40)

  setTimeout(function() {
    timer.destroy()
    assert.end()
  }, 100)
})
