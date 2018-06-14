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
                        $place.after('<p><br></p>'); // add empty paragraph so we can move the caret to the next line.
                        that.core.moveCaret($place.next());
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