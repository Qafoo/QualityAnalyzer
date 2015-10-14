/* jshint bitwise: false */
/* globals describe, beforeEach, it, expect */

import Tokenizer from '../../../src/js/source/tokenizer.js';

describe("Source/Tokenizer", function() {

    it("tokenizes an empty string", function() {
        var tokenizer = new Tokenizer();

        expect(tokenizer.tokenizeString(""))
            .toEqual([]);
    });

    it("tokenizes common keywords", function() {
        var tokenizer = new Tokenizer();

        expect(tokenizer.tokenizeString("public function test() {}"))
            .toEqual([
                { type: 'keyword', text: 'public' },
                { type: 'whitespace', text: ' ' },
                { type: 'keyword', text: 'function' },
                { type: 'whitespace', text: ' ' },
                { type: 'name', text: 'test' },
                { type: 'operator', text: '(' },
                { type: 'operator', text: ')' },
                { type: 'whitespace', text: ' ' },
                { type: 'uncaught', text: '{}' }
            ]);
    });

    it("tokenizes single quoted string with escape sequence", function() {
        var tokenizer = new Tokenizer();

        expect(tokenizer.tokenizeString("' Hello \\' world'"))
            .toEqual([
                { type: 'string', text: "' Hello \\' world'"},
            ]);
    });

    it("tokenizes double quoted string with escape sequence", function() {
        var tokenizer = new Tokenizer();

        expect(tokenizer.tokenizeString('" Hello \\" \\ \' world"'))
            .toEqual([
                { type: 'string', text: '" Hello \\" \\ \' world"'},
            ]);
    });

    it("tokenizes simple integer number", function() {
        var tokenizer = new Tokenizer();

        expect(tokenizer.tokenizeString('12345'))
            .toEqual([
                { type: 'number', text: '12345'},
            ]);
    });

    it("tokenizes simple float number", function() {
        var tokenizer = new Tokenizer();

        expect(tokenizer.tokenizeString('-1.345'))
            .toEqual([
                { type: 'number', text: '-1.345'},
            ]);
    });

    it("tokenizes dot prefixed float number", function() {
        var tokenizer = new Tokenizer();

        expect(tokenizer.tokenizeString('+.345'))
            .toEqual([
                { type: 'number', text: '+.345'},
            ]);
    });

    it("tokenizes // comment", function() {
        var tokenizer = new Tokenizer();

        expect(tokenizer.tokenizeString("// foo\n'bar'"))
            .toEqual([
                { type: 'comment', text: '// foo'},
                { type: 'whitespace', text: "\n"},
                { type: 'string', text: "'bar'"},
            ]);
    });

    it("tokenizes # comment", function() {
        var tokenizer = new Tokenizer();

        expect(tokenizer.tokenizeString("# foo\n'bar'"))
            .toEqual([
                { type: 'comment', text: '# foo'},
                { type: 'whitespace', text: "\n"},
                { type: 'string', text: "'bar'"},
            ]);
    });
});
