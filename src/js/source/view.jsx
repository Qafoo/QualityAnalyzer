import React from "react";

import Tokenizer from "./tokenizer.js";

let SourceView = React.createClass({

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

    scrollIntoView: function() {
        var element = null;

        if (element = document.getElementById('l' + (this.props.start - 5))) {
            element.scrollIntoView();
        }
    },

    componentDidMount: function() {
        this.scrollIntoView();
    },

    componentDidUpdate: function() {
        this.scrollIntoView();
    },

    render: function() {
        var file = this.props.file,
            lines = this.addMarkup(file.file.asText()),
            start = this.props.start || 0,
            end = this.props.end || 0;

        return (<div>
            <h2>{file.name}</h2>
            <h3>{file.file.name}</h3>
            <ol className="code">
                {$.map(lines, function(line, number) {
                    var lineNumber = number + 1;

                    return <li key={number} id={"l" + lineNumber}
                        className={((lineNumber >= start) && (lineNumber <= end)) ? "highlight" : ""}
                        dangerouslySetInnerHTML={{__html: line}}>
                    </li>
                })}
            </ol>
        </div>);
    }
});

export default SourceView;
