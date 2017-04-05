<?php

$mimeTypes = array(
    'xml' => 'application/xml',
    'json' => 'application/json',
    'js' => 'application/json',
    'zip' => 'application/zip',
);

$baseDir = __DIR__ . '/../';
if (file_exists($baseDir . $_SERVER['SCRIPT_NAME'])) {
    $extension = pathinfo($_SERVER['SCRIPT_NAME'], PATHINFO_EXTENSION);
    if (isset($mimeTypes[$extension])) {
        header('Content-Type: ' . $mimeTypes[$extension]);
        readfile($baseDir . $_SERVER['SCRIPT_NAME']);
        exit(0);
    } else {
        return false;
    }
}

require $baseDir . 'index.html';
