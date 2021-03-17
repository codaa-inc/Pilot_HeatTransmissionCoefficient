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
    if (items != null || items != "" || items != "undefined") {
        data = JSON.parse(JSON.stringify(items));
    }

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
    for(const i in material) {
        const op1 = new Option();
        const op2 = new Option();
        op1.value = material[i]['value'];
        op1.text = material[i]['material'];
        op2.value = material[i]['value'];
        op2.text = material[i]['material'];
        document.getElementById('wall-direct-kind-2').appendChild(op1);
        document.getElementById('wall-indirect-kind-2').appendChild(op2);
    }
    // 구조재
    const structure = data[3].structureThermalConductivity;
        for(const i in structure) {
        const op = new Option();
        const op1 = new Option();
        op.value = structure[i]['value'];
        op.text = structure[i]['structure'];
        op1.value = structure[i]['value'];
        op1.text = structure[i]['structure'];
        document.getElementById('wall-direct-kind-1').appendChild(op);
        document.getElementById('wall-indirect-kind-1').appendChild(op1);
    }

    // 창호
    const window = data[4].windowThermalConductivity;
    for(const i in window) {
        const op1 = new Option();
        const op2 = new Option();
        op1.value = window[i]['value'];
        op1.text = window[i]['window'];
        op2.value = window[i]['value'];
        op2.text = window[i]['window'];
        document.getElementById('win-direct-kind-1').appendChild(op1);
        document.getElementById('win-indirect-kind-1').appendChild(op2);
    }

    // 외부마감재
    const exMaterial = data[8].externalMaterialThermalConductivity;
    for(const i in exMaterial) {
        const op = new Option();
        const op1 = new Option();
        op.value = exMaterial[i]['value'];
        op.text = exMaterial[i]['exmaterial'];
        op1.value = exMaterial[i]['value'];
        op1.text = exMaterial[i]['exmaterial'];
        document.getElementById('wall-direct-kind-3').appendChild(op);
        document.getElementById('wall-indirect-kind-3').appendChild(op1);
    }

    /**
     * 구조두께      : 100~300까지 10단위
     * 단열재두께    : 50~250까지 10단위
     * 외부마감재두께 : 외부마감재별 고정값
     */
    //구조두께
    for (let i = 100; i <= 300; i+=10) {
        const op = new Option();
        const op1 = new Option();
        op.value = i;
        op.text = i;
        op1.value = i;
        op1.text = i;
        document.getElementById('wall-direct-thick-1').appendChild(op);
        document.getElementById('wall-indirect-thick-1').appendChild(op1);
    }

     //단열재두께
    for (let i = 50; i <= 250; i+=10) {
        const op = new Option();
        const op1 = new Option();
        op.value = i;
        op.text = i;
        op1.value = i;
        op1.text = i;
        document.getElementById('wall-direct-thick-2').appendChild(op);
        document.getElementById('wall-indirect-thick-2').appendChild(op1);
    }
};

/**
 * 검토하기 클릭 이벤트
 * */
function onclickSearch() {
    if (localeCode != null &&  useCode != null) {
        setInitValue();             //초기데이터 셋팅
        setHeatTransCoPointEpi();   //열관류율기준값, 배점, EPI 기준값 셋팅
    } else {
        alert("지역과 용도를 선택하세요.");
    }
}

/**
* 초기 데이터 셋팅 함수
*/
function setInitValue() {
    $("#wall-direct-kind-1 option:eq(1)").attr("selected", "selected");
    $("#wall-indirect-kind-1 option:eq(1)").attr("selected", "selected");
    $('#wall-direct-thick-1 option:eq(11)').attr("selected", "selected");
    $('#wall-indirect-thick-1 option:eq(11)').attr("selected", "selected");
    $("#wall-direct-kind-2 option:eq(58)").attr("selected", "selected");
    $("#wall-indirect-kind-2 option:eq(58)").attr("selected", "selected");
    $('#wall-direct-thick-2 option:eq(11)').attr("selected", "selected");
    $('#wall-indirect-thick-2 option:eq(11)').attr("selected", "selected");
    $("#wall-direct-kind-3 option:eq(1)").attr("selected", "selected");
    $("#wall-indirect-kind-3 option:eq(1)").attr("selected", "selected");
    $('#win-direct-kind-1 option:eq(1)').attr("selected", "selected");
    $('#win-indirect-kind-1 option:eq(1)').attr("selected", "selected");

    
    const arr = ['wall-direct', 'wall-indirect', 'win-direct-kind-1', 'win-indirect-kind-1'];
    for(let i in arr) {
        // 열관류율, 평균열관류율 셋팅
        setHeatTransCo(arr[i]);
    }
    // 면적비 셋팅
    setWidthRatio('wall');
};

/**
 * 새로고침 클릭 이벤트
 * */
function onclickRefresh() {

    // 초기데이터 셋팅
    setInitValue();
};

/**
* 콤보박스 변경 이벤트
* Param : 선택된 콤보박스의 ID
*/
function onchangeCombobox(id) {
    const sel = document.getElementById(id);
    const thick = document.getElementById(id.replace("kind", "thick"));
    // 구조재료 철골, 목 선택시 두께 selectbox toggle
    if(sel.id == "wall-direct-kind-1" || sel.id == "wall-indirect-kind-1") {
        if (sel.value == "0") {
            thick.value = "0";
            $('#' + thick.id).val(0);
            /**
             * TODO
             * */
            //thick.setAttribute("disabled", "true");
        } else {
            console.log("false");
            //$('#' + thick.id).attr('disabled', 'true');
            //thick.setAttribute("disabled", "false");
        }
        console.log("thick.value : ", thick.value);

    // 외부마감재 선택시 두께 자동셋팅
    } else if (sel.id == "wall-direct-kind-3" || sel.id == "wall-indirect-kind-3") {
        const text = sel.options[sel.selectedIndex].text;
        switch (text) {
            case "마감재 미고려" :
                thick.value = "0";
                break;
            case "시멘트 몰탈" :
            case "자기질타일" :
            case "도기질타일" :
                thick.value = "20";
                break;
            case "점토벽돌 0.5B" :
                thick.value = "90";
                break;
            case "점토벽돌 1.0B" :
                thick.value = "190";
                break;
            case "점토벽돌 1.5B" :
                thick.value = "290";
                break;
            case "점토벽돌 2.0B" :
                thick.value = "390";
                break;
        }
    }

    // 열관류율 셋팅
    setHeatTransCo(id);
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
        let heatTransCo = calcHeatTransCo(heatRes);
        if (heatTransCo > 0) {
            printTag.innerText = "열관류율 " + calcHeatTransCo(heatRes);
        }
    }

    // 평균열관류율 셋팅
    setMinHeatTransCo(id);
}

/**
*  열관류율을 셋팅하는 함수 (창호)
* Param : 선택된 콤보박스의 ID
*/
function setHeatTransCoWin(id) {
    const printTag = document.getElementById("win-"+ id.split("-")[1] +"-trans");
    printTag.innerText = "열관류율 " + Number(document.getElementById(id).value).toFixed(3);
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
            epi.innerHTML = "지자체\n" + meanArr[i]['value'][0]
                            + "&nbsp;<i class=\"icon-copy fa fa-long-arrow-down\" aria-hidden=\"true\"></i>"
            point.innerText = "외벽배점\n" + meanArr[i]['point'] + "점";
            break;
        }
    }
};

/**
* 지역구분 변경 이벤트
* Param : 지역구분 콤보박스에서 선택된 값
*/
function onchangeLocale(sel) {
    //전역변수 지역코드 셋팅
    localeCode = sel;
};

/**
* 용도구분 변경 이벤트
* Param : 용도구분 콤보박스에서 선택된 값
*/
function onchangeUse(sel) {
    //전역변수 용도코드 셋팅
    useCode = sel;
};

/**
* 면적 변경 이벤트
* Param : 변경된 면적의 ID
*/
function onchangeWidth(id) {
    // 면적비 셋팅
    setWidthRatio(id);
    // 평균열관류율 셋팅
    setMinHeatTransCo(id);
};

/**
* 면적비를 셋팅하는 함수
* Param : 변경된 면적의 ID
*/
function setWidthRatio(id) {
    const inputId = id.split("-")[0];
    let outputId = "";
    let widthRatio = 0;
    let arr = new Array();
    if (inputId == "wall" || inputId == "win") {    // 외벽창면적비
        outputId = "wall-width-ratio";
        arr = ["wall-direct-width", "wall-indirect-width", "win-direct-width", "win-indirect-width"]
        for(const i in arr) {
            arr[i] = Number(setValidNum(document.getElementById(arr[i]).value));    //면적값 추출
        }
        widthRatio = calcWidthRatio(inputId, arr);

    } else if (inputId == "roof") {                 // 지붕면적비


    } else if (inputId == "floor") {                // 바닥면적비


    }
    if (widthRatio != 0) {
        document.getElementById(outputId).innerText = "면적비\n" + widthRatio;
    }
}

/**
*  면적비를 연산하는 함수
* Param : 부위구분, number array
* Return : 면적비
*/
function calcWidthRatio(target, arr) {
    if (target == "wall" || target == "win") {
        return ((arr[2] + arr[3]) / (arr[0] + arr[1] + arr[2] + arr[3])).toFixed(3);
    }
};

/**
* 평균열관류율을 셋팅하는 함수
* Param : 변경이 발생한 면적의 ID
*/
function setMinHeatTransCo(id) {
    const inputId = id.split("-")[0];
    let outputId = "";
    let arr = new Array();
    let minTrans = 0;
    
    if (inputId == "wall" || inputId == "win") {      // 외벽평균열관류율
        arr = ["wall-direct-width", "wall-direct-trans", "wall-indirect-width", "wall-indirect-trans",
               "win-direct-width", "win-direct-trans", "win-indirect-width", "win-direct-trans" ]
        outputId = 'wall-min-trans';
        for(const i in arr) {
            if (i % 2 == 1) {   //열관류율값 추출
                arr[i] = Number(setValidNum((document.getElementById(arr[i]).innerText).replace("열관류율 ", "")));
            } else {            //면적값 추출
                arr[i] = Number(setValidNum(document.getElementById(arr[i]).value));
            }
        }
        minTrans = calcMinHeatTransCo(inputId, arr); // 평균열관류율 연산

    } else if (inputId == "roof") {                  // 지붕평균열관류율


    } else if (inputId == "floor") {                 // 바닥평균열관류율


    }

    if (minTrans > 0) {
        document.getElementById(outputId).innerText = "외벽평균\n열관류율\n" + minTrans;
    }

    // 열관류율 검토결과 출력
    setSatisfyResult();
};

// 열관류율 검토결과를 셋팅하는 함수
function setSatisfyResult(){
    const isSatisfied = function () {


    }

};



/**
* 평균열관류율을 연산하는 함수
* Param : 부위구분, number array
* Retruen : 평균열관류율
*/
function calcMinHeatTransCo(target, arr) {
    if (target == "wall" || target == "win") {      // 외벽평균열관류율
        return (((arr[0] * arr[1] + arr[4] * arr[5]) + ((arr[2] * arr[3] + arr[6] * arr[7]) * 0.7))
               / (arr[0] + arr[2] + arr[4] + arr[6])).toFixed(3);
    } else if (target == "roof") {                  // 지붕평균열관류율

        return
    } else if (target == "floor") {                 // 바닥평균열관류율

        return
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
};

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
};

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