/**
 * Dynamic loading API class
 *
 * @version r4
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 */

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (RequireJS)
		define(['jquery'], function ($) { factory($, window); });
	} else if (typeof module === 'object' && typeof module.exports === 'object') {
		// CommonJS (Browserify)
		module.exports = factory(require('jquery'), window);
	} else {
		throw new Error('Unsupported architecture');
	}
})(function ($, window, undefined) {

	'use strict';

	// helpers {{{1

	/**
	 * @private
	 * @inner
	 */
	function inherit(proto) {
		if (Object.create) return Object.create(proto);
		function F() {}
		F.prototype = proto;
		return new F();
	}

	// helpers }}}1

	/**
	 * @class
	 * @public
	 * @param {Number} [interval=500] - Interval in millisecond for waiting to ready dynamic module
	 * @returns {function} dynamicLoadApiWrapper
	 */
	var exports = function (interval) { // {{{1
		var self = this;

		// validation of arguments {{{2

		if (interval !== undefined && typeof interval !== 'number')
			throw new self.exceptions.IncorrectArgument(
				null, 'interval', typeof(interval), 'number');

		// validation of arguments }}}2

		// default value
		if (typeof interval !== 'number') interval = 500;

		/** @private */ self._interval = interval;
		/** @private */ self._toLoadList = [];

		/** @public */
		var dynamicLoadApiWrapper = (function (self) {
			return function () {
				// delegate to "dynamicLoadApi" method
				return self.dynamicLoadApi.apply(self, arguments);
			};
		})(self);

		/** @public */ dynamicLoadApiWrapper.super = self;

		return dynamicLoadApiWrapper;
	}; // constructor to exports }}}1

	/**
	 * @typedef {function} apiLoadedCallback
	 * @prop {Error} err Exception
	 * @prop {*} globalVarValue window[globalVarName]
	 */

	/**
	 * @private
	 * @inner
	 */
	function getItem(toLoadList, scriptPath) { // {{{1
		var retVal;

		$.each(toLoadList, function (i, item) {
			if (item.scriptPath === scriptPath) {
				retVal = item;
				return false;
			}
		});

		if (!retVal)
			throw new exports.exceptions.ItemNotFound(null, scriptPath);

		return retVal;
	} // getItem() }}}1

	/**
	 * @private
	 * @inner
	 * @static
	 * @param {Error} err
	 */
	function makeError(err, callback) {
		if (callback)
			setTimeout($.proxy(callback, null, err), 0);
		else
			throw err;
	}

	/**
	 * @param {string} scriptPath - Path to .js script of API
	 * @param {string} globalVarName - Name of global variable to wait
	 * @param {apiLoadedCallback} callback
	 */
	exports.prototype.dynamicLoadApi = // {{{1
	function (scriptPath, globalVarName, callback) {

		var self = this;

		// validation of arguments {{{2

		// callback
		if (typeof callback !== 'function')
			return makeError(new self.exceptions.IncorrectArgument(
				null, 'callback', typeof(callback), 'function'), callback);

		// scriptPath
		if (typeof scriptPath !== 'string')
			return makeError(new self.exceptions.IncorrectArgument(
				null, 'scriptPath', typeof(scriptPath), 'string'), callback);
		if (scriptPath === '')
			return makeError(new self.exceptions.RequiredArgument(null, 'scriptPath'));

		// globalVarName
		if (typeof globalVarName !== 'string')
			return makeError(new self.exceptions.IncorrectArgument(
				null, 'globalVarName', typeof(globalVarName), 'string'), callback);
		if (globalVarName === '')
			return makeError(new self.exceptions.RequiredArgument(null, 'globalVarName'));

		// validation of arguments }}}2

		var alreadyInList = false;
		var item;

		$.each(self._toLoadList, function (i, item) {
			if (item.scriptPath === scriptPath)
				alreadyInList = true;
		});

		if (!alreadyInList) {
			self._toLoadList.push({
				scriptPath: scriptPath,
				loaded: false,
				timerId: null,
				varName: globalVarName,
				cb: [],
			});

			var $script = $('<script/>');
			$script.attr('src', scriptPath);
			$('head').append( $script );
		}

		try {
			item = getItem(self._toLoadList, scriptPath);
		} catch (err) {
			setTimeout($.proxy(callback, null, err), 0);
			return;
		}

		function waiter() { // {{{2
			if (item.varName in window) {
				item.loaded = true;
				item.timerId = null;

				if (item.cb)
					$.each(item.cb, function (i, cbFunc) {
						cbFunc(null, window[item.varName]);
					});

				item.cb = undefined;
				return;
			}

			setTimeout(waiter, self._interval);
		} // waiter() }}}2

		if (item.loaded) {
			setTimeout($.proxy(callback, null, null, window[item.varName]), 0);
		} else {
			item.cb.push(callback);
			item.timerId = setTimeout(waiter, 0);
		}

	}; // dynamicLoadApi() }}}1

	/* exceptions {{{1 */

	/**
	 * @static
	 * @public
	 */
	var exceptions = exports.exceptions = exports.prototype.exceptions = {};

	exceptions.IncorrectArgument = function (message, name, type, mustBe) { // {{{2
		Error.call(this);
		this.name = 'IncorrectArgument';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect';
			if (name) this.message += ' "'+ name +'"';
			this.message += ' argument type';
			if (type) this.message += ': "'+ type +'"';
			if (mustBe) this.message += ', must be a(n) "'+ mustBe +'"';
		}
	}; // }}}2

	exceptions.RequiredArgument = function (message, name) { // {{{2
		Error.call(this);
		this.name = 'RequiredArgument';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Required';
			if (name) this.message += ' "'+ name +'"';
			this.message += ' argument';
		}
	}; // }}}2

	exceptions.ItemNotFound = function (message, scriptPath) { // {{{2
		Error.call(this);
		this.name = 'ItemNotFound';
		if (this.message) {
			this.message = message;
		} else {
			this.message = 'Cannot get item by script path';
			if (scriptPath) this.message += ': "'+ scriptPath +'"';
		}
	}; // }}}2

	for (var key in exceptions)
		exceptions[key].prototype = inherit(Error.prototype);

	/* exceptions }}}1 */

	return exports;

}); // factory()
