/**
* 전역변수 영역
*/
var data  = null;      // 전체 데이터
var localeCode = null; // 지역코드
var useCode = null;    // 용도코드
var heatTransCoArr = new Array();   // 열관류율기준

/**
* 페이지 로딩 시 JSON 데이터를 호출하는 함수
*/
fetch('data/').then((response) => response.json()).then((json) => initSet(json));

/**
*  데이터 로드 후 초기값을 셋팅하는 함수
*/
function initSet(items) {
    // 서버에서 가져온 JSON 데이터 전역변수에 복사
    data = JSON.parse(JSON.stringify(items));

    // 지역구분
    var locale = data[0].localeCode;
    var localeSel = document.getElementById('locale');
    for(var i in locale) {
        var op = new Option();
        op.value = locale[i]['localeCode'];
        op.text = locale[i]['locale'];
        // select 태그에 생성 된 option을 넣는다.
        localeSel.appendChild(op);
    }

    // 용도구분
    var use = data[1].useCode;
    var useSel = document.getElementById('use');
    for(var i in use) {
        var op = new Option();
        op.value = use[i]['useCode'];
        op.text = use[i]['use'];
        // select 태그에 생성 된 option을 넣는다.
        useSel.appendChild(op);
    }

    // 단열재
    var material = data[2].materialThermalConductivity;
    var wallDirectSel = document.getElementById('wall-direct-kind-2');
    var wallIndirectSel = document.getElementById('wall-indirect-kind-2');
    for(var i in material) {
        var op = new Option();
        op.value = material[i]['value'];
        op.text = material[i]['material'];
        // select 태그에 생성 된 option을 넣는다.
        wallDirectSel.appendChild(op);
        wallIndirectSel.appendChild(op);
    }

    // 창호
    var window = data[3].windowThermalConductivity;
    var winDirectSel = document.getElementById('win-direct-kind-1');
    var winIndirectSel = document.getElementById('win-indirect-kind-1');
    for(var i in window) {
        var op = new Option();
        op.value = window[i]['value'];
        op.text = window[i]['window'];
        // select 태그에 생성 된 option을 넣는다.
        winDirectSel.appendChild(op);
        winIndirectSel.appendChild(op);
    }
};

/**
*  열관류율을 셋팅하는 함수
*/
function setHeatTransCo() {
    // 외벽(직접)
    var tmp1 = document.getElementById("wall-indirect-kind-1");
    var tmp2 = document.getElementById("wall-indirect-thick-1");
    var result = document.getElementById("wall-indirect-trans")
    console.log(tmp1.value, tmp2.value);

    result.innerHTML = "열관류율 " + calcHeatTransCo(calcHeatResistance(tmp1.value, tmp2.value)
                                            + calcHeatResistance(tmp1.value, tmp2.value));
}

/**
*  열관류율 기준값,지자체 기준값,배점을 셋팅하는 함수
*/
function setHeatTransCoPointEpi() {;
    // 열관류율 기준값을 전역변수에 담는다.
    var arr = data[5].heatTransmissionCoefficient;
    var meanArr = data[6].MeanHeatTransmissionCoefficient;
    for(var i in arr) {
        if(useCode == arr[i]['useCode'] && localeCode == arr[i]['localeCode']) {
            heatTransCoArr = arr[i]['value'];
            break;
        }
    }
    console.log("heatTransCoArr : ", heatTransCoArr);

    // 지자체 기준값, 배점
    var epi = document.getElementById('wall-min-locale');
    var point = document.getElementById('wall-min-point');
    for(var i in meanArr) {
        if(useCode == meanArr[i]['useCode'] && localeCode == meanArr[i]['localeCode']) {
            epi.innerHTML = "지자체 " + meanArr[i]['value'][0] + " 이하";
            point.innerHTML = "외벽 배점 " + meanArr[i]['point'] + "점";
            break;
        }
    }
};

/**
* 지역구분 변경 이벤트
*/
function onchangeLocale(param) {
    //지역코드 셋팅
    localeCode = param;
    //열관류율기준값, 배점, EPI 기준값 셋팅
    if(localeCode != null && useCode != null) {
        setHeatTransCoPointEpi();
    }
};

/**
* 용도구분 변경 이벤트
*/
function onchangeUse(param) {
    //용도코드 셋팅
    useCode = param;
    //열관류율기준값, 배점, EPI 기준값 셋팅
    if(localeCode != null && useCode != null) {
        setHeatTransCoPointEpi();
    }
};

/**
* 열저항 연산 함수
* Param : 열전도율, 두께
* Return : 열저항
*/
function calcHeatResistance(theCon, thick) {
    if(isValidNum(theCon) && isValidNum(thick)) {
        return ((thick / theCon) / 1000).toFixed(3);
    } else {
        return 0;
    }
}

/**
* 열관류율 연산 함수
* Param : 열저항
* Return : 열관류율
*/
function calcHeatTransCo(heatRes) {
    if(isValidNum(heatRes)) {
        return (1 / heatRes).toFixed(3);
    } else {
        return 0;
    }
}

/**
* 숫자값이 유효한지 검증하는 함수
* Param : 숫자
* Return : boolean
*/
function isValidNum(number) {
    // (!isNan(number) && number > 0) ? return true : return false;
    if(number > 0) {
        return true;
    }else {
        return false;
    }
};