import { cloneElement } from 'react';
import PropTypes from 'prop-types';

export default function Composer(props) {
  return renderRecursive(props.components, [], props.children);
}

Composer.propTypes = {
  children: PropTypes.func.isRequired,
  components: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.element, PropTypes.func])
  ).isRequired
};

/**
 * Recursively build up elements from props.components and accumulate `results` along the way.
 * @param {Array.<ReactElement|Function>} remaining
 * @param {Array} results
 * @param {function} render
 * @returns {ReactElement}
 */
function renderRecursive(remaining, results, render) {
  // Once components is exhausted, we can render out the results array.
  if (!remaining[0]) {
    return render(results);
  }

  // Continue recursion for remaining items.
  // results.concat([value]) ensures [...results, value] instead of [...results, ...value]
  function nextRender(value) {
    return renderRecursive(remaining.slice(1), results.concat([value]), render);
  }

  // Each props.components entry is either an element or function [element factory]
  return typeof remaining[0] === 'function'
    ? // When it is a function, produce an element by invoking it with "render component values".
      remaining[0]({ results, render: nextRender })
    : // When it is an element, enhance the element's props with the render prop.
      cloneElement(remaining[0], { children: nextRender });
}
