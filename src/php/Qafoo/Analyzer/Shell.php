<?php

namespace Qafoo\Analyzer;

class Shell
{
    /**
     * Exec shell command
     *
     * Fails if the command returns with a non zero exit code
     *
     * @param string $command
     * @param string[] $arguments
     * @param int[] $okCodes
     * @return string
     */
    public function exec($command, array $arguments = array(), array $okCodes = array(0))
    {
        exec(
            escapeshellcmd($command) . ' ' . implode(' ', array_map('escapeshellarg', $arguments)),
            $output,
            $return
        );

        if (!in_array($return, $okCodes)) {
            throw new \Exception("Program exited with non zero exit code $return: " . implode(PHP_EOL, $output));
        }

        return implode(PHP_EOL, $output);
    }

    /**
     * Get temp file
     *
     * @param string $prefix
     * @return string
     */
    public function getTempFile($prefix = 'qas')
    {
        return tempnam(sys_get_temp_dir(), 'qa');
    }
}
