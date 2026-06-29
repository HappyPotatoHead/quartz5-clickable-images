export interface Options {
  minScaleFactor?: number;
  maxScaleFactor?: number;
  borderRadius?: string;
}

export const defaultOptions: Required<Options> = {
  minScaleFactor: 1.5,
  maxScaleFactor: 3,
  borderRadius: "8px",
};

// export interface ExampleTransformerOptions {
//   /** Token used to highlight text, defaults to ==highlight== */
//   highlightToken: string;
//   /** Add a CSS class to all headings in the rendered HTML. */
//   headingClass: string;
//   /** Enable remark-gfm for tables/task lists. */
//   enableGfm: boolean;
//   /** Enable adding slug IDs to headings. */
//   addHeadingSlugs: boolean;
// }
