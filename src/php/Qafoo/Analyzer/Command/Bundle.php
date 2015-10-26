<?php

namespace Qafoo\Analyzer\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class Bundle extends Command
{
    protected function configure()
    {
        $this
            ->setName('bundle')
            ->setDescription('Bundle application')
            ->addArgument(
                'path',
                InputArgument::REQUIRED,
                'Target path to copy files to'
            )->addOption(
                'cdn',
                'c',
                InputOption::VALUE_NONE,
                'Host to use for the assets – leave empty to use Github'
            )->addOption(
                'cdn-host',
                'H',
                InputOption::VALUE_REQUIRED,
                'Host to use for the assets – leave empty to use Github',
                'https://cdn.rawgit.com/Qafoo/QualityAnalyzer/master'
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $baseDir = realpath(__DIR__ . '/../../../../../');
        if (!is_dir($target = $input->getArgument('path'))) {
            if (!mkdir($target, 0777, true)) {
                throw new \RuntimeException("Could not create $target.");
            }
        }
        $target = realpath($target);

        $files = glob($baseDir . '/data/*');
        if (!$input->getOption('cdn')) {
            $files = array_merge($files, glob($baseDir . '/assets/*'));
        }

        foreach ($files as $file) {
            $targetPath = str_replace($baseDir, $target, $file);
            if (!is_dir(dirname($targetPath))) {
                mkdir(dirname($targetPath), 0777, true);
            }

            copy($file, $targetPath);
        }

        if ($input->getOption('cdn')) {
            file_put_contents(
                $target . '/index.html',
                str_replace(
                    '"assets/',
                    '"' . $input->getOption('cdn-host') . '/assets/',
                    file_get_contents($baseDir . '/index.html')
                )
            );
        } else {
            copy($baseDir . '/index.html', $target . '/index.html');
        }
    }
}
