from django.shortcuts import render

import json
import os
from django.http import HttpResponse

# 웹 메인 페이지 렌더링
def index(request):
    return render(request, 'index.html')

# 모바일 메인 페이지 렌더링
def index_m(request):
    return render(request, 'mobile.html')


# 열관류율 계산기 초기 데이터 로딩
def data(request):
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uValueCalc.json')
    with open(json_path, 'r', encoding='UTF8') as f:
        json_file = json.load(f)
    return HttpResponse(json.dumps(json_file), content_type="application/json")
