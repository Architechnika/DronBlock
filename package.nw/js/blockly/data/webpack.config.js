const ClosureCompiler = require('google-closure-compiler-js').webpack;
const path = require('path');

module.exports = {
  entry: [
    path.join(__dirname, 'union.js')
  ],
  output: {
    path: path.join(__dirname),
    filename: 'union.min.js'
  },
  plugins: [
    new ClosureCompiler({
      options: {
        languageIn: 'ECMASCRIPT6',
        languageOut: 'ECMASCRIPT5_STRICT',
//        compilationLevel: 'SIMPLE',
//        warningLevel: 'VERBOSE',
      },
    })
  ]
};