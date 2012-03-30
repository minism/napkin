/* Main entry point of app */
function init()
{
    // Setup resize callback  
    $(window).resize(fix_size);

    // Load editor
    var editor = ace.edit("editor");
    editor.setShowPrintMargin(false);
    editor.renderer.setShowGutter(false);
    fix_size();
}

// Callback on window resize to fix layout
function fix_size()
{
    var height = window.innerHeight - $('#menu').height();
    $('.fullscreen').css('height', height);
    $('#editor').css('height', height);
}

// Namespace
app = {
    init: init
}
