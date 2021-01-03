const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  env: {
    PRISMIC_ENDPOINT: process.env.PRISMIC_ENDPOINT,
  },
};
