/**
 * @callback Uploader~callback
 * @param {Error|Null} err Exception
 * @this {Uploader}
 */

/**
 * Uploader (public by DragNDropFileUpload.Uploader)
 *
 * @name Uploader
 * @constructor
 * @public
 * @param {DragNDropFileUpload} superclass
 * @param {Uploader~params} params
 * @param {Uploader~callback} callback
 * @exception {Error} Uploader~IncorrectSuperclass
 * @exception {Error} Uploader~IncorrectArgument
 * @exception {Error} Uploader~NoCallback
 * @exception {Error} Uploader~NoParams
 * @exception {Error} Uploader~IncorrectParamValue
 * @exception {Error} Uploader~RequiredParam
 * @exception {Error} Uploader~UnknownParameter
 *
 * @exception {Error} Uploader~FileReaderIsNotSupported
 * @exception {Error} Uploader~XMLHttpRequestIsNotSupported
 * @exception {Error} Uploader~ArrayPrototypeMapIsNotSupported
 * @exception {Error} Uploader~Uint8ArrayIsNotSupported
 */
function Uploader(superclass, params, callback) { // {{{2

	/** @private */ var self = this;
	/** @private */ var key;
	/** @private */ self._callback = callback;

	callback = undefined;

	// @include arguments_validation.js

	var err = checkForFeatures();
	if (err !== null) { self.makeError(err); return false; }

	/**
	 * @public
	 * @instance
	 * @readOnly
	 */
	self.superclass = superclass;

	superclass = undefined;

	/**
	 * @public
	 * @instance
	 * @readOnly
	 */
	self.params = $.extend({}, uploaderDefaultParams, params || {});

	// @include params_validation.js

	params = undefined;

	/** @private */ self._xhr = new XMLHttpRequest();
	/** @private */ self._reader = new FileReader();

	/**
	 * Progress of uploading in percents
	 *
	 * @public
	 * @instance
	 * @readOnly
	 */
	self.progress = null;

	/**
	 * Total size of uploading file in bytes
	 *
	 * @public
	 * @instance
	 * @readOnly
	 */
	self.total = null;

	/**
	 * Loaded bytes of uploading file
	 *
	 * @public
	 * @instance
	 * @readOnly
	 */
	self.loaded = null;

	/**
	 * Uploading is finished
	 *
	 * @public
	 * @instance
	 * @readOnly
	 */
	self.finished = false;

	/**
	 * File is successful uploaded
	 *
	 * @public
	 * @instance
	 * @readOnly
	 */
	self.successful = null;

	/**
	 * Uploading is started
	 *
	 * @public
	 * @instance
	 * @readOnly
	 */
	self.started = false;

	/**
	 * Uploading was aborted
	 *
	 * @public
	 * @instance
	 * @readOnly
	 */
	self.aborted = false;

	/** @private */ self._toPost = $.extend({}, self.params.postData);

	// @include handlers/main.js

	if (self._callback) setTimeout($.proxy(self._callback, self, null), 1);

} // Uploader() }}}2
