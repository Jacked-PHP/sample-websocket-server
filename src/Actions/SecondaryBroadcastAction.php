<?php

namespace MyApp\Actions;

use Conveyor\Actions\BroadcastAction;

class SecondaryBroadcastAction extends BroadcastAction
{
    const ACTION_NAME = 'secondary-broadcast-action';
    protected string $name = self::ACTION_NAME;

    protected function broadcastToChannel(string $data, ?array $listeners = null): void
    {
        $connections = array_filter(
            $this->channelPersistence->getAllConnections(),
            fn($c) => $c === $this->getCurrentChannel()
        );

        foreach ($connections as $fd => $channel) {
            $isOnlyListeningOtherActions = null === $listeners
                && $this->isListeningAnyAction($fd);
            $isNotListeningThisAction = null !== $listeners
                && !in_array($fd, $listeners);

            if (
                !$this->server->isEstablished($fd)
                // || $fd === $this->fd
                || $isNotListeningThisAction
                || $isOnlyListeningOtherActions
            ) {
                continue;
            }

            $this->server->push($fd, $data);
        }
    }
}