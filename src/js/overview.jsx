import React from "react";
import _ from "underscore";

import PDepend from "./overview/pdepend.jsx";
import Dependencies from "./overview/dependencies.jsx";
import PHPMD from "./overview/phpmd.jsx";

let Overview = React.createClass({
    render: function() {
        var analyzers = this.props.data.analyzers,
            handler = [
                {name: "pdepend", component: PDepend},
                {name: "dependencies", component: Dependencies},
                {name: "phpmd", component: PHPMD},
            ];

        return (<div className="row">
            <div className="col-md-12">
                <h1>Qafoo Quality Analyzer</h1>
                <ul className="list-inline">
                    {_.map(
                        _.filter(
                            handler,
                            function(handler) {
                                return analyzers[handler.name];
                            }
                        ),
                        function(handler) {
                            return (<li key={handler.name} className="col-md-4">
                                <handler.component data={analyzers[handler.name]} />
                            </li>);
                        }
                    )}
                </ul>
            </div>
        </div>);
    }
});

export default Overview; 
