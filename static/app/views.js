var ApplicationView = Backbone.View.extend({
    initialize: function() {
        // Setup global window events
        $(window).resize(this.fixLayout);
    },

    render: function() {
        // Load template
        this.$el.html($('#Application-template').html());
        this.fixLayout();

        // Load editor
        this.editor = ace.edit("editor");
        this.editor.setShowPrintMargin(false);
        this.editor.renderer.setShowGutter(false);

        // Store any other view references
        this.status_el = this.$('#status');
        this.status('hi');

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


// Namespace
app = window.app || {};
app.views = {
    ApplicationView: ApplicationView,
};
