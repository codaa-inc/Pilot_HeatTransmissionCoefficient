/**
* 전역변수 영역
*/
let data  = null;      // 전체 데이터
let localeCode = null; // 지역코드
let useCode = null;    // 용도코드
let heatTransCoArr = new Array();   // 열관류율기준

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
    const locale = data[0].localeCode;
    for(const i in locale) {
        const op = new Option();
        op.value = locale[i]['localeCode'];
        op.text = locale[i]['locale'];
        document.getElementById('locale').appendChild(op);
    }

    // 용도구분
    const use = data[1].useCode;
    for(const i in use) {
        const op = new Option();
        op.value = use[i]['useCode'];
        op.text = use[i]['use'];
        document.getElementById('use').appendChild(op);
    }

    // 단열재
    const material = data[2].materialThermalConductivity;
    const dm = document.getElementById('wall-direct-kind-2');
    const im = document.getElementById('wall-indirect-kind-2');
    for(const i in material) {
        const op = new Option();
        op.value = material[i]['value'];
        op.text = material[i]['material'];
        dm.appendChild(op);
        im.appendChild(op);
    }
    // 구조재
    const structure = data[3].structureThermalConductivity;
        for(const i in structure) {
        const op = new Option();
        op.value = structure[i]['value'];
        op.text = structure[i]['structure'];
        document.getElementById('wall-direct-kind-1').append(op);
        document.getElementById('wall-indirect-kind-1').append(op);
    }

    // 창호
    const window = data[4].windowThermalConductivity;
    for(const i in window) {
        const op = new Option();
        op.value = window[i]['value'];
        op.text = window[i]['window'];
        document.getElementById('win-direct-kind-1').appendChild(op);
        document.getElementById('win-indirect-kind-1').appendChild(op);
    }

    // 외부마감재
    const exMaterial = data[8].externalMaterialThermalConductivity;
    for(const i in exMaterial) {
        const op = new Option();
        op.value = exMaterial[i]['value'];
        op.text = exMaterial[i]['exmaterial'];
        document.getElementById('wall-direct-kind-3').appendChild(op);
        document.getElementById('wall-indirect-kind-3').appendChild(op);
    }

    /**
     * 구조두께      : 100~300까지 10단위
     * 단열재두께    : 50~250까지 10단위
     * 외부마감재두께 : 외부마감재별 고정값
     */
    //구조두께
    for (let i = 100; i <= 300; i+=10) {
        const op = new Option();
        op.value = i;
        op.text = i;
        document.getElementById('wall-direct-thick-1').appendChild(op);
        document.getElementById('wall-indirect-thick-1').appendChild(op);
    }

     //단열재두께
    for (let i = 50; i <= 250; i+=10) {
        const op = new Option();
        op.value = i;
        op.text = i;
        document.getElementById('wall-direct-thick-2').appendChild(op);
        document.getElementById('wall-indirect-thick-2').appendChild(op);
    }

    /**
     * 면적비 : 1~100까지 5단위
     * */
    for (let i = 0; i <= 100; i+=5) {
        const op = new Option();
        op.value = i;
        op.text = i + "%";
        document.getElementById('wall-min-width').appendChild(op);
    }
};

/**
*  열관류율을 셋팅하는 함수 (창호 외)
* Param : 선택된 콤보박스의 ID
*/
function setHeatTransCo(id) {
    const formId = id.split("-");
    if (formId[0] == "win") {
        setHeatTransCoWin(id);
    } else {
        const formObj = document.getElementsByName(formId[0])[0];  //접근할 form form 객체(wall, win,...)
        const selTag = formObj.getElementsByTagName("select");     //form 객체 하위 select tag들
        const printTag = document.getElementById(formId[0] + "-" + formId[1] + "-trans");
        let heatRes = 0;    //열저항값
        for(let i = 0; i < selTag.length; i+=2) {
            const flag = ((selTag[i].id).split("-"))[1]; // 직접 or 간접
            if (flag == formId[1]) {
                heatRes += Number(calcHeatResistance(selTag[i].value, selTag[i+1].value));  // 재료(열전도율) 선택값, 두께 선택값
            }
        }
        printTag.innerHTML = "열관류율 " + calcHeatTransCo(heatRes);
    }

    // 평균열관류율 셋팅
    setMinHeatTransCo(formId[0]);
}

/**
*  열관류율을 셋팅하는 함수 (창호)
* Param : 선택된 콤보박스의 ID
*/
function setHeatTransCoWin(id) {
    const printTag = document.getElementById("win-"+ id.split("-")[1] +"-trans");
    printTag.innerHTML = "열관류율 " + document.getElementById(id).value;
}

/**
*  평균열관류율을 셋팅하는 함수
* Param : 부위
*/
function setMinHeatTransCo(target) {
    if (target == "wall" || target == "win") {      // 외벽평균열관류율
        const tmpArr = ["wall-direct-width", "wall-direct-trans", "wall-indirect-width", "wall-indirect-trans",
                        "win-direct-width", "win-direct-trans", "win-indirect-width", "win-direct-trans" ]
        for(const i in tmpArr) {
            if (i % 2 == 1) {   //열관류율값 추출
                tmpArr[i] = Number(setValidNum((document.getElementById(tmpArr[i]).innerText).replace("열관류율 ", "")));
            } else {            //면적값 추출
                tmpArr[i] = Number(setValidNum(document.getElementById(tmpArr[i]).value));
            }
        }
        console.log(tmpArr);
        const minTrans = (((tmpArr[0] * tmpArr[1] + tmpArr[2] * tmpArr[3]) + ((tmpArr[4] * tmpArr[5] + tmpArr[6] * tmpArr[7]) * 0.7)) / (tmpArr[0] + tmpArr[2] + tmpArr[4] + tmpArr[8])).toFixed(3);
        console.log(minTrans);
        document.getElementById('wall-min-trans').innerText = minTrans;
    }
}

/**
*  평균열관류율을 연산하는 함수
* Param : 면적비
*/
function calcMinHeatTransCo() {

}

/**
*  열관류율 기준값,지자체 기준값,배점을 셋팅하는 함수
*/
function setHeatTransCoPointEpi() {;
    // 열관류율 기준값을 전역변수에 담는다.
    const arr = data[6].heatTransmissionCoefficient;
    for(const i in arr) {
        if(useCode == arr[i]['useCode'] && localeCode == arr[i]['localeCode']) {
            heatTransCoArr = arr[i]['value'];
            break;
        }
    }

    // 지자체 기준값, 배점
    const meanArr = data[7].MeanHeatTransmissionCoefficient;
    const epi = document.getElementById('wall-min-locale');
    const point = document.getElementById('wall-min-point');
    for(const i in meanArr) {
        if(useCode == meanArr[i]['useCode'] && localeCode == meanArr[i]['localeCode']) {
            epi.innerHTML = "지자체 " + meanArr[i]['value'][0] + " 이하";
            point.innerHTML = "외벽 배점 " + meanArr[i]['point'] + "점";
            break;
        }
    }
};

/**
* 지역구분 변경 이벤트
* Param : 지역구분 콤보박스에서 선택된 값
*/
function onchangeLocale(sel) {
    //지역코드 셋팅
    localeCode = sel;
    //열관류율기준값, 배점, EPI 기준값 셋팅
    if(localeCode != null && useCode != null) {
        setHeatTransCoPointEpi();
    }
};

/**
* 용도구분 변경 이벤트
* Param : 용도구분 콤보박스에서 선택된 값
*/
function onchangeUse(sel) {
    //용도코드 셋팅
    useCode = sel;
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
function calcHeatResistance(material, thick) {
    if(isValidNum(material) && isValidNum(thick)) {
        return (thick / material / 1000).toFixed(3);
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
* Param : number
* Return : boolean
*/
function isValidNum(number) {
    if(!isNaN(number) && number > 0) {
        return true;
    }else {
        return false;
    }
};

/**
* 숫자값이 유효하면 해당 값을 리턴하는 함수
* Param : number
* Return : number, 0
*/
function setValidNum(number) {
    if(!isNaN(number) && number > 0) {
        return number;
    } else {
        return 0;
    }
};