import React from "react";
import _ from "underscore";

import PhpLoc from "./overview/phploc.jsx";
import PDepend from "./overview/pdepend.jsx";
import Dependencies from "./overview/dependencies.jsx";
import PHPMD from "./overview/phpmd.jsx";
import Checkstyle from "./overview/checkstyle.jsx";
import CPD from "./overview/cpd.jsx";
import Coverage from "./overview/coverage.jsx";
import Tests from "./overview/tests.jsx";

let Overview = React.createClass({
    render: function() {
        var analyzers = this.props.data.analyzers,
            handler = [
                {name: "phploc", component: PhpLoc},
                {name: "pdepend", component: PDepend},
                {name: "dependencies", component: Dependencies},
                {name: "phpmd", component: PHPMD},
                {name: "checkstyle", component: Checkstyle},
                {name: "cpd", component: CPD},
                {name: "coverage", component: Coverage},
                {name: "tests", component: Tests},
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
