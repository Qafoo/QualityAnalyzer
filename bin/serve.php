<?php

$baseDir = __DIR__ . '/../';
if (file_exists($baseDir . $_SERVER['SCRIPT_NAME'])) {
    // Workaround for PHP web server not recognizing JSON mime type;
    if (substr($_SERVER['SCRIPT_NAME'], -4, 4) === 'json') {
        header('Content-Type: application/json');
        readfile($baseDir . $_SERVER['SCRIPT_NAME']);
        exit(0);
    } else {
        return false;
    }
}

require $baseDir . 'index.html';
