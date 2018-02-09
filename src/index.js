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

  function chainComponents(childrenComponents) {
    // When we reach the end of our `childrenComponents`, we can render out
    // the response array.
    if (childrenComponents.length === 0) {
      return children([...results]);
    }

    const index = components.length - childrenComponents.length;

    const component =
      // Each props.components entry is either an element or function [element factory]
      // When it is a function, produce an element by invoking it with currently accumulated results.
      typeof components[index] === 'function'
        ? components[index]([...results])
        : components[index];

    // We create a clone of the childrenComponents so that subsequent calls to `chidlren`
    // render the same tree. If we modified `reversedComponents` directly, then the tree would
    // be different with each call to `children`.
    const childrenComponentsClone = [...childrenComponents];
    childrenComponentsClone.pop();

    return React.cloneElement(component, {
      [renderPropName]() {
        if (mapResult) {
          results[index] = mapResult.apply(null, arguments);
        } else {
          results[index] = arguments[0];
        }
        return chainComponents(childrenComponentsClone);
      }
    });
  }

  return chainComponents(components);
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
