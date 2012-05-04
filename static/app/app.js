var ApplicationView = app.views.InflatingView.extend({
    template: $('#Application-template').html(),
    tagName: 'div',

    // Simple events
    events: {
        'click #add-note': 'newNote',
    },

    initialize: function() {
        // Setup primary collections
        this.tags = new app.models.TagCollection;
        this.notes = new app.models.NoteCollection;

        // Initialize app with tags loaded
        this.tags.fetch();

        // Setup global window events
        $(window).resize(this.fixLayout);
        window.onbeforeunload = function() {
             alert('hi');
        }

        // References to active data
        this.activeNote = null;

        // References to pending models so add actions can reuse an object
        this.pendingNote = null;
        this.pendingTag = null;

        // Timer state
        this.timers = {
            save: null,
        };
    },

    render: function() {
        app.views.InflatingView.prototype.render.call(this, arguments);

        // Store misc view references
        this.status_el = this.$('#status');
        this.status('Loading...');

        // Load tag listview
        this.taglist = new app.views.TagListView({
            collection: this.tags,
        });
        this.$('#pane1').html(this.taglist.render().$el);
        
        // Load note listview
        this.notelist = new app.views.NoteListView({
            collection: this.notes,
        });
        this.$('#pane2').html(this.notelist.render().$el);

        // Bind callbacks
        this.taglist.on('itemSelected', this.tagSelected, this);
        this.notelist.on('itemSelected', this.noteSelected, this);
        this.taglist.on('queueSelected', function() {
            return this.tagSelected('queue');
        }, this);

        // Load editor
        this.editor = this.newEditor();

        // Editor events
        this.$('#editor').keypress(_.bind(this.invalidate, this));

        // Apply resize once -- auto on window resize afterwards
        this.fixLayout();

        // Begin on queue
        this.taglist.queue.$el.click();

        return this;
    },

    // Factory method to create and setup an ACE editor
    newEditor: function() {
        var editor = ace.edit("editor");
        editor.setReadOnly(true);
        editor.setShowPrintMargin(false);
        editor.renderer.setShowGutter(false);
        editor.commands.addCommand({
            name: 'Save',
            bindKey: {
                win: 'Ctrl-S',
                mac: 'Command-S',
            },
            exec: _.bind(function (editor) {
                return this.saveNote();
            }, this),
        });
        return editor;
    },

    tagSelected: function(tagView) {
        // Clean up temp data
        this.closeNote();

        // Discard a pending note since the note collection will be reset
        this.pendingNote = null;

        // Check for special tags
        if (tagView == 'queue')
        {
            // Queue should retrieve notes with no tags yet defined
            this.notes.fetch({
                data: {
                    'tags__isnull': 'True',  
                },
            });
            return;
        }
    
        // Load notes containing tag
        this.notes.fetch({
            data: {
                'tags__id': tagView.model.id,  
            },
        });
    },

    noteSelected: function(noteView) {
        this.closeNote();
        this.loadNote(noteView.model);
    },

    // Editor data was modified
    invalidate: function() {
        // Update status
        this.staterr('Unsaved changes');
    },

    // Cleanly close active note
    closeNote: function() {
        this.activeNote = null;
    },

    loadNote: function(note) {
        // Reset status
        this.status('Idle');

        // Set active
        this.activeNote = note;

        // Load note text
        this.editor.getSession().setValue(note.get('text'));

        // Enable editor for editing
        this.editor.setReadOnly(false);
    },

    saveNote: function() {
        this.status('Saving...');
        if (!this.activeNote)
            // Disregard this call, but its kind of concerning...
            return

        // Save editor buffer into backbone object
        var text = this.editor.getSession().getValue(); 
        this.activeNote.save({
            name: text.split('\n')[0],
            text: text,
        }, {
            success: _.bind(function(model, res) {
                this.statok('Saved');

                // Update active model
                this.activeNote = model;

                // If the saved note was pending, nullify it
                if (this.pendingNote && this.pendingNote.cid == model.cid)
                    this.pendingNote = null;
            }, this),
            error: _.bind(function(model, res) {
                this.staterr(res.responseText);
            }, this),
        });
    },

    newNote: function() {
        if (!this.pendingNote)
        {
            var note = new app.models.Note;
            this.notes.add(note);
            var view = this.notelist.addItem(note, {
                top: true,
            });
            this.pendingNote = note;

            // Click new note
            view.$el.click();
        }
    },

    fixLayout: function() {
        var height = window.innerHeight - $('#menu').height();
        this.$('.fullscreen').css('height', height);
        this.$('#editor').css('height', height);
    },

    status: function(message, type) {
        var type = type || "info";
        this.status_el.html($('<div/>').addClass('alert alert-' + type).html(message));
    },

    // Shortcuts
    staterr: function(m) { return this.status(m, 'error'); },
    statok: function(m) { return this.status(m, 'success'); },

});



/* Main entry point of app */
function init()
{
    // Load application view
    var appView = new ApplicationView({
        el: '#app-container',
    }).render();
}

// All js files inject into app namespace
app = window.app || {};
app.init = init;
