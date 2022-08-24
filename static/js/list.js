window.onload = function() {
    ajaxGetList();
}

function ajaxGetList() {
    $.ajax( {
        url : "http://localhost:8080/",    // 요청 할 주소
        processData : false,    // 데이터 객체를 문자열로 바꿀지에 대한 값이다. true면 일반문자...
        contentType : false,    // 해당 타입을 true로 하면 일반 text로 구분되어 진다.
        async : true,           // false 일 경우 동기 요청으로 변경
        type : "POST",          // GET, PUT
        data : "",              // 전송할 데이터
        dataType : "json",      // xml, json, script, html
        beforeSend : function() {},     // 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
        success : function(json) {
            // 게시글 뿌리기
            let list = json.articles;

            $("#aaa").html(json.user);



            $("#listTbody").html("");
            let row = ""
            for(let i = 0; i < list.length; i++) {

                let index = i+1;
                // <tr>내의 td 내용 저장
                row += "<td class='listArticle'>" + index + "</td>";
                row += "<td class='listArticle'>" + list[i].writer + "</td>";
                row += "<td class='listArticle'>" + "<a id='titleAnchor" + i + "'>" + list[i].title + "</a></td>";
                row += "<td class='listArticle'>" + formatDate(list[i].regDate) + "</td>";

                // 테이블 내에 tr 생성후 innerhtml로 td 추가
                $("#listTbody").append($("<tr>").attr("id","articleLink" + i).html(row));

                // 제목에 앵커 링크 추가
                $("#titleAnchor" + i ).attr("href","view?boardNo=" + list[i].boardNo);

                // td 내용 리셋
                row = ""
            };
        },      // 요청 완료 시
        error : function() {},      // 요청 실패
        complete : function() {}    // 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
    });
}

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if(month.length < 2) {
        month = '0' + month;
    }

    if(day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
}

function searchReset() {
    document.getElementById('searchArticleForm').reset();
    document.getElementById('pageNum').value = 1;
    ajaxGetList();
}

function movePage(x) {
    document.getElementById('pageNum').value = x;
    ajaxGetList();
}

function searchSet() {
    document.getElementById('pageNum').value = 1;
    ajaxGetList();
}

function addBtnClick() {

}