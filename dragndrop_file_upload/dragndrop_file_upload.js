/**
 * Drag'n'drop file upload module
 *
 * @module dragndrop_file_upload
 * @exports DragNDropFileUpload, Uploader (as DragNDropFileUpload.Uploader)
 * @requires jquery
 * @requires HTML5 FileAPI
 * @requires XMLHttpRequest
 * @version r1
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 */

define(['jquery'], function ($) {

	var key; // for "for"

	/**
	 * Helper for cloning prototypes
	 *
	 * @private
	 * @innter
	 */
	function inherit(proto) {
		if (Object.create) return Object.create(proto);
		function F() {}
		F.prototype = proto;
		return new F();
	}

	/**
	 * @private
	 * @inner
	 */
	var defaultParams = { // {{{1

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
		uploaderInitCallback: null,

	}; // defaultParams }}}1

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
	 * @exception {Error} DragNDropFileUpload~IncorrectArgument
	 * @exception {Error} DragNDropFileUpload~NoParams
	 * @exception {Error} DragNDropFileUpload~IncorrectParamValue
	 * @exception {Error} DragNDropFileUpload~RequiredParam
	 * @exception {Error} DragNDropFileUpload~DragNDropAreaBlockNotFound
	 * @exception {Error} DragNDropFileUpload~UnknownParameter
	 * @exception {Error} DragNDropFileUpload~FileReaderIsNotSupported
	 * @exception {Error} DragNDropFileUpload~XMLHttpRequestIsNotSupported
	 */
	function DragNDropFileUpload(params, callback) { // {{{1

		/** @private */ var self = this;
		/** @private */ var key;
		/** @private */ self._callback = callback;

		callback = undefined;

		// validate arguments {{{2

		if ($.type(self._callback) !== 'undefined' && !(self._callback instanceof Function)) {
			throw new DragNDropFileUpload.exceptions.IncorrectArgument(null, 'callback');
		}

		if ($.type(params) === 'undefined') {
			self.makeError(new DragNDropFileUpload.exceptions.NoParams());
			return false;
		}

		if (!$.isPlainObject(params)) {
			self.makeError(new Uploader.exceptions.IncorrectArgument(null, 'params'));
			return false;
		}

		// validate arguments }}}2

		if (!window.FileReader) {
			self.makeError(new DragNDropFileUpload.exceptions.FileReaderIsNotSupported());
			return false;
		}

		if (!window.XMLHttpRequest) {
			self.makeError(new DragNDropFileUpload.exceptions.XMLHttpRequestIsNotSupported());
			return false;
		}

		// params list {{{2

		/**
		 * @public
		 * @instance
		 * @readOnly
		 */
		self.params = $.extend({}, defaultParams, params || {});

		// params list }}}2

		// validation of params {{{2

		if (!('dragndropArea' in params)) {
			self.makeError(new DragNDropFileUpload.exceptions.RequiredParam(null, 'dragndropArea'));
			return false;
		}

		if (
			!(params.dragndropArea instanceof $) &&
			$.type(params.dragndropArea) !== 'object' &&
			$.type(params.dragndropArea) !== 'string'
		) {
			self.makeError(new DragNDropFileUpload.exceptions.IncorrectParamValue(null, 'dragndropArea'));
			return false;
		}

		if ($(params.dragndropArea).size() <= 0) {
			self.makeError(new DragNDropFileUpload.exceptions.DragNDropAreaBlockNotFound());
			return false;
		}

		if (!('uploadUrl' in params)) {
			self.makeError(new DragNDropFileUpload.exceptions.RequiredParam(null, 'uploadUrl'));
			return false;
		}

		if ($.type(params.uploadUrl) !== 'string') {
			self.makeError(new DragNDropFileUpload.exceptions.IncorrectParamValue(null, 'uploadUrl'));
			return false;
		}

		if (
			'fileFieldName' in params &&
			$.type(params.fileFieldName) !== 'string'
		) {
			self.makeError(new DragNDropFileUpload.exceptions.IncorrectParamValue(null, 'fileFieldName'));
			return false;
		}

		if (
			'progressCallback' in params &&
			!(params.progressCallback instanceof Function) &&
			params.progressCallback !== null
		) {
			self.makeError(new DragNDropFileUpload.exceptions.IncorrectParamValue(null, 'progressCallback'));
			return false;
		}

		if (
			'addFileCallback' in params &&
			!(params.addFileCallback instanceof Function) &&
			params.progressCallback !== null
		) {
			self.makeError(new DragNDropFileUpload.exceptions.IncorrectParamValue(null, 'addFileCallback'));
			return false;
		}

		if (
			'endCallback' in params &&
			!(params.endCallback instanceof Function) &&
			params.progressCallback !== null
		) {
			self.makeError(new DragNDropFileUpload.exceptions.IncorrectParamValue(null, 'endCallback'));
			return false;
		}

		if (
			'dragOverClass' in params &&
			$.type(params.dragOverClass) !== 'string'
		) {
			self.makeError(new DragNDropFileUpload.exceptions.IncorrectParamValue(null, 'dragOverClass'));
			return false;
		}

		if (
			'bindSuffix' in params &&
			$.type(params.bindSuffix) !== 'string'
		) {
			self.makeError(new DragNDropFileUpload.exceptions.IncorrectParamValue(null, 'bindSuffix'));
			return false;
		}

		if (
			'postData' in params &&
			$.type(params.postData) !== 'object'
		) {
			self.makeError(new DragNDropFileUpload.exceptions.IncorrectParamValue(null, 'postData'));
			return false;
		}

		for (key in params.postData) {
			if ($.type(params.postData[key]) !== 'string' && $.type(params.postData[key]) !== 'number') {
				self.makeError(new DragNDropFileUpload.exceptions.IncorrectParamValue(null, 'postData'));
				return false;
			}
		}

		if (
			'uploaderInitCallback' in params &&
			!(params.uploaderInitCallback instanceof Function) &&
			params.uploaderInitCallback !== null
		) {
			self.makeError(new DragNDropFileUpload.exceptions.IncorrectParamValue(null, 'uploaderInitCallback'));
			return false;
		}

		for (key in params) {
			if (!(key in defaultParams)) {
				self.makeError(new DragNDropFileUpload.exceptions.UnknownParameter(null, key));
				return false;
			}
		}

		// validation of params }}}2

		params = undefined;

		self.params.dragndropArea = $(self.params.dragndropArea);

		/** @private */ self._uploaders = [];
		/** @private */ self._lastID = 0;

		self.params.dragndropArea
			.on('dragenter' + self.params.bindSuffix, function () {
				$(this).addClass( self.params.dragOverClass );
				return false;
			})
			.on('dragover' + self.params.bindSuffix, function () {
				return false;
			})
			.on('dragleave' + self.params.bindSuffix, function () {
				$(this).removeClass( self.params.dragOverClass );
				return false;
			})
			.on('drop' + self.params.bindSuffix, function (e) { // {{{2
				$(this).removeClass( self.params.dragOverClass );
				var dt = e.originalEvent.dataTransfer;
				$.each(dt.files, function (i, file) {
					var mimeOk = true;

					$.each(self.params.mimeTypeFilter, function (n, mimeReg) {
						if (!file.type.match(mimeReg)) mimeOk = false;
					});

					if (mimeOk) {
						var uploadID = ++self._lastID;
						var dataToPost = $.extend({}, self.params.postData);

						new Uploader(self, {
							id: uploadID,
							file: file,
							url: self.params.uploadUrl,
							fileFieldName: self.params.fileFieldName,
							postData: dataToPost,
						}, function (err) {
							if (err) {
								if (self.params.addFileCallback instanceof Function) {
									setTimeout(function () {
										self.params.addFileCallback.call(null, err, uploadID);
									}, 1);
								}
								return;
							}

							var uploader = this;
							self._uploaders.push(uploader);

							setTimeout(function () {
								if (self.params.addFileCallback instanceof Function) {
									self.params.addFileCallback.call(
										uploader, null, uploadID, file.name, file.size, file.type
									);
								}

								if (self.params.uploaderInitCallback instanceof Function) {
									self.params.uploaderInitCallback.call(uploader);
								}

								uploader.startUploading();
							}, 1);
						});
					} else {
						if (self.params.addFileCallback instanceof Function) {
							setTimeout(function () {
								self.params.addFileCallback.call(
									null,
									new DragNDropFileUpload.exceptions.IncorrectMIMEType(null, file.type, file.name),
									uploadID
								);
							}, 1);
						}
					}
				});
				return false;
			}); // on drop }}}2

		if (self._callback) setTimeout($.proxy(self._callback, self, null), 1);

	} // DragNDropFileUpload() }}}1

	/**
	 * Throw error or delegate exception to callback
	 *
	 * @memberOf DragNDropFileUpload
	 * @protected
	 * @static
	 * @param {Error} exception
	 * @returns {boolean} Returns true or throws exception
	 */
	DragNDropFileUpload.prototype.makeError = // {{{1
	function makeError(exception) {

		var self = this;

		if (self._callback) {
			setTimeout($.proxy(self._callback, self, exception), 1);
			return true;
		}

		throw exception;

	}; // DragNDropFileUpload.prototype.makeError() }}}1

	/**
	 * @memberOf DragNDropFileUpload
	 * @private
	 * @static
	 */
	DragNDropFileUpload.prototype.destroy = // {{{1
	function destroy() {

		var self = this;

		$.each(self._uploaders, function (i, uploader) {
			uploader.destroy();
		});

		self.params.dragndropArea
			.off('dragenter' + self.params.bindSuffix)
			.off('dragover' + self.params.bindSuffix)
			.off('dragleave' + self.params.bindSuffix)
			.off('drop' + self.params.bindSuffix);

		self._callback = undefined;
		self.params = undefined;
		self._uploaders = undefined;

	}; // DragNDropFileUpload.prototype.destroy() }}}1

	/**
	 * Abort uploading by upload id
	 *
	 * @memberOf DragNDropFileUpload
	 * @public
	 * @static
	 * @exception {Error} DragNDropFileUpload~IncorrectUploadId
	 * @exception {Error} DragNDropFileUpload~UploaderNotFoundById
	 * @exception {Error} Uploader~UploadingIsNotStarted
	 */
	DragNDropFileUpload.prototype.abort = // {{{1
	function abort(uploadId) {

		var self = this;
		var found = false;

		if ($.type(uploadId) !== 'number') throw new DragNDropFileUpload.exceptions.IncorrectUploadId(null, uploadId);

		$.each(self._uploaders, function (i, uploader) {
			if (uploader.params.id === uploadId) {
				if (!uploader.started) throw new Uploader.exceptions.UploadingIsNotStarted();
				uploader.abort();
				found = true;
			}
		});

		if (!found) throw new DragNDropFileUpload.exceptions.UploaderNotFoundById(null, uploadId);

	}; // DragNDropFileUpload.prototype.abort() }}}1

	// exceptions {{{1

	/**
	 * DragNDropFileUpload exceptions
	 *
	 * @memberOf DragNDropFileUpload
	 * @public
	 * @type {Object.<Error>}
	 * @prop {Error} IncorrectArgument
	 * @prop {Error} NoParams
	 * @prop {Error} IncorrectParamValue
	 * @prop {Error} RequiredParam
	 * @prop {Error} DragNDropAreaBlockNotFound
	 * @prop {Error} UnknownParameter
	 * @prop {Error} IncorrectMIMEType
	 * @prop {Error} IncorrectUploadId
	 * @prop {Error} UploaderNotFoundById
	 * @prop {Error} UnsupportedFeature
	 * @prop {Error} FileReaderIsNotSupported
	 * @prop {Error} XMLHttpRequestIsNotSupported
	 * @static
	 * @readOnly
	 */

	DragNDropFileUpload.exceptions = {};

	/** @typedef {Error} DragNDropFileUpload~IncorrectArgument */
	DragNDropFileUpload.exceptions.IncorrectArgument =
	function IncorrectArgument(message, argName) {
		Error.call(this);
		this.name = 'IncorrectArgument';
		if (argName) this.argumentName = argName;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect ';
			if (argName) this.message += '"'+ argName +'" ';
			this.message += 'argument value.';
		}
	};

	/** @typedef {Error} DragNDropFileUpload~NoParams */
	DragNDropFileUpload.exceptions.NoParams =
	function NoParams(message) {
		Error.call(this);
		this.name = 'NoParams';
		this.message = message || 'No params.';
	};

	/** @typedef {Error} DragNDropFileUpload~IncorrectParamValue */
	DragNDropFileUpload.exceptions.IncorrectParamValue =
	function IncorrectParamValue(message, param) {
		Error.call(this);
		this.name = 'IncorrectParamValue';
		if (param) this.paramName = param;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect ';
			if (param) this.message += '"'+ param +'" ';
			this.message += 'param value.';
		}
	};

	/** @typedef {Error} DragNDropFileUpload~RequiredParam */
	DragNDropFileUpload.exceptions.RequiredParam =
	function RequiredParam(message, param) {
		Error.call(this);
		this.name = 'RequiredParam';
		if (param) this.paramName = param;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Param ';
			if (param) this.message += '"'+ param +'" ';
			this.message += 'is required.';
		}
	};

	/** @typedef {Error} DragNDropFileUpload~DragNDropAreaBlockNotFound */
	DragNDropFileUpload.exceptions.DragNDropAreaBlockNotFound =
	function DragNDropAreaBlockNotFound(message) {
		Error.call(this);
		this.name = 'DragNDropAreaBlockNotFound';
		this.message = message || 'Drag&drop block not found by param value "dragndropArea".';
	};

	/** @typedef {Error} DragNDropFileUpload~UnknownParameter */
	DragNDropFileUpload.exceptions.UnknownParameter =
	function UnknownParameter(message, param) {
		Error.call(this);
		this.name = 'UnknownParameter';
		if (param) this.paramName = param;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Unknown parameter';
			if (param) this.message += ' "'+ param +'"';
			this.message += '.';
		}
	};

	/** @typedef {Error} DragNDropFileUpload~IncorrectMIMEType */
	DragNDropFileUpload.exceptions.IncorrectMIMEType =
	function IncorrectMIMEType(message, mimeType, filename) {
		Error.call(this);
		this.name = 'IncorrectMIMEType';
		if (mimeType) this.mimeType = mimeType;
		if (filename) this.filename = filename;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect MIME-type';
			if (mimeType) this.message += ' "'+ mimeType +'"';
			this.message += ' of file';
			if (filename) this.message += ' "'+ filename +'"';
			this.message += '.';
		}
	};

	/** @typedef {Error} DragNDropFileUpload~IncorrectUploadId */
	DragNDropFileUpload.exceptions.IncorrectUploadId =
	function IncorrectUploadId(message, uploadId) {
		Error.call(this);
		this.name = 'IncorrectUploadId';
		if (uploadId) this.uploadId = uploadId;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect type of upload ID';
			if (uploadId) this.message += ' ("'+ $.type(uploadId) +'")';
			this.message += ', must be a "number".';
		}
	};

	/** @typedef {Error} DragNDropFileUpload~UploaderNotFoundById */
	DragNDropFileUpload.exceptions.UploaderNotFoundById =
	function UploaderNotFoundById(message, uploadId) {
		Error.call(this);
		this.name = 'UploaderNotFoundById';
		if (uploadId) this.uploadId = uploadId;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Uploader not found by ID';
			if (uploadId) this.message += ': "'+ uploadId +'"';
			this.message += '.';
		}
	};

	/** @typedef {Error} DragNDropFileUpload~UnsupportedFeature */
	DragNDropFileUpload.exceptions.UnsupportedFeature =
	function UnsupportedFeature(message) {
		Error.call(this);
		this.name = 'UnsupportedFeature';
		this.message = message || 'Unsupported feature.';
	};

	for (key in DragNDropFileUpload.exceptions) {
		DragNDropFileUpload.exceptions[key].prototype = inherit(Error.prototype);
	}

	/** @typedef {Error} DragNDropFileUpload~FileReaderIsNotSupported */
	DragNDropFileUpload.exceptions.FileReaderIsNotSupported =
	function FileReaderIsNotSupported(message) {
		Error.call(this);
		this.name = 'FileReaderIsNotSupported';
		this.message = message || 'FileReader is not supported.';
	};
	DragNDropFileUpload.exceptions.FileReaderIsNotSupported.prototype =
	inherit(DragNDropFileUpload.exceptions.UnsupportedFeature.prototype);

	/** @typedef {Error} DragNDropFileUpload~XMLHttpRequestIsNotSupported */
	DragNDropFileUpload.exceptions.XMLHttpRequestIsNotSupported =
	function XMLHttpRequestIsNotSupported(message) {
		Error.call(this);
		this.name = 'XMLHttpRequestIsNotSupported';
		this.message = message || 'FileReader is not supported.';
	};
	DragNDropFileUpload.exceptions.XMLHttpRequestIsNotSupported.prototype =
	inherit(DragNDropFileUpload.exceptions.UnsupportedFeature.prototype);

	// exceptions }}}1

	// unit tests {{{1

	DragNDropFileUpload.unitTests = {
		'All exceptions is instanceof Error': function () {
			for (var key in DragNDropFileUpload.exceptions) {
				if (!((new DragNDropFileUpload.exceptions[key]()) instanceof Error)) return false;
			}
			return true;
		},
		'All exceptions is instanceof themselves': function () {
			for (var key in DragNDropFileUpload.exceptions) {
				if (!((new DragNDropFileUpload.exceptions[key]()) instanceof DragNDropFileUpload.exceptions[key])) return false;
			}
			return true;
		},
		'Exception "FileReaderIsNotSupported" is instanceof "UnsupportedFeature"': function () {
			if (!((new DragNDropFileUpload.exceptions.FileReaderIsNotSupported()) instanceof DragNDropFileUpload.exceptions.UnsupportedFeature)) return false;
			return true;
		},
		'Exception "XMLHttpRequestIsNotSupported" is instanceof "UnsupportedFeature"': function () {
			if (!((new DragNDropFileUpload.exceptions.XMLHttpRequestIsNotSupported()) instanceof DragNDropFileUpload.exceptions.UnsupportedFeature)) return false;
			return true;
		}
	};

	DragNDropFileUpload.unitTesting = function unitTesting() {
		window.console.group('Unit testing of "DragNDropFileUpload"...');
		for (var key in DragNDropFileUpload.unitTests) {
			var res = DragNDropFileUpload.unitTests[key]();
			if (res) {
				window.console.info(key + ' ... [PASSED]');
			} else {
				window.console.warn(key + ' ... [NOT PASSED]');
			}
		}
		window.console.groupEnd();
	};

	// unit tests }}}1

	// Uploader class {{{1

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
		postData: null,

	}; // uploaderDefaultParams }}}2

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
	 */
	function Uploader(superclass, params, callback) { // {{{2

		/** @private */ var self = this;
		/** @private */ var key;
		/** @private */ self._callback = callback;

		callback = undefined;

		// validate arguments {{{3

		if ($.type(self._callback) === 'undefined') {
			throw new Uploader.exceptions.NoCallback();
		}

		if (!(self._callback instanceof Function)) {
			throw new Uploader.exceptions.IncorrectArgument(null, 'callback');
		}

		if (!(superclass instanceof DragNDropFileUpload)) {
			self.makeError(new Uploader.exceptions.IncorrectSuperclass());
			return false;
		}

		if ($.type(params) === 'undefined') {
			self.makeError(new Uploader.exceptions.NoParams());
			return false;
		}

		if (!$.isPlainObject(params)) {
			self.makeError(new Uploader.exceptions.IncorrectArgument(null, 'params'));
			return false;
		}

		// validate arguments }}}3

		/**
		 * @public
		 * @instance
		 * @readOnly
		 */
		self.superclass = superclass;

		superclass = undefined;

		// params list {{{3

		/**
		 * @public
		 * @instance
		 * @readOnly
		 */
		self.params = $.extend({}, uploaderDefaultParams, params || {});

		// params list }}}3

		// validation of params {{{3

		if (!('id' in params)) {
			self.makeError(new Uploader.exceptions.RequiredParam(null, 'id'));
			return false;
		}

		if ($.type(params.id) !== 'number') {
			self.makeError(new Uploader.exceptions.IncorrectParamValue(null, 'id'));
			return false;
		}

		if (!('file' in params)) {
			self.makeError(new Uploader.exceptions.RequiredParam(null, 'file'));
			return false;
		}

		if ($.type(params.file) !== 'object') {
			self.makeError(new Uploader.exceptions.IncorrectParamValue(null, 'file'));
			return false;
		}

		if (!('name' in params.file)) {
			self.makeError(new Uploader.exceptions.RequiredParam(null, 'file.name'));
			return false;
		}

		if ($.type(params.file.name) !== 'string') {
			self.makeError(new Uploader.exceptions.IncorrectParamValue(null, 'file.name'));
			return false;
		}

		if (!('size' in params.file)) {
			self.makeError(new Uploader.exceptions.RequiredParam(null, 'file.size'));
			return false;
		}

		if ($.type(params.file.size) !== 'number') {
			self.makeError(new Uploader.exceptions.IncorrectParamValue(null, 'file.size'));
			return false;
		}

		if (!('type' in params.file)) {
			self.makeError(new Uploader.exceptions.RequiredParam(null, 'file.type'));
			return false;
		}

		if ($.type(params.file.type) !== 'string') {
			self.makeError(new Uploader.exceptions.IncorrectParamValue(null, 'file.type'));
			return false;
		}

		if (!('url' in params)) {
			self.makeError(new Uploader.exceptions.RequiredParam(null, 'url'));
			return false;
		}

		if ($.type(params.url) !== 'string') {
			self.makeError(new Uploader.exceptions.IncorrectParamValue(null, 'url'));
			return false;
		}

		if ($.type(params.fileFieldName) !== 'undefined' && $.type(params.fileFieldName) !== 'string') {
			self.makeError(new Uploader.exceptions.IncorrectParamValue(null, 'fileFieldName'));
			return false;
		}

		if (
			'postData' in params &&
			$.type(params.postData) !== 'object'
		) {
			self.makeError(new Uploader.exceptions.IncorrectParamValue(null, 'postData'));
			return false;
		}

		for (key in params.postData) {
			if ($.type(params.postData[key]) !== 'string' && $.type(params.postData[key]) !== 'number') {
				self.makeError(new Uploader.exceptions.IncorrectParamValue(null, 'postData'));
				return false;
			}
		}

		for (key in params) {
			if (!(key in uploaderDefaultParams)) {
				self.makeError(new Uploader.exceptions.UnknownParameter(null, key));
				return false;
			}
		}

		// validation of params }}}3

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

		self._reader.onload = function onAddedFileToUpload() { // {{{3

			self._xhr.upload.addEventListener('progress', function (e) { // {{{4
				if (e.lengthComputable) {
					if (self.total === null) self.total = e.total;
					self.loaded = e.loaded;
					self.progress = (self.loaded * 100.0) / self.total;
					if (self.superclass.params.progressCallback instanceof Function) {
						self.superclass.params.progressCallback.call(
							self, self.params.id, self.progress, self.loaded, self.total
						);
					}
				}
			}, false); // 'progress' event }}}4

			self._xhr.upload.addEventListener('load', function () { // {{{4
				self.progress = 100;
				self.finished = true;
				if (self.superclass.params.progressCallback instanceof Function) {
					self.superclass.params.progressCallback.call(
						self, self.params.id, self.progress, self.loaded, self.total
					);
				}
			}); // 'load' event }}}4

			self._xhr.upload.addEventListener('error', function () { // {{{4
				self._xhr.onreadystatechange = null;
				if (self.superclass.params.endCallback instanceof Function) {
					setTimeout(function () {
						self.superclass.params.endCallback.call(
							self,
							new Uploader.exceptions.XHRUploadError(null, self.params.file.name),
							self.params.id
						);
					}, 1);
				}
			}); // 'error' event }}}4

			self._xhr.onreadystatechange = function onreadystatechange() { // {{{4
				if (this.readyState === 4) {
					if (self.aborted) return;

					if (this.status === 200) {
						if (!self.finished) {
							self.successful = false;
							if (self.superclass.params.endCallback instanceof Function) {
								setTimeout(function () {
									self.superclass.params.endCallback.call(
										self,
										new Uploader.exceptions.ResponseBeforeFinished(null, self.params.file.name),
										self.params.id
									);
								}, 1);
							}
						} else {
							self.successful = true;
							var response = this.responseText;
							if (self.superclass.params.endCallback instanceof Function) {
								setTimeout(function () {
									self.superclass.params.endCallback.call(
										self, null, self.params.id, response
									);
								}, 1);
							}
						}
					} else {
						self.successful = false;
						if (self.superclass.params.endCallback instanceof Function) {
							setTimeout(function () {
								self.superclass.params.endCallback.call(
									self,
									new Uploader.exceptions.ResponseStatusCodeError(null, self.params.file.name, this.status),
									self.params.id
								);
							}, 1);
						}
					} // if (this.status === 200)
				} // if (this.readyState === 4)
			}; // self._xhr.onreadystatechange }}}4

			self._xhr.open('POST', self.params.url, true);

			var boundary = 'xxxxxxxxx';
			self._xhr.setRequestHeader('Content-Type', 'multipart/form-data, boundary='+boundary);
			self._xhr.setRequestHeader('Cache-Control', 'no-cache');
			self._xhr.setRequestHeader('Pragma', 'no-cache');
			self._xhr.setRequestHeader('Expires', '0');

			var body = '';

			// the file
			body += '--' + boundary + '\r\n';
			body += 'Content-Disposition: form-data; name="'+
				self.params.fileFieldName +
				'"; filename="'+
				self.params.file.name +
				'"\r\n';
			body += 'Content-Type: application/octet-stream\r\n\r\n';
			body += self._reader.result + '\r\n';

			// custom data
			for (var key in self._toPost) {
				body += '--' + boundary + '\r\n';
				body += 'Content-Disposition: form-data; name="'+ key +'"\r\n';
				body += 'Content-Type: text/plain; charset=utf-8\r\n\r\n';
				body += self._toPost[key].toString() + '\r\n';
			}

			body += '--' + boundary + '--';

			if (self._xhr.sendAsBinary) {
				// firefox
				self._xhr.sendAsBinary(body);
			} else {
				// chrome (W3C spec.)
				self._xhr.send(body);
			}

		}; // self._reader.onload() }}}3

		if (self._callback) setTimeout($.proxy(self._callback, self, null), 1);

	} // Uploader() }}}2

	/**
	 * Throw error or delegate exception to callback
	 *
	 * @memberOf Uploader
	 * @protected
	 * @static
	 * @param {Error} exception
	 * @returns {boolean} Returns true or throws exception
	 */
	Uploader.prototype.makeError = // {{{2
	function makeError(exception) {

		var self = this;

		if (self._callback) {
			setTimeout($.proxy(self._callback, self, exception), 1);
			return true;
		}

		throw exception;

	}; // Uploader.prototype.makeError() }}}2

	/**
	 * @memberOf Uploader
	 * @private
	 * @static
	 */
	Uploader.prototype.destroy = // {{{2
	function destroy() {

		var self = this;

		self.superclass = undefined;
		self._callback = undefined;
		self.params = undefined;

		self._xhr = undefined;
		self._reader = undefined;

		self.progress = undefined;
		self.total = undefined;
		self.loaded = undefined;
		self.finished = undefined;
		self.started = undefined;
		self._toPost = undefined;

	}; // Uploader.prototype.destroy }}}2

	/**
	 * Extend post data from params
	 * (can override)
	 *
	 * @memberOf Uploader
	 * @public
	 * @static
	 * @exception {Error} Uploader~UploadingIsStarted
	 */
	Uploader.prototype.extendPostData = // {{{2
	function extendPostData(postData) {

		var self = this;

		if (self.started) throw new Uploader.exceptions.UploadingIsStarted();

		self._toPost = $.extend({}, self._toPost, postData);

	}; // Uploader.prototype.extendPostData }}}2

	/**
	 * Abort uploading
	 *
	 * @memberOf Uploader
	 * @public
	 * @static
	 * @exception {Error} Uploader~UploadingIsNotStarted
	 * @exception {Error} Uploader~UploadingIsAlreadyAborted
	 * @exception {Error} Uploader~UploadingIsFinished
	 */
	Uploader.prototype.abort = // {{{2
	function abort() {

		var self = this;

		if (!self.started) throw new Uploader.exceptions.UploadingIsNotStarted();
		if (self.aborted) throw new Uploader.exceptions.UploadingIsAlreadyAborted();
		if (self.finished) throw new Uploader.exceptions.UploadingIsFinished();

		self.aborted = true;
		self._xhr.abort();
		self.successful = false;
		self.finished = true;

	}; // Uploader.prototype.abort }}}2

	/**
	 * Start uploading by FileReader
	 *
	 * @memberOf Uploader
	 * @public
	 * @static
	 * @async
	 */
	Uploader.prototype.startUploading = // {{{2
	function startUploading() {

		var self = this;

		self.started = true;

		setTimeout(function () {
			self._reader.readAsBinaryString(self.params.file);
		}, 1);

	}; // Uploader.prototype.makeError() }}}2

	// Uploader exceptions {{{2

	/**
	 * Uploader exceptions
	 *
	 * @memberOf Uploader
	 * @public
	 * @type {Object.<Error>}
	 * @prop {Error} IncorrectSuperclass
	 * @prop {Error} IncorrectArgument
	 * @prop {Error} NoCallback
	 * @prop {Error} NoParams
	 * @prop {Error} IncorrectParamValue
	 * @prop {Error} RequiredParam
	 * @prop {Error} UnknownParameter
	 * @prop {Error} UploadingIsStarted
	 * @prop {Error} UploadingIsNotStarted
	 * @prop {Error} UploadingIsAlreadyAborted
	 * @prop {Error} UploadingIsFinished
	 * @prop {Error} UploadError
	 * @prop {Error} XHRUploadError
	 * @prop {Error} ResponseStatusCodeError
	 * @prop {Error} ResponseBeforeFinished
	 * @static
	 * @readOnly
	 */

	Uploader.exceptions = {};

	/** @typedef {Error} Uploader~IncorrectSuperclass */
	Uploader.exceptions.IncorrectSuperclass =
	function IncorrectSuperclass(message) {
		Error.call(this);
		this.name = 'IncorrectSuperclass';
		this.message = message || 'Superclass must be an instanceof "DragNDropFileUpload".';
	};

	/** @typedef {Error} Uploader~IncorrectArgument */
	Uploader.exceptions.IncorrectArgument =
	function IncorrectArgument(message, argName) {
		Error.call(this);
		this.name = 'IncorrectArgument';
		if (argName) this.argumentName = argName;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect ';
			if (argName) this.message += '"'+ argName +'" ';
			this.message += 'argument value.';
		}
	};

	/** @typedef {Error} Uploader~NoCallback */
	Uploader.exceptions.NoCallback =
	function NoCallback(message) {
		Error.call(this);
		this.name = 'NoCallback';
		this.message = message || 'No callback.';
	};

	/** @typedef {Error} Uploader~NoParams */
	Uploader.exceptions.NoParams =
	function NoParams(message) {
		Error.call(this);
		this.name = 'NoParams';
		this.message = message || 'No params.';
	};

	/** @typedef {Error} Uploader~IncorrectParamValue */
	Uploader.exceptions.IncorrectParamValue =
	function IncorrectParamValue(message, param) {
		Error.call(this);
		this.name = 'IncorrectParamValue';
		if (param) this.paramName = param;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect ';
			if (param) this.message += '"'+ param +'" ';
			this.message += 'param value.';
		}
	};

	/** @typedef {Error} Uploader~RequiredParam */
	Uploader.exceptions.RequiredParam =
	function RequiredParam(message, param) {
		Error.call(this);
		this.name = 'RequiredParam';
		if (param) this.paramName = param;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Param ';
			if (param) this.message += '"'+ param +'" ';
			this.message += 'is required.';
		}
	};

	/** @typedef {Error} Uploader~UnknownParameter */
	Uploader.exceptions.UnknownParameter =
	function UnknownParameter(message, param) {
		Error.call(this);
		this.name = 'UnknownParameter';
		if (param) this.paramName = param;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Unknown parameter';
			if (param) this.message += ' "'+ param +'"';
			this.message += '.';
		}
	};

	/** @typedef {Error} Uploader~UploadingIsStarted */
	Uploader.exceptions.UploadingIsStarted =
	function UploadingIsStarted(message) {
		Error.call(this);
		this.name = 'UploadingIsStarted';
		this.message = message || 'Uploading is started.';
	};

	/** @typedef {Error} Uploader~UploadingIsNotStarted */
	Uploader.exceptions.UploadingIsNotStarted =
	function UploadingIsNotStarted(message) {
		Error.call(this);
		this.name = 'UploadingIsNotStarted';
		this.message = message || 'Uploading is not started.';
	};

	/** @typedef {Error} Uploader~UploadingIsAlreadyAborted */
	Uploader.exceptions.UploadingIsAlreadyAborted =
	function UploadingIsAlreadyAborted(message) {
		Error.call(this);
		this.name = 'UploadingIsAlreadyAborted';
		this.message = message || 'Uploading is already aborted.';
	};

	/** @typedef {Error} Uploader~UploadingIsFinished */
	Uploader.exceptions.UploadingIsFinished =
	function UploadingIsFinished(message) {
		Error.call(this);
		this.name = 'UploadingIsFinished';
		this.message = message || 'Uploading is finished.';
	};

	/** @typedef {Error} Uploader~UploadError */
	Uploader.exceptions.UploadError =
	function UploadError(message, filename) {
		Error.call(this);
		this.name = 'UploadError';
		if (filename) this.filename = filename;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Upload file';
			if (filename) this.message += ' "'+ filename +'"';
			this.message += ' to server error.';
		}
	};

	for (key in Uploader.exceptions) {
		Uploader.exceptions[key].prototype = inherit(Error.prototype);
	}

	/** @typedef {Error} Uploader~XHRUploadError */
	Uploader.exceptions.XHRUploadError =
	function XHRUploadError(message, filename) {
		Error.call(this);
		this.name = 'XHRUploadError';
		if (filename) this.filename = filename;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Upload file';
			if (filename) this.message += ' "'+ filename +'"';
			this.message += ' to server error.';
		}
	};
	Uploader.exceptions.XHRUploadError.prototype =
	inherit(Uploader.exceptions.UploadError.prototype);

	/** @typedef {Error} Uploader~ResponseStatusCodeError */
	Uploader.exceptions.ResponseStatusCodeError =
	function ResponseStatusCodeError(message, filename, statusCode) {
		Error.call(this);
		this.name = 'ResponseStatusCodeError';
		if (filename) this.filename = filename;
		if (statusCode) this.statusCode = statusCode;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Upload file';
			if (filename) this.message += ' "'+ filename +'"';
			this.message += ' to server error because status code is not: 200 OK';
			if (statusCode) this.message += ' (response status code: "'+ statusCode +'")';
			this.message += '.';
		}
	};
	Uploader.exceptions.ResponseStatusCodeError.prototype =
	inherit(Uploader.exceptions.UploadError.prototype);

	/** @typedef {Error} Uploader~ResponseBeforeFinished */
	Uploader.exceptions.ResponseBeforeFinished =
	function ResponseBeforeFinished(message, filename) {
		Error.call(this);
		this.name = 'ResponseBeforeFinished';
		if (filename) this.filename = filename;
		if (message) {
			this.message = message;
		} else {
			this.message = 'Upload file';
			if (filename) this.message += ' "'+ filename +'"';
			this.message += ' to server error (response before finished, may be timeout).';
		}
	};
	Uploader.exceptions.ResponseBeforeFinished.prototype =
	inherit(Uploader.exceptions.UploadError.prototype);

	// Uploader exceptions }}}2

	// Uploader class }}}1

	/**
	 * @public
	 * @static
	 */
	DragNDropFileUpload.Uploader = Uploader;

	return DragNDropFileUpload;

});
