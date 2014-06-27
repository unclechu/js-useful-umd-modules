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
 *
 * @prop {Error} UnsupportedFeature
 * @prop {Error} FileReaderIsNotSupported
 * @prop {Error} XMLHttpRequestIsNotSupported
 * @prop {Error} ArrayPrototypeMapIsNotSupported
 * @prop {Error} Uint8ArrayIsNotSupported
 * @static
 * @readOnly
 */

Uploader.exceptions = {};

/** @typedef {Error} Uploader~IncorrectSuperclass */
Uploader.exceptions.IncorrectSuperclass = function (message) {
	Error.call(this);
	this.name = 'IncorrectSuperclass';
	this.message = message || 'Superclass must be an instanceof "DragNDropFileUpload".';
};

/** @typedef {Error} Uploader~IncorrectArgument */
Uploader.exceptions.IncorrectArgument = function (message, argName) {
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
Uploader.exceptions.NoCallback = function (message) {
	Error.call(this);
	this.name = 'NoCallback';
	this.message = message || 'No callback.';
};

/** @typedef {Error} Uploader~NoParams */
Uploader.exceptions.NoParams = function (message) {
	Error.call(this);
	this.name = 'NoParams';
	this.message = message || 'No params.';
};

/** @typedef {Error} Uploader~IncorrectParamValue */
Uploader.exceptions.IncorrectParamValue = function (message, param) {
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
Uploader.exceptions.RequiredParam = function (message, param) {
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
Uploader.exceptions.UnknownParameter = function (message, param) {
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
Uploader.exceptions.UploadingIsStarted = function (message) {
	Error.call(this);
	this.name = 'UploadingIsStarted';
	this.message = message || 'Uploading is started.';
};

/** @typedef {Error} Uploader~UploadingIsNotStarted */
Uploader.exceptions.UploadingIsNotStarted = function (message) {
	Error.call(this);
	this.name = 'UploadingIsNotStarted';
	this.message = message || 'Uploading is not started.';
};

/** @typedef {Error} Uploader~UploadingIsAlreadyAborted */
Uploader.exceptions.UploadingIsAlreadyAborted = function (message) {
	Error.call(this);
	this.name = 'UploadingIsAlreadyAborted';
	this.message = message || 'Uploading is already aborted.';
};

/** @typedef {Error} Uploader~UploadingIsFinished */
Uploader.exceptions.UploadingIsFinished = function (message) {
	Error.call(this);
	this.name = 'UploadingIsFinished';
	this.message = message || 'Uploading is finished.';
};

/** @typedef {Error} Uploader~UploadError */
Uploader.exceptions.UploadError = function (message, filename) {
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

/** @typedef {Error} Uploader~UnsupportedFeature */
Uploader.exceptions.UnsupportedFeature = function (message) {
	Error.call(this);
	this.name = 'UnsupportedFeature';
	this.message = message || 'Unsupported feature.';
};

for (key in Uploader.exceptions) {
	Uploader.exceptions[key].prototype = inherit(Error.prototype);
}

/** @typedef {Error} Uploader~XHRUploadError */
Uploader.exceptions.XHRUploadError = function (message, filename) {
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
Uploader.exceptions.ResponseStatusCodeError = function (message, filename, statusCode) {
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
Uploader.exceptions.ResponseBeforeFinished = function (message, filename) {
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

/** @typedef {Error} Uploader~FileReaderIsNotSupported */
Uploader.exceptions.FileReaderIsNotSupported = function (message) {
	Error.call(this);
	this.name = 'FileReaderIsNotSupported';
	this.message = message || 'FileReader is not supported.';
};
Uploader.exceptions.FileReaderIsNotSupported.prototype =
inherit(Uploader.exceptions.UnsupportedFeature.prototype);

/** @typedef {Error} Uploader~XMLHttpRequestIsNotSupported */
Uploader.exceptions.XMLHttpRequestIsNotSupported = function (message) {
	Error.call(this);
	this.name = 'XMLHttpRequestIsNotSupported';
	this.message = message || 'XMLHttpRequest is not supported.';
};
Uploader.exceptions.XMLHttpRequestIsNotSupported.prototype =
inherit(Uploader.exceptions.UnsupportedFeature.prototype);

/** @typedef {Error} Uploader~ArrayPrototypeMapIsNotSupported */
Uploader.exceptions.ArrayPrototypeMapIsNotSupported = function (message) {
	Error.call(this);
	this.name = 'ArrayPrototypeMapIsNotSupported';
	this.message = message || 'Array.prototype.map is not supported.';
};
Uploader.exceptions.ArrayPrototypeMapIsNotSupported.prototype =
inherit(Uploader.exceptions.UnsupportedFeature.prototype);

/** @typedef {Error} Uploader~Uint8ArrayIsNotSupported */
Uploader.exceptions.Uint8ArrayIsNotSupported = function (message) {
	Error.call(this);
	this.name = 'Uint8ArrayIsNotSupported';
	this.message = message || 'Uint8Array is not supported.';
};
Uploader.exceptions.Uint8ArrayIsNotSupported.prototype =
inherit(Uploader.exceptions.UnsupportedFeature.prototype);

// Uploader exceptions }}}2
