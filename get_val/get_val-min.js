!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():e.GetVal=t()}(this,function(){function e(e,t){function s(){}return s.prototype=(e.superclass=t).prototype,(e.prototype=new s).constructor=e,"function"==typeof t.extended&&t.extended(e),e}function t(e,t){var s={}.hasOwnProperty;for(var i in t)s.call(t,i)&&(e[i]=t[i]);return e}/**
 * Provides class for getting value by key
 *
 * @module get_val
 * @version r10
 * @author Viacheslav Lotsmanov
 * @license AGPLv3
 * @see {@link https://github.com/unclechu/js-useful-umd-modules/|GitHub}
 * @see {@link https://github.com/unclechu/js-useful-umd-modules/blob/master/AGPLv3-LICENSE|License}
 */
var s;return s=function(){function s(e,t){var s,i,r;if(null==t&&(t=null),s=function(e){return"[object Array]"===Object.prototype.toString.call(e)},"object"!=typeof e)throw new this.exceptions.IncorrectArgument(null,"values",typeof e,"object");if("object"!=typeof e.values)throw new this.exceptions.RequiredArgumentKey(null,"values","values",typeof e.values,"object");if(s(e.values))throw new this.exceptions.RequiredArgumentKey(null,"values","values","array","object");if(e.required&&!s(e.required))throw new this.exceptions.RequiredArgumentKey(null,"values","required",typeof e.required,"array");if(t&&"object"!=typeof t)throw new this.exceptions.IncorrectArgument(null,"required",typeof t,"object");if(this._values=e.values,this._required=e.required||[],t)for(i in t)this.set.call(this,i,t[i]);return r=function(e){return function(){return e.get.apply(e,arguments)}}.call(this,this),r["super"]=this,r}s.displayName="GetVal";var i=s.prototype;return i._checkRequired=function(){var e,t,s,i;for(e=0,s=(t=this._required).length;s>e;++e)if(i=t[e],!(i in this._values))throw new this.exceptions.RequiredIsNotSet(null,i)},i.set=function(e,t){var s,i,r,n,o;if(s=!1,"string"!=typeof e)throw new this.exceptions.IncorrectKey(null,typeof e);for(i=0,n=(r=this._required).length;n>i;++i)o=r[i],o===e&&(s=!0);if(!s)throw new this.exceptions.NoKeyInRequiredList(null,e);this._values[e]=t},i.get=function(e,t){if(t||this._checkRequired(),"string"!=typeof e)throw new this.exceptions.IncorrectKey(null,typeof e);if(!(e in this._values))throw new this.exceptions.KeyIsNotExists(null,e);return this._values[e]},s.exceptions=s.prototype.exceptions={},s.exceptions.IncorrectArgument=function(s){function i(e,t,s,i){this.name="IncorrectArgument",e?this.message=e:(this.message="Incorrect",t&&(this.message+=' "'+t+'"'),this.message+=" argument type",s&&(this.message+=': "'+s+'"'),i&&(this.message+=', must be a(n) "'+i+'"'),this.message+="."),this.argName=t,this.argType=s,this.mustBe=i}e((t(i,s).displayName="IncorrectArgument",i),s).prototype;return i}(Error),s.exceptions.RequiredArgumentKey=function(s){function i(e,t,s,i,r){this.name="RequiredArgumentKey",e?this.message=e:(this.message="Incorrect",t&&(this.message+=' "'+t+'"'),this.message+=" argument key",s&&(this.message+=' "'+s+'"'),this.message+=" type",i&&(this.message+=': "'+i+'"'),r&&(this.message+=', must be a(n) "'+r+'"'),this.message+="."),this.argName=t,this.keyName=s,this.keyType=i,this.keyMustBe=r}e((t(i,s).displayName="RequiredArgumentKey",i),s).prototype;return i}(Error),s.exceptions.IncorrectKey=function(s){function i(e,t){this.name="IncorrectKey",e?this.message=e:(this.message="Incorrect key type",t&&(this.message+=' ("'+t+'")'),this.message+=", must be a string."),this.keyType=t}e((t(i,s).displayName="IncorrectKey",i),s).prototype;return i}(Error),s.exceptions.KeyIsNotExists=function(s){function i(e,t){this.name="KeyIsNotExists",e?this.message=e:(this.message="Key",t&&(this.message+=' "'+t+'"'),this.message+=" is not exists."),this.key=t}e((t(i,s).displayName="KeyIsNotExists",i),s).prototype;return i}(Error),s.exceptions.RequiredIsNotSet=function(s){function i(e,t){this.name="RequiredIsNotSet",e?this.message=e:(this.message="Required key is not set",t&&(this.message+=': "'+t+'"'),this.message+="."),this.key=t}e((t(i,s).displayName="RequiredIsNotSet",i),s).prototype;return i}(Error),s.exceptions.NoKeyInRequiredList=function(s){function i(e,t){this.name="NoKeyInRequiredList",e?this.message=e:(this.message="No key",t&&(this.message+=' "'+t+'"'),this.message+=" in required list."),this.key=t}e((t(i,s).displayName="NoKeyInRequiredList",i),s).prototype;return i}(Error),s}()});