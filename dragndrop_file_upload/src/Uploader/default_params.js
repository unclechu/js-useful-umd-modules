/**
 * @private
 * @inner
 */
var uploaderDefaultParams = { // {{{2

	/**
	 * @typedef Uploader~params
	 * @type {Object.<*>}
	 * @prop {number} id
	 * @prop {Uploader~paramFile} file
	 * @prop {string} url
	 * @prop {string} [fileFieldName=file] POST field name of uploading file
	 * @prop {Object.<string|number>} [postData] Additional data to POST with file (example: { "foo": "bar", "foobar": 123 })
	 */

	id: null,

	/**
	 * @typedef Uploader~paramFile
	 * @type {Object.<*>}
	 * @prop {string} name File name
	 * @prop {number} size File size in bytes
	 * @prop {string} type File MIME-type
	 */
	file: null,

	url: null,
	fileFieldName: 'file',
	postData: null

}; // uploaderDefaultParams }}}2
