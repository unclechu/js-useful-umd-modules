(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    root.GetVal = factory();
  }
}(this, function() {

/**
 * Provides class for getting value by key
 *
 * @module get-val
 * @version 1.0.0
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/unclechu/js-useful-umd-modules/|GitHub}
 * @see {@link https://github.com/unclechu/js-useful-umd-modules/blob/master/AGPLv3-LICENSE|License}
 */
/** @lends GetVal */
/**
 * @typedef {!Object.<Object|Array>} GetVal~valuesArg
 * @prop {!Object.<*>} values - Values key-val object
 * @prop {?Array.<string>} [required] - Array of required keys
 */
/**
 * @class
 * @public
 * @name GetVal
 * @param {GetVal~valuesArg} values - Key-value object of values
 * @param {?Object.<*>} [required] - Key-value object to set required values at instance creating
 * @returns {function} "get" method wrapper (you can get value from example of class directly as by function)
 *
 * @throws {GetVal~IncorrectArgument}
 * @throws {GetVal~RequiredArgumentKey}
 */
var GetVal, toString$ = {}.toString;
GetVal = (function(){
  GetVal.displayName = 'GetVal';
  var prototype = GetVal.prototype, constructor = GetVal;
  function GetVal(values, required){
    var key, getWrapper;
    required == null && (required = null);
    if (typeof values !== 'object') {
      throw new this.exceptions.IncorrectArgument(null, 'values', typeof values, 'object');
    }
    if (typeof values.values !== 'object') {
      throw new this.exceptions.RequiredArgumentKey(null, 'values', 'values', typeof values.values, 'object');
    }
    if (toString$.call(values.values).slice(8, -1) === 'Array') {
      throw new this.exceptions.RequiredArgumentKey(null, 'values', 'values', 'array', 'object');
    }
    if (values.required && !toString$.call(values.required).slice(8, -1) === 'Array') {
      throw new this.exceptions.RequiredArgumentKey(null, 'values', 'required', typeof values.required, 'array');
    }
    if (required && typeof required !== 'object') {
      throw new this.exceptions.IncorrectArgument(null, 'required', typeof required, 'object');
    }
    /**
     * @private
     * @name GetVal~_values
     * @type {!Object.<*>}
     */
    this._values = values.values;
    /**
     * @private
     * @name GetVal~_required
     * @type {Array.<string>}
     */
    this._required = values.required || [];
    if (required) {
      for (key in required) {
        this.set.call(this, key, required[key]);
      }
    }
    getWrapper = (function(self){
      return function(){
        return self.get.apply(self, arguments);
      };
    }.call(this, this));
    getWrapper.set = (function(self){
      return function(){
        return self.set.apply(self, arguments);
      };
    }.call(this, this));
    /**
     * Link to class example for "get" method wrapper
     *
     * @public
     * @name GetVal~super
     * @type {GetVal}
     */
    getWrapper['super'] = this;
    return getWrapper;
  }
  /**
   * @private
   * @method
   * @name GetVal~_check-required
   * @static
   *
   * @throws {GetVal~RequiredIsNotSet}
   */
  prototype._checkRequired = function(){
    var i$, ref$, len$, item;
    for (i$ = 0, len$ = (ref$ = this._required).length; i$ < len$; ++i$) {
      item = ref$[i$];
      if (!(item in this._values)) {
        throw new this.exceptions.RequiredIsNotSet(null, item);
      }
    }
  };
  /**
   * Set value by key
   * (only for "required" keys)
   *
   * @public
   * @method
   * @name GetVal~set
   * @static
   * @param {string} key - Key that in "required" list
   * @param {*} val - Value that can be got in the future by "key"
   *
   * @throws {GetVal~IncorrectKey}
   * @throws {GetVal~NoKeyInRequiredList}
   */
  prototype.set = function(key, val){
    var found, i$, ref$, len$, item;
    found = false;
    if (typeof key !== 'string') {
      throw new this.exceptions.IncorrectKey(null, typeof key);
    }
    for (i$ = 0, len$ = (ref$ = this._required).length; i$ < len$; ++i$) {
      item = ref$[i$];
      if (item === key) {
        found = true;
      }
    }
    if (!found) {
      throw new this.exceptions.NoKeyInRequiredList(null, key);
    }
    this._values[key] = val;
  };
  /**
   * Get value by key
   *
   * @public
   * @method
   * @name GetVal~get
   * @static
   * @param {string} key - Get value by this key
   * @param {boolean} ignoreRequired - Get value even if all required values is not setted yet
   * @returns {*} Value by key
   *
   * @throws {GetVal~RequiredIsNotSet}
   * @throws {GetVal~IncorrectKey}
   * @throws {GetVal~KeyIsNotExists}
   */
  prototype.get = function(key, ignoreRequired){
    if (!ignoreRequired) {
      this._checkRequired();
    }
    if (typeof key !== 'string') {
      throw new this.exceptions.IncorrectKey(null, typeof key);
    }
    if (!(key in this._values)) {
      throw new this.exceptions.KeyIsNotExists(null, key);
    }
    return this._values[key];
  };
  /**
   * Exceptions
   *
   * @public
   * @name GetVal~exceptions
   * @type {Object.<Error>}
   * @prop {GetVal~IncorrectArgument} - Incorrect argument type for constructor
   * @prop {GetVal~RequiredArgumentKey} - Required argument key is not set or has incorrect type (for constructor)
   * @prop {GetVal~IncorrectKey} - Incorrect key type for get/set methods
   * @prop {GetVal~KeyIsNotExists} - Value not found by key
   * @prop {GetVal~RequiredIsNotSet} - Attempt to get value before all required values sets
   * @prop {GetVal~NoKeyInRequiredList} - Attempt to set required value by key that not in required list
   * @static
   * @readOnly
   */;
  GetVal.exceptions = GetVal.prototype.exceptions = {};
  GetVal.exceptions.IncorrectArgument = (function(superclass){
    var prototype = extend$((import$(IncorrectArgument, superclass).displayName = 'IncorrectArgument', IncorrectArgument), superclass).prototype, constructor = IncorrectArgument;
    function IncorrectArgument(message, argName, argType, mustBe){
      this.name = 'IncorrectArgument';
      if (message) {
        this.message = message;
      } else {
        this.message = 'Incorrect';
        if (argName) {
          this.message += " \"" + argName + "\"";
        }
        this.message += ' argument type';
        if (argType) {
          this.message += ": \"" + argType + "\"";
        }
        if (mustBe) {
          this.message += ", must be a(n) \"" + mustBe + "\"";
        }
        this.message += '.';
      }
      this.argName = argName;
      this.argType = argType;
      this.mustBe = mustBe;
    }
    return IncorrectArgument;
  }(Error));
  GetVal.exceptions.RequiredArgumentKey = (function(superclass){
    var prototype = extend$((import$(RequiredArgumentKey, superclass).displayName = 'RequiredArgumentKey', RequiredArgumentKey), superclass).prototype, constructor = RequiredArgumentKey;
    function RequiredArgumentKey(message, argName, keyName, keyType, keyMustBe){
      this.name = 'RequiredArgumentKey';
      if (message) {
        this.message = message;
      } else {
        this.message = 'Incorrect';
        if (argName) {
          this.message += " \"" + argName + "\"";
        }
        this.message += ' argument key';
        if (keyName) {
          this.message += " \"" + keyName + "\"";
        }
        this.message += ' type';
        if (keyType) {
          this.message += ": \"" + keyType + "\"";
        }
        if (keyMustBe) {
          this.message += ", must be a(n) \"" + keyMustBe + "\"";
        }
        this.message += '.';
      }
      this.argName = argName;
      this.keyName = keyName;
      this.keyType = keyType;
      this.keyMustBe = keyMustBe;
    }
    return RequiredArgumentKey;
  }(Error));
  GetVal.exceptions.IncorrectKey = (function(superclass){
    var prototype = extend$((import$(IncorrectKey, superclass).displayName = 'IncorrectKey', IncorrectKey), superclass).prototype, constructor = IncorrectKey;
    function IncorrectKey(message, keyType){
      this.name = 'IncorrectKey';
      if (message) {
        this.message = message;
      } else {
        this.message = 'Incorrect key type';
        if (keyType) {
          this.message += " (\"" + keyType + "\")";
        }
        this.message += ', must be a string.';
      }
      this.keyType = keyType;
    }
    return IncorrectKey;
  }(Error));
  GetVal.exceptions.KeyIsNotExists = (function(superclass){
    var prototype = extend$((import$(KeyIsNotExists, superclass).displayName = 'KeyIsNotExists', KeyIsNotExists), superclass).prototype, constructor = KeyIsNotExists;
    function KeyIsNotExists(message, key){
      this.name = 'KeyIsNotExists';
      if (message) {
        this.message = message;
      } else {
        this.message = 'Key';
        if (key) {
          this.message += " \"" + key + "\"";
        }
        this.message += ' is not exists.';
      }
      this.key = key;
    }
    return KeyIsNotExists;
  }(Error));
  GetVal.exceptions.RequiredIsNotSet = (function(superclass){
    var prototype = extend$((import$(RequiredIsNotSet, superclass).displayName = 'RequiredIsNotSet', RequiredIsNotSet), superclass).prototype, constructor = RequiredIsNotSet;
    function RequiredIsNotSet(message, key){
      this.name = 'RequiredIsNotSet';
      if (message) {
        this.message = message;
      } else {
        this.message = 'Required key is not set';
        if (key) {
          this.message += ": \"" + key + "\"";
        }
        this.message += '.';
      }
      this.key = key;
    }
    return RequiredIsNotSet;
  }(Error));
  GetVal.exceptions.NoKeyInRequiredList = (function(superclass){
    var prototype = extend$((import$(NoKeyInRequiredList, superclass).displayName = 'NoKeyInRequiredList', NoKeyInRequiredList), superclass).prototype, constructor = NoKeyInRequiredList;
    function NoKeyInRequiredList(message, key){
      this.name = 'NoKeyInRequiredList';
      if (message) {
        this.message = message;
      } else {
        this.message = 'No key';
        if (key) {
          this.message += " \"" + key + "\"";
        }
        this.message += ' in required list.';
      }
      this.key = key;
    }
    return NoKeyInRequiredList;
  }(Error));
  return GetVal;
}());
return GetVal;
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}

}));