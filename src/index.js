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

  /**
   * Recursively build up elements from props.components and accumulate `results` along the way.
   * @param next The first entry in components
   * @param ...remaining The remaining entries in components
   * @param results This is the argument that we pass into `children`
   * @returns {ReactElement}
   */
  function chainComponents([next, ...remaining], results = []) {
    // When we reach the end of our `childrenComponents`, we can render out
    // the response array.
    if (!next) {
      return children(results);
    }

    // Each props.components entry is either an element or function [element factory]
    // When it is a function, produce an element by invoking it with currently accumulated results.
    const element = typeof next === 'function' ? next(results) : next;

    return React.cloneElement(element, {
      [renderPropName]() {
        return chainComponents(
          remaining,
          results.concat(mapResult ? [mapResult(...arguments)] : arguments[0])
        );
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
