<?php $this->layout('template', ['page' => 'Home']) ?>

<div>

    <form id="message-form">
        <div>
            <input id="message-box" autocomplete="off" type="text" placeholder="The message goes here..."/>
        </div>
        <input type="submit" value="Submit"/>
    </form>

</div>

<div style="display: flex">
    <div style="margin-right: 5px;">Connections list:</div>
    <div id="connections-list"></div>
</div>

<div>
    <ul id="output"></ul>
</div>

<script src="js/app.js"></script>
<script>
    (function() {
        // #message-form - input for messages to broadcast
        // #message-box - list of incoming messages
        window.app.init(
            {
                port: 8585,
                channel: 'sample-channel',
            },
            document.getElementById('message-form'),
            document.getElementById('message-box'),
            document.getElementById('output'),
            document.getElementById('connections-list')
        );
    })();
</script>