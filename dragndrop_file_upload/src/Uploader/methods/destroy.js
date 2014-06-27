/**
 * @memberOf Uploader
 * @private
 * @static
 */
Uploader.prototype.destroy = function () { // {{{2

	var self = this;

	self.superclass = undefined;
	self._callback = undefined;
	self.params = undefined;

	self._xhr = undefined;
	self._reader = undefined;

	self.progress = undefined;
	self.total = undefined;
	self.loaded = undefined;
	self.finished = undefined;
	self.started = undefined;
	self._toPost = undefined;

}; // Uploader.prototype.destroy() }}}2
