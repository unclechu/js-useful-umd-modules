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
