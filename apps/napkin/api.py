from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization
from tastypie import fields

from napkin.models import Tag, Note


BASIC_MODEL_EXCLUDE = [
    'created_at',
    'updated_at',
    'is_active',
]


class TagResource(ModelResource):
    class Meta:
        queryset = Tag.active_objects.all()
        authentication = Authentication()
        authorization = Authorization()
        resource_name = 'tag'
        excludes = BASIC_MODEL_EXCLUDE
        filtering = {
            'id': ALL,
        }


class NoteResource(ModelResource):
    tags = fields.ManyToManyField(TagResource, 'tags', full=False)

    class Meta:
        queryset = Note.active_objects.all()
        authentication = Authentication()
        authorization = Authorization()
        resource_name = 'note'
        excludes = BASIC_MODEL_EXCLUDE
        filtering = {
            'tags': ALL_WITH_RELATIONS,
        }
