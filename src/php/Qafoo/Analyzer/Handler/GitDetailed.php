<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Shell;
use Qafoo\Analyzer\Project;

class GitDetailed extends Handler
{
    /**
     * Shell
     *
     * @var Shell
     */
    private $shell;

    public function __construct(Shell $shell)
    {
        $this->shell = $shell;
    }

    /**
     * Handle provided directory
     *
     * Optionally an existing result file can be provided
     *
     * If a valid file could be generated the file name is supposed to be
     * returned, otherwise return null.
     *
     * @param Project $project
     * @param string $existingResult
     * @return string
     */
    public function handle(Project $project, $existingResult = null)
    {
        if (!isset($project->analyzers['pdepend'])) {
            return;
        }

        $pdependResultFile = $project->dataDir . '/' . $project->analyzers['pdepend'];

        $document = new \DomDocument();
        $document->load($pdependResultFile);

        $xPath = new \DomXPath($document);
        foreach ($xPath->query('//package') as $packageNode) {
            $packageCommits = 0;
            foreach ($xPath->query('./class', $packageNode) as $classNode) {
                $fileNode = $xPath->query('./file', $classNode)->item(0);
                $file = $fileNode->getAttribute('name');

                $classCommits = $this->countGitChangesPerFileRange($project, $file, $classNode->getAttribute('start'), $classNode->getAttribute('end'));
                $packageCommits += $classCommits;
                $classNode->setAttribute('commits', $classCommits);

                foreach ($xPath->query('./method', $classNode) as $methodNode) {
                    $methodCommits = $this->countGitChangesPerFileRange($project, $file, $methodNode->getAttribute('start'), $methodNode->getAttribute('end'));
                    $methodNode->setAttribute('commits', $methodCommits);
                }
            }

            $packageNode->setAttribute('commits', $packageCommits);
        }

        $document->save($pdependResultFile);
        return null;
    }

    protected function countGitChangesPerFileRange(Project $project, $file, $from, $to)
    {
        $options = array(
            'log',
            '--format=format:qacommit: %H',
            '--no-patch',
            '-L',
            "$from,$to:$file"
        );

        $existingResults = $this->shell->exec('git', $options, [0], $project->baseDir);
        return count(
            array_filter(
                array_map(
                    'trim',
                    explode(PHP_EOL, $existingResults)
                ),
                function ($line) {
                    return (strpos($line, 'qacommit: ') === 0);
                }
            )
        );
    }
}
