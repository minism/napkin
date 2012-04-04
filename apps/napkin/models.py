from django.db import models
import basic_models.models


class Tag(basic_models.models.DefaultModel):
    name = models.CharField(max_length=32, unique=True)

    class Meta:
        ordering = ['name']

    def __unicode__(self):
        return self.name


class Note(basic_models.models.DefaultModel):
    name = models.CharField(max_length=255)
    tags = models.ManyToManyField(Tag)

    # TODO: lookup the best size for this
    text = models.TextField(max_length=2**32, blank=True, null=True)

    # TODO: order by creation time
    class Meta:
        ordering = ['name']

    def __unicode__(self):
        return self.name
