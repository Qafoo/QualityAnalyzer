<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Project;

class Tests extends Handler
{
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
        return $existingResult;
    }
}
