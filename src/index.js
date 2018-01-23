import React from 'react';
import PropTypes from 'prop-types';

export default function Composer({
  components = [],
  render,
  renderPropName,
  mapResult
}) {
  if (typeof render !== 'function') {
    return null;
  }

  // This is the argument that we pass into `render`.
  const responses = [];

  // This is the list of components, reversed. We reverse them because the
  // Request that you list last will be the highest in the tree.
  const reversedComponents = components.reverse();

  function chainComponents(childrenComponents) {
    // When we reach the end of our `childrenComponents`, we can render out
    // the response array.
    if (childrenComponents.length === 0) {
      return render(responses);
    }

    const componentIndex = childrenComponents.length - 1;
    const component = components[componentIndex];

    // This is the index of where we should place the response within `responses`.
    // It's not the same as `componentIndex` because we reversed the components when
    // rendering out the components.
    // In a sense, it can be thought of as the "reverse" index of `componentIndex`.
    const responseIndex = reversedComponents.length - childrenComponents.length;

    // We create a clone of the childrenComponents so that subsequent calls to `render`
    // render the same tree. If we modified `reversedComponents` directly, then the tree would
    // be different with each call to `render`.
    const childrenComponentsClone = [...childrenComponents];
    childrenComponentsClone.pop();

    return React.cloneElement(component, {
      [renderPropName]() {
        if (mapResult) {
          responses[responseIndex] = mapResult.apply(null, arguments);
        } else {
          responses[responseIndex] = arguments[0];
        }
        return chainComponents(childrenComponentsClone);
      }
    });
  }

  return chainComponents(reversedComponents);
}

Composer.propTypes = {
  render: PropTypes.func,
  components: PropTypes.array,
  renderPropName: PropTypes.string,
  mapResult: PropTypes.func
};

Composer.defaultProps = {
  renderPropName: 'render'
};
