/**
 * @memberOf DragNDropFileUpload
 * @private
 * @static
 */
DragNDropFileUpload.prototype.destroy = function () { // {{{2

	var self = this;

	$.each(self._uploaders, function (i, uploader) {
		uploader.destroy();
	});

	self.params.dragndropArea
		.off('dragenter' + self.params.bindSuffix)
		.off('dragover' + self.params.bindSuffix)
		.off('dragleave' + self.params.bindSuffix)
		.off('drop' + self.params.bindSuffix);

	self._callback = undefined;
	self.params = undefined;
	self._uploaders = undefined;

}; // DragNDropFileUpload.prototype.destroy() }}}2
