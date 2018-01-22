# React Composer

Compose render prop components.

### Motivation

If you use a library that has render props, you may use it like this:

```jsx
<RenderPropComponent {...config} render={result => <MyComponent result={result}>}>
```

Sometimes you may need the result of multiple `RenderPropComponents` inside of `MyComponent`. This
can get messy.

```jsx
<RenderPropComponent
  {...config}
  render={resultOne => (
    <RenderPropComponent
      {...configTwo}
      render={resultTwo => <MyComponent results={[resultOne, resultTwo]} />}
    />
  )}
/>
```

Nesting render prop components like this is difficult to read. Use React Composer to
clean things up.

```jsx
import Composer from "react-composer";

<Composer
  components={[
    <RenderPropComponent {...configOne} />,
    <RenderPropComponent {...configTwo} />
  ]}
  render={([resultOne, resultTwo]) => (
    <MyComponent results={[resultOne, resultTwo]} />
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

The render prop components to compose. Don't forget to omit the actual
render prop on the components!

##### `renderPropName`

The name of the component's render prop. Defaults to `"render"`.

##### `render`

A function that is called with an array of results from the render prop
components.

### Limitations

This library only works for render prop libraries that adhere to the following
convention:

1. There is only one render prop, and not multiple
2. The render prop function is passed a single argument
