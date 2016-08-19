<?php

namespace Qafoo\Analyzer;

use Kore\DataObject\DataObject;

class Project extends DataObject
{
    public $analyzers = array();
    public $dataDir;
    public $baseDir;
    public $excludes = array();
    public $coverage;
}
