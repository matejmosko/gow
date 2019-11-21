module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/electron-settings/index.js":
/*!*************************************************!*\
  !*** ./node_modules/electron-settings/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A simple persistent user settings framework for Electron.
 *
 * @module main
 * @author Nathan Buchar
 * @copyright 2016-2017 Nathan Buchar <hello@nathanbuchar.com>
 * @license ISC
 */

const Settings = __webpack_require__(/*! ./lib/settings */ "./node_modules/electron-settings/lib/settings.js");

module.exports = new Settings();


/***/ }),

/***/ "./node_modules/electron-settings/lib/settings-helpers.js":
/*!****************************************************************!*\
  !*** ./node_modules/electron-settings/lib/settings-helpers.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A module that contains key path helpers. Adapted from atom/key-path-helpers.
 *
 * @module settings-helpers
 * @author Nathan Buchar
 * @copyright 2016-2017 Nathan Buchar <hello@nathanbuchar.com>
 * @license ISC
 */

/**
 * Checks if the given object contains the given key path.
 *
 * @param {Object} obj
 * @param {string} keyPath
 * @returns {boolean}
 */
module.exports.hasKeyPath = (obj, keyPath) => {
  const keys = keyPath.split(/\./);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];

    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj = obj[key];
    } else {
      return false;
    }
  }

  return true;
};

/**
 * Gets the value of the given object at the given key path.
 *
 * @param {Object} obj
 * @param {string} keyPath
 * @returns {any}
 */
module.exports.getValueAtKeyPath = (obj, keyPath) => {
  const keys = keyPath.split(/\./);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];

    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj = obj[key];
    } else {
      return undefined;
    }
  }

  return obj;
};

/**
 * Sets the value of the given object at the given key path.
 *
 * @param {Object} obj
 * @param {string} keyPath
 * @param {any} value
 */
module.exports.setValueAtKeyPath = (obj, keyPath, value) => {
  const keys = keyPath.split(/\./);

  while (keys.length > 1) {
    const key = keys.shift();

    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = {};
    }

    obj = obj[key];
  }

  obj[keys.shift()] = value;
};

/**
 * Deletes the value of the given object at the given key path.
 *
 * @param {Object} obj
 * @param {string} keyPath
 */
module.exports.deleteValueAtKeyPath = (obj, keyPath) => {
  const keys = keyPath.split(/\./);

  while (keys.length > 1) {
    const key = keys.shift();

    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      return;
    }

    obj = obj[key];
  }

  delete obj[keys.shift()];
};


/***/ }),

/***/ "./node_modules/electron-settings/lib/settings-observer.js":
/*!*****************************************************************!*\
  !*** ./node_modules/electron-settings/lib/settings-observer.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A module that delegates settings changes.
 *
 * @module settings-observer
 * @author Nathan Buchar
 * @copyright 2016-2017 Nathan Buchar <hello@nathanbuchar.com>
 * @license ISC
 */

const assert = __webpack_require__(/*! assert */ "assert");

class SettingsObserver {

  constructor(settings, keyPath, handler, currentValue) {

    /**
     * A reference to the Settings instance.
     *
     * @type {Settings}
     * @private
     */
    this._settings = settings;

    /**
     * The key path that this observer instance is watching for changes.
     *
     * @type {string}
     * @private
     */
    this._keyPath = keyPath;

    /**
     * The handler function to be called when the value at the observed
     * key path is changed.
     *
     * @type {Function}
     * @private
     */
    this._handler = handler;

    /**
     * The current value of the setting at the given key path.
     *
     * @type {any}
     * @private
     */
    this._currentValue = currentValue;

    /**
     * Called when the settings file is changed.
     *
     * @type {Object}
     * @private
     */
    this._handleChange = this._onChange.bind(this);

    this._init();
  }

  /**
   * Initializes this instance.
   *
   * @private
   */
  _init() {
    this._settings.on('change', this._handleChange);
  }

  /**
   * Called when the settings file is changed.
   *
   * @private
   */
  _onChange() {
    const oldValue = this._currentValue;
    const newValue = this._settings.get(this._keyPath);

    try {
      assert.deepEqual(newValue, oldValue);
    } catch (err) {
      this._currentValue = newValue;

      // Call the watch handler and pass in the new and old values.
      this._handler.call(this, newValue, oldValue);
    }
  }

  /**
   * Disposes of this key path observer.
   *
   * @public
   */
  dispose() {
    this._settings.removeListener('change', this._handleChange);
  }
}

module.exports = SettingsObserver;


/***/ }),

/***/ "./node_modules/electron-settings/lib/settings.js":
/*!********************************************************!*\
  !*** ./node_modules/electron-settings/lib/settings.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A module that handles read and writing to the disk.
 *
 * @module settings
 * @author Nathan Buchar
 * @copyright 2016-2017 Nathan Buchar <hello@nathanbuchar.com>
 * @license ISC
 */

const assert = __webpack_require__(/*! assert */ "assert");
const electron = __webpack_require__(/*! electron */ "electron");
const { EventEmitter } = __webpack_require__(/*! events */ "events");
const fs = __webpack_require__(/*! fs */ "fs");
const jsonfile = __webpack_require__(/*! jsonfile */ "./node_modules/jsonfile/index.js");
const path = __webpack_require__(/*! path */ "path");

const Helpers = __webpack_require__(/*! ./settings-helpers */ "./node_modules/electron-settings/lib/settings-helpers.js");
const Observer = __webpack_require__(/*! ./settings-observer */ "./node_modules/electron-settings/lib/settings-observer.js");

/**
 * The name of the settings file.
 *
 * @type {string}
 */
const defaultSettingsFileName = 'Settings';

/**
 * The electron-settings class.
 *
 * @extends EventEmitter
 * @class
 */
class Settings extends EventEmitter {

  constructor() {
    super();

    /**
     * The absolute path to the custom settings file on the disk.
     *
     * @type {string}
     * @default null
     * @private
     */
    this._customSettingsFilePath = null;

    /**
     * The FSWatcher instance. This will watch if the settings file and
     * notify key path observers.
     *
     * @type {FSWatcher}
     * @default null
     * @private
     */
    this._fsWatcher = null;

    /**
     * Called when the settings file is changed or renamed.
     *
     * @type {Object}
     * @private
     */
    this._handleSettingsFileChange = this._onSettingsFileChange.bind(this);
  }

  /**
   * Returns the settings file path.
   *
   * @returns {string}
   * @private
   */
  _getSettingsFilePath() {
    if (this._customSettingsFilePath) return this._customSettingsFilePath;

    const app = electron.app || electron.remote.app;
    const userDataPath = app.getPath('userData');
    const defaultSettingsFilePath = path.join(userDataPath, defaultSettingsFileName);

    return defaultSettingsFilePath;
  }

  /**
   * Sets a custom settings file path.
   *
   * @param {string} filePath
   * @private
   */
  _setSettingsFilePath(filePath) {
    this._customSettingsFilePath = filePath;

    // Reset FSWatcher.
    this._unwatchSettings(true);
  }

  /**
   * Clears the custom settings file path.
   *
   * @private
   */
  _clearSettingsFilePath() {
    this._setSettingsFilePath(null);
  }

  /**
   * Watches the settings file for changes using the native `FSWatcher`
   * class in case the settings file is changed outside of
   * ElectronSettings' jursidiction.
   *
   * @private
   */
  _watchSettings() {
    if (!this._fsWatcher) {
      try {
        this._fsWatcher = fs.watch(this._getSettingsFilePath(), this._handleSettingsFileChange);
      } catch (err) {
        // File may not exist yet or the user may not have permission to
        // access the file or directory. Fail gracefully.
      }
    }
  }

  /**
   * Unwatches the settings file by closing the FSWatcher and nullifying its
   * references. If the `reset` parameter is true, attempt to watch the
   * settings file again.
   *
   * @param {boolean} [reset=false]
   * @private
   */
  _unwatchSettings(reset = false) {
    if (this._fsWatcher) {
      this._fsWatcher.close();
      this._fsWatcher = null;

      if (reset) {
        this._watchSettings();
      }
    }
  }

  /**
   * Ensures that the settings file exists, then initializes the FSWatcher.
   *
   * @private
   */
  _ensureSettings() {
    const settingsFilePath = this._getSettingsFilePath();

    try {
      jsonfile.readFileSync(settingsFilePath);
    } catch (err) {
      try {
        jsonfile.writeFileSync(settingsFilePath, {});
      } catch (err) {
        // Cannot read or write file. The user may not have permission to
        // access the file or directory. Throw error.
        throw err;
      }
    }

    this._watchSettings();
  }

  /**
   * Writes the settings to the disk.
   *
   * @param {Object} [obj={}]
   * @param {Object} [opts={}]
   * @private
   */
  _writeSettings(obj = {}, opts = {}) {
    this._ensureSettings();

    try {
      const spaces = opts.prettify ? 2 : 0;

      jsonfile.writeFileSync(this._getSettingsFilePath(), obj, { spaces });
    } catch (err) {
      // Could not write the file. The user may not have permission to
      // access the file or directory. Throw error.
      throw err;
    }
  }

  /**
   * Returns the parsed contents of the settings file.
   *
   * @returns {Object}
   * @private
   */
  _readSettings() {
    this._ensureSettings();

    try {
      return jsonfile.readFileSync(this._getSettingsFilePath());
    } catch (err) {
      // Could not read the file. The user may not have permission to
      // access the file or directory. Throw error.
      throw err;
    }
  }

  /**
   * Called when the settings file has been changed or
   * renamed (moved/deleted).
   *
   * @type {string} eventType
   * @private
   */
  _onSettingsFileChange(eventType) {
    switch (eventType) {
      case Settings.FSWatcherEvents.CHANGE: {
        this._emitChangeEvent();
        break;
      }
      case Settings.FSWatcherEvents.RENAME: {
        this._unwatchSettings(true);
        break;
      }
    }
  }

  /**
   * Broadcasts the internal "change" event.
   *
   * @emits ElectronSettings:change
   * @private
   */
  _emitChangeEvent() {
    this.emit(Settings.Events.CHANGE);
  }

  /**
   * Returns a boolean indicating whether the settings object contains
   * the given key path.
   *
   * @param {string} keyPath
   * @returns {boolean}
   * @private
   */
  _checkKeyPathExists(keyPath) {
    const obj = this._readSettings();
    const exists = Helpers.hasKeyPath(obj, keyPath);

    return exists;
  }

  /**
   * Sets the value at the given key path, or the entire settings object if
   * an empty key path is given.
   *
   * @param {string} keyPath
   * @param {any} value
   * @param {Object} opts
   * @private
   */
  _setValueAtKeyPath(keyPath, value, opts) {
    let obj = value;

    if (keyPath !== '') {
      obj = this._readSettings();

      Helpers.setValueAtKeyPath(obj, keyPath, value);
    }

    this._writeSettings(obj, opts);
  }

  /**
   * Returns the value at the given key path, or sets the value at that key
   * path to the default value, if provided, if the key does not exist. If an
   * empty key path is given, the entire settings object will be returned.
   *
   * @param {string} keyPath
   * @param {any} defaultValue
   * @param {Object} opts
   * @returns {any}
   * @private
   */
  _getValueAtKeyPath(keyPath, defaultValue, opts) {
    const obj = this._readSettings();

    if (keyPath !== '') {
      const exists = Helpers.hasKeyPath(obj, keyPath);
      const value = Helpers.getValueAtKeyPath(obj, keyPath);

      // The key does not exist but a default value does. Set the value at the
      // key path to the default value and then get the new value.
      if (!exists && typeof defaultValue !== 'undefined') {
        this._setValueAtKeyPath(keyPath, defaultValue, opts);

        // Get the new value now that the default has been set.
        return this._getValueAtKeyPath(keyPath);
      }

      return value;
    }

    return obj;
  }

  /**
   * Deletes the key and value at the given key path, or clears the entire
   * settings object if an empty key path is given.
   *
   * @param {string} keyPath
   * @param {Object} opts
   * @private
   */
  _deleteValueAtKeyPath(keyPath, opts) {
    if (keyPath === '') {
      this._writeSettings({}, opts);
    } else {
      const obj = this._readSettings();
      const exists = Helpers.hasKeyPath(obj, keyPath);

      if (exists) {
        Helpers.deleteValueAtKeyPath(obj, keyPath);
        this._writeSettings(obj, opts);
      }
    }
  }

  /**
   * Watches the given key path for changes and calls the given handler
   * if the value changes. To unsubscribe from changes, call `dispose()`
   * on the Observer instance that is returned.
   *
   * @param {string} keyPath
   * @param {Function} handler
   * @returns {Observer}
   * @private
   */
  _watchValueAtKeyPath(keyPath, handler) {
    const currentValue = this._getValueAtKeyPath(keyPath);

    return new Observer(this, keyPath, handler, currentValue);
  }

  /**
   * Returns a boolean indicating whether the settings object contains
   * the given key path.
   *
   * @param {string} keyPath
   * @returns {boolean}
   * @public
   */
  has(keyPath) {
    assert.strictEqual(typeof keyPath, 'string', 'First parameter must be a string');

    return this._checkKeyPathExists(keyPath);
  }

  /**
   * Sets the value at the given key path.
   *
   * @param {string} keyPath
   * @param {any} value
   * @param {Object} [opts={}]
   * @param {boolean} [opts.prettify=false]
   * @returns {Settings}
   * @public
   */
  set(keyPath, value, opts = {}) {
    assert.strictEqual(typeof keyPath, 'string', 'First parameter must be a string. Did you mean to use `setAll()` instead?');
    assert.strictEqual(typeof opts, 'object', 'Second parameter must be an object');

    this._setValueAtKeyPath(keyPath, value, opts);

    return this;
  }

  /**
   * Sets all settings.
   *
   * @param {Object} obj
   * @param {Object} [opts={}]
   * @param {boolean} [opts.prettify=false]
   * @returns {Settings}
   * @public
   */
  setAll(obj, opts = {}) {
    assert.strictEqual(typeof obj, 'object', 'First parameter must be an object');
    assert.strictEqual(typeof opts, 'object', 'Second parameter must be an object');

    this._setValueAtKeyPath('', obj, opts);

    return this;
  }

  /**
   * Returns the value at the given key path, or sets the value at that key
   * path to the default value, if provided, if the key does not exist.
   *
   * @param {string} keyPath
   * @param {any} [defaultValue]
   * @param {Object} [opts={}]
   * @returns {any}
   * @public
   */
  get(keyPath, defaultValue, opts = {}) {
    assert.strictEqual(typeof keyPath, 'string', 'First parameter must be a string. Did you mean to use `getAll()` instead?');

    return this._getValueAtKeyPath(keyPath, defaultValue, opts);
  }

  /**
   * Returns all settings.
   *
   * @returns {Object}
   * @public
   */
  getAll() {
    return this._getValueAtKeyPath('');
  }

  /**
   * Deletes the key and value at the given key path.
   *
   * @param {string} keyPath
   * @param {Object} [opts={}]
   * @param {boolean} [opts.prettify=false]
   * @returns {Settings}
   * @public
   */
  delete(keyPath, opts = {}) {
    assert.strictEqual(typeof keyPath, 'string', 'First parameter must be a string. Did you mean to use `deleteAll()` instead?');
    assert.strictEqual(typeof opts, 'object', 'Second parameter must be an object');

    this._deleteValueAtKeyPath(keyPath, opts);

    return this;
  }

  /**
   * Deletes all settings.
   *
   * @param {Object} [opts={}]
   * @param {boolean} [opts.prettify=false]
   * @returns {Settings}
   * @public
   */
  deleteAll(opts = {}) {
    assert.strictEqual(typeof opts, 'object', 'First parameter must be an object');

    this._deleteValueAtKeyPath('', opts);

    return this;
  }

  /**
   * Watches the given key path for changes and calls the given handler
   * if the value changes. To unsubscribe from changes, call `dispose()`
   * on the Observer instance that is returned.
   *
   * @param {string} keyPath
   * @param {Function} handler
   * @returns {Observer}
   * @public
   */
  watch(keyPath, handler) {
    assert.strictEqual(typeof keyPath, 'string', 'First parameter must be a string');
    assert.strictEqual(typeof handler, 'function', 'Second parameter must be a function');

    return this._watchValueAtKeyPath(keyPath, handler);
  }

  /**
   * Sets a custom settings file path.
   *
   * @param {string} filePath
   * @returns {Settings}
   * @public
   */
  setPath(filePath) {
    assert.strictEqual(typeof filePath, 'string', 'First parameter must be a string');

    this._setSettingsFilePath(filePath);

    return this;
  }

  /**
   * Clears the custom settings file path.
   *
   * @returns {Settings}
   * @public
   */
  clearPath() {
    this._clearSettingsFilePath();

    return this;
  }

  /**
   * Returns the absolute path to where the settings file is or will be stored.
   *
   * @returns {string}
   * @public
   */
  file() {
    return this._getSettingsFilePath();
  }
}

/**
 * ElectronSettings event names.
 *
 * @enum {string}
 * @readonly
 */
Settings.FSWatcherEvents = {
  CHANGE: 'change',
  RENAME: 'rename'
};

/**
 * ElectronSettings event names.
 *
 * @enum {string}
 * @readonly
 */
Settings.Events = {
  CHANGE: 'change'
};

module.exports = Settings;


/***/ }),

/***/ "./node_modules/graceful-fs/clone.js":
/*!*******************************************!*\
  !*** ./node_modules/graceful-fs/clone.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = clone

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: obj.__proto__ }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}


/***/ }),

/***/ "./node_modules/graceful-fs/graceful-fs.js":
/*!*************************************************!*\
  !*** ./node_modules/graceful-fs/graceful-fs.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! fs */ "fs")
var polyfills = __webpack_require__(/*! ./polyfills.js */ "./node_modules/graceful-fs/polyfills.js")
var legacy = __webpack_require__(/*! ./legacy-streams.js */ "./node_modules/graceful-fs/legacy-streams.js")
var clone = __webpack_require__(/*! ./clone.js */ "./node_modules/graceful-fs/clone.js")

var util = __webpack_require__(/*! util */ "util")

/* istanbul ignore next - node 0.x polyfill */
var gracefulQueue
var previousSymbol

/* istanbul ignore else - node 0.x polyfill */
if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
  gracefulQueue = Symbol.for('graceful-fs.queue')
  // This is used in testing by future versions
  previousSymbol = Symbol.for('graceful-fs.previous')
} else {
  gracefulQueue = '___graceful-fs.queue'
  previousSymbol = '___graceful-fs.previous'
}

function noop () {}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

// Once time initialization
if (!global[gracefulQueue]) {
  // This queue can be shared by multiple loaded instances
  var queue = []
  Object.defineProperty(global, gracefulQueue, {
    get: function() {
      return queue
    }
  })

  // Patch fs.close/closeSync to shared queue version, because we need
  // to retry() whenever a close happens *anywhere* in the program.
  // This is essential when multiple graceful-fs instances are
  // in play at the same time.
  fs.close = (function (fs$close) {
    function close (fd, cb) {
      return fs$close.call(fs, fd, function (err) {
        // This function uses the graceful-fs shared queue
        if (!err) {
          retry()
        }

        if (typeof cb === 'function')
          cb.apply(this, arguments)
      })
    }

    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    })
    return close
  })(fs.close)

  fs.closeSync = (function (fs$closeSync) {
    function closeSync (fd) {
      // This function uses the graceful-fs shared queue
      fs$closeSync.apply(fs, arguments)
      retry()
    }

    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    })
    return closeSync
  })(fs.closeSync)

  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
    process.on('exit', function() {
      debug(global[gracefulQueue])
      __webpack_require__(/*! assert */ "assert").equal(global[gracefulQueue].length, 0)
    })
  }
}

module.exports = patch(clone(fs))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
    module.exports = patch(fs)
    fs.__patched = true;
}

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch

  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, options, cb) {
    var args = [path]
    if (typeof options !== 'function') {
      args.push(options)
    } else {
      cb = options
    }
    args.push(go$readdir$cb)

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort()

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]])

      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype)
    ReadStream.prototype.open = ReadStream$open
  }

  var fs$WriteStream = fs.WriteStream
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype)
    WriteStream.prototype.open = WriteStream$open
  }

  Object.defineProperty(fs, 'ReadStream', {
    get: function () {
      return ReadStream
    },
    set: function (val) {
      ReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  Object.defineProperty(fs, 'WriteStream', {
    get: function () {
      return WriteStream
    },
    set: function (val) {
      WriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  // legacy names
  var FileReadStream = ReadStream
  Object.defineProperty(fs, 'FileReadStream', {
    get: function () {
      return FileReadStream
    },
    set: function (val) {
      FileReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  var FileWriteStream = WriteStream
  Object.defineProperty(fs, 'FileWriteStream', {
    get: function () {
      return FileWriteStream
    },
    set: function (val) {
      FileWriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new fs.ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new fs.WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  global[gracefulQueue].push(elem)
}

function retry () {
  var elem = global[gracefulQueue].shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}


/***/ }),

/***/ "./node_modules/graceful-fs/legacy-streams.js":
/*!****************************************************!*\
  !*** ./node_modules/graceful-fs/legacy-streams.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Stream = __webpack_require__(/*! stream */ "stream").Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}


/***/ }),

/***/ "./node_modules/graceful-fs/polyfills.js":
/*!***********************************************!*\
  !*** ./node_modules/graceful-fs/polyfills.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(/*! constants */ "constants")

var origCwd = process.cwd
var cwd = null

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

var chdir = process.chdir
process.chdir = function(d) {
  cwd = null
  chdir.call(process, d)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er)
            })
          }, backoff)
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) {
    function read (fd, buffer, offset, length, position, callback_) {
      var callback
      if (callback_ && typeof callback_ === 'function') {
        var eagCounter = 0
        callback = function (er, _, __) {
          if (er && er.code === 'EAGAIN' && eagCounter < 10) {
            eagCounter ++
            return fs$read.call(fs, fd, buffer, offset, length, position, callback)
          }
          callback_.apply(this, arguments)
        }
      }
      return fs$read.call(fs, fd, buffer, offset, length, position, callback)
    }

    // This ensures `util.promisify` works as it does for native `fs.read`.
    read.__proto__ = fs$read
    return read
  })(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)

  function patchLchmod (fs) {
    fs.lchmod = function (path, mode, callback) {
      fs.open( path
             , constants.O_WRONLY | constants.O_SYMLINK
             , mode
             , function (err, fd) {
        if (err) {
          if (callback) callback(err)
          return
        }
        // prefer to return the chmod error, if one occurs,
        // but still try to close, and report closing errors if they occur.
        fs.fchmod(fd, mode, function (err) {
          fs.close(fd, function(err2) {
            if (callback) callback(err || err2)
          })
        })
      })
    }

    fs.lchmodSync = function (path, mode) {
      var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      var threw = true
      var ret
      try {
        ret = fs.fchmodSync(fd, mode)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }
  }

  function patchLutimes (fs) {
    if (constants.hasOwnProperty("O_SYMLINK")) {
      fs.lutimes = function (path, at, mt, cb) {
        fs.open(path, constants.O_SYMLINK, function (er, fd) {
          if (er) {
            if (cb) cb(er)
            return
          }
          fs.futimes(fd, at, mt, function (er) {
            fs.close(fd, function (er2) {
              if (cb) cb(er || er2)
            })
          })
        })
      }

      fs.lutimesSync = function (path, at, mt) {
        var fd = fs.openSync(path, constants.O_SYMLINK)
        var ret
        var threw = true
        try {
          ret = fs.futimesSync(fd, at, mt)
          threw = false
        } finally {
          if (threw) {
            try {
              fs.closeSync(fd)
            } catch (er) {}
          } else {
            fs.closeSync(fd)
          }
        }
        return ret
      }

    } else {
      fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
      fs.lutimesSync = function () {}
    }
  }

  function chmodFix (orig) {
    if (!orig) return orig
    return function (target, mode, cb) {
      return orig.call(fs, target, mode, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chmodFixSync (orig) {
    if (!orig) return orig
    return function (target, mode) {
      try {
        return orig.call(fs, target, mode)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function chownFix (orig) {
    if (!orig) return orig
    return function (target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chownFixSync (orig) {
    if (!orig) return orig
    return function (target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }

  function statFix (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options, cb) {
      if (typeof options === 'function') {
        cb = options
        options = null
      }
      function callback (er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 0x100000000
          if (stats.gid < 0) stats.gid += 0x100000000
        }
        if (cb) cb.apply(this, arguments)
      }
      return options ? orig.call(fs, target, options, callback)
        : orig.call(fs, target, callback)
    }
  }

  function statFixSync (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options) {
      var stats = options ? orig.call(fs, target, options)
        : orig.call(fs, target)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      return stats;
    }
  }

  // ENOSYS means that the fs doesn't support the op. Just ignore
  // that, because it doesn't matter.
  //
  // if there's no getuid, or if getuid() is something other
  // than 0, and the error is EINVAL or EPERM, then just ignore
  // it.
  //
  // This specific case is a silent failure in cp, install, tar,
  // and most other unix tools that manage permissions.
  //
  // When running as root, or if other types of errors are
  // encountered, then it's strict.
  function chownErOk (er) {
    if (!er)
      return true

    if (er.code === "ENOSYS")
      return true

    var nonroot = !process.getuid || process.getuid() !== 0
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true
    }

    return false
  }
}


/***/ }),

/***/ "./node_modules/jsonfile/index.js":
/*!****************************************!*\
  !*** ./node_modules/jsonfile/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _fs
try {
  _fs = __webpack_require__(/*! graceful-fs */ "./node_modules/graceful-fs/graceful-fs.js")
} catch (_) {
  _fs = __webpack_require__(/*! fs */ "fs")
}

function readFile (file, options, callback) {
  if (callback == null) {
    callback = options
    options = {}
  }

  if (typeof options === 'string') {
    options = {encoding: options}
  }

  options = options || {}
  var fs = options.fs || _fs

  var shouldThrow = true
  if ('throws' in options) {
    shouldThrow = options.throws
  }

  fs.readFile(file, options, function (err, data) {
    if (err) return callback(err)

    data = stripBom(data)

    var obj
    try {
      obj = JSON.parse(data, options ? options.reviver : null)
    } catch (err2) {
      if (shouldThrow) {
        err2.message = file + ': ' + err2.message
        return callback(err2)
      } else {
        return callback(null, null)
      }
    }

    callback(null, obj)
  })
}

function readFileSync (file, options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {encoding: options}
  }

  var fs = options.fs || _fs

  var shouldThrow = true
  if ('throws' in options) {
    shouldThrow = options.throws
  }

  try {
    var content = fs.readFileSync(file, options)
    content = stripBom(content)
    return JSON.parse(content, options.reviver)
  } catch (err) {
    if (shouldThrow) {
      err.message = file + ': ' + err.message
      throw err
    } else {
      return null
    }
  }
}

function stringify (obj, options) {
  var spaces
  var EOL = '\n'
  if (typeof options === 'object' && options !== null) {
    if (options.spaces) {
      spaces = options.spaces
    }
    if (options.EOL) {
      EOL = options.EOL
    }
  }

  var str = JSON.stringify(obj, options ? options.replacer : null, spaces)

  return str.replace(/\n/g, EOL) + EOL
}

function writeFile (file, obj, options, callback) {
  if (callback == null) {
    callback = options
    options = {}
  }
  options = options || {}
  var fs = options.fs || _fs

  var str = ''
  try {
    str = stringify(obj, options)
  } catch (err) {
    // Need to return whether a callback was passed or not
    if (callback) callback(err, null)
    return
  }

  fs.writeFile(file, str, options, callback)
}

function writeFileSync (file, obj, options) {
  options = options || {}
  var fs = options.fs || _fs

  var str = stringify(obj, options)
  // not sure if fs.writeFileSync returns anything, but just in case
  return fs.writeFileSync(file, str, options)
}

function stripBom (content) {
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) content = content.toString('utf8')
  content = content.replace(/^\uFEFF/, '')
  return content
}

var jsonfile = {
  readFile: readFile,
  readFileSync: readFileSync,
  writeFile: writeFile,
  writeFileSync: writeFileSync
}

module.exports = jsonfile


/***/ }),

/***/ "./node_modules/v8-compile-cache/v8-compile-cache.js":
/*!***********************************************************!*\
  !*** ./node_modules/v8-compile-cache/v8-compile-cache.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

const Module = __webpack_require__(/*! module */ "module");
const crypto = __webpack_require__(/*! crypto */ "crypto");
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const vm = __webpack_require__(/*! vm */ "vm");
const os = __webpack_require__(/*! os */ "os");

const hasOwnProperty = Object.prototype.hasOwnProperty;

//------------------------------------------------------------------------------
// FileSystemBlobStore
//------------------------------------------------------------------------------

class FileSystemBlobStore {
  constructor(directory, prefix) {
    const name = prefix ? slashEscape(prefix + '.') : '';
    this._blobFilename = path.join(directory, name + 'BLOB');
    this._mapFilename = path.join(directory, name + 'MAP');
    this._lockFilename = path.join(directory, name + 'LOCK');
    this._directory = directory;
    this._load();
  }

  has(key, invalidationKey) {
    if (hasOwnProperty.call(this._memoryBlobs, key)) {
      return this._invalidationKeys[key] === invalidationKey;
    } else if (hasOwnProperty.call(this._storedMap, key)) {
      return this._storedMap[key][0] === invalidationKey;
    }
    return false;
  }

  get(key, invalidationKey) {
    if (hasOwnProperty.call(this._memoryBlobs, key)) {
      if (this._invalidationKeys[key] === invalidationKey) {
        return this._memoryBlobs[key];
      }
    } else if (hasOwnProperty.call(this._storedMap, key)) {
      const mapping = this._storedMap[key];
      if (mapping[0] === invalidationKey) {
        return this._storedBlob.slice(mapping[1], mapping[2]);
      }
    }
  }

  set(key, invalidationKey, buffer) {
    this._invalidationKeys[key] = invalidationKey;
    this._memoryBlobs[key] = buffer;
    this._dirty = true;
  }

  delete(key) {
    if (hasOwnProperty.call(this._memoryBlobs, key)) {
      this._dirty = true;
      delete this._memoryBlobs[key];
    }
    if (hasOwnProperty.call(this._invalidationKeys, key)) {
      this._dirty = true;
      delete this._invalidationKeys[key];
    }
    if (hasOwnProperty.call(this._storedMap, key)) {
      this._dirty = true;
      delete this._storedMap[key];
    }
  }

  isDirty() {
    return this._dirty;
  }

  save() {
    const dump = this._getDump();
    const blobToStore = Buffer.concat(dump[0]);
    const mapToStore = JSON.stringify(dump[1]);

    try {
      mkdirpSync(this._directory);
      fs.writeFileSync(this._lockFilename, 'LOCK', {flag: 'wx'});
    } catch (error) {
      // Swallow the exception if we fail to acquire the lock.
      return false;
    }

    try {
      fs.writeFileSync(this._blobFilename, blobToStore);
      fs.writeFileSync(this._mapFilename, mapToStore);
    } catch (error) {
      throw error;
    } finally {
      fs.unlinkSync(this._lockFilename);
    }

    return true;
  }

  _load() {
    try {
      this._storedBlob = fs.readFileSync(this._blobFilename);
      this._storedMap = JSON.parse(fs.readFileSync(this._mapFilename));
    } catch (e) {
      this._storedBlob = Buffer.alloc(0);
      this._storedMap = {};
    }
    this._dirty = false;
    this._memoryBlobs = {};
    this._invalidationKeys = {};
  }

  _getDump() {
    const buffers = [];
    const newMap = {};
    let offset = 0;

    function push(key, invalidationKey, buffer) {
      buffers.push(buffer);
      newMap[key] = [invalidationKey, offset, offset + buffer.length];
      offset += buffer.length;
    }

    for (const key of Object.keys(this._memoryBlobs)) {
      const buffer = this._memoryBlobs[key];
      const invalidationKey = this._invalidationKeys[key];
      push(key, invalidationKey, buffer);
    }

    for (const key of Object.keys(this._storedMap)) {
      if (hasOwnProperty.call(newMap, key)) continue;
      const mapping = this._storedMap[key];
      const buffer = this._storedBlob.slice(mapping[1], mapping[2]);
      push(key, mapping[0], buffer);
    }

    return [buffers, newMap];
  }
}

//------------------------------------------------------------------------------
// NativeCompileCache
//------------------------------------------------------------------------------

class NativeCompileCache {
  constructor() {
    this._cacheStore = null;
    this._previousModuleCompile = null;
  }

  setCacheStore(cacheStore) {
    this._cacheStore = cacheStore;
  }

  install() {
    const self = this;
    const hasRequireResolvePaths = typeof require.resolve.paths === 'function';
    this._previousModuleCompile = Module.prototype._compile;
    Module.prototype._compile = function(content, filename) {
      const mod = this;

      function require(id) {
        return mod.require(id);
      }

      // https://github.com/nodejs/node/blob/v10.15.3/lib/internal/modules/cjs/helpers.js#L28
      function resolve(request, options) {
        return Module._resolveFilename(request, mod, false, options);
      }
      require.resolve = resolve;

      // https://github.com/nodejs/node/blob/v10.15.3/lib/internal/modules/cjs/helpers.js#L37
      // resolve.resolve.paths was added in v8.9.0
      if (hasRequireResolvePaths) {
        resolve.paths = function paths(request) {
          return Module._resolveLookupPaths(request, mod, true);
        };
      }

      require.main = process.mainModule;

      // Enable support to add extra extension types
      require.extensions = Module._extensions;
      require.cache = Module._cache;

      const dirname = path.dirname(filename);

      const compiledWrapper = self._moduleCompile(filename, content);

      // We skip the debugger setup because by the time we run, node has already
      // done that itself.

      // `Buffer` is included for Electron.
      // See https://github.com/zertosh/v8-compile-cache/pull/10#issuecomment-518042543
      const args = [mod.exports, require, mod, filename, dirname, process, global, Buffer];
      return compiledWrapper.apply(mod.exports, args);
    };
  }

  uninstall() {
    Module.prototype._compile = this._previousModuleCompile;
  }

  _moduleCompile(filename, content) {
    // https://github.com/nodejs/node/blob/v7.5.0/lib/module.js#L511

    // Remove shebang
    var contLen = content.length;
    if (contLen >= 2) {
      if (content.charCodeAt(0) === 35/*#*/ &&
          content.charCodeAt(1) === 33/*!*/) {
        if (contLen === 2) {
          // Exact match
          content = '';
        } else {
          // Find end of shebang line and slice it off
          var i = 2;
          for (; i < contLen; ++i) {
            var code = content.charCodeAt(i);
            if (code === 10/*\n*/ || code === 13/*\r*/) break;
          }
          if (i === contLen) {
            content = '';
          } else {
            // Note that this actually includes the newline character(s) in the
            // new output. This duplicates the behavior of the regular
            // expression that was previously used to replace the shebang line
            content = content.slice(i);
          }
        }
      }
    }

    // create wrapper function
    var wrapper = Module.wrap(content);

    var invalidationKey = crypto
      .createHash('sha1')
      .update(content, 'utf8')
      .digest('hex');

    var buffer = this._cacheStore.get(filename, invalidationKey);

    var script = new vm.Script(wrapper, {
      filename: filename,
      lineOffset: 0,
      displayErrors: true,
      cachedData: buffer,
      produceCachedData: true,
    });

    if (script.cachedDataProduced) {
      this._cacheStore.set(filename, invalidationKey, script.cachedData);
    } else if (script.cachedDataRejected) {
      this._cacheStore.delete(filename);
    }

    var compiledWrapper = script.runInThisContext({
      filename: filename,
      lineOffset: 0,
      columnOffset: 0,
      displayErrors: true,
    });

    return compiledWrapper;
  }
}

//------------------------------------------------------------------------------
// utilities
//
// https://github.com/substack/node-mkdirp/blob/f2003bb/index.js#L55-L98
// https://github.com/zertosh/slash-escape/blob/e7ebb99/slash-escape.js
//------------------------------------------------------------------------------

function mkdirpSync(p_) {
  _mkdirpSync(path.resolve(p_), parseInt('0777', 8) & ~process.umask());
}

function _mkdirpSync(p, mode) {
  try {
    fs.mkdirSync(p, mode);
  } catch (err0) {
    if (err0.code === 'ENOENT') {
      _mkdirpSync(path.dirname(p));
      _mkdirpSync(p);
    } else {
      try {
        const stat = fs.statSync(p);
        if (!stat.isDirectory()) { throw err0; }
      } catch (err1) {
        throw err0;
      }
    }
  }
}

function slashEscape(str) {
  const ESCAPE_LOOKUP = {
    '\\': 'zB',
    ':': 'zC',
    '/': 'zS',
    '\x00': 'z0',
    'z': 'zZ',
  };
  return str.replace(/[\\:\/\x00z]/g, match => (ESCAPE_LOOKUP[match]));
}

function supportsCachedData() {
  const script = new vm.Script('""', {produceCachedData: true});
  // chakracore, as of v1.7.1.0, returns `false`.
  return script.cachedDataProduced === true;
}

function getCacheDir() {
  // Avoid cache ownership issues on POSIX systems.
  const dirname = typeof process.getuid === 'function'
    ? 'v8-compile-cache-' + process.getuid()
    : 'v8-compile-cache';
  const version = typeof process.versions.v8 === 'string'
    ? process.versions.v8
    : typeof process.versions.chakracore === 'string'
      ? 'chakracore-' + process.versions.chakracore
      : 'node-' + process.version;
  const cacheDir = path.join(os.tmpdir(), dirname, version);
  return cacheDir;
}

function getParentName() {
  // `module.parent.filename` is undefined or null when:
  //    * node -e 'require("v8-compile-cache")'
  //    * node -r 'v8-compile-cache'
  //    * Or, requiring from the REPL.
  const parentName = module.parent && typeof module.parent.filename === 'string'
    ? module.parent.filename
    : process.cwd();
  return parentName;
}

//------------------------------------------------------------------------------
// main
//------------------------------------------------------------------------------

if (!process.env.DISABLE_V8_COMPILE_CACHE && supportsCachedData()) {
  const cacheDir = getCacheDir();
  const prefix = getParentName();
  const blobStore = new FileSystemBlobStore(cacheDir, prefix);

  const nativeCompileCache = new NativeCompileCache();
  nativeCompileCache.setCacheStore(blobStore);
  nativeCompileCache.install();

  process.once('exit', code => {
    if (blobStore.isDirty()) {
      blobStore.save();
    }
    nativeCompileCache.uninstall();
  });
}

module.exports.__TEST__ = {
  FileSystemBlobStore,
  NativeCompileCache,
  mkdirpSync,
  slashEscape,
  supportsCachedData,
  getCacheDir,
  getParentName,
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/main/main.js":
/*!**************************!*\
  !*** ./src/main/main.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {
  app,
  ipcMain,
  BrowserWindow,
  Menu
} = __webpack_require__(/*! electron */ "electron");

//import 'font-awesome-webpack';

__webpack_require__(/*! v8-compile-cache */ "./node_modules/v8-compile-cache/v8-compile-cache.js");

const path = __webpack_require__(/*! path */ "path");
const url = __webpack_require__(/*! url */ "url");
const settings = __webpack_require__(/*! electron-settings */ "./node_modules/electron-settings/index.js");
const fs = __webpack_require__(/*! fs */ "fs");

const common = path.resolve(app.getAppPath(),'src/common');

var dirSaveGame = path.resolve(common,'savegame');
var dirScenarios = path.resolve(common,'scenarios');

global.params = {};


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let gowWindows = {};

// main process

let windowState = {};
try {
  windowState = settings.get('windowstate', {
    "main": {
      "bounds": {
        "x": 0,
        "y": 0,
        "width": 800,
        "height": 600
      },
      "isMaximized": false
    },
    "projector": {
      "bounds": {
        "x": 100,
        "y": 100,
        "width": 800,
        "height": 600
      },
      "isMaximized": false
    }
  });
} catch (err) {
  // the file is there, but corrupt. Handle appropriately.
}

let storeWindowState = function() {
  windowState.main.isMaximized = gowWindows.main.isMaximized();
  windowState.projector.isMaximized = gowWindows.projector.isMaximized();
  if (!windowState.main.isMaximized) {
    // only update bounds if the window isn't currently maximized
    windowState.main.bounds = gowWindows.main.getBounds();
  }
  if (!windowState.projector.isMaximized) {
    // only update bounds if the window isn't currently maximized
    windowState.projector.bounds = gowWindows.projector.getBounds();
  }
  settings.set('windowstate', windowState);
};

function createWindow() {
  // Create the browser window.
  gowWindows.main = new BrowserWindow({
    x: windowState.main.bounds && windowState.main.bounds.x || undefined,
    y: windowState.main.bounds && windowState.main.bounds.y || undefined,
    width: windowState.main.bounds && windowState.main.bounds.width || 800,
    height: windowState.main.bounds && windowState.main.bounds.height || 600,
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'GOW Admin',
    backgroundColor: 'rgb(236, 236, 236)',
    webPreferences: {
      preload: undefined,
      nodeIntegration: true
    }
  });

  let menuTemplate = [{
      label: 'Game',
      submenu: [{
          label: 'New Game',
          click() {
            gowWindows.projector.webContents.reload();
            gowWindows.main.webContents.reload();
          }
        },
        {
          label: 'Load Game',
          click() {
            gowWindows.projector.webContents.reload();
            gowWindows.main.webContents.reload();
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'System',
      submenu: [{
          label: 'Restart Application',
          click() {
            reloadApp();
          }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'F12',
          click() {
            gowWindows.main.toggleDevTools();
            gowWindows.projector.toggleDevTools();
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Help',
          accelerator: 'F1',
          click() {
            showHelp();
          }
        }
      ]
    }
  ];
  gowWindows.main.webContents.openDevTools()

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  //gowWindows.main.setMenu(menu);

  if (windowState.main.isMaximized) {
    gowWindows.main.maximize();
  }

//gowWindows.main.loadUrl(GOW_CONSOLE_WEBPACK_ENTRY);
  // and load the index.html of the app.
  gowWindows.main.loadURL(url.format({
    pathname: 'http://localhost:3000/gow_console'
  }));

  // Open the DevTools.
  //  gowWindows.main.webContents.openDevTools()

  gowWindows.main.on('close', event => {
    storeWindowState();
    event.preventDefault(); //this prevents it from closing. The `closed` event will not fire now
    gowWindows.main.webContents.send('quitModal');
    /* DEPRECATED BY USING XEL MODALS
    let child = new BrowserWindow({parent: gowWindows.main, modal: true, resizable: false, width: 440, height: 180, show: false})
    child.loadURL(url.format({
        pathname: path.join(__dirname, 'quit.html'),
        protocol: 'file:',
        slashes: true
    }))*/
    ipcMain.on('reallyQuit', (event) => {
      app.exit();
    });

    //app.exit();
  });
  gowWindows.main.on('resize move close', function() {
    storeWindowState();
  });
  // Emitted when the window is closed.
  gowWindows.main.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    gowWindows.main = null;
  });
  gowWindows.main.on('resize', function() {
    storeWindowState();
  });
  gowWindows.main.on('move', function() {
    storeWindowState();
  });
}



function createProjector() {
  // Create the browser window.
  gowWindows.projector = new BrowserWindow({
    x: windowState.projector.bounds && windowState.projector.bounds.x || undefined,
    y: windowState.projector.bounds && windowState.projector.bounds.y || undefined,
    width: windowState.projector.bounds && windowState.projector.bounds.width || 800,
    height: windowState.projector.bounds && windowState.projector.bounds.height || 600,
    icon: path.join(__dirname, 'img/icon.png'),
    title: 'GOW',
    backgroundColor: 'rgb(236, 236, 236)',
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (windowState.projector.isMaximized) {
    gowWindows.projector.maximize();
  }

  // and load the index.html of the app.
  gowWindows.projector.loadURL(url.format({
    pathname: 'http://localhost:3000/gow_projector',
    fullscreenable: true
  }));

  // Open the DevTools.
  //      gowWindows.projector.webContents.openDevTools()

  // Emitted when the window is closed.
  gowWindows.projector.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    gowWindows.projector = null;
  });
  gowWindows.projector.on('close', event => {
    storeWindowState();
    event.preventDefault(); //this prevents it from closing. The `closed` event will not fire now
    gowWindows.main.webContents.send('buttonSwitch', "#projectorBtn", false);
    gowWindows.main.webContents.send('buttonSwitch', "#fullscreenBtn", false);
    gowWindows.projector.hide();
  });
  gowWindows.projector.on('leave-full-screen', () => {
    gowWindows.main.webContents.send('buttonSwitch', "#fullscreenBtn", false);
  });
  gowWindows.projector.on('enter-full-screen', () => {
    gowWindows.main.webContents.send('buttonSwitch', "#fullscreenBtn", true);
  });
  gowWindows.projector.webContents.on('did-finish-load', () => {

  });

  gowWindows.projector.on('resize', function() {
    storeWindowState();
  });
  gowWindows.projector.on('move', function() {
    storeWindowState();
  });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
app.on('ready', createProjector);
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (gowWindows.main === null) {
    createWindow();
  }
});

if (!fs.existsSync(dirSaveGame)) {
  fs.mkdirSync(dirSaveGame);
}

if (!fs.existsSync(dirScenarios)) {
  fs.mkdirSync(dirScenarios);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// Game Worlds scripts

// Logs generating

function currentDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

function createLog(text) {
  var file = fs.openSync(app.gatPath('userData') + "log-" + currentDate() + ".log", 'a');
  fs.writeFile(file, text, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The log was saved!");
  });
}

function saveDefaultScenario(scenario) {
  scenarioPath = dirScenarios + '/default.json';
  if (!fs.existsSync(scenarioPath)) {
    var file = fs.openSync(scenarioPath, 'a');
    fs.writeFile(file, JSON.stringify(scenario), function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Default Scenario was saved.");
    });
  }
}

function defaultSettings() {
  let scenario = {
    scenario: 'default',
    year: 0,
    phase: 0,
    clock: {
      "pause": 7,
      "diplomacy": 4,
      "brief": 0.5
    },
    longPause: 7,
    realyear: 2037,
    shortPause: 0.5,
    name: 'gow-settings',
    countryCount: 18,
    yearCount: 5,
    countryCodes: {
      'SVK': {
        code: 'SVK',
        country: 'Slovensko',
        area: "EuroAfrika",
        playing: false,
        desc: "Môže kúpiť dve armády za tri ropy"
      },
      'RUS': {
        code: 'RUS',
        country: 'Rusko',
        area: "EuroAfrika",
        playing: false,
        desc: "Ak v aktuálnom kole získalo Rusko aspoň jednu ropu, získa po boji ďalšiu ropu."
      },
      'GBR': {
        code: 'GBR',
        country: 'Veľká Británia',
        area: "EuroAfrika",
        playing: false,
        desc: "Neplatí za presun na iný kontinent."
      },
      'FRA': {
        code: 'FRA',
        country: 'Francúzsko',
        area: "EuroAfrika",
        playing: false,
        desc: "Vždy keď prehrá boj, vezme si jednu z použitých akčných kariet."
      },
      'JAR': {
        code: 'JAR',
        country: 'JAR',
        area: "EuroAfrika",
        playing: false,
        desc: "Vždy keď je po boji na víťaznej strane, získa 1 zlato."
      },
      'USA': {
        code: 'USA',
        country: 'USA',
        area: "DvojAmerika",
        playing: false,
        desc: "Začína s 5 žetónmi armády."
      },
      'CAN': {
        code: 'CAN',
        country: 'Kanada',
        area: "DvojAmerika",
        playing: false,
        desc: "Kov nakupuje z banky za 2 zdroje zlata."
      },
      'MEX': {
        code: 'MEX',
        country: 'Mexiko',
        area: "DvojAmerika",
        playing: false,
        desc: "Raz za kolo si môže za 1 kov kúpiť jednu mimozemskú akčnú kartu."
      },
      'BRA': {
        code: 'BRA',
        country: 'Brazília',
        area: "DvojAmerika",
        playing: false,
        desc: "Ropu a kov kupuje za 3 zdroje zlata."
      },
      'VEN': {
        code: 'VEN',
        country: 'Venezuela',
        area: "DvojAmerika",
        playing: false,
        desc: "AK 'Príhovor kapitána D.' ruší všetky AK v aktuálnom boji."
      },
      'CHN': {
        code: 'CHN',
        country: 'Čína',
        area: "AustraloÁzia",
        playing: false,
        desc: "Keď prispeje do hlavnej udalosti môže sa rátať príspevok ako o 2 zdroje zlata väčší."
      },
      'IND': {
        code: 'IND',
        country: 'India',
        area: "AustraloÁzia",
        playing: false,
        desc: "Ktorúkoľvek svoju AK môže použiť ako AK 'Francúzsky útok'. Rozhodnúť sa môže aj počas boja po odhalení AK."
      },
      'IRN': {
        code: 'IRN',
        country: 'Irán',
        area: "AustraloÁzia",
        playing: false,
        desc: "AK 'Zelení turisti' poskytuje bonus +4."
      },
      'JPN': {
        code: 'JPN',
        country: 'Japonsko',
        area: "AustraloÁzia",
        playing: false,
        desc: "V každom boji môžu použiť 2 AK namiesto jednej."
      },
      'AUS': {
        code: 'AUS',
        country: 'Austrália',
        area: "AustraloÁzia",
        playing: false,
        desc: "Vždy keď bojuje mimo svojho kontinentu, má silu +1."
      },

      'GER': {
        code: 'GER',
        country: 'Nemecko',
        area: "EuroAfrika",
        playing: false,
        desc: "Keď je v hlavnej udalosti súčasťou víťaznej aliancie, získava naviac 3 body."
      },

      'CUB': {
        code: 'CUB',
        country: 'Kuba',
        area: "DvojAmerika",
        playing: false,
        desc: "Keď je v boji, ktorý skončí remízou, berie si suroviny, ale nie body."
      },

      'KOR': {
        code: 'KOR',
        country: 'Kórea',
        area: "AustraloÁzia",
        playing: false,
        desc: "Keď má na území armádu iba Kórea, dostane +1 zlato."
      }
    },
    countryList: [
      'FRA',
      'SVK',
      'GBR',
      'RUS',
      'USA',
      'JAR',
      'AUS',
      'CHN',
      'JPN',
      'CAN',
      'BRA',
      'MEX',
      'VEN',
      'IND',
      'IRN',
      'GER',
      'CUB',
      'KOR'
    ],
    phases: [{
      title: 'Pomoc štvrtému svetu',
      slug: 'pomoc',
      text: 'Nastal čas splniť svoje sľuby a pomocť krajinám, ktoré vašu pomoc potrebujú.'
    }, {
      title: 'Správy zo sveta',
      slug: 'spravy',
      text: 'Usaďte sa pri svojich domovských stoloch a vypočujte si, čo o vašich vládach hovoria zmanipulované médiá.'
    }, {
      title: 'Čas na strategické rozhodnutia',
      slug: 'porada',
      text: 'Teraz sa môžu generáli, diplomati a prezidenti dohodnúť na ďalšej stratégii. Využite tento čas dobre.'
    }, {
      title: 'Rozkladanie armád',
      slug: 'rozkladanie',
      text: 'Generáli, presuňte sa k strategickej mape, budete rozkladať svoje armády.'
    }, {
      title: 'Diplomacia',
      slug: 'diplomacia',
      text: 'Je čas vyjednávať s ostatnými krajinami a ukladať na mapu akčné karty.'
    }, {
      title: 'Vyhodnotenie bojov',
      slug: 'vyhodnotenie',
      text: 'Generáli, presuňte sa naspäť k strategickej mape. Teraz sa rozhodne o budúcnosti sveta.'
    }, {
      title: 'Pauza',
      slug: 'pauza',
      text: 'Dohodnite sa na ďalšej stratégii a užite si pauzu.'
    }],

    /* UFO EVENTS */
    ufoEvents: [{
      title: 'Láska hory prenáša',
      text: 'Spoločná láska slniečkárov na mítingu v Banskej štiavnici preniesla Ural na iné vybrané územie. Kov získa víťaz boja.',
      secret: 'Padne 6x kov.'
    }, {
      title: 'Mimozemská základňa',
      text: 'Objavila sa základňa mimozemšťanov. Podľa získaných informácií sa v nej nachádza pokročilá technológia, ktorou dokáže vymazať niektoré územia z povrchu Zeme.',
      secret: 'Objavila sa základňa mimozemšťanov. Je tam (2x počet tímov) mimozemských armád a 6 mimozemských AK '
    }, {
      title: 'Tomtom huge človek človeku',
      text: 'Donald Trump bol na návšteve Andreja Danka v Pezinku. Ich spoločný príhovor vyvolal vlnu megalománie a nepochopenia. Každé víťazstvo prináša viac bodov.',
      secret: 'Body za boje sa zdvojnásobujú.'
    }, {
      title: 'Pád UFO',
      text: 'Zrútilo sa UFO. Priekupníci z celého sveta si brúsia zuby na mimozemskú technológiu. Mimozemšťania útočia priamo na bojujúce armády.',
      secret: 'Padne 6x ropa.'
    }, {
      title: 'Zem je plochá',
      text: 'Vďaka tajným technológiám mimozemšťanov sa zistilo, že Zem je plochá. Už sa necestuje po trojuholníkoch, cestuje sa zdarma.',
      secret: 'Cestuje sa zadarmo.'
    }, {
      title: '',
      text: '',
      secret: ''
    }],

    /* WORLD EVENTS */
    worldEvents: [{
      title: 'Tender v SIS',
      text: 'Slovenská informačná služba vyhlásila tender na splnenie svojich tajných úloh. Najvyššia ponuka vyhráva 4 tajné misie.',
      secret: '4x TM'
    }, {
      title: 'Hlbšie vrty',
      text: 'Investori zháňajú peniaze na stavbu vrtných veží. V hlavnej udalosti je možné získať 6 surovín ropy.',
      secret: '6x Ropa'
    }, {
      title: 'Otvorenie čierneho trhu',
      text: 'Na slávnostnom otvorení čierneho trhu sú pre najväčšieho investora pripravené 4 MK.',
      secret: '4x MK'
    }, {
      title: 'Zľavy až 110%',
      text: 'Svet stojí pred hypotekárnou krízou. Za lacno sa dá získať 8 náhodných AK.',
      secret: '8 AK'
    }, {
      title: 'Olympiáda',
      text: 'Chlieb a hry musia pokračovať. Kto si kúpi možnosť organizovať OH, získa 4 AK typu "Bonusové body"',
      secret: '4x Body'
    }, {
      title: '',
      text: '',
      secret: ''
    }]
  }
  settings.setAll(scenario);
  saveDefaultScenario(scenario);
}
ipcMain.on('startGame', (event) => {
  gowWindows.projector.webContents.send('startGame');
});
ipcMain.on('transferCurrentGame', (event, arg1) => {
  gowWindows.projector.webContents.send('readCurrentGame', arg1);
});
ipcMain.on('transferParams', (event, arg1) => {
  gowWindows.projector.webContents.send('readParams', arg1);
});
ipcMain.on('transferNews', (event, arg) => {
  gowWindows.projector.webContents.send('readNews', arg);
});
ipcMain.on('transferPhase', (event, arg1, arg2, arg3) => {
  gowWindows.projector.webContents.send('readPhase', arg1, arg2, arg3);
});
ipcMain.on('toggleRules', (event) => {
  gowWindows.projector.webContents.send('transferRules');
});
ipcMain.on('toggleFullscreen', (event) => {
  if (gowWindows.projector.isFullScreen()) {
    gowWindows.projector.setFullScreen(false);
  } else {
    gowWindows.projector.setFullScreen(true);
  }
});
ipcMain.on('toggleProjector', (event) => {
  if (gowWindows.projector.isVisible()) {
    gowWindows.projector.hide();
    gowWindows.main.webContents.send('buttonSwitch', "#projectorBtn", false);
    gowWindows.main.webContents.send('buttonSwitch', "#fullscreenBtn", false);
  } else {
    gowWindows.projector.show();
    gowWindows.main.webContents.send('buttonSwitch', "#projectorBtn", true);
  }
});
ipcMain.on('reloadWindows', (event) => {
  gowWindows.projector.webContents.reload();
  gowWindows.main.webContents.reload();
});
ipcMain.on('saveLogs', (event, text) => {
  //createLog(text);
});

//app.on('ready', defaultSettings);
ipcMain.on('saveDefaultSettings', (event) => {
  defaultSettings();
});


/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),

/***/ "constants":
/*!****************************!*\
  !*** external "constants" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("constants");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "module":
/*!*************************!*\
  !*** external "module" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("module");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "vm":
/*!*********************!*\
  !*** external "vm" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("vm");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map