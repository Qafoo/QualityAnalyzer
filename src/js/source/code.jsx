import React from "react"
import _ from "underscore"

import Tokenizer from "./tokenizer.js"

let SourceCode = React.createClass({
    propTypes: {
        code: React.PropTypes.string,
        quality: React.PropTypes.object,
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
        var coverage = this.props.quality.coverage.data.lines || []
        var start = this.props.start || 0
        var end = this.props.end || 0
        let color = d3.scale.linear()
            .domain([0, .7, 1])
            .range(["#A6403D", "#A6883D", "#308336"])

        return (<div>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                    {_.map(this.props.quality, (function (data, key) {
                        return (<td key={key} className="text-center" style={{ width: (100 / _.toArray(this.props.quality).length) + "%"}}>
                            <big style={{ color: color(data.index) }}>{data.index.toFixed(2)}</big><br />
                            {(() => {
                                switch (key) {
                                    case 'size': return <small>{data.data.lines} lines of code</small>
                                    case 'coverage': return <small>{data.data.covered} of {data.data.count} lines covered</small>
                                    case 'commits': return <small>{data.data.commits} commits</small>
                                }
                            })()}
                        </td>)
                    }).bind(this))}
                    </tr>
                </tbody>
            </table>
            <ol className="code">
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
            </ol>
        </div>)
    },
})

export default SourceCode
