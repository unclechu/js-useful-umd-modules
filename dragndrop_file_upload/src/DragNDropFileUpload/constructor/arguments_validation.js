// arguments validation {{{3

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

// arguments validation }}}3
