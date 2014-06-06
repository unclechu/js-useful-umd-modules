/*!
 * Get grayscale image
 *
 * @module grayscale_img
 * @requires load_img
 *
 * @version r3
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 * @copyright Based on tutorial http://webdesignerwall.com/tutorials/html5-grayscale-image-hover
 */

define(['jquery', 'load_img'], function ($, loadImg) {

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
	function grayscaleImg(src, callback) {

		if (typeof Image !== 'function') {
			callback(new grayscaleImg.exceptions.NoImage());
			return;
		}

		var canvas = document.createElement('canvas');
		var ctx, imgObj, $img, imgPixels, dataURL;

		if (canvas.getContext) {
			ctx = canvas.getContext('2d');
			if (!ctx) {
				callback(new grayscaleImg.exceptions.CanvasIsNotSupported());
				return;
			}
		} else {
			callback(new grayscaleImg.exceptions.CanvasIsNotSupported());
			return;
		}

		loadImg(src, function (loadImgErr, img) {

			if (loadImgErr) { callback(loadImgErr); return; }

			imgObj = new Image();

			imgObj.src = img.src;
			canvas.width = imgObj.width;
			canvas.height = imgObj.height; 

			try {
				ctx.drawImage(imgObj, 0, 0); 
			} catch (err) {
				callback(new grayscaleImg.exceptions.DrawImageError(null, err));
				return;
			}

			try {
				imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
			} catch (err) {
				callback(new grayscaleImg.exceptions.GetImageDataError(null, err));
				return;
			}

			for (var y = 0; y < imgPixels.height; y++) {
				for (var x = 0; x < imgPixels.width; x++) {

					var i = (y * 4) * imgPixels.width + x * 4;
					var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;

					imgPixels.data[i] = avg; 
					imgPixels.data[i + 1] = avg; 
					imgPixels.data[i + 2] = avg;

				}
			}

			try {
				ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
			} catch (err) {
				callback(new grayscaleImg.exceptions.PutImageDataError(null, err));
				return;
			}

			try {
				dataURL = canvas.toDataURL('image/png');
			} catch (err) {
				callback(new grayscaleImg.exceptions.ConvertToDataURLError(null, err));
				return;
			}

			setTimeout(function () { // async

				callback(null, dataURL);

			}, 1);

		}); // loadImg()

	} // grayscaleImg()

	/* exceptions {{{1 */

	/**
	 * @public
	 * @static
	 */
	grayscaleImg.exceptions = {};

	grayscaleImg.exceptions.NoImage =
	function NoImage(message, type) {
		Error.call(this);
		this.name = 'NoImage';
		this.message = message || 'No "Image" constructor.';
	};

	grayscaleImg.exceptions.CanvasIsNotSupported =
	function CanvasIsNotSupported(message) {
		Error.call(this);
		this.name = 'CanvasIsNotSupported';
		this.message = message || 'Canvas is not supported.';
	};

	grayscaleImg.exceptions.DrawImageError =
	function DrawImageError(message, err) {
		Error.call(this);
		this.name = 'DrawImageError';
		this.message = message || 'Draw image to 2D canvas context error.';
		if (err) this.message += ('\n\n' + err.toString());
	};

	grayscaleImg.exceptions.GetImageDataError =
	function GetImageDataError(message, err) {
		Error.call(this);
		this.name = 'GetImageDataError';
		this.message = message || 'Get image data from 2D canvas context error.';
		if (err) this.message += ('\n\n' + err.toString());
	};

	grayscaleImg.exceptions.PutImageDataError =
	function PutImageDataError(message, err) {
		Error.call(this);
		this.name = 'PutImageDataError';
		this.message = message || 'Put new image data to 2D canvas context error.';
		if (err) this.message += ('\n\n' + err.toString());
	};

	grayscaleImg.exceptions.ConvertToDataURLError =
	function ConvertToDataURLError(message, err) {
		Error.call(this);
		this.name = 'ConvertToDataURLError';
		this.message = message || 'Convert image data from 2D canvas to URL data error.';
		if (err) this.message += ('\n\n' + err.toString());
	};

	function inherit(proto) {
		if (Object.create) return Object.create(proto);
		function F() {}
		F.prototype = proto;
		return new F();
	}

	for (var key in grayscaleImg.exceptions) {
		grayscaleImg.exceptions[key].prototype = inherit(Error.prototype);
	}

	/* exceptions }}}1 */

	return grayscaleImg;

}); // define()
