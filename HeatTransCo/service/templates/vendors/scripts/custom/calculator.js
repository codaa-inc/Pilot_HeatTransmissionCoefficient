/**
* JSON 데이터를 호출하는 함수
*/
fetch('data/').then((response) => response.json()).then((json) => initSet(json));

/**
* 페이지 로딩 시 JSON 데이터를 호출, 초기값을 셋팅하는 함수
*/
function initSet(items) {
    console.log(items);
    var material = items[0].materialThermalConductivity;
    for(var i in material) {
        var op = new Option();
        op.value = i;
        op.text = material[i]['material'];
        console.log(op)
        // select 태그에 생성 된 option을 넣는다.
        document.forms["wallForm"].materialWallDirect.add(op);
        document.forms["wallForm"].materialWallIndirect.add(op);
    }
};


