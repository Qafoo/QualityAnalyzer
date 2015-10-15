<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;

class Dependencies extends Handler
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

        $tmpFile = tempnam(sys_get_temp_dir(), 'dependencies');
        exec(
            escapeshellcmd('vendor/bin/pdepend') . ' ' .
                escapeshellarg('--dependency-xml=' . $tmpFile) . ' ' .
                ($excludes ? escapeshellarg('--ignore=' . implode(',', $excludes)) . ' ' : '' ) .
                escapeshellarg($dir),
            $output,
            $return
        );

        if ($return) {
            throw new \RuntimeException("Program exited with non zero exit code $return: " . implode(PHP_EOL, $output));
        }

        return $tmpFile;
    }
}
