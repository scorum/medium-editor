/**
 * Gets common CommonEmbedsAddon Addon constructor
 * @param pluginName
 * @param addonName
 * @param $ - `jQuery` object
 * @param window - `window` object
 * @param document - `document` object
 */
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

            console.log('===== $place', $('.medium-insert-embeds-added').is(':first-child'));

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