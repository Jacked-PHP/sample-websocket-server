<?php

require __DIR__ . '/vendor/autoload.php';

use Conveyor\SocketHandlers\SocketChannelPersistenceTable;
use Conveyor\SocketHandlers\SocketListenerPersistenceTable;
use Conveyor\SocketHandlers\SocketMessageRouter;
use League\Plates\Engine;
use MyApp\Actions\ClosedConnectionAction;
use MyApp\Actions\NewConnectionAction;
use MyApp\Actions\SecondaryBroadcastAction;
use MyApp\Actions\WelcomeAction;
use Swoole\Http\Response;
use Swoole\WebSocket\Frame;
use Swoole\WebSocket\Server;
use Swoole\Http\Request;

// -----------------------------------------------
// Dependencies
// -----------------------------------------------

$persistence = [
    new SocketChannelPersistenceTable,
    new SocketListenerPersistenceTable,
];

// -----------------------------------------------
// Helpers
// -----------------------------------------------

function processMessage(
    string $data,
    int $fd,
    Server $server,
    array $persistence
) {
    $socketRouter = new SocketMessageRouter($persistence);
    $socketRouter->add(new WelcomeAction);
    $socketRouter->add(new SecondaryBroadcastAction);
    $socketRouter->add(new NewConnectionAction);
    $socketRouter->add(new ClosedConnectionAction);
    $socketRouter($data, $fd, $server);
}


$server = new Server('0.0.0.0', 8585);

$server->on("start", function (Server $server) {
    echo 'Websocket server started at http://127.0.0.1:' . $server->port . PHP_EOL;
});

$server->on('open', function (Server $server, Request $request) use ($persistence) {
    echo 'Connection opened: ' . $request->fd . PHP_EOL;
    processMessage(
        json_encode(['action' => WelcomeAction::ACTION_NAME, 'data' => '']),
        $request->fd,
        $server,
        $persistence
    );
    processMessage(
        json_encode(['action' => NewConnectionAction::ACTION_NAME]),
        $request->fd,
        $server,
        $persistence
    );
});

$server->on('message', function (Server $server, Frame $frame) use ($persistence) {
    echo 'Received message: ' . $frame->data . PHP_EOL;
    processMessage($frame->data, $frame->fd, $server, $persistence);
});

$server->on('request', function (Request $request, Response $response) {
    $templates = new Engine(__DIR__ . '/views');
    $response->header("Content-Type", "text/html");
    $response->end($templates->render('home'));
});

$server->on('close', function (Server $server, int $fd) use ($persistence) {
    var_dump('closing connection...' . $fd);
    processMessage(
        json_encode(['action' => ClosedConnectionAction::ACTION_NAME]),
        $fd,
        $server,
        $persistence
    );
});

$server->set([
    'document_root' => __DIR__ . '/public',
    'enable_static_handler' => true,
    'static_handler_locations' => ['/js'],
]);

$server->start();