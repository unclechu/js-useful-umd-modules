require! {
	path

	gulp

	clean: \gulp-clean
	tasks: \gulp-task-listing
	rename: \gulp-rename
	ls: \gulp-livescript
	uglify: \gulp-uglify
	umd: \gulp-umd
	gulpif: \gulp-if
	preprocess: \gulp-preprocess

	pkg: \./package.json
}

gulp.task \help tasks

build-list = pkg.buildList

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

build-cb = (name, pub-name, ugly=false) ->
	gulp.src path.join name , \src , name + \.ls
		# preprocessor uses html comments by default, need js comments
		.pipe rename name + \.js
		.pipe preprocess context: {}
		.pipe rename name + \.ls # rename back to .ls extension
		.pipe ls bare: true
		.pipe umd namespace: (file) -> pub-name
		.pipe rename name + \.js
		.pipe gulpif ugly , uglify preserveComments: 'some'
		.pipe gulpif ugly , rename name + \-min.js
		.pipe gulp.dest name

build-list.forEach (item) !->
	name = item.fileName
	pub-name = item.pubName

	# build livescript to javascript (also minificated)

	gulp.task \clean- + name , ->
		gulp.src( path.join name , name + \.js ) .pipe clean!
	gulp.task \clean- + name + \-min , ->
		gulp.src( path.join name , name + \-min.js ) .pipe clean!

	clean-tasks.push \clean- + name
	clean-tasks.push \clean- + name + \-min

	gulp.task name , [ \clean- + name ] , ->
		build-cb name , pub-name
	gulp.task name + \-min , [ \clean- + name + \-min ] , ->
		build-cb name , pub-name , true

	build-tasks.push name
	build-tasks.push name + \-min

	if item.docs

		# html docs

		gulp.task \clean-docs-html- + name , ->
			gulp.src( path.join name , \docs , \html ) .pipe clean!
		gulp.task \docs-html- + name , [ \clean-docs-html- + name , name ] , ->
			jsdoc = require \gulp-jsdoc
			dest = path.join name , \docs , \html
			options =
				showPrivate : true
				outputSourceFiles : false
			template =
				footer: ''
			gulp.src path.join name , name + \.js
				.pipe jsdoc dest , template , null , options

		clean-jsdoc-tasks.push \clean-docs-html- + name
		jsdoc-tasks.push \docs-html- + name

		# md docs

		gulp.task \clean-docs-md- + name , ->
			gulp.src( path.join name , \docs , \md ) .pipe clean!
		gulp.task \docs-md- + name , ->
			jsdoc2md = require \gulp-jsdoc-to-markdown
			dest = path.join name , \docs , \md
			gulp.src path.join name , name + \.js
				.pipe jsdoc2md \private : true
				.pipe rename (path) !->
					path.extname = \.md
				.pipe gulp.dest dest

		clean-jsdoc-tasks.push \clean-docs-html- + name
		jsdoc-tasks.push \docs-html- + name

		# both docs

		gulp.task \clean-docs- + name , [
			\clean-docs-html- + name
			\clean-docs-md- + name
		]
		gulp.task \docs- + name , [
			\clean-docs- + name
			\docs-html- + name
			\docs-md- + name
		]

		clean-docs-tasks.push \clean-docs- + name
		docs-tasks.push \docs- + name

	if item.test
		gulp.task \test- + name , [name] , ->
			mocha = require \gulp-mocha
			gulp.src path.join( name , \test , \test.ls ) , read : false
				.pipe mocha!
		test-tasks.push \test- + name

gulp.task \clean clean-tasks
gulp.task \build build-tasks

# docs
gulp.task \clean-docs-html clean-jsdoc-tasks
gulp.task \docs-html jsdoc-tasks
gulp.task \clean-docs-md clean-jsdoc2md-tasks
gulp.task \docs-md jsdoc2md-tasks
gulp.task \clean-docs clean-docs-tasks
gulp.task \docs docs-tasks

gulp.task \test test-tasks

default-tasks.push \build

gulp.task \default default-tasks
