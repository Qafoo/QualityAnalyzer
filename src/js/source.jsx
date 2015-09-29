var Qafoo = Qafoo || {QA: {}};

 /**
 *
 * jquery.binarytransport.js
 *
 * @description. jQuery ajax transport for making binary data type requests.
 * @version 1.0 
 * @author Henry Algus <henryalgus@gmail.com>
 *
 */

// use this transport for "binary" data type
$.ajaxTransport("+binary", function(options, originalOptions, jqXHR){
    // check for conditions and support for blob / arraybuffer response type
    if (window.FormData &&
        ((options.dataType && (options.dataType == 'binary')) ||
            (options.data &&
                ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob))))) {
        return {
            // create new XMLHttpRequest
            send: function(headers, callback) {
                var xhr = new XMLHttpRequest(),
                    url = options.url,
                    type = options.type,
                    async = options.async || true,
                    // blob or arraybuffer. Default is blob
                    dataType = options.responseType || "blob",
                    data = options.data || null,
                    username = options.username || null,
                    password = options.password || null;
                            
                xhr.addEventListener('load', function() {
                    var data = {};
                    data[options.dataType] = xhr.response;
                    // make callback and send data
                    callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                });

                xhr.open(type, url, async, username, password);
                
                for (var i in headers ) {
                    xhr.setRequestHeader(i, headers[i] );
                }
                
                xhr.responseType = dataType;
                xhr.send(data);
            },
            abort: function(){
                jqXHR.abort();
            }
        };
    }
});

(function () {
    "use strict";

    Qafoo.QA.Source = React.createClass({
        sourceTree: {
            name: "/",
            type: "folder",
            children: {}
        },

        getInitialState: function() {
            return {
                loaded: false
            };
        },

        ensureStartingSlash: function(path) {
            while (path[0] === "/") {
                path = path.substring(1);
            }

            return "/" + path;
        },

        getFileName: function(string) {
            string = this.ensureStartingSlash(string);

            return this.ensureStartingSlash(string.replace(this.props.data.baseDir, ""));
        },

        addFile: function(file) {
            var components = file.name.split("/"),
                treeReference = this.sourceTree;

            for (var i = 0; i < components.length; ++i) {
                var component = components[i];

                if (!treeReference.children[component]) {
                    treeReference.children[component] = {
                        name: component,
                        type: "folder",
                        children: {}
                    }
                }

                treeReference = treeReference.children[component];
            }

            treeReference.type = "file";
            treeReference.file = file;
        },

        componentWillMount: function() {
            var component = this;

            $.ajax('/data/source.zip', {
                method: "GET",
                contentType: "text/plain; charset=x-user-defined",
                dataType: "binary",
                responseType: "arraybuffer",
                processData: false,
                success: function(data) {
                    var source = new JSZip(data);

                    for (var file in source.files) {
                        component.addFile(source.files[file]);
                    }
                    component.setState({loaded: true});
                }
            });
        },

        render: function() {
            var file = this.getFileName(this.props.parameters.splat);

            return (<div className="row">
                <div className="col-md-12">
                    <h1>Source</h1>
                    { !this.state.loaded ? (<h2>Loading source…</h2>) :
                    <h2>Loaded!</h2>
                }</div>
            </div>);
        }
    });
})();
