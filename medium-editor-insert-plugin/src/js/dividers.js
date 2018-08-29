;(function ($, window, document, undefined) {

    'use strict';

    /** Default values */
    var pluginName = 'mediumInsert',
        addonName = 'Dividers', // first char is uppercase
        defaults = {
            label: '<span class=""></span>',
            tooltipTitle: '',
        };

    /**
     * Dividers object
     *
     * Sets options, variables and calls init() function
     *
     * @constructor
     * @param {DOM} el - DOM element to init the plugin on
     * @param {object} options - Options to override defaults
     * @return {void}
     */
    function Dividers(el, options) {
        this.el = el;
        this.$el = $(el);
        this.templates = window.MediumInsert.Templates;
        this.core = this.$el.data('plugin_' + pluginName);

        this.options = $.extend(true, {}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    /**
     * Initialization
     *
     * @return {void}
     */
    Dividers.prototype.init = function () {
        this.events();
    };

    /**
     * Event listeners
     *
     * @return {void}
     */
    Dividers.prototype.events = function () {
        $(document).on('click', '.medium-insert-divider', $.proxy(this, 'clickDivider'));
    };

    /**
     * Get the Core object
     *
     * @return {object} Core object
     */
    Dividers.prototype.getCore = function () {
        return this.core;
    };

    /**
     * Add custom content
     *
     * This function is called when user click on the addon's icon
     *
     * @return {void}
     */
    Dividers.prototype.add = function () {
        var $place = this.$el.find('.medium-insert-active');

        if ($place.is('p')) {
            this.$el.find('.medium-insert-divider-added').removeClass('medium-insert-divider-added');
            $place.replaceWith(this.templates['src/js/templates/divider.hbs']().trim());

            $place = this.$el.find('.medium-insert-divider-added');

            if ($place.next().is('p')) {
                this.core.moveCaret($place.next());
                $place.next().click().click();
            } else {
                if (!$place.next().is('.medium-insert-images, .medium-insert-embeds')) {
                    $place.after('<p> <br></p>'); // add empty paragraph so we can move the caret to the next line.
                    this.core.moveCaret($place.next());
                    $place.next().click().click();
                }
            }

            // Add empty paragraph before media block wrapper if it's a first child in content
            // or prev element is divider
            if ($place.is(':first-child') || $place.prev().hasClass('medium-insert-divider')) {
                $place.before('<p><br></p>');
            }

            this.core.hideButtons();
            this.core.triggerInput();
        }
    };

    Dividers.prototype.clickDivider = function (e) {
        var $current = $(e.target);

        e.preventDefault();
        this.el.blur();

        if ($current.next().is('p')) {
            this.core.moveCaret($current.next());
            $current.next().click();
        }
    };

    /** Addon initialization */
    $.fn[pluginName + addonName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName + addonName)) {
                $.data(this, 'plugin_' + pluginName + addonName, new Dividers(this, options));
            }
        });
    };

})(jQuery, window, document);