let PathResolve = function() {
    var parseUrl = function(location) {
        var parser = document.createElement('a');

        parser.href = location;
        return {
            protocol: parser.protocol,
            host: parser.host,
            port: parser.port,
            path: parser.pathname,
            query: parser.search,
            fragment: parser.hash
        };

    }

    this.getBasePath = function(location) {
        var urlData = parseUrl(location),
            path = urlData.path.replace(/[^\/]*$/, "");

        if (urlData.protocol === "file:" ||
            urlData.protocol === "file") {
            path = "file://" + path;
        }

        return path;
    };
};

export default PathResolve;
