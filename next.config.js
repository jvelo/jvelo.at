const dotenv = require("dotenv");
dotenv.config();

const withMDX = require("@next/mdx")();
module.exports = withMDX({
  env: {
    PRISMIC_ENDPOINT: process.env.PRISMIC_ENDPOINT,
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
});
