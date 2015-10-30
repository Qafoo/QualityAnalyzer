<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Shell;

class PDepend extends Handler implements RequiresCoverage
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
    public function handle($dir, array $excludes, $file = null, $coverage = null)
    {
        if ($file) {
            // @TODO: Verify file is actually sensible?
            return $file;
        }

        $options = array(
            '--summary-xml=' . ($tmpFile = $this->shell->getTempFile()),
        );

        if ($coverage) {
            $options[] = '--coverage-report=' . $coverage;
        }

        if ($excludes) {
            $options[] = '--ignore=' . implode(',', $excludes);
        }

        $this->shell->exec(
            'vendor/bin/pdepend',
            array_merge($options, array($dir)),
            array(0),
            $this->memory_limit
        );
        return $tmpFile;
    }
}
