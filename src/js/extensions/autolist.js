(function () {
    'use strict';

    var Autolist = MediumEditor.Extension.extend({
        name: 'autolist',
        init: function () {
            this.subscribe('editableKeyup', this.onKeyUp.bind(this));
        },
        onKeyUp: function () {
            var listStart = this.base.getSelectedParentElement().textContent;

            if (/^1(\.|\))\s/.test(listStart)) {
                this.base.execAction('delete');
                this.base.execAction('delete');
                this.base.execAction('delete');
                this.base.execAction('insertorderedlist');
            } else if (/^(\*|-)\s/.test(listStart)) {
                this.base.execAction('delete');
                this.base.execAction('delete');
                this.base.execAction('insertunorderedlist');
            }
        }
    });

    MediumEditor.extensions.autolist = Autolist;
}());