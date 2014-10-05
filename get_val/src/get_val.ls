/**
 * Provides class for getting value by key
 *
 * @version r9
 * @author Viacheslav Lotsmanov
 * @license AGPLv3 (https://github.com/unclechu/js-useful-umd-modules/blob/master/AGPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-umd-modules/|GitHub}
 */

/** @lends GetVal */

/**
 * @class
 * @public
 * @name GetVal
 * @param {Object} values - Key-value object of values
 * @param {Object} [required] - Key-value object to set required values
 * @returns {function} getWrapper - You can get value from example of class directly as by function
 */
class GetVal
	(values , required) ->

		# arguments validation

		# "values" arg
		if typeof values is not \object
			throw new @exceptions.IncorrectArgument null ,
				\values , typeof values , \object
		if typeof values.values is not \object
			throw new @exceptions.RequiredArgumentKey null ,
				\values , \values , typeof values.values , \object
		if typeof values.required is not \object
			throw new @exceptions.RequiredArgumentKey null,
				\values , \required , typeof values.required , \object

		# "required" arg
		if required and typeof required is not \object
			throw new @exceptions.IncorrectArgument null ,
				\required , typeof required , \object

		/**
		 * @private
		 * @name GetVal~_values
		 */
		@_values = values.values

		/**
		 * @private
		 * @name GetVal~_required
		 */
		@_required = values.required

		if required
			for key in required
				@set.call @ , key , required[key]

		get-wrapper = let self = @
			-> self.get.apply self , arguments

		get-wrapper.super = @

		return get-wrapper

	/**
	 * @private
	 * @method
	 * @name GetVal~_check-required
	 * @static
	 */
	_check-required: !->
		for i in @_required
			if @_required[i] not in @_values
				throw new @exceptions.RequiredIsNotSet null , @_required

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
	 */
	set: (key, val) !->
		found = false

		if typeof key is not \string
			throw new @exceptions.IncorrectKey null , typeof key

		for i in @_required
			if @_required[i] is key
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
	 * @returns {*} value - Value by key
	 */
	get: (key, ignore-required) ->
		if not ignore-required then @_check-required!

		if typeof key is not \string
			throw new @exceptions.IncorrectKey null , typeof key

		if key not in @_values
			throw new @exceptions.KeyIsNotExists null , key

		return @_values[key]

	/* @include exceptions.ls */

return GetVal
