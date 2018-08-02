/*! 
 * medium-editor-insert-plugin v2.5.0 - jQuery insert plugin for MediumEditor
 *
 * http://linkesch.com/medium-editor-insert-plugin
 * 
 * Copyright (c) 2014 Pavel Linkesch (http://linkesch.com)
 * Released under the MIT license
 */

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

this["MediumInsert"] = this["MediumInsert"] || {};
this["MediumInsert"]["Templates"] = this["MediumInsert"]["Templates"] || {};

this["MediumInsert"]["Templates"]["src/js/templates/coachmark-block.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"medium-insert-help-coachmark\" data-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" contenteditable=\"false\">\n    <h5>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h5>\n    <div>"
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n    <button>"
    + alias4(((helper = (helper = helpers.buttonText || (depth0 != null ? depth0.buttonText : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buttonText","hash":{},"data":data}) : helper)))
    + "</button>\n</div>\n";
},"useData":true});

this["MediumInsert"]["Templates"]["src/js/templates/core-buttons.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <li><button data-addon=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" data-action=\"add\" class=\"medium-insert-action\" type=\"button\" data-tooltip-title=\""
    + alias4(((helper = (helper = helpers.tooltipTitle || (depth0 != null ? depth0.tooltipTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tooltipTitle","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button></li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"medium-insert-buttons\" contenteditable=\"false\" style=\"display: none\">\n    <button class=\"medium-insert-buttons-show\" type=\"button\">"
    + ((stack1 = ((helper = (helper = helpers.showButtonLabel || (depth0 != null ? depth0.showButtonLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"showButtonLabel","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n    <ul class=\"medium-insert-buttons-addons\" style=\"display: none\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.addons : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</div>\n";
},"useData":true});

this["MediumInsert"]["Templates"]["src/js/templates/core-caption.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<figcaption style=\"word-wrap: break-word; overflow: hidden;\" contenteditable=\"true\" class=\"medium-insert-caption-placeholder\" data-placeholder=\""
    + container.escapeExpression(((helper = (helper = helpers.placeholder || (depth0 != null ? depth0.placeholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"placeholder","hash":{},"data":data}) : helper)))
    + "\"></figcaption>";
},"useData":true});

this["MediumInsert"]["Templates"]["src/js/templates/core-empty-line.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<p><br></p>\n";
},"useData":true});

this["MediumInsert"]["Templates"]["src/js/templates/embeds-toolbar.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"medium-insert-embeds-toolbar medium-editor-toolbar medium-toolbar-arrow-under medium-editor-toolbar-active\">\n        <ul class=\"medium-editor-toolbar-actions clearfix\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.styles : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n    </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "                    <li>\n                        <button class=\"medium-editor-action\" data-action=\""
    + container.escapeExpression(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n                    </li>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"medium-insert-embeds-toolbar2 medium-editor-toolbar medium-editor-toolbar-active\">\n        <ul class=\"medium-editor-toolbar-actions clearfix\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.actions : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.styles : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.actions : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["MediumInsert"]["Templates"]["src/js/templates/embeds-wrapper.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "<div class=\"medium-insert-embeds medium-insert-embeds-added\" contenteditable=\"false\">\n	<figure>\n        <div class=\"medium-insert-embed\" data-embedded-object-src=\""
    + container.escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">\n            "
    + ((stack1 = ((helper = (helper = helpers.html || (depth0 != null ? depth0.html : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"html","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n        </div>\n	</figure>\n	<div class=\"medium-insert-embeds-overlay\"></div>\n</div>";
},"useData":true});

this["MediumInsert"]["Templates"]["src/js/templates/images-fileupload.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<input type=\"file\">";
},"useData":true});

this["MediumInsert"]["Templates"]["src/js/templates/images-image.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "        <div class=\"medium-insert-images-progress\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<figure contenteditable=\"false\">\n    <img src=\""
    + container.escapeExpression(((helper = (helper = helpers.img || (depth0 != null ? depth0.img : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"img","hash":{},"data":data}) : helper)))
    + "\" alt=\"\" />\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.progress : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</figure>\n";
},"useData":true});

this["MediumInsert"]["Templates"]["src/js/templates/images-progressbar.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<progress min=\"0\" max=\"100\" value=\"0\">0</progress>";
},"useData":true});

this["MediumInsert"]["Templates"]["src/js/templates/images-toolbar.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <li>\n                    <button class=\"medium-editor-action\" data-action=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" data-size=\""
    + alias4(((helper = (helper = helpers.size || (depth0 != null ? depth0.size : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"size","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n                </li>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "	<div class=\"medium-insert-images-toolbar2 medium-editor-toolbar medium-editor-toolbar-active\">\n		<ul class=\"medium-editor-toolbar-actions clearfix\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.actions : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    	</ul>\n    </div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "        	        <li>\n        	            <button class=\"medium-editor-action\" data-action=\""
    + container.escapeExpression(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n        	        </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"medium-insert-images-toolbar medium-editor-toolbar medium-toolbar-arrow-under medium-editor-toolbar-active\">\n    <ul class=\"medium-editor-toolbar-actions clearfix\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.styles : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.actions : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
;(function ($, window, document, Util, Selection, undefined) {

    'use strict';

    /** Default values */
    var pluginName = 'mediumInsert',
        defaults = {
            editor: null,
            enabled: true,
            showButtonLabel: '<span>+</span>',
            helpCoachmarksOptions: {
                elements: {
                    showButtonElement: {
                        id: null,
                        title: null,
                        content: null,
                        buttonText: null,
                    },
                    editorElement: {
                        id: null,
                        title: null,
                        content: null,
                        buttonText: null,
                    },
                },
                helpers: null,
            },
            customEventsTypes: {},
            maxBodySizeLimitData: {
                value: null,
                callback: function () {},
            },
            addons: {
                images: true, // boolean or object containing configuration
                videos: true,
                embeds: true
            }
        };

    /**
     * Capitalize first character
     *
     * @param {string} str
     * @return {string}
     */

    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Core plugin's object
     *
     * Sets options, variables and calls init() function
     *
     * @constructor
     * @param {DOM} el - DOM element to init the plugin on
     * @param {object} options - Options to override defaults
     * @return {void}
     */

    function Core(el, options) {
        var editor;

        this.el = el;
        this.$el = $(el);
        this.templates = window.MediumInsert.Templates;

        if (options) {
            // Fix #142
            // Avoid deep copying editor object, because since v2.3.0 it contains circular references which causes jQuery.extend to break
            // Instead copy editor object to this.options manually
            editor = options.editor;
            options.editor = null;
        }
        this.options = $.extend(true, {}, defaults, options);
        this.options.editor = editor;
        if (options) {
            options.editor = editor; // Restore original object definition
        }

        this._defaults = defaults;
        this._name = pluginName;

        // Extend editor's functions
        if (this.options && this.options.editor) {
            if (this.options.editor._serialize === undefined) {
                this.options.editor._serialize = this.options.editor.serialize;
            }
            if (this.options.editor._destroy === undefined) {
                this.options.editor._destroy = this.options.editor.destroy;
            }
            if (this.options.editor._setup === undefined) {
                this.options.editor._setup = this.options.editor.setup;
            }
            this.options.editor._hideInsertButtons = this.hideButtons;

            this.options.editor.serialize = this.editorSerialize;
            this.options.editor.destroy = this.editorDestroy;
            this.options.editor.setup = this.editorSetup;

            if (this.options.editor.getExtensionByName('placeholder') !== undefined) {
                this.options.editor.getExtensionByName('placeholder').updatePlaceholder = this.editorUpdatePlaceholder;
            }
        }
    }

    /**
     * Initialization
     *
     * @return {void}
     */

    Core.prototype.init = function () {
        this.$el.addClass('medium-editor-insert-plugin');

        if (typeof this.options.addons !== 'object' || Object.keys(this.options.addons).length === 0) {
            this.disable();
        }

        this.initAddons();
        this.clean();
        this.events();
    };

    /**
     * Event listeners
     *
     * @return {void}
     */

    Core.prototype.events = function () {
        var that = this,
            eventTypes = this.options.customEventsTypes;

        this.$el
            .on('dragover dragenter dragleave drop', function (e) {
                e.preventDefault();
            })
            .on('keydown paste', $.proxy(this, 'checkEditorDisableAttr'))
            .on('keyup click', $.proxy(this, 'toggleButtons'))
            .on('keydown', 'figcaption', $.proxy(this, 'checkCaptionBehavior'))
            .on('keydown', $.proxy(this, 'checkMediaBlockWhileLineRemoving'))
            .on('selectstart mousedown', '.medium-insert, .medium-insert-buttons', $.proxy(this, 'disableSelection'))
            .on('click', '.medium-insert-buttons-show', $.proxy(this, 'toggleAddons'))
            .on('click', '.medium-insert-action', $.proxy(this, 'addonAction'))
            .on('paste', '.medium-insert-caption-placeholder', function (e) {
                $.proxy(that, 'removeCaptionPlaceholder')($(e.target));
            })
            .on('mouseenter', '.medium-insert-action', $.proxy(this, 'hoverInInsertActionButton'))
            .on('mouseleave', '.medium-insert-action', $.proxy(this, 'hoverOutInsertActionButton'))
            .on('keydown', $.proxy(this, 'checkEditorToolbarCoachmark'))
            .on('input ' + eventTypes.customInputEvent, $.proxy(this, 'checkEditorContentMaxSize'));

        $(document).on('keydown', $.proxy(this, 'moveMediaBlockToNextLine'));

        $(window).on('resize', $.proxy(this, 'positionButtons', null));
    };

    /**
     * Return editor instance
     *
     * @return {object} MediumEditor
     */

    Core.prototype.getEditor = function () {
        return this.options.editor;
    };

    /**
     * Extend editor's serialize function
     *
     * @return {object} Serialized data
     */

    Core.prototype.editorSerialize = function () {
        var data = this._serialize();

        $.each(data, function (key) {
            var $data = $('<div />').html(data[key].value);

            $data.find('.medium-insert-buttons').remove();
            $data.find('.medium-insert-active').removeClass('medium-insert-active');

            // Removes Coachmarks
            $data.find('.medium-insert-help-coachmark').remove();

            // Removes Captions placeholders
            $data.find('figcaption.medium-insert-caption-placeholder').remove();

            // Restore original embed code from embed wrapper attribute value.
            $data.find('[data-embed-code]').each(function () {
                var $this = $(this),
                    html = $('<div />').html($this.attr('data-embed-code')).text();
                $this.html(html);
            });

            /*$data.find('p').each(function() {
                var $this = $(this);
                var $prevEl = $this.prev();
                var $nextEl = $this.next('p');

                if ($this.text().length === 0 &&
                    ($prevEl.length === 0 || ($nextEl.length !== 0 && $nextEl.text() === '')))
                {
                    $this.remove();
                }
            });*/

            // Removes first empty paragraph
            var $firstParagraph = $data.find('p').first();

            if ($firstParagraph.length !== 0 && $firstParagraph.prev().length === 0 && $firstParagraph.text().trim() === '') {
                $firstParagraph.remove();
            }

            data[key].value = $data.html();
        });

        return data;
    };

    /**
     * Extend editor's destroy function to deactivate this plugin too
     *
     * @return {void}
     */

    Core.prototype.editorDestroy = function () {
        $.each(this.elements, function (key, el) {
            if ($(el).data('plugin_' + pluginName) instanceof Core) {
                $(el).data('plugin_' + pluginName).disable();
            }
        });

        $('.medium-insert-images-toolbar, .medium-insert-images-toolbar2').off().remove();
        $('.medium-insert-embeds-toolbar, .medium-insert-embeds-toolbar2').off().remove();
        $('.medium-editor-toolbar-small-wrapper').off().remove();

        this._destroy();
    };

    /**
     * Extend editor's setup function to activate this plugin too
     *
     * @return {void}
     */

    Core.prototype.editorSetup = function () {
        this._setup();

        $.each(this.elements, function (key, el) {
            if ($(el).data('plugin_' + pluginName) instanceof Core) {
                $(el).data('plugin_' + pluginName).enable();
            }
        });
    };

    /**
     * Extend editor's placeholder.updatePlaceholder function to show placeholder dispite of the plugin buttons
     *
     * @return {void}
     */

    Core.prototype.editorUpdatePlaceholder = function (el, dontShow) {
        var contents = $(el).children()
            .not('.medium-insert-buttons').contents();

        if (!dontShow && contents.length === 1 && contents[0].nodeName.toLowerCase() === 'br') {
            this.showPlaceholder(el);
            this.base._hideInsertButtons($(el));
        } else {
            this.hidePlaceholder(el);
        }
    };

    /**
     * Trigger editableInput (+ certain custom events) event on editor
     *
     * @return {void}
     */

    Core.prototype.triggerInput = function () {
        if (this.getEditor()) {
            this.getEditor().trigger('editableInput', null, this.el);

            var eventsTypes = this.options.customEventsTypes;

            // Triggers `customInputEvent` event
            const customInputEvent = eventsTypes.customInputEvent;

            if (customInputEvent) {
                this.$el.trigger(customInputEvent);
            }

            // Triggers `draftUpsertEvent` event
            // in order for RxJs Observable to handle it and runs draft upserting functionality
            const draftUpsertEvent = eventsTypes.draftUpsertEvent;

            if (draftUpsertEvent) {
                window.dispatchEvent(new Event(draftUpsertEvent));
            }
        }
    };

    /**
     * Deselects selected text
     *
     * @return {void}
     */

    Core.prototype.deselect = function () {
        document.getSelection().removeAllRanges();
    };

    /**
     * Disables the plugin
     *
     * @return {void}
     */

    Core.prototype.disable = function () {
        this.options.enabled = false;

        this.$el.find('.medium-insert-buttons').addClass('hide');
    };

    /**
     * Enables the plugin
     *
     * @return {void}
     */

    Core.prototype.enable = function () {
        this.options.enabled = true;

        this.$el.find('.medium-insert-buttons').removeClass('hide');
    };

    /**
     * Disables selectstart mousedown events on plugin elements except images
     *
     * @return {void}
     */

    Core.prototype.disableSelection = function (e) {
        var $el = $(e.target);

        if ($el.is('img') === false || $el.hasClass('medium-insert-buttons-show')) {
            e.preventDefault();
        }
    };

    /**
     * Check whether the editor block is disabled
     * @param e
     */
    Core.prototype.checkEditorDisableAttr = function (e) {
        if (this.$el.attr('data-medium-editor-is-disabled')
            // 37, 38, 39, 40 - keyboard arrows keys codes
            && (!Util.isKey(e, [Util.keyCode.BACKSPACE, Util.keyCode.DELETE, 37, 38, 39, 40]) || e.type === 'paste')) {
            e.stopPropagation();
            e.preventDefault();

            return false;
        }
    };

    /**
     * Initialize addons
     *
     * @return {void}
     */

    Core.prototype.initAddons = function () {
        var that = this;

        if (!this.options.addons || this.options.addons.length === 0) {
            return;
        }

        $.each(this.options.addons, function (addon, options) {
            var addonName = pluginName + ucfirst(addon);

            if (options === false) {
                delete that.options.addons[addon];
                return;
            }

            that.$el[addonName](options);
            that.options.addons[addon] = that.$el.data('plugin_' + addonName).options;
        });
    };

    /**
     * Cleans a content of the editor
     *
     * @return {void}
     */

    Core.prototype.clean = function () {
        var that = this,
            $buttons, $lastEl, $text;

        if (this.options.enabled === false) {
            return;
        }

        if (this.$el.html().length === 0) {
            this.$el.html(this.templates['src/js/templates/core-empty-line.hbs']().trim());
        }

        // Fix #29
        // Wrap content text in <p></p> to avoid Firefox problems
        $text = this.$el
            .contents()
            .filter(function () {
                return (this.nodeName === '#text' && $.trim($(this).text()) !== '') || this.nodeName.toLowerCase() === 'br';
            });

        $text.each(function () {
            $(this).wrap('<p />');

            // Fix #145
            // Move caret at the end of the element that's being wrapped
            that.moveCaret($(this).parent(), $(this).text().length);
        });

        this.addButtons();

        $buttons = this.$el.find('.medium-insert-buttons');
        $lastEl = $buttons.prev();
        if ($lastEl.attr('class') && $lastEl.attr('class').match(/medium\-insert(?!\-active)/)) {
            $buttons.before(this.templates['src/js/templates/core-empty-line.hbs']().trim());
        }
    };

    /**
     * Returns HTML template of buttons
     *
     * @return {string} HTML template of buttons
     */

    Core.prototype.getButtons = function () {
        if (this.options.enabled === false) {
            return;
        }

        return this.templates['src/js/templates/core-buttons.hbs']({
            addons: this.options.addons,
            showButtonLabel: this.options.showButtonLabel,
        }).trim();
    };

    /**
     * Appends buttons at the end of the $el
     *
     * @return {void}
     */

    Core.prototype.addButtons = function () {
        if (this.$el.find('.medium-insert-buttons').length === 0) {
            this.$el.append(this.getButtons());
        }
    };

    /**
     * Move buttons to current active, empty paragraph and show them
     *
     * @return {void}
     */

    Core.prototype.toggleButtons = function (e) {
        var $el = $(e.target),
            selection = window.getSelection(),
            that = this,
            range, $current, $p, activeAddon;

        if (this.options.enabled === false) {
            return;
        }

        if (this.$el.attr('data-medium-editor-is-disabled')) {
            this.$el.find('.medium-insert-buttons').hide();
            this.$el.find('.medium-insert-buttons-addons').hide();
            this.$el.find('.medium-insert-buttons-show').removeClass('medium-insert-buttons-rotate');
            this.$el.removeClass('medium-insert-buttons-active');
            return;
        }

        if (!selection || selection.rangeCount === 0) {
            $current = $el;
        } else {
            range = selection.getRangeAt(0);
            $current = $(range.commonAncestorContainer);
        }

        // When user clicks on  editor's placeholder in FF, $current el is editor itself, not the first paragraph as it should
        if ($current.hasClass('medium-editor-insert-plugin')) {
            $current = $current.find('p:first');
        }

        $p = $current.is('p') ? $current : $current.closest('p');

        this.clean();

        if ($el.closest('.medium-insert-buttons').length === 0 && $current.closest('.medium-insert-buttons').length === 0) {

            this.$el.find('.medium-insert-active').removeClass('medium-insert-active');

            $.each(this.options.addons, function (addon) {
                if ($el.closest('.medium-insert-' + addon).length) {
                    $current = $el;
                }

                if ($current.closest('.medium-insert-' + addon).length) {
                    $p = $current.closest('.medium-insert-' + addon);
                    activeAddon = addon;
                    return;
                }
            });

            if ($p.length && (($p.text().trim() === '' && !activeAddon) || activeAddon === 'images')) {
                if ($p.closest('blockquote').length === 0) {
                    $p.addClass('medium-insert-active');

                    // Processes Coachmark functionality
                    var coachmarkElementData = this.options.helpCoachmarksOptions.elements.showButtonElement;
                    this.addHelpCoachmark(coachmarkElementData, this.$el.find('.medium-insert-buttons'));

                    if (activeAddon === 'images') {
                        this.$el.find('.medium-insert-buttons').attr('data-active-addon', activeAddon);
                    } else {
                        this.$el.find('.medium-insert-buttons').removeAttr('data-active-addon');
                    }

                    // If buttons are displayed on addon paragraph, wait 100ms for possible captions to display
                    setTimeout(function () {
                        that.positionButtons(activeAddon);
                        that.showButtons(activeAddon);
                    }, activeAddon ? 100 : 0);
                }
            } else {
                this.hideButtons();
            }
        }
    };

    /**
     * Show buttons
     *
     * @param {string} activeAddon - Name of active addon
     * @returns {void}
     */

    Core.prototype.showButtons = function (activeAddon) {
        var $buttons = this.$el.find('.medium-insert-buttons');

        if (activeAddon !== 'images') {
            $buttons.show();
            $buttons.find('li').show();
        } else {
            this.hideButtons();
        }
    };

    /**
     * Hides buttons
     *
     * @param {jQuery} $el - Editor element
     * @returns {void}
     */

    Core.prototype.hideButtons = function ($el) {
        $el = $el || this.$el;

        $el.find('.medium-insert-buttons').hide();
        $el.find('.medium-insert-buttons-addons').hide();
        $el.find('.medium-insert-buttons-show').removeClass('medium-insert-buttons-rotate');

        if (this.$el) {
            var hasPlaceholder = this.$el.hasClass('medium-editor-placeholder') || this.$el.hasClass('medium-editor-placeholder-relative');

            this.$el.removeClass('medium-insert-buttons-active');

            if (hasPlaceholder) {
                this.$el.focus();
            }

            var coachmarkId = this.options.helpCoachmarksOptions.elements.showButtonElement.id;
            var $currentCoachmarkElement = $el.find(`.medium-insert-buttons .medium-insert-help-coachmark[data-id="${coachmarkId}"]`);
            this.removeHelpCoachmark(coachmarkId, $currentCoachmarkElement);
        }
    };

    /**
     * Position buttons
     *
     * @param {string} activeAddon - Name of active addon
     * @return {void}
     */

    Core.prototype.positionButtons = function (activeAddon) {
        var $buttons = this.$el.find('.medium-insert-buttons'),
            $p = this.$el.find('.medium-insert-active'),
            $lastCaption = $p.hasClass('medium-insert-images-grid') ? [] : $p.find('figure:last figcaption'),
            elementsContainer = this.getEditor() ? this.getEditor().options.elementsContainer : $('body').get(0),
            elementsContainerAbsolute = ['absolute', 'fixed'].indexOf(window.getComputedStyle(elementsContainer).getPropertyValue('position')) > -1,
            position = {};

        if ($p.length) {
            position.top = $p.position().top;

            if (activeAddon) {
                position.top += $p.height() - 20 + ($lastCaption.length ? -$lastCaption.height() - parseInt($lastCaption.css('margin-top'), 10) : 10);
            } else {
                position.top += parseInt($p.css('margin-top'), 10);
            }

            if (elementsContainerAbsolute) {
                position.top += elementsContainer.scrollTop;
            }

            $buttons.css(position);
        }
    };

    /**
     * Toggles addons buttons
     *
     * @return {void}
     */

    Core.prototype.toggleAddons = function () {
        if (this.$el.find('.medium-insert-buttons').attr('data-active-addon') === 'images') {
            this.$el.find('.medium-insert-buttons').find('button[data-addon="images"]').click();
            return;
        }

        this.$el.find('.medium-insert-buttons-addons').fadeToggle();
        this.$el.find('.medium-insert-buttons-show').toggleClass('medium-insert-buttons-rotate');

        if (this.$el) {
            var addonsBlockIsOpen = this.$el.find('.medium-insert-buttons-show').hasClass('medium-insert-buttons-rotate');
            var hasPlaceholder = this.$el.hasClass('medium-editor-placeholder') || this.$el.hasClass('medium-editor-placeholder-relative');

            if (addonsBlockIsOpen) {
                if (!this.$el.hasClass('medium-insert-buttons-active')) {
                    this.$el.addClass('medium-insert-buttons-active');
                }

                if (hasPlaceholder) {
                    this.$el.blur();
                }
            } else {
                this.$el.removeClass('medium-insert-buttons-active');

                if (hasPlaceholder) {
                    this.$el.focus();
                }
            }
        }
    };

    /**
     * Hide addons buttons
     *
     * @return {void}
     */

    Core.prototype.hideAddons = function () {
        this.$el.find('.medium-insert-buttons-addons').hide();
        this.$el.find('.medium-insert-buttons-show').removeClass('medium-insert-buttons-rotate');

        if (this.$el) {
            var hasPlaceholder = this.$el.hasClass('medium-editor-placeholder') || this.$el.hasClass('medium-editor-placeholder-relative');

            this.$el.removeClass('medium-insert-buttons-active');

            if (hasPlaceholder) {
                this.$el.focus();
            }
        }
    };

    /**
     * Call addon's action
     *
     * @param {Event} e
     * @return {void}
     */

    Core.prototype.addonAction = function (e) {
        var $a = $(e.currentTarget),
            addon = $a.data('addon'),
            action = $a.data('action');

        this.$el.data('plugin_' + pluginName + ucfirst(addon))[action]();
    };

    /**
     * Move caret at the beginning of the empty paragraph
     *
     * @param {jQuery} $el Element where to place the caret
     * @param {integer} position Position where to move caret. Default: 0
     *
     * @return {void}
     */

    Core.prototype.moveCaret = function ($el, position) {
        var range, sel, el, textEl;

        position = position || 0;
        range = document.createRange();
        sel = window.getSelection();
        el = $el.get(0);

        if (!el.childNodes.length) {
            textEl = document.createTextNode(' ');
            el.appendChild(textEl);
        }

        range.setStart(el.childNodes[0], position);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    /**
     * Add caption
     *
     * @param {jQuery Element} $el
     * @param {string} placeholder
     * @return {void}
     */

    Core.prototype.addCaption = function ($el, placeholder) {
        var $caption = $el.find('figcaption');

        if ($caption.length === 0) {
            $el.append(this.templates['src/js/templates/core-caption.hbs']({
                placeholder: placeholder
            }));
        }
    };

    /**
     * Remove captions
     *
     * @param {jQuery Element} $ignore
     * @return {void}
     */

    Core.prototype.removeCaptions = function ($ignore) {
        var $captions = this.$el.find('figcaption');

        if ($ignore) {
            $captions = $captions.not($ignore);
        }

        $captions.each(function () {
            if ($(this).hasClass('medium-insert-caption-placeholder') || $(this).text().trim() === '') {
                $(this).remove();
            }
        });
    };

    /**
     * Remove caption placeholder
     *
     * @param {jQuery Element} $el
     * @return {void}
     */

    Core.prototype.removeCaptionPlaceholder = function ($el) {
        var $caption = $el.is('figcaption') ? $el : $el.find('figcaption');

        if ($caption.length) {
            $caption
                .removeClass('medium-insert-caption-placeholder')
                .removeAttr('data-placeholder');
        }
    };

    /**
     * Checks Image/Embed caption behavior
     * @param e
     * @returns {boolean}
     */
    Core.prototype.checkCaptionBehavior = function (e) {
        var $el = $(e.target);

        if (Util.isKey(e, Util.keyCode.ENTER)) {
            var $wrapper = $el.closest('.medium-insert-images, .medium-insert-embeds');

            if (!$wrapper.length) {
                return false;
            }

            if ($wrapper.next().is('p')) {
                this.moveCaret($wrapper.next());
            } else {
                $wrapper.after('<p><br></p>');
                this.moveCaret($wrapper.next());
            }

            this.triggerInput();

            return false;
        }
    };

    /**
     * Shows Action button tooltip
     * @param e
     */
    Core.prototype.hoverInInsertActionButton = function (e) {
        var $el = $(e.target).closest('.medium-insert-action');
        var tooltipClass = 'medium-insert-action-tooltip';

        if (!$el.find(`.${tooltipClass}`).length) {
            $el.append(`<div class="${tooltipClass}">${$el.attr('data-tooltip-title')}</div>`);
        }
    };

    /**
     * Hides Action button tooltip
     * @param e
     */
    Core.prototype.hoverOutInsertActionButton = function (e) {
        var $el = $(e.target).closest('.medium-insert-action');
        var tooltipClass = 'medium-insert-action-tooltip';

        if ($el.find(`.${tooltipClass}`).length) {
            $el.find(`.${tooltipClass}`).remove();
        }
    };

    /**
     * Appends Coachmark to certain element
     * @param coachmarkElementData
     * @param $wrapper
     * @returns {boolean}
     */
    Core.prototype.addHelpCoachmark = function (coachmarkElementData, $wrapper, doReposition = false) {
        var that = this;
        var coachmarksOptions = this.options.helpCoachmarksOptions;
        var coachmarkHelpers = coachmarksOptions.helpers;
        var coachmarkId = coachmarkElementData.id;

        if ($wrapper.length === 0 || !coachmarkHelpers) {
            return false;
        }

        var currentCoachmarkElementSelector = `.medium-insert-help-coachmark[data-id="${coachmarkId}"]`;

        // If coachmark id for certain wrapper element doesn't exist in local store then adds it
        if (!coachmarkHelpers.checkOnExistence(coachmarkId) && $wrapper.find(currentCoachmarkElementSelector).length === 0) {
            $wrapper.append(this.templates['src/js/templates/coachmark-block.hbs']({
                id: coachmarkId,
                title: coachmarkElementData.title,
                content: coachmarkElementData.content,
                buttonText: coachmarkElementData.buttonText,
            }));

            if (doReposition) {
                this.repositionHelpCoachmark($wrapper.find(currentCoachmarkElementSelector));
            }

            $wrapper.find(currentCoachmarkElementSelector).fadeIn(500);

            $wrapper.on('click', `.medium-insert-help-coachmark[data-id="${coachmarkId}"] button`, function () {
                that.removeHelpCoachmark(coachmarkId, $wrapper.find(currentCoachmarkElementSelector));
            });
        }
    };

    /**
     * Removes Coachmark from certain element (+ adds its ID to local store)
     * @param $wrapper
     */
    Core.prototype.removeHelpCoachmark = function (id, $currentCoachmarkElement) {
        var coachmarksOptions = this.options.helpCoachmarksOptions;
        var coachmarkHelpers = coachmarksOptions.helpers;

        if ($currentCoachmarkElement.length !== 0) {
            $currentCoachmarkElement.fadeOut(500, function () {
                $(this).remove();

                if (!coachmarkHelpers.checkOnExistence(id)) {
                    coachmarkHelpers.addCoachMarkId(id);
                }
            });
        }
    };

    /**
     * Checks whether to add or remove Coachmark to Editor's content element
     * @param e
     */
    Core.prototype.checkEditorToolbarCoachmark = function(e) {
        if (this.$el) {
            var editorPureText = this.$el.find('p, h2, h3, blockquote').not($('.medium-insert-embeds > p')).text().trim();
            var coachmarkElementData = this.options.helpCoachmarksOptions.elements.editorElement;
            var coachmarkId = coachmarkElementData.id;
            var currentCoachmarkElementSelector = `.medium-insert-help-coachmark[data-id="${coachmarkId}"]`;

            if (Util.isKey(e, Util.keyCode.ENTER)) {
                this.removeHelpCoachmark(coachmarkId, this.$el.find(currentCoachmarkElementSelector));
                return;
            }

            // Processes Coachmark functionality
            if (editorPureText.length > 20 && editorPureText.length < 30) {
                this.addHelpCoachmark(coachmarkElementData, this.$el, true);
            } else {
                this.removeHelpCoachmark(coachmarkId, this.$el.find(currentCoachmarkElementSelector));
            }
        }
    };

    /**
     * Repositions Coachmark element
     */
    Core.prototype.repositionHelpCoachmark = function ($currentCoachmarkElement) {
        var $el,
            selection = window.getSelection(),
            that = this,
            elementsContainer = this.getEditor() ? this.getEditor().options.elementsContainer : $('body').get(0),
            elementsContainerAbsolute = (['absolute', 'fixed'].indexOf(window.getComputedStyle(elementsContainer).getPropertyValue('position'))) > -1,
            position = {},
            range, $current, $el;

        if (!selection || selection.rangeCount === 0) {
            $current = this.$el;
        } else {
            range = selection.getRangeAt(0);
            $current = $(range.commonAncestorContainer);
        }

        $el = $current.closest('p, h2, h3, blockquote');

        if ($el) {
            position.left = 0;
            position.top = $el.position().top + $el.height() + parseInt($el.css('margin-top'), 10) + 16;

            if (elementsContainerAbsolute) {
                position.top += elementsContainer.scrollTop;
            }

            $currentCoachmarkElement.css(position);
        }
    };

    /**
     * Checks whether the content length is more than limit.
     * @param e
     */
    Core.prototype.checkEditorContentMaxSize = function (e) {
        var maxBodySizeLimitData = this.options.maxBodySizeLimitData;
        var limitLength = maxBodySizeLimitData.value;
        var maxBodySizeCallback = maxBodySizeLimitData.callback;
        var contentCurrentLength = this.$el.attr('data-medium-editor-length');

        if (contentCurrentLength > limitLength) {
            if (!this.$el.attr('data-medium-editor-is-disabled')) {
                this.$el.attr('data-medium-editor-is-disabled', true);
            }

            if (this.$el.find('.medium-insert-image-active').length !== 0
                || this.$el.find('.medium-insert-embeds-selected').length !== 0)
            {
                var $firstBlock = this.$el.find('p').first();

                if ($firstBlock.length !== 0) {
                    $firstBlock.click();
                }
            }

            maxBodySizeCallback();
        } else {
            if (this.$el.attr('data-medium-editor-is-disabled')) {
                this.$el.removeAttr('data-medium-editor-is-disabled');
            }
        }
    }

    /**
     * Moves active media block (image or embed object) to the next line when `ENTER` key is pressed
     * @param e
     */
    Core.prototype.moveMediaBlockToNextLine = function (e) {
        var $parentEl,
            $selectedEl = this.$el.find('.medium-insert-image-active, .medium-insert-embeds-selected');

        if ($selectedEl.length !== 0 && Util.isKey(e, Util.keyCode.ENTER)) {

            e.preventDefault();

            $selectedEl = $selectedEl.eq(0);
            $parentEl = $selectedEl.closest('.medium-insert-images, .medium-insert-embeds');

            $parentEl.before('<p> <br></p>');

            this.moveCaret($parentEl.prev());
            $parentEl.prev().click();
            this.triggerInput();

            return;
        }
    };

    /**
     * Handles line deleting process, checking the neighboring media elements
     * @param e
     */
    Core.prototype.checkMediaBlockWhileLineRemoving = function (e) {
        var $prevEl,
            $nextEl,
            $mediaEls,
            that = this,
            handleDeletingFunc,
            $currentEl = $(Selection.getSelectionStart(document));

        if ($currentEl.length !== 0 && Util.isKey(e, Util.keyCode.BACKSPACE)) {
            $currentEl = $(Selection.getSelectionStart(document));

            if (!$currentEl.is('p, h2, h3, blockquote')) {
                $currentEl = $currentEl.closest('p, h2, h3, blockquote');
            }

            $prevEl = $currentEl.prev('.medium-insert-images, .medium-insert-embeds');
            $nextEl = $currentEl.next('.medium-insert-images, .medium-insert-embeds');

            handleDeletingFunc = function ($targetMediaEl) {
                $currentEl.remove();
                e.preventDefault();
                e.stopPropagation();

                that.$el.blur();

                $mediaEls = $targetMediaEl.find('img, .medium-insert-embeds-overlay');

                if ($mediaEls.length !== 0) {
                    $mediaEls.eq(0).click();
                }

                that.triggerInput();
            };

            if ($prevEl.length !== 0 && $currentEl.text().trim() === '') {
                handleDeletingFunc($prevEl);
                return;
            }

            if ($currentEl.is(':first-child') && $nextEl.length !== 0 && $currentEl.text().trim() === '') {
                handleDeletingFunc($nextEl);
                return;
            }
        }
    };

    /**
     * Async delay helper
     *
     * @param {number} time
     * @return {Promise}
     */
    Core.prototype._delayAsync = function (time = 1) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, time);
        });
    };

    /** Plugin initialization */

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            var that = this,
                textareaId;

            if ($(that).is('textarea')) {
                textareaId = $(that).attr('medium-editor-textarea-id');
                that = $(that).siblings('[medium-editor-textarea-id="' + textareaId + '"]').get(0);
            }

            if (!$.data(that, 'plugin_' + pluginName)) {
                // Plugin initialization
                $.data(that, 'plugin_' + pluginName, new Core(that, options));
                $.data(that, 'plugin_' + pluginName).init();
            } else if (typeof options === 'string' && $.data(that, 'plugin_' + pluginName)[options]) {
                // Method call
                $.data(that, 'plugin_' + pluginName)[options]();
            }
        });
    };

})(jQuery, window, document, MediumEditor.util, MediumEditor.selection);

function getCommonEmbedsAddon(pluginName, addonName, $, window, document) {
    pluginName = pluginName || 'mediumInsert';

    var commonOptions = {
        label: '<span></span>',
        tooltipTitle: '',
        placeholder: 'Paste a link to embed content from another site (e.g. Twitter), and press Enter',
        oembedProxy: 'http://medium.iframe.ly/api/oembed?iframe=1',
        allowedDomains: [],
        captions: true,
        captionPlaceholder: 'Type caption (optional)',
        storeMeta: false,
        styles: {
            wide: {
                label: '<span class="fa fa-align-justify"></span>'
                // added: function ($el) {},
                // removed: function ($el) {}
            },
            left: {
                label: '<span class="fa fa-align-left"></span>'
                // added: function ($el) {},
                // removed: function ($el) {}
            },
            right: {
                label: '<span class="fa fa-align-right"></span>'
                // added: function ($el) {},
                // removed: function ($el) {}
            }
        },
        actions: {
            remove: {
                label: '<span class="fa fa-times"></span>',
                clicked: function () {
                    var $event = $.Event('keydown');

                    $event.which = 8;
                    $(document).trigger($event);
                }
            }
        },
        parseOnPaste: false
    };

    /**
     * CommonEmbedsAddon object
     *
     * Sets options, variables and calls init() function
     *
     * @constructor
     * @param {DOM} el - DOM element to init the plugin on
     * @param {object} options - Options to override common ones
     * @return {void}
     */
    function CommonEmbedsAddon(el, options) {
        this.el = el;
        this.$el = $(el);
        this.templates = window.MediumInsert.Templates;
        this.core = this.$el.data('plugin_' + pluginName);

        this.options = $.extend(true, {}, commonOptions, options);

        this._name = pluginName;

        // Extend editor's functions
        if (this.core.getEditor() && !this.core.getEditor()._serializePreEmbeds) {
            this.core.getEditor()._serializePreEmbeds = this.core.getEditor().serialize;
            this.core.getEditor().serialize = this.editorSerialize;
        }

        this.init();
    }

    /**
     * Initialization
     *
     * @return {void}
     */

    CommonEmbedsAddon.prototype.init = function () {
        var $embeds = this.$el.find('.medium-insert-embeds');

        $embeds.attr('contenteditable', false);
        $embeds.find('figcaption').attr('contenteditable', true);
        $embeds.find('figure').attr('contenteditable', false);

        $embeds.each(function () {
            if ($(this).find('.medium-insert-embeds-overlay').length === 0) {
                $(this).append($('<div />').addClass('medium-insert-embeds-overlay'));
            }
        });

        this.checkEditorPlaceholderVisibility();
        this.events();
        this.backwardsCompatibility();
    };

    /**
     * Event listeners
     *
     * @return {void}
     */

    CommonEmbedsAddon.prototype.events = function () {
        $(document)
            .on('click', $.proxy(this, 'unselectEmbed'))
            .on('keydown', $.proxy(this, 'removeEmbed'))
            .on('click', '.medium-insert-embeds-toolbar .medium-editor-action', $.proxy(this, 'toolbarAction'))
            .on('click', '.medium-insert-embeds-toolbar2 .medium-editor-action', $.proxy(this, 'toolbar2Action'));

        this.$el
            .on('keyup click paste', $.proxy(this, 'togglePlaceholder'))
            .on('keydown', $.proxy(this, 'processLink'))
            .on('click', '.medium-insert-embeds-overlay', $.proxy(this, 'selectEmbed'))
            .on('contextmenu', '.medium-insert-embeds-placeholder', $.proxy(this, 'fixRightClickOnPlaceholder'));

        $(window)
            .on('resize', $.proxy(this, 'autoRepositionToolbars'));
    };

    /**
     * Replace v0.* class names with new ones, wrap embedded content to new structure
     *
     * @return {void}
     */

    CommonEmbedsAddon.prototype.backwardsCompatibility = function () {
        var that = this;

        this.$el.find('.mediumInsert-embeds')
            .removeClass('mediumInsert-embeds')
            .addClass('medium-insert-embeds');

        this.$el.find('.medium-insert-embeds').each(function () {
            if ($(this).find('.medium-insert-embed').length === 0) {
                $(this).after(that.templates['src/js/templates/embeds-wrapper.hbs']({
                    html: $(this).html()
                }));
                $(this).remove();
            }
        });
    };

    /**
     * Checks whether editor has visible placeholder,
     * even despite the fact that it already contains embed objects (medium editor bug).
     * If true - then removes this placeholder
     */
    CommonEmbedsAddon.prototype.checkEditorPlaceholderVisibility = function () {
        var $embeds = this.$el.find('.medium-insert-embeds');
        var $editor = $('.medium-editor-element');

        if ($embeds.length !== 0 && $editor.hasClass('medium-editor-placeholder')) {
            $editor.removeClass('medium-editor-placeholder');
        }
    };

    /**
     * Extend editor's serialize function
     *
     * @return {object} Serialized data
     */

    CommonEmbedsAddon.prototype.editorSerialize = function () {
        var data = this._serializePreEmbeds();

        $.each(data, function (key) {
            var $data = $('<div />').html(data[key].value),
                $embeds = $data.find('.medium-insert-embeds');

            $embeds.removeAttr('contenteditable');
            $embeds.find('figcaption').removeAttr('contenteditable');
            $data.find('.medium-insert-embeds-overlay').remove();
            $data.find('.medium-insert-embeds-input').remove();
            $embeds.find('.medium-insert-embed').empty();
            $data.find('.medium-insert-embeds-selected').removeClass('medium-insert-embeds-selected');

            data[key].value = $data.html();
        });

        return data;
    };

    /**
     * Add embedded element
     *
     * @return {void}
     */

    CommonEmbedsAddon.prototype.add = function () {
        var $place = this.$el.find('.medium-insert-active');

        // Fix #132
        // Make sure that the content of the paragraph is empty and <br> is wrapped in <p></p> to avoid Firefox problems
        $place.html(this.templates['src/js/templates/core-empty-line.hbs']().trim());

        // Replace paragraph with div to prevent #124 issue with pasting in Chrome,
        // because medium editor wraps inserted content into paragraph and paragraphs can't be nested
        if ($place.is('p')) {
            $place.replaceWith('<div class="medium-insert-active">' + $place.html() + '</div>');
            $place = this.$el.find('.medium-insert-active');
            this.core.moveCaret($place);
        }

        $place.addClass('medium-insert-embeds medium-insert-embeds-input medium-insert-embeds-active');

        this.togglePlaceholder({ target: $place.get(0) });

        $place.click();
        this.core.hideButtons();
    };

    /**
     * Toggles placeholder
     *
     * @param {Event} e
     * @return {void}
     */

    CommonEmbedsAddon.prototype.togglePlaceholder = function (e) {
        var $place = $(e.target),
            selection = window.getSelection(),
            range, $current, text;

        if (!selection || selection.rangeCount === 0) {
            return;
        }

        range = selection.getRangeAt(0);
        $current = $(range.commonAncestorContainer);

        if ($current.hasClass('medium-insert-embeds-active')) {
            $place = $current;
        } else if ($current.closest('.medium-insert-embeds-active').length) {
            $place = $current.closest('.medium-insert-embeds-active');
        }

        if ($place.hasClass('medium-insert-embeds-active')) {

            text = $place.text().trim();

            if (text === '' && $place.hasClass('medium-insert-embeds-placeholder') === false) {
                $place
                    .addClass('medium-insert-embeds-placeholder')
                    .attr('data-placeholder', this.options.placeholder);
            } else if (text !== '' && $place.hasClass('medium-insert-embeds-placeholder')) {
                $place
                    .removeClass('medium-insert-embeds-placeholder')
                    .removeAttr('data-placeholder');
            }

        } else {
            this.$el.find('.medium-insert-embeds-active').remove();
        }
    };

    /**
     * Right click on placeholder in Chrome selects whole line. Fix this by placing caret at the end of line
     *
     * @param {Event} e
     * @return {void}
     */

    CommonEmbedsAddon.prototype.fixRightClickOnPlaceholder = function (e) {
        this.core.moveCaret($(e.target));
    };

    /**
     * Process link
     *
     * @param {Event} e
     * @return {void}
     */

    CommonEmbedsAddon.prototype.processLink = function (e) {
        var $place = this.$el.find('.medium-insert-embeds-active'),
            url;

        if (!$place.length) {
            return;
        }

        url = $place.text().trim();

        // Return empty placeholder on backspace, delete or enter
        if (url === '' && [8, 46, 13].indexOf(e.which) !== -1) {
            $place.remove();
            return;
        }

        if (e.which === 13) {
            e.preventDefault();
            e.stopPropagation();

            if (this.options.oembedProxy) {
                this.oembed(url);
            } else {
                this.parseUrl(url);
            }
        }
    };

    /**
     * Get HTML via oEmbed proxy
     *
     * @param {string} url
     * @return {void}
     */

    CommonEmbedsAddon.prototype.oembed = function (url, pasted) {
        var that = this;

        $.support.cors = true;

        var allowedDomains = this.options.allowedDomains;

        if (allowedDomains && allowedDomains.length !== 0) {
            var regExpStr = '^(http(s)?:\\/\\/)?(www\\.)?(' + (allowedDomains.join('|') + ')');

            if (!(new RegExp(regExpStr).test(url))) {
                $.proxy(this, 'convertBadEmbed', url)();
                return false;
            }
        }

        $.ajax({
            crossDomain: true,
            cache: false,
            url: this.options.oembedProxy,
            dataType: 'json',
            data: {
                url: url
            },
            success: function (data) {
                var html = data && data.html;

                if (that.options.storeMeta) {
                    html += '<div class="medium-insert-embeds-meta"><script type="text/json">' + JSON.stringify(data) + '</script></div>';
                }

                if (data && !html && data.type === 'photo' && data.url) {
                    html = '<img src="' + data.url + '" alt="">';
                }

                if (!html) {
                    // Prevent render empty embed.
                    $.proxy(that, 'convertBadEmbed', url)();
                    return;
                }

                $.proxy(that, 'embed', html, url)();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var responseJSON = (function () {
                    try {
                        return JSON.parse(jqXHR.responseText);
                    } catch (e) { }
                })();

                if (typeof window.console !== 'undefined') {
                    window.console.log((responseJSON && responseJSON.error) || jqXHR.status || errorThrown.message);
                } else {
                    window.alert('Error requesting media from ' + that.options.oembedProxy + ' to insert: ' + errorThrown + ' (response status: ' + jqXHR.status + ')');
                }

                $.proxy(that, 'convertBadEmbed', url)();
            }
        });
    };

    /**
     * Get HTML using regexp
     *
     * @param {string} url
     * @param {bool} pasted
     * @return {void}
     */

    CommonEmbedsAddon.prototype.parseUrl = function (url, pasted) {
        var html;

        if (!(new RegExp(['youtube', 'youtu.be', 'vimeo', 'instagram', 'twitter', 'facebook'].join('|')).test(url))) {
            $.proxy(this, 'convertBadEmbed', url)();
            return false;
        }

        html = url.replace(/\n?/g, '')
            .replace(/^((http(s)?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|v\/)?)([a-zA-Z0-9\-_]+)(.*)?$/, '<div class="video video-youtube"><iframe width="420" height="315" src="//www.youtube.com/embed/$7" frameborder="0" allowfullscreen></iframe></div>')
            .replace(/^https?:\/\/vimeo\.com(\/.+)?\/([0-9]+)$/, '<div class="video video-vimeo"><iframe src="//player.vimeo.com/video/$2" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>')
            .replace(/^https:\/\/twitter\.com\/(\w+)\/status\/(\d+)\/?$/, '<blockquote class="twitter-tweet" align="center" lang="en"><a href="https://twitter.com/$1/statuses/$2"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>')
            .replace(/^(https:\/\/www\.facebook\.com\/(.*))$/, '<script src="//connect.facebook.net/en_US/sdk.js#xfbml=1&amp;version=v2.2" async></script><div class="fb-post" data-href="$1"><div class="fb-xfbml-parse-ignore"><a href="$1">Loading Facebook post...</a></div></div>')
            .replace(/^https?:\/\/instagram\.com\/p\/(.+)\/?$/, '<span class="instagram"><iframe src="//instagram.com/p/$1/embed/" width="612" height="710" frameborder="0" scrolling="no" allowtransparency="true"></iframe></span>');

        if (this.options.storeMeta) {
            html += '<div class="medium-insert-embeds-meta"><script type="text/json">' + JSON.stringify({}) + '</script></div>';
        }

        if ((/<("[^"]*"|'[^']*'|[^'">])*>/).test(html) === false) {
            $.proxy(this, 'convertBadEmbed', url)();
            return false;
        }

        if (pasted) {
            this.embed(html, url);
        } else {
            this.embed(html);
        }
    };

    /**
     * Add html to page
     *
     * @param {string} html
     * @param {string} pastedUrl
     * @return {void}
     */

    CommonEmbedsAddon.prototype.embed = function (html, pastedUrl) {
        var $place = this.$el.find('.medium-insert-embeds-active'),
            $div;

        if (!html) {
            alert('Incorrect URL format specified');
            return false;
        } else {

            $place.after(this.templates['src/js/templates/embeds-wrapper.hbs']({
                html: html,
                url: pastedUrl
            }));
            $place.remove();

            if ($('.medium-insert-embeds-added').is(':first-child')) { // add empty paragraph before media block wrapper if it's a first chils in content
                $('.medium-insert-embeds-added').before('<p><br></p>');
            }

            $('.medium-insert-embeds-added').find('.medium-insert-embeds-overlay').trigger('click');
            $('.medium-insert-embeds-added').removeClass('medium-insert-embeds-added');

            this.core.triggerInput();

            if (html.indexOf('facebook') !== -1) {
                if (typeof (FB) !== 'undefined') {
                    setTimeout(function () {
                        FB.XFBML.parse();
                    }, 2000);
                }
            }
        }
    };

    /**
     * Convert bad oEmbed content to an actual line.
     * Instead of displaying the error message we convert the bad embed
     *
     * @param {string} content Bad content
     *
     * @return {void}
     */
    CommonEmbedsAddon.prototype.convertBadEmbed = function (content) {
        var $place, $empty, $content,
            emptyTemplate = this.templates['src/js/templates/core-empty-line.hbs']().trim();

        $place = this.$el.find('.medium-insert-embeds-active');

        // convert embed node to an empty node and insert the bad embed inside
        $content = $(emptyTemplate);
        $place.before($content);
        $place.remove();
        $content.text(content);

        // add an new empty node right after to simulate Enter press
        $empty = $(emptyTemplate);
        $content.after($empty);

        this.core.triggerInput();

        this.core.moveCaret($empty);
    };

    /**
     * Select clicked embed
     *
     * @param {Event} e
     * @returns {void}
     */

    CommonEmbedsAddon.prototype.selectEmbed = function (e) {
        var that = this,
            $embed;
        if (this.core.options.enabled) {
            if (this.$el.attr('data-medium-editor-is-disabled')) {
                return;
            }

            $embed = $(e.target).hasClass('medium-insert-embeds') ? $(e.target) : $(e.target).closest('.medium-insert-embeds');

            $embed.addClass('medium-insert-embeds-selected');

            setTimeout(function () {
                that.addToolbar();

                if (that.options.captions) {
                    that.core.addCaption($embed.find('figure'), that.options.captionPlaceholder);
                }
            }, 50);
        }
    };

    /**
     * Unselect selected embed
     *
     * @param {Event} e
     * @returns {void}
     */

    CommonEmbedsAddon.prototype.unselectEmbed = function (e) {
        var $el = $(e.target).hasClass('medium-insert-embeds') ? $(e.target) : $(e.target).closest('.medium-insert-embeds'),
            $embed = this.$el.find('.medium-insert-embeds-selected');

        if ($(e.target).closest('.medium-editor-action').length !== 0) {
            return false;
        }

        if ($el.hasClass('medium-insert-embeds-selected')) {
            $embed.not($el).removeClass('medium-insert-embeds-selected');
            $('.medium-insert-embeds-toolbar, .medium-insert-embeds-toolbar2').remove();
            this.core.removeCaptions($el.find('figcaption'));

            if ($(e.target).is('.medium-insert-caption-placeholder') || $(e.target).is('figcaption')) {
                $el.removeClass('medium-insert-embeds-selected');
                this.core.removeCaptionPlaceholder($el.find('figure'));
            }
            return;
        }

        $embed.removeClass('medium-insert-embeds-selected');
        $('.medium-insert-embeds-toolbar, .medium-insert-embeds-toolbar2').remove();

        if ($(e.target).is('.medium-insert-caption-placeholder')) {
            this.core.removeCaptionPlaceholder($el.find('figure'));
        } else if ($(e.target).is('figcaption') === false) {
            this.core.removeCaptions();
        }
    };

    /**
     * Remove embed
     *
     * @param {Event} e
     * @returns {void}
     */

    CommonEmbedsAddon.prototype.removeEmbed = function (e) {
        var $embed, $empty;

        if (e.which === 8 || e.which === 46) {
            $embed = this.$el.find('.medium-insert-embeds-selected');

            if ($embed.length) {
                e.preventDefault();

                $('.medium-insert-embeds-toolbar, .medium-insert-embeds-toolbar2').remove();

                $empty = $(this.templates['src/js/templates/core-empty-line.hbs']().trim());
                $embed.after($empty);
                $embed.remove();

                // Hide addons
                this.core.hideAddons();

                this.core.moveCaret($empty);
                this.core.triggerInput();
            }
        }
    };

    /**
     * Adds embed toolbar to editor
     *
     * @returns {void}
     */

    CommonEmbedsAddon.prototype.addToolbar = function () {
        var $embed = this.$el.find('.medium-insert-embeds-selected'),
            active = false,
            $toolbar, $toolbar2, mediumEditor, toolbarContainer;

        if ($embed.length === 0) {
            return;
        }

        mediumEditor = this.core.getEditor();
        toolbarContainer = mediumEditor.options.elementsContainer || 'body';

        $(toolbarContainer).append(this.templates['src/js/templates/embeds-toolbar.hbs']({
            styles: this.options.styles,
            actions: this.options.actions
        }).trim());

        $toolbar = $('.medium-insert-embeds-toolbar');
        $toolbar2 = $('.medium-insert-embeds-toolbar2');

        $toolbar.find('button').each(function () {
            if ($embed.hasClass('medium-insert-embeds-' + $(this).data('action'))) {
                $(this).addClass('medium-editor-button-active');
                active = true;
            }
        });

        if (active === false) {
            $toolbar.find('button').first().addClass('medium-editor-button-active');
        }

        this.repositionToolbars();
        $toolbar.fadeIn();
        $toolbar2.fadeIn();
    };

    CommonEmbedsAddon.prototype.autoRepositionToolbars = function () {
        setTimeout(function () {
            this.repositionToolbars();
            this.repositionToolbars();
        }.bind(this), 0);
    };

    CommonEmbedsAddon.prototype.repositionToolbars = function () {
        var $toolbar = $('.medium-insert-embeds-toolbar'),
            $toolbar2 = $('.medium-insert-embeds-toolbar2'),
            $embed = this.$el.find('.medium-insert-embeds-selected'),
            elementsContainer = this.core.getEditor().options.elementsContainer,
            elementsContainerAbsolute = ['absolute', 'fixed'].indexOf(window.getComputedStyle(elementsContainer).getPropertyValue('position')) > -1,
            elementsContainerBoundary = elementsContainerAbsolute ? elementsContainer.getBoundingClientRect() : null,
            containerWidth = $(window).width(),
            position = {},
            position2 = {};

        if ($toolbar2.length) {
            if (elementsContainerAbsolute) {
                position2.top += elementsContainer.scrollTop - elementsContainerBoundary.top;
                position2.left -= elementsContainerBoundary.left;
                containerWidth = $(elementsContainer).width();
            } else {
                if ($embed.length) {
                    position2.top = $embed.offset().top + 2; // 2px - distance from a border
                    position2.left = $embed.offset().left + $embed.width() - $toolbar2.width() - 4; // 4px - distance from a border
                }
            }

            if (Object.keys(position2).length !== 0) {
                if (position2.left + $toolbar2.width() > containerWidth) {
                    position2.left = containerWidth - $toolbar2.width();
                }

                $toolbar2.css(position2);
            }
        }

        if ($toolbar.length) {
            if (elementsContainerAbsolute) {
                position.top += elementsContainer.scrollTop - elementsContainerBoundary.top;
                position.left -= elementsContainerBoundary.left;
            } else {
                if ($embed.length) {
                    position.left = $embed.offset().left + $embed.width() / 2 - $toolbar.width() / 2;
                    position.top = $embed.offset().top - $toolbar.height() - 8 - 2 - 5; // 8px - hight of an arrow under toolbar, 2px - height of an embed outset, 5px - distance from an embed
                }
            }

            if (Object.keys(position).length !== 0) {
                if (position.top < 0) {
                    position.top = 0;
                }

                $toolbar.css(position);
            }
        }
    };

    /**
     * Fires toolbar action
     *
     * @param {Event} e
     * @returns {void}
     */

    CommonEmbedsAddon.prototype.toolbarAction = function (e) {
        var $button = $(e.target).is('button') ? $(e.target) : $(e.target).closest('button'),
            $li = $button.closest('li'),
            $ul = $li.closest('ul'),
            $lis = $ul.find('li'),
            $embed = this.$el.find('.medium-insert-embeds-selected'),
            that = this;

        $button.addClass('medium-editor-button-active');
        $li.siblings().find('.medium-editor-button-active').removeClass('medium-editor-button-active');

        $lis.find('button').each(function () {
            var className = 'medium-insert-embeds-' + $(this).data('action');

            if ($(this).hasClass('medium-editor-button-active')) {
                $embed.addClass(className);

                if (that.options.styles[$(this).data('action')].added) {
                    that.options.styles[$(this).data('action')].added($embed);
                }
            } else {
                $embed.removeClass(className);

                if (that.options.styles[$(this).data('action')].removed) {
                    that.options.styles[$(this).data('action')].removed($embed);
                }
            }
        });

        this.repositionToolbars();
        this.core.triggerInput();
    };

    /**
     * Fires toolbar2 action
     *
     * @param {Event} e
     * @returns {void}
     */

    CommonEmbedsAddon.prototype.toolbar2Action = function (e) {
        var $button = $(e.target).is('button') ? $(e.target) : $(e.target).closest('button'),
            callback = this.options.actions[$button.data('action')].clicked;

        if (callback) {
            callback(this.$el.find('.medium-insert-embeds-selected'));
        }

        this.core.triggerInput();
    };

    return CommonEmbedsAddon;
}
; (function ($, window, document, undefined) {

    'use strict';

    /** Default values */
    var pluginName = 'mediumInsert',
        addonName = 'Embeds'; // first char is uppercase

    /**
     * @constructor
     */
    var commonEmbedsAddon = getCommonEmbedsAddon(pluginName, addonName, $, window, document);

    /**
     * Embeds object
     * @inheritDoc
     */

    function Embeds(el, options) {
        commonEmbedsAddon.apply(this, arguments);
    }

    Embeds.prototype = Object.create(commonEmbedsAddon.prototype);
    Embeds.prototype.constructor = Embeds;


    /** Plugin initialization */

    $.fn[pluginName + addonName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName + addonName)) {
                $.data(this, 'plugin_' + pluginName + addonName, new Embeds(this, options));
            }
        });
    };

})(jQuery, window, document);

/*global MediumEditor*/

; (function ($, window, document, Util, undefined) {

    'use strict';

    /** Default values */
    var pluginName = 'mediumInsert',
        addonName = 'Images', // first char is uppercase
        defaults = {
            label: '<span class="fa fa-camera"></span>',
            tooltipTitle: '',
            deleteCustomCallback: function () {},
            fileDeleteOptions: {},
            // uploadCompleted: function () {},
            uploadCustomCallback: function () {},
            uploadData: {},
            // errorCustomCallback: function () {},
            generateMediaUniqueIdCallback: function () {}, // required
            getImageSuitableSizeCallback: function () {}, // required
            getUploadedImageCustomCallback: function () {}, // required
            imageDefaultSize: 800,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1024 * 1024, //bytes
            minImageSize: 200, // pixels
            captions: true,
            captionPlaceholder: 'Type caption for image (optional)',
            autoGrid: 3,
            styles: {
                wide: {
                    label: '<span class="fa fa-align-justify"></span>'
                    // added: function ($el) {},
                    // removed: function ($el) {}
                },
                left: {
                    label: '<span class="fa fa-align-left"></span>'
                    // added: function ($el) {},
                    // removed: function ($el) {}
                },
                right: {
                    label: '<span class="fa fa-align-right"></span>'
                    // added: function ($el) {},
                    // removed: function ($el) {}
                },
                grid: {
                    label: '<span class="fa fa-th"></span>'
                    // added: function ($el) {},
                    // removed: function ($el) {}
                }
            },
            actions: {
                remove: {
                    label: '<span class="fa fa-times"></span>',
                    clicked: function () {
                        var $event = $.Event('keydown');

                        $event.which = 8;
                        $(document).trigger($event);
                    }
                }
            },
            sorting: function () {
                var that = this;

                $('.medium-insert-images').sortable({
                    group: 'medium-insert-images',
                    containerSelector: '.medium-insert-images',
                    itemSelector: 'figure',
                    placeholder: '<figure class="placeholder">',
                    handle: 'img',
                    nested: false,
                    vertical: false,
                    afterMove: function () {
                        that.core.triggerInput();
                    }
                });
            },
            messages: {
                acceptFileTypesError: 'This file is not in a supported format: ',
                maxFileSizeError: 'This file is too big: ',
                uploadError: 'An error occurred while uploading image',
                minImageSizeError: 'Image is too small, min size is 200x200',
            },
        };

    /**
     * Images object
     *
     * Sets options, variables and calls init() function
     *
     * @constructor
     * @param {DOM} el - DOM element to init the plugin on
     * @param {object} options - Options to override defaults
     * @return {void}
     */

    function Images(el, options) {
        this.el = el;
        this.$el = $(el);
        this.$currentImage = null;
        this.templates = window.MediumInsert.Templates;
        this.core = this.$el.data('plugin_' + pluginName);

        this.options = $.extend(true, {}, defaults, options);
        this.imageAvailableSizesList = this.getImageAvailableSizesList();

        this._defaults = defaults;
        this._name = pluginName;

        // Extend editor's functions
        if (this.core.getEditor()) {
            this.core.getEditor()._serializePreImages = this.core.getEditor().serialize;
            this.core.getEditor().serialize = this.editorSerialize;
        }

        this.init();
    }

    /**
     * Initialization
     *
     * @return {void}
     */

    Images.prototype.init = function () {
        var $images = this.$el.find('.medium-insert-images');

        $images.attr('contenteditable', false);
        $images.find('figcaption').attr('contenteditable', true);
        $images.find('figure').attr('contenteditable', false);

        this.events();
        this.backwardsCompatibility();
        this.sorting();
    };

    /**
     * Event listeners
     *
     * @return {void}
     */

    Images.prototype.events = function () {
        $(document)
            .on('click', $.proxy(this, 'unselectImage'))
            .on('keydown', $.proxy(this, 'removeImage'))
            .on('click', '.medium-insert-images-toolbar .medium-editor-action', $.proxy(this, 'toolbarAction'))
            .on('click', '.medium-insert-images-toolbar2 .medium-editor-action', $.proxy(this, 'toolbar2Action'));

        this.$el
            .on('click', '.medium-insert-images img', $.proxy(this, 'selectImage'));

        $(window)
            .on('resize', $.proxy(this, 'autoRepositionToolbars'));
    };

    /**
     * Replace v0.* class names with new ones
     *
     * @return {void}
     */

    Images.prototype.backwardsCompatibility = function () {
        this.$el.find('.mediumInsert')
            .removeClass('mediumInsert')
            .addClass('medium-insert-images');

        this.$el.find('.medium-insert-images.small')
            .removeClass('small')
            .addClass('medium-insert-images-left');
    };

    /**
     * Extend editor's serialize function
     *
     * @return {object} Serialized data
     */

    Images.prototype.editorSerialize = function () {
        var data = this._serializePreImages();

        $.each(data, function (key) {
            var $data = $('<div />').html(data[key].value);

            $data.find('.medium-insert-images').find('figcaption, figure').removeAttr('contenteditable');
            $data.find('.medium-insert-images-progress').remove();
            $data.find('.medium-insert-image-active').removeClass('medium-insert-image-active');

            data[key].value = $data.html();
        });

        return data;
    };

    /**
     * Add image
     *
     * @return {void}
     */

    Images.prototype.add = function () {
        var that = this;
        var $file = $('<input/>')
            .attr('type', 'file')
            .attr('name', 'upload-new-image')
            .attr('accept', 'image/*')
            .attr('id', 'upload-new-image');

        var $fileNew = $file;

        $fileNew.on('change', function() {
            that.uploadAdd(this);
        });

        $fileNew.click();
    };

    /**
     * @param {object} data
     */

    Images.prototype.uploadAdd = function (data) {
        var $place = this.$el.find('.medium-insert-active'),
            that = this,
            uploadErrors = false,
            uploadErrorMessage = '',
            file = data.files[0],
            acceptFileTypes = this.options.acceptFileTypes,
            maxFileSize = this.options.maxFileSize,
            minImageSize = this.options.minImageSize,
            reader,
            mediaId = this.options.generateMediaUniqueIdCallback();

        if (acceptFileTypes && !acceptFileTypes.test(file.type)) {
            uploadErrors = true;
            uploadErrorMessage = this.options.messages.acceptFileTypesError;
        } else if (maxFileSize && file.size > maxFileSize) {
            uploadErrors = true;
            uploadErrorMessage = this.options.messages.maxFileSizeError;
        }

        this.core.hideButtons();

        if (uploadErrors) {
            this.processUploadAddError(uploadErrorMessage);
            return false;
        }

        reader = new FileReader();

        reader.onload = function (e) {
            var domImage = that.getDOMImage();
            var target = e.target.result;

            domImage.src = target;

            domImage.onload = function() {
                if (this.width < minImageSize || this.height < minImageSize) {
                    that.processUploadAddError(that.options.messages.minImageSizeError);
                    return false;
                }

                // Replace paragraph with div, because figure elements can't be inside paragraph
                if ($place.is('p')) {
                    $place.replaceWith('<div class="medium-insert-active">' + $place.html() + '</div>');
                    $place = that.$el.find('.medium-insert-active');

                    if ($place.next().is('p')) {
                        that.core.moveCaret($place.next());
                    } else {
                        if (!$place.next().is('.medium-insert-images, .medium-insert-embeds')) {
                            $place.after('<p><br></p>'); // add empty paragraph so we can move the caret to the next line.
                            that.core.moveCaret($place.next());
                        }
                    }

                    if ($place.is(':first-child')) { // add empty paragraph before media block wrapper if it's a first chils in content
                        $place.before('<p><br></p>');
                    }
                }

                data.mediaId = mediaId;

                $place.addClass('medium-insert-images');
                $place.attr('data-media-id', mediaId);

                $.proxy(that, 'showImage', target, data)();
            };
        };

        reader.readAsDataURL(data.files[0]);
    };

    /**
     * Calls error handler while checking the image, added for upload dialog
     * @param message
     * @returns {boolean}
     */
    Images.prototype.processUploadAddError = function (message) {
        var errorCustomCallback = this.options.errorCustomCallback;

        if (errorCustomCallback && typeof errorCustomCallback === "function") {
            errorCustomCallback(message);
            return false;
        }

        console.log('Upload errors (' + message + ')');
    };

    /**
     * Callback for global upload progress events
     * https://github.com/blueimp/jQuery-File-Upload/wiki/Options#progressall
     *
     * @param {Event} e
     * @param {object} data
     * @return {void}
     */

    /*Images.prototype.uploadProgressall = function (e, data) {
        var progress, $progressbar;

        if (this.options.preview === false) {
            progress = parseInt(data.loaded / data.total * 100, 10);
            $progressbar = this.$el.find('.medium-insert-active').find('progress');

            $progressbar
                .attr('value', progress)
                .text(progress);

            if (progress === 100) {
                $progressbar.remove();
            }
        }
    };*/

    /**
     * Callback for upload progress events.
     * https://github.com/blueimp/jQuery-File-Upload/wiki/Options#progress
     *
     * @param {Event} e
     * @param {object} data
     * @return {void}
     */

    /*Images.prototype.uploadProgress = function (e, data) {
        var progress, $progressbar;

        if (this.options.preview) {
            progress = 100 - parseInt(data.loaded / data.total * 100, 10);
            $progressbar = data.context.find('.medium-insert-images-progress');

            $progressbar.css('width', progress + '%');

            if (progress === 0) {
                $progressbar.remove();
            }
        }
    };*/

    /**
     *
     * @param {string} uploadedImgData
     * @param {string} imgId
     * @return {void}
     */

    Images.prototype.uploadDone = function (uploadedImgData, imgId) {
        var domImage = this.getDOMImage();
        var { url: imgUrl, meta: { width: originalWidth, height: originalHeight } } = uploadedImgData;
        var $imgWrapper = $('.medium-insert-images[data-media-id="' + imgId + '"]');
        var $imgEl = $imgWrapper.find('img');
        var imageDefaultSize = this.options.imageDefaultSize;

        var imgSuitableSize = this.options.getImageSuitableSizeCallback(originalWidth, imageDefaultSize, this.imageAvailableSizesList)
        if (imgSuitableSize) {
            imgUrl = `${imgUrl}_${imgSuitableSize}`;
        }

        domImage.onload = function () {
            $imgEl.attr({
                'src': imgUrl,
                'data-original-width': originalWidth,
                'data-original-height': originalHeight,
            });

            $imgWrapper.attr({
                'data-original-width': originalWidth,
                'data-original-height': originalHeight,
            });

            $imgEl.next('.medium-insert-images-progress').remove();

            this.core.triggerInput();

            if ($('.medium-editor-insert-plugin').find('.medium-insert-images-progress').length === 0) {
                $imgEl.click();
            }
        }.bind(this);

        domImage.src = imgUrl;

        this.core.clean();
        //this.sorting();
    };

    /**
     * Add uploaded / preview image to DOM
     *
     * @param {string} img
     * @param {object} data
     * @returns {void}
     */

    Images.prototype.showImage = function (img, data) {
        var uploadMedia = this.options.uploadCustomCallback;
        var getMedia = this.options.getUploadedImageCustomCallback;
        var base64Img = img.split(',')[1];
        var imgType = data.files[0].type;
        var imgId = data.mediaId;
        var accountName = this.options.uploadData.account;
        var accountPrivateKey = this.options.uploadData.privateKey;
        var uploadErrorMessage =this.options.messages.uploadError;
        var $place = this.$el.find('.medium-insert-images.medium-insert-active');

        // Hide editor's placeholder
        $place.click();

        var $mediaEl = $(this.templates['src/js/templates/images-image.hbs']({
            img: img,
            progress: true
        }));

        $mediaEl.appendTo($place);

        this.core.triggerInput();

        $place.find('br').remove();

        // Blur shouldn't be done in Safari because of "selection getRangeAt(0)" bug
        if (!(/Version\/([0-9\._]+).*Safari/.test(navigator.userAgent))) {
            $('.medium-editor-insert-plugin').blur();
        }

        $('.medium-insert-images[data-media-id="' + imgId + '"]').find('img')
            .next('.medium-insert-images-progress').focus().click();

        (async () => {
            try {
                await this.core._delayAsync();

                var uploadResponse = await uploadMedia(
                    accountPrivateKey,
                    accountName,
                    imgId,
                    base64Img,
                    imgType,
                );

                const uploadedImgData = await getMedia(accountName, imgId);

                this.uploadDone(uploadedImgData, imgId);

                if (this.options.uploadCompleted) {
                    this.options.uploadCompleted(data);
                }

            } catch (err) {
                $('.medium-insert-images[data-media-id="' + imgId + '"]').remove();
                this.core.triggerInput();

                console.error(err);

                if (this.options.errorCustomCallback && typeof this.options.errorCustomCallback === "function") {
                    this.options.errorCustomCallback(uploadErrorMessage);

                    return false;
                }
            }
        })();
    };

    Images.prototype.getDOMImage = function () {
        return new window.Image();
    };

    /**
     * Select clicked image
     *
     * @param {Event} e
     * @returns {void}
     */

    Images.prototype.selectImage = function (e) {
        var that = this,
            $image;

        if (this.core.options.enabled) {
            if (this.$el.attr('data-medium-editor-is-disabled')) {
                return;
            }

            $image = $(e.target);

            if ($image.hasClass('medium-insert-image-active')) {
                return false;
            }

            this.$currentImage = $image;

            // Hide keyboard on mobile devices
            this.$el.blur();

            $image.addClass('medium-insert-image-active');
            $image.closest('.medium-insert-images').addClass('medium-insert-active');

            setTimeout(function () {
                that.addToolbar();

                if (that.options.captions) {
                    that.core.addCaption($image.closest('figure'), that.options.captionPlaceholder);
                }
            }, 50);
        }
    };

    /**
     * Unselect selected image
     *
     * @param {Event} e
     * @returns {void}
     */

    Images.prototype.unselectImage = function (e) {
        var $el = $(e.target),
            $image = this.$el.find('.medium-insert-image-active');

        if ($el.closest('.medium-editor-action').length !== 0) {
            return false;
        }

        if ($el.is('img') && $el.hasClass('medium-insert-image-active')) {
            $image.not($el).removeClass('medium-insert-image-active');
            $('.medium-insert-images-toolbar, .medium-insert-images-toolbar2').remove();
            this.core.removeCaptions($el);
            return;
        }

        $image.removeClass('medium-insert-image-active');
        $('.medium-insert-images-toolbar, .medium-insert-images-toolbar2').remove();

        if ($el.is('.medium-insert-caption-placeholder')) {
            this.core.removeCaptionPlaceholder($image.closest('figure'));
        } else if ($el.is('figcaption') === false) {
            this.core.removeCaptions();
        }
        this.$currentImage = null;
    };

    /**
     * Remove image
     *
     * @param {Event} e
     * @returns {void}
     */

    Images.prototype.removeImage = function (e) {
        var images = [],
            $selectedImage = this.$el.find('.medium-insert-image-active'),
            $parent, $empty, selection, range, current, caretPosition, $current, $sibling, selectedHtml, i;

        if (e.which === 8 || e.which === 46) {
            if ($selectedImage.length) {
                images.push($selectedImage);
            }

            // Remove image even if it's not selected, but backspace/del is pressed in text
            /*selection = window.getSelection();
            if (selection && selection.rangeCount) {
                range = selection.getRangeAt(0);
                current = range.commonAncestorContainer;
                $current = current.nodeName === '#text' || current.nodeName === 'BR' ? $(current).parent() : $(current);
                caretPosition = MediumEditor.selection.getCaretOffsets(current).left;

                console.log('===== current', $current);

                // Is backspace pressed and caret is at the beginning of a paragraph, get previous element
                if (e.which === 8 && caretPosition === 0) {
                    $sibling = $current.prev();
                    // Is del pressed and caret is at the end of a paragraph, get next element
                } else if (e.which === 46 && caretPosition === $current.text().length) {
                    $sibling = $current.next();
                }

                if ($sibling && $sibling.hasClass('medium-insert-images')) {
                    images.push($sibling.find('img'));
                }

                // If text is selected, find images in the selection
                selectedHtml = MediumEditor.selection.getSelectionHtml(document);
                if (selectedHtml) {
                    $('<div></div>').html(selectedHtml).find('.medium-insert-images img').each(function () {
                        images.push($(this));
                    });
                }

            }*/

            if (images.length) {
                for (i = 0; i < images.length; i++) {
                    this.deleteFile(images[i].attr('src'), images[i]);

                    $parent = images[i].closest('.medium-insert-images');
                    images[i].closest('figure').remove();

                    if ($parent.find('figure').length === 0) {
                        $empty = $parent.next();
                        if ($empty.is('p') === false || $empty.text() !== '') {
                            $empty = $(this.templates['src/js/templates/core-empty-line.hbs']().trim());
                            $parent.before($empty);
                        }
                        $parent.remove();
                    }
                }

                // Hide addons
                this.core.hideAddons();
                if (!selectedHtml && $empty) {
                    e.preventDefault();
                    this.core.moveCaret($empty);
                }

                $('.medium-insert-images-toolbar, .medium-insert-images-toolbar2').remove();
                this.core.triggerInput();
            }
        }
    };

    /**
     * Makes ajax call to deleteScript
     *
     * @param {string} file The name of the file to delete
     * @param {jQuery} $el The jQuery element of the file to delete
     * @returns {void}
     */

    Images.prototype.deleteFile = function (file, $el) {
        // only take action if there is a truthy value
        if (this.options.deleteScript) {
            // try to run it as a callback
            if (typeof this.options.deleteScript === 'function') {
                this.options.deleteScript(file, $el);
                // otherwise, it's probably a string, call it as ajax
            } else {
                $.ajax($.extend(true, {}, {
                    url: this.options.deleteScript,
                    type: this.options.deleteMethod || 'POST',
                    data: { file: file }
                }, this.options.fileDeleteOptions));
            }
        }
    };

    /**
     * Adds image toolbar to editor
     *
     * @returns {void}
     */

    Images.prototype.addToolbar = function () {
        var $image = this.$el.find('.medium-insert-image-active'),
            $p = $image.closest('.medium-insert-images'),
            active = false,
            mediumEditor = this.core.getEditor(),
            toolbarContainer = mediumEditor.options.elementsContainer || 'body',
            $toolbar, $toolbar2;

        $(toolbarContainer).append(this.templates['src/js/templates/images-toolbar.hbs']({
            styles: this.options.styles,
            actions: this.options.actions
        }).trim());

        $toolbar = $('.medium-insert-images-toolbar');
        $toolbar2 = $('.medium-insert-images-toolbar2');

        $toolbar.find('button').each(function () {
            if ($p.hasClass('medium-insert-images-' + $(this).data('action'))) {
                $(this).addClass('medium-editor-button-active');
                active = true;
            }
        });

        if (active === false) {
            $toolbar.find('button').first().addClass('medium-editor-button-active');
        }

        this.repositionToolbars();

        $toolbar.fadeIn();
        $toolbar2.fadeIn();
    };

    Images.prototype.autoRepositionToolbars = function () {
        setTimeout(function () {
            this.repositionToolbars();
            this.repositionToolbars();
        }.bind(this), 0);
    };

    Images.prototype.repositionToolbars = function () {
        var $toolbar = $('.medium-insert-images-toolbar'),
            $toolbar2 = $('.medium-insert-images-toolbar2'),
            $image = this.$el.find('.medium-insert-image-active'),
            elementsContainer = this.core.getEditor().options.elementsContainer,
            elementsContainerAbsolute = ['absolute', 'fixed'].indexOf(window.getComputedStyle(elementsContainer).getPropertyValue('position')) > -1,
            elementsContainerBoundary = elementsContainerAbsolute ? elementsContainer.getBoundingClientRect() : null,
            containerWidth = $(window).width(),
            position = {},
            position2 = {};

        if ($toolbar2.length) {
            if (elementsContainerAbsolute) {
                position2.top += elementsContainer.scrollTop - elementsContainerBoundary.top;
                position2.left -= elementsContainerBoundary.left;
                containerWidth = $(elementsContainer).width();
            } else {
                if ($image.length) {
                    position2.top = $image.offset().top + 2;
                    position2.left = $image.offset().left + $image.width() - $toolbar2.width() - 4; // 4px - distance from a border
                }
            }

            if (Object.keys(position2).length !== 0) {
                if (position2.left + $toolbar2.width() > containerWidth) {
                    position2.left = containerWidth - $toolbar2.width();
                }

                $toolbar2.css(position2);
            }
        }

        if ($toolbar.length) {
            if ($image.closest('.medium-insert-images-grid-active').length) {
                $image = $image.closest('.medium-insert-images-grid-active');
            }

            if (elementsContainerAbsolute) {
                position.top += elementsContainer.scrollTop - elementsContainerBoundary.top;
                position.left -= elementsContainerBoundary.left;
            } else {
                if ($image.length) {
                    position.top = $image.offset().top - $toolbar.height() - 8 - 2 - 5; // 8px - hight of an arrow under toolbar, 2px - height of an image outset, 5px - distance from an image
                    position.left = $image.offset().left + $image.width() / 2 - $toolbar.width() / 2;
                }
            }

            if (Object.keys(position).length !== 0) {
                if (position.top < 0) {
                    position.top = 0;
                }

                $toolbar.css(position);
            }
        }
    };

    /**
     * Fires toolbar action
     *
     * @param {Event} e
     * @returns {void}
     */

    Images.prototype.toolbarAction = function (e) {
        var that = this,
            $button, $li, $ul, $lis, $p, $currentImage;

        if (this.$currentImage === null) {
            return;
        }

        $currentImage = this.$currentImage;
        $button = $(e.target).is('button') ? $(e.target) : $(e.target).closest('button');
        $li = $button.closest('li');
        $ul = $li.closest('ul');
        $lis = $ul.find('li');
        $p = this.$el.find('.medium-insert-active');

        $button.addClass('medium-editor-button-active');
        $li.siblings().find('.medium-editor-button-active').removeClass('medium-editor-button-active');

        var domImage = this.getDOMImage();
        var imgUrl = $currentImage.attr('src');
        var imgOriginalSize = $p.attr('data-original-width');
        var imgTargetSize = $button.attr('data-size');
        var imgSuitableSize = this.options.getImageSuitableSizeCallback(imgOriginalSize, imgTargetSize, this.imageAvailableSizesList);
        var imgUrlPostfixes = (this.imageAvailableSizesList).map(function(val) { return `_${val}`; });

        imgUrl = imgUrl.replace(new RegExp(imgUrlPostfixes.join('|')), '');

        if (imgSuitableSize) {
            imgUrl = `${imgUrl}_${imgSuitableSize}`;
        }

        $lis.find('button').attr('disabled', 'disabled');
        $currentImage.after('<div class="medium-insert-images-progress"></div>');

        domImage.onload = function () {
            $currentImage.attr('src', imgUrl);

            $lis.find('button').each(function () {
                var className = 'medium-insert-images-' + $(this).data('action');

                if ($(this).hasClass('medium-editor-button-active')) {
                    $p.addClass(className);

                    if (that.options.styles[$(this).data('action')].added) {
                        that.options.styles[$(this).data('action')].added($p);
                    }
                } else {
                    $p.removeClass(className);

                    if (that.options.styles[$(this).data('action')].removed) {
                        that.options.styles[$(this).data('action')].removed($p);
                    }
                }
            });

            $lis.find('button').removeAttr('disabled');
            $currentImage.next('.medium-insert-images-progress').remove();

            that.core.hideButtons();
            that.repositionToolbars();
            that.core.triggerInput();
        };

        domImage.src = imgUrl;
    };

    /**
     * Fires toolbar2 action
     *
     * @param {Event} e
     * @returns {void}
     */

    Images.prototype.toolbar2Action = function (e) {
        var $button, callback;

        if (this.$currentImage === null) {
            return;
        }

        $button = $(e.target).is('button') ? $(e.target) : $(e.target).closest('button');
        callback = this.options.actions[$button.data('action')].clicked;

        if (callback) {
            callback(this.$el.find('.medium-insert-image-active'));
        }

        this.core.hideButtons();

        this.core.triggerInput();
    };

    /**
     * Initialize sorting
     *
     * @returns {void}
     */

    Images.prototype.sorting = function () {
        $.proxy(this.options.sorting, this)();
    };

    /**
     * Gets image available sizes
     * @param orginalSize
     * @param targetSize
     * @param sizes
     * @returns {*}
     */
    Images.prototype.getImageAvailableSizesList = function () {
        var imageStylesList = this.options.styles;
        var availableSizes = [];

        Object.keys(imageStylesList).forEach(function (styleItem) {
            if (imageStylesList[styleItem]) {
                availableSizes.push(imageStylesList[styleItem].size);
            }
        });

        return availableSizes;
    };


    /** Plugin initialization */

    $.fn[pluginName + addonName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName + addonName)) {
                $.data(this, 'plugin_' + pluginName + addonName, new Images(this, options));
            }
        });
    };

})(jQuery, window, document, MediumEditor.util);
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

}));
