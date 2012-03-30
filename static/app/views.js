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

        return this;
    },

    fixLayout: function() {
        var height = window.innerHeight - $('#menu').height();
        this.$('.fullscreen').css('height', height);
        this.$('#editor').css('height', height);
    },

});


// Namespace
app.views = {
    ApplicationView: ApplicationView,
}
