/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/ws-router.js":
/*!***********************************!*\
  !*** ./resources/js/ws-router.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var socket_conveyor_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! socket-conveyor-client */ "./node_modules/socket-conveyor-client/index.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var WsRouter = /*#__PURE__*/function () {
  /**
   * @param {Object} config
   * @param {Object} appHandlers
   */
  function WsRouter(config, appHandlers) {
    _classCallCheck(this, WsRouter);

    this.appHandlers = appHandlers;
    var options = {
      protocol: config.protocol ? config.protocol : 'ws',
      uri: config.uri ? config.uri : '127.0.0.1',
      port: config.port ? config.port : 8000,
      channel: config.channel ? config.channel : null,
      listen: config.listen ? config.listen : null
    }; // events

    if (this.appHandlers.onOpen) options.onOpen = this.appHandlers.onOpen;
    if (this.appHandlers.onClose) options.onClose = this.appHandlers.onClose;
    if (this.appHandlers.onReady) options.onReady = this.appHandlers.onReady;
    options.onRawMessage = this.handleIncomingMessage.bind(this);
    options.onError = this.handleError.bind(this);
    this.ws = new socket_conveyor_client__WEBPACK_IMPORTED_MODULE_0__["default"](options);
  }
  /**
   * @param {Event} e
   */


  _createClass(WsRouter, [{
    key: "handleError",
    value: function handleError(e) {
      console.log('Error occured: ' + evt.data);
    }
    /**
     * @param {String} data
     */

  }, {
    key: "handleIncomingMessage",
    value: function handleIncomingMessage(data) {
      var parsedData = JSON.parse(data);

      if (this.appHandlers[parsedData.action]) {
        this.appHandlers[parsedData.action](this.ws, parsedData);
        return;
      }

      console.log('Not handled action: ' + parsedData.action);
    }
  }]);

  return WsRouter;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WsRouter);

/***/ }),

/***/ "./node_modules/socket-conveyor-client/index.js":
/*!******************************************************!*\
  !*** ./node_modules/socket-conveyor-client/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

class Conveyor {
    constructor(options) {
        this.options = {
            ...{
                protocol: 'ws',
                uri: '127.0.0.1',
                port: 8000,
                query: '',
                channel: null,
                listen: null,
                onOpen: this.onOpen.bind(this),
                onReady: () => {},
                onMessage: () => {}, // Message handler for only the data portion.
                onRawMessage: () => {}, // Message handler for the whole incoming object.
                onClose: () => {},
                onError: () => {},
                reconnect: false,
                reconnectDelay: 5000,
            },
            ...options
        };

        if (this.options.reconnect) {
            this.ws = new WsReconnect({ reconnectDelay: this.options.reconnectDelay });
            this.ws.open(this.options.protocol + '://' + this.options.uri + ':' + this.options.port + this.options.query);
        } else {
            this.ws = new WebSocket(this.options.protocol + '://' + this.options.uri + ':' + this.options.port + this.options.query);
        }
        this.bindEvents();
    }

    bindEvents() {
        this.ws.onopen = this.options.onOpen;
        this.ws.onclose = this.options.onClose;
        this.ws.onerror = this.options.onError;
        this.ws.onmessage = this.baseOnMessage.bind(this);
    }

    onOpen(e) {
        this.connectChannel();
        this.addListeners();
        this.options.onReady();
    }

    baseOnMessage(e) {
        this.options.onRawMessage(e.data);
        const parsedData = JSON.parse(e.data);
        this.options.onMessage(parsedData.data);
    }

    send(message, action) {
        if (typeof action === 'undefined') {
            action = 'base-action';
        }

        this.rawSend(JSON.stringify({
            'action': action,
            'data': message,
        }));
    }

    rawSend(message) {
        this.ws.send(message);
    }

    connectChannel() {
        if (this.options.channel === null) {
            return;
        }

        this.rawSend(JSON.stringify({
            'action': 'channel-connect',
            'channel': this.options.channel,
        }));
    }

    addListeners() {
        if (this.options.listen === null) {
            return;
        }

        if (this.options.listen.constructor !== Array) {
            console.error('"listen" option must be an array.');
            return;
        }

        this.options.listen.forEach((action) => this.listen(action));
    }

    assocUser(userId) {
        this.rawSend(JSON.stringify({
            'action': 'assoc-user-to-fd-action',
            'userId': userId,
        }));
    }

    listen(action) {
        this.rawSend(JSON.stringify({
            'action': 'add-listener',
            'listen': action,
        }));
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Conveyor);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ws_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ws-router */ "./resources/js/ws-router.js");

var app = {
  router: null,
  // {WsRouter}
  config: {
    uri: null,
    port: null
  },
  conns: {},
  messageBox: null,
  // {Element}
  messageForm: null,
  // {Element}
  outputBox: null,
  // {Element}
  connectionsListBox: null,
  // {Element}

  /**
   * @param {Object} config WS Server Info
   * @param {Element} messageForm Form that submits the message
   * @param {Element} messageBox Input where the message is written
   * @param {Element} outputBox Space to write the incoming messages
   * @param {Element} connectionsListBox List of active connections
   */
  init: function init(config, messageForm, messageBox, outputBox, connectionsListBox) {
    app.config = config;
    app.messageForm = messageForm;
    app.messageBox = messageBox;
    app.outputBox = outputBox;
    app.connectionsListBox = connectionsListBox;
    app.router = new _ws_router__WEBPACK_IMPORTED_MODULE_0__["default"](config, {
      // event => handler
      'onReady': app.handleOnReady,
      'onClose': app.handleOnClose,
      // action => handler
      'welcome-action': app.handleWelcomeConnection,
      'new-connection-action': app.handleNewConnection,
      'closed-connection-action': app.handleClosedConnection,
      'broadcast-action': app.handleBroadcast,
      'secondary-broadcast-action': app.handleBroadcast,
      'fanout-action': app.handleBroadcast
    });
    app.listenEvents();
  },
  listenEvents: function listenEvents() {
    app.messageForm.addEventListener("submit", function (e) {
      e.preventDefault();
      app.router.ws.send(app.messageBox.value, 'fanout-action');
    }, false);
  },
  // ----------------------------------------------------------
  // Event Handlers
  // ----------------------------------------------------------
  handleOnReady: function handleOnReady() {
    console.log("Connected to WebSocket server.");
  },

  /**
   * @param {Event} e
   */
  handleOnClose: function handleOnClose(e) {
    console.log("Disconnected");
  },
  // ----------------------------------------------------------
  // Action Handlers
  // ----------------------------------------------------------

  /**
   * @param {WebSocket} ws
   * @param {Object} parsedData
   */
  handleWelcomeConnection: function handleWelcomeConnection(ws, parsedData) {
    var message = JSON.parse(parsedData.data);
    app.conns[parsedData.fd] = [parsedData.fd];
    Object.keys(message.connections).forEach(function (fd) {
      return app.conns[fd] = fd;
    });
    app.connectionsListBox.innerHTML = Object.keys(app.conns).join(', ');
  },

  /**
   * @param {WebSocket} ws
   * @param {Object} parsedData
   */
  handleNewConnection: function handleNewConnection(ws, parsedData) {
    app.conns[parsedData.fd] = parsedData.fd;
    app.connectionsListBox.innerHTML = Object.keys(app.conns).join(', ');
  },

  /**
   * @param {WebSocket} ws
   * @param {Object} parsedData
   */
  handleClosedConnection: function handleClosedConnection(ws, parsedData) {
    delete app.conns[parsedData.fd];
    app.connectionsListBox.innerHTML = Object.keys(app.conns).join(', ');
  },

  /**
   * @param {WebSocket} ws
   * @param {Object} parsedData
   */
  handleBroadcast: function handleBroadcast(ws, parsedData) {
    var input = document.createElement("li");
    input.innerText = '(' + parsedData.fd + ') ' + parsedData.data;
    app.outputBox.appendChild(input);
  }
};
window.app = app;
})();

/******/ })()
;