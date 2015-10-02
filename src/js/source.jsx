var Qafoo = Qafoo || {QA: {}};

(function () {
    "use strict";

    Qafoo.QA.Source = React.createClass({
        getInitialState: function() {
            return {
                loaded: false
            };
        },

        sourceTree: new Qafoo.QA.SourceTree(),

        componentWillMount: function() {
            var component = this;

            if (component.sourceTree.hasFiles()) {
                component.setState({loaded: true});
                return;
            }

            component.sourceTree.setBaseDir(this.props.data.baseDir);
            $.ajax('/data/source.zip', {
                method: "GET",
                contentType: "text/plain; charset=x-user-defined",
                dataType: "binary",
                responseType: "arraybuffer",
                processData: false,
                success: function(data) {
                    var source = new JSZip(data);

                    component.sourceTree.addFiles(source.files);
                    component.setState({loaded: true});
                }
            });
        },

        render: function() {
            var file = this.sourceTree.getFileName(this.props.parameters.splat || "/"),
                selected = file.split("/"),
                current = this.sourceTree.getSelectedFile(selected);

            selected.unshift("/");
            return (<div className="row">
                <div className="col-md-4">
                    { !this.state.loaded ? (<h2>Loading source…</h2>) :
                    <ul className="source-tree">
                        <Qafoo.QA.SourceFolder folder={this.sourceTree.getTree()} selected={selected} />
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
