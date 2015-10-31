<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;

class Tests extends Handler
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
    public function handle($dir, array $excludes, $file = null, $memory_limit = null)
    {
        return $file;
    }
}
