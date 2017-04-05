<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Shell;
use Qafoo\Analyzer\Project;

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
     * If a valid file could be generated the file name is supposed to be
     * returned, otherwise return null.
     *
     * @param Project $project
     * @param string $existingResult
     * @return string
     */
    public function handle(Project $project, $existingResult = null)
    {
        if ($existingResult) {
            // @TODO: Verify file is actually sensible?
            return $existingResult;
        }

        $options = array(
            '--reportfile', ($tmpFile = $this->shell->getTempFile('qa', 'xml')),
        );

        if ($project->excludes) {
            $options[] = '--exclude';
            $options[] = implode(',', $project->excludes);
        }

        $this->shell->exec(
            'vendor/bin/phpmd',
            array_merge($options, array($project->baseDir, 'xml', 'cleancode,codesize,design')),
            array(0, 2)
        );
        return $tmpFile;
    }
}
