self._reader.onload = function onAddedFileToUpload() { // {{{3

	// @include xhr_progress.js
	// @include xhr_load.js
	// @include xhr_error.js
	// @include xhr_onreadystatechange.js

	self._xhr.open('POST', self.params.url, true);

	var boundary = 'xxxxxxxxx';
	self._xhr.setRequestHeader('Content-Type', 'multipart/form-data, boundary='+boundary);
	self._xhr.setRequestHeader('Cache-Control', 'no-cache');
	self._xhr.setRequestHeader('Pragma', 'no-cache');
	self._xhr.setRequestHeader('Expires', '0');

	var body = '';

	// the file
	body += '--' + boundary + '\r\n';
	body += 'Content-Disposition: form-data; charset: utf-8; accept-charset: utf-8'+
		'; name="'+ self.params.fileFieldName +'"'+
		'; filename="'+ unescape(encodeURIComponent( self.params.file.name )) +'"\r\n';
	body += 'Content-Type: application/octet-stream\r\n\r\n';
	body += self._reader.result + '\r\n';

	// custom data
	for (var key in self._toPost) {
		body += '--' + boundary + '\r\n';
		body += 'Content-Disposition: form-data; name="'+ key +'"\r\n';
		body += 'Content-Type: text/plain; charset=utf-8\r\n\r\n';
		body += self._toPost[key].toString() + '\r\n';
	}

	body += '--' + boundary + '--';

	sendAsBinary.call(self._xhr, body);

}; // self._reader.onload() }}}3
