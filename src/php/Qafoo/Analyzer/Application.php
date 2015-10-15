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
                new Command\Analyze(
                    array(
                        'coverage' => new Handler\Coverage(),
                        'pdepend' => new Handler\PDepend(),
                        'dependencies' => new Handler\Dependencies(),
                        'phpmd' => new Handler\PHPMD(),
                        'checkstyle' => new Handler\Checkstyle(),
                        'tests' => new Handler\Tests(),
                        'cpd' => new Handler\CPD(),
                    )
                )
            )
        );
    }
}
