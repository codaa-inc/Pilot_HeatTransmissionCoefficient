from django.shortcuts import render

import json
import os
from django.http import HttpResponse

# Create your views here.
def main(request) :
    return render(request, 'index.html')

def data(request) :
    print(os.path.realpath(__file__))
    print(os.path.abspath(__file__))
    file = open('data/heatTransCoData.json')
    print(file)
    with open('data/heatTransCoData.json', 'r') as f:
        json_file = json.load(f)
        print(json_file)
    return HttpResponse(json.dumps(json_file), content_type="application/json")