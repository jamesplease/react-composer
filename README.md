# React Composer

[![Travis build status](http://img.shields.io/travis/jamesplease/react-composer.svg?style=flat)](https://travis-ci.org/jamesplease/react-composer)
[![npm version](https://img.shields.io/npm/v/react-composer.svg)](https://www.npmjs.com/package/react-composer)
[![Test Coverage](https://codeclimate.com/github/jmeas/react-composer/badges/coverage.svg)](https://codeclimate.com/github/jmeas/react-composer)
[![gzip size](http://img.badgesize.io/https://unpkg.com/react-composer/dist/react-composer.min.js?compression=gzip)](https://unpkg.com/react-composer/dist/react-composer.min.js)

Compose render prop components.

### Motivation

Render props are great. Using a component with a render prop looks like the following:

```jsx
<RenderPropComponent {...config}>
  {result => <MyComponent result={result} />}
</RenderPropComponent>
```

Sometimes you need the result of multiple render prop components inside of `MyComponent`. This
can get messy.

```jsx
<RenderPropComponent {...config}>
  {resultOne => (
    <RenderPropComponent {...configTwo}>
      {resultTwo => (
        <RenderPropComponent {...configThree}>
          {resultThree => (
            <MyComponent results={{ resultOne, resultTwo, resultThree }} />
          )}
        </RenderPropComponent>
      )}
    </RenderPropComponent>
  )}
</RenderPropComponent>
```

Nesting render prop components leads to rightward drift of your code. Use React Composer to
prevent that drift.

```jsx
import Composer from 'react-composer';

<Composer
  components={[
    <RenderPropComponent {...configOne} />,
    <RenderPropComponent {...configTwo} />,
    <RenderPropComponent {...configThree} />
  ]}>
  {([resultOne, resultTwo, resultThree]) => (
    <MyComponent results={{ resultOne, resultTwo, resultThree }} />
  )}
</Composer>;
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

The render prop components to compose. This is an array of [React elements](https://reactjs.org/docs/glossary.html#elements) and/or functions that return elements given the currently accumulated results.

```jsx
<Composer
  components={[
    // Simple elements may be passed where previous results are not required.
    <Outer />,
    // A function may be passed that will be invoked with the currently accumulated results.
    // Functions provided must return a valid React element.
    ([outerResults]) => <Middle results={[outerResults]} />,
    ([outerResults, middleResults]) => (
      <Inner results={[outerResults, middleResults]} />
    )
  ]}>
  {([outerResults, middleResults, innerResults]) => {
    /* ... */
  }}
</Composer>
```

> Note: You do not need to specify the render prop on the components. If you do specify the render prop, it will
> be ignored.

##### `children`

A function that is called with an array of results from the render prop
components.

##### `renderPropName`

The name of the component's render prop. Defaults to `"children"`.

> Note: Components typically use `children` or `render` as the render prop. Some
> even accept both.

##### `mapResult`

A function that is called with the same arguments that each component's render
prop is called with. This can be used to change the result that each component passes
down.

Typically, this is useful for a component that passes multiple arguments to its
render prop. You could, for instance, map the arguments to an array:

```jsx
<Composer
  components={[<RenderPropComponent />]}
  mapResult={function() {
    return Array.from(arguments);
  }}>
  {() => { ... }}
</Composer>
```

> Note: This is an advanced feature that you won't often need to use, but it's here should you need it.

### Guides

#### Limitations

This library only works for render prop components that have a single render
prop. So, for instance, this library will not work if your component has an API like the following:

```jsx
<RenderPropComponent onSuccess={onSuccess} onError={onError} />
```

#### Render Order

The first item in the `components` array will be the outermost component that is rendered. So, for instance,
if you pass

```jsx
<Composer components={[<A/>, <B/>, <C/>]}>
```

then your tree will render like so:

```
- A
  - B
    - C
```

#### Console Warnings

Render prop components often specify with [Prop Types](https://reactjs.org/docs/typechecking-with-proptypes.html)
that the render prop is required. When using these components with React Composer, you may get a warning to the
console.

Although this does not affect the functionality of React Composer, it may be annoying to you. One way
avoid the warnings is to define the render prop as an empty function.

```js
<Composer
  components={[
    <RenderPropComponent {...props} children={() => null} />
  ]}
  // ...
>
```

We understand that this boilerplate is not ideal. We have another proposed solution to this problem that you might like. Unfortunately,
the downside to this other solution is that it is a breaking API change. To read more about it, and to share your opinion on whether we
should make the breaking change, head over to [Issue #43](https://github.com/jamesplease/react-composer/issues/43).

#### Example Usage

Here are some examples of render prop components that benefit from React Composer:

* React's new Context API. See [this example](https://codesandbox.io/s/92pj14134y) by [Kent Dodds](https://twitter.com/kentcdodds).
* [React Request](https://github.com/jamesplease/react-request)

Do you know of a component that you think benefits from React Composer? Open a Pull Request and add it to the list!

### Contributing

Are you interested in helping out with this project? That's awesome – thank you! Head on over to
[the contributing guide](./CONTRIBUTING.md) to get started.
