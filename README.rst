======================
Qafoo Quality Analyzer
======================

This software is a tool to visualize metrics and source code. We use this
software for Code Reviews together with our customers.

Usage
=====

You start by analyzing a certain project or providing the too with the paths to
existing analyze files, like code coverage reports::

    bin/analyzer analyze /path/to/source

With the default command the tool will analyze the source code itself. For
tools like PHPMD or PDepend this makes a lot of sense since the tool already
knows which options to use for each tool.

There are some reports we cannot generate ourselves, like code coverage from
tests. You can tell the tool where to find certain files to make sure they are
available and ready to be used::

    bin/analyzer \
        --coverage /path/to/clover.xml \
        --pdepend /path/to/pdepend.xml \
        --dependencies /path/to/dependencies.xml \
        --phpmd /path/to/pmd.xml \
        --checkstyle /path/to/checkstyle.xml \
        --tests /path/to/junit.xml \
        --cpd /path/to/cpd.xml \
        analyze /path/to/source

You might also want to tell the tools which directories there are to ignore by
the tools. This is *especially important* if you have (large) libraries in your
source directory – you do not want to analyze those. For this you may use the
``--exclude`` option::
    
    bin/analyzer \
        --coverage /path/to/clover.xml \
        --tests /path/to/junit.xml \
        --exclude libraries,vendor \
        analyze /path/to/source

After the analyzer has finished use ``ant serve`` or similar means to access
the index.html with your browser and enjoy the results visualization.

Building & Developing The Software
==================================

Apache Ant is used as the primary build tool for this software stack and the
ant build scripts ensure everything is there. You need at least **Ant 1.8** to
use the build environment. And you should initilaize the build-commons
submodule::

    git submodule update --init

Running The Tests
-----------------

You can run the tests by executing `ant`.

It will run run tests through Karma & Jasmine for parts of the JavaScript stack
and PHPUnit tests for the PHP stack.

Building CSS & JavaScript
-------------------------

The project uses ECMAScript 6 and transpiles it using Babel. Thus we need to
update the `bundle.js` when working on the client. This is done when the
project is prepared but can also be executed continuously using::

    ant watch

This also compiles the SASS from the project and Bootstrap file into a single
CSS file.

Trying Out The Project
----------------------

If you want to try out the project you can serve the root directory with
basically any webserver. The webserver should rewrite all requests to onknown
resources to the index.html file which does the routing using JavaScript.

For your convinience we included a working server setup using PHPs internal
webserver. You can start it using::

    ant serve

..
   Local Variables:
   mode: rst
   fill-column: 79
   End: 
   vim: et syn=rst tw=79
