"use strict";

describe("Module/Depenencies/Model", function() {
    it("gets initial set of elaves", function() {
        var model = new Qafoo.QA.Modules.DependenciesModel();

        expect(model.getLeaves())
            .toEqual([{
                id: '0',
                name: '/',
                type: 'package',
                size: 0,
                depth: 0,
                hidden: true
            }]);
    });
});
