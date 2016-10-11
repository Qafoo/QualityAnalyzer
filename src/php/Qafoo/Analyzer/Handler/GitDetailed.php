<?php

namespace Qafoo\Analyzer\Handler;

use Qafoo\Analyzer\Handler;
use Qafoo\Analyzer\Project;
use Qafoo\Analyzer\Shell;

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
     * @param string  $existingResult
     *
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
                $file     = $fileNode->getAttribute('name');

                $classCommits = $this->countGitChangesPerFileRange(
                  $project,
                  $file,
                  $classNode->getAttribute('start'),
                  $classNode->getAttribute('end')
                );
                $packageCommits += $classCommits;
                $classNode->setAttribute('commits', $classCommits);

                foreach ($xPath->query('./method', $classNode) as $methodNode) {
                    $methodCommits = $this->countGitChangesPerFileRange(
                      $project,
                      $file,
                      $methodNode->getAttribute('start'),
                      $methodNode->getAttribute('end')
                    );
                    $methodNode->setAttribute('commits', $methodCommits);
                }
            }

            $packageNode->setAttribute('commits', $packageCommits);
        }

        $document->save($pdependResultFile);

        return null;
    }

    /**
     * Counts GIT commits per file and range. This is used to track the number
     * of commits on methods or classes.
     *
     * @HACK: I did not manage to convice GIT to omit the diff when using `-L…`
     * – this is why we embed the "qacommit: " string and count its occurence
     * afterwards. This causes GIT to calculate MANY diffs, which are the
     * passed to PHP and thrown away using many string operations. This sucks.
     *
     * @FIX : Can be fixed immediately when we learn how to convince GIT to omit
     * the diffs / patches.
     */
    protected function countGitChangesPerFileRange(Project $project, $file, $from, $to)
    {
        $options = [
          'log',
          '--format=format:qacommit: %H',
          '--no-patch',
          '-L',
          "$from,$to:$file",
        ];

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
