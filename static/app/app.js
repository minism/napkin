/* Main entry point of app */
function init()
{
    // Load application view
    var appView = new app.views.ApplicationView({
        el: '#app-container',
    }).render();
}

// All js files inject into app namespace
app = {
    init: init
}
