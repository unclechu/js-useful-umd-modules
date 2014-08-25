/**
 * Provides class for get localized text by key
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
	 * @param {Object} values - Key-value object of localization values
	 * @param {string} [local=en] - Current localization short code
	 * @returns {function} getWrapper
	 */
	var exports = function (values, local) { // {{{1
		self = this;

		// validation of arguments {{{2

		// values
		if (typeof values !== 'object')
			throw new self.exceptions.IncorrectArgument(
				null, 'values', typeof(values), 'object');

		// local
		if (local && typeof local !== 'string')
			throw new self.exceptions.IncorrectArgument(
				null, 'local', typeof(local), 'string');

		// validation of arguments }}}2

		if (!local) local = 'en'; // default value

		/** @private */ self._values = values;
		/** @private */ self._curLocal = null;

		self.setCurLocal(local);

		/** @public */
		function getWrapper() {
			// delegate to "get" method
			return self.get.apply(self, arguments);
		}

		/** @public */ getWrapper.super = self;

		return getWrapper;

	}; // constructor to exports }}}1

	/**
	 * @public
	 * @param {string} key
	 * @param {string|Object} [val_N] - Child key name or key-value object to replace (must be a last argument)
	 * @example getLocalText('FIRST_LEVEL', 'SECOND_LEVEL', 'KEY_OF_VALUE')
	 * @example getLocalText('FIRST_LEVEL', 'SECOND_LEVEL', 'KEY_OF_VALUE', { '#URL#': 'http://domain.org/pathname/' })
	 * @returns {string} - Localized and preprocessed text
	 */
	exports.prototype.get = // {{{1
	function (/*KEY(_LEVEL_1)[, KEY(_LEVEL_N)][, TO_REPLACE_LIST]*/) {

		var self = this;

		var argsSrc = Array.prototype.slice.call(arguments, 0);
		var argsLog = argsSrc.slice(0);
		var cur = self._values[self._curLocal];

		if (argsLog.length > 1)
			if (typeof argsLog[argsLog.length-1] === 'object')
				argsLog = argsLog.slice(0, -1);

		function recursive() { // {{{2

			var args = Array.prototype.slice.call(arguments, 0);
			var arg = args.shift();

			// object at last argument
			if (typeof arg !== 'string') {
				if (args.length < 1 && typeof arg === 'object') {
					for (var key in arg)
						cur = cur.replace(new RegExp(key, 'g'), arg[key]);
					return cur;
				} else {
					throw new self.exceptions.IncorrectKeyType(
						null, typeof(arg));
				}
			}

			if (args.length > 0) {
				if (cur[arg]) {
					cur = cur[arg];
					return recursive.apply(self, args);
				} else {
					throw new self.exceptions.NotFound(null, argsLog.join('.'));
				}
			} else {
				if (typeof cur[arg] === 'undefined')
					throw new self.exceptions.NotFound(null, argsLog.join('.'));

				if (typeof cur[arg] === 'string')
					return cur[arg];
				else
					throw new self.exceptions.IncorrectDestination(null, argsLog.join('.'));
			}

		} // recursive() }}}2

		return recursive.apply(self, argsSrc);

	}; // "get" method }}}1

	/**
	 * @public
	 * @param {string} local - Localization short name (example: 'en' or 'ru')
	 */
	exports.prototype.setCurLocal = function (local) { // {{{1

		// "local" argument validation
		if (typeof local !== 'string')
			throw new self.exceptions.IncorrectArgument(
				null, 'local', typeof(local), 'string');

		if (!this._values[local])
			throw new this.exceptions.UnknownLocalization(null, local);

		this._curLocal = local;

	}; // "setCurLocal" method }}}1

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

	exports.exceptions.IncorrectKeyType = function (message, type) { // {{{2
		Error.call(this);
		this.name = 'IncorrectKeyType';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect key type';
			if (type) this.message += ' ("'+ type +'")';
			this.message += ', must be a string' +
				' or key-value object (at last argument)';
		}
	}; // }}}2

	exports.exceptions.NotFound = function (message, keyPath) { // {{{2
		Error.call(this);
		this.name = 'NotFound';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Localized text not found by key-path';
			if (keyPath) this.message += ': "'+ keyPath +'"';
		}
	}; // }}}2

	exports.exceptions.IncorrectDestination = function (message, keyPath) { // {{{2
		Error.call(this);
		this.name = 'IncorrectDestination';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect destination by key-path';
			if (keyPath) this.message += ': "'+ keyPath +'"';
		}
	}; // }}}2

	exports.exceptions.UnknownLocalization = function (message, local) { // {{{2
		Error.call(this);
		this.name = 'UnknownLocalization';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Unknown localization';
			if (local) this.message += ': "'+ local +'"';
		}
	}; // }}}2

	for (var key in exports.exceptions)
		exports.exceptions[key].prototype = inherit(Error.prototype);

	/* exceptions }}}1 */

	return exports;

}); // factory()
