
import Conveyor from "socket-conveyor-client";

class WsRouter
{
    /**
     * @param {Object} config
     * @param {Object} appHandlers
     */
    constructor(config, appHandlers) {
        this.appHandlers = appHandlers;

        let options = {
            protocol: config.protocol ? config.protocol : 'ws',
            uri: config.uri ? config.uri : '127.0.0.1',
            port: config.port ? config.port : 8000,
            channel: config.channel ? config.channel : null,
        };
        // events
        if (this.appHandlers.onOpen) options.onOpen = this.appHandlers.onOpen;
        if (this.appHandlers.onClose) options.onClose = this.appHandlers.onClose;
        if (this.appHandlers.onReady) options.onReady = this.appHandlers.onReady;
        options.onRawMessage = this.handleIncomingMessage.bind(this);
        options.onError = this.handleError.bind(this);

        this.ws = new Conveyor(options);
    }

    /**
     * @param {Event} e
     */
    handleError(e) {
        console.log('Error occured: ' + evt.data);
    }

    /**
     * @param {String} data
     */
    handleIncomingMessage(data) {
        let parsedData = JSON.parse(data);

        if (this.appHandlers[parsedData.action]) {
            this.appHandlers[parsedData.action](this.ws, parsedData);
            return;
        }

        console.log('Not handled action: ' + parsedData.action);
    }
}

export default WsRouter;
