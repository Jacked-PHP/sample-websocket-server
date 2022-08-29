<?php

namespace MyApp\Actions;

use Conveyor\Actions\FanoutAction;
use Exception;
use InvalidArgumentException;

class NewConnectionAction extends FanoutAction
{
    const ACTION_NAME = 'new-connection-action';
    protected string $name = self::ACTION_NAME;

    /**
     * @param array $data
     * @return mixed
     * @throws Exception
     */
    public function execute(array $data): mixed
    {
        $this->send('new-connection');
        return true;
    }

    /**
     * @param array $data
     * @return void
     *
     * @throws InvalidArgumentException
     */
    public function validateData(array $data) : void
    {
    }
}