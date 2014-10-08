/**
 * Provides class for getting value by key
 *
 * @module get_val
 * @version r9
 * @author Viacheslav Lotsmanov
 * @license AGPLv3
 * @see {@link https://github.com/unclechu/js-useful-umd-modules/|GitHub}
 * @see {@link https://github.com/unclechu/js-useful-umd-modules/blob/master/AGPLv3-LICENSE|License}
 */

/** @lends GetVal */

/**
 * @class
 * @public
 * @name GetVal
 * @param {!Object.<*>} values - Key-value object of values
 * @param {?Object.<*>} [required] - Key-value object to set required values
 * @returns {function} "get" method wrapper (you can get value from example of class directly as by function)
 *
 * @throws {GetVal~IncorrectArgument}
 * @throws {GetVal~RequiredArgumentKey}
 */
class GetVal
	(values , required=null) ->

		# arguments validation

		is-array = (arg) ->
			return Object.prototype.toString.call(arg) is '[object Array]'

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
		if not is-array values.required
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
		@_required = values.required

		if required
			for key of required
				@set.call @ , key , required[key]

		get-wrapper = let self = @
			-> self.get.apply self , arguments

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

	/* @include exceptions.ls */

return GetVal
