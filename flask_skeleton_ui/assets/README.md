# Frontend assets

Frontend dependencies are managed using `npm` and are tracked in `package.json`. These are pulled together by a [Gulp](http://gulpjs.com/) build process to generate the CSS output for this service.

------

## Building the frontend assets

The gulp build process is encapsulated in the `Gulpfile.js` in the root directory. This is a simple wrapper around [https://github.com/LandRegistry/land-registry-gulp-tasks](https://github.com/LandRegistry/land-registry-gulp-tasks) where the gulp tasks are stored. This is done for simplicity of keeping them up to date (Since they are simply a dependency of the project)

### Running the gulp tasks

The build tasks run inside the docker container. To run them you can either user `docker exec` to run a command inside the container, or more simply, just `bashin` to the container like `bashin your-app-name-here`. Once you are in the container, type `npm run build` to do a one off build of the assets.

Alternatively, you can type `npm run dev` if you are going to be working on the CSS/JS repeatedly. This will watch your files for changes and rebuild the assets as necessary. It will also start a "browsersync" server which will live-reload CSS changes. This is on port 3000 inside the docker container, but is mapped to another port outside the container. This should be done in your app's docker fragment.

### Overriding Gulp tasks

If you need to override the provided Gulp tasks, you can do so as follows. If you store a reference to the original task, you can call it in addition to your modifications if you wish.

```
var existingWatch = gulp.tasks.watch.fn

gulp.task('watch', function () {
  gulp.watch(path.join('src/**/*.scss'), ['sass', 'sass-lint'])
  gulp.watch(path.join('src/**/*.js'), ['js', 'standardjs'])
  existingWatch()
})
```

### Decoupling from the `land-registry-gulp-tasks` repository entirely

If you need to do anything "unusual" and decouple from the `land-registry-gulp-tasks`, you could copy these into your project and start modifying from there

1. Do a one off build by typing `npm run build`
2. Watch the SCSS and JS files and run a build every time they are updated by typing `npm run dev`

At the time of writing, the build does not run in the pipeline and must be run on the developer's laptop. This means that the build artefacts need to be committed into the repository. The following files would need to be committed in, but _should not be manually modified_

- `application/assets/dist/**/*.*`
- `application/templates/govuk_template.html` (This file is copied from the `govuk_template_jinja` module in `node_modules`. It is checked into the repository, but should not be modified manually.)

## Editing CSS and JS

Application specific frontend code is held in `application/assets/src` - this is the only place you should be manually editing files.

### JavaScript

The JavaScript is organised as a set of [ES6 modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and bundled for the browser using [Rollup](https://github.com/rollup/rollup). There is a single entry point / bundle (`main.js`) by default, but additional bundles will be created for each `.js` file directly inside the `javascripts` folder.

These top levels bundles can be used to `import` files from the `modules` subfolder, or from `node_modules` (Such as if you wish to include a module from https://npmjs.org/). Rollup is set up to import ES6 modules and CommonJS modules (via [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)). Additional plugins can be found at https://github.com/rollup/rollup/wiki/Plugins which can provide support for additional module types, transpilation etc.

### CSS (SCSS)

Similarly to the JavaScript, the files directly in the `scss` folder represent entry points / bundles, and they import files from the subdirectories. Additional entry points can be created as necessary, but no actual CSS should be written in them.

## Sourcemaps

Sourcemaps are generated for both the CSS and JS output, allowing devtools to map errors back to the original source files (rather than just "line 1, character 37948" of the output bundle).

See https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps#source_maps_in_devtools_sources_panel for info on how to enable these.

## Linting

Run `npm test` to run the linter.

JavaScript is linted with [standardjs](http://standardjs.com/) which is intentionally unconfigurable ([No semicolons - it's fine. Really!](https://github.com/feross/standard#the-rules)) This is gaining widespread adoption including by GOV.UK.

SCSS is linted with [sass-lint](https://github.com/sasstools/sass-lint) but is configured to disable some of the more onerous rules.
