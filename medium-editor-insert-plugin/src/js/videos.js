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

    function Videos(el, options) {
        commonEmbedsAddon.apply(this, arguments);
    }

    Videos.prototype = Object.create(commonEmbedsAddon.prototype);
    Videos.prototype.constructor = Videos;


    /** Plugin initialization */

    $.fn[pluginName + addonName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName + addonName)) {
                $.data(this, 'plugin_' + pluginName + addonName, new Videos(this, options));
            }
        });
    };

})(jQuery, window, document);
