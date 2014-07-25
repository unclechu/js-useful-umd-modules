/**
 * Calculate relative number by relative min and max sources
 *
 * @version r1
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 */

define(['jquery'], function ($) {

	var exports, undefined;

	// helpers {{{1

	function inherit(proto) {
		if (Object.create) return Object.create(proto);
		function F() {}
		F.prototype = proto;
		return new F();
	}

	// helpers }}}1

	/**
	 * @typedef params
	 * @type {Object.<Number|Float|Boolean>}
	 * @prop {Number|Float} relVal - Current relative value
	 * @prop {Number|Float} relMin - Relative minimum value
	 * @prop {Number|Float} relMax - Relative maximum value
	 * @prop {Number|Float} min - Minimum value for calculating by "relMin"
	 * @prop {Number|Float} max - maximum value for calculating by "relMax"
	 * @prop {Boolean} [limitMin=true] - Limit "relVal" by "relMin"
	 * @prop {Boolean} [limitMax=true] - Limit "relVal" by "relMax"
	 */
	var defaultParams = { // {{{1
		relVal: null,
		relMin: null,
		relMax: null,
		min: null,
		max: null,
		limitMin: true,
		limitMax: true,
	}; // defaultParams }}}1

	/**
	 * @private
	 * @inner
	 * @param {params} params
	 * @return Calculated value
	 * @TODO relMin less than zero
	 * @TODO invert min/max
	 */
	function model(params) { // {{{1

		var result = 0;
		var relVal = params.relVal;

		if (params.limitMin && relVal < params.relMin)
			relVal = params.relMin;
		else if (params.limitMax && relVal > params.relMax)
			relVal = params.relMax;

		var relValLow = relVal - params.relMin;
		var relMaxLow = params.relMax - params.relMin;
		var maxLow = params.max - params.min;

		result = relValLow * (maxLow) / relMaxLow;
		result += params.min;

		return result;

	} // model() }}}1

	/**
	 * @public
	 * @static
	 * @param {params} params
	 * @return Calculated value
	 * @throws {Error} IncorrectParamsType
	 * @throws {Error} RequiredParam
	 * @throws {Error} UnknownParam
	 * @throws {Error} IncorrectParamValue
	 */
	exports = function controller(params) { // {{{1

		var key;

		// validate params {{{2

		// check for correct params type
		if (!$.isPlainObject(params))
			throw new exceptions.IncorrectParamsType(null, $.type(params));

		// check for required params
		for (key in defaultParams) {
			if (key === 'limitMin' || key === 'limitMax')
				continue;
			else if (!(key in params))
				throw new exceptions.RequiredParam(null, key);
		}

		// check for unknown params
		for (key in params)
			if (!(key in defaultParams))
				throw new exceptions.UnknownParam(null, key);

		// check for correct params type
		for (key in defaultParams) {
			if (key === 'limitMin' || key === 'limitMax') {
				if (key in params && $.type(params[key]) !== 'boolean')
					throw new exceptions.IncorrectParamValue(
						null, key, $.type(params[key]), 'boolean');
			} else if ($.type(params[key]) !== 'number') {
				throw new exceptions.IncorrectParamValue(
					null, key, $.type(params[key]), 'number');
			}
		}

		// validate params }}}2

		params = $.extend({}, defaultParams, params);

		return model(params);

	}; // exports() = controller() }}}1

	/* exceptions {{{1 */

	/**
	 * @public
	 * @static
	 * @readOnly
	 * @type {Object.<Error>}
	 * @prop {Error} IncorrectParamsType
	 * @prop {Error} RequiredParam
	 * @prop {Error} UnknownParam
	 * @prop {Error} IncorrectParamValue
	 */
	var exceptions = exports.exceptions = {};

	/** @typedef {Error} IncorrectParamsType */
	exceptions.IncorrectParamsType = function (message, paramsType) {
		Error.call(this);
		this.name = 'IncorrectParamsType';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Params must be a plain object';
			if (paramsType) this.message += ' (now is "'+ paramsType +'")';
			this.message += '.';
		}
	};

	/** @typedef {Error} RequiredParam */
	exceptions.RequiredParam = function (message, paramName) {
		Error.call(this);
		this.name = 'RequiredParam';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Required param ';
			if (paramName) this.message += ' "'+ paramName +'"';
			this.message += '.';
		}
	};

	/** @typedef {Error} UnknownParam */
	exceptions.UnknownParam = function (message, paramName) {
		Error.call(this);
		this.name = 'UnknownParam';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Unknown param ';
			if (paramName) this.message += ' "'+ paramName +'"';
			this.message += '.';
		}
	};

	/** @typedef {Error} IncorrectParamValue */
	exceptions.IncorrectParamValue =
	function (message, paramName, paramType, mustBeType) {
		Error.call(this);
		this.name = 'IncorrectParamValue';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect';
			if (paramName) this.message += ' "'+ paramName +'"';
			this.message += ' param value type';
			if (paramType) this.message += ': "'+ paramType +'"';
			if (mustBeType) this.message += ', must be a "'+ mustBeType +'"';
			this.message += '.';
		}
	};

	for (var key in exceptions)
		exceptions[key].prototype = inherit(Error.prototype);

	/* exceptions }}}1 */

	return exports;

}); // define()
