const production = process.env.NODE_ENV === 'production';

function babelOptions() {
  return {
    plugins: production ? ['transform-remove-console'] : [],
  };
}

module.exports = {
  mount: {
    // public directory를 root 경로로 지정, 시작 지점
    public: {url: '/', static: true},
    // 프로젝트 구조의 src 디렉토리, /dist에 넣어달라고 하는 것
    src: {url: '/dist'},
  },
  plugins: [
    ['@snowpack/plugin-svelte', {
      preprocess: require('svelte-preprocess')({
        scss: {
					prependData: '@import "./src/scss/main.scss";',
				},
				postcss: {
					plugins: [
						require('autoprefixer')()
					]
				},
        babel: babelOptions()
      })
    }], 
    ['@snowpack/plugin-babel', {
      transformOptions: babelOptions()
    }],
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-sass',
    '@snowpack/plugin-optimize'
  ],
  alias: {
    '~': './src'
  },
  routes: [
    /* Example: Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
