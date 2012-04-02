var InflatingView = Backbone.View.extend({
    template: '<div class="alert alert-error">GIVE A TEMPLATE!</DIV>',

    initialize: function() {
        this.inflated = false;
    },

    inflate: function() {
        this.$el.html(this.template);
        this.inflated = true;
    },

    render: function() {
        if (!this.inflated) {
            this.inflate();
        }
        return this;
    },
})


var ApplicationView = InflatingView.extend({
    template: $('#Application-template').html(),

    initialize: function() {
        // Setup global window events
        $(window).resize(this.fixLayout);
    },

    render: function() {
        InflatingView.prototype.render.call(this, arguments);

        // Load tag listview
        this.taglist = new TagListView;
        this.$('#pane1').html(this.taglist.render().$el);
        
        // Load note listview
        this.notelist = new NoteListView;
        this.$('#pane2').html(this.notelist.render().$el);

        // Load editor
        this.editor = ace.edit("editor");
        this.editor.setShowPrintMargin(false);
        this.editor.renderer.setShowGutter(false);

        // Store any other view references
        this.status_el = this.$('#status');
        this.status('hi');

        // Apply resize
        this.fixLayout();

        return this;
    },

    fixLayout: function() {
        var height = window.innerHeight - $('#menu').height();
        this.$('.fullscreen').css('height', height);
        this.$('#editor').css('height', height);
    },

    status: function(message, type) {
        var type = type || "normal";
        this.status_el.html(message);
    },

});


var ListView = InflatingView.extend({
    render: function() {
        InflatingView.prototype.render.call(this, arguments);
        return this;
    },
});


var TagListView = ListView.extend({
    template: $('#TagList-template').html(),

    render: function() {
        ListView.prototype.render.call(this, arguments);
        return this;
    },
});


var NoteListView = ListView.extend({
    template: $('#NoteList-template').html(),

    render: function() {
        ListView.prototype.render.call(this, arguments);
        return this;
    },
    
});


var TagView = Backbone.View.extend({
    tagName: 'li',
});

var NoteView = Backbone.View.extend({
    tagName: 'li'
})





// Namespace
app = window.app || {};
app.views = {
    ApplicationView: ApplicationView,
    TagListView: TagListView,
    NoteListView: NoteListView,
    TagView: TagView,
    NoteView: NoteView,
};
