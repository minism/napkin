from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=32, unique=True)

    class Meta:
        ordering = ['name']

    def __unicode__(self):
        return self.name

class Note(models.Model):
    name = models.CharField(max_length=255)

    # TODO: lookup the best size for this
    text = models.TextField(max_length=2**32, blank=True, null=True)

    # TODO: order by creation time
    class Meta:
        ordering = ['name']

    def __unicode__(self):
        return self.name
