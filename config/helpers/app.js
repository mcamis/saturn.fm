/**
 * Path information about the project for use in the webpack config files.
 */

const fs = require("fs");
const path = require("path");

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  dist: resolveApp("dist"),
  favicon: resolveApp("public/favicon.ico"),
  htmlTemplate: resolveApp("public/index.html"),
  indexJs: resolveApp("src/index.js"),
  public: resolveApp("public"),
  root: appDirectory,
  src: resolveApp("src"),
  test: resolveApp("test"),
};
