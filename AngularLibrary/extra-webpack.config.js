const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        "test": /\.scss$|\.sass$/,
        "use": [
          {
            "loader": "sass-resources-loader",
            "options": {
              "resources": [
                // path.resolve(__dirname, 'projects/*/src/_global.scss'),
                path.resolve(__dirname, 'projects/lib/feature/global-scss/_global.scss')
              ]
            }
          }
        ]
      }
    ]
  }
};