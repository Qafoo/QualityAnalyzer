<?php

namespace Qafoo\Analyzer\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class Serve extends Command
{
    protected function configure()
    {
        $this
            ->setName('serve')
            ->setDescription('Serve application')
            ->addOption(
                'port',
                'p',
                InputOption::VALUE_REQUIRED,
                'Port to start webserver on',
                8080
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $port = (int) $input->getOption('port');
        $baseDir = realpath(__DIR__ . '/../../../../../');
        $output->writeln("Starting webserver on http://localhost:$port/");
        passthru("/usr/bin/env php -S localhost:$port -t $baseDir $baseDir/bin/serve.php");
    }
}
