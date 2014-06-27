/**
 * Start uploading by FileReader
 *
 * @memberOf Uploader
 * @public
 * @static
 * @async
 */
Uploader.prototype.startUploading = function () { // {{{2

	var self = this;

	self.started = true;

	setTimeout(function () {
		self._reader.readAsBinaryString(self.params.file);
	}, 1);

}; // Uploader.prototype.startUploading() }}}2
