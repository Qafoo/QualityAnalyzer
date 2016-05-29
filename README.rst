======================
Qafoo Quality Analyzer
======================

.. image::  https://api.travis-ci.org/Qafoo/QualityAnalyzer.svg?branch=master
   :alt:    Travis Status
   :target: https://travis-ci.org/Qafoo/QualityAnalyzer
   :align:  right

This software is a tool to visualize metrics and source code. We use this
software for Code Reviews together with our customers.

.. image:: src/images/screen.png
   :alt:   Screeenshot
   :target: src/images/screen.png

Running the analyzers requires the respective PHP tools, which are installed
using composer and can all be run using a convenience command. You may also run
the tools in your common build process, though.

To display the metrics a pure JavaScript / CSS stack is used so you could build
and serve the results inside continuous integration tools like Jenkins. This
might seem strange but it works really well even with software spanning 800,000
lines of PHP code.

If you want to improve, enhance the software or just fix some annoying bugs,
you are very welcome to do so. The technology stack involved sadly is not that
simple, though (PHP, Symfony2, Ant, Babel, D3, Grunt, Jasmine, Karma, SASS,
PhantomJs, React, React-Router, Underscore, Webpack). A `Code of Conduct`__
applies for any interaction with this project – if you feel like it is violated
get in contact with Kore.

__ http://hood.ie/code-of-conduct/

Setup
=====

To use the software there are very few steps involved. The only requirement is
a current version of PHP.

Run the following commands to install the software::

    git clone https://github.com/Qafoo/QualityAnalyzer.git
    cd QualityAnalyzer
    composer install

In the next step you can already analyze some software using something like
this::

    bin/analyze analyze src/php/

See "Usage" for more details on the command. The results of this command can be
found in the ``data/`` folder.

Finally you can start the webserver to view the results::

    bin/analyze serve

Click around and enjoy the data!

Usage
=====

You start by analyzing a certain project or providing the tool with the paths
to existing analyze files, like code coverage reports::

    bin/analyze analyze /path/to/source

With the default command the tool will analyze the source code itself. For
tools like PHPMD or PDepend this makes a lot of sense since the tool already
knows which options to use for each tool.

There are some reports we cannot generate ourselves like code coverage from
your tests. You can tell the tool where to find certain files to make sure they
are available and ready to be used::

    bin/analyze \
        --coverage=/path/to/clover.xml \
        --tests=/path/to/junit.xml \
        analyze /path/to/source

You can also specify already generated files for all the other tools. But the
visualization might behave strangely if some reports are generated in the wrong
formats or some options are missing. We do not verify this (yet) properly.

To view the report in HTML format, run `composer bundle /path/for/generated/html`
and then open `/path/for/generated/html/index.html` with your browser.

Ignore Sub-Directories
----------------------

You might also want to tell the tools which directories there are to ignore by
the tools. This is *especially important* if you have (large) libraries in your
source directory – you do not want to analyze those. For this you may use the
``--exclude`` option::
    
    bin/analyze \
        --coverage=/path/to/clover.xml \
        --tests=/path/to/junit.xml \
        --exclude=libraries,vendor \
        analyze /path/to/source

After the analyzer has finished use ``bin/analyze serve`` or similar means to
access the ``index.html`` with your browser and enjoy the results
visualization.

Customize Tools
---------------

If you want to customize tool execution you can always run all the tools
yourself and pass the existing result files to the ``analyze`` command. An
example customizable ant build file doing this can be found here:
`src/examples/customize.xml`__ or `src/examples/parallel.xml`__.

The parameters to pass you custom results, which wil omit running the tool by
the analyzer command itself are::

    --pdepend=PDEPEND            Path to PDepend summary XML file
    --dependencies=DEPENDENCIES  Path to PDepend dependencies XML file
    --phpmd=PHPMD                Path to mess detector (PMD / PHPMD) XML file
    --checkstyle=CHECKSTYLE      Path to checkstyle violations (PHP Code Sniffer) XML file
    --cpd=CPD                    Path to C&P violations (PHP Copy Paste Detector) XML file
    --phploc=PHPLOC              Path to PHPLoc result XML file

Feel free to provide examples using different build environments by creating a
pull request.

__ src/examples/customize.xml
__ src/examples/parallel.xml

Building & Developing The Software
==================================

The build system of the Quality Analyzer is based on ant. You must have **ant
>= 1.8** installed. To be able to use it you should first initilaize the
submodule containing the build commons::

    git submodule update --init

To develop the Quality Analyzer we heavily depend on a JavaScript build stack.
For this you must have `node` and `npm` installed. All other required tools
will be installed by the build tool. To set the project into development mode
run::

    echo env=dev > environment.local

As long as you do not remove this line from the ``environment.local`` file any
more or change it to ``prod`` all development tools and libraries will be
installed and used.  This also means JavaScript and CSS will be compiled by
commands like ``ant serve``.

Running The Tests
-----------------

You can run the tests by executing ``ant``.

It will run run tests through Karma & Jasmine for parts of the JavaScript stack
and PHPUnit tests for the PHP stack (once we have some).

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
basically any webserver. The webserver should rewrite all requests to unknown
resources to the index.html file which does the routing using JavaScript.

For your convenience we included a working server setup using PHPs internal
webserver. You can start it using::

    ant serve

Generating The Bundle Files
---------------------------

The following task ensures the bundle files are generated, compressed and
comitted::

    ant deploy

**Use this command to update the distributed files.**

It will run the ``package`` task first (after running all tests, of course). If
there are changes in the ``assets/`` folder those changes will be comitted and
the current development state will then be pushed. 

..
   Local Variables:
   mode: rst
   fill-column: 79
   End: 
   vim: et syn=rst tw=79
