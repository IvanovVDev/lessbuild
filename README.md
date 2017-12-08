# lessbuild
 Compiles all less files in given directory to css recursively. Resulting CSS file will be placed in the same folder with the same name.

Example:

var lessBuilder = require('rg-less-builder');

lessBuilder.build("./css", [".", "./css"]);
