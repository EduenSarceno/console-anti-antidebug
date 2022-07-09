Abstract
=========
Some websites have anti-debug techniques that target console
functions. Calling `console.log` in some sites will send to the HTTP server
user-information data (e.g. spotify.com); other websites use `console.clear`
into an infinite loop when developer tools are open, this prevent object
intro-spection (e.g. 9anime).

This addon prevents anti-debug techniques that target console functions.

Installation
===============
Just download the repository as `.zip`. Once download:

  - Goto `about:debugging` in your web browser.
  - In extensions tab, click on "load temporal extension", and select the zip file.

That's all.

**Note**: only tested on Mozilla Firefox, but it should works on other browsers too.
