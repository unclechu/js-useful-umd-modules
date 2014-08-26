/*!
 * Check JSON data for correct and "status" is "success"
 *
 * @version r4
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 */

(function (factory) {
	if (typeof define === 'function' && define.amd)
		define(factory); // AMD (RequireJS)
	else if (typeof module === 'object' && typeof module.exports === 'object')
		module.exports = factory(); // CommonJS (Browserify)
	else throw new Error('Unsupported architecture');
})(function () {

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

	/** @public */ var exports = {};

	/**
	 * @private
	 * @inner
	 * @static
	 * @param {Error} err
	 */
	function makeError(err, callback) {
		if (callback) callback(err); else throw err;
	}

	/**
	 * @public
	 * @static
	 * @param {string} jsonData JSON string
	 * @param {callback} [callback] Callback for async return value
	 */
	function validate(jsonData, callback) { // {{{1

		if (
			typeof callback !== 'function' &&
			callback !== null && callback !== undefined
		) {
			throw new exports.exceptions.IncorrectCallbackArgument(null, typeof(callback));
		}

		if (typeof jsonData !== 'string')
			return makeError(
				new exports.exceptions.IncorrectJSONDataArgument(null, typeof(jsonData)),
				callback
			);

		var parsed;

		try {
			parsed = JSON.parse(jsonData);
			if (typeof parsed !== 'object') throw new Error('Must be an object.');
		} catch (err) {
			return makeError(new exports.exceptions.ParseJSONError(null, err), callback);
		}

		if (!('status' in parsed))
			return makeError(new exports.exceptions.NoStatusKey(), callback);

		if (typeof parsed.status !== 'string')
			return makeError(
				new exports.exceptions.IncorrectStatusType(null, typeof(parsed.status)),
				callback
			);

		if (parsed.status !== 'error' && parsed.status !== 'success')
			return makeError(
				new exports.exceptions.UnknownStatusValue(null, parsed.status, parsed),
				callback
			);

		if (parsed.status === 'error')
			return makeError(
				new exports.exceptions.ErrorStatus(null, parsed),
				callback
			);

		if (callback)
			setTimeout(function () { callback(null, parsed); }, 0);
		else
			return parsed;

	} // validate() }}}1

	/* exceptions {{{1 */

	/**
	 * @public
	 * @static
	 */
	exports.exceptions = {};

	exports.exceptions.IncorrectJSONDataArgument = function (message, type) { // {{{2
		Error.call(this);
		this.name = 'IncorrectJSONDataArgument';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect type of JSON data argument';
			if (type) this.message += ' ("'+ type +'")';
			this.message += ', must be a "string"';
		}
		if (type) this.type = type;
	}; // }}}2

	exports.exceptions.IncorrectCallbackArgument = function (message, type) { // {{{2
		Error.call(this);
		this.name = 'IncorrectCallbackArgument';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect callback argument';
			if (type) this.message += ' ("'+ type +'")';
			this.message += ', must be a "function"';
		}
		if (type) this.type = type;
	}; // }}}2

	exports.exceptions.ParseJSONError = function (message, err) { // {{{2
		Error.call(this);
		this.name = 'ParseJSONError';
		this.message = message || 'Parse JSON data error';
		if (err) {
			this.err = err;
			if (!message) this.message += '\n\n' + err.toString();
		}
	}; // }}}2

	exports.exceptions.NoStatusKey = function (message) { // {{{2
		Error.call(this);
		this.name = 'NoStatusKey';
		this.message = message || 'No "status" key in JSON data';
	}; // }}}2

	exports.exceptions.IncorrectStatusType = function (message, type) { // {{{2
		Error.call(this);
		this.name = 'IncorrectStatusType';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect type of value of "status" key';
			if (type) this.message += ' ("'+ type +'")';
			this.message += ', must be a "string"';
		}
		if (type) this.type = type;
	}; // }}}2

	exports.exceptions.UnknownStatusValue = function (message, val, json) { // {{{2
		Error.call(this);
		this.name = 'UnknownStatusValue';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Unknown value of "status" key';
			if (val) this.message += ': "'+ val +'"';
		}
		if (val) this.value = val;
		if (json) this.json = json;
	}; // }}}2

	exports.exceptions.ErrorStatus = function (message, json) { // {{{2
		Error.call(this);
		this.name = 'ErrorStatus';
		this.message = message || 'Value of "status" key is "error"';
		if (json) this.json = json;
	}; // }}}2

	for (var key in exports.exceptions)
		exports.exceptions[key].prototype = inherit(Error.prototype);

	/* exceptions }}}1 */

	exports.validate = validate;

	return exports;

}); // factory()
