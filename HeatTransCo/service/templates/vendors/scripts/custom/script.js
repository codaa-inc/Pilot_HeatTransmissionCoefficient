/**
* 전역변수 영역
*/
let data  = null;      // 전체 데이터
let localeCode = null; // 지역코드
let useCode = null;    // 용도코드
let heatTransCoArr = new Array();       // 열관류율기준
let avgHeatTransCoArr = new Array();    // 평균열관류율기준

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
        setHeatTransCoPointEpi();   //열관류율기준값, 배점, EPI 기준값 셋팅
        setInitValue();             //초기데이터 셋팅


    } else {
        alert("지역과 용도를 선택하세요.");
    }
}

/**
* 초기 데이터 셋팅 함수
*/
function setInitValue() {
    $("#wall-direct-kind-1 option:eq(1)").prop("selected", "selected");
    $("#wall-indirect-kind-1 option:eq(1)").prop("selected", "selected");
    $('#wall-direct-thick-1 option:eq(11)').prop("selected", "selected");
    $('#wall-indirect-thick-1 option:eq(11)').prop("selected", "selected");
    $("#wall-direct-kind-2 option:eq(58)").prop("selected", "selected");
    $("#wall-indirect-kind-2 option:eq(58)").prop("selected", "selected");
    $('#wall-direct-thick-2 option:eq(11)').prop("selected", "selected");
    $('#wall-indirect-thick-2 option:eq(11)').prop("selected", "selected");
    $("#wall-direct-kind-3 option:eq(1)").prop("selected", "selected");
    $("#wall-indirect-kind-3 option:eq(1)").prop("selected", "selected");
    $('#win-direct-kind-1 option:eq(1)').prop("selected", "selected");
    $('#win-indirect-kind-1 option:eq(1)').prop("selected", "selected");

    
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
            $('#' + thick.id).val(0);
            $('#' + thick.id).prop("disabled", true);
        } else {
            $('#' + thick.id).prop("disabled", false);
        }

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
    setAvgHeatTransCo(id);
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
*  지역별 열관류율 기준값, 지자체별 평균열관류율 기준값,배점을 셋팅하는 함수
*/
function setHeatTransCoPointEpi() {;
    // 지역별 열관류율 기준값을 전역변수에 담는다.
    const arr = data[6].heatTransmissionCoefficient;
    for(const i in arr) {
        if(useCode == arr[i]['useCode'] && localeCode == arr[i]['localeCode']) {
            heatTransCoArr = arr[i]['value'];
            break;
        }
    }
    // 지역별 열관류율 기준값 셋팅
    const targetArr = ['wall-direct-locale', 'wall-indirect-locale', 'win-direct-locale', 'win-indirect-locale'];
    for(let i in targetArr) {
        document.getElementById(targetArr[i]).innerHTML = "기준 "
            + (heatTransCoArr[i]).toFixed(3) + " 이하"
            //+ "&nbsp;<i class=\"icon-copy fa fa-long-arrow-down\" aria-hidden=\"true\"></i>";
    }
    // 지자체별 평균열관류율 기준값을 전역변수에 담는다.
    const meanArr = data[7].MeanHeatTransmissionCoefficient;
    for(const i in meanArr) {
        if(useCode == arr[i]['useCode'] && localeCode == arr[i]['localeCode']) {
            avgHeatTransCoArr = meanArr[i]['value'];
            break;
        }
    }
    // 지자체별 평균열관류율, 배점을 셋팅
    const epi = document.getElementById('wall-avg-locale');
    const point = document.getElementById('wall-avg-point');
    for(const i in meanArr) {
        if(useCode == meanArr[i]['useCode'] && localeCode == meanArr[i]['localeCode']) {
            epi.innerText = "지자체\n" + meanArr[i]['value'][0] + "\n이하"
                           // + "&nbsp;<i class=\"icon-copy fa fa-long-arrow-down\" aria-hidden=\"true\"></i>"
            point.innerText = "외벽배점\n" + meanArr[i]['point'] + "점";
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
    setAvgHeatTransCo(id);
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
function setAvgHeatTransCo(id) {
    const inputId = id.split("-")[0];
    let outputId = "";
    let arr = new Array();
    let avgTrans = 0;
    
    if (inputId == "wall" || inputId == "win") {      // 외벽평균열관류율
        arr = ["wall-direct-width", "wall-direct-trans", "wall-indirect-width", "wall-indirect-trans",
               "win-direct-width", "win-direct-trans", "win-indirect-width", "win-direct-trans" ]
        outputId = 'wall-avg-trans';
        for(const i in arr) {
            if (i % 2 == 1) {   //열관류율값 추출
                arr[i] = Number(setValidNum((document.getElementById(arr[i]).innerText).replace("열관류율 ", "")));
            } else {            //면적값 추출
                arr[i] = Number(setValidNum(document.getElementById(arr[i]).value));
            }
        }
        avgTrans = calcAvgHeatTransCo(inputId, arr); // 평균열관류율 연산

    } else if (inputId == "roof") {                  // 지붕평균열관류율


    } else if (inputId == "floor") {                 // 바닥평균열관류율


    }

    if (avgTrans > 0) {
        document.getElementById(outputId).innerText = "외벽평균\n열관류율\n" + avgTrans;
    }

    // 열관류율 검토결과 출력
    setSatisfyResult();
    // 평균열관류율 검토결과 출력
    setSatisfyAvgResult();
};

/**
 *열관류율 검토결과를 셋팅하는 함수
 * */
function setSatisfyResult(){
    // 검토결과를 출력할 p태그 ID
    const resultArr = ['wall-direct-result', 'wall-indirect-result', 'win-direct-result', 'win-indirect-result'];
    // 검토대상인 열관류율
    const transArr = ['wall-direct-trans', 'wall-indirect-trans', 'win-direct-trans', 'win-indirect-trans'];
    for (let i in transArr) {
        const trans = (document.getElementById(transArr[i]).innerText).replace("열관류율 ", "");
        if (Number(trans) <= Number(heatTransCoArr[i])) {
            document.getElementById(resultArr[i]).innerText = "만족";
            document.getElementById(resultArr[i]).style.color = "#0D47A1";
        } else {
            document.getElementById(resultArr[i]).innerText = "불만족";
            document.getElementById(resultArr[i]).style.color = "#C62828";
        }
    }
};

/**
 * 평균열관류율 검토결과를 셋팅하는 함수
 * */
function setSatisfyAvgResult(){
    // 검토결과를 출력할 p태그 ID
    const resultArr = ['wall-avg-result'];
    // 검토대상인 열관류율
    const transArr = ['wall-avg-trans'];
    for (let i in transArr) {
        const trans = ((document.getElementById(transArr[i]).innerText)
            .replace("외벽평균", "")).replace("열관류율", "");
        if (Number(trans) <= Number(avgHeatTransCoArr[i])) {
            document.getElementById(resultArr[i]).innerText = "만족";
            document.getElementById(resultArr[i]).style.color = "#0D47A1";
        } else {
            document.getElementById(resultArr[i]).innerText = "불만족";
            document.getElementById(resultArr[i]).style.color = "#C62828";
        }
    }
};

/**
* 평균열관류율을 연산하는 함수
* Param : 부위구분, number array
* Retruen : 평균열관류율
*/
function calcAvgHeatTransCo(target, arr) {
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
        var idx = $("option", $(this)).index($("option:selected", $(this)));
        var area = "area" + Number(idx - 1);    // 선택지역의 구군 Array
        var $gugun = $("#gugun1");                    // 선택영역 군구 객체
        // 2 Depth
        if (idx == 10 || idx == 11 || idx == 15 || idx == 16) {
            $gugun.children('option:not(:first)').remove();     // 구군 콤보박스 초기화
            $gugun.css("display", "");                    // 구군 콤보박스 toggle
            $gugun.append("<option value='0' selected disabled hidden>구/군 선택</option>");
            $.each(eval(area), function () {
                $gugun.append("<option value='" + this + "'>" + this + "</option>");
            });
        // 1 Depth
        } else {
            $gugun.css("display", "none");  // 구군 콤보박스 toggle
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
            localeCode = 1;
        // 중부2(서울,경기) : 서울, 경기
        } else if (sido == 1 || sido == 9) {
            localeCode = 2;
        // 남부 : 대구, 전남
        } else if (sido == 5 || sido == 14) {
            localeCode = 3;
        // 남부(부산,광주,울산)
        } else if (sido == 4 || sido == 6 || sido == 7) {
            localeCode = 4;
        // 제주
        } else if (sido == 17) {
            localeCode = 5;
        }
    // 2 Depth
    } else {
        const gangwon = ["고성군", "속초시", "양양군", "강릉시", "동해시", "삼척시"];
        const chungbuk = ["제천"];
        const gyungbuk = ["울진군", "영덕군", "포항시", "경주시", "청도군", "경산시"];
        const gyungnam = ["거창군", "함양군"];
        // 중부1 : 강원도(고성, 속초, 양양, 강릉, 동해, 삼척 제외), 충청북도(제천), 경상북도(봉화, 청송)
        if((sido == 10 && !gangwon.includes(gugun)) || (sido == 11 && chungbuk.includes(gugun)) || (sido == 15 && gyungbuk.includes(gugun))) {
            localeCode = 0;
        // 남부 : 경상북도(울진, 영덕, 포항, 경주, 청도, 경산), 경상남도(거창, 함양 제외)
        } else if ((sido == 15 && gyungbuk.includes(gugun)) || (sido == 16 && !gyungnam.includes(gugun))){
            localeCode = 3;
        // 중부2 : 강원도(고성, 속초, 양양, 강릉, 동해, 삼척), 충청북도(제천 제외), 경상북도(봉화, 청송, 울진, 영덕, 포항, 경주, 청도, 경산 제외), 경상남도(거창, 함양)
        } else {
            localeCode = 1;
        }
    }
    document.getElementById('locale').value = localeCode;
};
