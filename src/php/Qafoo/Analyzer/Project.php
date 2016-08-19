<?php

namespace Qafoo\Analyzer;

use Kore\DataObject\DataObject;

class Project extends DataObject
{
    public $analyzers = array();
    public $baseDir;
    public $excludes = array();
    public $coverage;
}
