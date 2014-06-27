self._xhr.onreadystatechange = function () { // {{{4
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
