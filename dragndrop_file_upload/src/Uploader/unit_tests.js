// unit tests {{{2

Uploader.unitTests = {
	'All exceptions is instanceof Error': function () {
		for (var key in Uploader.exceptions) {
			if (!((new Uploader.exceptions[key]()) instanceof Error)) return false;
		}
		return true;
	},
	'All exceptions is instanceof themselves': function () {
		for (var key in Uploader.exceptions) {
			if (!((new Uploader.exceptions[key]()) instanceof Uploader.exceptions[key])) return false;
		}
		return true;
	},
	'Exception "FileReaderIsNotSupported" is instanceof "UnsupportedFeature"': function () {
		if (!((new Uploader.exceptions.FileReaderIsNotSupported()) instanceof Uploader.exceptions.UnsupportedFeature)) return false;
		return true;
	},
	'Exception "XMLHttpRequestIsNotSupported" is instanceof "UnsupportedFeature"': function () {
		if (!((new Uploader.exceptions.XMLHttpRequestIsNotSupported()) instanceof Uploader.exceptions.UnsupportedFeature)) return false;
		return true;
	},
	'Exception "ArrayPrototypeMapIsNotSupported" is instanceof "UnsupportedFeature"': function () {
		if (!((new Uploader.exceptions.ArrayPrototypeMapIsNotSupported()) instanceof Uploader.exceptions.UnsupportedFeature)) return false;
		return true;
	},
	'Exception "Uint8ArrayIsNotSupported" is instanceof "UnsupportedFeature"': function () {
		if (!((new Uploader.exceptions.Uint8ArrayIsNotSupported()) instanceof Uploader.exceptions.UnsupportedFeature)) return false;
		return true;
	}
};

Uploader.unitTesting = function unitTesting() {
	window.console.group('Unit testing of "Uploader"...');
	for (var key in Uploader.unitTests) {
		var res = Uploader.unitTests[key]();
		if (res) {
			window.console.info(key + ' ... [PASSED]');
		} else {
			window.console.warn(key + ' ... [NOT PASSED]');
		}
	}
	window.console.groupEnd();
};

// unit tests }}}2
