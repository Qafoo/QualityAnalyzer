var Qafoo = Qafoo || {QA: {}};

(function () {
    "use strict";

    if (!(Qafoo.QA.Data && Qafoo.QA.Loader)) {
        throw "Some application components were not correctly loaded.";
    }

    React.render(
        <Qafoo.QA.Loader/>,
        document.getElementById('content')
    );
})();
