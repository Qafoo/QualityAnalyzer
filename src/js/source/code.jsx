import React from "react";

import Tokenizer from "./tokenizer.js";

let SourceCode = React.createClass({

    escapeHtml: function(string) {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };

        return String(string).replace(/[&<>"'\/]/g, function(character) {
            return entityMap[character];
        });
    },

    addMarkup: function(string) {
        var tokenizer = new Tokenizer(),
            tokens = tokenizer.tokenizeString(string),
            lines = [];

        for (var line = 0; line < tokens.length; ++line) {
            lines[line] = "";
            for (var token = 0; token < tokens[line].length; ++token) {
                lines[line] += '<span class="' + tokens[line][token].type + '">' +
                        this.escapeHtml(tokens[line][token].text) +
                    '</span>';
            }

            lines[line] = lines[line] || "&nbsp;";
        }

        return lines;
    },

    render: function() {
        var lines = this.addMarkup(this.props.code),
            start = this.props.start || 0,
            end = this.props.end || 0;

        return (<ol className="code">
            {$.map(lines, function(line, number) {
                var lineNumber = number + 1;

                return <li key={number} id={"l" + lineNumber}
                    className={((lineNumber >= start) && (lineNumber <= end)) ? "highlight" : ""}
                    dangerouslySetInnerHTML={{__html: line}}>
                </li>
            })}
        </ol>);
    }
});

export default SourceCode;
