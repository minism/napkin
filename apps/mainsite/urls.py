from django.conf.urls.defaults import patterns, include, url
from django.conf import settings
from django.contrib import admin

import napkin.views
import napkin.urls

admin.autodiscover()

handler500 = 'mainsite.views.error500'
handler404 = 'mainsite.views.error404'

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^napkin/', include(napkin.urls)),
    url(r'^$', napkin.views.MainView.as_view()),
)



# Static file serving
urlpatterns += patterns('',
    url(r'^favicon\.png$', 'django.views.generic.simple.redirect_to', {'url': settings.STATIC_URL + 'img/favicon.png'}),
    url(r'^robots\.txt$', 'django.views.generic.simple.redirect_to', {'url': settings.STATIC_URL + 'flat/robots.txt'}),
) 


if getattr(settings, 'DEBUG', True) or getattr(settings, 'DEBUG_MEDIA', True):
    media_url = getattr(settings, 'MEDIA_URL', '/media/')
    if media_url[0] == '/':
        media_url = media_url[1:]
    urlpatterns = patterns('',
        url(r'^%s(?P<path>.*)$' % (media_url,), 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT
        }),
    ) + urlpatterns
