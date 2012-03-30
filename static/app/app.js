/* Main entry point of app */
function init()
{
    // Load application view
    $('#app-container').html(new app.views.ApplicationView().render().$el);
}

// All js files inject into app namespace
app = {
    init: init
}
