<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Shell;
use Qafoo\Analyzer\Project;

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
     * If a valid file could be generated the file name is supposed to be
     * returned, otherwise return null.
     *
     * @param Project $project
     * @param string $existingResult
     * @return string
     */
    public function handle(Project $project, $existingResult = null)
    {
        $resultFile = $this->shell->getTempFile('qa', 'json');
        $result = array(
            '3' => $this->countGitChangesPerFile($project, new \DateTime('-3 months')),
            '12' => $this->countGitChangesPerFile($project, new \DateTime('-1 year')),
            'all' => $this->countGitChangesPerFile($project),
        );
        file_put_contents($resultFile, json_encode($result));

        return $resultFile;
    }

    protected function countGitChangesPerFile(Project $project, \DateTime $since = null)
    {
        $options = array(
            'log',
            '--name-only',
            '--pretty=format:',
        );

        if ($since) {
            $options[] = '--since=' . $since->format('Y-m-d');
        }

        $gitBasePath = trim($this->shell->exec('git', array('rev-parse', '--show-toplevel'), [0], $project->baseDir));
        $existingResults = $this->shell->exec(
            'git',
            array_merge(
                $options,
                array('--', $project->baseDir),
                array_map(
                    function ($exclude) {
                        return ':!' . $exclude;
                    },
                    $project->excludes
                )
            ),
            [0],
            $project->baseDir
        );

        $existingResults = array_count_values(
            array_filter(
                array_map(
                    function ($line) use ($gitBasePath) {
                        return $gitBasePath . '/' . trim($line);
                    },
                    explode(PHP_EOL, $existingResults)
                )
            )
        );

        arsort($existingResults, SORT_NUMERIC);
        return $existingResults;
    }
}
