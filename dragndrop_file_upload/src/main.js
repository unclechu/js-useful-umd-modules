/**
 * Drag'n'drop file upload module
 *
 * @module dragndrop_file_upload
 * @exports DragNDropFileUpload, Uploader (as DragNDropFileUpload.Uploader)
 * @requires jquery
 * @requires HTML5 FileAPI
 * @requires XMLHttpRequest
 *
 * @version // @echo REVISION
 * @author // @echo AUTHOR
 * @license // @echo LICENSE
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 */

define(['jquery'], function ($) {

	var key; // for "for"

	// @include basic_helpers.js
	// @include DragNDropFileUpload/main.js
	// @include Uploader/main.js

	/**
	 * @public
	 * @static
	 */
	DragNDropFileUpload.Uploader = Uploader;

	return DragNDropFileUpload;

}); // define()
