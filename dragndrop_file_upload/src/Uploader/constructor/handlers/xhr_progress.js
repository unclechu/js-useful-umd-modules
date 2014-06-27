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
