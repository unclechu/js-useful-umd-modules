// params validation {{{3

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

// params validation }}}3
