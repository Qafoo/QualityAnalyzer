<?php

namespace Qafoo\Analyzer\Command;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Project;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class Analyze extends Command
{
    const ARGUMENT_PATH            = 'path';
    const NAME                     = 'analyze';
    const OPTION_COVERAGE          = 'coverage';
    const OPTION_EXCLUDE_ANALYZERS = 'exclude_analyzers';
    const OPTION_PDEPEND           = 'pdepend';
    const OPTION_DEPENDENCIES      = 'dependencies';
    const OPTION_PHPMD             = 'phpmd';
    const OPTION_CHECKSTYLE        = 'checkstyle';
    const OPTION_TESTS             = 'tests';
    const OPTION_CPD               = 'cpd';
    const OPTION_PHPLOC            = 'phploc';
    const OPTION_EXCLUDE           = 'exclude';
    const ALIAS_COVERAGE           = 'c';
    const ALIAS_TESTS              = 't';
    const ALIAS_EXCLUDE            = 'x';

    /**
     * Handlers
     *
     * @var Handler[]
     */
    private $handlers = [];

    /** @var string */
    private $targetDir;

    public function __construct(array $handlers = [], $targetDir = null)
    {
        parent::__construct();

        $this->handlers  = $handlers;
        $this->targetDir = $targetDir ?: __DIR__ . '/../../../../../data/';
    }

    protected function configure()
    {
        $this
          ->setName(self::NAME)
          ->setDescription('Analyze PHP code')
          ->addArgument(
            self::ARGUMENT_PATH,
            InputArgument::REQUIRED,
            'Path to the source code which should be analyzed'
          )->addOption(
            self::OPTION_COVERAGE,
            self::ALIAS_COVERAGE,
            InputOption::VALUE_REQUIRED,
            'Path to code coverage (clover) XML file'
          )->addOption(
            self::OPTION_PDEPEND,
            null,
            InputOption::VALUE_REQUIRED,
            'Path to PDepend summary XML file'
          )->addOption(
            self::OPTION_DEPENDENCIES,
            null,
            InputOption::VALUE_REQUIRED,
            'Path to PDepend dependencies XML file'
          )->addOption(
            self::OPTION_PHPMD,
            null,
            InputOption::VALUE_REQUIRED,
            'Path to mess detector (PMD / PHPMD) XML file'
          )->addOption(
            self::OPTION_CHECKSTYLE,
            null,
            InputOption::VALUE_REQUIRED,
            'Path to checkstyle violations (PHP Code Sniffer) XML file'
          )->addOption(
            self::OPTION_TESTS,
            self::ALIAS_TESTS,
            InputOption::VALUE_REQUIRED,
            'Path to jUnit (PHPUnit) test result XML file'
          )->addOption(
            self::OPTION_CPD,
            null,
            InputOption::VALUE_REQUIRED,
            'Path to C&P violations (PHP Copy Paste Detector) XML file'
          )->addOption(
            self::OPTION_PHPLOC,
            null,
            InputOption::VALUE_REQUIRED,
            'Path to PHPLoc result XML file'
          )->addOption(
            self::OPTION_EXCLUDE,
            self::ALIAS_EXCLUDE,
            InputOption::VALUE_REQUIRED,
            'Directories to exclude from analyzing'
          )->addOption(
            self::OPTION_EXCLUDE_ANALYZERS,
            null,
            InputOption::VALUE_REQUIRED,
            'Analyzers to exclude from analyzing as comma separated list, e.g. "git,gitDetailed"'
          )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $exclude = array_filter(array_map('trim', explode(',', $input->getOption(self::OPTION_EXCLUDE))));

        if (!is_dir($path = realpath($input->getArgument(self::ARGUMENT_PATH)))) {
            throw new \OutOfBoundsException("Could not find " . $input->getArgument(self::ARGUMENT_PATH));
        }
        $output->writeln("Analyze source code in $path");

        $project          = new Project();
        $project->dataDir = $this->targetDir;
        $project->baseDir = $path;
        if ($input->hasOption(self::OPTION_COVERAGE)) {
            $project->coverage = $input->getOption(self::OPTION_COVERAGE);
        }

        $this->filterHandlers($input);

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

    private function filterHandlers(InputInterface $input)
    {
        if ($excludeHandlers = $input->getOption(self::OPTION_EXCLUDE_ANALYZERS)) {
            $excludeHandlers = array_map('trim', explode(',', $excludeHandlers));
            $excludeHandlers = array_combine($excludeHandlers, $excludeHandlers);
            $this->handlers  = array_diff_key($this->handlers, $excludeHandlers);
        }
    }

    /**
     * Copy result file
     *
     * @param string $handler
     * @param string $file
     *
     * @return string
     * @throws \OutOfBoundsException
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

        return "$handler.$extension";
    }
}
