<?php

namespace Qafoo\Analyzer;

use Symfony\Component\Console;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class Application extends Console\Application
{
    const PDEPEND_MEMORY_LIMIT_OPTION      = 'pdepend_mem';
    const DEPENDENCIES_MEMORY_LIMIT_OPTION = 'dep_mem';
    const PHPMD_MEMORY_LIMIT_OPTION        = 'phpmd_mem';
    const CHECKSTYLE_MEMORY_LIMIT_OPTION   = 'checkstyle_mem';
    const CPD_MEMORY_LIMIT_OPTION          = 'cpd_mem';
    const PHPLOC_MEMORY_LIMIT_OPTION       = 'phploc_mem';

    /**
     * Get default commands
     *
     * @return Console\Command[]
     */
    protected function getDefaultCommands()
    {
        $shell = new Shell(dirname(VENDOR_PATH));

        // Retrieve optional memory limit arguments
        $opts = getopt('', array(
            self::PDEPEND_MEMORY_LIMIT_OPTION . '::',
            self::DEPENDENCIES_MEMORY_LIMIT_OPTION . '::',
            self::PHPMD_MEMORY_LIMIT_OPTION . '::',
            self::CHECKSTYLE_MEMORY_LIMIT_OPTION . '::',
            self::CPD_MEMORY_LIMIT_OPTION . '::',
            self::PHPLOC_MEMORY_LIMIT_OPTION . '::'
        ));

        return array_merge(
            parent::getDefaultCommands(),
            array(
                new Command\Serve(),
                new Command\Bundle(),
                new Command\Analyze(
                    array(
                        'source' => new Handler\Source($shell),
                        'coverage' => new Handler\Coverage(),
                        'pdepend' => new Handler\PDepend($shell, $opts[self::PDEPEND_MEMORY_LIMIT_OPTION]),
                        'dependencies' => new Handler\Dependencies(
                            $shell,
                            $opts[self::DEPENDENCIES_MEMORY_LIMIT_OPTION]
                        ),
                        'phpmd' => new Handler\PHPMD($shell, $opts[self::PHPMD_MEMORY_LIMIT_OPTION]),
                        'checkstyle' => new Handler\Checkstyle($shell, $opts[self::CHECKSTYLE_MEMORY_LIMIT_OPTION]),
                        'tests' => new Handler\Tests(),
                        'cpd' => new Handler\CPD($shell, $opts[self::CPD_MEMORY_LIMIT_OPTION]),
                        'phploc' => new Handler\Phploc($shell, $opts[self::PHPLOC_MEMORY_LIMIT_OPTION]),
                    )
                ),
            )
        );
    }
}
