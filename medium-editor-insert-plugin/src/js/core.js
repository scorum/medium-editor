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
            contentSizeMaxLength: null,
            errorNotificationCallback: function () {},
            successNotificationCallback: function () {},
            notificationIds: {},
            addons: {
                images: true, // boolean or object containing configuration
                videos: true,
                embeds: true,
                dividers: true,
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

            // Removes extra spaces in elements + removes empty ones
            $data.find('p, h2, h3, blockquote, figcaption').each(function () {
                var $this = $(this);

                if ($this.text().trim() === '') {
                    $this.remove();
                } else {
                    var newHtml = $this.html().replace(/&nbsp;/g, ' ').replace(/ {2,}/g, ' ').trim();
                    $this.html(newHtml);
                }
            });

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

        if (($current.is('h2') || $current.is('h3')) && $current.text().length === 0) {
            $current.before('<p> <br></p>');
            this.moveCaret($current.prev());
            $current.prev().click();
            $current.remove();

            return false;
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

        this.$el.find('.medium-insert-buttons-addons').fadeToggle(200);
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
        var limitLength = this.options.contentSizeMaxLength;
        var errorNotificationCallback = this.options.errorNotificationCallback;
        var errorNotificationId = this.options.notificationIds.contentSizeMaxLengthErrorId;
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

            errorNotificationCallback(errorNotificationId);
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
