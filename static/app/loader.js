/* Cached template loader */

var template_cache = {}

function loadTemplate()
{
    return "Template!"
}


// Namespace
app.loader = {
    loadTemplate: loadTemplate
}
