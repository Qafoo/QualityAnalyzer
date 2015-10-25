<?php

namespace Qafoo\Analyzer\Handler;

use SebastianBergmann\FinderFacade\FinderFacade;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Shell;

class Source extends Handler
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
        $zipFile = __DIR__ . '/../../../../../data/source.zip';
        $archive = new \ZipArchive();
        $archive->open($zipFile, \ZipArchive::OVERWRITE | \ZipArchive::CREATE);
        $finder = new FinderFacade(array($dir), $excludes, array('*.php'));
        foreach ($finder->findFiles() as $file) {
            $archive->addFile($file, ltrim(str_replace($dir, '', $file), '/'));
        }
        $archive->close();
    }
}
