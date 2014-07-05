/*!
 * Placeholder logic handler
 *
 * @version r3
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 */

define(['jquery', 'get_val'], function ($, getVal) {

	var bindSuffix = '.form_placeholder';

	/**
	 * Handler
	 *
	 * @this {DOM} - <label> that has <span> and <input> (or <textarea>)
	 */
	return function (params) {

		params = $.extend({
			$placeholder: null,
			placeholderSelector: '>span, .placeholder',
			$input: null,
			inputSelector: 'input, textarea'
		}, (($.isPlainObject(params)) ? params : {}));

		var $label = $(this);
		var $placeholder;
		var $input;

		if (params.$placeholder)
			$placeholder = $( params.$placeholder );
		else
			$placeholder = $label.find( params.placeholderSelector );

		if (params.$input)
			$input = $( params.$input );
		else
			$input = $label.find( params.inputSelector );

		function blurHandler() {
			if ($(this).val() === '') {
				$placeholder.stop().fadeIn(getVal('animationSpeed'));
			} else {
				$placeholder.stop().fadeOut(getVal('animationSpeed'));
			}
		}

		function focusHandler() {
			$placeholder.stop().fadeOut(getVal('animationSpeed'));
		}

		$input
			.on('focus' + bindSuffix, focusHandler)
			.on('blur' + bindSuffix, blurHandler)
			.trigger('blur' + bindSuffix)
			.each(function () {
				$(this).data('form_placeholder', {
					focusHandler: focusHandler,
					blurHandler: blurHandler
				});
			});

	}; // return ()

}); // define()
