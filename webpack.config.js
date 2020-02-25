const path = require('path');
const { DefinePlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const envDev = require('./env/development.env');
const envProd = require('./env/production.env');

const isProd = process.env.NODE_ENV === 'production';
const target = process.env.TARGET || 'all';

const getEnv = otherEnv => ({
  __IS_WEB__: false,
  __IS_NODE__: false,
  ENV: { ...isProd ? envProd : envDev },
  ...otherEnv
});


function getDataByTarget(node, webBrowser, webModule) {
  if (target === 'web:module') {
    return webModule;
  } else if (target === 'web:browser') {
    return webBrowser;
  } else if (target === 'node') {
    return node;
  }
}

const buildDir = getDataByTarget('build/node', 'build/web/browser', 'build/web/module');

const optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        warnings: false,
        compress: {
          comparisons: false,
          pure_funcs: ['console.log', 'console.info'],
        },
        parse: {},
        mangle: getDataByTarget(true, false, true),
        output: {
          comments: false,
          ascii_only: true,
        },
      },
      parallel: true,
      cache: true,
      sourceMap: false,
    }),
  ],
  nodeEnv: 'production',
};


const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
};

const prodConfig = {
  mode: 'production',
  performance: {
    hints: 'warning'
  },
  optimization
};

const baseConfig = {
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, buildDir),
  },
  module: {
    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      {
        test: /\.ts?$/,
        use: {
          loader: 'ts-loader',
          options: {
            compiler: 'ttypescript',
            compilerOptions: {
              outDir: path.resolve(__dirname, buildDir),
              plugins: [{ 'transform': 'typescript-transform-paths', 'afterDeclarations': true  }]
            }
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.wasm$/,
        use: {
          loader: 'file-loader',
        }
      }
    ]
  },
  plugins: [],
  resolve: {
    extensions: [ '.ts', '.js' ],
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@root': path.resolve(__dirname, './')
    }
  }
};

const nodeLib = {
  target: 'node',
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  plugins: [
    new DefinePlugin(getEnv({
      '__IS_NODE__': true
    }))
  ]
};

const webModuleLib = {
  target: 'web',
  node: {
    fs: 'empty'
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  plugins: [
    new DefinePlugin(getEnv({
      '__IS_WEB__': true
    })),
  ]
};


const browserLib = {
  target: 'web',
  node: {
    fs: 'empty'
  },
  output: {
    filename: 'index.js',
    library: 'incognitoJs',
    libraryTarget: 'umd',
  },
  plugins: [
    new DefinePlugin(getEnv({
      '__IS_WEB__': true
    })),
  ]
};



module.exports = function() {
  console.log('BUILD MODE:', isProd ? 'PRODUCTION' : 'DEVELOPMENT' );
  console.log('BUILD TARGET:', String(target).toUpperCase() );

  const commonConfig = merge(baseConfig, isProd ? prodConfig : devConfig);
  const targets = [];
  const webpackConfig = getDataByTarget(nodeLib, browserLib, webModuleLib);

  if (webpackConfig) {
    targets.push(merge(commonConfig, webpackConfig));
  } else {
    targets.push(
      merge(commonConfig, webModuleLib),
      merge(commonConfig, browserLib),
      merge(commonConfig, nodeLib)
    );
  }

  return [...targets];
};