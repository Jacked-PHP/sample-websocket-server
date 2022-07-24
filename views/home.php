<?php $this->layout('template', ['page' => 'Home']) ?>

<div>

    <form id="message-form">
        <div>
            <input id="message-box" type="text" placeholder="The message goes here..."/>
        </div>
        <input type="submit" value="Submit"/>
    </form>

</div>

<div>
    <ul id="output"></ul>
</div>

<script>
    (function() {

        var app = {
            ws: null,

            config: {
                uri: 'ws://127.0.0.1',
                port: 8585,
            },

            init: () => {
                app.connectToServer();
                app.listenEvents();
            },

            listenEvents: () => {
                document.getElementById('message-form').addEventListener("submit", app.handleFormSubmit, false);
            },

            connectToServer: () => {
                var wsServer = app.config.uri + ':' + app.config.port;
                app.ws = new WebSocket(wsServer);

                app.ws.onopen = function (evt) {
                    console.log("Connected to WebSocket server.");
                };

                app.ws.onclose = function (evt) {
                    console.log("Disconnected");
                };

                app.ws.onmessage = function (evt) {
                    console.log('Received data from server: ' + evt.data);
                    app.handleIncomingMessage(evt.data);
                };

                app.ws.onerror = function (evt, e) {
                    console.log('Error occured: ' + evt.data);
                };
            },

            /**
             * @param {Event} e
             */
            handleFormSubmit: (e) => {
                e.preventDefault();
                app.ws.send(document.getElementById('message-box').value);
            },

            /**
             * @param {String} data
             */
            handleIncomingMessage: (data) => {
                let input = document.createElement("li");
                input.innerText = data;
                document.getElementById('output').appendChild(input);
            },
        };

        app.init();
    })();
</script>