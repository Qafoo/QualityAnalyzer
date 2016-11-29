<?php

namespace Qafoo\Analyzer\Command;

use Qafoo\Analyzer\Handler;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;

/**
 * Class AnalyzeTest
 *
 * @package Qafoo\Analyzer\Command
 */
class AnalyzeTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @test
     */
    public function exclude()
    {
        $coverageHandler = $this->buildMock(Handler\Coverage::class);
        $handlers        = ['coverage' => $coverageHandler];

        $coverageHandler->expects(self::once())
                        ->method('handle')
                        ->with(self::attributeEqualTo('excludes', ['path1', 'path2']), self::anything())
                        ->willReturn('success')
        ;

        $app = new Application();
        $app->add(new Analyze($handlers));

        $command = $app->find(Analyze::NAME);

        $commandTester = new CommandTester($command);
        $commandTester->execute(
          [
            'command'   => $command->getName(),
            'path'      => __DIR__,
            '--exclude' => 'path1,path2',
          ]
        );
    }

    /**
     * @test
     */
    public function excludeHandlers()
    {
        $coverageHandler = $this->buildMock(Handler\Coverage::class);
        $testsHandler    = $this->buildMock(Handler\Tests::class);
        $handlers        = [
          'coverage' => $coverageHandler,
          'tests'    => $testsHandler,
          'foo'      => $testsHandler,
        ];

        $coverageHandler->expects(self::once())
                        ->method('handle')
                        ->willReturn('success')
        ;

        $testsHandler->expects(self::never())
                     ->method('handle')
        ;

        $app = new Application();
        $app->add(new Analyze($handlers));

        $command = $app->find(Analyze::NAME);

        $commandTester = new CommandTester($command);
        $commandTester->execute(
          [
            'command'             => $command->getName(),
            'path'                => __DIR__,
            '--exclude_analyzers' => 'tests,foo',
          ]
        );
    }

    /**
     * @param string $className
     *
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    private function buildMock($className)
    {
        return $this->getMockBuilder($className)->disableOriginalConstructor()->getMock();
    }
}
