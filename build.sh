#!/bin/bash
set -o errexit

python -m pip install --upgrade pip
pip install -r requirements.txt

python crm_autoescuela/manage.py migrate
python crm_autoescuela/manage.py collectstatic --no-input
