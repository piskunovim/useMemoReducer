'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

var useCurrentSelector = function useCurrentSelector(selector, store, _ref) {
  var subscribe = _ref.subscribe,
    unSubscribe = _ref.unSubscribe;
  var _useState = react.useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    forceRender = _useState2[1];
  var selectorRef = react.useRef(selector);
  selectorRef.current = selector;
  var selectedStateRef = react.useRef(selector(store));
  selectedStateRef.current = selector(store);
  var checkForUpdates = react.useCallback(function (newStore) {
    // Compare new selected state to the last time this hook ran
    var newState = selectorRef.current(newStore);
    // If new state differs from previous state, rerun this hook
    if (newState !== selectedStateRef.current) forceRender(function (s) {
      return s + 1;
    });
  }, []);
  var isSubscribed = react.useRef(false);
  react.useEffect(function () {
    if (!isSubscribed.current) {
      subscribe(checkForUpdates);
    }
    isSubscribed.current = true;
    return function () {
      unSubscribe(checkForUpdates);
    };
  }, [checkForUpdates, subscribe, unSubscribe]);
  return selectedStateRef.current;
};

var DisconnectObserver = /*#__PURE__*/function () {
  function DisconnectObserver() {
    _classCallCheck(this, DisconnectObserver);
    _defineProperty(this, "observers", []);
  }
  _createClass(DisconnectObserver, [{
    key: "subscribe",
    value: function subscribe(observer) {
      this.observers.push(observer);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(observer) {
      var index = this.observers.indexOf(observer);
      if (index !== -1) {
        this.observers.splice(index, 1);
      }
    }
  }, {
    key: "emit",
    value: function emit() {
      this.observers.forEach(function (observer) {
        return observer();
      });
    }
  }]);
  return DisconnectObserver;
}();
var disconnectObserver = new DisconnectObserver();

var REDUX_DEVTOOLS_KEY = '__REDUX_DEVTOOLS_EXTENSION__';

var getDevtoolsExtenstion = function getDevtoolsExtenstion(arg) {
  return REDUX_DEVTOOLS_KEY in arg && arg[REDUX_DEVTOOLS_KEY];
};
var getUniqueName = function getUniqueName(name) {
  return "[useMemoReducer] ".concat(name);
};
var withDevTools = function withDevTools(name) {
  return process.env.NODE_ENV === 'development' && name !== '' && typeof window !== 'undefined' && getDevtoolsExtenstion(window);
};
var createConnection = function createConnection(devtoolsExt, name) {
  if (!devtoolsExt) {
    return null;
  }
  return devtoolsExt.connect({
    name: getUniqueName(name),
    trace: true,
    instanceId: getUniqueName(name)
  });
};
var connections = new Map([]);
var parseConnectionName = function parseConnectionName(connectionName) {
  var _ref = connectionName.split('/'),
    _ref2 = _slicedToArray(_ref, 2),
    name = _ref2[0],
    number = _ref2[1];
  return [name, number - 1];
};
var getConnectionName = function getConnectionName(options) {
  var _connections$get;
  if (!(options !== null && options !== void 0 && options.devtoolsName)) {
    return '';
  }
  var devtoolsName = options.devtoolsName.toLowerCase();
  var connectionsByName = (_connections$get = connections.get(devtoolsName)) !== null && _connections$get !== void 0 ? _connections$get : [];
  var currentVersion = connectionsByName.length > 0 ? connectionsByName.length + 1 : 1;
  return "".concat(devtoolsName, "/").concat(currentVersion);
};
var removeConnection = function removeConnection(connectionName) {
  var _connections$get2;
  var _parseConnectionName = parseConnectionName(connectionName),
    _parseConnectionName2 = _slicedToArray(_parseConnectionName, 2),
    name = _parseConnectionName2[0],
    index = _parseConnectionName2[1];
  var connectionsByName = (_connections$get2 = connections.get(name)) !== null && _connections$get2 !== void 0 ? _connections$get2 : [];
  var currentConnection = connectionsByName[index];
  if (!currentConnection) {
    console.warn("[useMemoReducer] Connection ".concat(connectionName, " is not exists"));
    return;
  }
  var newConnections = connectionsByName.filter(function (_, idx) {
    return idx !== index;
  });
  if (newConnections.length === 0) {
    connections["delete"](name);
  } else {
    connections.set(name, newConnections);
  }
};
var isDevtoolsExist = function isDevtoolsExist(connectionName) {
  return connectionName !== '' && withDevTools(connectionName);
};
var connect = function connect(connectionName, state) {
  var _connections$get3;
  var _parseConnectionName3 = parseConnectionName(connectionName),
    _parseConnectionName4 = _slicedToArray(_parseConnectionName3, 2),
    name = _parseConnectionName4[0],
    index = _parseConnectionName4[1];
  var connectionsByName = (_connections$get3 = connections.get(name)) !== null && _connections$get3 !== void 0 ? _connections$get3 : [];
  var currentConnection = connectionsByName[index];
  if (currentConnection) {
    return currentConnection;
  }
  var newConnection = createConnection(withDevTools(connectionName), connectionName);
  if (!newConnection) {
    console.warn("[useReduxDevtools] Connection ".concat(connectionName, " was not created."));
    return null;
  }
  connections.set(name, [].concat(_toConsumableArray(connectionsByName), [newConnection]));
  newConnection.init(state);
  return newConnection;
};
var disconnect = function disconnect(connectionName) {
  removeConnection(connectionName);
  var devtoolsExt = withDevTools(connectionName);
  if (devtoolsExt) {
    devtoolsExt.disconnect();
    disconnectObserver.emit();
  }
};
var isEnabled = function isEnabled(connectionName) {
  var _connections$get4;
  var _parseConnectionName5 = parseConnectionName(connectionName),
    _parseConnectionName6 = _slicedToArray(_parseConnectionName5, 2),
    name = _parseConnectionName6[0],
    number = _parseConnectionName6[1];
  return typeof ((_connections$get4 = connections.get(name)) === null || _connections$get4 === void 0 ? void 0 : _connections$get4[number]) !== 'undefined';
};

var useReduxDevtools = function useReduxDevtools(reducer, initialState, connectionName, devtoolsExist) {
  var devtoolsReducerRef = react.useRef(reducer(initialState, {
    type: '@@INIT'
  }));
  var connection = react.useMemo(function () {
    return devtoolsExist ? connect(connectionName, devtoolsReducerRef.current) : null;
  }, [connectionName, devtoolsExist]);
  if (!connection) {
    return {
      devtoolsEnabled: function devtoolsEnabled() {
        return false;
      }
    };
  }
  var unsubscribe = react.useRef();
  var subscribe = react.useCallback(function () {
    var _unsubscribe$current;
    (_unsubscribe$current = unsubscribe.current) === null || _unsubscribe$current === void 0 ? void 0 : _unsubscribe$current.call(unsubscribe);
    return connection === null || connection === void 0 ? void 0 : connection.subscribe(function (message) {
      // Implement monitors actions.
      // For example time traveling:
    });
  }, [connection]);
  var reconnect = react.useCallback(function () {
    connection === null || connection === void 0 ? void 0 : connection.send({
      type: '@@RECONNECT'
    }, devtoolsReducerRef.current);
    unsubscribe.current = subscribe();
  }, [connection, subscribe]);
  react.useEffect(function () {
    disconnectObserver.subscribe(reconnect);
    return function () {
      disconnectObserver.unsubscribe(reconnect);
    };
  }, [reconnect]);
  react.useEffect(function () {
    unsubscribe.current = subscribe();
    return function () {
      var _unsubscribe$current2;
      (_unsubscribe$current2 = unsubscribe.current) === null || _unsubscribe$current2 === void 0 ? void 0 : _unsubscribe$current2.call(unsubscribe);
      disconnect(connectionName);
    };
  }, [connectionName, subscribe]);
  var dispatchToDevtools = react.useCallback(function (action) {
    devtoolsReducerRef.current = reducer(devtoolsReducerRef.current, action);
    connection === null || connection === void 0 ? void 0 : connection.send(action, devtoolsReducerRef.current);
  }, [connection, reducer]);
  var devtoolsEnabled = react.useCallback(function () {
    return isEnabled(connectionName);
  }, [connectionName]);
  return react.useMemo(function () {
    return {
      devtoolsEnabled: devtoolsEnabled,
      dispatchToDevtools: dispatchToDevtools
    };
  }, [devtoolsEnabled, dispatchToDevtools]);
};
var useCreateReduxDevtools = function useCreateReduxDevtools(reducer, initialState, options) {
  var memoizedInitialState = react.useRef(initialState);
  var connectionName = react.useMemo(function () {
    return getConnectionName(options);
  }, []);
  return useReduxDevtools(reducer, memoizedInitialState.current, connectionName, isDevtoolsExist(connectionName));
};

var isThunk = function isThunk(action) {
  return typeof action === 'function';
};

var useMemoReducer = function useMemoReducer(reducer, initialState, options) {
  var devtools = useCreateReduxDevtools(reducer, initialState, options);
  var _useReducer = react.useReducer(reducer, initialState),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    store = _useReducer2[0],
    dispatch = _useReducer2[1];
  var devtoolsRef = react.useRef(devtools);
  devtoolsRef.current = devtools;
  var storeRef = react.useRef(store);
  storeRef.current = store;
  var getState = function getState() {
    return storeRef.current;
  };
  var customDispatch = react.useCallback(function (action) {
    if (isThunk(action)) {
      return action(customDispatch, getState);
    }
    if (devtoolsRef.current.devtoolsEnabled()) {
      var _devtoolsRef$current$, _devtoolsRef$current;
      (_devtoolsRef$current$ = (_devtoolsRef$current = devtoolsRef.current).dispatchToDevtools) === null || _devtoolsRef$current$ === void 0 ? void 0 : _devtoolsRef$current$.call(_devtoolsRef$current, action);
    }
    return dispatch(action);
  }, []);
  var subscribersRef = react.useRef(new Set([]));
  react.useLayoutEffect(function () {
    // Notify all subscribers when store state changes
    subscribersRef.current.forEach(function (sub) {
      return sub(store);
    });
  }, [store]);
  var subscribe = react.useCallback(function (subscriber) {
    subscribersRef.current.add(subscriber);
  }, []);
  var unSubscribe = react.useCallback(function (subscriber) {
    subscribersRef.current["delete"](subscriber);
  }, []);
  var useSelector = react.useCallback(function (selector) {
    return useCurrentSelector(selector, getState(), {
      subscribe: subscribe,
      unSubscribe: unSubscribe
    });
  }, [subscribe, unSubscribe]);
  return react.useMemo(function () {
    return [useSelector, customDispatch];
  }, [customDispatch, useSelector]);
};

exports.useMemoReducer = useMemoReducer;
