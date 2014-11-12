let
	init = (root, factory) !->
		if typeof define is \function and define.amd
			define factory
		else if typeof exports is \object
			module.exports = factory!
		else
			root.GetVal = factory!
	init this , ->
		/**
		 * Provides class for getting value by key
		 *
		 * @module get_val
		 * @version r11
		 * @author Viacheslav Lotsmanov
		 * @license GNU/AGPLv3
		 * @see {@link https://github.com/unclechu/js-useful-umd-modules/|GitHub}
		 * @see {@link https://github.com/unclechu/js-useful-umd-modules/blob/master/AGPLv3-LICENSE|License}
		 */

		/** @lends GetVal */

		/**
		 * @typedef {!Object.<Object|Array>} GetVal~valuesArg
		 * @prop {!Object.<*>} values - Values key-val object
		 * @prop {?Array.<string>} [required] - Array of required keys
		 */

		/**
		 * @class
		 * @public
		 * @name GetVal
		 * @param {GetVal~valuesArg} values - Key-value object of values
		 * @param {?Object.<*>} [required] - Key-value object to set required values at instance creating
		 * @returns {function} "get" method wrapper (you can get value from example of class directly as by function)
		 *
		 * @throws {GetVal~IncorrectArgument}
		 * @throws {GetVal~RequiredArgumentKey}
		 */
		class GetVal
			(values , required=null) ->

				# arguments validation

				is-array = (arg) ->
					Object.prototype.toString.call(arg) is '[object Array]'

				# "values" arg
				if typeof values is not \object
					throw new @exceptions.IncorrectArgument null ,
						\values , typeof values , \object
				if typeof values.values is not \object
					throw new @exceptions.RequiredArgumentKey null ,
						\values , \values , typeof values.values , \object
				if is-array values.values
					throw new @exceptions.RequiredArgumentKey null ,
						\values , \values , \array , \object
				if values.required and not is-array values.required
					throw new @exceptions.RequiredArgumentKey null,
						\values , \required , typeof values.required , \array

				# "required" arg
				if required and typeof required is not \object
					throw new @exceptions.IncorrectArgument null ,
						\required , typeof required , \object

				/**
				 * @private
				 * @name GetVal~_values
				 * @type {!Object.<*>}
				 */
				@_values = values.values

				/**
				 * @private
				 * @name GetVal~_required
				 * @type {Array.<string>}
				 */
				@_required = values.required or []

				if required
					for key of required
						@set.call @ , key , required[key]

				get-wrapper = let self = @
					-> self.get.apply self , arguments

				# additional wrapper for "set" method
				get-wrapper.set = let self = @
					-> self.set.apply self , arguments

				/**
				 * Link to class example for "get" method wrapper
				 *
				 * @public
				 * @name GetVal~super
				 * @type {GetVal}
				 */
				get-wrapper.super = @

				return get-wrapper

			/**
			 * @private
			 * @method
			 * @name GetVal~_check-required
			 * @static
			 *
			 * @throws {GetVal~RequiredIsNotSet}
			 */
			_check-required: !->
				for item in @_required
					if item not of @_values
						throw new @exceptions.RequiredIsNotSet null , item

			/**
			 * Set value by key
			 * (only for "required" keys)
			 *
			 * @public
			 * @method
			 * @name GetVal~set
			 * @static
			 * @param {string} key - Key that in "required" list
			 * @param {*} val - Value that can be got in the future by "key"
			 *
			 * @throws {GetVal~IncorrectKey}
			 * @throws {GetVal~NoKeyInRequiredList}
			 */
			set: (key, val) !->
				found = false

				if typeof key is not \string
					throw new @exceptions.IncorrectKey null , typeof key

				for item in @_required
					if item is key
						found = true

				if not found
					throw new @exceptions.NoKeyInRequiredList null , key

				@_values[key] = val

			/**
			 * Get value by key
			 *
			 * @public
			 * @method
			 * @name GetVal~get
			 * @static
			 * @param {string} key - Get value by this key
			 * @param {boolean} ignoreRequired - Get value even if all required values is not setted yet
			 * @returns {*} Value by key
			 *
			 * @throws {GetVal~RequiredIsNotSet}
			 * @throws {GetVal~IncorrectKey}
			 * @throws {GetVal~KeyIsNotExists}
			 */
			get: (key, ignore-required) ->
				if not ignore-required then @_check-required!

				if typeof key is not \string
					throw new @exceptions.IncorrectKey null , typeof key

				if key not of @_values
					throw new @exceptions.KeyIsNotExists null , key

				return @_values[key]

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
			@exceptions = @prototype.exceptions = {}

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


		return GetVal

		Get_val
