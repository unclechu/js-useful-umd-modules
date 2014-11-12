require! {
	path

	gulp

	del
	\gulp-task-listing : tasks
	\gulp-rename : rename
	\gulp-livescript : ls
	\gulp-uglify : uglify
	'./gulp-umd' : umd
	\gulp-if : gulpif
	\gulp-preprocess : preprocess
}

pkg = require path.join process.cwd() , './package.json'

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

build-cb = (name, pub-name, mode=null) ->
	gulp.src path.join name , \src , name + \.ls
		# preprocessor uses html comments by default, need js comments
		.pipe rename name + \.js
		.pipe preprocess context: {}
		.pipe rename name + \.ls # rename back to .ls extension
		.pipe gulpif mode is not \ls , ls bare: true
		.pipe gulpif mode is not \ls , umd {
			namespace: (file) -> pub-name
			defaultIndentValue: '  '
		}
		.pipe rename name + \.js
		.pipe gulpif mode is \ugly , uglify preserveComments: 'some'
		.pipe gulpif mode is \ugly , rename name + \-min.js
		.pipe gulpif mode is \ls , umd {
			namespace: (file) -> pub-name
			defaultIndentValue: '  '
			template: path.join \_dev , \umd_template_1.3.ls
			indent: '\t'
		}
		.pipe gulpif mode is \ls , rename name + \.ls
		.pipe gulp.dest name

build-list.forEach (item) !->
	name = item.fileName
	pub-name = item.pubName

	# build livescript to javascript (also minificated)

	gulp.task \clean- + name , (cb) ->
		del path.join( name , name + \.ls ) , cb
	gulp.task \clean- + name + \-js , (cb) ->
		del path.join( name , name + \.js ) , cb
	gulp.task \clean- + name + \-js-min , (cb) ->
		del path.join( name , name + \-min.js ) , cb

	clean-tasks.push \clean- + name
	clean-tasks.push \clean- + name + \-js
	clean-tasks.push \clean- + name + \-js-min

	gulp.task name, [ \clean- + name ] , ->
		build-cb name , pub-name , \ls
	gulp.task name + \-js, [ \clean- + name + \-js ] , ->
		build-cb name , pub-name
	gulp.task name + \-js-min , [ \clean- + name + \-js-min ] , ->
		build-cb name , pub-name , \ugly

	build-tasks.push name
	build-tasks.push name + \-js
	build-tasks.push name + \-js-min

	if item.docs

		# html docs

		gulp.task \clean-docs-html- + name , (cb) ->
			del path.join( name , \docs , \html ) , cb
		gulp.task \docs-html- + name , [
			\clean-docs-html- + name
			name + \-js
		] , ->
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

		gulp.task \clean-docs-md- + name , (cb) ->
			del path.join( name , \docs , \md ) , cb
		gulp.task \docs-md- + name , [
			\clean-docs-md- + name
			name + \-js
		] , ->
			jsdoc2md = require \gulp-jsdoc-to-markdown
			dest = path.join name , \docs , \md
			gulp.src path.join name , name + \.js
				.pipe jsdoc2md \private : true
				.pipe rename (path) !->
					path.extname = \.md
				.pipe gulp.dest dest

		clean-jsdoc2md-tasks.push \clean-docs-md- + name
		jsdoc2md-tasks.push \docs-md- + name

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
		gulp.task \test- + name , [ name , name + \-js ] , ->
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
