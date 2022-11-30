/*********************************************************************************************************
DOCUMENT READY
*********************************************************************************************************/
var $page_ID = null;
$(document).ready(function() {
	if($page_ID == null) {
		$page_ID = $('#container');
	}
	goToTop();
});

var reAct = function() {
	setTimeout(function() {
		contsPaddingSet();// 메인 화면 하단 여백 삽입
	}, 0);

//	inputEvtFocus();// 인풋요소 포커스 디자인 인터렉션 이벤트 바인드
//	goToTop();
}

var contsPaddingSet = function(dom) {
	var _pageID = dom ? $(dom) : $page_ID;
	var _contsEl = _pageID.hasClass('contents') ? _pageID : $('.contents', _pageID);
	var _pageBotFixed = $('[class^="page_bottom_fixed"]', _pageID);

	if(_pageBotFixed.length) {
		_pageBotFixed.each(function(i) {
			var _this = $(this);

//			var _padB = _this.outerHeight() + 16;
//			_contsEl.css('padding-bottom', _padB);
			_contsEl.css('padding-bottom', 114);
		});
	}
}


/* 탑으로가기 */
var goToTop = function() {
	var _pageID = $page_ID;
	var _btnTop = $('.btn_go_top');

	/* 스크로로 방향 체크 */
	var _pubLastScrollY = 0;
	var scrollDir = function() {
		var _srollY = $(window).scrollTop();
		var _dir = _pubLastScrollY - _srollY < 0 ? 'down' : 'up';
		_pubLastScrollY = _srollY;
		return _dir;
	}


	if(_btnTop.length) {
		$(window).scroll(function(e) {
			var _scrollDir = scrollDir();

			if(_pubLastScrollY === 0) {
				_btnTop.hide().attr('aria-hidden', 'true');
				return;
			}

			if(_scrollDir == 'up' && _pubLastScrollY != 0) {
				_btnTop.show().attr('aria-hidden', 'false');
			} else if(_scrollDir == 'down') {
				_btnTop.hide().attr('aria-hidden', 'true');
			}
		});
	}

	_btnTop.on('click', function() {
		$('html, body').animate({
			scrollTop : 0
		}, 300);
	});
}

/*********************************************************************************************************
	input focusin 일반 키패트 대응
*********************************************************************************************************/
var keypadFocusSetTime = undefined;
var keypadFocusFn = function(el) {
	var setScrollPos = function() {
		var _targetEl = $(el).closest('[class^="inp_bundle"], [class^="modify_bundle_item"]');
		var _scrollEl = $('body, html');

		if(!_targetEl.length) return;

		var _offT = _targetEl.offset().top;
		var _scrollT = _scrollEl.scrollTop();
		var _movY = undefined;

		if(IS_ANDROID) {
			if(_targetEl.closest('.layer_container').length > 0) {
				_scrollEl = _targetEl.closest('.layer_container');
				_scrollT = _scrollEl.scrollTop();
				_movY = _offT - 130;
				_movY = Math.abs(_movY + _scrollT);
			}else{
				_movY = _offT - 130;
			}

			if(_movY) {
				if(keypadFocusSetTime != undefined) clearTimeout(keypadFocusSetTime);
				keypadFocusSetTime = setTimeout(function() {
					_scrollEl.scrollTop(_movY)
				}, 200);
			}

			_scrollEl.scrollTop(_movY);
		}
//		else if(IS_IOS){
//			var _scrollPos;
//			if(_targetEl.closest('.layer_container').length > 0) {
//				_scrollEl = _targetEl.closest('.layer_container');
//				_scrollPos = $('.layer_contents', _scrollEl).outerHeight() - (_offT - _targetEl.closest('.layer_wrap').find('.layer_header').outerHeight());
//			}else{
//				_scrollPos = $('#wrap').outerHeight() - _offT;
//			}
//			if(window.innerHeight / 2 > _scrollPos) {
//				_movY = _scrollT + 50;
//			}
//			if(_movY) setTimeout(function() {_scrollEl.scrollTop(_movY)}, 200);
//		}
	}

	if(keypadFocusSetTime != undefined) clearTimeout(keypadFocusSetTime);
	keypadFocusSetTime = setTimeout(function() {
		setScrollPos();
//		_scrollEl.scrollTop(_movY)
	}, 200);

}

/*********************************************************************************************************
	input event bind
*********************************************************************************************************/
//inp_bundle 포커스 dom클릭시 포커스 아웃 처리
$(document).on('click', function(e) {
	var _el = $(e.target);
	var _inpWrap = _el.closest('[class^="inp_bundle"]');
	var _inpReset = false;

	if($('#wrap').find('input').length == 0) return;

	if(_el.prop('tagName') != 'INPUT'){
		if(_el.prop('tagName') != 'BUTTON' || !_el.hasClass('[class^="btn_inp_del"]')) {//인풋 컴포넌트 value삭제 버튼 예외처리
			_inpReset = true;
		}

		if(_el.prop('tagName') == 'BUTTON') {
			if(_el.closest('[class^="btn_group_wrap"]').length && _el.hasClass('disabled') && !_el.prop('disabled')) {//submit disabled 버튼 클릭 이벤트시
				_inpReset = false;
			}
			if(_el.closest('[class^="btn_layer_wrap"]').length && _el.hasClass('disabled') && !_el.prop('disabled')) {//submit disabled 버튼 클릭 이벤트시
				_inpReset = false;
			}
		}
	}else if(_el.prop('tagName') == 'INPUT' && !_inpWrap.length){
		_inpReset = true;
	}

	if(_inpReset) {
		$('[class^="inp_bundle"]').removeClass('focus val').find('.btn_inp_del').remove();
		$('.inp_bundle_email').removeClass('domain').find('.domain_box').hide().attr('aria-hidden', 'true');
	}
});
//inp_bundle click시 인풋요소에 포커스
$(document).on('click', '[class^="inp_bundle"]', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _focusArea = $('input:first', _this);
	if(!_this.hasClass('inp_bundle_textarea')) _focusArea.focus();
});
//input[type="text"]에 click이벤트 상쇄
$(document).on('click', '[class^="inp_bundle"] input', function(e) {e.stopPropagation();});
//input[type="text"]에 focus in
$(document).on('focusin keyup change', '[class^="inp_bundle"] input', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _val = _this.val();
	var _bundle = _this.closest('[class^="inp_bundle"]');
	var _inpTxt = _this.closest('[class^="inp_txt"]');
	var _btnDelHtml = '<button type="button" class="btn_inp_del" aria-hidden="true"><span class="blind">입력값 삭제</span></button>';
	var _inpFlexCase = _inpTxt.closest('[class^="inp_flex"]');
	var _appendEl = _inpTxt;
	var _isVal = false;

	if(_inpFlexCase.length) {
		var _excepClass = ['inp_flex_amount', 'inp_flex_unit'];
		var _hasExcepClass = false;

		for(var i = 0; i < _excepClass.length; i++) {
			if(!_hasExcepClass) _hasExcepClass = _inpFlexCase.attr('class').indexOf(_excepClass[i]) >= 0 ? true : false;
		}

		if(_hasExcepClass) {
			_appendEl = _inpTxt;
		}else{
			_appendEl = _inpFlexCase;
		}
	}
	$('input', _bundle).each(function() {
		if(!_isVal) _isVal = $(this).val() == '' ? false : true;
	});

	if(e.type == 'focusin') {
		$('[class^="inp_bundle"]').removeClass('focus val').find('.btn_inp_del').remove();
		if(_bundle.hasClass('inp_bundle_email') && !_bundle.hasClass('domain')) {
			$('.inp_bundle_email').removeClass('domain').find('.domain_box').hide().attr('aria-hidden', 'true');
		}

	}
	_bundle.addClass('focus');
	if(!$('.btn_inp_del', _bundle).length) _appendEl.append(_btnDelHtml);
	if(_val == '' && !_isVal) {
		_bundle.removeClass('val');
		$('.btn_inp_del', _appendEl).hide().attr('aria-hidden', 'true');
	}else {
		_bundle.addClass('val');
		$('.btn_inp_del', _appendEl).show().removeAttr('aria-hidden');
	}
});
//btn_inp_del 클릭시 value삭제
$(document).on('click', '[class^="inp_bundle"] .btn_inp_del', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _bundle = _this.closest('[class^="inp_bundle"]');
	var _inpTxt = $('[class^="inp_txt"]', _bundle);
	var _inp = $('input', _bundle);

	_inp.val('').eq(0).focus();
});
//btn_inp_del focusin 이벤트 상쇄
$(document).on('focusin', '[class^="inp_bundle"] .btn_inp_del', function(e) {e.stopPropagation();});
/*통합검색 입력 박스 키보드 음성변경 버튼*/
$(document).on('click', '[class^="inp_bundle"] .keyboard_btn, [class^="inp_bundle"] .voice_btn', function(e) {e.stopPropagation();});
//search_btn 클릭시 이벤트 상쇄
$(document).on('click', '[class^="inp_bundle"] .search_btn', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _bundle = _this.closest('[class^="inp_bundle"]');
	_bundle.removeClass('val');
	$('.btn_inp_del', _bundle).hide().attr('aria-hidden', 'true');
});

/* data-filter대응 */
var addFilterUI = function(el) {
	var _el = $(el);
	_el.on('keyup change', function(e) {
		e.stopPropagation();
		var _this = $(this);
		var _val = _this.val();
		var _bundle = _this.closest('[class^="inp_bundle"]');
		var _inpTxt = _this.closest('[class^="inp_txt"]');
		var _btnDelHtml = '<button type="button" class="btn_inp_del" aria-hidden="true"><span class="blind">입력값 삭제</span></button>';
		var _inpFlexCase = _inpTxt.closest('[class^="inp_flex"]');
		var _appendEl = _inpTxt;
		var _isVal = false;

		if(_inpFlexCase.length) {
			var _excepClass = ['inp_flex_amount', 'inp_flex_unit'];
			var _hasExcepClass = false;

			for(var i = 0; i < _excepClass.length; i++) {
				if(!_hasExcepClass) _hasExcepClass = _inpFlexCase.attr('class').indexOf(_excepClass[i]) >= 0 ? true : false;
			}

			if(_hasExcepClass) {
				_appendEl = _inpTxt;
			}else{
				_appendEl = _inpFlexCase;
			}
		}
		$('input', _bundle).each(function() {
			if(!_isVal) _isVal = $(this).val() == '' ? false : true;
		});

		if(e.type == 'focusin') $('[class^="inp_bundle"]').removeClass('focus val').find('.btn_inp_del').remove();
		_bundle.addClass('focus');
		if(!$('.btn_inp_del', _bundle).length) _appendEl.append(_btnDelHtml);
		if(_val == '' && !_isVal) {
			_bundle.removeClass('val');
			$('.btn_inp_del', _appendEl).hide().attr('aria-hidden', 'true');
		}else {
			_bundle.addClass('val');
			$('.btn_inp_del', _appendEl).show().removeAttr('aria-hidden');
		}
	}).change();
}

/*********************************************************************************************************
	이메일 입력 포커스
*********************************************************************************************************/
$(document).on('click', '.inp_bundle_email .domain_box button', function(e) {e.stopPropagation();});
$(document).on('focusin', '.inp_bundle_email .domain_box button', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _inpEmail = _this.closest('.inp_bundle_email');
	var _domainBox = $('.domain_box', _inpEmail);
	var _domainBoxInner = $('.inner', _domainBox);

	if(!_inpEmail.find('.emailFoucsMov').length) _domainBox.append('<div class="emailFoucsMov" aria-label="도메인 리스트 처음으로 이동 및 리스트 없을 시 입력박스로 이동" style="overflow:hidden;height:0;line-height:0;font-size:1px;" tabindex="0" aria-hidden="true"></div>');

});
$(document).on('focusin', '.inp_bundle_email .emailFoucsMov', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _inpEmail = _this.closest('.inp_bundle_email');
	var _inp = $('input', _inpEmail);
	var _domainBox = $('.domain_box', _inpEmail);
	var _domainBoxInner = $('.inner', _domainBox);
	var _listItem = $('button', _domainBoxInner);

	if(_listItem.length) {
		_listItem.eq(0).focus();
	}else{
		_inp.focus();
	}


});

/*********************************************************************************************************
	수정 인풋박스 modify_bundle_item
*********************************************************************************************************/
$(document).on('keyup change paste', '[class^="modify_bundle_item"] [class^="inp_modify"] input', function(e) {
	var _this = $(this);
	var _bundleWrap = _this.closest('[class^="modify_bundle_item"]');
	var _hiddenTxt = $('> .modify_view', _bundleWrap);
	var _txt = _this.val() == '' ? _this.attr('placeholder') : _this.val();

	_hiddenTxt.text(_txt);
});
$(document).on('click', '[class^="modify_bundle_item"] [class^="modify_btn"]', function(e) {
	var _this = $(this);
	var _itemWrap = _this.closest('[class^="modify_bundle_item"]');
	var _viewTxt = $('.modify_view', _itemWrap);
	var _inp = $('[class^="inp_modify"] input', _itemWrap);
	var _btn = $('.modify_btn', _itemWrap);
	_viewTxt.attr('aria-hidden', 'true');

	_itemWrap.addClass('active');
	_itemWrap.addClass('focus');
	_inp.attr('disabled', false).focus();
//	$('span', _btn).removeClass('blind').text('저장');
});
$(document).on('click', '[class^="modify_bundle_item"].active [class^="modify_btn"]', function(e) {
	var _this = $(this);
	var _itemWrap = _this.closest('[class^="modify_bundle_item"]');
	var _viewTxt = $('.modify_view', _itemWrap);
	var _inp = $('[class^="inp_modify"] input', _itemWrap);
	var _btn = $('.modify_btn', _itemWrap);
	_viewTxt.attr('aria-hidden', 'true');

	_viewTxt.removeAttr('aria-hidden');
	_itemWrap.removeClass('focus');
	_itemWrap.removeClass('active');
	_inp.attr('disabled', true);
	_this.focus();
//	$('span', _btn).addClass('blind').text('수정');
});

/*********************************************************************************************************
	이체금액 입력
**********************************************************************************************************/
$(document).on('keyup change paste', '.inp_amount02 input', function(e) {
	var _this = $(this);
	var _bundleWrap = _this.closest('.inp_amount02');
	var _hiddenTxt = $('.hide_txt', _bundleWrap);
	var _txt = _this.val() == '' ? _this.attr('placeholder') : _this.val();

	_hiddenTxt.text(_txt);
});


/*********************************************************************************************************
	SELECT DROP DOWN
 *********************************************************************************************************/
$(document).on('click focusin', function() {
	$('.combo_bundle02').removeClass('focus');
	$('.combo_bundle02 > button').attr('aria-expanded', 'false');
	$('.combo_bundle02 .combo_opt_box').slideUp(300).attr('aria-hidden', 'true');
	$('.combo_bundle02 .combo_opt_box .comboFoucsMov').remove();
});
$(document).on('click', '.combo_bundle02 > button', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _bundle = _this.closest('.combo_bundle02');
	var _optBox = $('.combo_opt_box', _bundle);
	var _isExpanded = _this.attr('aria-expanded');


	if(_isExpanded == 'false') {
		$('.combo_bundle02').removeClass('focus');
		$('.combo_bundle02 > button').attr('aria-expanded', 'false');
		$('.combo_bundle02 .combo_opt_box').hide().attr('aria-hidden', 'true');
		$('.combo_bundle02 .combo_opt_box .comboFoucsMov').remove();

		_bundle.addClass('focus');
		_this.attr('aria-expanded', 'true');
		_optBox.slideDown(300).attr('aria-hidden', 'false');
		_optBox.append('<div class="comboFoucsMov" style="overflow:hidden;height:0;line-height:0;font-size:1px;" tabindex="0" aria-hidden="true"></div>')
		$('.comboFoucsMov', _optBox).off().on('focusin', function(e) {
			e.stopPropagation();
			$('li:first button', _optBox).focus()
		});
	} else if(_isExpanded == 'true') {
		_this.attr('aria-expanded', 'false');
		_optBox.slideUp(300).attr('aria-hidden', 'true');
		$('.comboFoucsMov', _optBox).remove();
	}
});
$(document).on('focusin', '.combo_bundle02 button', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _bundle = _this.closest('.combo_bundle02');
	var _optBox = $('.combo_opt_box', _bundle);
	var _isExpanded = _this.attr('aria-expanded');

	_bundle.addClass('focus');
});
$(document).on('focusout', '.combo_bundle02 button', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _bundle = _this.closest('.combo_bundle02');
	var _optBox = $('.combo_opt_box', _bundle);
	var _isExpanded = _this.attr('aria-expanded');

	_bundle.removeClass('focus');
});
$(document).on('click', '.combo_bundle02 .combo_opt_box button', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _thisVal = _this.data('value');
	var _thisChild = $('> span', _this);
	var _bundle = _this.closest('.combo_bundle02');
	var _btnBundle = $('> button', _bundle);
	var _inpHidden = $('input[type="hidden"]', _bundle);
	var _optBox = $('.combo_opt_box', _bundle);
	var _selectView = $('.selected', _btnBundle);

	if(_inpHidden.val() != _thisVal) {
		if(_thisChild.children().length > 0) {
			_selectView.empty().append(_thisChild.children().clone()).attr('aria-hidden', 'false');
		}else{
			_selectView.text(_thisChild.text()).attr('aria-hidden', 'false');
		}
		_inpHidden.val(_thisVal);
	}
	_btnBundle.attr('aria-expanded', 'false');
	_optBox.slideUp(300, function() {
		_btnBundle.focus();
	}).attr('aria-hidden', 'true');
	$('.comboFoucsMov', _optBox).remove();
});

/*********************************************************************************************************
	button checkbox
*********************************************************************************************************/
$(document).on('click', '[class^="btn_check"]', function() {
	var _this = $(this);
	var _page = _this.closest('.contents');
	var _isChecked = _this.attr('aria-pressed');


	if(_isChecked == 'false') {
		if(_this.hasClass('btn_check02')) $('.btn_check02', _page).attr('aria-pressed', 'false')
		_this.attr('aria-pressed', 'true');
	}else{
		_this.attr('aria-pressed', 'false');
	}

});

/*********************************************************************************************************
	TAB
*********************************************************************************************************/
var initTabFn = function(dom, el, opt) {
	var tabExFnc = new tabControlFn(el, opt, dom);

	$(dom).data('uiTabFnc', tabExFnc);
}

var tabControlFn = function(target, options, dom) {
	var gl = this;
	this.el = {}

	if(dom) this.el.dom = $(dom);

	this.el.targetWrap = dom ? $(target, this.el.dom) : $(target);
	this.el.innerWrap = $('> .tab_list_inner', this.el.targetWrap);

	// data-tab-name
	this.el.tabUiName = this.el.targetWrap.attr('tab-name');

	// rol : tablist
	this.el.tabList = $(' > [role="tablist"], > .tab_list', this.el.innerWrap);
	this.el.tabItemsCase = $('> [class^="tab_item"]', this.el.tabList);
	this.el.tabItems = $(' > a, > button', this.el.tabItemsCase);

	// expanded list button
	this.el.btnFold = $('> [class^="btn_tab_fold"]', this.el.targetWrap);

	// rol : tabpanel
	this.el.tabPanelName = 'panel_' + this.el.tabUiName;
	this.el.tabPanelWrap =  dom ? $('[tab-name="' + this.el.tabPanelName + '"]', this.el.dom) : $('[tab-name="' + this.el.tabPanelName + '"]');
	this.el.tabPanelItems = $('> [role="tabpanel"]', this.el.tabPanelWrap);
	this.el.tabPanelSwipeBox = $(this.el.tabPanelWrap).closest('[class^="panel_swiper_box"]');

	// fixed box
	this.el.tabFixedWrap = this.el.targetWrap.closest('[class^="tab_fixed_box"]');

	// layer wrap
	this.el.layerWrap = this.el.targetWrap.closest('[class^="layer_wrap"]');

	this.oldIdx = 0; // tab position old index
	this.nowIdx = 0; // tab position index

	this.options = options ? options : {};// func options
	this.isSwiperUI = this.options.swiperUI != undefined ? this.options.swiperUI : false;
	this.swiperPanel = undefined;

	this.initialFn = function() {
		this.el.innerWrap.scrollLeft(0);
		this.setTabAttrFn();
	}

	// id, aria 속성 셋팅
	this.setTabAttrFn = function() {
		var _tabObj = this;
		var _tabEl = this.el;
		var _lastInt = _tabEl.tabItems.length;

		this.el.tabPanelSwipeBox.attr('tab-swiper-panel', this.el.tabPanelName);

		_tabEl.tabItems.each(function(i) {
			var _this = $(this);
			var _num = i + 1;
			var _tabId = ('tab_' + _tabEl.tabUiName) + '_' + (_num < 10 ? '0' + _num : i+1);
			var _tagName = _this.prop('tagName').toUpperCase();

			_this.attr('id', _tabId);

			if(_tagName === 'BUTTON') _tabObj.setPanelAttrFn(i, 'aria-labelledby', _tabId);
			if($(this).parent().hasClass('active')) {
				_this.closest('[class^="tab_item"]').attr('aria-label', '선택됨');
				if(_tagName === 'BUTTON') _tabObj.setPanelAttrFn(i, 'aria-hidden', 'false');
				if(_tagName === 'A') {
					_tabObj.setPanelAttrFn(0, 'aria-labelledby', _tabId);
					_tabObj.setPanelAttrFn(0, 'aria-hidden', 'false');
				}
				_tabObj.oldIdx = _tabObj.idxCycleFn(i - 1);
				_tabObj.nowIdx = i;
			} else {
				if(_tagName === 'BUTTON') _tabObj.setPanelAttrFn(i, 'aria-hidden', 'true');
			}
		});
		// panel swiper
		if(_tabObj.isSwiperUI) {
			_tabObj.swiperPanel = new swiperFn('[tab-swiper-panel="' + this.el.tabPanelSwipeBox.attr('tab-swiper-panel') + '"]', {
				'initialSlide' : _tabObj.nowIdx,
				'pagination' : false,
				'navigation' : false,
				'transitionStart' : function() {
					var _slides = this.slides;
					var _idx = this.realIndex;
					_tabObj.oldIdx = _tabObj.nowIdx;
					_tabObj.nowIdx = _idx;

					_tabObj.scrollMov(_idx);
					_tabObj.tabChFn (_idx);
					_tabObj.panelChFn(_idx);
				},
				'transitionEnd' : function() {
					var _slides = this.slides;
					var _idx = this.realIndex;
					_tabObj.oldIdx = _tabObj.nowIdx;
					_tabObj.nowIdx = _idx;

					_tabEl.tabPanelItems.scrollTop(0);
					_tabEl.tabPanelItems.eq(_idx);
				}
			});

			var _swiperOffset = _tabEl.tabPanelSwipeBox.offset().top;
			var _height = window.innerHeight - _swiperOffset;
			_tabEl.tabPanelItems.css({
				'height' : _height
			});
		}

		// move active tabItem
		if(_tabEl.tabItemsCase.eq(_tabObj.nowIdx).position()) {
			var _activeLeft = _tabEl.tabItemsCase.eq(_tabObj.nowIdx).position().left;
			var _activeWidth = _tabEl.tabItemsCase.eq(_tabObj.nowIdx).outerWidth();

			if(_activeLeft > 0) {
				var _spillover = _activeLeft + _activeWidth;

				if(_tabEl.innerWrap.outerWidth() < _spillover) {
					_tabObj.scrollMov(_tabObj.nowIdx);
				}
			}
		}

		// tab_list_wrap02 접힘/펼침
		if(_tabEl.targetWrap.hasClass('tab_list_wrap02')) {
			var _spillover = _tabEl.tabItemsCase.eq(_tabEl.tabItemsCase.length - 1).position().left + _activeWidth;

			if(_tabEl.innerWrap.outerWidth() < _spillover) {
				_tabEl.targetWrap.addClass('fold');
				$('.btn_tab_fold', _tabEl.targetWrap).attr('aria-hidden', 'false').show();
			} else {
				$('.btn_tab_fold', _tabEl.targetWrap).attr('aria-hidden', 'true').hide();
			}
		} else if(_tabEl.targetWrap.hasClass('tab_list_wrap04')) {
			_tabObj.barChangeFn();
		}

		if(_tabEl.btnFold.length) {
			_tabEl.btnFold.attr('aria-hidden', false);
		}
		if(_tabObj.options.setInit) _tabObj.options.setInit(_tabObj.nowIdx, _tabObj.el.tabPanelItems.eq(_tabObj.nowIdx));
	}


	this.setPanelAttrFn = function(idx, attrName, attrVale) {
		var _tabEl = this.el;
		var _num = idx + 1;
		var _panelId = ('tabpanel_' + _tabEl.tabUiName) + (_num < 10 ? '0' + _num : _num+1);

		_tabEl.tabPanelItems.eq(idx).attr(attrName, attrVale);
		_tabEl.tabItems.eq(idx).attr('aria-controls', _panelId);
	}

	// tab change
	this.tabChFn = function(idx) {
		var _tabEl = this.el;
		_tabEl.tabItems.removeAttr('title');
		_tabEl.tabItems.parent().removeClass('active').removeAttr('aria-label');
		_tabEl.tabItems.eq(idx).closest('[class^="tab_item"]').attr('aria-label', '선택됨');
		_tabEl.tabItems.eq(idx).parent().addClass('active');
	}

	// tab panel change
	this.panelChFn = function(idx) {
		var _tabObj = this;
		var _tabEl = this.el;
		_tabEl.tabPanelItems.attr('aria-hidden', 'true');
		_tabEl.tabPanelItems.eq(idx).attr('aria-hidden', 'false');

		if(!_tabObj.isSwiperUI) {
			/* 검색필터 영역 */
			if($('.list_top_box02', _tabEl.tabPanelWrap).length) {
				$('.list_top_box02', _tabEl.tabPanelWrap).removeClass('fixed').removeAttr('style');
				$('.list_top_box02 .list_top_inner', _tabEl.tabPanelWrap).removeAttr('style');
			}
		}


		if(_tabObj.options.panelChangeAfter) {
			_tabObj.options.panelChangeAfter(idx, _tabEl.tabPanelItems.eq(idx));
		}
	}


	// index recycle function
	this.idxCycleFn = function(idx) {
		var _tabEl = this.el;
		return (_tabEl.tabItems.length + (idx % _tabEl.tabItems.length)) % _tabEl.tabItems.length;
	}

	// tab item disabled check function
	this.isDisabledFn = function(idx) {
		var _tabEl = this.el;
		return _tabEl.tabItems.eq(idx).parent().hasClass('disabled');
	}

	// 탭 백 바 이동 애니메이션
	this.barChangeFn = function() {
		var _tabObj = this;
		var _tabEl = this.el;
		$('.bar_active', _tabEl.tabEltargetWrap).css({
			'width' : _tabEl.tabItemsCase.eq(_tabObj.nowIdx).outerWidth(),
			'left' : _tabEl.tabItemsCase.eq(_tabObj.nowIdx).position().left + 4
		});
	}

	// tab items scroll X 이동
	this.scrollMov = function(i) {
		var _tabEl = this.el;
		var _positionL = _tabEl.tabItemsCase.eq(i).position().left;
		var _tabListType;
		var _mov;
		if(_tabEl.tabItemsCase.eq(i).closest('.tab_list_wrap').length) {
			_tabListType = 'type01';
		} else if(_tabEl.tabItemsCase.eq(i).closest('.tab_list_wrap02').length) {
			_tabListType = 'type02';
		}
		if(_tabListType == 'type01') {
			_mov = _tabEl.innerWrap.scrollLeft() == 0 ? _positionL - 24 : _tabEl.innerWrap.scrollLeft() + (_positionL - 24);
		} else if(_tabListType == 'type02') {
			_mov = _tabEl.innerWrap.scrollLeft() == 0 ? _positionL - 24 : _tabEl.innerWrap.scrollLeft() + (_positionL - 24);
		} else {
			_mov = _tabEl.innerWrap.scrollLeft() == 0 ? _positionL - 14 : _tabEl.innerWrap.scrollLeft() + (_positionL - 14);
		}


		_tabEl.innerWrap.animate({
			scrollLeft : _mov
		}, 300);
	}

	// 화면 스크롤시 상단 고정
	if(this.el.tabFixedWrap.length) {
		var _tabOffsetT;
		var _tabTopFixFn = function(fixT, movT) {
			if(movT >= fixT) {
				gl.el.tabFixedWrap.addClass('fixed');
			}else{
				gl.el.tabFixedWrap.removeClass('fixed');
			}

		}

		if(this.el.layerWrap.length) { // 팝업 내부 탭이 존재 할 경우
			_tabOffsetT = this.el.targetWrap.position().top
			$('.layer_container', this.el.layerWrap).scroll(function() {
				var _fixT = _tabOffsetT - gl.options.fixedT || _tabOffsetT - 68;
				var _scrollT = $(this).scrollTop();
				var _movT = _scrollT + _fixT;

				_tabTopFixFn(_fixT, _movT);
			});
		} else { // 본 화면에 탭이 존재할 경우
			_tabOffsetT = this.el.targetWrap.offset().top;
			$(window).scroll(function() {
				var _fixT = _tabOffsetT - gl.options.fixedT || _tabOffsetT - 68;
				var _scrollT = $(window).scrollTop();
				var _movT = _scrollT;

				if(gl.el.targetWrap.closest('.pageStack, #pageStack').is(':hidden')) return;

				_tabTopFixFn(_fixT, _movT);
			});
		}
	}

	// tab 함수 실행영역

	if(this.el.tabList.attr('role') == 'tablist') {// TAB TYPE
		setTimeout(function() {gl.initialFn();});
	}else{// NAVI TYPE
		setTimeout(function() {
			var _tabObj = gl;
			var _tabEl = gl.el;
			$('> .tab_list > .tab_item.active > a', _tabEl.innerWrap).attr('title', '현재 페이지');
			_nowIdx = $('> .tab_list > .tab_item.active', _tabEl.innerWrap).index();
			if(_tabEl.tabItemsCase.eq(_nowIdx).position()) {
				var _activeLeft = _tabEl.tabItemsCase.eq(_nowIdx).position().left;
				var _activeWidth = _tabEl.tabItemsCase.eq(_nowIdx).outerWidth();

				if(_activeLeft > 0) {
					var _spillover = _activeLeft + _activeWidth;

					if(_tabEl.innerWrap.outerWidth() < _spillover) {
						_tabObj.scrollMov(_tabObj.nowIdx);
					}
				}
			}
		});
		return;
	}

	// 2Depth tab 클릭이벤트 중복방지
	this.el.tabItems.off();

	// click event
	this.el.tabItems.on('click', function() {
		var _tabObj = gl;
		var _tabEl = gl.el;
		var _this = $(this);
		var _thisIdx = _tabEl.tabItems.index(this);
		var _tagName = _this.prop('tagName').toUpperCase();

		if(_this.hasClass('non-ui-event')) return;
		if(_tagName === 'BUTTON') {
			_tabObj.oldIdx = _tabObj.nowIdx;
			_tabObj.nowIdx = _thisIdx;
			_tabObj.tabChFn(_thisIdx);
			_tabObj.panelChFn(_thisIdx);
			_tabObj.scrollMov(_tabObj.nowIdx);

			if(_tabObj.isSwiperUI) {
				_tabObj.swiperPanel.swiper.slideTo(_tabObj.nowIdx);
			}
			if(_tabEl.targetWrap.hasClass('tab_list_wrap04')) {
				_tabObj.barChangeFn();
			}
		}
	});

	// folding button event
	this.el.targetWrap.off().on('click', '> [class^="btn_tab_fold"]', function() {
		var _tabObj = gl;
		var _tabEl = gl.el;
		var _this = $(this);
		if(_tabEl.targetWrap.hasClass('active')) {
			_tabEl.targetWrap.removeClass('active');
			_tabObj.scrollMov(_nowIdx);
			_this.attr('aria-expanded', false);
		}else{
			_tabEl.targetWrap.addClass('active');
			_tabEl.innerWrap.scrollLeft(0);
			_this.attr('aria-expanded', true);
		}

	});

	// tab get active index
	this.activeIndex = function() {return gl.nowIdx;}

	// tab panel 이동
	this.goToPanel = function(idx) {
		gl.oldIdx = gl.nowIdx;
		gl.nowIdx = idx;
		gl.tabChFn(gl.nowIdx);
		gl.panelChFn(gl.nowIdx);
		gl.scrollMov(gl.nowIdx);

		if(gl.isSwiperUI) {
			gl.swiperPanel.swiper.slideTo(gl.nowIdx);
		}
		if(gl.el.targetWrap.hasClass('tab_list_wrap04')) {
			gl.barChangeFn();
		}
	}
}

$(document).on('click', '.search_slide_wrap .btn_search', function() {
	var _this = $(this);
	var _wrap = _this.closest('.search_slide_wrap');
	var _searchBox = $('.opt_search_wrap', _wrap);
	var _isHide = _searchBox.attr('aria-hidden');

	_wrap.addClass('active');
	_searchBox.attr('aria-hidden', 'false');
	$('.deposit_result_list').show().attr('aria-hidden', 'false');
	$('[tab-name="panel_transfer02"]').hide().attr('aria-hidden', 'true');
});
$(document).on('click', '.search_slide_wrap .close_search', function() {
	var _this = $(this);
	var _wrap = _this.closest('.search_slide_wrap');
	var _searchBox = $('.opt_search_wrap', _wrap);
	var _isHide = _searchBox.attr('aria-hidden');

	_wrap.removeClass('active');
	_searchBox.attr('aria-hidden', 'true');
	$('.deposit_result_list').hide().attr('aria-hidden', 'true');
	$('[tab-name="panel_transfer02"]').show().attr('aria-hidden', 'false');
});

/*********************************************************************************************************
Accordion (toggle type)
*********************************************************************************************************/
$(document).on('click', '[class^="toggle_list_wrap"] .toggle_tit', function() {
	var _this = $(this);
	var _thisCase = _this.closest('[class^="toggle_case"]');
	var _thisConts = $('.toggle_conts', _thisCase);
	var _toggleWrap = _this.closest('[class^="toggle_list_wrap"]');
	var _toggleCase = $('[class^="toggle_case"]', _toggleWrap);

	var _scrollPos = function() {
		var _offsetT = _thisCase.offset().top;

		$('body, html').animate({scrollTop : _offsetT - 120}, 300);
	}

	if(_toggleWrap.hasClass('multi')) {
		if(!_thisCase.hasClass('active')) {
			_this.attr('aria-expanded', 'true');
			_thisConts.slideDown(300, function() {
				_scrollPos();
			}).attr('aria-hidden', 'false');
			_thisCase.addClass('active');
		}else{
			_this.attr('aria-expanded', 'false');
			_thisConts.slideUp(300).attr('aria-hidden', 'true');
			_thisCase.removeClass('active');
		}
	}else{
		if(!_thisCase.hasClass('active')) {
			_toggleCase.removeClass('active');
			$('.toggle_tit', _toggleCase).attr('aria-expanded', 'false');
			$('.toggle_conts', _toggleCase).slideUp(300).attr('aria-hidden', 'true');

			_this.attr('aria-expanded', 'true');
			_thisConts.slideDown(300, function() {
				_scrollPos();
			}).attr('aria-hidden', 'false');
			_thisCase.addClass('active');
		}else{
			_this.attr('aria-expanded', 'false');
			_thisConts.slideUp(300).attr('aria-hidden', 'true');
			_thisCase.removeClass('active');
		}
	}
});
/*FAQ 아코디언*/
$(document).on('click', '[class^="toggle_list_wrap"] .faq_tit', function() {
	var _this = $(this);
	var _thisCase = _this.closest('[class^="faq_case"]');
	var _thisConts = $('.faq_conts', _thisCase);
	var _toggleWrap = _this.closest('[class^="toggle_list_wrap"]');
	var _toggleCase = $('[class^="faq_case"]', _toggleWrap);

	if(!_thisCase.hasClass('active')) {
		_toggleCase.removeClass('active');
		$('.faq_tit', _toggleCase).attr('aria-expanded', 'false');
		$('.faq_conts', _toggleCase).slideUp(300).attr('aria-hidden', 'true');

		_this.attr('aria-expanded', 'true');
		_thisConts.slideDown(300).attr('aria-hidden', 'false');
		_thisCase.addClass('active');
	}else{
		_this.attr('aria-expanded', 'false');
		_thisConts.slideUp(300).attr('aria-hidden', 'true');
		_thisCase.removeClass('active');
	}
});

/*********************************************************************************************************
	TOOLTIP
*********************************************************************************************************/
$(document).on('click', '[class^="tip_info_box"] [class^="btn_tip_open"]', function(e) {
	e.stopPropagation();
	e.preventDefault();
	var _globalTipWrap = $('[class^="tip_info_box"]');
	var _this = $(this);
	var _thisW = _this.outerWidth();
	var _winW = $(window).width();
	var _tipWrap = _this.closest('[class^="tip_info_box"]');
	var _tipConts = $('.tip_conts_box', _tipWrap);
	var _tipCase = $('.tip_conts_case', _tipConts);
	var _tipTail = $('.tip_tail', _tipConts);
	var _offsetX = _tipWrap.offset().left;
	var _tipOffsetX = _offsetX - 8;

	if(_tipConts.is(':hidden')) {
		_globalTipWrap.removeClass('active');
		$('.btn_tip_open', _globalTipWrap).attr('aria-expanded', false);
		$('.tip_conts_box', _globalTipWrap).hide().attr('aria-hidden', true)

		_this.attr('aria-expanded', true);
		_tipWrap.addClass('active');
		_tipConts.show(1, function() {
			var _tipZone = _winW - 18;
			var _tipCaseW = _tipCase.outerWidth();
			var _tipOffsetR = _tipZone - (_offsetX + 8);
			var _tipTotalArea = _offsetX + _tipCaseW;
			var _tipHalpW = _tipCaseW / 2;
			var _tipPos = 8;

			if(_tipHalpW < _offsetX && _tipHalpW < _tipOffsetR) {
				_tipPos = _offsetX - (_tipHalpW - 8);
			} else if(_tipHalpW < _offsetX && _tipHalpW > _tipOffsetR) {
				_tipPos = _tipZone - (_tipCaseW - 8);
			}

			_tipCase.css({'transform' : 'translate('+ _tipPos +'px, 0)'});


		}).attr('aria-hidden', false).css({'left' : -(_offsetX)});
		_tipTail.css({'left' : _offsetX})
	}else{
		_this.attr('aria-expanded', false);
		_tipWrap.removeClass('active');
		_tipConts.hide().attr('aria-hidden', true);
	}

	_tipConts.unbind('click').bind('click', function() {
		_this.attr('aria-expanded', false);
		_tipWrap.removeClass('active');
		_tipConts.hide().attr('aria-hidden', true);
	});
});
$(document).on('click', '[class^="tip_info_box"] .btn_tip_close', function() {
	var _this = $(this);
	var _tipWrap = _this.closest('[class^="tip_info_box"]');
	var _tipOpenBtn = $('.btn_tip_open', _tipWrap);
	var _tipConts = $('.tip_conts_box', _tipWrap);

	_tipOpenBtn.attr('aria-expanded', false);
	_tipWrap.removeClass('active');
	_tipConts.hide().attr('aria-hidden', true);
});
//툴팁 외부 요소 클릭시 툴팁 자동 닫힘
$(document).on('click', function() {
	var _tipWrap = $('[class^="tip_info_box"]');
	var _tipBtn = $('.btn_tip_open', _tipWrap);
	var _tipConts = $('.tip_conts_box', _tipWrap);

	_tipWrap.removeClass('active');
	_tipBtn.attr('aria-expanded', false);
	_tipConts.hide().attr('aria-hidden', true);
});
//툴팁 내부 요소 클릭시 툴팁 자동 닫힘 방지
$(document).on('click', '[class^="tip_info_box"]', function(e) {e.stopPropagation();});

/*********************************************************************************************************
	checkbox
 *********************************************************************************************************/
/* info view list all check */
$(document).on('click', '.func_check_all', function() {
	var _this = $(this);
	var _groupName = _this.attr('name');
	var _selector = 'input[name="' + _groupName + '"]';
	var _checkGroup = $(_selector);
	var _checkItem = _checkGroup.not('.func_check_all');
	var _isChecked = _this.prop('checked');

	if(_isChecked) {
		_checkItem.prop('checked', true);
		if(_checkItem.closest('.check_toggle_case')) _checkItem.closest('[class^="check_toggle_case"]').addClass('active');
	}else{
		_checkItem.prop('checked', false);
		if(_checkItem.closest('.check_toggle_case')) _checkItem.closest('[class^="check_toggle_case"]').removeClass('active');
	}
});
$(document).on('click', '[class^="inp_check"] input[type="checkbox"]', function() {
	var _this = $(this);
	var _groupName = _this.attr('name');
	var _selector = 'input[name="' + _groupName + '"]';
	var _checkGroup = $(_selector);
	var _checkItem = _checkGroup.not('.func_check_all');
	var _checkItemTotal = _checkItem.length;
	var _checkedNum = 0;
	var _isChecked = _this.prop('checked');

	if(_isChecked) {
		_this.prop('checked', true);
		_checkItem.each(function() {
			if($(this).prop('checked')) {
				_checkedNum += 1;
			}
		});
		if(_checkedNum == _checkItemTotal) $('.func_check_all[name="' + _groupName + '"]').prop('checked', true);
	}else{
		_this.prop('checked', false);
		$('.func_check_all[name="' + _groupName + '"]').prop('checked', false);
	}
});
$(document).on('click', '.check_toggle_case', function() {
	var _this = $(this);
	var _checkbox = $('input[type="checkbox"]', _this);
	var _isChecked = _checkbox.prop('checked');

	if(_isChecked) {
		_this.addClass('active');
	}else{
		_this.removeClass('active');
	}
});

$(document).on('click', '.radio_toggle_case input[type="radio"]', function() {
	var _this = $(this);
	var _groupName = _this.attr('name');
	var _selector = 'input[name="' + _groupName + '"]';
	var _checkbox = $(_selector);
	var _isChecked = _this.prop('checked');

	if(_isChecked) {
		_checkbox.closest('[class^="radio_toggle_case"]').removeClass('active');
		_this.closest('[class^="radio_toggle_case"]').addClass('active');
	}
});
$(document).on('click', '.check_toggle_case02, .radio_toggle_case02', function() {
	var _this = $(this);
	var _isActive = _this.hasClass('active');
	var _checkWrap = _this.closest('[class^="single_check_box"]');
	var _checkItems = $('[class^="radio_toggle_case"]', _checkWrap);


	if(_checkWrap.length) {
		_checkItems.removeClass('active').attr('aria-pressed', 'false');
	}

	if(_isActive) {
		_this.removeClass('active').attr('aria-pressed', 'false');
	}else{
		_this.addClass('active').attr('aria-pressed', 'true');
	}
});
$(document).on('click', '[class^="inq_card_case"] .check_item', function() {
	var _this = $(this);
	var _checkWrap = _this.closest('[class^="inq_card_case"]');
	var _isActive = _checkWrap.hasClass('active');

	if(_this.hasClass('no-ui-event')) return;

	if(_isActive) {
		_checkWrap.removeClass('active')
		_this.attr('aria-pressed', 'false');
	}else{
		_checkWrap.addClass('active')
		_this.attr('aria-pressed', 'true');
	}
});
$(document).on('click', '[class^="inq_card_case"] .rdo_item', function() {
	var _this = $(this);
	var _checkBox = _this.closest('[class^="inq_card_case"]');
	var _checkWrap = _this.closest('[class^="single_check_box"]').length ? _this.closest('[class^="single_check_box"]') : _this.closest('[class^="ibsheet_wrap"]');
	var _checkItems = $('[class^="inq_card_case"]', _checkWrap);
	var _isActive = _checkBox.hasClass('active');

	if(_checkWrap.length) {
		_checkItems.removeClass('active').attr('aria-pressed', 'false');
	}

	if(_isActive) {
		_checkBox.removeClass('active')
		_this.attr('aria-pressed', 'false');
	}else{
		_checkBox.addClass('active')
		_this.attr('aria-pressed', 'true');
	}
});

/*********************************************************************************************************
	chip button
*********************************************************************************************************/
$(document).on('click', '[class^="chip_rdo_btn"]', function() {
	var _this = $(this);
	var _name = '[name="' + _this.attr('name') + '"]';
	var _items = $(_name);
	var _isChecked = _this.attr('aria-pressed');

	if(_isChecked != 'true') {
		_items.attr('aria-pressed', 'false').removeClass('active');
		_this.attr('aria-pressed', 'true').addClass('active');
	}else{
		_this.attr('aria-pressed', 'false').removeClass('active');
	}

});

/*********************************************************************************************************
	하단 체크 토탈 플리팅 UI
 *********************************************************************************************************/
var totalFloatFn = function(state) {
	var _bottomFixed = $('[class^="page_bottom_fixed"]', $page_ID);
	var _totalBox = $('[class^="check_total_box"]', _bottomFixed);

	if(state == 'open' && !_bottomFixed.hasClass('isTotal')) {
		_bottomFixed.addClass('isTotal');
		_totalBox.slideDown(300, function() {
			var _this = $(this);
			var _contents = _this.closest('.contents');
			var _padBot = _bottomFixed.outerHeight() + 40;

			_contents.css({'padding-bottom' : _padBot});
		}).attr('aria-hidden', 'false');

	} else if(state == 'close' && _bottomFixed.hasClass('isTotal')) {
		_bottomFixed.removeClass('isTotal');
		_totalBox.slideUp(300, function() {
			var _this = $(this);
			var _contents = _this.closest('.contents');
			var _padBot = _bottomFixed.outerHeight() + 40;

			_contents.css({'padding-bottom' : _padBot});
		}).attr('aria-hidden', 'true');
	}
}

/*********************************************************************************************************
	펼침 / 닫힘 기능 UI
*********************************************************************************************************/
$(document).on('click', '[class^="info_view_box"] .tit_view[aria-expanded], [class^="info_view_box"] .expand_btn', function() {
	var _this = $(this);
	var _isExpanded = _this.attr('aria-expanded');
	var _viewWrap = _this.closest('[class^="info_view_box"]');
	var _viewConts = $('[class^="conts_view"]', _viewWrap);

	if(_this.closest('.info_util_case').length) return;//이체 - 자주,공유,빠른이체 버튼 영역 이벤트 제외

	if(_isExpanded == 'true') {
		_this.attr('aria-expanded', false);
		_viewConts.slideUp(200).attr('aria-hidden', true);
	}else{
		_this.attr('aria-expanded', true);
		_viewConts.slideDown(200).attr('aria-hidden', false);
	}
});

$(document).on('click', '[class^="points_noti_box"] button.tit_noti', function() {
	var _this = $(this);
	var _wrap = _this.closest('[class^="points_noti_box"]');
	var _layerWrap = _wrap.closest('[class^="layer_wrap"]');
	var _layerContainer = $('.layer_container', _layerWrap);
	var _isExpanded = _this.attr('aria-expanded');
	var _viewConts = _this.next();
	var _offsetT = _wrap.offset().top;

	if(_isExpanded == 'true') {
		_this.attr('aria-expanded', false);
		_viewConts.slideUp(200).attr('aria-hidden', true);
	}else{
		_this.attr('aria-expanded', true);
		_viewConts.slideDown(200).attr('aria-hidden', false);
		setTimeout(function() {
			if(_layerContainer.length) {
				_layerContainer.animate({scrollTop : _offsetT - 150})
			}else{
				$('body, html').animate({scrollTop : _offsetT - 150})
			}
		}, 200)
	}
});

$(document).on('click', '[class^="info_view_box"] .fold_func', function() {
	var _this = $(this);
	var _textBox = $('span', _this);
	var _infoBox = _this.closest('[class^="info_view_box"]');
	var _foldBox = $('.fold_func_box', _infoBox);
	var _isHidden = _foldBox.attr('aria-hidden');

	if(_isHidden === 'true') {
		_foldBox.attr('aria-hidden', 'false').attr('tabindex', '0');
		_textBox.text('접기');
		_foldBox.focus();
	} else if(_isHidden === 'false') {
		_foldBox.attr('aria-hidden', 'true').removeAttr('tabindex');
		_textBox.text('더보기');
	}
});

/*********************************************************************************************************
	약관 펼침 닫힘
 *********************************************************************************************************/
$(document).on('click', '.agree_item .agree_fold', function() {
	var _this = $(this);
	var _thisWrap = _this.closest('.agree_item');
	var _thisConts = $('.agree_conts', _thisWrap);

	if(_thisConts.is(':hidden')) {
		_this.attr('aria-expanded', 'true');
		_thisConts.slideDown(300).attr('aria-hidden', 'false');
	}else{
		_this.attr('aria-expanded', 'false');
		_thisConts.slideUp(300).attr('aria-hidden', 'true');
	}
});

/*********************************************************************************************************
	에러 화면 상세보기 펼침 닫힘
*********************************************************************************************************/
$(document).on('click', '.error_detail_box .fold_btn', function() {
	var _this = $(this);
	var _thisWrap = _this.closest('.error_detail_box');
	var _thisConts = $('.error_detail', _thisWrap);

	if(_thisConts.is(':hidden')) {
		_this.attr('aria-expanded', 'true');
		_thisConts.show().attr('aria-hidden', 'false');
	}else{
		_this.attr('aria-expanded', 'false');
		_thisConts.hide().attr('aria-hidden', 'true');
	}
});

/*********************************************************************************************************
	리스트 상세보기 스위치
 *********************************************************************************************************/
$(document).on('click', '.switch_func input[type="checkbox"]', function() {
	var _this = $(this);
	var _detailItems = $('.switch_func_item, .switch_fold');
	var _isChecked = _this.prop('checked');

	if(_isChecked) {
		_detailItems.slideDown().attr('aria-hidden', 'false');
	}else{
		_detailItems.slideUp().attr('aria-hidden', 'true');
	}
});

/*********************************************************************************************************
	상단 고정
 *********************************************************************************************************/
var scrollTopFixed = function(target, posT, dom) {
	var _dom = dom ? $(dom) : undefined;
	var _target = dom ? $(target, _dom) : $(target, _dom);
	var _isTabPanel = _target.closest('[class^="tab_panel"]');
	var _fixedBox = _target;
	var _targetConts = _target.closest('.contents')
	var _layerContain = _target.closest('.layer_container');
	var _targetH = _target.css('height');
	var _posT = posT || 44;
	var _offsetT;

	var _initFn = function() {
		_target.data('scrollTop', _offsetT);

		_target.css({'height' : _fixedBox.outerHeight()});

		if(_target.hasClass('list_top_box02')) {//IBsheet
			_fixedBox = $('.list_top_inner', _target);
		}else if(_target.hasClass('search_slide_wrap')) {//이체 받는분 계좌  검색
			_fixedBox = $('.inner_search_slide', _target);
		}

		var _fixedFnc = function(scrollT) {
			if(!_target.offset()) return;

			_offsetT = _target.offset().top;
			var _current = (scrollT + _posT) - _offsetT;

			if((_target.data('scrollTop') + _posT) - _offsetT > scrollT) {
				_target.removeClass('fixed');
				_fixedBox.removeAttr('style');
			}else{
				if(_current >= 0) {
					if(_target.hasClass('fixed')) return;
					_target.addClass('fixed');
					_fixedBox.css({'top' : _posT});
				}else{
					_target.removeClass('fixed');
					_fixedBox.removeAttr('style');
				}
			}

		}

		if(_layerContain.length) {
			_layerContain.scroll(function() {
				var _scrollT = $(this).scrollTop();
				_fixedFnc(_scrollT);
			});
		}else{
			$(window).scroll(function() {
				if(!_targetConts.length || _targetConts.is(':hidden')) return;
				var _scrollT = $(window).scrollTop();

				_fixedFnc(_scrollT);
			});
		}
	}

	setTimeout(function() {_initFn()});

}

/*********************************************************************************************************
	즐겨찾기 버튼
 *********************************************************************************************************/
$(document).on('click', '.btn_bookmark02, .btn_bookmark03', function() {
	var _this = $(this);

	if(_this.hasClass('no-ui-event')) return;

	if(_this.hasClass('active')) {
		_this.removeClass('active').attr('aria-pressed', 'false');
	}else{
		_this.addClass('active').attr('aria-pressed', 'true');
	}
});

/*********************************************************************************************************
	LAYER POPUP
*********************************************************************************************************/
var layerOpenFn = function(target, clickEl) {
	var _layerWrap = $(target);
	var _layerBox = $('.layer_box', _layerWrap).attr('tabindex', '0');
	var _layerHeader = $('.layer_header', _layerBox);
	var _layerContainer = $('.layer_container', _layerBox);
	var _layerConents = $('.layer_contents', _layerContainer);
	var _btnExpanded = $('[class^="btn_layer_expanded"] button', _layerBox);
	var _btnGroupBox = $('[class^="btn_layer_wrap"]', _layerBox);
	var _btnClose = $('.layer_close', _layerBox);
	var _accessbility01;
	var _accessbility02;

	_layerWrap.data('winScrollTop', $(window).scrollTop());
	if(!_layerWrap.hasClass('money_keypad')) {
		$('body').addClass('isPop');
	}
	if(_layerWrap.hasClass('money_keypad')) {
		var _amountT;
		_layerWrap.on('touchstart', function() {
			_amountT = $(window).scrollTop();
		});
		_layerWrap.on('touchend', function() {
			$('body, html').animate({scrollTop : _amountT});
		});
	}
	$('#header, .contents:visible').attr('aria-hidden', 'true');
	if(clickEl) _layerWrap.data('click-target', clickEl);
	_layerWrap.data('scroll-pos', $(window).scrollTop());
	_layerWrap.prepend('<div class="AccessibilityHtml1" tabindex="0" aria-hidden="true"></div>');
	_layerWrap.prepend('<div class="layer_mask" aria-hidden="true"></div>');
	_layerWrap.append('<div class="AccessibilityHtml2" tabindex="0" aria-hidden="true"></div>');

	_layerWrap.attr('aria-hidden', false).show(1, function() {
		$('.layer_mask', _layerWrap).addClass('active');
		if(_layerWrap.hasClass('dialog_up') || _layerWrap.hasClass('evt')) {
			if(_btnGroupBox.length) {_layerConents.css({'padding-bottom' : _btnGroupBox.outerHeight()})}
			layerScrollCalc(_layerBox);
		} else if(_layerWrap.hasClass('full')) {
			if(_btnGroupBox.length) {_layerConents.css({'padding-bottom' : _btnGroupBox.outerHeight() + 16})}
			fullScrollCalc(_layerBox);
		} else {
			if(_btnGroupBox.length) {_layerConents.css({'padding-bottom' : _btnGroupBox.outerHeight() + 8})}
		}
	});

	_layerBox.addClass('active');
	_layerBox.focus();
	_accessbility01 = $('.AccessibilityHtml1', _layerWrap);
	_accessbility02 = $('.AccessibilityHtml2', _layerWrap);

	// S :팝업 close
	_btnClose.on('click', function(e) {
		e.stopPropagation();
		layerCloseFn(target);
	});
	$('.layer_mask', _layerWrap).on('click', function(e) {
		layerCloseFn(target);
	});
	// E :팝업 close

	// S : 페이지 스크를 방지
//	$('.isPop').off().on('touchstart touchmove touchend', function(e) {e.preventDefault();})
	// E : 페이지 스크를 방지

	// S : 팝업 처음, 마지막 포커스 이동 컨트롤
	_accessbility01.on('focusin', function(e) {
		e.stopPropagation();
		if(_btnClose.is(':hidden') || !_btnClose.length) {//팝업 닫기 버튼이 없을 경우
			if(_btnGroupBox.length) {//하단 버튼 그룹 박스 있을경우
				$('button:last', _btnGroupBox).focus();
			}else{//하단 버튼 그룹 박스 없을경우
				_layerBox.focus();
			}
		} else {
			_btnClose.focus();
		}
	});
	_accessbility02.off('focusin').on('focusin', function(e) {
		e.stopPropagation();
		_layerBox.focus();
	});
	// E : 팝업 처음, 마지막 포커스 이동 컨트롤

	//S : 확장형 바텀시트
	if(_btnExpanded.length) {
		expandedSwipeFn(_layerWrap);
	}
	//E : 확장형 바텀시트
}

var layerCloseFn = function(target, callback) {
	var _layerWrap = $(target);
	var _layerBox = $('.layer_box', _layerWrap);
	var _layerContainer = $('.layer_container', _layerBox);
	var _btnClose = $('.layer_close', _layerBox);
	var _btnExpanded = $('[class^="btn_layer_expanded"] button', _layerBox);
	var _accessbility01 = $('.AccessibilityHtml1', _layerWrap);
	var _accessbility02 = $('.AccessibilityHtml2', _layerWrap);
	var _scrollT = _layerWrap.data('winScrollTop') ? _layerWrap.data('winScrollTop') : undefined;

	_layerBox.one('transitionend', function() {
		$('.layer_mask', _layerWrap).removeClass('active');
		// S :팝업 close
		_btnClose.off('click');
		// E :팝업 close
		if(!_layerWrap.length) return;
		_accessbility01.remove();
		_accessbility02.remove();
		$('.layer_mask', _layerWrap).remove();
		_layerBox.removeAttr('tabindex');
		_layerWrap.attr('aria-hidden', true).hide();

		if(_btnExpanded.length) {
			_btnExpanded.attr('aria-expanded', false);
			_layerContainer.removeAttr('style');
		}

		if(_layerWrap.data('click-target')) {
			var _clickEl = $(_layerWrap.data('click-target'));
			_layerWrap.removeData('click-target');
			$(_clickEl).focus();
		}
		if (callback) {
			callback();
		}
	});

	if($('body').hasClass('isPop')) $('body').removeClass('isPop');
	$('#header, .contents:visible').removeAttr('aria-hidden');

	_layerBox.removeClass('active');
	if(_scrollT)$('html, body').animate({scrollTop : _scrollT}, 1);
}

//팝업 오픈 타입 2
var layerOpenFn02 = function(target, prevTarget) {
	var _prevWrap = $(prevTarget);
	var _layerWrap = $(target);
	var _layerBox = $('.layer_box', _layerWrap).attr('tabindex', '0');
	var _layerHeader = $('.layer_header', _layerBox);
	var _layerContainer = $('.layer_container', _layerBox);
	var _layerConents = $('.layer_contents', _layerContainer);
	var _btnExpanded = $('[class^="btn_layer_expanded"] button', _layerBox);
	var _btnGroupBox = $('[class^="btn_layer_wrap"]', _layerBox);
	var _btnClose = $('.layer_close', _layerBox);
	var _accessbility01;
	var _accessbility02;

	_layerWrap.addClass('active-layer');
	_layerWrap.data('prev-target', prevTarget);
	_layerWrap.data('scroll-pos', $(window).scrollTop());
	_layerWrap.prepend('<div class="AccessibilityHtml1" tabindex="0" aria-hidden="true"></div>');
	_layerWrap.prepend('<div class="layer_mask" aria-hidden="true"></div>');
	_layerWrap.append('<div class="AccessibilityHtml2" tabindex="0" aria-hidden="true"></div>');
	_layerWrap.attr('aria-hidden', false).show(1, function() {
		$('.layer_mask', _layerWrap).addClass('active');
		if(_layerWrap.hasClass('dialog_up')) {
			if(_btnGroupBox.length) {_layerConents.css({'padding-bottom' : _btnGroupBox.outerHeight()})}
			layerScrollCalc(_layerBox);
		}
	});


	_prevWrap.addClass('prev-layer');
	_layerBox.addClass('active');

	_layerBox.focus();
	_accessbility01 = $('.AccessibilityHtml1', _layerWrap);
	_accessbility02 = $('.AccessibilityHtml2', _layerWrap);

	// S :팝업 close
	_btnClose.on('click', function(e) {
		e.stopPropagation();
		layerCloseFn02(target);
	});
	$('.layer_mask', _layerWrap).on('click', function(e) {
		layerCloseFn02(target);
	});
	// E :팝업 close

	// S : 팝업 처음, 마지막 포커스 이동 컨트롤
	_accessbility01.on('focusin', function(e) {
		e.stopPropagation();
		if(_btnClose.is(':hidden') || !_btnClose.length) {//팝업 닫기 버튼이 없을 경우
			if(_btnGroupBox.length) {//하단 버튼 그룹 박스 있을경우
				$('button:last', _btnGroupBox).focus();
			}else{//하단 버튼 그룹 박스 없을경우
				_layerBox.focus();
			}
		}else{
			_btnClose.focus();
		}
	});
	_accessbility02.off('focusin').on('focusin', function(e) {
		e.stopPropagation();
		_layerBox.focus();
	});
	// E : 팝업 처음, 마지막 포커스 이동 컨트롤

	//S : 확장형 바텀시트
	if(_btnExpanded.length) {
		expandedSwipeFn(_layerWrap);
	}
	//E : 확장형 바텀시트
}

var layerCloseFn02 = function(target) {
	var _layerWrap = $(target);
	var _layerBox = $('.layer_box', _layerWrap);
	var _layerContainer = $('.layer_container', _layerBox);
	var _btnClose = $('.layer_close', _layerBox);
	var _btnExpanded = $('[class^="btn_layer_expanded"] button', _layerBox);
	var _accessbility01 = $('.AccessibilityHtml1', _layerWrap);
	var _accessbility02 = $('.AccessibilityHtml2', _layerWrap);
	var _prevWrap = $(_layerWrap.data('prev-target'));

	_prevWrap.removeClass('prev-layer');
	_layerBox.removeClass('active');
	$('.layer_mask', _layerWrap).removeClass('active');

	// S : layer box focus stopPropagation
	_layerBox.off('focusin');
	// E : layer box focus stopPropagation

	// S :팝업 close
	_btnClose.off('click');
	// E :팝업 close

	_layerBox.one('transitionend', function() {
		if(!_layerWrap.length) return;
		_accessbility01.remove();
		_accessbility02.remove();
		$('.layer_mask', _layerWrap).remove();
		_layerBox.removeAttr('tabindex');
		_layerWrap.attr('aria-hidden', true).hide();

		if(_btnExpanded.length) {
			_btnExpanded.attr('aria-expanded', false);
			_layerContainer.removeAttr('style');
		}

		if(_layerWrap.data('click-target')) {
			var _clickEl = $(_layerWrap.data('click-target'));
			_layerWrap.removeData('click-target');
			$(_clickEl).focus();
		}
	});
}

// max height 60% 설정 함수
var layerScrollCalc = function(target, ratioH) {
	var _layerBox = $(target);
	var _layerWrap = _layerBox.closest('[class^="layer_wrap"]');
	var _layeraHeader = $('.layer_header', _layerBox);
	var _layerContainer = $('.layer_container', _layerBox);
	var _layerContents = $('.layer_contents', _layerBox);
	var _btnGroupWrap = $('[class^="btn_layer_wrap"]', _layerBox);
	var _btnExpanded = $('.btn_layer_expanded', _layerBox);
	var _ratioH = ratioH != undefined ? ratioH : 0.6
	var _maxH = window.innerHeight * _ratioH;
	var _standardH = _maxH;

	if(_layerWrap.data('height') === 'free') {//바텀시트 max height free
		_maxH = window.innerHeight - 44;
		_standardH = _maxH;
	}

	if(_layeraHeader.length) {
		_standardH = _standardH - _layeraHeader.outerHeight();
	}else{
		_standardH = _standardH - 32;
	}

	_layerBox.css({
		'max-height' : _maxH,
		'height' : _btnExpanded.length ? _maxH : 'auto'
	}).data('max-height', _maxH);
	_layerContainer.css({
		'max-height' : _standardH
	});
}

// 풀팝업 스크롤 영역 계산
var fullScrollCalc = function(target) {
	var _layerBox = $(target);
	var _layeraHeader = $('.layer_header', _layerBox);
	var _layerContainer = $('.layer_container', _layerBox);
	var _btnGroupWrap = $('[class^="btn_layer_wrap"]', _layerBox);
	var _containH = window.innerHeight;

	_containH = _layeraHeader.length ? _containH - _layeraHeader.outerHeight() : _containH;

	_layerContainer.css({
		'max-height' : _containH
	});
}

// 모달 확장 이벤트
$(document).on('click', '[class^="layer_wrap"] [class^="btn_layer_expanded"] button', function() {
	var _this = $(this);
	var _layerBox = _this.closest('.layer_box');
	var _layeraHeader = $('.layer_header', _layerBox);
	var _layerContainer = $('.layer_container', _layerBox);
	var _btnGroupWrap = $('[class^="btn_layer_wrap"]', _layerBox);
	var _isExpanded = _this.attr('aria-expanded');
	var _maxH = window.innerHeight * 0.6;
	var _boxH;
	var _containH;

	if(_isExpanded == 'true') {
		_boxH = _maxH;
		_containH = _maxH;
		_this.attr('aria-expanded', 'false');
	} else if(_isExpanded == 'false') {
		_boxH = window.innerHeight;
		_containH = window.innerHeight;
		_this.attr('aria-expanded', 'true');
	}

	if(_layeraHeader.length) _containH = _containH - _layeraHeader.outerHeight();

	_layerBox.css({
		'max-height' : _boxH,
		'height' : _boxH
	});
	_layerContainer.css({
		'max-height' : _containH
	});
});

// 모달 확장 터치이벤트
var expandedSwipeFn = function(target) {
	var _layerWrap = target;
	var _layerBox = $('.layer_box', _layerWrap);
	var _layeraHeader = $('.layer_header', _layerBox);
	var _layerContainer = $('.layer_container', _layerBox);
	var _btnGroupWrap = $('[class^="btn_layer_wrap"]', _layerBox);
	var _btnExpanded = $('.btn_layer_expanded button', _layerWrap);
	var _current = {};
	var _delta = {};
	var _maxAngle = 30;
	var _minTouchDist = 10;
	var _maxH = window.innerHeight * 0.6;
	var _rads;
	var _deg;
	var _dir;
	var _startTime;
	var _endTime;
	var _isExpanded = false;

	var start = function(e, el) {
		var _touchObj = e.originalEvent.changedTouches[0];

		_startTime = new Date().getTime();
		_current = {
			X : _touchObj.pageX,
			Y : _touchObj.pageY
		}

		_isExpanded = _btnExpanded.attr('aria-expanded') == 'false' ? false : true;
	}
	var move = function(e) {
		var _touchObj = e.originalEvent.changedTouches[0];
		var _movDist = 0;

		_delta = {
			X : _touchObj.pageX - _current.X,
			Y : _touchObj.pageY - _current.Y
		}

		_movDist = _isExpanded ? window.innerHeight - _delta.Y : _maxH - _delta.Y;

		expandedAniFn(_movDist, 0);
	}
	var end = function(e) {
		var _touchObj = e.originalEvent.changedTouches[0];
		var _duration = 600;

		_endTime = new Date().getTime();
		_delta = {
			X : _touchObj.pageX - _current.X,
			Y : _touchObj.pageY - _current.Y
		}

		if(_minTouchDist > Math.abs(_delta.Y)) return;

		if(_endTime - _startTime < 600) _duration = _endTime - _startTime;

		if(_endTime - _startTime < 200) {
			if(_delta.Y < -10) {
				expandedStateFn(e, _duration, true);
			} else if(_delta.Y > 10) {
				expandedStateFn(e, _duration, false);
			}
		}

		if(_delta.Y < -100 && !_isExpanded || _delta.Y < 100 && _isExpanded) {//확장
			expandedStateFn(e, _duration, true);
		} else if(_delta.Y > 100 && _isExpanded || _delta.Y > -100 && !_isExpanded) {//축소
			expandedStateFn(e, _duration, false);
		}

	}

	var expandedStateFn = function(e, duration, isExpanded) {
		e.preventDefault();
		expandedAniFn(isExpanded ? window.innerHeight : _maxH, duration);
		_btnExpanded.attr('aria-expanded', isExpanded);
		_isExpanded = isExpanded;
	}

	var expandedAniFn = function(dist, speed) {
		var _boxH = dist;
		var _maxH = window.innerHeight * 0.6;
		var _containH;

		if(_boxH < 0) {
			_boxH = 0;
		} else if(_boxH > window.innerHeight) {
			_boxH = window.innerHeight;
		}

		_containH = _boxH;

		if(_layeraHeader.length) _containH = _containH - _layeraHeader.outerHeight();

		_layerBox.css({
			'max-height' : _boxH,
			'height' : _boxH,
			'transition-duration' : speed + 'ms'
		});
		_layerContainer.css({
			'max-height' : _containH
		});

	}

	_btnExpanded.off('touchstart').on('touchstart', function(e) {start(e, this);});
	_btnExpanded.off('touchmove').on('touchmove', function(e) {move(e);});
	_btnExpanded.off('touchend').on('touchend', function(e) {end(e);});
	_layeraHeader.off('touchstart').on('touchstart', function(e) {start(e, this);});
	_layeraHeader.off('touchmove').on('touchmove', function(e) {move(e);});
	_layeraHeader.off('touchend').on('touchend', function(e) {end(e);});
}

/*팝업 리사이즈 대응*/
$(window).on('resize', function() {
	var _wrap = $('[class^="layer_wrap"]:visible');
	if(!_wrap.length) return;
	_wrap.each(function() {
		var _layerBox = $('[class^="layer_box"]', this);
		var _btnExpand = $('.btn_layer_expanded button', _layerBox);

		if(_wrap.hasClass('dialog_up')) {
			if($('input:focus', _layerBox).length == 0) {
				layerScrollCalc(_layerBox);
				if(_btnExpand.length) _btnExpand.attr('aria-expanded', 'false');
			}else{
				layerScrollCalc(_layerBox, 1);
				if(_btnExpand.length) _btnExpand.attr('aria-expanded', 'true');
			}

		} else if(_wrap.hasClass('full')) {
			fullScrollCalc(_layerBox);
		}
	});

});

/*********************************************************************************************************
	TOAST POPUP
*********************************************************************************************************/
var toastTimer;
var toastPopFn = function(target) {
	var _tipHtml = '<div class="toast_wrap" id="exToast" aria-hidden="true" aria-live="polite" >';
	_tipHtml += '<div class="toast_conts">토스트 팝업입니다.</div>';
	_tipHtml += '</div>';

	var _toastWrap = $(target);

	if(toastTimer) clearTimeout(toastTimer);
	_toastWrap.off('transitionend');

	_toastWrap.show(1, function() {
		$(this).addClass('active').attr('aria-hidden', false);
	});

	toastTimer = setTimeout(function() {
		_toastWrap.removeClass('active').attr('aria-hidden', true);
		_toastWrap.on('transitionend', function() {
			_toastWrap.hide().remove();
		});
	}, 2000);
}

/*********************************************************************************************************
	Swiper
*********************************************************************************************************/
var swiperFn = function(target, options) {
	var gl = this;
	this.el = {};

	this.el.wrap = $(target);
	this.el.swipeContain = $(' > .swiper-container', this.el.wrap);
	this.el.swipeWrap = $(' > .swiper-wrapper', this.el.swipeContain);
	this.el.swipeSlide = $(' > .swiper-slide', this.el.swipeWrap);
	this.el.swiperPrev = $(' > .swiper-btn-prev, > .swiper-container > .swiper-btn-prev', this.el.wrap);
	this.el.swiperNext = $(' > .swiper-btn-next, > .swiper-container > .swiper-btn-next', this.el.wrap);
	this.slideTotal = this.el.swipeSlide.length;
	this.options = options || {};

	this.el.prevEl = $(' > .swiper-btn-prev', this.el.wrap).length != 0 ? target + '> .swiper-btn-prev' : target + '> .swiper-container > .swiper-btn-prev';
	this.el.nextEl = $(' > .swiper-btn-next', this.el.wrap).length != 0 ? target + '> .swiper-btn-next' : target + '> .swiper-container > .swiper-btn-next';

	this.swiperOpt = {
		initialSlide : 0,
		allowTouchMove : this.options.allowTouchMove != undefined ? this.options.allowTouchMove : true,
		longSwipes : this.options.longSwipes != undefined ? this.options.longSwipes : true,
 		navigation : {
 			prevEl : this.el.prevEl,
 			nextEl : this.el.nextEl
 		},
		pagination : {
			el : target + ' > .swiper-ctrl-box > .swiper-pagi-box',
			type : 'bullets',
			clickable : true,
			renderFraction : function(currentClass, totalClass) {
				return '<span class="' + currentClass + '"></span>' + ' / ' + '<span class=">' + totalClass + '"></span>';
			}
		},
		a11y : {
			prevSlideMessage : '이전 슬라이드',
			nextSlideMessage : '다음 슬라이드',
			paginationBulletMessage : '{{index}}번 슬라이드로 이동'
		},
		on : {
			init : function() {
				var _slides = this.slides;
				var _idx = gl.options.loop ? this.activeIndex : this.realIndex;

				_slides.attr('aria-hidden', 'true').eq(_idx).attr('aria-hidden', 'false');
			},
			slideChangeTransitionEnd : function() {
				var _slides = this.slides;
				var _idx = gl.options.loop ? this.activeIndex : this.realIndex;
				_slides.attr('aria-hidden', 'true').eq(_idx).attr('aria-hidden', 'false');

				/*option loop 일경우 아이템 처음/마지막 위치 재설정*/
				if(gl.options.loop) {
					if(_idx === 0) this.slideToLoop(gl.slideTotal - 1, 1);
					if(_idx === this.slides.length - 1) this.slideToLoop(0, 1);
				}

				/*slideChangeTransitionEnd 함수에 추가 작업 필요 할 경우*/
				if(gl.options.slideChangeTransitionEnd != undefined) gl.options.slideChangeTransitionEnd(this);
			},
			resize : function() {
				this.update(true);
			}
		}
	}

	this.el.swipeSlide.css({
		'width' : this.el.swipeContain.outerWidth()
	});

	// initialSlide option
	if(this.options.initialSlide != undefined) this.swiperOpt['initialSlide'] = this.options.initialSlide;

	// width option
	if(this.options.width != undefined) this.swiperOpt['width'] = this.options.width;

	// height option
	if(this.options.height != undefined) this.swiperOpt['height'] = this.options.height;

	// loop option
	if(this.options.loop != undefined) this.swiperOpt['loop'] = this.options.loop;

	// centeredSlides option
	if(this.options.centeredSlides != undefined && this.options.centeredSlides === true) this.swiperOpt['centeredSlides'] = this.options.centeredSlides;

	// slidePerView option
	if(this.options.slidesPerView != undefined) this.swiperOpt['slidesPerView'] = this.options.slidesPerView;

	// direction option
	if(this.options.direction != undefined) this.swiperOpt['direction'] = this.options.direction;

	// navigation option
	if(this.options.navigation != undefined && this.options.navigation === false) this.swiperOpt['navigation'] = false;

	// pagination custom option
	if(this.options.pagination != undefined && this.options.pagination === 'custom') {
		this.swiperOpt['pagination'] = {
				el : target + ' > .swiper-ctrl-box > .swiper-pagi-box',
				type : 'custom',
				renderCustom : function(swiper, current, total) {
					return '<span >' + current + '</span>' + ' / ' + '<span class="">' + total + '</span>';
				}
		}
	}else if(this.options.pagination != undefined && this.options.pagination === false){
		this.swiperOpt['pagination'] = false;
	}

	// init option
	if(this.options.init != undefined) {
		this.swiperOpt['on']['init'] = this.options.init;
	}

	// transitionEnd option
	if(this.options.transitionEnd != undefined) {
		this.swiperOpt['on']['transitionEnd'] = this.options.transitionEnd;
	}

	// transitionStart option
	if(this.options.transitionStart != undefined) {
		this.swiperOpt['on']['transitionStart'] = this.options.transitionStart;
	}

	// touchMove option
	if(this.options.touchMove != undefined) {
		this.swiperOpt['on']['touchMove'] = this.options.touchMove;
	}
	// touchMove option
	if(this.options.touchEnd != undefined) {
		this.swiperOpt['on']['touchEnd'] = this.options.touchEnd;
	}

	// freeMode option
	if(this.options.freeMode != undefined) {
		this.swiperOpt['freeMode'] = options.freeMode;
	}

	this.libSwiper = new Swiper(target + ' > .swiper-container', this.swiperOpt);

	$(' > .swiper-notification', this.el.swipeContain).attr('aria-live', 'off').attr('aria-atomic', false).attr('aria-hidden', true);

	this.swiper = this.libSwiper;
	this.slideTo = function(i) {
		gl.libSwiper.slideTo(i);
	}
}

/*********************************************************************************************************
	jQuery.doubletap
*********************************************************************************************************/
jQuery.event.special.dblclick = {
	setup : function(data, namespaces) {
		var elem = this,
			$elem = jQuery(elem);

		$elem.bind('touchend.dblclick', jQuery.event.special.dblclick.handler);
	},

	teardown : function(namespaces) {
		var elem = this,
			$elem = jQuery(elem);

		$elem.unbind('touchend.dblclick');
	},

	handler : function(event) {
		var elem = event.target,
			$elem = jQuery(elem),
			lastTouch = $elem.data('lastTouch') || 0,
			now = new Date().getTime();
		var delta = now - lastTouch;

		if(delta > 20 && delta < 300) {
			event.preventDefault();
			$elem.data('lastTouch', 0);
			$elem.trigger('dblclick');
		} else {
			$elem.data('lastTouch', now);
		}
	}
}

/*********************************************************************************************************
	이제 - 보내는분 계좌 선택 화면 검색영역
*********************************************************************************************************/
var trnSchNaviSetTime = undefined;
var trnSchNaviFn = function() {
	var _trnSchNavi = $('.trn_sch_navi', $page_ID);

	/* 스크로로 방향 체크 */
	var _pubLastScrollY = 0;
	var scrollDir = function() {
		var _srollY = $(window).scrollTop();
		var _dir = _pubLastScrollY - _srollY < 0 ? 'down' : 'up';
		_pubLastScrollY = _srollY;
		return _dir;
	}


	$(window).scroll(function(e) {
		if(_trnSchNavi.closest('.tab_panel').is(':hidden')) {
			//해당탭 비활성화
			if(_pubLastScrollY > 0) _pubLastScrollY = 0;
			return;
		}
		if(!$('.search_slide_wrap').hasClass('active')) {
			return;
		}

		var _scrollDir = scrollDir();

		if(_pubLastScrollY === 0) {
			_trnSchNavi.hide().attr('aria-hidden', 'true');
			return;
		}

		if(trnSchNaviSetTime != undefined) clearTimeout(trnSchNaviSetTime);
		_trnSchNavi.show().attr('aria-hidden', 'false');
		trnSchNaviSetTime = setTimeout(function() {
			_trnSchNavi.hide().attr('aria-hidden', 'true');
		}, 3000);
//		if(_scrollDir == 'up' && _pubLastScrollY != 0) {
//			_trnSchNavi.hide().attr('aria-hidden', 'true');
//		} else if(_scrollDir == 'down') {
//			_trnSchNavi.show().attr('aria-hidden', 'false');
//			trnSchNaviSetTime = setTimeout(function() {
//				_trnSchNavi.hide().attr('aria-hidden', 'true');
//			}, 3000);
//		}
	});

	$('.trn_navi_btn', _trnSchNavi).click(function() {
		var _this = $(this);
		var _wrap = _this.closest('.deposit_result_list');
		var _list = $('.toggle_list_wrap > ul', _wrap);
		var _listItems = $('> li', _list);
		var _movPos = _listItems.eq(_this.parent().index()).offset().top - 191;

		$('html, body').animate({
			scrollTop : _movPos
		}, 300);
	});
}

/*********************************************************************************************************
	이제 - 완료 기능버튼 영역 열림 / 닫림
*********************************************************************************************************/
var acctTranSwipeFnc = function(target) {
	var _target = $(target)
	var _current = {};
	var _delta = {};
	var _maxAngle = 10;
	var _minTouchDist = 10;
	var _duration = 600;
	var _rads;
	var _deg;
	var _dir;
	var _posX;
	var _speed = 800;
	var _moveDist;
	var _startTime;
	var _endTime;
	var _isEndBlock = false;

	var _viewBox = $('.info_view_row', _target);
	var _eventTarget;
	var _btnUtil = $('.info_util_case > button', _viewBox);
	var _isTransition = false;

	var start = function(e, el) {
		if(_isTransition) return;
		var _touchObj = e.originalEvent.changedTouches[0];
		_current = {
			X : _touchObj.pageX,
			Y : _touchObj.pageY
		}

		_eventTarget = $(el);
		_posX = Number(_eventTarget.data('movPos') ? _eventTarget.data('movPos') : 0);
		_startTime = new Date().getTime();
	}
	var move = function(e) {
		if(_isTransition) return;
		var _touchObj = e.originalEvent.changedTouches[0];
		_delta = {
			X : _touchObj.pageX - _current.X,
			Y : _touchObj.pageY - _current.Y
		}

		_rads = Math.atan(_delta.Y/_delta.X);
		_deg = Math.abs(_rads * (180 / Math.PI));
		_movDist = _delta.X + _posX;
		_dir = _delta.X < 0 ? 'left' : 'right';

		if(Math.abs(_delta.Y) > Math.abs(_delta.X)) _isEndBlock = true;
		if(_isEndBlock) return;

		if(_deg < _maxAngle) {
			e.preventDefault();
			if(_dir === 'left' && _movDist < -150) {
				_movDist = -150;
			} else if(_dir === 'right' && _movDist > 0) {
				_movDist = 0;
			}
			_translate(_eventTarget, _movDist, 0);
		}

	}
	var end = function(e) {
		if(_isTransition) return;
		if(_isEndBlock) {
			_isEndBlock=false;
			return;
		}
		var _touchObj = e.originalEvent.changedTouches[0];
		_delta = {
			X : _touchObj.pageX - _current.X,
			Y : _touchObj.pageY - _current.Y
		}

		_endTime = new Date().getTime();
		_movDist = _delta.X + _posX;
		_dir = _delta.X < 0 ? 'left' : 'right';

		if(_delta.X > _minTouchDist) e.preventDefault();

		if(_endTime - _startTime < 600) _duration = _endTime - _startTime;

		if(_deg < _maxAngle) {
			if(Math.abs(_delta.X) > 50) {
				if(_dir === 'left') {
					_movDist = -97;
				} else if(_dir === 'right') {
					_movDist = 0;
				}
			} else if(Math.abs(_delta.X) <= 50) {
				_movDist = _posX == -97 ? -97 : 0;
				if(_endTime - _startTime < 200) {
					if(_delta.X < -10) {
						_movDist = _dir === 'left' ? -97 : _movDist;
					} else if(_delta.X > 10) {
						_movDist = _dir === 'right' ? 0 : _movDist;
					}
				}
			}

			_eventTarget.data('movPos', _movDist);
			if(_movDist > 0) _isTransition = true;
			_translate(_eventTarget, _movDist, _duration);
		}

	}

	var _translate = function(target, dist, speed) {
		target.css({
			'transform' : 'translate(' + dist + 'px, 0)',
			'transition-duration' : speed+'ms'
		});
	}

	_viewBox.off('touchstart').on('touchstart', function(e) {start(e, this);});
	_viewBox.off('touchmove').on('touchmove', function(e) {move(e);});
	_viewBox.off('touchend').on('touchend', function(e) {end(e);});
	_viewBox.off('transitionend').on('transitionend', function(e) {
		var _this = $(this)
		var _btnExpanded = $('.info_util_case > button', _this);
		var _utilInner = _btnExpanded.next();
		var _isExpanded = Number(_eventTarget.data('movPos') ? _eventTarget.data('movPos') : 0);

		if(_isExpanded == -97) {
			_btnExpanded.attr('aria-hidden', 'false');
			_utilInner.attr('aria-expanded', 'true');
		}else{
			_btnExpanded.attr('aria-hidden', 'true');
			_utilInner.attr('aria-expanded', 'false');
		}

		if(_isTransition) _isTransition = false;
	});
	_btnUtil.off('click').on('click', function(e) {
		var _this = $(this);
		var _viewBox = _this.closest('.info_view_row');
		var _utilInner = _this.next();
		var _isExpanded = _this.attr('aria-expanded');

		if(_isExpanded === 'false') {
			_translate(_viewBox, -97, 300);
			_eventTarget.data('movPos', -97);
			_utilInner.attr('aria-hidden', 'false');
			_this.attr('aria-expanded', 'true');
		}else{
			_translate(_viewBox, 0, 300);
			_eventTarget.data('movPos', 0);
			_utilInner.attr('aria-hidden', 'true');
			_this.attr('aria-expanded', 'false');
		}
	});

}

/*********************************************************************************************************
	결제함 프로세스
 *********************************************************************************************************/
$(document).on('click', '.process_wrap .btn_toggle', function() {
	var _this = $(this);
	var _processItem = _this.closest('.item_process');
	var _processConts = $('.cont_process', _processItem);

	if(_processConts.is(':hidden')) {
		_this.attr('aria-expanded', 'true');
		_processConts.show().attr('aria-hidden', 'false');
	}else{
		_this.attr('aria-expanded', 'false');
		_processConts.hide().attr('aria-hidden', 'true');
	}
});

/*********************************************************************************************************
	바텀시트 셀렉트 옵션 리스트 온오프
*********************************************************************************************************/
$(document).on('click', '.select_opt_box button', function() {
	var _this = $(this);
	var _isPressed = _this.attr('aria-pressed');
	var _optWrap = _this.closest('.select_opt_box');
	var _optItems = $('button', _optWrap);

	if(_isPressed == 'false') {
		_optItems.attr('aria-pressed', 'false');
		_this.attr('aria-pressed', 'true');
	}
});

/*********************************************************************************************************
	전계좌조회 메인
*********************************************************************************************************/
var accTabHoldFn = function(target, options) {
	var _options = options || {};
	var _wrap = $(target);
	var _inqMain = _wrap.closest('.inquiry_main');
	var _guideBox = $('.hold_trans_guide', _wrap);
	var _inqMainItem = $('.inq_main_item', _wrap);
	var _listBox = $('.list_box > ul', _wrap);
	var _itemsBox = $('> li', _listBox);
	var _items = $('> .acc_plate_wrap04', _itemsBox);
	var _holdBtn = $('> .hold', _items);
	var _tapEvtEl;

	var _tapStart;
	var _tapEnd;
	var _tapSetTime;
	var _holdTime = 500;
	var _current = {};
	var _delta = {};
	var _isTapHold = false;
	var _cardPosKey;
	var _cardPosInf;
	var _holdItemH;
	var _movY = 0;
	var _activeIdx;
	var _touchY = 0;
	var _viewerStart = 109;
	var _viewerEnd = window.innerHeight;
	var _setScrollT;
	var _setScrollMov = 0;
	var _selectedIdx = undefined;

	var _holdSetFn = function() {
		$('.inq_main_item', _wrap).find('.inq_item_tit .expand_btn').attr('aria-expanded', 'false');
		$('.inq_main_item', _wrap).find('.list_box').hide().attr('aria-hidden', 'true');
		$('.hold_item', _wrap).find('.inq_item_tit .expand_btn').attr('aria-expanded', 'true')
		$('.hold_item', _wrap).find('.list_box').show().attr('aria-hidden', 'false');

		_guideBox.show().attr('aria-hidden', 'false');
		_cardPosKey = [];
		_items.each(function() {
			_cardPosKey.push($(this).offset().top);
		});
	}

	var _itemMoveFn = function(movY, speed) {
		_tapEvtEl.css({
			'top' : movY,
			'transition-duration' : speed + 'ms'
		});
	}

	var _scrollMovFn = function(movY) {
		_wrap.parent().css({'top' : movY});
	}

	var holdStart = function(e) {
		var _touchObj = e.originalEvent.changedTouches[0];
		var _item = $(e.currentTarget);
		_tapEvtEl = _item.closest('[class^="acc_plate_wrap"]');
		_activeIdx = _items.index(_tapEvtEl);
		_selectedIdx = undefined;

		_tapStart = new Date().getTime();
		_tapSetTime = setTimeout(function() {
			_isTapHold = true;
			_inqMain.addClass('isHold');
			_inqMainItem.removeClass('fixed');
			_holdSetFn();
			_tapEvtEl.addClass('hold_case');
			_holdItemH = _tapEvtEl.outerHeight();
			_tapEvtEl.parent().css('height', _holdItemH);

			_current = {
				X : _touchObj.pageX,
				Y : _touchObj.pageY
			}
			_touchY = _touchObj.clientY;
			_movY = _touchY - (_holdItemH / 2);
			_itemMoveFn(_movY, 0);

			_setScrollT = (_touchY - _cardPosKey[_activeIdx]) - (_holdItemH / 2);
			_setScrollMov = _setScrollT;

			$('html, body').animate({scrollTop : 0}, 1);
			_scrollMovFn(_setScrollT);
		}, _holdTime);

	}
	var holdMove = function(e) {
		var _touchObj = e.originalEvent.changedTouches[0];
		_selectedIdx = undefined;

		if(_tapEnd - _tapStart <= _holdTime) clearTimeout(_tapSetTime);


		if(_isTapHold) {
			e.preventDefault();
			_delta = {
					X : _touchObj.pageX - _current.X,
					Y : _touchObj.pageY - _current.Y
			}
			_touchY = _touchObj.clientY;
			_movY = _touchY - (_holdItemH / 2);

			_cardPosKey = [];
			_cardPosInf = {}
			_items.each(function(i) {
				var _this = $(this);
				_cardPosKey.push(_this.offset().top);
				_cardPosInf[_this.offset().top] = this;
			});

			for(var i=0; i<_cardPosKey.length; i++) {
				if(i != _activeIdx && _cardPosKey[i] > 0) {
					if(_cardPosKey[_activeIdx] >= _cardPosKey[i] - (_holdItemH / 2) && _cardPosKey[_activeIdx] <= _cardPosKey[i] + (_holdItemH / 2)) {
						_selectedIdx = i;
					}
				}
			}

			_items.removeClass('hold_hover');
			if(_selectedIdx != undefined) {
				$(_cardPosInf[_cardPosKey[_selectedIdx]]).addClass('hold_hover');
			}

			if(_touchY < _viewerStart + 40) {
				_setScrollMov += 10;
				if(_setScrollMov > 0) _setScrollMov = 0;
				_scrollMovFn(_setScrollMov);
			} else if(_touchY > _viewerEnd - 40) {
				_setScrollMov -= 10;
				if(_setScrollMov < window.innerHeight - (_wrap.parent().outerHeight() + 109)) _setScrollMov = window.innerHeight - (_wrap.parent().outerHeight() + 109);
				_scrollMovFn(_setScrollMov);
			}
			_itemMoveFn(_movY, 0);

		}

	}
	var holdEnd = function(e) {
		var _touchObj = e.originalEvent.changedTouches[0];

		_tapEnd = new Date().getTime();

		if(_tapEnd - _tapStart <= _holdTime) clearTimeout(_tapSetTime);

		if(_isTapHold) {
			_isTapHold = false;
			_tapEvtEl.removeClass('hold_case').removeAttr('style');
			_tapEvtEl.parent().removeAttr('style');
			_inqMain.removeClass('isHold');
			_items.removeClass('hold_hover');
			_scrollMovFn(0);
			_guideBox.hide().attr('aria-hidden', 'true');
		}

		_options.holdEnd(_tapEvtEl, _selectedIdx != undefined ? $(_cardPosInf[_cardPosKey[_selectedIdx]]) : '', _selectedIdx != undefined ? true : false);
	}

	_holdBtn.unbind('touchstart', holdStart).bind('touchstart', holdStart);
	_holdBtn.unbind('touchmove', holdMove).bind('touchmove', holdMove);
	_holdBtn.unbind('touchend', holdEnd).bind('touchend', holdEnd);
	_items.unbind('contextmenu').bind('contextmenu', function(e) {
		e.preventDefault();
		return false;
	});
	$('*', _items).unbind('contextmenu').bind('contextmenu', function(e) {
		e.preventDefault();
		return false;
	});
}

/*********************************************************************************************************
	메인계좌 설정
*********************************************************************************************************/
$(document).on('click', '.main_acc_group_box .acc_tit', function() {
	var _this = $(this);
	var _groupWrap = _this.closest('.main_acc_group_box');
	var _listBox = $('.main_acc_list_box', _groupWrap);

	if(_listBox.is(':hidden')) {
		$('.main_acc_group_box .acc_tit').removeClass('active').attr('aria-expanded', 'false');
		$('.main_acc_group_box .main_acc_list_box').slideUp(300).attr('aria-hidden', 'true');
		_this.addClass('active').attr('aria-expanded', 'true');
		_listBox.slideDown(300).attr('aria-hidden', 'false');
	}else{
		_this.removeClass('active').attr('aria-expanded', 'false');
		_listBox.slideUp(300).attr('aria-hidden', 'true');

	}
});

/*********************************************************************************************************
	계좌순서 변경
*********************************************************************************************************/
$(document).on('click', '.order_acc_group_box .acc_tit', function() {
	var _this = $(this);
	var _groupWrap = _this.closest('.order_acc_group_box');
	var _listBox = $('.order_acc_list_box', _groupWrap);

	if(_listBox.is(':hidden')) {
		$('.order_acc_group_box .acc_tit').removeClass('active').attr('aria-expanded', 'false');
		$('.order_acc_group_box .order_acc_list_box').slideUp(300).attr('aria-hidden', 'true');
		_this.addClass('active').attr('aria-expanded', 'true');
		_listBox.slideDown(300).attr('aria-hidden', 'false');
	}else{
		_this.removeClass('active').attr('aria-expanded', 'false');
		_listBox.slideUp(300).attr('aria-hidden', 'true');

	}
});

/*********************************************************************************************************
	금융상품몰 비교하기
 *********************************************************************************************************/
$(document).on('click', '[class^="compare_wrap"] .tit_compare', function() {
	var _this = $(this);
	var _wrap = _this.closest('[class^="compare_wrap"]');
	var _conts = $('[class^="cont_compare"]', _wrap);

	if(_conts.is(':hidden')) {
		_this.addClass('active').attr('aria-expanded', 'true');
		_conts.slideDown(300).attr('aria-hidden', 'false');
	}else{
		_this.removeClass('active').attr('aria-expanded', 'false');
		_conts.slideUp(300).attr('aria-hidden', 'true');
	}
});

/*********************************************************************************************************
	range slider
 *********************************************************************************************************/
var rangeFn = function() {
	var _rangeWrap = $('[class^="slider_range_wrap"]', $page_ID);
	var _rangeEl = $('input[type="range"]', _rangeWrap);

	_rangeWrap.each(function() {
		var _rangeEl = $('input[type="range"]', this);
		var _trackBox = $('.slider_range_track', this);
		var _trackBarItem = $('.slider_range_bar', this);
		var _trackHandleItem = $('.slider_range_handle', this);
		var _minVal = parseInt(_rangeEl.attr('min'), 10);
		var _maxVal = parseInt(_rangeEl.attr('max'), 10);
		var _val = _rangeEl.val();

		_trackBarItem.css({'width' : (_val / _maxVal) * 100 + '%'});
		_trackHandleItem.css({'left' : (_val / _maxVal) * 100 + '%'});
	});

	var _rangeMov = function(e) {
		var _rangeEl = $(e.target);
		var _rangeWrap = _rangeEl.closest('[class^="slider_range_wrap"]');
		var _trackBox = $('.slider_range_track', _rangeWrap);
		var _trackBarItem = $('.slider_range_bar', _rangeWrap);
		var _trackHandleItem = $('.slider_range_handle', _rangeWrap);
		var _minVal = parseInt(_rangeEl.attr('min'), 10);
		var _maxVal = parseInt(_rangeEl.attr('max'), 10);
		var _val = _rangeEl.val();
		var _step = _rangeEl.data('step');
		var _setVal = _val;

		if(_step) {
			if(_val >= _step) {
				_setVal = Math.ceil(_val / _step) * _step;
				_rangeEl.val(_setVal);
			}else{
				_setVal = _minVal;
				_rangeEl.val(_setVal);
			}
		}

		_trackBarItem.css({'width' : (_setVal / _maxVal) * 100 + '%'});
		_trackHandleItem.css({'left' : (_setVal / _maxVal) * 100 + '%'});
	}

	$('input[type="range"]').unbind('input change', _rangeMov).bind('input change', _rangeMov);
}

/*********************************************************************************************************
	combo box 요소 포커스시 스크롤
*********************************************************************************************************/
var comboScrollFn = function(el) {
	var _el = $(el);
	var _elOffseT = _el.offset().top;
	var _layerWrap = _el.closest('.layer_wrap');
	var _winH = window.innerHeight;
	var _scrollT = $(window).scrollTop();

	if(_elOffseT - (_winH / 2) > 0) {
		if(_layerWrap.length) {
			$('.layer_container', _layerWrap).animate({
				scrollTop : _elOffseT - (_winH / 2)
			}, 1);
		}else{
			$('body, html').animate({
				scrollTop : _elOffseT - (_winH / 2)
			}, 1);
		}
	}
}

/*********************************************************************************************************
	button tip 컴포넌트 안으로 들어갈 경우 상위요소 이벤트 상쇄
*********************************************************************************************************/
$(document).on('click', '[class^="btn_tip"]', function(e) {e.stopPropagation();});


















