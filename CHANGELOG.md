# Changelog

### v3.0.1 (2018/1/3)

**Bug Fixes**

* Ensures the array passed to the render prop is a new object each time

### v3.0.0 (2018/1/2)

React's new Context API has been finalized, and it uses functional `children` rather than a prop
named `render`. Accordingly, this library has been updated to use `children` as the default.

**Breaking**

* `<Composer/>` now uses `children` as the render prop, rather than `render`.
* The default `renderPropName` is now `"children"` rather than `"render"`

### v2.1.0 (2018/1/22)

**New Features**

* A new prop has been added: `mapResult`. This allows you to use React Composer with
  render prop components that call their own render prop with more than one argument.

### v2.0.0 (2018/1/22)

This was the first release of the library.
