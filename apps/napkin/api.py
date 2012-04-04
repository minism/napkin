from tastypie.resources import ModelResource

from napkin.models import Tag, Note


BASIC_MODEL_EXCLUDE = [
    'created_at',
    'updated_at',
    'is_active',
]


class TagResource(ModelResource):
    class Meta:
        queryset = Tag.active_objects.all()
        resource_name = 'tag'
        excludes = BASIC_MODEL_EXCLUDE


class NoteResource(ModelResource):
    class Meta:
        queryset = Note.active_objects.all()
        resource_name = 'note'
        excludes = BASIC_MODEL_EXCLUDE
