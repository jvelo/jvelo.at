export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string;
      name: string;
      possibleTypes: {
        name: string;
      }[];
    }[];
  };
}
const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: "UNION",
        name: "HomeBody",
        possibleTypes: [
          {
            name: "HomeBodyText",
          },
        ],
      },
      {
        kind: "UNION",
        name: "PageBody",
        possibleTypes: [
          {
            name: "PageBodyContent",
          },
        ],
      },
      {
        kind: "INTERFACE",
        name: "_Document",
        possibleTypes: [
          {
            name: "Home",
          },
          {
            name: "Page",
          },
        ],
      },
      {
        kind: "INTERFACE",
        name: "_Linkable",
        possibleTypes: [
          {
            name: "Home",
          },
          {
            name: "Page",
          },
          {
            name: "_ExternalLink",
          },
          {
            name: "_FileLink",
          },
          {
            name: "_ImageLink",
          },
        ],
      },
    ],
  },
};
export default result;
