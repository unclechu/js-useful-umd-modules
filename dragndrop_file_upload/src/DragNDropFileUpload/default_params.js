/**
 * @private
 * @inner
 */
var defaultParams = { // {{{2

	/**
	 * @typedef DragNDropFileUpload~params
	 * @type {Object.<*>}
	 * @prop {jQuery|DOM} dragndropArea
	 * @prop {string} uploadUrl
	 * @prop {string} [fileFieldName=file]
	 * @prop {DragNDropFileUpload~progressCallback} [progressCallback]
	 * @prop {DragNDropFileUpload~addFileCallback} [addFileCallback]
	 * @prop {DragNDropFileUpload~endCallback} [endCallback]
	 * @prop {string} [dragOverClass=dragndrop_over] Classname for dragndrop file is drag on the area
	 * @prop {string} [bindSuffix=.dragndrop_file_upload] Suffix for jQuery binds
	 * @prop {Array.<RegExp>} [mimeTypeFilter=any] Array of RegExp-s of filters by MIME-types
	 * @prop {Object.<string|number>} [postData] Additional data to POST with file (example: { "foo": "bar", "foobar": 123 })
	 * @prop {DragNDropFileUpload~uploaderInitCallback} [uploaderInitCallback] Callback between uploader is initialized and starting uploading
	 */

	dragndropArea: null,
	uploadUrl: null,
	fileFieldName: 'file',

	/**
	 * @callback DragNDropFileUpload~progressCallback
	 * @this {Uploader}
	 * @param {number} id Id of uploading file
	 * @param {float} progress Progress of uploading in percents
	 * @param {float} loaded Loaded bytes
	 * @param {float} total Total bytes of uploading file
	 */
	progressCallback: null,

	/**
	 * @callback DragNDropFileUpload~addFileCallback
	 * @this {Uploader|null}
	 * @param {Error|Null} err Exception
	 * @param {number} id Id of uploading file
	 * @param {string} fileName Filename
	 * @param {number} fileSize File size in bytes
	 * @param {string} fileType MIME-type of file
	 */
	addFileCallback: null,

	/**
	 * @callback DragNDropFileUpload~endCallback
	 * @this {Uploader}
	 * @param {Error|Null} err Exception
	 * @param {number} id Id of uploading file
	 * @param {string} response Response by server
	 */
	endCallback: null,

	dragOverClass: 'dragndrop_over',
	bindSuffix: '.dragndrop_file_upload',
	mimeTypeFilter: [ /.*/ ],
	postData: null,

	/**
	 * @callback DragNDropFileUpload~uploaderInitCallback
	 * @this {Uploader}
	 */
	uploaderInitCallback: null

}; // defaultParams }}}2
