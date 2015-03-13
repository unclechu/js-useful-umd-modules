/**
 * Exceptions
 *
 * @public
 * @name GetVal~exceptions
 * @type {Object.<Error>}
 * @prop {GetVal~IncorrectArgument} - Incorrect argument type for constructor
 * @prop {GetVal~RequiredArgumentKey} - Required argument key is not set or has incorrect type (for constructor)
 * @prop {GetVal~IncorrectKey} - Incorrect key type for get/set methods
 * @prop {GetVal~KeyIsNotExists} - Value not found by key
 * @prop {GetVal~RequiredIsNotSet} - Attempt to get value before all required values sets
 * @prop {GetVal~NoKeyInRequiredList} - Attempt to set required value by key that not in required list
 * @static
 * @readOnly
 */
@exceptions = @::exceptions = {}

@exceptions.IncorrectArgument = class extends Error
	(message, arg-name, arg-type, must-be) !->
		@name = \IncorrectArgument
		if message
			@message = message
		else
			@message = \Incorrect
			if arg-name then @message += " \"#{arg-name}\""
			@message += ' argument type'
			if arg-type then @message += ": \"#{arg-type}\""
			if must-be then @message += ", must be a(n) \"#{must-be}\""
			@message += \.
		@argName = arg-name
		@argType = arg-type
		@mustBe = must-be

@exceptions.RequiredArgumentKey = class extends Error
	(message, arg-name, key-name, key-type, key-must-be) !->
		@name = \RequiredArgumentKey
		if message
			@message = message
		else
			@message = \Incorrect
			if arg-name then @message += " \"#{arg-name}\""
			@message += ' argument key'
			if key-name then @message += " \"#{key-name}\""
			@message += ' type'
			if key-type then @message += ": \"#{key-type}\""
			if key-must-be then @message += ", must be a(n) \"#{key-must-be}\""
			@message += \.
		@argName = arg-name
		@keyName = key-name
		@keyType = key-type
		@keyMustBe = key-must-be

@exceptions.IncorrectKey = class extends Error
	(message, key-type) !->
		@name = \IncorrectKey
		if message
			@message = message
		else
			@message = 'Incorrect key type'
			if key-type then @message += " (\"#{key-type}\")"
			@message += ', must be a string.'
		@keyType = key-type

@exceptions.KeyIsNotExists = class extends Error
	(message, key) !->
		@name = \KeyIsNotExists
		if message
			@message = message
		else
			@message = \Key
			if key then @message += " \"#{key}\""
			@message += ' is not exists.'
		@key = key

@exceptions.RequiredIsNotSet = class extends Error
	(message, key) !->
		@name = \RequiredIsNotSet
		if message
			@message = message
		else
			@message = 'Required key is not set'
			if key then @message += ": \"#{key}\""
			@message += \.
		@key = key

@exceptions.NoKeyInRequiredList = class extends Error
	(message, key) !->
		@name = \NoKeyInRequiredList
		if message
			@message = message
		else
			@message = 'No key'
			if key then @message += " \"#{key}\""
			@message += ' in required list.'
		@key = key
