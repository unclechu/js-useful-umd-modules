/*!
 * Dynamic loading images
 *
 * @module load_img
 * @requires get_val ('loadImgTimeout')
 * 
 * @version r3
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 */

define(['get_val', 'jquery'], function (getVal, $) {

	/**
	 * @public
	 * @example
	 *   define(['load_img'], function (loadImg) {
	 *     loadImg('/images/picture.png', function (err, img) {
	 *       if (err) alert(err.toString());
	 *       $('body').append('<img alt="" src="'+ img.src +'" width="'+ img.width +'" height="'+ img.height +'" />');
	 *     });
	 *   });
	 */
	function loadImg(link, callback) {

		if (typeof callback !== 'function') {
			throw new Error('Incorrect "callback" argument ("'+
				typeof(callback) +'"), must be a "function"');
		}

		if (typeof link !== 'string') {
			callback(new loadImg.exceptions.IncorrectLink(null, typeof(link)));
		}

		var $img = $('<img/>');
		var timerId;
		var loaded = false;

		/** @private */
		function destroy() {

			killTimer();
			$img.off('load');
			$img = undefined;

		} // destroy()

		/** @private */
		function timeout() {

			if (loaded) return false;

			destroy();
			callback(new loadImg.exceptions.Timeout());

		} // timeout()

		/** @private */
		function killTimer() {

			if (timerId !== undefined) {

				clearTimeout(timerId);
				timerId = undefined;

			}

		} // killTimer()

		/** @private */
		function loadHandler() {

			var img = this;

			loaded = true;
			killTimer();

			// async
			setTimeout(function () {

				callback(null, {
					src: img.src,
					width: img.width,
					height: img.height
				});

				destroy();

			}, 1);

		} // loadHandler()

		$img.on('load', loadHandler).attr('src', link);

		timerId = setTimeout(timeout, getVal('loadImgTimeout'));

	} // loadImg()

	/* exceptions {{{ */

	/**
	 * @static
	 * @public
	 */
	loadImg.exceptions = {};

	loadImg.exceptions.IncorrectLink =
	function IncorrectLink(message, type) {
		Error.call(this);
		this.name = 'IncorrectLink';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect "link" argument';
			if (type) this.message += ' ("'+ type +'")';
			this.message += ', must be a "string"';
		}
	};

	loadImg.exceptions.Timeout =
	function Timeout(message) {
		Error.call(this);
		this.name = 'Timeout';
		this.message = message || 'Loading image timeout';
	};

	function inherit(proto) {
		if (Object.create) return Object.create(proto);
		function F() {}
		F.prototype = proto;
		return new F();
	}

	for (var key in loadImg.exceptions) {
		loadImg.exceptions[key].prototype = inherit(Error.prototype);
	}

	/* exceptions }}} */

	return loadImg;

}); // define()
