/**
* 전역변수 영역
*/
let data  = null;                           // 전체 데이터
let LOCALE_CODE = null;                     // 지역코드
let USE_CODE = null;                        // 용도코드
let heatTransCoArr = new Array();           // 열관류율기준
let avgHeatTransCoArr = new Array();        // 평균열관류율기준
let localeEpiArr = new Array();             // 지자체배점
let slabHeatResistanceArr = new Array();    // 슬라브상부단열기준

/**
* 페이지 로딩 시 JSON 데이터를 호출하는 함수
*/
fetch('data/').then((response) => response.json()).then((json) => initSet(json));

/**
 * 초기 데이터를 셋팅하는 함수
 * */
function initSet(items){
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
};

/**
*  콤보박스를 셋팅하는 함수
*/
function setInitCombobox(items) {
    // 단열재
    const material = data[2].materialThermalConductivity;
    const materialArr = ['wall-direct-kind-2', 'wall-indirect-kind-2', 'wall-direct-kind-4', 'wall-indirect-kind-4',
                        'roof-direct-kind-2', 'roof-indirect-kind-2','floor-direct-kind-3', 'floor-indirect-kind-3',
                        'floorb-direct-kind-2', 'floorb-indirect-kind-2', 'floor-direct-kind-5',
                        'floor-indirect-kind-5'];
    for(const i in material) {
        for(const j in materialArr) {
            const op = new Option();
            op.text = material[i]['material'];
            op.value = material[i]['value'];
            document.getElementById(materialArr[j]).appendChild(op);
        }
    }

    // 구조재
    const structure = data[3].structureThermalConductivity;
    const structureArr = ['wall-direct-kind-1', 'wall-indirect-kind-1', 'roof-direct-kind-1', 'roof-indirect-kind-1'];
    for(const i in structure) {
        for(const j in structureArr) {
            const op = new Option();
            op.text = structure[i]['structure'];
            op.value = structure[i]['value'];
            document.getElementById(structureArr[j]).appendChild(op);
        }
    }

    // 창호
    const window = data[4].windowThermalConductivity;
    const windowArr = ['win-direct-kind-1', 'win-indirect-kind-1'];
    for(let i in window) {
        for (let j in windowArr) {
            const op = new Option();
            op.value = window[i]['value'];
            op.text = window[i]['window'];
            document.getElementById(windowArr[j]).appendChild(op);
        }
    }

    // 외부마감재
    const exMaterial = data[8].externalMaterialThermalConductivity;
    const exMaterialArr = ['wall-direct-kind-3', 'wall-indirect-kind-3', 'roof-direct-kind-3', 'roof-indirect-kind-3']
    for(const i in exMaterial) {
        for(const j in exMaterialArr) {
            const op = new Option();
            op.text = exMaterial[i]['exmaterial'];
            op.value = exMaterial[i]['value'];
            document.getElementById(exMaterialArr[j]).appendChild(op);
        }
    }

    // 기포콘크리트 종류
    const concrete = data[10].concreteThermalConductivity;
    const concreteArr = ['floor-direct-kind-2', 'floor-indirect-kind-2'];
    for(let i in concrete) {
        for(let j in concreteArr) {
            const op = new Option();
            op.value = concrete[i]['value'];
            op.text = concrete[i]['concrete'];
            document.getElementById(concreteArr[j]).appendChild(op);
        }
    }

    /**
     * 구조두께        : 100~300까지 10단위
     * 단열재두께      : 50~250까지 10단위
     * 외부마감재두께   : 외부마감재별 고정값 적용
     * 슬라브두께      : 150~250까지 10단위
     * 기포콘크리트두께 : 25~100까지 5단위
     * 바닥난방두께    : 30~50까지 5단위
     */
    //구조두께
    for (let i = 300; i >= 100; i-=10) {
        const structureThickArr = ['wall-direct-thick-1', 'wall-indirect-thick-1',
                                   'roof-direct-thick-1', 'roof-indirect-thick-1'];
        for(let j in structureThickArr) {
            const op = new Option();
            op.value = i;
            op.text = i;
            document.getElementById(structureThickArr[j]).appendChild(op);
            if (i == 100) {
                const op = new Option();
                op.value = 0;
                op.text = 0;
                document.getElementById(structureThickArr[j]).appendChild(op);
            }
        }
    }

     //단열재두께
    const materialThickArr = ['wall-direct-thick-2', 'wall-indirect-thick-2', 'roof-direct-thick-2', 'roof-indirect-thick-2',
                             'wall-direct-thick-4', 'wall-indirect-thick-4', 'floor-direct-thick-3', 'floor-indirect-thick-3',
                             'floorb-direct-thick-2', 'floorb-indirect-thick-2','floor-direct-thick-5', 'floor-indirect-thick-5'];
    for (let i = 250; i >= 50; i-=10) {
        for(let j in materialThickArr) {
            const op = new Option();
            op.value = i;
            op.text = i;
            document.getElementById(materialThickArr[j]).appendChild(op);
            if (i == 50) {
                const op = new Option();
                op.value = 0;
                op.text = 0;
                document.getElementById(materialThickArr[j]).appendChild(op);
            }
        }
    }

    // 슬라브두께
    const slabArr = ['floorb-direct-thick-1', 'floorb-indirect-thick-1', 'floor-direct-thick-4', 'floor-indirect-thick-4'];
    for (let i = 250; i >= 150; i-=10) {
        for(let j in slabArr) {
            const op = new Option();
            op.value = i;
            op.text = i;
            document.getElementById(slabArr[j]).appendChild(op);
        }
    }

   // 기포콘크리트두께
    const concreteThickArr = ['floor-indirect-thick-2', 'floor-direct-thick-2'];
    for (let i = 100; i >= 25; i-=5) {
        for (let j in concreteThickArr) {
            const op = new Option();
            op.value = i;
            op.text = i;
            document.getElementById(concreteThickArr[j]).appendChild(op);;
            if (i == 25) {
                const op = new Option();
                op.value = 0;
                op.text = 0;
                document.getElementById(concreteThickArr[j]).appendChild(op);
            }
        }
    }

    // 바닥난방두께
    const floorThickArr = ['floor-direct-thick-1', 'floor-indirect-thick-1'];
    for (let i = 50; i >= 30; i-=5) {
        for (let j in floorThickArr) {
            const op = new Option();
            op.value = i;
            op.text = i;
            document.getElementById(floorThickArr[j]).appendChild(op);
        }
    }
};

/**
 * 검토하기 클릭 이벤트
 * */
function onclickSearch() {
    if (LOCALE_CODE != null && USE_CODE != null) {
        setInitCombobox();          //콤보박스 셋팅
        setHeatTransCoPointEpi();   //열관류율기준값, 배점, EPI 기준값 셋팅
        setInitValue();             //초기값 셋팅
    } else {
        alert("지역과 용도를 선택하세요.");
    }
}

/**
 * 보고서 출력 클릭 이벤트
 * */
function oncliclkPrintReport() {
    // container 이외의 부분 숨김 처리
    $("#header").css("display", "none");
    $("#page-header").css("display", "none");
    $("#footer").css("display", "none");

    // 크롬 출력창 띄우기
    window.location.href = "report"
}


/**
* 초기 데이터 셋팅 함수
*/
function setInitValue() {
    // 외벽 default 값
    $("#wall-direct-kind-1 option:eq(1)").prop("selected", "selected");
    $("#wall-indirect-kind-1 option:eq(1)").prop("selected", "selected");
    $('#wall-direct-thick-1 option:eq(11)').prop("selected", "selected");
    $('#wall-indirect-thick-1 option:eq(11)').prop("selected", "selected");
    $("#wall-direct-kind-2 option:eq(1)").prop("selected", "selected");
    $("#wall-indirect-kind-2 option:eq(1)").prop("selected", "selected");
    $('#wall-direct-thick-2 option:eq(22)').prop("selected", "selected");
    $('#wall-indirect-thick-2 option:eq(22)').prop("selected", "selected");
    $("#wall-direct-kind-3 option:eq(1)").prop("selected", "selected");
    $("#wall-indirect-kind-3 option:eq(1)").prop("selected", "selected");
    $("#wall-direct-kind-4 option:eq(1)").prop("selected", "selected");
    $("#wall-indirect-kind-4 option:eq(1)").prop("selected", "selected");
    $('#wall-direct-thick-4 option:eq(11)').prop("selected", "selected");
    $('#wall-indirect-thick-4 option:eq(11)').prop("selected", "selected");

    // 창호 default 값
    $('#win-direct-kind-1 option:eq(1)').prop("selected", "selected");
    $('#win-indirect-kind-1 option:eq(1)').prop("selected", "selected");

    // 지붕 default 값
    $("#roof-direct-kind-1 option:eq(1)").prop("selected", "selected");
    $("#roof-indirect-kind-1 option:eq(1)").prop("selected", "selected");
    $('#roof-direct-thick-1 option:eq(11)').prop("selected", "selected");
    $('#roof-indirect-thick-1 option:eq(11)').prop("selected", "selected");
    $("#roof-direct-kind-2 option:eq(1)").prop("selected", "selected");
    $("#roof-indirect-kind-2 option:eq(1)").prop("selected", "selected");
    $('#roof-direct-thick-2 option:eq(11)').prop("selected", "selected");
    $('#roof-indirect-thick-2 option:eq(11)').prop("selected", "selected");
    $("#roof-direct-kind-3 option:eq(1)").prop("selected", "selected");
    $("#roof-indirect-kind-3 option:eq(1)").prop("selected", "selected");

    // 비난방바닥 default 값
    $("#floorb-direct-kind-1 option:eq(1)").prop("selected", "selected");
    $("#floorb-indirect-kind-1 option:eq(1)").prop("selected", "selected");
    $('#floorb-direct-thick-1 option:eq(11)').prop("selected", "selected");
    $('#floorb-indirect-thick-1 option:eq(11)').prop("selected", "selected");
    $("#floorb-direct-kind-2 option:eq(1)").prop("selected", "selected");
    $("#floorb-indirect-kind-2 option:eq(1)").prop("selected", "selected");
    $('#floorb-direct-thick-2 option:eq(11)').prop("selected", "selected");
    $('#floorb-indirect-thick-2 option:eq(11)').prop("selected", "selected");

    // 난방바닥 default 값
    $('#floor-direct-thick-1 option:eq(3)').prop("selected", "selected");
    $('#floor-indirect-thick-1 option:eq(3)').prop("selected", "selected");
    $('#floor-direct-kind-2 option:eq(1)').prop("selected", "selected");
    $('#floor-indirect-kind-2 option:eq(1)').prop("selected", "selected");
    $('#floor-direct-thick-2 option:eq(17)').prop("selected", "selected");
    $('#floor-indirect-thick-2 option:eq(17)').prop("selected", "selected");
    $('#floor-direct-kind-3 option:eq(1)').prop("selected", "selected");
    $('#floor-indirect-kind-3 option:eq(1)').prop("selected", "selected");
    $('#floor-direct-thick-3 option:eq(11)').prop("selected", "selected");
    $('#floor-indirect-thick-3 option:eq(11)').prop("selected", "selected");
    $("#floor-direct-kind-4 option:eq(1)").prop("selected", "selected");
    $("#floor-indirect-kind-4 option:eq(1)").prop("selected", "selected");
    $('#floor-direct-thick-4 option:eq(11)').prop("selected", "selected");
    $('#floor-indirect-thick-4 option:eq(11)').prop("selected", "selected");
    $('#floor-direct-kind-5 option:eq(1)').prop("selected", "selected");
    $('#floor-indirect-kind-5 option:eq(1)').prop("selected", "selected");
    $('#floor-direct-thick-5 option:eq(11)').prop("selected", "selected");
    $('#floor-indirect-thick-5 option:eq(11)').prop("selected", "selected");

    // 열관류율, 평균열관류율 셋팅
    const heatArr = ['wall-direct', 'wall-indirect', 'win-direct', 'win-indirect',
                     'roof-direct', 'roof-indirect', 'floorb-direct', 'floorb-indirect',
                     'floor-direct', 'floor-indirect'];
    for(let i in heatArr) {
        setHeatTransCo(heatArr[i]);
    }

    // 창면적비 셋팅
    setWidthRatio("wall");
};

/**
 * 새로고침 클릭 이벤트
 * */
function onclickRefresh() {
    if (LOCALE_CODE != null &&  USE_CODE != null) {
      if (confirm("선택한 항목들이 초기값으로 돌아갑니다.\n진행하시겠습니까?")) {
        // 초기데이터 셋팅
        setInitValue();
      }
    }
};

/**
* 콤보박스 변경 이벤트
* Param : 선택된 콤보박스의 ID
*/
function onchangeCombobox(id) {
    const sel = document.getElementById(id);
    const thick = document.getElementById(id.replace("kind", "thick"));

    // 재료 변경시 최적의 두께를 탐색하기 위해 두께를 최소로 셋팅한다.
    if (id.split('-')[0] != "win" && id.split('-')[2] == "kind") {
        $("#" + thick.id).val(0);
    }

    // 단열재 구분선 선택시 두께 selectbox toggle
    const materialArr = ['wall-direct-kind-2', 'wall-indirect-kind-2', 'wall-direct-kind-4', 'wall-indirect-kind-4',
                        'roof-direct-kind-2', 'roof-indirect-kind-2', 'floorb-direct-kind-2', 'floorb-indirect-kind-2',
                        'floor-direct-kind-3', 'floor-indirect-kind-3', 'floor-direct-kind-5', 'floor-indirect-kind-5'];
    if(materialArr.includes(sel.id)) {
        if (sel.value == "0") {
            $('#' + thick.id).val(0);
            $('#' + thick.id).prop("disabled", true);
        } else {
            $('#' + thick.id).prop("disabled", false);
        }
    }

    // 구조재료 철골, 목 선택시 두께 selectbox toggle
    const structureArr = ['wall-direct-kind-1', 'wall-indirect-kind-1', 'roof-direct-kind-1', 'roof-indirect-kind-1'];
    if(structureArr.includes(sel.id)) {
        if (sel.value == "0") {
            $('#' + thick.id).val(0);
            $('#' + thick.id).prop("disabled", true);
        } else {
            $('#' + thick.id).prop("disabled", false);
        }
    }

    // 외부마감재 선택시 두께 자동셋팅
    const exMaterialArr = ['wall-direct-kind-3', 'wall-indirect-kind-3', 'roof-direct-kind-3', 'roof-indirect-kind-3'];
    if (exMaterialArr.includes(sel.id)) {
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

    // 기포콘크리트 기포없음 선택시 selectbox toggle
    const concreteArr = ['floor-direct-kind-2', 'floor-indirect-kind-2'];
    if(concreteArr.includes(sel.id)) {
        if (sel.value == "0") {
            $('#' + thick.id).val(0);
            $('#' + thick.id).prop("disabled", true);
        } else {
            $('#' + thick.id).prop("disabled", false);
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
    if (formId[0] != "win") {
        //접근할 form 객체(wall, win,...)
        const formObj = document.getElementsByName(formId[0])[0];
        //form 객체 하위 select tag들
        const selTag = formObj.getElementsByTagName("select");
        //열관류율을 출력할 태그
        const printTag = document.getElementById(formId[0] + "-" + formId[1] + "-trans");
        //열저항값
        let heatRes = 0;
        //재료 열저항값 연산
        for(let i = 0; i < selTag.length; i+=2) {
            const flag = ((selTag[i].id).split("-"))[1]; //직접 or 간접
            if (flag == formId[1]) {
                heatRes += Number(calcHeatResistance(selTag[i].value, selTag[i+1].value));  //재료(열전도율) 선택값, 두께 선택값
            }
        }
        //열관류율 출력
        let heatTransCo = calcHeatTransCo(formId[0] + formId[1], heatRes);
        if (heatTransCo > 0) {
            printTag.innerText = heatTransCo;
        }
    } else {
        setHeatTransCoWin(id);  //창호는 열저항 계산하지 않음
    }

    // 평균열관류율 셋팅
    setAvgHeatTransCo(id);
}

/**
*  열관류율을 셋팅하는 함수 (창호)
* Param : 선택된 콤보박스의 ID
*/
function setHeatTransCoWin(id) {
    id = id.split("-")[0] + "-" + id.split("-")[1];
    const printTag = document.getElementById(id +"-trans");
    printTag.innerText = roundTo(Number(document.getElementById(id + "-kind-1").value), 3);
}

/**
*  지역별 열관류율 기준값, 지자체별 평균열관류율 기준값,배점, 표면열저항값을 셋팅하는 함수
*/
function setHeatTransCoPointEpi() {;
    // 평균값 영역을 visible 처리한다.
    $('#wall-avg-header').css('display', '');
    $('#roof-avg-header').css('display', '');
    $('#floor-avg-header').css('display', '');

    // 지역별 열관류율 기준값을 전역변수에 담는다.
    const arr = data[6].heatTransmissionCoefficient;
    for(const i in arr) {
        if(USE_CODE == arr[i]['useCode'] && LOCALE_CODE == arr[i]['localeCode']) {
            heatTransCoArr = arr[i]['value'];
            break;
        }
    }

    // 지역별 열관류율 기준값 셋팅
    const targetArr = ['wall-direct-locale', 'wall-indirect-locale', 'win-direct-locale', 'win-indirect-locale',
                       'roof-direct-locale', 'roof-indirect-locale', 'floorb-direct-locale', 'floorb-indirect-locale',
                       'floor-direct-locale', 'floor-indirect-locale'];
    for(let i in targetArr) {
        document.getElementById(targetArr[i]).innerText = "(부위별 기준 "
            + roundTo(heatTransCoArr[i], 3) + " 이하)"
            //+ "&nbsp;<i class=\"icon-copy fa fa-long-arrow-down\" aria-hidden=\"true\"></i>";
    }

    // 지자체별 평균열관류율 기준값을 전역변수에 담는다.
    const meanArr = data[7].localeEpi;
    for(const i in meanArr) {
        if(USE_CODE == arr[i]['useCode'] && LOCALE_CODE == arr[i]['localeCode']) {
            avgHeatTransCoArr = meanArr[i];
            break;
        }
    }

    // 지자체별 배점을 전역변수에 담는다.
    let epiArr = data[12].epi;
    for(const i in epiArr) {
        if(USE_CODE == epiArr[i]['useCode'] && LOCALE_CODE == epiArr[i]['localeCode']) {
            localeEpiArr = epiArr[i];
            break;
        }
    }

    // 평균열관류율 기준 셋팅
    const avgArr = ['wall-avg-locale', 'roof-avg-locale', 'floor-avg-locale'];
    const localeArr = ['지자체 기준 ', '법적 기준 '];
    for(let i in avgArr) {
        let epi = document.getElementById(avgArr[i]);
        if (LOCALE_CODE == 0 || LOCALE_CODE == 2 || LOCALE_CODE == 4) {     // 지자체 기준이 별도 존재
            epi.innerText = localeArr[1] + avgHeatTransCoArr['value'][i];
        } else {                                                            // 법적 기준 적용
            epi.innerText = localeArr[0] + avgHeatTransCoArr['value'][i];
        }
    }

    // 슬라브상부 열저항최소값 셋팅
    const slabArr = data[11].slabHeatResistance;
    for(let i in slabArr) {
        if (LOCALE_CODE == slabArr[i]['localeCode']) {
            slabHeatResistanceArr[0] = roundTo(slabArr[i]['direct'], 3);
            slabHeatResistanceArr[1] = roundTo(slabArr[i]['indirect'], 3);
            break;
        }
    }
};

/**
* 용도구분 변경 이벤트
* Param : 용도구분 콤보박스에서 선택된 값
*/
function onchangeUse(sel) {
    //전역변수 용도코드 셋팅
    USE_CODE = sel;
};

/**
* 면적 변경 이벤트
* Param : 변경된 면적의 ID
*/
function onchangeWidth(id) {
    // 창면적비 셋팅
    setWidthRatio(id);
    // 평균열관류율 셋팅
    setAvgHeatTransCo(id);
};

/**
* 창면적비를 셋팅하는 함수
* Param : 변경된 면적의 ID
*/
function setWidthRatio(id) {
    // 면적비를 구할 부위
    const inputId = id.split("-")[0];
    // 면적값이 담긴 태그 배열
    let arr = ["wall-direct-width", "wall-indirect-width", "win-direct-width", "win-indirect-width"];

    if (inputId == "wall" || inputId == "win") {    // 외벽창면적비
        //면적값 추출
        let widthRatio = 0;
        for(let i in arr) {
            arr[i] = Number(setValidNum(document.getElementById(arr[i]).value));
        }
        // 면적값 연산 및 출력
        widthRatio = calcWidthRatio(arr);
        if (isValidNum(widthRatio)) {
            document.getElementById('wall-width-ratio').innerText = "(창면적비 " + widthRatio + ")";
        }
    }
};

/**
*  창면적비를 연산하는 함수
* Param : number array
* Return : 면적비
*/
function calcWidthRatio(arr) {
    return roundTo((arr[2] + arr[3]) / (arr[0] + arr[1] + arr[2] + arr[3]), 3);
};

/**
* 평균열관류율을 셋팅하는 함수
* Param : 변경이 발생한 면적의 ID
*/
function setAvgHeatTransCo(id) {
    const inputId = id.split("-")[0];
    let outputId = "";
    let arr = new Array();
    let avgTrans = 0;

    if (inputId == "wall" || inputId == "win") {                // 외벽평균열관류율
        arr = ["wall-direct-width", "wall-direct-trans", "wall-indirect-width", "wall-indirect-trans",
               "win-direct-width", "win-direct-trans", "win-indirect-width", "win-direct-trans" ]
        outputId = 'wall-avg-trans';
    } else if (inputId == "roof") {                             // 지붕평균열관류율
        arr = ["roof-direct-width", "roof-direct-trans", "roof-indirect-width", "roof-indirect-trans"];
        outputId = 'roof-avg-trans';
    } else if (inputId == "floorb" || inputId == "floor") {     // 바닥평균열관류율
        arr = ["floorb-direct-width", "floorb-direct-trans", "floorb-indirect-width", "floorb-indirect-trans",
               "floor-direct-width", "floor-direct-trans", "floor-indirect-width", "floor-direct-trans" ]
        outputId = 'floor-avg-trans';
    }

    for(const i in arr) {
        if (i % 2 == 1) {   //열관류율값 추출
            arr[i] = Number(setValidNum(document.getElementById(arr[i]).innerText));
        } else {            //면적값 추출
            arr[i] = Number(setValidNum(document.getElementById(arr[i]).value));
        }
    }
    avgTrans = calcAvgHeatTransCo(inputId, arr); // 평균열관류율 연산
    if (avgTrans > 0) {
        document.getElementById(outputId).innerText = avgTrans;
    }

    // 배점 결과 출력
    setEpiPoint(id, avgTrans);

    // 열관류율 검토결과 출력
    setSatisfyResult(id);

    // 평균열관류율 검토결과 출력
    setSatisfyAvgResult(id);

    // 슬라브상부 단열기준 검토결과 출력
    if (inputId == "floor") {
        setSatisfyHeatResistance()
    }
};

/**
 *열관류율 검토결과를 셋팅하는 함수
 * Param : 대상 부위의 ID
 * */
function setSatisfyResult(id){
    const part = id.split("-")[0] + "-" + id.split("-")[1];   // 부위값
    // 헤더 영역을 표시함 (hidden 상태에서 선택자가 안 먹히기 때문에 순서 바꾸면 X)
    $("#" + part + '-header').css("visibility", "visible");
    const resultTag = part + "-result";   // 검토결과를 출력할 p태그 ID
    const trans = document.getElementById(part + "-trans").innerText;
    const localeValue = ($("#" + part + "-locale").text().replace("(부위별 기준", "")).replace(" 이하)", "");

    if (Number(trans) <= Number(localeValue)) {
        document.getElementById(resultTag).innerText = "만족";
        document.getElementById(resultTag).style.color = "#0D47A1";
    } else {
        const thickId = id.replace("kind", "thick");
        const idDisabled = $("#" + thickId).attr("disabled");
        // 재료를 변경한 경우 기준을 만족하는 최적의 두께를 찾음
        if (id.split('-')[2] == "kind" && id.split('-')[0] != "win" && idDisabled != "disabled") {
            setOptimalThick(thickId);
        } else {
            document.getElementById(resultTag).innerText = "불만족";
            document.getElementById(resultTag).style.color = "#C62828";
        }
    }
};

/**
 * 재료 변경시 기준을 만족하는 최적의 두께를 셋팅해주는 함수
 * Param : 변경한 재료값의 두께 ID
 * Return : setHeatTransCo()를 재귀호출한다.
 * */
function setOptimalThick(thickId) {
    const thickIdx = Number($("#" + thickId + " option").index( $("#" + thickId +" option:selected"))) - 1;
    if (thickIdx > -1); {
        // 기준을 만족할 때까지 변경한 재료의 두께를 한 단위씩 증감시킨다.
        $('#' + thickId + ' option:eq(' + thickIdx + ')').prop("selected", "selected");
        setHeatTransCo(thickId.replace("thick", "kind"));
    }
};

/**
 * 평균열관류율 검토결과를 셋팅하는 함수
 * Parma : 대상 부위의 ID
 * */
function setSatisfyAvgResult(id){
    // 평균열관류율 검토결과를 출력할 부위
    let part = ((id.split("-")[0]).replace("win", "wall")).replace("floorb", "floor");
    // 검토결과를 출력할 태그 ID
    const resultId = part + '-avg-result';
    // 해당 부위의 평균열관류율 기준 ID
    const transId = part + '-avg-trans';
    // 해당 부위의 평균열관류율 값
    const trans = document.getElementById(transId).innerText;

    // 평균열관류율 기준값
    let avgHeat = 0;
    if(part == 'wall') {
        avgHeat = avgHeatTransCoArr['value'][0];
    } else if (part == 'roof') {
        avgHeat = avgHeatTransCoArr['value'][1];
    } else if (part == 'floor') {
        avgHeat = avgHeatTransCoArr['value'][2];
    }

    // 평균열관류율 검토결과 출력
    if (Number(trans) <= Number(avgHeat)) {
        document.getElementById(resultId + '-1').innerText = "W/㎡k 이하를 ";
        document.getElementById(resultId).innerText = "만족";
        document.getElementById(resultId).style.color = "#0D47A1";
    } else {
        document.getElementById(resultId + '-1').innerText = "W/㎡k ";
        document.getElementById(resultId).innerText = "미달";
        document.getElementById(resultId).style.color = "#C62828";
    }
};

/**
 * 배점을 셋팅하는 함수
 * Param : 선택 부위, 평균 열관류율
 * */
function setEpiPoint(id, trans) {
    const part = ((id.split("-")[0]).replace("win", "wall")).replace("floorb", "floor"); // 부위
    if (LOCALE_CODE != "6") {
        const pointArr = localeEpiArr[part];        // 해당 부위의 배점배열
        let i = 0; let point = ""; let text = "";   // 인스턴스 변수, 배점, 부위 텍스트
        // 해당 부위의 평균열관류율 값과 비교해 배점 산정
        for(i in pointArr) {
            if (trans <= pointArr[i]) {
                switch (i) {
                    case "0" :
                        point = 1.0;
                        break;
                    case "1" :
                        point = 0.9;
                        break;
                    case "2" :
                        point = 0.8;
                        break;
                    case "3" :
                        point = 0.7;
                        break;
                    case "4" :
                        point = 0.6;
                        break;
                }
                break;
            }
        }
        // 부위 텍스트
        switch (part) {
            case "wall" :
                text = "외벽 배점 ";
                break;
            case "roof" :
                text = "지붕 배점 ";
                break;
            case "floor" :
                text = "바닥 배점 ";
                break;
        }
        // 배점 출력
        if (point >= 0.6) {
            $('#' + part + '-avg-point').css('display', 'inline-block');
            document.getElementById(part + '-avg-point').innerText = text + point + "점으로 ";
        } else {
            $('#' + part + '-avg-point').css('display', 'none');
        }

    } else {         // 제주지역은 배점 표시하지 않음
        $('#' + part + '-avg-point').css('display', 'none');
    }
};

/**
 * 슬라브상부 단열기준 검토결과를 셋팅하는 함수
 * */
function setSatisfyHeatResistance() {
    const materialArr = ['floor-direct-kind-1', 'floor-direct-kind-2', 'floor-direct-kind-3',
                       'floor-indirect-kind-1', 'floor-indirect-kind-2', 'floor-indirect-kind-3'];      // 바닥재료
    const thickArr = ['floor-direct-thick-1', 'floor-direct-thick-2', 'floor-direct-thick-3',
                      'floor-indirect-thick-1', 'floor-indirect-thick-2', 'floor-indirect-thick-3'];    // 바닥두께
    const directTag = document.getElementById('floor-direct-slab-result');
    const indirectTag = document.getElementById('floor-indirect-slab-result');
    let direct = 0;     // 직접 열저항값
    let indirect = 0;   // 간접 열저항값

    // 슬라브상부 열저항값
    for(let i in materialArr) {
        if (i <= 2) {
            direct += Number(roundTo(calcHeatResistance(document.getElementById(materialArr[i]).value, document.getElementById(thickArr[i]).value), 3));
        } else {
            indirect += Number(roundTo(calcHeatResistance(document.getElementById(materialArr[i]).value, document.getElementById(thickArr[i]).value), 3));
        }
    }

    // 슬라브상부 열저항기준 및 수치 출력
    document.getElementById('floor-direct-slab').innerText =
        "슬라브상부 단열저항값\n" + direct + " W/㎡k 으로\n" + slabHeatResistanceArr[0] + " W/㎡k 이상";
    document.getElementById('floor-indirect-slab').innerText =
        "슬라브상부 단열저항값\n" + indirect + " W/㎡k 으로\n" + slabHeatResistanceArr[1] +  "W/㎡k 이상";

    // 슬라브상부 열저항기준 검토결과 출력
    if (direct >= slabHeatResistanceArr[0]) {
       directTag.innerText = "만족";
       directTag.style.color = "#0D47A1";
    } else {
        directTag.innerText = "불만족";
        directTag.style.color = "#C62828";
    }
    if (indirect >= slabHeatResistanceArr[1]) {
        indirectTag.innerText = "만족";
        indirectTag.style.color = "#0D47A1";
    } else {
        indirectTag.innerText = "불만족";
        indirectTag.style.color = "#C62828";
    }
};

/**
* 평균열관류율을 연산하는 함수
* Param : 부위구분, number array
* Retruen : 평균열관류율
*/
function calcAvgHeatTransCo(part, arr) {
    // 평균열관류율 검토결과를 출력할 부위
    part = ((part.split("-")[0]).replace("win", "wall")).replace("floorb", "floor");
    let avg = 0;
    if (part == "wall") {
        // 외벽평균열관류율 보정계수 : 외벽 직접 1.0, 외벽 간접 0.7, 창호 직접 1.0, 창호간접 0.8
        avg =  (arr[0] * arr[1] + arr[4] * arr[5] + (arr[2] * arr[3]) * 0.7 + (arr[6] * arr[7]) * 0.8)
               / (arr[0] + arr[2] + arr[4] + arr[6]);
    } else if (part == "roof") {
        // 지붕평균열관류율 보정계수 : 지붕 직접 1.0, 지붕 간접 0.7
        avg = ((arr[0] * arr[1]) + ((arr[2] * arr[3]) * 0.7)) / (arr[0] + arr[2]);
    } else if(part == "floor") {
        // 바닥평균열관류율 보정계수 : 바닥 직접 1.0, 바닥 간접 0.7
        avg = ((arr[0] * arr[1] + arr[4] * arr[5]) + ((arr[2] * arr[3] + arr[6] * arr[7]) * 0.7))
               / (arr[0] + arr[2] + arr[4] + arr[6]);
    }
    return roundTo(avg, 3);
};

/**
* 열저항 연산 함수
* Param : 열전도율, 두께
* Return : 열저항
*/
function calcHeatResistance(material, thick) {
    if(isValidNum(material) && isValidNum(thick)) {
        return roundTo(thick / material / 1000, 3);
    } else {
        return 0;
    }
};

/**
* 열관류율 연산 함수
* Param : 연산할 부위의 ID, 열저항
* Return : 열관류율
*/
function calcHeatTransCo(formId, heatRes) {
    //부위별 표면열저항값 처리
    const partArr = ["walldirect", "wallindirect", "roofdirect", "roofindirect",
                     "floorbdirect", "floorbindirect", "floordirect", "floorindirect" ]
    const idx = partArr.indexOf(formId);
    if (idx > -1) {
        const surfaceHeatResistance = data[5].surfaceHeatResistance[idx];
        // 재료 열저항 + 실외표면 열저항 + 실내표면 열저항
        heatRes += surfaceHeatResistance['outdoor'] + surfaceHeatResistance['indoor'];
    }

    // 열관류율 연산
    if(isValidNum(heatRes)) {
        return roundTo(1 / heatRes, 3);
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

/**
 * 소수점 반올림 함수
 * Param : number, digits
 * Return : number
 * */
function roundTo(number, digits) {
    if (digits === undefined) {
        digits = 0;
    }
    let multiplicator = Math.pow(10, digits);
    number = parseFloat((number * multiplicator).toFixed(11));
    return (Math.round(number) / multiplicator).toFixed(digits);
}

/***************************************************************************
  지역선택 콤보 셋팅 영역
 ***************************************************************************/

$('document').ready(function () {
    var area0 = ["서울특별시", "인천광역시", "대전광역시", "광주광역시", "대구광역시", "울산광역시", "부산광역시", "세종특별자치시", "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주도"];
    var area1 = ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"];
    var area2 = ["계양구", "남구", "남동구", "동구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군"];
    var area3 = ["대덕구", "동구", "서구", "유성구", "중구"];
    var area4 = ["광산구", "남구", "동구", "북구", "서구"];
    var area5 = ["남구", "달서구", "동구", "북구", "서구", "수성구", "중구", "달성군"];
    var area6 = ["남구", "동구", "북구", "중구", "울주군"];
    var area7 = ["강서구", "금정구", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구", "기장군"];
    var area8 = ["고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시", "가평군", "양평군", "여주군", "연천군"];
    var area9 = ["강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시", "태백시", "고성군", "양구군", "양양군", "영월군", "인제군", "정선군", "철원군", "평창군", "홍천군", "화천군", "횡성군"];
    var area10 = ["제천시", "청주시", "충주시", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "증평군", "진천군", "청원군"];
    var area11 = ["계룡시", "공주시", "논산시", "보령시", "서산시", "아산시", "천안시", "금산군", "당진군", "부여군", "서천군", "연기군", "예산군", "청양군", "태안군", "홍성군"];
    var area12 = ["군산시", "김제시", "남원시", "익산시", "전주시", "정읍시", "고창군", "무주군", "부안군", "순창군", "완주군", "임실군", "장수군", "진안군"];
    var area13 = ["광양시", "나주시", "목포시", "순천시", "여수시", "강진군", "고흥군", "곡성군", "구례군", "담양군", "무안군", "보성군", "신안군", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"];
    var area14 = ["경산시", "경주시", "구미시", "김천시", "문경시", "상주시", "안동시", "영주시", "영천시", "포항시", "고령군", "군위군", "봉화군", "성주군", "영덕군", "영양군", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군"];
    var area15 = ["거제시", "김해시", "마산시", "밀양시", "사천시", "양산시", "진주시", "진해시", "창원시", "통영시", "거창군", "고성군", "남해군", "산청군", "의령군", "창녕군", "하동군", "함안군", "함양군", "합천군"];
    var area16 = ["서귀포시", "제주시", "남제주군", "북제주군"];

    // 시/도 선택 박스 초기화
    $("select[name^=sido]").each(function () {
        $selsido = $(this);
        $selsido.append("<option selected disabled hidden>시/도 선택</option>");
        $.each(eval(area0), function () {
            $selsido.append("<option value='" + this + "'>" + this + "</option>");
        });
    });

    // 시/도 선택시 구/군 설정
    $("select[name^=sido]").change(function () {
        LOCALE_CODE = null;                                      // 지역코드 초기화
        document.getElementById('locale').value = "";   // 지역구분콤보 초기화
        var idx = $("option", $(this)).index($("option:selected", $(this)));
        var area = "area" + Number(idx - 1);    // 선택지역의 구군 Array
        var $gugun = $("#gugun1");                    // 선택영역 군구 객체

        // 2 Depth : 경기,강원,충북,경북,경남
        if (idx == 9 || idx == 10 || idx == 11 || idx == 15 || idx == 16) {
            $('.header-right').css('width', '75%');       // 헤더 영역 확보
            $gugun.children('option:not(:first)').remove();     // 구군 콤보박스 초기화
            $gugun.css("display", "");                    // 구군 콤보박스 toggle
            $gugun.append("<option value='0' selected disabled hidden>구/군 선택</option>");
            $.each(eval(area), function () {
                $gugun.append("<option value='" + this + "'>" + this + "</option>");
            });
        // 1 Depth : 그 외
        } else {
            $('.header-right').css('width', '65%');     // 헤더 영역 초기화
            $gugun.css("display", "none");              // 구군 콤보박스 toggle
            setLocaleCode(idx);
        }
    });

    // 구/군 선택시 설정
    $("#gugun1").change(function () {
        var sido = $("option", $('#sido1')).index($("option:selected", $('#sido1')));
        var gugun = $("#gugun1 option:checked").text();
        setLocaleCode(sido, gugun);
    });
});

/**
 * 지역코드를 셋팅하는 함수
 * Param : 선택된 시/도 idex, 선택된 구/군 text
 * */
function setLocaleCode(sido, gugun) {
    // 1 Depth
    if (gugun == undefined) {
        // 중부2 : 인천,대전,세종,충남,전북
        if (sido == 2 || sido == 3 || sido == 8 || sido == 12 || sido == 13) {
            LOCALE_CODE = 2;
        // 중부2(서울,경기) : 서울,경기
        } else if (sido == 1 || sido == 9) {
            LOCALE_CODE = 3;
        // 남부 : 대구,전남
        } else if (sido == 5 || sido == 14) {
            LOCALE_CODE = 4;
        // 남부(부산,광주,울산)
        } else if (sido == 4 || sido == 6 || sido == 7) {
            LOCALE_CODE = 5;
        // 제주
        } else if (sido == 17) {
            LOCALE_CODE = 6;
        }
    // 2 Depth
    } else {
        // 지역 세부 구분 배열
        const gyunggi = ["연천군", "포천시", "가평군", "남양주시", "의정부시", "양주시", "동두천시", "파주시"];
        const gangwon = ["고성군", "속초시", "양양군", "강릉시", "동해시", "삼척시"];
        const chungbuk = ["제천시"];
        const gyungbuk1 = ["봉화군", '청송군']
        const gyungbuk2 = ["울진군", "영덕군", "포항시", "경주시", "청도군", "경산시"];
        const gyungnam = ["거창군", "함양군"];
        if (sido == 9) {
            // 중부1(경기) : 경기도(연천, 포천, 가평, 남양주, 의정부, 양주, 동두천, 파주)
            if(gyunggi.includes(gugun)) {
                LOCALE_CODE = 1;
            // 중부2(서울, 경기) : 경기도(연천, 포천, 가평, 남양주, 의정부, 양주, 동두천, 파주 제외)
            } else {
                LOCALE_CODE = 3;
            }
        } else {
            // 중부1 : 강원도(고성, 속초, 양양, 강릉, 동해, 삼척 제외), 충청북도(제천), 경상북도(봉화, 청송)
            if((sido == 10 && !gangwon.includes(gugun)) || (sido == 11 && chungbuk.includes(gugun)) || (sido == 15 && gyungbuk1.includes(gugun))) {
                LOCALE_CODE = 0;
            // 남부 : 경상북도(울진, 영덕, 포항, 경주, 청도, 경산), 경상남도(거창, 함양 제외)
            } else if ((sido == 15 && gyungbuk2.includes(gugun)) || (sido == 16 && !gyungnam.includes(gugun))){
                LOCALE_CODE = 4;
            // 중부2 : 강원도(고성, 속초, 양양, 강릉, 동해, 삼척), 충청북도(제천 제외), 경상북도(봉화, 청송, 울진, 영덕, 포항, 경주, 청도, 경산 제외), 경상남도(거창, 함양)
            } else {
                LOCALE_CODE = 2;
            }
        }
    }
    // 지역코드를 전역변수에 셋팅
    document.getElementById('locale').value = LOCALE_CODE;
};