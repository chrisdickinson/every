# every

an event emitter for integer-based millisecond
steps.

```javascript

var every = require('every')

every(33)
  .on('data', function(dt) {
    console.log(dt) // will always be a multiple of 33  
  })

```

## api

#### timer = every(ms[, installTimer, uninstallTimer, now])

create an event emitter that emits every `ms`. 

optionally provide your own install / uninstall functions for timers.

install functions are expected to return a handle which will then be given to the
uninstall function when the timer is destroyed.

you may also provide your own `now` function -- it defaults to `Date.now()`.

#### timer.paused() -> Boolean

returns whether or not the timer is paused.

#### timer.pause()

pauses the timer. the timer will not emit events while paused.

#### timer.resume()

resumes the timer. the timer will start emitting events again.
**it will not emit the difference between `pause` and `resume` on the next step.**

#### timer.rate() -> currentRateMS

emit the current rate in milliseconds.

#### timer.rate(rate) -> currentRateMS

set the current rate in milliseconds.

#### timer.destroy()

uninstalls the timer function.

## license

MIT
