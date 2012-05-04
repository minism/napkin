var API_ROOT = '/napkin/api/v1/';


var BaseModel = Backbone.Model.extend({
    
});


var BaseCollection = Backbone.Collection.extend({
//    parse: function(response) {
//        return response.objects;
//    },
});



var Note = BaseModel.extend({
    defaults: {
        name: "New note",
        tags: [],
    },
});


var NoteCollection = BaseCollection.extend({
    model: Note,
    url: API_ROOT + 'note/',
});


var Tag = BaseModel.extend({
    defaults: {
        name: "New tag",
    },
});


var TagCollection = BaseCollection.extend({
    model: Tag,
    url: API_ROOT + 'tag/',
});


// Namespace
app = window.app || {};
app.models = {
    Note: Note,
    NoteCollection: NoteCollection,
    Tag: Tag,
    TagCollection: TagCollection,
};
