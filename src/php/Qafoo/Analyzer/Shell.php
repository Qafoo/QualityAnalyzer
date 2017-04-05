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
     * @param string|null $baseDir
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
     * @param string   $command
     * @param string[] $arguments
     * @param int[]    $okCodes
     *
     * @param null     $workingDir
     *
     * @return string
     * @throws \Exception
     */
    public function exec($command, array $arguments = [], array $okCodes = [0], $workingDir = null)
    {
        $command = $this->makeAbsolute($command);

        $escapedCommand = escapeshellcmd($command) . ' ' . implode(' ', array_map('escapeshellarg', $arguments));

        $originalWorkingDir = getcwd();
        chdir($workingDir ?: $originalWorkingDir);
        exec($escapedCommand, $output, $return);
        chdir($originalWorkingDir);

        if (!in_array($return, $okCodes)) {
            $message = sprintf(
                'Command "%s" exited with non zero exit code %s: %s',
                $escapedCommand,
                $return,
                implode(PHP_EOL, $output)
            );
            throw new \Exception($message);
        }

        return implode(PHP_EOL, $output);
    }

    /**
     * Make absolute
     *
     * @param string $command
     *
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
     *
     * @return string
     */
    public function getTempFile($prefix = 'qa', $postfix = null)
    {
        return tempnam(sys_get_temp_dir(), $prefix) .
            ($postfix ? '.' . $postfix : '');
    }
}
