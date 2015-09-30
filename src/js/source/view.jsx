var Qafoo = Qafoo || {QA: {}};

(function () {
    "use strict";

    Qafoo.QA.SourceView = React.createClass({

        markup: {
            "keyword": /(\s+|^)(abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield)(\s+|$)/g
        },

        splitLines: function(fileContent) {
            return fileContent.split(/\r\n|\r|\n/);
        },

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

        addMarkup: function(lines) {
            for (var line = 0; line < lines.length; ++line) {
                var content = this.escapeHtml(lines[line]);

                for (var type in this.markup) {
                    content = content.replace(this.markup[type], function(match) {
                        return "<span class=\"" + type + "\">" + match + "</span>";
                    });
                }

                lines[line] = content ? content : "&nbsp;";
            }

            return lines;
        },

        render: function() {
            var file = this.props.file,
                lines = this.addMarkup(this.splitLines(file.file.asText()));
 
            return (<div>
                <h2>{file.name}</h2>
                <h3>{file.file.name}</h3>
                <ol className="code">
                    {$.map(lines, function(line, number) {
                        return <li key={number} id={number + 1} dangerouslySetInnerHTML={{__html: line}}></li>
                    })}
                </ol>
            </div>);
        }
    });
})();
