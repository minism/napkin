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

    addItem: function(item, options) {
        var options = _.extend({
            top: false,
            list: this.list,
        }, options || {});
        var itemView = new this.itemViewClass({
            model: item,
        });
        if (options.top)
            options.list.prepend(itemView.render().$el);
        else
            options.list.append(itemView.render().$el);

        // Bind callbacks
        itemView.on('selected', function(view) {
            this.trigger('itemSelected', view);
        }, this);

        return itemView;
    },

    fillList: function() {
        this.list.empty();
        this.collection.each(_.bind(function(item) {
            this.addItem(item);
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
        this.queue = new ItemView;
        this.queue.on('selected', function() { 
            this.trigger('queueSelected');
        }, this);
        this.$('.f-head').prepend(this.queue.render().$el.html('<a href="#">' + icon.list + 'Queue</a>'));
        this.trash = new ItemView;
        this.trash.on('selected', function() { 
            this.trigger('trashSelected');
        }, this);
        this.$('.f-tail').append(this.trash.render().$el.html('<a href="#">' + icon.trash + 'Trash</a>'));

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
    InflatingView: InflatingView,
    TagListView: TagListView,
    NoteListView: NoteListView,
    TagView: TagView,
    NoteView: NoteView,
};
