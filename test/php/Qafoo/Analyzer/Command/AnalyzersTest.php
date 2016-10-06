<?php

namespace Qafoo\Analyzer\Command;

use Qafoo\Analyzer\Handler;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;

/**
 * Class Handlers
 *
 * @package Qafoo\Analyzer\Command
 */
class AnalyzersTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @test
     */
    public function getCommandName()
    {
        self::assertEquals(Analyzers::NAME, (new Analyzers([]))->getName());
    }

    /**
     * @test
     */
    public function getDescription()
    {
        self::assertEquals(Analyzers::DESCRIPTION, (new Analyzers([]))->getDescription());
    }

    /**
     * @test
     */
    public function getHelp()
    {
        self::assertEquals(Analyzers::HELP, (new Analyzers([]))->getHelp());
    }

    /**
     * @test
     */
    public function commandListsAllHandlerKeys()
    {
        $handlers = [
          'coverage' => new Handler\Coverage(),
          'tests'    => new Handler\Tests(),
        ];

        $app = new Application();
        $app->add(new Analyzers($handlers));

        $command       = $app->find(Analyzers::NAME);
        $commandTester = new CommandTester($command);

        $commandTester->execute([
          'command' => $command->getName(),
        ]);

        $output = <<<'MSG'
The following analysers are available and enabled by default:
- coverage
- tests

MSG;
        self::assertEquals($output, $commandTester->getDisplay(true));
    }
}
