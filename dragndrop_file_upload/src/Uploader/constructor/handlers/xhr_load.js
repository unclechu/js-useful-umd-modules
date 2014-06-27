self._xhr.upload.addEventListener('load', function () { // {{{4
	self.progress = 100;
	self.finished = true;
	if (self.superclass.params.progressCallback instanceof Function) {
		self.superclass.params.progressCallback.call(
			self, self.params.id, self.progress, self.loaded, self.total
		);
	}
}); // 'load' event }}}4
