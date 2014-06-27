// unit tests {{{2

DragNDropFileUpload.unitTests = {
	'All exceptions is instanceof Error': function () {
		for (var key in DragNDropFileUpload.exceptions) {
			if (!((new DragNDropFileUpload.exceptions[key]()) instanceof Error)) return false;
		}
		return true;
	},
	'All exceptions is instanceof themselves': function () {
		for (var key in DragNDropFileUpload.exceptions) {
			if (!((new DragNDropFileUpload.exceptions[key]()) instanceof DragNDropFileUpload.exceptions[key])) return false;
		}
		return true;
	}
};

DragNDropFileUpload.unitTesting = function unitTesting() {
	window.console.group('Unit testing of "DragNDropFileUpload"...');
	for (var key in DragNDropFileUpload.unitTests) {
		var res = DragNDropFileUpload.unitTests[key]();
		if (res) {
			window.console.info(key + ' ... [PASSED]');
		} else {
			window.console.warn(key + ' ... [NOT PASSED]');
		}
	}
	window.console.groupEnd();
};

// unit tests }}}2
