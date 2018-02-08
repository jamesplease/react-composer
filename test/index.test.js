import React from 'react';
import { shallow, mount } from 'enzyme';
import Composer from '../src';

// Does nothing other than render so that its props may be inspected
function MyComponent(props) {
  return <div>Inspect my props!</div>;
}

function Echo({ value, children }) {
  return children({ value });
}

function EchoRender({ value, render }) {
  return render({ value });
}

function DoubleEcho({ value, children }) {
  return children(value, value.toUpperCase());
}

describe('React Composer', () => {
  describe('Null values', () => {
    test('No props', () => {
      const wrapper = shallow(<Composer />);
      expect(wrapper.type()).toBe(null);
    });

    test('No render', () => {
      const wrapper = shallow(<Composer components={[]} />);
      expect(wrapper.type()).toBe(null);
    });
  });

  describe('Render, no components', () => {
    test('It should render the return from `children`', () => {
      const mockChildren = jest.fn(() => <div>Sandwiches</div>);

      const wrapper = shallow(<Composer children={mockChildren} />);
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

  describe('Render, three components; elements and functions', () => {
    test('It supports both elements and functions in props.components', () => {
      const wrapper = mount(
        <Composer
          components={[
            // Simple elements may be passed where previous results are not required.
            <Echo value="outer" />,

            // A function [element factory] may be passed that is invoked with
            // the currently accumulated results to produce an element.
            ([outerResult]) => {
              expect(outerResult).toEqual({ value: 'outer' });
              return <Echo value={`${outerResult.value} + middle`} />;
            },

            ([outerResult, middleResult]) => {
              // Assert within element factory to avoid insane error messages for failed tests :)
              expect(outerResult).toEqual({ value: 'outer' });
              expect(middleResult).toEqual({ value: 'outer + middle' });
              return <Echo value={`${middleResult.value} + inner`} />;
            }
          ]}
          children={results => <MyComponent results={results} />}
        />
      );

      expect(wrapper.find(Echo).length).toEqual(3);
      expect(wrapper.find(MyComponent).prop('results')).toEqual([
        { value: 'outer' },
        { value: 'outer + middle' },
        { value: 'outer + middle + inner' }
      ]);
    });
  });

  describe('Render, one component; custom `renderPropName`', () => {
    test('It should render the expected result', () => {
      const mockChildren = jest.fn(([result]) => <div>{result.value}</div>);

      const wrapper = mount(
        <Composer
          components={[<EchoRender value="spaghetti" />]}
          children={mockChildren}
          renderPropName="render"
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

  describe('Render, one component; `mapResult`', () => {
    test('It should render the expected result', () => {
      const mockChildren = jest.fn(([result]) => (
        <div>
          {result[0]} {result[1]}
        </div>
      ));

      const wrapper = mount(
        <Composer
          components={[<DoubleEcho value="spaghetti" />]}
          children={mockChildren}
          mapResult={function() {
            return Array.from(arguments);
          }}
        />
      );
      expect(wrapper.contains(<div>spaghetti SPAGHETTI</div>)).toBe(true);
      expect(mockChildren).toHaveBeenCalledTimes(1);
      expect(mockChildren.mock.calls[0]).toEqual([[['spaghetti', 'SPAGHETTI']]]);
    });
  });
});
