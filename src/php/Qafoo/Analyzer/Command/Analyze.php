<?php

namespace Qafoo\Analyzer\Command;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Project;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

use Qafoo\Analyzer\Handler\RequiresCoverage;

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
                'phploc',
                null,
                InputOption::VALUE_REQUIRED,
                'Path to PHPLoc result XML file'
            )->addOption(
                'exclude',
                'x',
                InputOption::VALUE_REQUIRED,
                'Directories to exclude from analyzing'
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $exclude = array_filter(array_map('trim', explode(',', $input->getOption('exclude'))));

        if (!is_dir($path = realpath($input->getArgument('path')))) {
            throw new \OutOfBoundsException("Could not find " . $input->getArgument('path'));
        }
        $output->writeln("Analyze source code in $path");

        $project = new Project();
        $project->baseDir = $path;
        if ($input->hasOption('coverage')) {
            $project->coverage = $input->getOption('coverage');
        }

        foreach ($this->handlers as $name => $handler) {
            $output->writeln(" * Running $name");

            try {
                $existingResult = $input->hasOption($name) ? $input->getOption($name) : null;

                if ($result = $handler->handle($project, $existingResult)) {
                    $project->analyzers[$name] = $this->copyResultFile($name, $result);
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

        $extension = 'xml';
        if (preg_match('(\.([a-z]+)$)', $file, $match)) {
            $extension = $match[1];
        }

        copy($file, $this->targetDir . '/' . $handler . '.' . $extension);
        return "$handler.xml";
    }
}
