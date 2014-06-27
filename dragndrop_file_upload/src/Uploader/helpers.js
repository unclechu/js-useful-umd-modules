// Uploader helpers {{{2

/**
 * Helper for "sendAsBinary" helper
 *
 * @private
 * @inner
 */
function byteValue(x) { return x.charCodeAt(0) & 0xff; }

/**
 * Alternative "sendAsBinary" method if not supported native (as in Firefox)
 *
 * @private
 * @inner
 * @this {XMLHttpRequest}
 */
function sendAsBinary(body) { // {{{3
	if (this.sendAsBinary) {
		// firefox
		this.sendAsBinary(body);
	} else {
		// chrome (W3C spec.)
		var ords = Array.prototype.map.call(body, byteValue);
		var ui8a = new window.Uint8Array(ords);
		this.send(ui8a);
	}
} // sendAsBinary() }}}3

// Uploader helpers }}}2
