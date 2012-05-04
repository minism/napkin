from django.contrib import admin
from napkin.models import *

class TagAdmin(admin.ModelAdmin):
    pass

class NoteAdmin(admin.ModelAdmin):
    pass

admin.site.register(Tag, TagAdmin)
admin.site.register(Note, NoteAdmin)
