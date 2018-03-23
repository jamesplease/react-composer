import React from 'react';
import { shallow, mount } from 'enzyme';
import Composer from '../src';

// Does nothing other than render so that its props may be inspected
function MyComponent(/* props */) {
  return <div>Inspect my props!</div>;
}

function Echo({ value, children }) {
  return children({ value });
}

function EchoRenderProp({ value, renderProp }) {
  return renderProp({ value });
}

function DoubleEcho({ value, children }) {
  return children(value, value.toUpperCase());
}

/**
 * Assert expected hierarchy of components
 * @param {Wrapper} wrapper
 * @param {ReactComponent[]} components
 */
function expectComponentTree(wrapper, components) {
  const expectedMsg =
    'Expected component tree: ' +
    components.map(({ displayName, name }) => displayName || name).join(' > ');
  expect([
    components.reduce((wrapper, selector) => {
      return wrapper.find(selector);
    }, wrapper).length,
    expectedMsg
  ]).toEqual([1, expectedMsg]);
}

describe('React Composer', () => {
  describe('Render, no components', () => {
    test('It should render the return from `children`', () => {
      const mockChildren = jest.fn(() => <div>Sandwiches</div>);

      const wrapper = shallow(
        <Composer components={[]} children={mockChildren} />
      );
      expect(wrapper.contains(<div>Sandwiches</div>)).toBe(true);
      expect(mockChildren).toHaveBeenCalledTimes(1);
      // The outer array represents all of the arguments passed to the
      // mock. The inner array is the empty array of `results` that
      // is passed as the first argument.
      expect(mockChildren.mock.calls[0]).toEqual([[]]);
    });
  });

  describe('Render, one component', () => {
    test('It should render the expected result', () => {
      const mockChildren = jest.fn(([result]) => <div>{result.value}</div>);

      const wrapper = mount(
        <Composer
          components={[<Echo value="spaghetti" />]}
          children={mockChildren}
        />
      );
      expect(wrapper.contains(<div>spaghetti</div>)).toBe(true);
      expect(mockChildren).toHaveBeenCalledTimes(1);
      expect(mockChildren.mock.calls[0]).toEqual([
        [
          {
            value: 'spaghetti'
          }
        ]
      ]);
    });
  });

  describe('Render, two components', () => {
    test('It should render the expected result', () => {
      const mockChildren = jest.fn(([resultOne, resultTwo]) => (
        <div>
          {resultOne.value} {resultTwo.value}
        </div>
      ));

      const wrapper = mount(
        <Composer
          components={[<Echo value="spaghetti" />, <Echo value="pls" />]}
          children={mockChildren}
        />
      );
      expect(wrapper.contains(<div>spaghetti pls</div>)).toBe(true);
      expect(mockChildren).toHaveBeenCalledTimes(1);
      expect(mockChildren.mock.calls[0]).toEqual([
        [
          {
            value: 'spaghetti'
          },
          {
            value: 'pls'
          }
        ]
      ]);
    });
  });

  describe('Render order', () => {
    test('It renders first:Outer, last:Inner', () => {
      const Outer = ({ children }) => children('Outer result');
      const Middle = ({ children }) => children('Middle result');
      const Inner = ({ children }) => children('Inner result');

      const wrapper = mount(
        <Composer
          components={[<Outer />, <Middle />, <Inner />]}
          children={results => <MyComponent results={results} />}
        />
      );

      [
        [Outer, Middle],
        [Outer, Middle, Inner],
        [Outer, Middle, Inner, MyComponent]
      ].forEach(expectedTree => {
        expectComponentTree(wrapper, expectedTree);
      });

      expect(wrapper.find(MyComponent).prop('results')).toEqual([
        'Outer result',
        'Middle result',
        'Inner result'
      ]);
    });
  });

  describe('props.components as functions', () => {
    test('It enables utilizing outer results for inner components', () => {
      const wrapper = mount(
        <Composer
          components={[
            // React elements may be passed for simple/basic use cases.
            <Echo value="outer" />,

            // A function may be passed to produce an element.
            // It will be invoked with renderComponentValues.
            ({ render, results: [outerResult] }) => (
              <Echo value={`${outerResult.value} + middle`} children={render} />
            ),

            ({ render, results: [, middleResult] }) => (
              <Echo value={`${middleResult.value} + inner`} children={render} />
            )
          ]}
          children={results => <MyComponent results={results} />}
        />
      );

      expect(wrapper.find(Echo).length).toEqual(3);

      const outer = wrapper.childAt(0);
      expect(outer.prop('value')).toBe('outer');

      const middle = outer.childAt(0);
      expect(middle.prop('value')).toBe('outer + middle');

      const inner = middle.childAt(0);
      expect(inner.prop('value')).toBe('outer + middle + inner');

      expect(wrapper.find(MyComponent).prop('results')).toEqual([
        { value: 'outer' },
        { value: 'outer + middle' },
        { value: 'outer + middle + inner' }
      ]);
    });

    test('It enables composing with varying render prop names', () => {
      const wrapper = mount(
        <Composer
          components={[
            <Echo value="one" />,
            ({ render }) => <EchoRenderProp value="two" renderProp={render} />
          ]}
          children={results => <MyComponent results={results} />}
        />
      );

      expect(wrapper.find(MyComponent).prop('results')).toEqual([
        { value: 'one' },
        { value: 'two' }
      ]);
    });

    test('It enables composing with multi-argument producers', () => {
      const wrapper = mount(
        <Composer
          components={[
            <Echo value="one" />,
            // multi-argument producer
            ({ render }) => (
              <DoubleEcho value="two">
                {(one, two) => render([one, two])}
              </DoubleEcho>
            )
          ]}
          children={results => <MyComponent results={results} />}
        />
      );

      expect(wrapper.find(MyComponent).prop('results')).toEqual([
        { value: 'one' },
        ['two', 'TWO']
      ]);
    });
  });
});
