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
    tagName: 'div',

    initialize: function() {
        // Load data 
        this.tags = new app.models.TagCollection();
        this.notes = new app.models.NoteCollection();
        this.tags.fetch();
        this.notes.fetch();

        // Setup global window events
        $(window).resize(this.fixLayout);
    },

    render: function() {
        InflatingView.prototype.render.call(this, arguments);

        // Load tag listview
        this.taglist = new TagListView({
            collection: this.tags,
        });
        this.$('#pane1').html(this.taglist.render().$el);
        
        // Load note listview
        this.notelist = new NoteListView({
            collection: this.notes,
        });
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
    tagName: 'div',

    initialize: function(options) {
        var options = _.extend({}, options);
        this.collection = options.collection;

        // Setup events
        this.collection.bind('reset', this.fillList, this);
    },

    render: function() {
        InflatingView.prototype.render.call(this, arguments);

        // Store refs
        this.list = this.$('.f-list');

        // If collection is currently populated, fill list
        if (this.collection.length > 0)
            this.fillList();

        return this;
    },

    fillList: function() {
        this.list.empty();
        this.collection.each(_.bind(function(item) {
            this.list.append($('<li/>').html(item.get('name'))); 
        }, this));
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


var TagView = InflatingView.extend({
    template: $('#TagItem-template').html(),
    tagName: 'li',
});

var NoteView = InflatingView.extend({
    template: $('#NoteItem-template').html(),
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
