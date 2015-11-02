import React from "react"
import _ from "underscore"

import Tokenizer from "./tokenizer.js"

let SourceCode = React.createClass({
    propTypes: {
        code: React.PropTypes.string,
        coverage: React.PropTypes.array,
        start: React.PropTypes.number,
        end: React.PropTypes.number,
    },

    escapeHtml: function (string) {
        var entityMap = {
            "&": "&amp",
            "<": "&lt",
            ">": "&gt",
            '"': '&quot',
            "'": '&#39',
            "/": '&#x2F',
        }

        return String(string).replace(/[&<>"'\/]/g, function (character) {
            return entityMap[character]
        })
    },

    addMarkup: function (string) {
        var tokenizer = new Tokenizer()
        var tokens = tokenizer.tokenizeString(string)
        var lines = []

        for (var line = 0; line < tokens.length; ++line) {
            lines[line] = ""
            for (var token = 0; token < tokens[line].length; ++token) {
                lines[line] += '<span class="' + tokens[line][token].type + '">' +
                        this.escapeHtml(tokens[line][token].text) +
                    '</span>'
            }

            lines[line] = lines[line] || "&nbsp;"
        }

        return lines
    },

    render: function () {
        var lines = this.addMarkup(this.props.code)
        var coverage = this.props.coverage || []
        var start = this.props.start || 0
        var end = this.props.end || 0

        return (<ol className="code">
            {_.map(lines, function (line, number) {
                var lineNumber = number + 1
                var coverageClass = ""

                if (coverage[lineNumber] !== undefined) {
                    coverageClass = coverage[lineNumber] ? "covered" : "uncovered"
                }

                return (<li key={number} id={"l" + lineNumber}
                    className={
                        (((lineNumber >= start) && (lineNumber <= end)) ? "highlight " : "") + coverageClass
                    }
                    dangerouslySetInnerHTML={{ __html: line }}>
                </li>)
            })}
        </ol>)
    },
})

export default SourceCode
