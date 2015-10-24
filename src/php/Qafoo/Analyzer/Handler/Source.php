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
    /**
     * If executing on Windows
     * 
     * @var bool
     */
    private $isWindows;

    public function __construct(Shell $shell, $isWindows = false)
    {
        $this->shell = $shell;
        $this->isWindows = $isWindows;
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
        $origExcludes = $excludes;
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

        if (!$this->isWindows)
        {
            $this->shell->exec(
                'zip',
                array_merge(
                    array('-r', $zipFile, './', '-i', '*.php'),
                    $excludes
                )
            );
        }
        else
        {
            $filesToZip = $this->getPhpFiles($origExcludes);
            $Zip = new \PclZip($zipFile);
            $Zip->create(array_keys($filesToZip));
        }

        chdir($currentDir);
    }

    protected function getPhpFiles($excludes, $dir = null)
    {
        $files = array();

        if ($dir === null)
        {
            $dir = '.';
        }

        if (is_dir($dir))
        {
            if ($dh = opendir($dir))
            {
                while (($item = readdir($dh)) !== false)
                {
                    if ($item == '.' || $item == '..')
                    {
                        continue;
                    }

                    $itemPath = $dir . '/' . $item;

                    if ($this->shouldBeExcluded($itemPath, $excludes))
                    {
                        continue;
                    }

                    if (is_dir($itemPath))
                    {
                        $files = array_merge($files, $this->getPhpFiles($excludes, $itemPath));

                        continue;
                    }

                    if (substr($itemPath, -4) == '.php')
                    {
                        $files[$itemPath] = true;
                    }
                }

                closedir($dh);
            }
        }

        return $files;
    }

    protected function shouldBeExcluded($item, array $excludes)
    {
        if (count($excludes) < 1)
        {
            return false;
        }

        if (substr($item, 0, 1) == '.')
        {
            $pos = 1;
            $len = strlen($item);

            for ($i = $pos; $i < $len; ++$i)
            {
                if ($item[$i] != '.' && $item[$i] != '/')
                {
                    $pos = $i - 1;

                    break;
                }
            }

            $item = substr($item, 0, $pos);
        }

        foreach (array_values($excludes) as $ex)
        {
            if (substr($ex, -2) == '/*')
            {
                $root = substr($ex, 0, strlen($ex) - 2);

                if (substr($item, 0, strlen($root)) == $root)
                {
                    return true;
                }

                continue;
            }

            if ($item == $ex)
            {
                return true;
            }
        }

        return false;
    }
}
