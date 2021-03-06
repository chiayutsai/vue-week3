const srcPath = './app'
const distPath = './dist'
const nodePath = './node_modules'

let envOptions = {
  string: 'env',
  default: {
    env: 'dev',
  },
  conyFile: {
    src: [
      `${srcPath}/**/*`,
      `!${srcPath}/assets/js/**/*.js`,
      `!${srcPath}/assets/style/**/*.scss`,
      `!${srcPath}/assets/style/**/*.sass`,
      `!${srcPath}/**/*.ejs`,
      `!${srcPath}/**/*.html`,
    ],
    path: distPath,
  },
  html: {
    src: [`${srcPath}/**/*.html`],
    ejsSrc: [`${srcPath}/**/*.ejs`],
    path: distPath,
  },
  style: {
    src: [`${srcPath}/assets/style/**/*.scss`, `${srcPath}/assets/style/**/*.sass`],
    path: `${distPath}/assets/style`,
  },
  loginjavascript: {
    src: [`${srcPath}/assets/js/all.js`],
    concat: 'all.js',
    path: `${distPath}/assets/js`,
  },
  backjavascript: {
    src: [`${srcPath}/assets/js/main.js`],
    concat: 'main.js',
    path: `${distPath}/assets/js`,
  },
  vendors: {
    src: [`${nodePath}/jquery/dist/**/jquery.min.js`, `${nodePath}/bootstrap/dist/js/bootstrap.min.js`],
    concat: 'vendors.js',
    path: `${distPath}/assets/js`,
  },

  img: {
    src: [`${srcPath}/assets/images/**/*`],
  },
  clean: {
    src: distPath,
  },
  browserDir: distPath,
  deploySrc: `${distPath}/**/*`,
}

exports.envOptions = envOptions
