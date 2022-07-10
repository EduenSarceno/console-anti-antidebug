//SPDX-License-Identifier: AGPL-3.0-only
//Copyright (C) 2022 Eduen Sarceño
//
//Abstract: some websites have anti-debug techniques that target console
//functions. Calling `console.log` in some sites will send to the HTTP server
//user-information data (e.g. spotify.com); other websites use `console.clear`
//into an infinite loop when developer tools are open, this prevent object
//intro-spection (e.g. 9anime).
//
//This addon prevents anti-debug techniques that target console functions.
;(function(){
"use strict"
const kConsoleOwnDescriptors = Object.getOwnPropertyDescriptors(console)

// We need to proxy these functions
;[
  'log',
  'debug',
  'warn',
  'info',
  'error',
  'table'
].forEach(function(str) {
  const logger = kConsoleOwnDescriptors[str]
  if (!logger) {
    return
  }
  const value = logger.value
  logger.value = makeProxyLogger(value)
})

// And, make these NOP-functions
;[
  'clear',
  'dir',
  'dirxml',
  'profile',
  'profileEnd',
].forEach(function(str) {
  const NOP = () => {}
  const property = kConsoleOwnDescriptors[str]
  if (!property) {
    return
  }
  const origin = property.value
  property.value = NOP

  // For testing purpose we export a copy
  const copy = Object.assign({}, property)
  copy.value = origin
  kConsoleOwnDescriptors['___' + str] = copy
})

avoidMonkeyPatching(kConsoleOwnDescriptors)
Object.defineProperties(console, kConsoleOwnDescriptors)

function makeProxyLogger(logger) {
  return function proxyLogger() {
    for (const arg of arguments) {
      // We must prevent logging objects that potentially check if dev-tools are open.
      if ((arg !== null && typeof(arg) === 'object' || typeof(arg) === 'function') && typeof(arg.toString) === 'function') {
        return
      }
    }
    logger.apply(this, arguments)
  }
}

function avoidMonkeyPatching(descriptors) {
  for (const property in descriptors) {
    const descriptor = descriptors[property]
    descriptor.configurable = false
    if (descriptor.writable) {
      let value = descriptor.value
      delete descriptor.value
      delete descriptor.writable
      // It is better to use getter-setter because doing `writable = false`
      // can cause a runtime exception if 'strict_mode' is active.
      descriptor.get = () => value
      descriptor.set = () => value
    }
  }
}

}())
