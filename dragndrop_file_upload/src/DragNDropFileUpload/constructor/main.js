/**
 * @callback DragNDropFileUpload~callback
 * @param {Error|Null} err Exception
 * @this {DragNDropFileUpload}
 */

/**
 * @name DragNDropFileUpload
 * @constructor
 * @public
 * @param {DragNDropFileUpload~params} params
 * @param {DragNDropFileUpload~callback} [callback]
 *
 * @exception {Error} DragNDropFileUpload~IncorrectArgument
 * @exception {Error} DragNDropFileUpload~NoParams
 * @exception {Error} DragNDropFileUpload~IncorrectParamValue
 * @exception {Error} DragNDropFileUpload~RequiredParam
 * @exception {Error} DragNDropFileUpload~DragNDropAreaBlockNotFound
 * @exception {Error} DragNDropFileUpload~UnknownParameter
 *
 * @exception {Error} Uploader~FileReaderIsNotSupported
 * @exception {Error} Uploader~XMLHttpRequestIsNotSupported
 * @exception {Error} Uploader~ArrayPrototypeMapIsNotSupported
 * @exception {Error} Uploader~Uint8ArrayIsNotSupported
 */
function DragNDropFileUpload(params, callback) { // {{{2

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
	self.params = $.extend({}, defaultParams, params || {});

	// @include params_validation.js

	params = undefined;

	self.params.dragndropArea = $(self.params.dragndropArea);

	/** @private */ self._uploaders = [];
	/** @private */ self._lastID = 0;

	// @include handlers_bind.js

	if (self._callback) setTimeout($.proxy(self._callback, self, null), 1);

} // DragNDropFileUpload() }}}2
