<?php

require __DIR__ . '/vendor/autoload.php';

use League\Plates\Engine;
use Swoole\Http\Response;
use Swoole\WebSocket\Frame;
use Swoole\WebSocket\Server;
use Swoole\Http\Request;

$server = new Server('0.0.0.0', 8585);

$server->on("start", function (Server $server) {
    echo 'Websocket server started at http://127.0.0.1:' . $server->port . PHP_EOL;
});

$server->on('message', function (Server $server, Frame $frame) {
    echo 'Received message: ' . $frame->data . PHP_EOL;
    foreach ($server->connections as $fd) {
        if (!$server->isEstablished($fd)) {
            continue;
        }
        $server->push($fd, $frame->data);
    }
});

$server->on('request', function (Request $request, Response $response) {
    $templates = new Engine(__DIR__ . '/views');
    $response->header("Content-Type", "text/html");
    $response->end($templates->render('home'));
});

$server->start();