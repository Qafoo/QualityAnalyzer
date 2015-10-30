<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Shell;

class CPD extends Handler
{
    /**
     * Shell
     *
     * @var Shell
     */
    private $shell;
    private $memory_limit;

    public function __construct(Shell $shell, $memory_limit = null)
    {
        $this->shell = $shell;
        $this->memory_limit = $memory_limit;
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
    public function handle($dir, array $excludes, $file = null)
    {
        if ($file) {
            // @TODO: Verify file is actually sensible?
            return $file;
        }

        $options = array(
            '--log-pmd=' . ($tmpFile = $this->shell->getTempFile()),
        );

        foreach ($excludes as $exclude) {
            $options[] = '--exclude=' . $exclude;
        }

        $this->shell->exec(
            'vendor/bin/phpcpd',
            array_merge($options, array($dir)),
            array(0, 1),
            $this->memory_limit
        );
        return $tmpFile;
    }
}
