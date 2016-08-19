<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Shell;
use Qafoo\Analyzer\Project;

class PDepend extends Handler implements RequiresCoverage
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
            '--summary-xml=' . ($tmpFile = $this->shell->getTempFile()),
            '--coderank-mode=inheritance,property,method',
        );

        if ($project->coverage) {
            $options[] = '--coverage-report=' . $project->coverage;
        }

        if ($project->excludes) {
            $options[] = '--ignore=' . implode(',', $project->excludes);
        }

        $this->shell->exec('vendor/bin/pdepend', array_merge($options, array($project->baseDir)));
        return $tmpFile;
    }
}
