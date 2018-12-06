/// <reference types="react" />

/**
 * Examples of type usage
 * 
 * The simplest case, where the render function is provided as children,
 * and is a unary function

    interface StringRenderAsChildrenProps {
        children?: (a: string) => React.ReactElement<any>;
    }
    const StringRenderAsChildren: React.SFC<
        StringRenderAsChildrenProps
    > = {} as any;

 * When the render function is provided as a render prop, use the form
 * ({ render }) => <Component render={render}

    interface StringRenderAsRenderProps {
        render?: (a: string) => React.ReactElement<any>;
    }
    const StringRenderAsRender: React.SFC<StringRenderAsRenderProps> = {} as any;

 * When the render function is non-unary

    interface StringNumberRenderAsChildrenProps {
        children?: (a: string, b: number) => React.ReactElement<any>;
    }
    const StringNumberRenderAsChildren: React.SFC<
        StringNumberRenderAsChildrenProps
    > = {} as any;


 * When the render function is non-unary, and also provided as a render prop,
 * instead of children

    interface StringNumberRenderAsRenderProps {
        render?: (a: string, b: number) => React.ReactElement<any>;
    }
    const StringNumberRenderAsRender: React.SFC<
        StringNumberRenderAsRenderProps
    > = {} as any;

/**
 * Type arguments provided to Composer are the types of the arguments
 * to the render functions for each respective component. If the function is
 * non-unary, e.g. (a: string, b: number) => Element, then use the Array tuple
 * form, i.e. [string, number]
 *
 * The components props is required to be the same length as the number of
 * type arguments, and will cause a compile error if not.
 *
 * When the ({ render }) => <Component render={render} /> form is used inside
 * the components array, then the type of render is correct for each element
 * in the array
 
    const Example = () => (
        <Composer<string, [string, number], string, [string, number]>
            components={[
                <StringRenderAsChildren />,
                <StringNumberRenderAsChildren />,
                ({ render }) => <StringRenderAsRender render={render} />,
                ({ render }) => <StringNumberRenderAsRender render={render} />
            ]}
        >
            {([string1, [string2, number2], string3, [string4, number4]]) => {
                // The injected arguments string1, string2 etc. should all
                // be typed correctly
                return null;
            }}
        </Composer>
    );
 */

/**
 * Functions of varying arity that are used to type the "render" in
 * an element in the components prop, when used as:
 * ({ render }) => <Element />
 */
type A1Render<T> = (props: T) => React.ReactElement<any>;
type A2Render<A, B> = (a: A, b: B) => React.ReactElement<any>;
type A3Render<A, B, C> = (a: A, b: B, c: C) => React.ReactElement<any>;
type A4Render<A, B, C, D> = (a: A, b: B, c: C, d: D) => React.ReactElement<any>;
type A5Render<A, B, C, D, E> = (
  a: A,
  b: B,
  c: C,
  d: D,
  e: E
) => React.ReactElement<any>;

/**
 * Convert array-tuples into functions of appropriate arity
 */
type RenderFn<T> = T extends [infer A, infer B, infer C, infer D, infer E]
  ? A5Render<A, B, C, D, E>
  : T extends [infer A, infer B, infer C, infer D]
  ? A4Render<A, B, C, D>
  : T extends [infer A, infer B, infer C]
  ? A3Render<A, B, C>
  : T extends [infer A, infer B]
  ? A2Render<A, B>
  : A1Render<T>;

/**
 * An element in the array passed to the components prop
 * Can either be a rendered element, or a function of the form
 * ({ render }) => <Element />
 */
type Component<T> =
  | React.ReactElement<T>
  | ((props: { render: RenderFn<T> }) => React.ReactElement<any>);

/**
 * In the absence of well-typed variadics, conditional types are used to
 * create an array-like type of the correct length
 */
type Components<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> = T10 extends void
  ? T9 extends void
    ? T8 extends void
      ? T7 extends void
        ? T6 extends void
          ? T5 extends void
            ? T4 extends void
              ? T3 extends void
                ? T2 extends void
                  ? T1 extends void
                    ? []
                    : [Component<T1>]
                  : [Component<T1>, Component<T2>]
                : [Component<T1>, Component<T2>, Component<T3>]
              : [Component<T1>, Component<T2>, Component<T3>, Component<T4>]
            : [
                Component<T1>,
                Component<T2>,
                Component<T3>,
                Component<T4>,
                Component<T5>
              ]
          : [
              Component<T1>,
              Component<T2>,
              Component<T3>,
              Component<T4>,
              Component<T5>,
              Component<T6>
            ]
        : [
            Component<T1>,
            Component<T2>,
            Component<T3>,
            Component<T4>,
            Component<T5>,
            Component<T6>,
            Component<T7>
          ]
      : [
          Component<T1>,
          Component<T2>,
          Component<T3>,
          Component<T4>,
          Component<T5>,
          Component<T6>,
          Component<T7>,
          Component<T8>
        ]
    : [
        Component<T1>,
        Component<T2>,
        Component<T3>,
        Component<T4>,
        Component<T5>,
        Component<T6>,
        Component<T7>,
        Component<T8>,
        Component<T9>
      ]
  : [
      Component<T1>,
      Component<T2>,
      Component<T3>,
      Component<T4>,
      Component<T5>,
      Component<T6>,
      Component<T7>,
      Component<T8>,
      Component<T9>,
      Component<T10>
    ];

/**
 * In the absence of well-typed variadics in TypeScript, generics
 * are used to create an array of the correct length based on the
 * provided type parameters.
 */
type InjectedArgs<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> = T10 extends void
  ? T9 extends void
    ? T8 extends void
      ? T7 extends void
        ? T6 extends void
          ? T5 extends void
            ? T4 extends void
              ? T3 extends void
                ? T2 extends void
                  ? T1 extends void
                    ? []
                    : [T1]
                  : [T1, T2]
                : [T1, T2, T3]
              : [T1, T2, T3, T4]
            : [T1, T2, T3, T4, T5]
          : [T1, T2, T3, T4, T5, T6]
        : [T1, T2, T3, T4, T5, T6, T7]
      : [T1, T2, T3, T4, T5, T6, T7, T8]
    : [T1, T2, T3, T4, T5, T6, T7, T8, T9]
  : [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10];

/**
 * components - the array of render-props components to aggregate
 * children - the aggregated render function
 */
interface ReactComposerProps<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
  components: Components<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>;
  children: (
    injected: InjectedArgs<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>
  ) => React.ReactElement<any> | null;
}

/**
 * The Composer component
 */
declare class Composer<
  T1 = void,
  T2 = void,
  T3 = void,
  T4 = void,
  T5 = void,
  T6 = void,
  T7 = void,
  T8 = void,
  T9 = void,
  T10 = void
> extends React.Component<
  ReactComposerProps<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>
> {}

export default Composer;
