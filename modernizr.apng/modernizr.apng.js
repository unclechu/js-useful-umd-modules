/*!
 * APNG Modernizr Test Workaround
 *
 * @version r2
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 */

define(['modernizr'], function (Modernizr) {

	var testImage = new Image();
	var canvasContext = document.createElement('canvas').getContext('2d');
	var isApngSupported = false;

	testImage.onload = function () {

		canvasContext.drawImage(testImage, 0, 0);
		isApngSupported = canvasContext.getImageData(0, 0, 1, 1).data[3] === 0;

		if (typeof isApngSupported !== "boolean") {
			isApngSupported = false;
		}

		Modernizr.addTest('apng', function() {
			return isApngSupported;
		});

	};

	testImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAY'+
		'AAAAfFcSJAAAACGFjVEwAAAABAAAAAcMq2TYAAAANSURBVAiZY2BgYPgPAAEEAQB9ssj'+
		'fAAAAGmZjVEwAAAAAAAAAAQAAAAEAAAAAAAAAAAD6A+gBAbNU+2sAAAARZmRBVAAAAAE'+
		'ImWNgYGBgAAAABQAB6MzFdgAAAABJRU5ErkJggg==';

}); // define()

// vim: set noet ts=4 sts=4 sw=4 fenc=utf-8 foldmethod=marker :
