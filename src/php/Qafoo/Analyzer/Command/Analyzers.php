<?php

namespace Qafoo\Analyzer\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Class Handlers
 *
 * @package Qafoo\Analyzer\Command
 */
class Analyzers extends Command
{
    const DESCRIPTION = 'Lists all available analyzers';

    const HELP        = 'Lists all available analyzers enabled by default';

    const NAME        = 'list:analyzers';

    /**
     * @var array
     */
    private $analysers;

    public function __construct(array $analysers)
    {
        parent::__construct(self::NAME);
        $this->analysers = $analysers;
    }

    protected function configure()
    {
        $this
          ->setDescription(self::DESCRIPTION)
          ->setHelp(self::HELP)
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('<info>The following analysers are available and enabled by default:</info>');
        foreach (array_keys($this->analysers) as $analyser) {
            $output->writeln('- ' . $analyser);
        }
    }
}
