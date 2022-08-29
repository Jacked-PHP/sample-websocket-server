<?php

namespace MyApp\Actions;

use Conveyor\Actions\BaseAction;
use Exception;
use InvalidArgumentException;

class WelcomeAction extends BaseAction
{
    const ACTION_NAME = 'welcome-action';
    protected string $name = self::ACTION_NAME;

    /**
     * @param array $data
     * @return mixed
     * @throws Exception
     */
    public function execute(array $data): mixed
    {
        $this->send(json_encode([
            'message' => $data['data'],
            'connections' => $this->channelPersistence->getAllConnections(),
        ]), $this->fd);
        return null;
    }
}