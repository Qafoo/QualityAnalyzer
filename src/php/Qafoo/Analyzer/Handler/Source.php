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
        $currentDir = getcwd();
        chdir($dir);

        if ($excludes) {
            $finder = new FinderFacade(array($dir), array(), $excludes);
            $excludes = array_map(
                function ($path) use ($dir) {
                    $path = substr($path, strlen($dir) + 1);
                    return is_file($path) ? $path : $path . '/*';
                },
                $finder->findFiles()
            );
            array_unshift($excludes, '-x');
        }

        $zipFile = __DIR__ . '/../../../../../data/source.zip';
        if (file_exists($zipFile)) {
            unlink($zipFile);
        }

        $this->shell->exec(
            'zip',
            array_merge(
                array('-r', $zipFile, './', '-i', '*.php'),
                $excludes
            )
        );

        chdir($currentDir);
    }
}
