<?php

namespace Qafoo\Analyzer\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class Serve extends Command
{
    /**
     * Base directory path
     * 
     * @var string
     */
    private $baseDir = '';

    public function __construct($baseDir = null)
    {
        parent::__construct();

        $this->baseDir = $baseDir ?: __DIR__ . '/../../../../';
    }

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
        $phpCmd = 'php';

        $output->writeln("Starting webserver on http://localhost:{$port}/");

        if (!$this->getApplication()->isWindows())
        {
            $phpCmd = '/usr/bin/env ' . $phpCmd;
        }

        passthru("{$phpCmd} -S localhost:{$port} -t {$this->baseDir} {$this->baseDir}/bin/serve.php");
    }
}
