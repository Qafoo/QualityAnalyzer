<?php

namespace Qafoo\Analyzer;

use Symfony\Component\Console;

class Application extends Console\Application
{
    /**
     * Get default commands
     *
     * @return Console\Command[]
     */
    protected function getDefaultCommands()
    {
        return array_merge(
            parent::getDefaultCommands(),
            array(
                new Command\Analyze()
            )
        );
    }
}
