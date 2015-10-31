/* globals describe, it, expect */

import PathResolve from '../../src/js/path_resolve.js';

describe("PathResolve", function() {

    it("resolves root", function() {
        var resolve = new PathResolve();

        expect(resolve.getBasePath("http://localhost:8080/"))
            .toEqual("");
    });

    it("resolves subdir", function() {
        var resolve = new PathResolve();

        expect(resolve.getBasePath("http://localhost:8080/subdir/"))
            .toEqual("/subdir");
    });

    it("resolves subdir with file", function() {
        var resolve = new PathResolve();

        expect(resolve.getBasePath("http://localhost:8080/subdir/index.html"))
            .toEqual("/subdir");
    });

    it("resolves root file URL", function() {
        var resolve = new PathResolve();

        expect(resolve.getBasePath("file:///path/to/index.html"))
            .toEqual("/path/to");
    });
});
