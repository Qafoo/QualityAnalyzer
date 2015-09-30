var Bootstrap = Bootstrap || {};

(function () {
    "use strict";

    Bootstrap.Navigation = React.createClass({
        getDefaultProps: function() {
            return {
                brand: "Your Brand",
                brandLink: null,
                items: {}
            };
        },

        render: function() {
            return (<nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <ReactRouter.Link className="navbar-brand" to={this.props.brandLink}>
                            {this.props.brand}
                        </ReactRouter.Link>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            {$.map(this.props.items, function(item, i) {
                                return (<Bootstrap.NavLink key={i} to={item.path}>
                                    {!item.icon ? '' :
                                        <span className={item.icon}></span>
                                    } {item.name}
                                </Bootstrap.NavLink>);
                            })}
                        </ul>
                    </div>
                </div>
            </nav>);
        }
    });
})();
