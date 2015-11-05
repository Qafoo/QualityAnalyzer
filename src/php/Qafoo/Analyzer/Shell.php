<?php

namespace Qafoo\Analyzer;

class Shell
{
    /**
     * Base dir for relativ tool calls
     *
     * @var string
     */
    private $baseDir;

    /**
     * @param mixed $baseDir
     * @return void
     */
    public function __construct($baseDir = null)
    {
        $this->baseDir = $baseDir ?: getcwd();
    }

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
    public function exec($command, array $arguments = array(), array $okCodes = array(0), $memory_limit = null)
    {
        $command = $this->makeAbsolute($command);

        if (preg_match('/^\d+[M]$/i', $memory_limit)) {
            $command = "php -d memory_limit=$memory_limit " . $command;
        }

        $escapedCommand = escapeshellcmd($command) . ' ' . implode(' ', array_map('escapeshellarg', $arguments));
        exec($escapedCommand, $output, $return);

        if (!in_array($return, $okCodes)) {
            throw new \Exception("Program exited with non zero exit code $return: " . implode(PHP_EOL, $output));
        }

        return implode(PHP_EOL, $output);
    }

    /**
     * Make absolute
     *
     * @param string $command
     * @return string
     */
    protected function makeAbsolute($command)
    {
        if ((strpos($command, '/') === false) || $command[0] === "/") {
            return $command;
        }

        return $this->baseDir . '/' . $command;
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
