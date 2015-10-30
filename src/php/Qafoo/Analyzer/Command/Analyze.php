<?php

namespace Qafoo\Analyzer\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

use Qafoo\Analyzer\Handler\RequiresCoverage;
use Qafoo\Analyzer\Application;

class Analyze extends Command
{
    /**
     * Handlers
     *
     * @var Handler[]
     */
    private $handlers = array();

    public function __construct(array $handlers = array(), $targetDir = null)
    {
        parent::__construct();

        $this->handlers = $handlers;
        $this->targetDir = $targetDir ?: __DIR__ . '/../../../../../data/';
    }

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
            )->addOption(
                Application::PDEPEND_MEMORY_LIMIT_OPTION,
                null,
                InputOption::VALUE_REQUIRED,
                'Memory limit (MB) override for PDepend analyzer'
            )->addOption(
                Application::DEPENDENCIES_MEMORY_LIMIT_OPTION,
                null,
                InputOption::VALUE_REQUIRED,
                'Memory limit (MB) override for Dependencies analyzer'
            )->addOption(
                Application::PHPMD_MEMORY_LIMIT_OPTION,
                null,
                InputOption::VALUE_REQUIRED,
                'Memory limit (MB) override for PHPMD analyzer'
            )->addOption(
                Application::CHECKSTYLE_MEMORY_LIMIT_OPTION,
                null,
                InputOption::VALUE_REQUIRED,
                'Memory limit (MB) override for Checkstyle analyzer'
            )->addOption(
                Application::CPD_MEMORY_LIMIT_OPTION,
                null,
                InputOption::VALUE_REQUIRED,
                'Memory limit (MB) override for CPD analyzer'
            )->addOption(
                Application::PHPLOC_MEMORY_LIMIT_OPTION,
                null,
                InputOption::VALUE_REQUIRED,
                'Memory limit (MB) override for Phploc analyzer'
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $exclude = array_filter(array_map('trim', explode(',', $input->getOption('exclude'))));

        if (!is_dir($path = realpath($input->getArgument('path')))) {
            throw new \OutOfBoundsException("Could not find " . $input->getArgument('path'));
        }
        $output->writeln("Analyze source code in $path");

        $project = array(
            'baseDir' => $path,
            'analyzers' => array(),
        );
        foreach ($this->handlers as $name => $handler) {
            $output->writeln(" * Running $name");

            try {
                $file = $input->hasOption($name) ? $input->getOption($name) : null;
                $coverage = (($handler instanceof RequiresCoverage) && ($input->hasOption('coverage'))) ?
                    $input->getOption('coverage') :
                    null;

                if ($result = $handler->handle($path, $exclude, $file, $coverage)) {
                    $project['analyzers'][$name] = $this->copyResultFile($name, $result);
                }
            } catch (\Exception $exception) {
                $output->writeln('<error>' . $exception . '</error>');
                $result = null;
            }
        }

        file_put_contents($this->targetDir . '/project.json', json_encode($project));
        $output->writeln("Done");
    }

    /**
     * Copy result file
     *
     * @param string $handler
     * @param string $file
     * @return string
     */
    protected function copyResultFile($handler, $file)
    {
        if (!is_file($file)) {
            throw new \OutOfBoundsException("Result file $file is not readable");
        }

        copy($file, $this->targetDir . '/' . $handler . '.xml');
        return "$handler.xml";
    }
}
