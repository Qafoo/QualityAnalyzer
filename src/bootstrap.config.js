var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    bootstrapCustomizations: "./src/css/variables.scss",
    mainSass: "./src/css/app.scss",
    verbose: true,
    debug: false,
    styleLoader: ExtractTextPlugin.extract("style-loader", "css-loader!sass?outputStyle=expanded"),
    scripts: {
        "affix": false,
        "alert": false,
        "button": false,
        "carousel": false,
        "collapse": false,
        "dropdown": false,
        "modal": false,
        "popover": false,
        "scrollspy": false,
        "slim_navigation": false,
        "tab": false,
        "tags": false,
        "tooltip": false,
        "transition": false
    },
    styles: {
        "mixins": true,

        // Reset and dependencies
        "normalize": true,
        "print": true,
        "glyphicons": true,

        // Core CSS
        "scaffolding": true,
        "type": true,
        "code": true,
        "grid": true,
        "tables": true,
        "forms": true,
        "buttons": true,

        // Components
        "component-animations": true,
        "dropdowns": true,
        "button-groups": true,
        "input-groups": true,
        "navs": true,
        "navbar": true,
        "breadcrumbs": true,
        "pagination": true,
        "pager": true,
        "labels": true,
        "badges": true,
        "jumbotron": false,
        "thumbnails": false,
        "alerts": false,
        "progress-bars": true,
        "media": false,
        "list-group": true,
        "panels": true,
        "responsive-embed": true,
        "wells": false,
        "close": true,

        // Components w/ JavaScript
        "modals": false,
        "tooltip": false,
        "popovers": false,
        "carousel": false,

        // Utility classes
        "utilities": true,
        "responsive-utilities": true,
    }
};
