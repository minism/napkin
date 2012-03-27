import sys
import os
import imp
from django.core.handlers.wsgi import WSGIHandler

# assume 'apps' is a directory with same parent directory as us 
TOP_DIR = os.path.dirname(os.path.abspath(__file__))
APPS_DIR = os.path.join(TOP_DIR, 'apps')
if APPS_DIR not in sys.path:
    sys.path.insert(0, APPS_DIR)

# assume that the virtualenv is a directory named 'env' that is a sibling to TOP_DIR
ENV_DIR = os.path.join(os.path.dirname(TOP_DIR), 'env')

# if virtualenv exists, activate it
activate_this = os.path.join(ENV_DIR, 'bin', 'activate_this.py')
if os.path.exists(activate_this):
    execfile(activate_this, dict(__file__=activate_this))

# call django
os.environ['DJANGO_SETTINGS_MODULE'] = 'mainsite.settings'
application = WSGIHandler()

