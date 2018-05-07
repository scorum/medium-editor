(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = function (jQuery) {
            if (typeof window === 'undefined') {
                throw new Error("medium-editor-insert-plugin runs only in a browser.")
            }

            if (jQuery === undefined) {
                jQuery = require('jquery');
            }
            window.jQuery = jQuery;

            Handlebars = require('handlebars/runtime');
            MediumEditor = require('../../../');
            require('jquery-sortable');

            factory(jQuery, Handlebars, MediumEditor);
            return jQuery;
        };
    } else {
        factory(jQuery, Handlebars, MediumEditor);
    }
}(function ($, Handlebars, MediumEditor) {
