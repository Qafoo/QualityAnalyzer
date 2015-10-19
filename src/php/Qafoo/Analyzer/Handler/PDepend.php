<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Shell;

class PDepend extends Handler
{
    /**
     * Shell
     *
     * @var Shell
     */
    private $shell;

    public function __construct(Shell $shell)
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
    public function handle($dir, array $excludes, $file = null)
    {
        if ($file) {
            // @TODO: Verify file is actually sensible?
            return $file;
        }

        $options = array(
            '--summary-xml=' . ($tmpFile = $this->shell->getTempFile()),
        );

        if ($excludes) {
            $options[] = '--ignore=' . implode(',', $excludes);
        }

        $this->shell->exec('vendor/bin/pdepend', array_merge($options, array($dir)));
        return $tmpFile;
    }
}
