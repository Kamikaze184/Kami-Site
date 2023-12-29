class EventEmitter {
  constructor() {
    this.events = {}
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }

  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((fn) => {
        return fn !== callback
      })
    }
  }

  once(eventName, callback) {
    const fn = () => {
      callback()
      this.off(eventName, fn)
    }
    this.on(eventName, fn)
  }

  emit(eventName, ...args) {
    const event = this.events[eventName]
    if (event) {
      event.forEach((fn) => {
        fn.call(null, ...args)
      })
    }
  }

  removeListener(eventName, callback) {
    const event = this.events[eventName]
    if (event) {
      this.events[eventName] = event.filter((fn) => {
        return fn !== callback
      })
    }
  }
}

const eventEmitter = new EventEmitter()

export { eventEmitter }