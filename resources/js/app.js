
import WsRouter from "./ws-router";

var app = {
    router: null, // {WsRouter}
    config: { uri: null, port: null },
    conns: {},
    messageBox: null, // {Element}
    messageForm: null, // {Element}
    outputBox: null, // {Element}
    connectionsListBox: null, // {Element}

    /**
     * @param {Object} config WS Server Info
     * @param {Element} messageForm Form that submits the message
     * @param {Element} messageBox Input where the message is written
     * @param {Element} outputBox Space to write the incoming messages
     * @param {Element} connectionsListBox List of active connections
     */
    init: (
        config,
        messageForm,
        messageBox,
        outputBox,
        connectionsListBox
    ) => {
        app.config = config;
        app.messageForm = messageForm;
        app.messageBox = messageBox;
        app.outputBox = outputBox;
        app.connectionsListBox = connectionsListBox;

        app.router = new WsRouter(
            config,
            {
                // event => handler
                'onReady': app.handleOnReady,
                'onClose': app.handleOnClose,

                // action => handler
                'welcome-action': app.handleWelcomeConnection,
                'new-connection-action': app.handleNewConnection,
                'closed-connection-action': app.handleClosedConnection,
                'broadcast-action': app.handleBroadcast,
                'secondary-broadcast-action': app.handleBroadcast,
                'fanout-action': app.handleBroadcast,
            }
        );

        app.listenEvents();
    },

    listenEvents: () => {
        app.messageForm.addEventListener("submit", (e) => {
            e.preventDefault();
            app.router.ws.send(app.messageBox.value, 'fanout-action');
        }, false);
    },

    // ----------------------------------------------------------
    // Event Handlers
    // ----------------------------------------------------------

    handleOnReady: () => {
        console.log("Connected to WebSocket server.");
    },

    /**
     * @param {Event} e
     */
    handleOnClose: (e) => {
        console.log("Disconnected");
    },

    // ----------------------------------------------------------
    // Action Handlers
    // ----------------------------------------------------------

    /**
     * @param {WebSocket} ws
     * @param {Object} parsedData
     */
    handleWelcomeConnection: (ws, parsedData) => {
        let message = JSON.parse(parsedData.data);
        app.conns[parsedData.fd] = [parsedData.fd];
        Object.keys(message.connections).forEach((fd) => app.conns[fd] = fd);
        app.connectionsListBox.innerHTML = Object.keys(app.conns).join(', ');
    },

    /**
     * @param {WebSocket} ws
     * @param {Object} parsedData
     */
    handleNewConnection: (ws, parsedData) => {
        app.conns[parsedData.fd] = parsedData.fd;
        app.connectionsListBox.innerHTML = Object.keys(app.conns).join(', ');
    },

    /**
     * @param {WebSocket} ws
     * @param {Object} parsedData
     */
    handleClosedConnection: (ws, parsedData) => {
        delete app.conns[parsedData.fd];
        app.connectionsListBox.innerHTML = Object.keys(app.conns).join(', ');
    },

    /**
     * @param {WebSocket} ws
     * @param {Object} parsedData
     */
    handleBroadcast: (ws, parsedData) => {
        let input = document.createElement("li");
        input.innerText = '(' + parsedData.fd + ') ' + parsedData.data;
        app.outputBox.appendChild(input);
    },
};

window.app = app;
