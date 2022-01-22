/**
 * Inject properties into the object
 * @param keysThe property key array, such as keys, 'config', 'path', injects the object.config.path property into the object
 * @param value The property value
 * @returns {Object}
 */
Object.defineProperty(Object.prototype, 'assignProps', {
  writable: false,
  enumerable: false,
  configurable: true,
  value: function (keys, value) {
    let props = this
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      if (i == keys.length - 1) {
        props[key] = value
      } else {
        props[key] = props[key] == undefined ? {} : props[key]
        props = props[key]
      }
    }
    return this
  }
})
