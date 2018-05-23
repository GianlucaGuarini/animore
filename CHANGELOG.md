# 2.0.3

- updated: dev dependencies
- fixed: fixed the dispatch event on IE 11

# 2.0.2

- fixed: https://github.com/GianlucaGuarini/animore/issues/2

# 2.0.1

- fixed: `setTimeout` debouncing issue

# 2.0.0

- removed: automatic updates using the `MutationObserver` api
- removed: the `destroy`, `freeze`, `unfreeze` are no longer necessary
- added: the `stash` method to store the DOM properties before any update
- updated: simplified the API to only 2 methods `stash` & `apply`

