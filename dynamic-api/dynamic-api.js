(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    root.DynamicAPI = factory(root.jQuery);
  }
}(this, function($) {

/**
 * Dynamic API loader class
 *
 * @description Loads script by URL and waits for global variable
 * @module dynamic-api
 * @version 1.0.0
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/unclechu/js-useful-umd-modules/|GitHub}
 * @see {@link https://github.com/unclechu/js-useful-umd-modules/blob/master/AGPLv3-LICENSE|License}
 */
/** @lends DynamicAPI */
var DynamicAPI, toString$ = {}.toString;
DynamicAPI = (function(){
  /**
   * @typedef {Object} DynamicAPI~_toLoadList_type
   * @prop {String} scriptPath - API script URL
   * @prop {Boolean} [loaded=false] - Loaded flag
   * @prop {Number} [timerId=null] - Loaded waiter timer ID
   * @prop {String} varName - Global variable name to wait
   * @prop {Array.<Function>} [cb] - Callbacks to run after script load or to run immidiately if script is already loaded
   */
  /**
   * Loaded list
   *
   * @name DynamicAPI~_toLoadList
   * @private
   * @inner
   * @static
   * @type {Array.<DynamicAPI~_toLoadList_type>}
   */
  DynamicAPI.displayName = 'DynamicAPI';
  var _toLoadList, getItem, makeError, prototype = DynamicAPI.prototype, constructor = DynamicAPI;
  _toLoadList = [];
  /**
   * @typedef {!Object.<Object|Array>} DynamicAPI~constructorParams
   * @prop {Number} [interval=500] - Interval in millisecond for waiting to ready dynamic module
   * @prop {Boolean} [async=true] - Asynchronus script loading
   */
  /**
   * @constructor
   * @public
   * @name DynamicAPI
   * @param {DynamicAPI~constructorParams} [params] - Parameters
   * @returns {DynamicAPI~wrapper} wrapper - Wrapper for dynamic API loading, instance provides as "super" property
   */
  function DynamicAPI(arg$){
    var interval, ref$, async, wrapper;
    interval = (ref$ = arg$.interval) != null ? ref$ : 500, async = (ref$ = arg$.async) != null ? ref$ : true;
    (function(type, name, val){
      if (toString$.call(val).slice(8, -1) !== type) {
        throw new this.exceptions.IncorrectArgument({
          argName: name,
          argType: toString$.call(val).slice(8, -1),
          mustBe: type
        });
      }
    }.call(this, 'Number', 'interval', interval));
    (function(type, name, val){
      if (toString$.call(val).slice(8, -1) !== type) {
        throw new this.exceptions.IncorrectArgument({
          argName: name,
          argType: toString$.call(val).slice(8, -1),
          mustBe: type
        });
      }
    }.call(this, 'Boolean', 'async', async));
    this._interval = interval;
    this._async = async;
    /**
     * For delegation to "dynamicLoadApi" method
     *
     * @typedef {Function} DynamicAPI~wrapper
     * @public
     */
    wrapper = (function($this){
      var this$ = this;
      return function(){
        return this$.dynamicLoadApi.apply(this$, arguments);
      };
    }.call(this, this));
    wrapper['super'] = this;
    return wrapper;
  }
  /**
   * @typedef {Function} DynamicAPI~apiLoadedCallback
   * @prop {Error} err Exception
   * @prop {*} globalVarValue window[globalVarName]
   */
  /**
   * @private
   * @inner
   * @static
   * @name DynamicAPI~getItem
   * @param {DynamicAPI~_toLoadList} toLoadList
   * @param {String} scriptPath
   */
  getItem = function(toLoadList, scriptPath){
    var res;
    res = null;
    $.each(toLoadList, function(i, item){
      if (item.scriptPath === scriptPath) {
        res = item;
        return false;
      }
    });
    if (res == null) {
      throw new DynamicAPI.exceptions.ItemNotFound({
        scriptPath: scriptPath
      });
    }
    return res;
  };
  /**
   * @public
   * @name DynamicAPI~dynamicLoadApi
   * @param {String} scriptPath - Path to API script
   * @param {String} globalVarName - Name of global variable to wait
   * @param {DynamicAPI~apiLoadedCallback} callback
   */
  prototype.dynamicLoadApi = function(scriptPath, globalVarName, cb){
    var alreadyInList, item, i$, ref$, len$, $script, e, waiter, this$ = this;
    (function(type, name, val){
      if (val == null) {
        return makeError(new this.exceptions.RequiredArgument({
          argName: name
        }));
      }
      if (toString$.call(val).slice(8, -1) !== type) {
        return makeError(new this.exceptions.IncorrectArgument({
          argName: name,
          argType: toString$.call(val).slice(8, -1),
          mustBe: type
        }));
      }
    }.call(this, 'Function', 'cb', cb));
    (function(type, name, val){
      if (val == null) {
        return makeError(new this.exceptions.RequiredArgument({
          argName: name
        }), cb);
      }
      if (toString$.call(val).slice(8, -1) !== type) {
        return makeError(new this.exceptions.IncorrectArgument({
          argName: name,
          argType: toString$.call(val).slice(8, -1),
          mustBe: type
        }), cb);
      }
      if (!val) {
        return makeError(new this.exceptions.RequiredArgument({
          argName: name
        }), cb);
      }
    }.call(this, 'String', 'scriptPath', scriptPath));
    (function(type, name, val){
      if (val == null) {
        return makeError(new this.exceptions.RequiredArgument({
          argName: name
        }), cb);
      }
      if (toString$.call(val).slice(8, -1) !== type) {
        return makeError(new this.exceptions.IncorrectArgument({
          argName: name,
          argType: toString$.call(val).slice(8, -1),
          mustBe: type
        }), cb);
      }
      if (!val) {
        return makeError(new this.exceptions.RequiredArgument({
          argName: name
        }), cb);
      }
    }.call(this, 'String', 'globalVarName', globalVarName));
    alreadyInList = false;
    item = null;
    $.each(_toLoadList, function(i, item){
      if (item.scriptPath === scriptPath) {
        alreadyInList = true;
      }
    });
    if (!alreadyInList) {
      if (globalVarName in window) {
        return makeError(new this.exceptions.GlobalNameAlreadyTaken({
          globalName: globalVarName
        }), cb);
      }
      for (i$ = 0, len$ = (ref$ = _toLoadList).length; i$ < len$; ++i$) {
        item = ref$[i$];
        if (item.varName === globalVarName) {
          return makeError(new this.exceptions.GlobalNameAlreadyTaken({
            globalName: globalVarName
          }), cb);
        }
      }
      _toLoadList.push({
        scriptPath: scriptPath,
        loaded: false,
        timerId: null,
        varName: globalVarName,
        cb: []
      });
      $script = $('<script/>', {
        src: scriptPath
      });
      if (this._async) {
        $script.attr({
          async: 'async'
        });
      }
      $('head').append($script);
    }
    try {
      item = getItem(_toLoadList, scriptPath);
    } catch (e$) {
      e = e$;
      return makeError(err, cb);
    }
    waiter = function(){
      if (!(item.varName in window)) {
        item.timerId = setTimeout(waiter, this$._interval);
        return;
      }
      item.loaded = true;
      item.timerId = null;
      if (item.cb != null) {
        $.each(item.cb, function(i, cbFunc){
          setTimeout($.proxy(cbFunc, null, null, window[item.varName]), 0);
        });
      }
      item.cb = null;
    };
    if (item.loaded) {
      return setTimeout($.proxy(cb, null, null, window[item.varName]), 0);
    }
    item.cb.push(cb);
    item.timerId = setTimeout(waiter, 0);
  };
  /**
   * @private
   * @inner
   * @static
   * @name DynamicAPI~makeError
   * @param {Error} err
   * @param {DynamicAPI~apiLoadedCallback} cb - Callback for providing exception
   */;
  makeError = function(err, cb){
    cb == null && (cb = null);
    if (cb == null) {
      throw err;
    }
    setTimeout($.proxy(cb, null, err), 0);
  };
  /**
   * Exceptions
   *
   * @public
   * @name DynamicAPI~exceptions
   * @type {Object.<Error>}
   * @prop {DynamicAPI~IncorrectArgument}
   * @prop {DynamicAPI~RequiredArgument}
   * @prop {DynamicAPI~ItemNotFound} - Can't find item in loaded list
   * @prop {DynamicAPI~GlobalNameAlreadyTaken} - Global name is already taken
   * @static
   * @readOnly
   */
  DynamicAPI.exceptions = DynamicAPI.prototype.exceptions = {};
  DynamicAPI.exceptions.IncorrectArgument = (function(superclass){
    var prototype = extend$((import$(IncorrectArgument, superclass).displayName = 'IncorrectArgument', IncorrectArgument), superclass).prototype, constructor = IncorrectArgument;
    function IncorrectArgument(arg$){
      var message, ref$, argName, argType, mustBe;
      message = (ref$ = arg$.message) != null ? ref$ : null, argName = (ref$ = arg$.argName) != null ? ref$ : null, argType = (ref$ = arg$.argType) != null ? ref$ : null, mustBe = (ref$ = arg$.mustBe) != null ? ref$ : null;
      this.name = 'IncorrectArgument';
      if (message != null) {
        this.message = message;
      } else {
        this.message = 'Incorrect' + (argName != null ? " \"" + argName + "\"" : '') + ' argument type' + (argType != null ? ": \"" + argType + "\"" : '') + (mustBe != null ? ", must be a(n) \"" + mustBe + "\"" : '') + '.';
      }
      this.argName = argName;
      this.argType = argType;
      this.mustBe = mustBe;
    }
    return IncorrectArgument;
  }(Error));
  DynamicAPI.exceptions.RequiredArgument = (function(superclass){
    var prototype = extend$((import$(RequiredArgument, superclass).displayName = 'RequiredArgument', RequiredArgument), superclass).prototype, constructor = RequiredArgument;
    function RequiredArgument(arg$){
      var message, ref$, argName;
      message = (ref$ = arg$.message) != null ? ref$ : null, argName = (ref$ = arg$.argName) != null ? ref$ : null;
      this.name = 'RequiredArgument';
      if (message != null) {
        this.message = message;
      } else {
        this.message = 'Argument' + (argName != null ? " \"" + argName + "\"" : '') + ' is required.';
      }
      this.argName = argName;
    }
    return RequiredArgument;
  }(Error));
  DynamicAPI.exceptions.ItemNotFound = (function(superclass){
    var prototype = extend$((import$(ItemNotFound, superclass).displayName = 'ItemNotFound', ItemNotFound), superclass).prototype, constructor = ItemNotFound;
    function ItemNotFound(arg$){
      var message, ref$, scriptPath;
      message = (ref$ = arg$.message) != null ? ref$ : null, scriptPath = (ref$ = arg$.scriptPath) != null ? ref$ : null;
      this.name = 'ItemNotFound';
      if (message != null) {
        this.message = message;
      } else {
        this.message = 'Cannot get item by script path' + (scriptPath != null ? ": \"" + scriptPath + "\"" : '') + '.';
      }
      this.scriptPath = scriptPath;
    }
    return ItemNotFound;
  }(Error));
  DynamicAPI.exceptions.GlobalNameAlreadyTaken = (function(superclass){
    var prototype = extend$((import$(GlobalNameAlreadyTaken, superclass).displayName = 'GlobalNameAlreadyTaken', GlobalNameAlreadyTaken), superclass).prototype, constructor = GlobalNameAlreadyTaken;
    function GlobalNameAlreadyTaken(arg$){
      var message, ref$, globalName;
      message = (ref$ = arg$.message) != null ? ref$ : null, globalName = (ref$ = arg$.globalName) != null ? ref$ : null;
      this.name = 'Timeout';
      if (message != null) {
        this.message = message;
      } else {
        this.message = 'Global name ' + (globalName != null ? "\"" + globalName + "\" " : '') + 'is already taken.';
      }
      this.globalName = globalName;
    }
    return GlobalNameAlreadyTaken;
  }(Error));
  return DynamicAPI;
}());
return DynamicAPI;
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