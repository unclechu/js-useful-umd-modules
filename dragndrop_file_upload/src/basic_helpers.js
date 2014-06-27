// helpers {{{1

/**
 * Helper for cloning prototypes
 *
 * @private
 * @innter
 */
function inherit(proto) { // {{{2

	if (Object.create)
		return Object.create(proto);

	function F() {}
	F.prototype = proto;
	return new F();

} // inherit() }}}2

/**
 * Check for support features
 *
 * @private
 * @inner
 * @return {Uploader~UnsupportedFeature|null} - Exception about non-supported feature or null
 */
function checkForFeatures() { // {{{2

	if (!window.FileReader) return new Uploader.exceptions.FileReaderIsNotSupported();
	if (!window.XMLHttpRequest) return new Uploader.exceptions.XMLHttpRequestIsNotSupported();

	if (!(new XMLHttpRequest()).sendAsBinary) {
		if (!(Array.prototype.map instanceof Function))
			return new Uploader.exceptions.ArrayPrototypeMapIsNotSupported();

		if (!window.Uint8Array) return new Uploader.exceptions.Uint8ArrayIsNotSupported();
	}

	return null;

} // checkForFeatures() }}}2

// helpers }}}1
