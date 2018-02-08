import React from 'react';
import PropTypes from 'prop-types';

export default function Composer({
  components = [],
  children,
  renderPropName,
  mapResult
}) {
  if (typeof children !== 'function') {
    return null;
  }

  // This is the argument that we pass into `children`.
  const results = [];

  // This is the list of components, reversed. We reverse them because the
  // component that you list last will be the highest in the tree.
  const reversedComponents = components.reverse();

  function chainComponents(childrenComponents) {
    // When we reach the end of our `childrenComponents`, we can render out
    // the response array.
    if (childrenComponents.length === 0) {
      return children([...results]);
    }

    const componentIndex = childrenComponents.length - 1;

    const component =
      // Each props.components entry is either an element or function [element factory]
      // When it is a function, produce an element by invoking it with currently accumulated results.
      typeof components[componentIndex] === 'function'
        ? components[componentIndex](results)
        : components[componentIndex];

    // This is the index of where we should place the response within `results`.
    // It's not the same as `componentIndex` because we reversed the components when
    // rendering out the components.
    // In a sense, it can be thought of as the "reverse" index of `componentIndex`.
    const responseIndex = reversedComponents.length - childrenComponents.length;

    // We create a clone of the childrenComponents so that subsequent calls to `chidlren`
    // render the same tree. If we modified `reversedComponents` directly, then the tree would
    // be different with each call to `children`.
    const childrenComponentsClone = [...childrenComponents];
    childrenComponentsClone.pop();

    return React.cloneElement(component, {
      [renderPropName]() {
        if (mapResult) {
          results[responseIndex] = mapResult.apply(null, arguments);
        } else {
          results[responseIndex] = arguments[0];
        }
        return chainComponents(childrenComponentsClone);
      }
    });
  }

  return chainComponents(reversedComponents);
}

Composer.propTypes = {
  children: PropTypes.func,
  components: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.element, PropTypes.func])
  ),
  renderPropName: PropTypes.string,
  mapResult: PropTypes.func
};

Composer.defaultProps = {
  renderPropName: 'children'
};
