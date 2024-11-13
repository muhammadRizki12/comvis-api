const serverless = require("serverless-http");

const app = require("../../src/index");

// Ekspor handler serverless
module.exports.handler = serverless(app);
