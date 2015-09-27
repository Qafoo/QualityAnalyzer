var app = app || {};

(function () {
    "use strict";

    var Data = app.Data;
    var Loader = app.Loader;

    if (!(app.Data && app.Loader)) {
        throw "Some application components were not correctly loaded.";
    }

    React.render(
        <Loader/>,
        document.getElementById('content')
    );
})();
