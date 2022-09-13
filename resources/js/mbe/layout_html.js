var headerHtml = function(title) {
	var _title = title ? title : '부산은행';
	var html = '';
		html += '<header id="header">';
		html += '<div class="header_inner">';
		html += '<button type="button" class="btn_header_prev" ><em class="blind">이전</em></button>';
		html += '<h1 class="header_tit">' + _title + '</h1>';
		html += '<div class="header_util">';
		html += '<button type="button" class="btn_header_search"><em class="blind">통합검색</em></button>';
		html += '<button type="button" class="btn_header_alarm"><em class="blind">알람</em></button>';
//		html += '<button type="button" class="btn_header_gnb" aria-haspopup="true" aria-controls="gnbWrap">GNB MENU</button>';
		html += '</div>';
		html += '</div>';
		html += '</header>';

	document.write(html);
}


var gnbHtml = function() {
	var html = '';
		html += '<nav id="gnbWrap" aria-hidden="true" aria-label="전체메뉴">';
		html += '<div class="gnb_box">';
		html += '<div class="gnb_list_box">';
		html += '<ul>';
		html += '<li><a href="#">GNB MENU</a></li>';
		html += '<li><a href="#">GNB MENU</a></li>';
		html += '<li><a href="#">GNB MENU</a></li>';
		html += '<li><a href="#">GNB MENU</a></li>';
		html += '<li><a href="#">GNB MENU</a></li>';
		html += '<li><a href="#">GNB MENU</a></li>';
		html += '</ul>';
		html += '</div>';
		html += '<button type="button" class="btn_gnb_close"><em class="blind">닫기</em></button>';
		html += '</div>';
		html += '</nav>';

	document.write(html);
}
