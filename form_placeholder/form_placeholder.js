/*!
 * Placeholder logic handler
 *
 * @version r1
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 */

define(['jquery', 'get_val'], function ($, getVal) {

	/**
	 * Handler
	 *
	 * @this {DOM} - <label> that has <span> and <input> (or <textarea>)
	 */
	return function () {

		var $label = $(this);
		var $placeholder = $label.find('span');

		function blurHandler() {
			if ($(this).attr('name') === 'subject') {
				if ($(this).val() === '') {
					$placeholder.stop().show();
				} else if ($(this).val() !== '') {
					$placeholder.stop().hide();
				}
			} else {
				if ($(this).val() === '') {
					$placeholder.stop().fadeIn(getVal('animationSpeed'));
				} else if ($(this).val() !== '') {
					$placeholder.stop().fadeOut(getVal('animationSpeed'));
				}
			}
		}

		function focusHandler() {
			if ($(this).attr('name') !== 'subject') {
				$placeholder.stop().fadeOut(getVal('animationSpeed'));
			}
		}

		$label.find('input, textarea').focus(focusHandler).blur(blurHandler).trigger('blur');

	}; // return ()

}); // define()
