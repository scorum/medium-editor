; (function ($, window, document, undefined) {

    'use strict';

    /** Default values */
    var pluginName = 'mediumInsert',
        addonName = 'Videos'; // first char is uppercase

    /**
     * @constructor
     */
    var commonEmbedsAddon = getCommonEmbedsAddon(pluginName, addonName, $, window, document);

    /**
     * Videos object
     * @inheritDoc
     */
    function Videos (el, options) {
        this.el = el;
        this.$el = $(el);
        this.templates = window.MediumInsert.Templates;
        this.core = this.$el.data('plugin_'+ pluginName);

        this.options = $.extend(true, {}, options);

        this._name = pluginName;

        this.init();
    }

    /**
     * Initialization
     *
     * @return {void}
     */

    Videos.prototype.init = function () {
        this.events();
    };

    /**
     * Event listeners
     *
     * @return {void}
     */

    Videos.prototype.events = function () {

    };

    /**
     * Get the Core object
     *
     * @return {object} Core object
     */
    Videos.prototype.getCore = function () {
        return this.core;
    };

    /**
     * Add custom content
     *
     * This function is called when user click on the addon's icon
     *
     * @return {void}
     */

    Videos.prototype.add = function () {
        commonEmbedsAddon.prototype.add.apply(this, arguments);
    };

    Videos.prototype.togglePlaceholder = function () {
        commonEmbedsAddon.prototype.togglePlaceholder.apply(this, arguments);
    };

    /** Plugin initialization */

    $.fn[pluginName + addonName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName + addonName)) {
                $.data(this, 'plugin_' + pluginName + addonName, new Videos(this, options));
            }
        });
    };

})(jQuery, window, document);
