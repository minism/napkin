from django.conf.urls.defaults import patterns, include, url
from tastypie.api import Api

from napkin import views
from napkin.api import TagResource, NoteResource


api = Api(api_name='v1')
api.register(TagResource())
api.register(NoteResource())

urlpatterns = patterns('',
    url(r'^$', views.MainView.as_view()),
    url(r'^api/', include(api.urls)),
)
