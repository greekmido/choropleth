const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const serverOptions = {static:"./build",
                       client:{address:"localhost:55555"}};
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common,{
    mode:"development",
    watch:true,
    entry: ['webpack-plugin-serve/client'],
    plugins: [
      new Serve(serverOptions)
    ]
  })