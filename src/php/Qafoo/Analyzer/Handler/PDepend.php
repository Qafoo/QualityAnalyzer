<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;

class PDepend extends Handler
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
        if ($file) {
            // @TODO: Verify file is actually sensible?
            return $file;
        }

        $tmpFile = tempnam(sys_get_temp_dir(), 'pdepend');
        shell_exec(
            escapeshellcmd('vendor/bin/pdepend') . ' ' .
                escapeshellarg('--summary-xml=' . $tmpFile) . ' ' .
                ($excludes ? escapeshellarg('--ignore=' . implode(',', $excludes)) . ' ' : '' ) .
                escapeshellarg($dir)
        );

        return $tmpFile;
    }
}
