/**
 * Abort uploading
 *
 * @memberOf Uploader
 * @public
 * @static
 * @exception {Error} Uploader~UploadingIsNotStarted
 * @exception {Error} Uploader~UploadingIsAlreadyAborted
 * @exception {Error} Uploader~UploadingIsFinished
 */
Uploader.prototype.abort = function () { // {{{2

	var self = this;

	if (!self.started) throw new Uploader.exceptions.UploadingIsNotStarted();
	if (self.aborted) throw new Uploader.exceptions.UploadingIsAlreadyAborted();
	if (self.finished) throw new Uploader.exceptions.UploadingIsFinished();

	self.aborted = true;
	self._xhr.abort();
	self.successful = false;
	self.finished = true;

}; // Uploader.prototype.abort() }}}2
