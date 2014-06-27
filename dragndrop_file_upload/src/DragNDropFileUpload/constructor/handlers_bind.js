// handlers bind {{{3

self.params.dragndropArea
	.on('dragenter' + self.params.bindSuffix, function () {
		$(this).addClass( self.params.dragOverClass );
		return false;
	})
	.on('dragover' + self.params.bindSuffix, function () {
		return false;
	})
	.on('dragleave' + self.params.bindSuffix, function () {
		$(this).removeClass( self.params.dragOverClass );
		return false;
	})
	.on('drop' + self.params.bindSuffix, function (e) { // {{{4
		$(this).removeClass( self.params.dragOverClass );
		var dt = e.originalEvent.dataTransfer;
		$.each(dt.files, function (i, file) {
			var mimeOk = true;

			$.each(self.params.mimeTypeFilter, function (n, mimeReg) {
				if (!file.type.match(mimeReg)) mimeOk = false;
			});

			if (mimeOk) {
				var uploadID = ++self._lastID;
				var dataToPost = $.extend({}, self.params.postData);

				new Uploader(self, {
					id: uploadID,
					file: file,
					url: self.params.uploadUrl,
					fileFieldName: self.params.fileFieldName,
					postData: dataToPost,
				}, function (err) {
					if (err) {
						if (self.params.addFileCallback instanceof Function) {
							setTimeout(function () {
								self.params.addFileCallback.call(null, err, uploadID);
							}, 1);
						}
						return;
					}

					var uploader = this;
					self._uploaders.push(uploader);

					setTimeout(function () {
						if (self.params.addFileCallback instanceof Function) {
							self.params.addFileCallback.call(
								uploader, null, uploadID, file.name, file.size, file.type
							);
						}

						if (self.params.uploaderInitCallback instanceof Function) {
							self.params.uploaderInitCallback.call(uploader);
						}

						uploader.startUploading();
					}, 1);
				});
			} else {
				if (self.params.addFileCallback instanceof Function) {
					setTimeout(function () {
						self.params.addFileCallback.call(
							null,
							new DragNDropFileUpload.exceptions.IncorrectMIMEType(null, file.type, file.name),
							uploadID
						);
					}, 1);
				}
			}
		});
		return false;
	}); // on drop }}}4

// handlers bind }}}3
