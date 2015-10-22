<?php

$baseDir = __DIR__ . '/../';
if (file_exists($baseDir . $_SERVER['SCRIPT_NAME'])) {
    return false;
}

require $baseDir . 'index.html';
