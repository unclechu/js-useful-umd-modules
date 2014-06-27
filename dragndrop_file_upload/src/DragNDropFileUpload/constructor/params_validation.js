// params validation {{{3

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

// params validation }}}3
