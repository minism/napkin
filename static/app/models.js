var Note = Backbone.Model.extend({
    defaults: {
        name: "New note",
    },
});


var NoteCollection = Backbone.Collection.extend({
    model: Note,
});


var Tag = Backbone.Model.extend({
    defaults: {
        name: "New tag",
    },
});


var TagCollection = Backbone.Collection.extend({
    model: Tag,
});


// Namespace
app = window.app || {};
app.models = {
    Note: Note,
    NoteCollection: NoteCollection,
    Tag: Tag,
    TagCollection: TagCollection,
};
