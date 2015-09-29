<?php

if (file_exists(__DIR__ . $_SERVER['SCRIPT_NAME'])) {
    return false;
}

require 'index.html';
