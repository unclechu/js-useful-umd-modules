require! {
	path

	gulp

	del
	\gulp-task-listing : tasks
	\gulp-rename : rename
	\gulp-livescript : ls
	\gulp-uglify : uglify
	\gulp-if : gulpif
	\gulp-preprocess : preprocess
	\gulp-wrapper : wrapper
}

pkg = require path.resolve process.cwd!, \./package.json

gulp.task \help tasks

build-list = pkg.build-list

default-tasks = []
clean-tasks = []
build-tasks = []

# docs tasks
clean-jsdoc-tasks = []
jsdoc-tasks = []
clean-jsdoc2md-tasks = []
jsdoc2md-tasks = []
clean-docs-tasks = []
docs-tasks = []

test-tasks = []

build-cb = (name, pub-name, {
	mode = null
	deps-amd = []
	deps-cjs = []
	deps-global = []
	global-name = null
	deps-vars = []
}) ->
	throw new Error '"global-name" is required' unless global-name?
	deps-amd = deps-amd |> (.map -> "'#{it}'") |> (* ', ')
	deps-cjs = deps-cjs |> (.map -> "require('#{it}')") |> (* ', ')
	deps-global = deps-global |> (.map -> "root.#it") |> (* ', ')
	deps-vars = deps-vars |> (* ', ')
	gulp.src path.join name, \src, "#{name}.ls"
		# preprocessor uses html comments by default, need js comments
		.pipe rename "#{name}.js"
		.pipe preprocess context: {}
		.pipe rename "#{name}.ls" # rename back to .ls extension
		.pipe ls bare: true
		.pipe rename "#{name}.js"
		.pipe wrapper do
			header: "
				(function(root, factory) {\n
				\  if (typeof define === 'function' && define.amd) {\n
				\    // AMD. Register as an anonymous module.\n
				\    define([#{deps-amd}], factory);\n
				\  } else if (typeof exports === 'object') {\n
				\    // CommonJS\n
				\    module.exports = factory(#{deps-cjs});\n
				\  } else {\n
				\    // Browser globals\n
				\    root.#{global-name} = factory(#{deps-global});\n
				\  }\n
				}(this, function(#{deps-vars}) {\n\n
			"
			footer: "\n\n}));"
		.pipe gulpif mode is \ugly, uglify preserve-comments: \some
		.pipe gulpif mode is \ugly, rename "#{name}.min.js"
		.pipe gulp.dest name

build-list.for-each (item) !->
	{file-name: name, pub-name, deps-AMD, deps-CJS, deps-global, deps-vars} = item

	build-opts =
		global-name: pub-name
		deps-amd: deps-AMD
		deps-cjs: deps-CJS
		deps-global: deps-global
		deps-vars: deps-vars

	# build livescript to javascript (also minificated)

	gulp.task "clean-#{name}", (cb) ->
		del (path.join name, "#{name}.js"), cb
	gulp.task "clean-#{name}-min", (cb) ->
		del (path.join name, "#{name}.min.js"), cb

	["clean-#{name}", "clean-#{name}-min"].for-each !-> clean-tasks.push it

	gulp.task "#{name}", ["clean-#{name}"], ->
		build-cb name, pub-name, build-opts
	gulp.task "#{name}-min", ["clean-#{name}-min"], ->
		build-cb name, pub-name, {} <<<< build-opts <<<< (mode: \ugly)

	["#{name}", "#{name}-min"].for-each !-> build-tasks.push it

	if item.docs

		# html docs

		gulp.task "clean-docs-html-#{name}", (cb) ->
			del (path.join name, \docs, \html), cb
		gulp.task "docs-html-#{name}", ["clean-docs-html-#{name}", "#{name}"], ->
			require! \gulp-jsdoc : jsdoc
			dest = path.join name, \docs, \html
			options =
				show-private: yes
				output-source-files: no
			template = footer: ''
			gulp.src path.join name, "#{name}.js"
				.pipe jsdoc dest, template, null, options

		clean-jsdoc-tasks.push "clean-docs-html-#{name}"
		jsdoc-tasks.push "docs-html-#{name}"

		# md docs

		gulp.task "clean-docs-md-#{name}", (cb) ->
			del (path.join name, \docs, \md), cb
		gulp.task "docs-md-#{name}", ["clean-docs-md-#{name}", "#{name}"], ->
			require! \gulp-jsdoc-to-markdown : jsdoc2md
			dest = path.join name, \docs, \md
			gulp.src path.join name, "#{name}.js"
				.pipe jsdoc2md private: true
				.pipe rename (path) !-> path.extname = \.md
				.pipe gulp.dest dest

		clean-jsdoc2md-tasks.push "clean-docs-md-#{name}"
		jsdoc2md-tasks.push "docs-md-#{name}"

		# both docs

		gulp.task "clean-docs-#{name}", [
			"clean-docs-html-#{name}"
			"clean-docs-md-#{name}"
		]
		gulp.task "docs-#{name}", [
			"clean-docs-#{name}"
			"docs-html-#{name}"
			"docs-md-#{name}"
		]

		clean-docs-tasks.push "clean-docs-#{name}"
		docs-tasks.push "docs-#{name}"

	if item.test
		gulp.task "test-#{name}", [name], ->
			require! \gulp-mocha : mocha
			gulp.src (path.join name, \test, \test.ls), read: false
				.pipe mocha!
		test-tasks.push "test-#{name}"

default-tasks.push \build

tasks =
	\clean : clean-tasks
	\build : build-tasks

	# docs
	\clean-docs-html : clean-jsdoc-tasks
	\docs-html : jsdoc-tasks
	\clean-docs-md : clean-jsdoc2md-tasks
	\docs-md : jsdoc2md-tasks
	\clean-docs : clean-docs-tasks
	\docs : docs-tasks

	\test : test-tasks

	\default : default-tasks

for k,v of tasks then gulp.task k, v
