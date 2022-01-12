module.exports = {
  options: {
    // buildType: 'spa',
    enableBabelCache: false,
  },
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    // Ignore fs dependencies so we can use winston
    if (opts.env.target === 'node' && !opts.env.dev) {
      config.resolve.fallback.fs = false;
    }

    config.performance = {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    };

    return config;
  },
  plugins: ['scss'],
};
