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
	jsdoc: \gulp-jsdoc
	jsdoc2md: \jsdoc-to-markdown
	preprocess: \gulp-preprocess

	pkg: \./package.json
}

gulp.task \help tasks

build-list = pkg.buildList

default-tasks = []
clean-tasks = []
build-tasks = []
jsdoc-tasks = []
clean-jsdoc-tasks = []

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

	gulp.task \clean- + name , ->
		gulp.src path.join name , name + \.js .pipe clean!
	gulp.task \clean- + name + \-min , ->
		gulp.src path.join name , name + \-min.js .pipe clean!

	clean-tasks.push \clean- + name
	clean-tasks.push \clean- + name + \-min

	gulp.task name , [ \clean- + name ] , ->
		build-cb name , pub-name
	gulp.task name + \-min , [ \clean- + name + \-min ] , ->
		build-cb name , pub-name , true

	build-tasks.push name
	build-tasks.push name + \-min

	gulp.task \clean-jsdoc- + name , ->
		gulp.src path.join name , \doc , \jsdoc .pipe clean!
	gulp.task \jsdoc- + name , [ \clean-jsdoc- + name , name ] , ->
		dest = path.join name , \doc , \jsdoc
		options =
			showPrivate : true
			outputSourceFiles : false
		gulp.src path.join name , name + \.js
			.pipe jsdoc dest , null , null , options

	clean-jsdoc-tasks.push \clean-jsdoc- + name
	jsdoc-tasks.push \jsdoc- + name

gulp.task \clean clean-tasks
gulp.task \build build-tasks
gulp.task \clean-jsdoc clean-jsdoc-tasks
gulp.task \jsdoc jsdoc-tasks

default-tasks.push \build

gulp.task \default default-tasks
