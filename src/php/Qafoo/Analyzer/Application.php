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
        $baseDir = __DIR__ . '/../../../../';
        $shell = new Shell($baseDir);

        return array_merge(
            parent::getDefaultCommands(),
            array(
                new Command\Serve($baseDir),
                new Command\Analyze(
                    array(
                        'source' => new Handler\Source($shell, $this->isWindowsOS()),
                        'coverage' => new Handler\Coverage(),
                        'pdepend' => new Handler\PDepend($shell),
                        'dependencies' => new Handler\Dependencies($shell),
                        'phpmd' => new Handler\PHPMD($shell),
                        'checkstyle' => new Handler\Checkstyle($shell),
                        'tests' => new Handler\Tests(),
                        'cpd' => new Handler\CPD($shell),
                        'phploc' => new Handler\Phploc($shell),
                    ),
                    $baseDir
                ),
            )
        );
    }

    /**
     * Returns true if script is executed on Windows.
     *
     * @return bool
     */
    public function isWindowsOS()
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            return true;
        }

        return false;
    }
}
