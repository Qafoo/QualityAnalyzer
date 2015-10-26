<?php

namespace Qafoo\Analyzer;

use Symfony\Component\Console;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class Application extends Console\Application
{
    /**
     * Get default commands
     *
     * @return Console\Command[]
     */
    protected function getDefaultCommands()
    {
        $shell = new Shell(__DIR__ . '/../../../../');

        return array_merge(
            parent::getDefaultCommands(),
            array(
                new Command\Serve(),
                new Command\Bundle(),
                new Command\Analyze(
                    array(
                        'source' => new Handler\Source($shell),
                        'coverage' => new Handler\Coverage(),
                        'pdepend' => new Handler\PDepend($shell),
                        'dependencies' => new Handler\Dependencies($shell),
                        'phpmd' => new Handler\PHPMD($shell),
                        'checkstyle' => new Handler\Checkstyle($shell),
                        'tests' => new Handler\Tests(),
                        'cpd' => new Handler\CPD($shell),
                        'phploc' => new Handler\Phploc($shell),
                    )
                ),
            )
        );
    }
}
