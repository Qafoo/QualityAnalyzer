<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Shell;

class Checkstyle extends Handler
{

    /**
     * Shell
     *
     * @var Shell
     */
    private $shell;

    public function __construct(Shell $shell, $memory_limit = null)
    {
        $this->shell = $shell;
    }

    /**
     * Handle provided directory
     *
     * Optionally an existing result file can be provided
     *
     * @param string $dir
     * @param array $excludes
     * @param string $file
     * @return void
     */
    public function handle($dir, array $excludes, $file = null, $memory_limit = null)
    {
        if ($file) {
            // @TODO: Verify file is actually sensible?
            return $file;
        }

        $options = array(
            '--standard=PSR2',
            '--extensions=php',
            '--report-checkstyle=' . ($tmpFile = $this->shell->getTempFile()),
        );

        if ($excludes) {
            $options[] = '--ignore=' . implode(',', $excludes);
        }

        $this->shell->exec(
            'vendor/bin/phpcs',
            array_merge($options, array($dir)),
            array(0, 1),
            $memory_limit
        );
        return $tmpFile;
    }
}
