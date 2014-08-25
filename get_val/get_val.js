/**
 * Provide "getVal" for getting values from "values" module
 *
 * @version r5
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 */

(function (deps, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (RequireJS)
		define(deps, factory);
	} else if (typeof module === 'object' && typeof module.exports === 'object') {
		// CommonJS (Browserify)
		module.exports = factory(require('../values'));
	} else throw new Error('Unsupported architecture');
})(['values'], function (values) {

	var required = values.required;
	values = values.values;

	// helpers {{{1

	function inherit(proto) {
		if (Object.create) return Object.create(proto);
		function F() {}
		F.prototype = proto;
		return new F();
	}

	// helpers }}}1

	function getVal() {
		// delegate to "get" method
		return getVal.get.apply(this, arguments);
	}

	function checkRequired() {
		for (var i=0; i<required.length; i++) {
			if (!(required[i] in values)) {
				throw new getVal.exceptions.RequiredIsNotSet(null, required[i]);
			}
		}
	}

	/**
	 * Only for "required" keys
	 *
	 * @public
	 */
	getVal.set = function (key, val) {

		if (typeof key !== 'string') {
			throw new getVal.exceptions.IncorrectKey(null, typeof(key));
		}

		var found = false;

		for (var i=0; i<required.length; i++) {
			if (required[i] === key) found = true;
		}

		if (!found) {
			throw new getVal.exceptions.NoKeyInRequiredList(null, key);
		}

		values[key] = val;

	};

	/** @public */
	getVal.get = function (key, ignoreRequired) {

		if (!ignoreRequired) checkRequired();

		if (typeof key !== 'string') {
			throw new getVal.exceptions.IncorrectKey(null, typeof(key));
		}

		if (!(key in values)) {
			throw new getVal.exceptions.KeyIsNotExists(null, key);
		}

		return values[key];

	};

	/* exceptions {{{1 */

	/**
	 * @static
	 * @public
	 */
	getVal.exceptions = {};

	getVal.exceptions.IncorrectKey = function (message, keyType) {
		Error.call(this);
		this.name = 'IncorrectKey';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect key type';
			if (keyType) this.message += ' ("'+ keyType +'")';
			this.message += ', must be a string';
		}
	};

	getVal.exceptions.KeyIsNotExists = function (message, key) {
		Error.call(this);
		this.name = 'KeyIsNotExists';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Key';
			if (key) this.message += ' "'+ key +'"';
			this.message += ' is not exists';
		}
	};

	getVal.exceptions.RequiredIsNotSet = function (message, key) {
		Error.call(this);
		this.name = 'RequiredIsNotSet';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Required key is not set';
			if (key) this.message += ': "'+ key +'"';
		}
	};

	getVal.exceptions.NoKeyInRequiredList = function (message, key) {
		Error.call(this);
		this.name = 'NoKeyInRequiredList';
		if (message) {
			this.message = message;
		} else {
			this.message = 'No key';
			if (key) this.message += ' "'+ key +'"';
			this.message += ' in required list';
		}
	};

	for (var key in getVal.exceptions) {
		getVal.exceptions[key].prototype = inherit(Error.prototype);
	}

	/* exceptions }}}1 */

	return getVal;

}); // factory()
