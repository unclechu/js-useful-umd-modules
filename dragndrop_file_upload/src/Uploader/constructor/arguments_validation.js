// arguments validation {{{3

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

// arguments validation }}}3
