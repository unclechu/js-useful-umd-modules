/**
 * Throw error or delegate exception to callback
 *
 * @memberOf DragNDropFileUpload
 * @protected
 * @static
 * @param {Error} exception
 * @returns {boolean} Returns true or throws exception
 */
DragNDropFileUpload.prototype.makeError = function (exception) { // {{{2

	var self = this;

	if (self._callback) {
		setTimeout($.proxy(self._callback, self, exception), 1);
		return true;
	}

	throw exception;

}; // DragNDropFileUpload.prototype.makeError() }}}2
