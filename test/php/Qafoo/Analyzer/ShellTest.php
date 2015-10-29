<?php

namespace Qafoo\Analyzer;

class ShellTest extends \PHPUnit_Framework_TestCase
{
    public function testProjectDir()
    {
        $projectDir = __DIR__ . '/../../../../';
        $shell = new Shell($projectDir);

        $testCommand = 'vendor/bin/phpunit';
        $result = $shell->exec($testCommand, ['--version']);

        $this->assertContains('PHPUnit', $result);
    }
}
