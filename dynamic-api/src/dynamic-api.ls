/**
 * Dynamic API loader class
 *
 * @description Loads script by URL and waits for global variable
 * @module dynamic-api
 * @version 1.0.0
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/unclechu/js-useful-umd-modules/|GitHub}
 * @see {@link https://github.com/unclechu/js-useful-umd-modules/blob/master/AGPLv3-LICENSE|License}
 */

/** @lends DynamicAPI */

class DynamicAPI

	/**
	 * @typedef {Object} DynamicAPI~_toLoadList_type
	 * @prop {String} scriptPath - API script URL
	 * @prop {Boolean} [loaded=false] - Loaded flag
	 * @prop {Number} [timerId=null] - Loaded waiter timer ID
	 * @prop {String} varName - Global variable name to wait
	 * @prop {Array.<Function>} [cb] - Callbacks to run after script load or to run immidiately if script is already loaded
	 */

	/**
	 * Loaded list
	 *
	 * @name DynamicAPI~_toLoadList
	 * @private
	 * @inner
	 * @static
	 * @type {Array.<DynamicAPI~_toLoadList_type>}
	 */
	_to-load-list = []

	/**
	 * @typedef {!Object.<Object|Array>} DynamicAPI~constructorParams
	 * @prop {Number} [interval=500] - Interval in millisecond for waiting to ready dynamic module
	 * @prop {Boolean} [async=true] - Asynchronus script loading
	 */

	/**
	 * @constructor
	 * @public
	 * @name DynamicAPI
	 * @param {DynamicAPI~constructorParams} [params] - Parameters
	 * @returns {DynamicAPI~wrapper} wrapper - Wrapper for dynamic API loading, instance provides as "super" property
	 */
	({
		interval = 500ms
		async = yes
	}) ->
		let type = \Number, name = \interval, val = interval
			unless typeof! val is type
				throw new @exceptions.IncorrectArgument do
					arg-name: name
					arg-type: typeof! val
					must-be: type
		let type = \Boolean, name = \async, val = async
			unless typeof! val is type
				throw new @exceptions.IncorrectArgument do
					arg-name: name
					arg-type: typeof! val
					must-be: type

		@_interval = interval
		@_async = async

		/**
		 * For delegation to "dynamicLoadApi" method
		 *
		 * @typedef {Function} DynamicAPI~wrapper
		 * @public
		 */
		wrapper = let @ then ~> @dynamic-load-api ...
		wrapper.super = @

		return wrapper

	/**
	 * @typedef {Function} DynamicAPI~apiLoadedCallback
	 * @prop {Error} err Exception
	 * @prop {*} globalVarValue window[globalVarName]
	 */

	/**
	 * @private
	 * @inner
	 * @static
	 * @name DynamicAPI~getItem
	 * @param {DynamicAPI~_toLoadList} toLoadList
	 * @param {String} scriptPath
	 */
	get-item = (to-load-list, script-path) ~>
		res = null

		$.each to-load-list, (i, item) ->
			if item.script-path is script-path
				res := item
				return false

		throw new @exceptions.ItemNotFound script-path: script-path unless res?

		res

	/**
	 * @public
	 * @name DynamicAPI~dynamicLoadApi
	 * @param {String} scriptPath - Path to API script
	 * @param {String} globalVarName - Name of global variable to wait
	 * @param {DynamicAPI~apiLoadedCallback} callback
	 */
	dynamic-load-api: (script-path, global-var-name, cb) !->
		let type = \Function, name = \cb, val = cb
			unless val?
				return make-error new @exceptions.RequiredArgument do
					arg-name: name
			unless typeof! val is type
				return make-error new @exceptions.IncorrectArgument do
					arg-name: name
					arg-type: typeof! val
					must-be: type
		let type = \String, name = \scriptPath, val = script-path
			unless val?
				return make-error new @exceptions.RequiredArgument do
					arg-name: name
				, cb
			unless typeof! val is type
				return make-error new @exceptions.IncorrectArgument do
					arg-name: name
					arg-type: typeof! val
					must-be: type
				, cb
			unless !!val
				return make-error new @exceptions.RequiredArgument do
					arg-name: name
				, cb
		let type = \String, name = \globalVarName, val = global-var-name
			unless val?
				return make-error new @exceptions.RequiredArgument do
					arg-name: name
				, cb
			unless typeof! val is type
				return make-error new @exceptions.IncorrectArgument do
					arg-name: name
					arg-type: typeof! val
					must-be: type
				, cb
			unless !!val
				return make-error new @exceptions.RequiredArgument do
					arg-name: name
				, cb

		already-in-list = no
		item = null

		$.each _to-load-list, (i, item) !->
			already-in-list := yes if item.script-path is script-path

		unless already-in-list
			if global-var-name of window
				return make-error new @exceptions.GlobalNameAlreadyTaken do
					global-name: global-var-name
				, cb
			for item in _to-load-list
				if item.var-name is global-var-name
					return make-error new @exceptions.GlobalNameAlreadyTaken do
						global-name: global-var-name
					, cb

			_to-load-list.push do
				script-path: script-path
				loaded: false
				timer-id: null
				var-name: global-var-name
				cb: []

			$script = $ \<script/>, src: script-path
			$script.attr async: \async if @_async
			$ \head .append $script

		try
			item = get-item _to-load-list, script-path
		catch
			return make-error err, cb

		waiter = !~>
			unless item.var-name of window
				item.timer-id = set-timeout waiter, @_interval
				return

			item.loaded = true
			item.timer-id = null

			if item.cb? then $.each item.cb, (i, cb-func) !->
				$.proxy cb-func, null, null, window[item.var-name]
					|> set-timeout _, 0

			item.cb = null

		if item.loaded
			return $.proxy cb, null, null, window[item.var-name]
				|> set-timeout _, 0

		item.cb.push cb
		item.timer-id = set-timeout waiter, 0

	/**
	 * @private
	 * @inner
	 * @static
	 * @name DynamicAPI~makeError
	 * @param {Error} err
	 * @param {DynamicAPI~apiLoadedCallback} cb - Callback for providing exception
	 */
	make-error = (err, cb=null) !->
		throw err unless cb?
		$.proxy cb, null, err |> set-timeout _, 0

	/* @include exceptions.ls */

return DynamicAPI
