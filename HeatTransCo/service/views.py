from django.shortcuts import render

import json
import os
from django.http import HttpResponse

# Create your views here.
def main(request) :
    return render(request, 'index.html')

def data(request) :
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uValueCalc.json')
    with open(json_path, 'r', encoding='UTF8') as f:
        json_file = json.load(f)
    return HttpResponse(json.dumps(json_file), content_type="application/json")
