// exceptions {{{2

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
 * @static
 * @readOnly
 */

DragNDropFileUpload.exceptions = {};

/** @typedef {Error} DragNDropFileUpload~IncorrectArgument */
DragNDropFileUpload.exceptions.IncorrectArgument = function (message, argName) {
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
DragNDropFileUpload.exceptions.NoParams = function (message) {
	Error.call(this);
	this.name = 'NoParams';
	this.message = message || 'No params.';
};

/** @typedef {Error} DragNDropFileUpload~IncorrectParamValue */
DragNDropFileUpload.exceptions.IncorrectParamValue = function (message, param) {
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
DragNDropFileUpload.exceptions.RequiredParam = function (message, param) {
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
DragNDropFileUpload.exceptions.DragNDropAreaBlockNotFound = function (message) {
	Error.call(this);
	this.name = 'DragNDropAreaBlockNotFound';
	this.message = message || 'Drag&drop block not found by param value "dragndropArea".';
};

/** @typedef {Error} DragNDropFileUpload~UnknownParameter */
DragNDropFileUpload.exceptions.UnknownParameter = function (message, param) {
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
DragNDropFileUpload.exceptions.IncorrectMIMEType = function (message, mimeType, filename) {
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
DragNDropFileUpload.exceptions.IncorrectUploadId = function (message, uploadId) {
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
DragNDropFileUpload.exceptions.UploaderNotFoundById = function (message, uploadId) {
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

for (key in DragNDropFileUpload.exceptions) {
	DragNDropFileUpload.exceptions[key].prototype = inherit(Error.prototype);
}

// exceptions }}}2
