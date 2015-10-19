<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;

class Coverage extends Handler
{
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
        return $file;
    }
}
