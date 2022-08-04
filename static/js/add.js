function hiddenException() {
    $(".exception").css("display" , "none");
};

window.onload = function() {
    // 경고태그 히든처리
    hiddenException();
}

function writeAjax() {
       $.ajax({
        url :'/add',    // 요청 할 주소
        async : true,       // false 일 경우 동기 요청으로 변경
        type : "POST",      // GET, PUT
        data : {
            writer : $("#writer").val(),
            title : $("#title").val(),
            content : $("#content").val()
        },      // 전송할 데이터
        dataType : "json",        // xml, json, script, html
        beforeSend : function() {},         // 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
        success : function(json) {
            if(json.code == "success") {
                alert("등록완료!");
                location.href = "/";
            } else {
                alert(json.code)
            }
        },      // 요청 완료 시
        error : function() {},      // 요청 실패
        complete : function() {}    // 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
    });
}

function writeCheck() {
    hiddenException()

    if($.trim($("#title").val()) == "") {
        alert('제목을 입력해주세요');
        $("#titleException").css("display" , "");
        return false;
    }

    if($.trim($("#writer").val()) == "") {
        alert('작성자를 입력해주세요');
        $("#writerException").css("display" , "");
        return false;
    }

    if($.trim($("#content").val()) == "") {
        alert('본문을 입력해주세요');
        $("#contentException").css("display" , "");
        return false;
    }
        if(confirm("등록 하시겠습니까?")) {
        writeAjax();
    } else {

    }
};

function historyBack() {
    if(confirm("입력한 정보가 모두 지워집니다 정말 취소 하시겠습니까?")) {
        history.go(-1);
    } else {

    }
};

function secretSecretArticle() {
    if($('input:checkbox[id="secretCheck"]').is(":checked") == true) {
        $("#articlePw").attr("disabled" , false);
    } else{
        $("#articlePw").val("");
        $("#articlePw").attr("disabled" , true);
    }
};

// $('input:checkbox[name="secretCheck"]').is(":checked") == true;