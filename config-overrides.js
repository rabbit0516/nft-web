const webpack = require("webpack");


module.exports = function override(config) {
	// config.output.path += '/../../deploy/web';
	const fallback = config.resolve.fallback || {};
	Object.assign(fallback, {
		legacyNodePolyfills: false,
		crypto: require.resolve("crypto-browserify"),
		stream: require.resolve("stream-browserify"),
		// assert: require.resolve("assert"),
		http: require.resolve("stream-http"),
		https: require.resolve("https-browserify"),
		os: require.resolve("os-browserify"),
		url: require.resolve("url"),
		util: false,
		assert: false,
		
	});
	config.resolve.extensions = [".js", ".mjs", ".jsx", ".json", ".ts", ".tsx"];
	// config.resolve.modules = ['node_modules']
	config.resolve.fullySpecified = false

	
	config.resolve.fallback = {...fallback,
		'process/browser': require.resolve('process/browser')
	};
	config.plugins = (config.plugins || []).concat([
		new webpack.ProvidePlugin({
			process: "process/browser",
			Buffer: ["buffer", "Buffer"],
		}),
	]);
	return config;
};