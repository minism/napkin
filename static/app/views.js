// Icon HTML
var icon = {
    tag: '<i class="icon-tag"></i>',
    file: '<i class="icon-file"></i>',
    list: '<i class="icon-align-justify"></i>',
    trash: '<i class="icon-trash"></i>',
};

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

        // Bind callbacks
        this.taglist.on('itemSelected', this.tagSelected, this);
        this.notelist.on('itemSelected', this.noteSelected, this);

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

    tagSelected: function(tagView) {
        console.log(tagView.model.id);
    },

    noteSelected: function(noteView) {
        // Load document text
        debugger;
        this.editor.getSession().setValue(noteView.model.get('text'));
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
    itemViewClass: null,

    initialize: function(options) {
        InflatingView.prototype.initialize.call(this, arguments);

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

    addItem: function(itemView, options) {
        var options = _.extend({
            top: false,
            list: this.list,
        }, options || {});
        if (options.top)
            options.list.prepend(itemView.render().$el);
        else
            options.list.append(itemView.render().$el);

        // Bind callbacks
        itemView.on('selected', function(view) {
            this.trigger('itemSelected', view);
        }, this);
    },

    fillList: function() {
        this.list.empty();
        this.collection.each(_.bind(function(item) {
            this.addItem(new this.itemViewClass({
                model: item,
            }));
        }, this));
    },
});


var ItemView = InflatingView.extend({
    tagName: 'li',

    events: {
        'click': 'onClick',
    },

    onClick: function() {
        // Set as only active
        this.$el.addClass('active');
        this.$el.siblings().removeClass('active');
        this.$el.parents('ul').siblings('ul').children('li').removeClass('active');

        // Emit event
        this.trigger('selected', this);
    },

    initialize: function() {
        InflatingView.prototype.initialize.call(this, arguments);
    },
})


var TagView = ItemView.extend({
    template: $('#TagItem-template').html(),

    initialize: function() {
        ItemView.prototype.initialize.call(this, arguments);
        
        // Events
        this.model.bind('change', this.render, this);
    },

    render: function() {
        ItemView.prototype.render.call(this, arguments);

        // Update fixtures
        this.$('.f-name').html(icon.tag + this.model.get('name'));

        return this;
    },
});


var NoteView = ItemView.extend({
    template: $('#NoteItem-template').html(),

    initialize: function() {
        ItemView.prototype.initialize.call(this, arguments);
        
        // Events
        this.model.bind('change', this.render, this);
    },

    render: function() {
        ItemView.prototype.render.call(this, arguments);

        // Update fixtures
        this.$('.f-name').html(icon.file + this.model.get('name'));

        return this;
    },
})


var TagListView = ListView.extend({
    template: $('#TagList-template').html(),
    itemViewClass: TagView,

    render: function() {
        ListView.prototype.render.call(this, arguments);

        // Add dedicated items
        var queue = new ItemView;
        queue.on('selected', function() { 
            this.trigger('queueSelected');
        }, this);
        this.$('.f-head').prepend(queue.render().$el.html('<a href="#">' + icon.list + 'Queue</a>'));
        var trash = new ItemView;
        trash.on('selected', function() { 
            this.trigger('trashSelected');
        }, this);
        this.$('.f-tail').append(trash.render().$el.html('<a href="#">' + icon.trash + 'Trash</a>'));

        return this;
    },
});


var NoteListView = ListView.extend({
    template: $('#NoteList-template').html(),
    itemViewClass: NoteView,

    render: function() {
        ListView.prototype.render.call(this, arguments);
        return this;
    }, 
});


// Namespace
app = window.app || {};
app.views = {
    ApplicationView: ApplicationView,
    TagListView: TagListView,
    NoteListView: NoteListView,
    TagView: TagView,
    NoteView: NoteView,
};
