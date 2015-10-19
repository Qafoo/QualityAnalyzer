<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Shell;

class PHPMD extends Handler
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
            '--reportfile', ($tmpFile = $this->shell->getTempFile()),
        );

        if ($excludes) {
            $options[] = '--exclude';
            $options[] = implode(',', $excludes);
        }

        $this->shell->exec(
            'vendor/bin/phpmd',
            array_merge($options, array($dir, 'xml', 'cleancode,codesize,design')),
            array(0, 2)
        );
        return $tmpFile;
    }
}
