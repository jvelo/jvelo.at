const dotenv = require("dotenv");
dotenv.config();

const withMDX = require("@next/mdx")();
module.exports = withMDX({
  env: {
    PRISMIC_ENDPOINT: process.env.PRISMIC_ENDPOINT,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    domains: ["pbs.twimg.com"],
  },
});
