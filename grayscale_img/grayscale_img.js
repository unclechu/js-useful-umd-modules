/**
 * Get grayscale image
 *
 * @module grayscale_img
 * @requires load_img (instance of constructor)
 *
 * @version r4
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-commonjs-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-commonjs-modules/|GitHub}
 * @copyright Based on tutorial http://webdesignerwall.com/tutorials/html5-grayscale-image-hover
 */

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (RequireJS)
		define(['jquery', 'load_img'], function ($, loadImg) {
			factory($, loadImg, window.document);
		});
	} else if (typeof module === 'object' && typeof module.exports === 'object') {
		// CommonJS (Browserify)
		module.exports = factory(
			require('jquery'), require('load_img'), window.document);
	} else {
		throw new Error('Unsupported architecture');
	}
})(function ($, loadImg, document) {

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
	 * @private
	 * @inner
	 */
	function makeError(err, cb) { // {{{1
		if (cb)
			setTimeout($.proxy(cb, null, err), 0);
		else
			throw err;
	} // makeError() }}}1

	/**
	 * @typedef {function} grayscaleImg~callback
	 * @param {Error|Null} err
	 * @param {string} dataURL
	 */

	/**
	 * @public
	 * @static
	 * @param {string} src Path to image or data URL
	 * @param {grayscaleImg~callback} callback
	 */
	var exports = function (src, callback) { // {{{1

		if (typeof Image !== 'function')
			return makeError(new exports.exceptions.NoImage(), callback);

		var canvas = document.createElement('canvas');
		var ctx, imgObj, imgPixels, dataURL;

		if (canvas.getContext) {
			ctx = canvas.getContext('2d');
			if (!ctx)
				return makeError(
					new exports.exceptions.CanvasIsNotSupported(), callback);
		} else {
			return makeError(
				new exports.exceptions.CanvasIsNotSupported(), callback);
		}

		loadImg(src, function (loadImgErr, img) {

			if (loadImgErr) return makeError(loadImgErr, callback);

			imgObj = new Image();

			imgObj.src = img.src;
			canvas.width = imgObj.width;
			canvas.height = imgObj.height;

			try {
				ctx.drawImage(imgObj, 0, 0);
			} catch (err) {
				return makeError(
					new exports.exceptions.DrawImageError(null, err), callback);
			}

			try {
				imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
			} catch (err) {
				return makeError(
					new exports.exceptions.GetImageDataError(null, err), callback);
			}

			for (var y = 0; y < imgPixels.height; y++) {
				for (var x = 0; x < imgPixels.width; x++) {
					var i = (y * 4) * imgPixels.width + x * 4;
					var avg = (imgPixels.data[i] + imgPixels.data[i + 1] +
						imgPixels.data[i + 2]) / 3;

					imgPixels.data[i] = avg;
					imgPixels.data[i + 1] = avg;
					imgPixels.data[i + 2] = avg;
				}
			}

			try {
				ctx.putImageData(
					imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
			} catch (err) {
				return makeError(
					new exports.exceptions.PutImageDataError(null, err),
					callback);
			}

			try {
				dataURL = canvas.toDataURL('image/png');
			} catch (err) {
				return makeError(
					new exports.exceptions.ConvertToDataURLError(null, err),
					callback);
			}

			setTimeout($.proxy(callback, null, null, dataURL), 0);

		}); // loadImg()

	}; // exports() }}}1

	/* exceptions {{{1 */

	/**
	 * @public
	 * @static
	 */
	var exceptions = exports.exceptions = {};

	exceptions.NoImage = function (message, type) { // {{{2
		Error.call(this);
		this.name = 'NoImage';
		this.message = message || 'No "Image" constructor.';
		if (type) this.type = type;
	}; // }}}2

	exceptions.CanvasIsNotSupported = function (message) { // {{{2
		Error.call(this);
		this.name = 'CanvasIsNotSupported';
		this.message = message || 'Canvas is not supported.';
	}; // }}}2

	exceptions.DrawImageError = function (message, err) { // {{{2
		Error.call(this);
		this.name = 'DrawImageError';
		this.message = message || 'Draw image to 2D canvas context error.';
		if (err) this.message += ('\n\n' + err.toString());
	}; // }}}2

	exceptions.GetImageDataError = function (message, err) { // {{{2
		Error.call(this);
		this.name = 'GetImageDataError';
		this.message = message || 'Get image data from 2D canvas context error.';
		if (err) this.message += ('\n\n' + err.toString());
	}; // }}}2

	exceptions.PutImageDataError = function (message, err) { // {{{2
		Error.call(this);
		this.name = 'PutImageDataError';
		this.message = message || 'Put new image data to 2D canvas context error.';
		if (err) this.message += ('\n\n' + err.toString());
	}; // }}}2

	exceptions.ConvertToDataURLError = function (message, err) { // {{{2
		Error.call(this);
		this.name = 'ConvertToDataURLError';
		this.message = message || 'Convert image data from 2D canvas to URL data error.';
		if (err) this.message += ('\n\n' + err.toString());
	}; // }}}2

	for (var key in exceptions)
		exceptions[key].prototype = inherit(Error.prototype);

	/* exceptions }}}1 */

	return exports;

}); // define()
