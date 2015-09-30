var Qafoo = Qafoo || {QA: {}};

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

            return this.ensureStartingSlash(string.replace(this.props.data.baseDir, "")).substring(1);
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

        getSelectedFile: function(selected) {
            var treeReference = this.sourceTree;

            for (var i = 0; i < selected.length; ++i) {
                var name = selected[i];

                if (!treeReference.children[name]) {
                    return undefined;
                }

                treeReference = treeReference.children[name];
            }

            return treeReference;
        },

        render: function() {
            var file = this.getFileName(this.props.parameters.splat || "/"),
                selected = file.split("/"),
                current = this.getSelectedFile(selected);

            selected.unshift("/");
            return (<div className="row">
                <div className="col-md-4">
                    { !this.state.loaded ? (<h2>Loading source…</h2>) :
                    <ul className="source-tree">
                        <Qafoo.QA.SourceFolder folder={this.sourceTree} selected={selected} />
                    </ul>
                }</div>
                <div className="col-md-8">
                    {current ?
                        <Qafoo.QA.SourceView file={current} data={this.props.data} start={this.props.query.start} end={this.props.query.end} /> :
                        <h2>File not found</h2>
                    }
                </div>
            </div>);
        }
    });
})();
