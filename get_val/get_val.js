/**
 * Provides class for getting value by key
 *
 * @version r8
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 */

(function (factory) {
	if (typeof define === 'function' && define.amd)
		define(factory); // AMD (RequireJS)
	else if (typeof module === 'object' && typeof module.exports === 'object')
		module.exports = factory(); // CommonJS (Browserify)
	else
		throw new Error('Unsupported architecture');
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

	/**
	 * @class
	 * @public
	 * @param {Object} values - Key-value object of values
	 * @param {Object} [required] - Key-value object to set required values
	 * @returns {function} getWrapper
	 */
	var exports = function (values, required) { // {{{1
		var self = this;

		// validation of arguments {{{2

		// values
		if (typeof values !== 'object')
			throw new self.exceptions.IncorrectArgument(
				null, 'values', typeof(values), 'object');
		if (typeof values.values !== 'object')
			throw new self.exceptions.RequiredArgumentKey(
				null, 'values', 'values', typeof(values.values), 'object');
		if (typeof values.required !== 'object')
			throw new self.exceptions.RequiredArgumentKey(
				null, 'values', 'required', typeof(values.required), 'object');

		// required
		if (required && typeof required !== 'object')
			throw new self.exceptions.IncorrectArgument(
				null, 'required', typeof(required), 'object');

		// validation of arguments }}}2

		/** @private */ self._values = values.values;
		/** @private */ self._required = values.required;

		if (required)
			for (var key in required)
				self.set.call(self, key, required[key]);

		/** @public */
		var getWrapper = (function (self) {
			return function () {
				// delegate to "get" method
				return self.get.apply(self, arguments);
			};
		})(self);

		/** @public */ getWrapper.super = self;

		return getWrapper;
	}; // constructor to exports }}}1

	/** @private */
	exports.prototype._checkRequired = function () { // {{{1

		for (var i=0; i<this._required.length; i++)
			if (!(this._required[i] in this._values))
				throw new exports.exceptions.RequiredIsNotSet(null, this._required[i]);

	}; // "_checkRequired" method }}}1

	/**
	 * Only for "required" keys
	 *
	 * @public
	 */
	exports.prototype.set = function (key, val) { // {{{1

		var found = false;

		if (typeof key !== 'string')
			throw new exports.exceptions.IncorrectKey(null, typeof(key));

		for (var i=0; i<this._required.length; i++)
			if (this._required[i] === key) found = true;

		if (!found)
			throw new exports.exceptions.NoKeyInRequiredList(null, key);

		this._values[key] = val;

	}; // "set" method }}}1

	/** @public */
	exports.prototype.get = function (key, ignoreRequired) { // {{{1

		if (!ignoreRequired) this._checkRequired();

		if (typeof key !== 'string')
			throw new exports.exceptions.IncorrectKey(null, typeof(key));

		if (!(key in this._values))
			throw new exports.exceptions.KeyIsNotExists(null, key);

		return this._values[key];

	}; // "get" method }}}1

	/* exceptions {{{1 */

	/**
	 * @static
	 * @public
	 */
	exports.exceptions = exports.prototype.exceptions = {};

	exports.exceptions.IncorrectArgument = // {{{2
	function (message, name, type, mustBe) {
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

	exports.exceptions.RequiredArgumentKey = // {{{2
	function (message, argName, keyName, keyType, keyMustBe) {
		Error.call(this);
		this.name = 'RequiredArgumentKey';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect';
			if (argName) this.message += ' "'+ argName +'"';
			this.message += ' argument key';
			if (keyName) this.message += ' "'+ keyName +'"';
			this.message += ' type';
			if (keyType) this.message += ': "'+ keyType +'"';
			if (keyMustBe) this.message += ', must be a(n) "'+ keyMustBe +'"';
		}
	}; // }}}2

	exports.exceptions.IncorrectKey = function (message, keyType) { // {{{2
		Error.call(this);
		this.name = 'IncorrectKey';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect key type';
			if (keyType) this.message += ' ("'+ keyType +'")';
			this.message += ', must be a string';
		}
	}; // }}}2

	exports.exceptions.KeyIsNotExists = function (message, key) { // {{{2
		Error.call(this);
		this.name = 'KeyIsNotExists';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Key';
			if (key) this.message += ' "'+ key +'"';
			this.message += ' is not exists';
		}
	}; // }}}2

	exports.exceptions.RequiredIsNotSet = function (message, key) { // {{{2
		Error.call(this);
		this.name = 'RequiredIsNotSet';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Required key is not set';
			if (key) this.message += ': "'+ key +'"';
		}
	}; // }}}2

	exports.exceptions.NoKeyInRequiredList = function (message, key) { // {{{2
		Error.call(this);
		this.name = 'NoKeyInRequiredList';
		if (message) {
			this.message = message;
		} else {
			this.message = 'No key';
			if (key) this.message += ' "'+ key +'"';
			this.message += ' in required list';
		}
	}; // }}}2

	for (var key in exports.exceptions) {
		exports.exceptions[key].prototype = inherit(Error.prototype);
	}

	/* exceptions }}}1 */

	return exports;

}); // factory()
