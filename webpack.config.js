const { merge } = require('webpack-merge');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { getPkgVersion } = require('./get-pkg-version');
const deps = require('./package.json').dependencies;
module.exports = (envVars) => {
  // common webpack utils
  const common = {
    devtool: false,
    mode: 'development',
    entry: path.resolve(__dirname, './src/index.tsx'),
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: ['@babel/transform-class-properties', 'babel-plugin-styled-components'],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          use: 'url-loader',
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: 'asset/inline',
        },
        {
          oneOf: [
            {
              test: /\.m?js$/,
              resolve: {
                fullySpecified: false,
              },
            },
          ],
        },
        { test: /\.txt$/, use: 'raw-loader' },
      ],
    },
    resolveLoader: {
      modules: [path.join(__dirname, './node_modules'), 'node_modules'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
      }),
      new webpack.ProvidePlugin({
        React: 'react',
        '@feature-hub/react': '@feature-hub/react',
        'styled-components': 'styled-components',
      }),
      new webpack.DefinePlugin({
        'process.env.REACT_VERSION': JSON.stringify(getPkgVersion('react')),
        'process.env.FEATURE_HUB_REACT_VERSION': JSON.stringify(
          getPkgVersion('@feature-hub/react'),
        ),
      }),
    ],
    stats: 'errors-only',
  };
  const { env } = envVars;

  //   dev mode for development/demo
  const devConfig = () => {
    return {
      mode: 'development',
      devServer: {
        hot: true,
        open: true,
        port: 4200,
      },
      plugins: [
        new ReactRefreshWebpackPlugin(),
        new webpack.DefinePlugin({
          'process.env.name': JSON.stringify('Vishwas'),
        }),
      ],
    };
  };

  //   build modern feature app to be integrated into featureHub container
  const featueHubFeatureAppBuilder = () => {
    return {
      mode: 'development',
      entry: path.join(__dirname, './src/app/AppDefinition.tsx'), // define an entry point of your micro app
      externals: {
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
          eager: true,
        },
        '@feature-hub/react': {
          eager: true,
          singleton: true,
          strictVersion: true,
          requiredVersion: '^3.6.0',
        },
        eager: true,
      }, // define your feature App external libraries,
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist/fa'), // define output path for your feature App build
        sourceMapFilename: '[name].[hash:8].map',
        chunkFilename: '[id].[hash:8].js',
        libraryTarget: 'umd',
      },
      plugins: [
        new webpack.container.ModuleFederationPlugin({
          name: '__feature_hub_feature_app_module_container__',
          exposes: {
            featureAppModule: path.join(__dirname, './src/app/AppDefinition.tsx'),
          }, // define feature App to be exposed
          shared: {
            react: { singleton: true, eager: true }, // add more shared libraries with your integrator
          },
        }),
      ],
    };
  };

  //   Build modern feature app entry index to be hosted as an application
  const modernFederatedFeatureApp = () => {
    return {
      mode: 'production',
      entry: {
        main: path.join(__dirname, './src/index.tsx'),
      },
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist/modern'),
        sourceMapFilename: '[name].[hash:8].map',
        chunkFilename: '[id].[hash:8].js',
      },
    };
  };

  //   switch method to switch between builds
  switch (env) {
    case 'fa':
      return merge(common, featueHubFeatureAppBuilder());
    case 'fa-modern':
      return merge(common, modernFederatedFeatureApp());
    default:
      return merge(common, devConfig());
  }
};
