const del = require('del');
const { src, dest, watch } = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const util = require('gulp-util');
const zip = require('gulp-zip');
const { createGulpEsbuild } = require('gulp-esbuild');

const copy = (): void => src(['src/**/*', '!src/*.json', '!src/*.ts']).pipe(dest('dist'));

const manifest = (): void => {
  const isFirefox = util.env.browser === 'firefox';
  const manifestVersion = isFirefox ? 'v2' : 'v3';

  return src(`./src/manifest-${manifestVersion}.json`)
    .pipe(rename('manifest.json'))
    .pipe(dest('./dist'));
};

const ts = (): void => {
  const isDev = util.env.env === 'development';
  const gulpEsbuild = createGulpEsbuild({ incremental: isDev });
  const baseSettings = {
    outdir: '.',
    platform: 'browser',
    bundle: true,
    minify: true,
    sourcemap: isDev ? 'inline' : false,
    sourcesContent: false,
  };

  return src('src/*.ts').pipe(gulpEsbuild(baseSettings)).pipe(plumber()).pipe(dest('dist'));
};

const buildTask = async (): Promise<void> => {
  await del(['dist']);
  await copy();
  await ts();
  await manifest();
};

const watchTask = async (): Promise<void> => {
  await del(['dist']);

  watch(['src/**/*', '!src/**/*.ts'], { ignoreInitial: false }, copy);
  watch(['src/**/*.ts'], { ignoreInitial: false }, ts);
  watch('src/*.json', { ignoreInitial: false }, manifest);
};

const compressTask = async (): Promise<void> => {
  await del(['release']);

  const isFirefox = util.env.browser === 'firefox';
  const currentManifest = require('./dist/manifest.json');
  const currentExtension = isFirefox ? 'xpi' : 'zip';

  return src('dist/**/*')
    .pipe(zip(`${currentManifest.version}.${currentExtension}`))
    .pipe(plumber())
    .pipe(dest('release'));
};

exports.build = buildTask;
exports.watch = watchTask;
exports.compress = compressTask;
