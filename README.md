# React Composer

[![Travis build status](http://img.shields.io/travis/jmeas/react-composer.svg?style=flat)](https://travis-ci.org/jmeas/react-composer)
[![npm version](https://img.shields.io/npm/v/react-composer.svg)](https://www.npmjs.com/package/react-composer)
[![gzip size](http://img.badgesize.io/https://unpkg.com/react-composer/dist/react-composer.min.js?compression=gzip)](https://unpkg.com/react-composer/dist/react-composer.min.js)

Compose render prop components.

### Motivation

Render props are great. Using a component with a render prop looks like the following:

```jsx
<RenderPropComponent
  {...config}
  render={result => <MyComponent result={result} />}
/>
```

Sometimes you need the result of multiple `RenderPropComponent`s inside of `MyComponent`. This
can get messy.

```jsx
<RenderPropComponent
  {...config}
  render={resultOne => (
    <RenderPropComponent
      {...configTwo}
      render={resultTwo => (
        <RenderPropComponent
          {...configThree}
          render={resultThree => (
            <MyComponent results={[resultOne, resultTwo, resultThree]} />
          )}>
      )}
    />
  )}
/>
```

Nesting render prop components like this is difficult to read. Use React Composer to
clean things up.

```jsx
import Composer from 'react-composer';

<Composer
  components={[
    <RenderPropComponent {...configOne} />,
    <RenderPropComponent {...configTwo} />,
    <RenderPropComponent {...configThree} />
  ]}
  render={([resultOne, resultTwo, resultThree]) => (
    <MyComponent results={[resultOne, resultTwo, resultThree]} />
  )}
/>;
```

### Installation

Install using [npm](https://www.npmjs.com):

```
npm install react-composer
```

or [yarn](https://yarnpkg.com/):

```
yarn add react-composer
```

### API

This library has one export: `Composer`.

#### `<Composer />`

Compose multiple render prop components together. The props are as
follows:

##### `components`

The render prop components to compose.

If you specify a render prop on the components, it will be ignored.

##### `render`

A function that is called with an array of results from the render prop
components.

##### `renderPropName`

The name of the component's render prop. Defaults to `"render"`.

> Note: Components typically use `render` or `children` as the render prop. Some
> even accept both.

##### `mapResult`

A function that is called with the same arguments that each component's render
prop is caled with. This can be used to change the result that each component passes
down.

Typically, this is useful for a component that passes multiple arguments to its
render prop. You could, for instance, map the arguments to an array:

```jsx
<Composer
  components={[<RenderPropComponent />]}
  render={() => { ... }}
  mapResult={function() {
    return Array.from(arguments);
  }}
/>
```

> Note: you won't often need to use this prop, but it's here if you need it.

### Limitations

This library only works for render prop components that have a single render
prop. So, for instance, this library will not work if your component has an API like the following:

```jsx
<RenderPropComponent onSuccess={onSuccess} onError={onError} />
```
