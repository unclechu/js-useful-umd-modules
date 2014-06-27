/**
 * Abort uploading by upload id
 *
 * @memberOf DragNDropFileUpload
 * @public
 * @static
 * @exception {Error} DragNDropFileUpload~IncorrectUploadId
 * @exception {Error} DragNDropFileUpload~UploaderNotFoundById
 * @exception {Error} Uploader~UploadingIsNotStarted
 */
DragNDropFileUpload.prototype.abort = function (uploadId) { // {{{2

	var self = this;
	var found = false;

	if ($.type(uploadId) !== 'number') throw new DragNDropFileUpload.exceptions.IncorrectUploadId(null, uploadId);

	$.each(self._uploaders, function (i, uploader) {
		if (uploader.params.id === uploadId) {
			if (!uploader.started) throw new Uploader.exceptions.UploadingIsNotStarted();
			uploader.abort();
			found = true;
		}
	});

	if (!found) throw new DragNDropFileUpload.exceptions.UploaderNotFoundById(null, uploadId);

}; // DragNDropFileUpload.prototype.abort() }}}2
