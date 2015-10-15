<?php

namespace Qafoo\Analyzer\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class Analyze extends Command
{
    protected function configure()
    {
        $this
            ->setName('analyze')
            ->setDescription('Analyze PHP code')
            ->addArgument(
                'path',
                InputArgument::REQUIRED,
                'Path to the source code which should be analyzed'
            )->addOption(
               'coverage',
               'c',
               InputOption::VALUE_REQUIRED,
               'Path to code coverage (clover) XML file'
            )->addOption(
               'pdepend',
               null,
               InputOption::VALUE_REQUIRED,
               'Path to PDepend summary XML file'
            )->addOption(
               'dependencies',
               null,
               InputOption::VALUE_REQUIRED,
               'Path to PDepend dependencies XML file'
            )->addOption(
               'phpmd',
               null,
               InputOption::VALUE_REQUIRED,
               'Path to mess detector (PMD / PHPMD) XML file'
            )->addOption(
               'checkstyle',
               null,
               InputOption::VALUE_REQUIRED,
               'Path to checkstyle violations (PHP Code Sniffer) XML file'
            )->addOption(
               'tests',
               't',
               InputOption::VALUE_REQUIRED,
               'Path to jUnit (PHPUnit) test result XML file'
            )->addOption(
               'cpd',
               null,
               InputOption::VALUE_REQUIRED,
               'Path to C&P violations (PHP Copy Paste Detector) XML file'
            )->addOption(
               'exclude',
               'x',
               InputOption::VALUE_REQUIRED,
               'Directories to exclude from analyzing'
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        var_dump($input->getOption('exclude'));
        $output->writeln('Analyze…');
    }
}
