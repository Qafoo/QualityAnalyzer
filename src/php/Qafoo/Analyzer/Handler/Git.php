<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Shell;

class Git extends Handler
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
        $resultFile = $this->shell->getTempFile() . '.js';
        $result = array(
            '3' => $this->countGitChangesPerFile($dir, $excludes, new \DateTime('-3 months')),
            '12' => $this->countGitChangesPerFile($dir, $excludes, new \DateTime('-1 year')),
            'all' => $this->countGitChangesPerFile($dir, $excludes),
        );
        file_put_contents($resultFile, json_encode($result));

        return $resultFile;
    }

    protected function countGitChangesPerFile($dir, array $excludes, \DateTime $since = null)
    {
        $options = array(
            'log',
            '--name-only',
            '--pretty=format:',
        );

        if ($since) {
            $options[] = '--since=' . $since->format('Y-m-d');
        }

        $files = $this->shell->exec(
            'git',
            array_merge(
                $options,
                array('--', $dir),
                array_map(
                    function ($exclude) {
                        return ':!' . $exclude;
                    },
                    $excludes
                )
            )
        );
        $files = array_count_values(array_filter(array_map('trim', explode(PHP_EOL, $files))));
        arsort($files, SORT_NUMERIC);
        return $files;
    }
}
