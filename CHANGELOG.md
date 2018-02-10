# Changelog

### v4.1.0 (2018/2/10)

**Improvements**

* ~20% smaller file size.

### v4.0.0 (2018/2/8)

**Breaking**

* The components now render in the opposite order. What this means is that the
  first item in the `components` array will not be the _outermost_ element.
  Previously, it was the _innermost_ element.

  Although this is technically a breaking change, the most typical usage of
  Composer is agnostic to the render order, so there is a chance that you
  may not run into any problems when upgrading from v3 to v4.

### v3.1.1 (2018/2/8)

**Bug Fixes**

* This ensures that the argument passed to functions within the `components`
  array is always a new array.

### v3.1.0 (2018/2/8)

**New Features**

* Within the `components` array, you may now specify a `function` that returns
  a [React Element](https://reactjs.org/docs/glossary.html#elements).
  The function will be called with the currently accumulated results.

### v3.0.1 (2018/2/3)

**Bug Fixes**

* Ensures the array passed to the render prop is a new object each time

### v3.0.0 (2018/2/3)

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
