window.onload = function() {
    //페이지로딩시 조회페이지
    viewAjax();
};
function viewAjax() {

    //url에서 게시글 번호 및 페이지번호 추출
    let boardNo = new URLSearchParams(location.search).get("boardNo");

    let viewArticle = {"boardNo" : boardNo};

    $.ajax({
        url :'http://localhost:8080/view',    // 요청 할 주소
        contentType: 'application/json; charset=utf-8',
        processData: false,
        async : true,       // false 일 경우 동기 요청으로 변경
        type : 'POST',      // GET, PUT
        data : JSON.stringify(viewArticle),      // 전송할 데이터
        dataType : 'json',        // xml, json, script, html
        beforeSend : function() {},         // 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
        success : function(jsonData) {
            let param = jsonData.articles[0];

            //서버에서 갖고온 내용 변수할당
            let writer = param.writer;
            let title = param.title;
            let content = param.content;
            let boardNo = param.boardNo;

            //내용 할당 및 수정불가
            $("#writer").val(writer)
            $("#title").val(title)
            $("#boardNo").val(boardNo)
            $("#pageNum").val(pageNum)
            $("#content").html(content)


            $(".viewJquery").attr("disabled" , true);

            //경고태그 히든처리
            $(".exception").css("display" , "none");

            //삭제 버튼 숨김
            $(".modifyShow").css("display","none");
            $(".viewShow").css("display","");


        },      // 요청 완료 시
        error : function() {},      // 요청 실패
        complete : function() {}    // 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
    });
}

function delAjax() {
    let delArticle = {
        "boardNo" : $("#boardNo").val(),
    };

    $.ajax( {
        url :"/del",    // 요청 할 주소
        contentType: 'application/json; charset=utf-8',
        processData: false,
        async : true,       // false 일 경우 동기 요청으로 변경
        type : 'POST',      // GET, PUT
        data : JSON.stringify(delArticle),      // 전송할 데이터
        dataType : 'json',        // xml, json, script, html
        beforeSend : function() {},         // 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
        success : function(jsonData) {
            if(jsonData.code == "success") {
                alert("삭제완료!");
                location.href = "/";  //이전 페이지로
            } else {
                alert(jsonData.code);
            }
        },      // 요청 완료 시
        error : function() {},      // 요청 실패
        complete : function() {}    // 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
    });
}

function modifyAjax() {
    let modifyArticle = {
        "boardNo": $("#boardNo").val(),
        "title" : $("#title").val(),
        "writer" : $("#writer").val(),
        "content" : $("#content").val()
    }


    $.ajax( {
        url :"/modify",    // 요청 할 주소
        contentType: 'application/json; charset=utf-8',
        processData: false,
        async : true,       // false 일 경우 동기 요청으로 변경
        type : "POST",      // GET, PUT
        data : JSON.stringify(modifyArticle),      // 전송할 데이터
        dataType : "json",        // xml, json, script, html
        beforeSend : function() { },         // 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
        success : function(jsonData) {
            if(jsonData.code == "success") {               //이상없이 성공시
                alert("수정완료");
                viewAjax();                                //조회창으로 이동
                $("#titleHead").html("조회페이지");    //타이틀 변경
                $("#articlePw").val("");
            }else {
                alert(jsonData.code);
            }

        },      // 요청 완료 시
        error : function() {},      // 요청 실패
        complete : function() {}    // 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
    });
}
//조회창에서 수정창 이동시 html 변환
function modifyBtnClick() {
    $("#titleHead").html("수정페이지")                // 타이틀 변경
    $(".viewJquery").attr("disabled" , false);// 텍스트 창 disabled 해제
    // 버튼 변경
    $(".modifyShow").css("display","")        // 수정창에 필요한 정보 소환
    $(".viewShow").css("display","none")      // 조회창에 필요한 정보 감춤
    if($('input:checkbox[id="secretCheck"]').is(":checked") == false){  // 공개글일경우
        $("#articlePw").attr("disabled" , true);                    //비밀번호 입력창 비활성화
    }

}
//수정창에서 뒤로가기시 확인
function historyBack() {
    if(confirm("입력한 정보가 모두 지워집니다 정말 취소 하시겠습니까?")) {
        viewAjax();
    } else {
    }
}
//조회창에서 뒤로가기버튼
function viewBack() {
    location.href = "/";
}
//삭제확인
function delCheck(){
    if(confirm("정말 삭제 하시겠습니까?")) {
        delAjax();
    } else {

    }
}
//수정완료시 공백및 비밀번호 체크
function modifyCheck() {

    $(".exception").css("display", "none");

    if ($.trim($("#title").val()) == "") {
        alert('제목을 입력해주세요');
        $("#titleException").css("display", "");
    }

    if ($.trim($("#writer").val()) == "") {
        alert('작성자를 입력해주세요');
        $("#writerException").css("display", "");
    }

    if ($.trim($("#content").val()) == "") {
        alert('본문을 입력해주세요');
        $("#contentException").css("display", "");
    }

    if (confirm("수정 하시겠습니까?")) {
        modifyAjax();
    }
    // }
}
