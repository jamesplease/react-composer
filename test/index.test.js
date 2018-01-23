import React from 'react';
import { shallow, mount } from 'enzyme';
import Composer from '../src';

function Echo({ value, render }) {
  return render({ value });
}

function EchoChildren({ value, children }) {
  return children({ value });
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
    test('It should render the return from `render`', () => {
      const mockRender = jest.fn(() => <div>Sandwiches</div>);

      const wrapper = shallow(<Composer render={mockRender} />);
      expect(wrapper.contains(<div>Sandwiches</div>)).toBe(true);
      expect(mockRender).toHaveBeenCalledTimes(1);
      // The outer array represents all of the arguments passed to the
      // mock. The inner array is the empty array of `results` that
      // is passed as the first argument.
      expect(mockRender.mock.calls[0]).toEqual([[]]);
    });
  });

  describe('Render, one component', () => {
    test('It should render the expected result', () => {
      const mockRender = jest.fn(([result]) => <div>{result.value}</div>);

      const wrapper = mount(
        <Composer
          components={[<Echo value="spaghetti" />]}
          render={mockRender}
        />
      );
      expect(wrapper.contains(<div>spaghetti</div>)).toBe(true);
      expect(mockRender).toHaveBeenCalledTimes(1);
      expect(mockRender.mock.calls[0]).toEqual([
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
      const mockRender = jest.fn(([resultOne, resultTwo]) => (
        <div>
          {resultOne.value} {resultTwo.value}
        </div>
      ));

      const wrapper = mount(
        <Composer
          components={[<Echo value="spaghetti" />, <Echo value="pls" />]}
          render={mockRender}
        />
      );
      expect(wrapper.contains(<div>spaghetti pls</div>)).toBe(true);
      expect(mockRender).toHaveBeenCalledTimes(1);
      expect(mockRender.mock.calls[0]).toEqual([
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

  describe('Render, one component; custom `renderPropName`', () => {
    test('It should render the expected result', () => {
      const mockRender = jest.fn(([result]) => <div>{result.value}</div>);

      const wrapper = mount(
        <Composer
          components={[<EchoChildren value="spaghetti" />]}
          render={mockRender}
          renderPropName="children"
        />
      );
      expect(wrapper.contains(<div>spaghetti</div>)).toBe(true);
      expect(mockRender).toHaveBeenCalledTimes(1);
      expect(mockRender.mock.calls[0]).toEqual([
        [
          {
            value: 'spaghetti'
          }
        ]
      ]);
    });
  });
});
