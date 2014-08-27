/**
 * Dynamic loading images abstraction class
 *
 * @module load_img
 * @requires jquery
 *
 * @version r4
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-commonjs-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-commonjs-modules/|GitHub}
 */

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (RequireJS)
		define(['jquery'], function ($) { factory($); });
	} else if (typeof module === 'object' && typeof module.exports === 'object') {
		// CommonJS (Browserify)
		module.exports = factory(require('jquery'));
	} else {
		throw new Error('Unsupported architecture');
	}
})(function ($, undefined) {

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
	 * @param {Number|Float} [loadImgTimeout=20] - Loading image timeout in seconds
	 * @returns {function} loadImgWrapper
	 */
	var exports = function (loadImgTimeout) { // {{{1
		var self = this;

		// validation of arguments {{{2

		if (loadImgTimeout && (typeof loadImgTimeout !== 'number'))
			throw new self.exceptions.IncorrectArgument(
				null, 'loadImgTimeout', typeof(loadImgTimeout),
				['number', 'float']);

		// validation of arguments }}}2

		/** @private */ self._loadImgTimeout = (loadImgTimeout || 20);

		/** @public */
		var loadImgWrapper = (function (self) {
			return function () {
				// delegate to "loadImg" method
				return self.loadImg.apply(self, arguments);
			};
		})(self);

		/** @public */ loadImgWrapper.super = self;

		return loadImgWrapper;
	}; // constructor to exports }}}1

	/**
	 * @private
	 * @inner
	 * @static
	 * @param {Error} err
	 */
	function makeError(err, cb) { // {{{1
		if (cb)
			setTimeout($.proxy(cb, null, err), 0);
		else
			throw err;
	} // makeError() }}}1

	/**
	 * @public
	 * @example
	 *   loadImg('/images/picture.png', function (err, img) {
	 *     if (err) return alert(err.toString());
	 *     $('body').append('<img alt="" src="'+ img.src +'" width="'+ img.width +'" height="'+ img.height +'" />');
	 *   });
	 */
	exports.prototype.loadImg = function loadImg(link, callback) { // {{{1

		var self = this;

		// validation of arguments {{{2

		if (typeof callback !== 'function')
			return makeError(new self.exceptions.IncorrectArgument(
				null, 'callback', typeof(callback), 'function'), null);

		if (typeof link !== 'string')
			return makeError(new self.exceptions.IncorrectLink(
				null, typeof(link)), callback);

		// validation of arguments }}}2

		var $img = $('<img/>');
		var timerId;
		var loaded = false;

		/** @private */
		function destroy() { // {{{2
			killTimer();
			$img.off('load');
			$img = undefined;
		} // destroy() }}}2

		/** @private */
		function timeout() { // {{{2
			if (loaded) return false;

			destroy();
			makeError(new self.exceptions.Timeout(), callback);
		} // timeout() }}}2

		/** @private */
		function killTimer() { // {{{2
			if (timerId !== undefined) {
				clearTimeout(timerId);
				timerId = undefined;
			}
		} // killTimer() }}}2

		/** @private */
		function loadHandler(img) { // {{{2
			loaded = true;
			killTimer();

			setTimeout(function () {
				callback(null, {
					src: img.src,
					width: img.width,
					height: img.height
				});
				destroy();
			}, 0);
		} // loadHandler() }}}2

		$img.on('load', function () { loadHandler(this); }).attr('src', link);

		timerId = setTimeout(timeout, Math.round(self._loadImgTimeout * 1000));

	}; // loadImg() }}}1

	/* exceptions {{{ */

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
			if (typeof mustBe === 'object' && mustBe.length) {
				this.message += ', must be a(n)';
				for (var i=0; i<mustBe.length; i++) {
					this.message += ' ';
					if (i>0) this.message += 'or ';
					this.message += '"'+ mustBe[i] +'"';
				}
			} else if (typeof mustBe === 'string') {
				this.message += ', must be a(n) "'+ mustBe +'"';
			}
		}
	}; // }}}2

	exceptions.IncorrectLink = function (message, type) { // {{{2
		Error.call(this);
		this.name = 'IncorrectLink';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect "link" argument';
			if (type) this.message += ' ("'+ type +'")';
			this.message += ', must be a "string"';
		}
	}; // }}}2

	exceptions.Timeout = function (message) { // {{{2
		Error.call(this);
		this.name = 'Timeout';
		this.message = message || 'Loading image timeout';
	}; // }}}2

	for (var key in exceptions)
		exceptions[key].prototype = inherit(Error.prototype);

	/* exceptions }}} */

	return exports;

}); // factory()
