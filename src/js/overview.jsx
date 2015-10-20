import React from "react";
import _ from "underscore";

import PDepend from "./overview/pdepend.jsx";
import Dependencies from "./overview/dependencies.jsx";

let Overview = React.createClass({
    render: function() {
        var analyzers = this.props.data.analyzers,
            handler = {
                "pdepend": PDepend,
                "dependencies": Dependencies,
            };
        return (<div className="row">
            <div className="col-md-12">
                <h1>Qafoo Quality Analyzer</h1>
                <ul className="list-inline">
                    {_.map(
                        _.filter(
                            handler,
                            function(Component, name) {
                                return analyzers[name];
                            }
                        ),
                        function(Component, name) {
                            return (<li className="col-md-4">
                                <Component key={name} data={analyzers[name]} />
                            </li>);
                        }
                    )}
                </ul>
            </div>
        </div>);
    }
});

export default Overview; 
