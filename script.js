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
const kConsoleOwnDescriptors = Object.getOwnPropertyDescriptors(console)

const clear = kConsoleOwnDescriptors['clear'].value
// Make console.clear a NOP function
const nop = () => {}
kConsoleOwnDescriptors['clear'].value = nop
// Also, export a copy of console.clear with another name
const copy = Object.assign({}, kConsoleOwnDescriptors['clear'])
kConsoleOwnDescriptors['_clear'] = (copy.value = clear, copy)

for (const property in kConsoleOwnDescriptors) {
  let descriptor = kConsoleOwnDescriptors[property]
  Object.defineProperty(console, property, preventMonkeyPatching(descriptor))
}

function preventMonkeyPatching(descriptor) {
  return ({
    enumerable: true,
    get: function() {
      return descriptor.value
    },
    set: function(value) {
      return descriptor.value
    }
  })
}

}())
