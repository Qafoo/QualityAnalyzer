<?php

namespace Qafoo\Analyzer;

abstract class Handler
{
    /**
     * Handle provided directory
     *
     * Optionally an existing result file can be provided
     *
     * If a valid file could be generated the file name is supposed to be
     * returned.
     *
     * @param string $dir
     * @param array $excludes
     * @param string $file
     * @param string $memory_limit
     * @return string
     */
    abstract public function handle(
        $dir,
        array $excludes,
        $file = null,
        $memory_limit = null
    );
}
