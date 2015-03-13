/**
 * Exceptions
 *
 * @public
 * @name DynamicAPI~exceptions
 * @type {Object.<Error>}
 * @prop {DynamicAPI~IncorrectArgument}
 * @prop {DynamicAPI~RequiredArgument}
 * @prop {DynamicAPI~ItemNotFound} - Can't find item in loaded list
 * @prop {DynamicAPI~GlobalNameAlreadyTaken} - Global name is already taken
 * @static
 * @readOnly
 */
@exceptions = @::exceptions = {}

@exceptions.IncorrectArgument = class extends Error
	({
		message = null
		arg-name = null
		arg-type = null
		must-be = null
	}) !->
		@name = \IncorrectArgument
		if message?
			@message = message
		else
			@message = \Incorrect \
				+ (if arg-name? then " \"#{arg-name}\"" else '') \
				+ ' argument type' \
				+ (if arg-type? then ": \"#{arg-type}\"" else '') \
				+ (if must-be? then ", must be a(n) \"#{must-be}\"" else '') \
				+ \.
		@arg-name = arg-name
		@arg-type = arg-type
		@must-be = must-be

@exceptions.RequiredArgument = class extends Error
	({
		message = null
		arg-name = null
	}) !->
		@name = \RequiredArgument
		if message?
			@message = message
		else
			@message = \Argument \
				+ (if arg-name? then " \"#{arg-name}\"" else '') \
				+ ' is required.'
		@arg-name = arg-name

@exceptions.ItemNotFound = class extends Error
	({
		message = null
		script-path = null
	}) !->
		@name = \ItemNotFound
		if message?
			@message = message
		else
			@message = 'Cannot get item by script path' \
				+ (if script-path? then ": \"#{script-path}\"" else '') \
				+ \.
		@script-path = script-path

@exceptions.GlobalNameAlreadyTaken = class extends Error
	({
		message = null
		global-name = null
	}) !->
		@name = \Timeout
		if message?
			@message = message
		else
			@message = 'Global name ' \
				+ (if global-name? then "\"#{global-name}\" " else '') \
				+ 'is already taken.'
		@global-name = global-name
