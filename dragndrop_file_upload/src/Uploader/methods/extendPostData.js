/**
 * Extend post data from params
 * (can override)
 *
 * @memberOf Uploader
 * @public
 * @static
 * @exception {Error} Uploader~UploadingIsStarted
 */
Uploader.prototype.extendPostData = function (postData) { // {{{2

	var self = this;

	if (self.started) throw new Uploader.exceptions.UploadingIsStarted();

	self._toPost = $.extend({}, self._toPost, postData);

}; // Uploader.prototype.extendPostData() }}}2
