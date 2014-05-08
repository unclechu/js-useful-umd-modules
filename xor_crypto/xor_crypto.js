/*!
 * XOR encrypt / decrypt
 * http://www.trans4mind.com/personal_development/encryption/xor.htm
 * Wrapped to AMD by Viacheslav Lotsmanov <lotsmanov at gmail dot com>
 * @version r2
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 */

define(function () {
var XORCrypto;
return XORCrypto = {

	encrypt: function encrypt(s, cryptoKey) { // {{{1

		var a = 0;
		var myString = '';
		var textLen = s.length;
		var keyLen = cryptoKey.length;

		for (i=0; i<textLen; i++) {
			a = parseInt(s.charCodeAt(i));

			a = a ^ (cryptoKey.charCodeAt(i % keyLen));
			a = a + '';
			while (a.length < 3) a = '0' + a;

			myString += a;
		}

		return myString;

	}, // encrypt }}}1

	decrypt: function decrypt(s, cryptoKey) { // {{{1

		var myString = '';
		var a = 0;
		var keyLen = cryptoKey.length;
		var textLen = s.length;
		var i = 0;
		var myHolder = '';

		while (i < s.length-2) {
			myHolder = s.charAt(i) + s.charAt(i+1) + s.charAt(i+2);
			if (s.charAt(i) === '0') {
				myHolder = s.charAt(i+1) + s.charAt(i+2);
			}
			if ((s.charAt(i) === '0') && (s.charAt(i+1) === '0')) {
				myHolder = s.charAt(i+2);
			}
			a = parseInt(myHolder);
			a = a ^ (cryptoKey.charCodeAt(i / 3 % keyLen));
			myString += String.fromCharCode(a);
			i += 3;
		}

		return myString;

	} // decrypt }}}1

}; // return XORCrypto
}); // define()

// vim: set noet ts=4 sts=4 sw=4 fenc=utf-8 foldmethod=marker :
