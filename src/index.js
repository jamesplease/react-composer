import React from 'react';
import PropTypes from 'prop-types';

export default function Composer({
  components,
  children,
  renderPropName,
  mapResult
}) {
  if (typeof children !== 'function') {
    return null;
  }

  /**
   * Recursively build up elements from props.components and accumulate `results` along the way.
   * @param {Array.<ReactElement|Function>} components
   * @param {Array} results
   * @returns {ReactElement}
   */
  function chainComponents(components, results) {
    // Once components is exhausted, we can render out the results array.
    if (!components[0]) {
      return children(results);
    }

    return React.cloneElement(
      // Each props.components entry is either an element or function [element factory]
      // When it is a function, produce an element by invoking it with currently accumulated results.
      typeof components[0] === 'function'
        ? components[0](results)
        : components[0],
      // Enhance the element's props with the render prop.
      {
        [renderPropName]() {
          return chainComponents(
            // Remove the current component and continue.
            components.slice(1),
            // results.concat([mapped]) ensures [...results, mapped] instead of [...results, ...mapped]
            results.concat(
              mapResult ? [mapResult.apply(null, arguments)] : arguments[0]
            )
          );
        }
      }
    );
  }

  return chainComponents(components, []);
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
  components: [],
  renderPropName: 'children'
};
