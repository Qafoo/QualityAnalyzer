======================
Qafoo Quality Analyzer
======================

This software is a tool to visualize metrics and source code. We use this
software for Code Reviews together with our customers.

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
