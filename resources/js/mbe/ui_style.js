/*********************************************************************************************************
DOCUMENT READY
*********************************************************************************************************/
var $page_ID = null;
$(document).ready(function() {
	if($page_ID == null) {
		$page_ID = $('.contents');
	}
	goToTop();
});

var reAct = function() {
	setTimeout(function() {contsPaddingSet();}, 0);
//	goToTop();
}

var contsPaddingSet = function() {
	var _pageID = $page_ID;
	var _pageBotFixed = $('[class^="page_bottom_fixed"]', _pageID);
	var _btnGroupBox = $('[class^="btn_group_wrap"]', _pageBotFixed);
	var _padB = _pageBotFixed.length ? _pageBotFixed.outerHeight() + 40 : 40;

	_pageID.css('padding-bottom', _padB);
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
	Native 키패드
*********************************************************************************************************/
var nativeKeypadH = function(el, h) {
	var _el = el;
	var _height = h;
	var _cont = _el.closest('.contents');
}

/*********************************************************************************************************
	GNB MENU
*********************************************************************************************************/
$(document).on('click', '.btn_header_gnb', function() {
	gnbOpenFn(this)
});

// GNB OPEN FUNCTION
var gnbOpenFn = function(clickEl) {
	var _gnbWrap = $('#gnbWrap');
	var _gnbBox = $('.btn_header_gnb', _gnbWrap).attr('tabindex', '0');
	var _btnClose = $('.btn_gnb_close', _gnbWrap);
	var _btnOpen = $('#header .btn_gnb');
	var	_accessbility01;
	var _accessbility02;

	// _btnOpen.attr('aria-expanded', true);
	_gnbWrap.attr('aria-hidden', false);
	_gnbWrap.data('btn-gnb', clickEl);
	_gnbWrap.prepend('<div class="AccessibilityHtml1" tabindex="0" aria-hidden="true"></div>');
	_gnbWrap.append('<div class="AccessibilityHtml2" tabindex="0" aria-hidden="true"></div>');
	_gnbWrap.addClass('active');
	_gnbBox.focus();

	_accessbility01 = $('.AccessibilityHtml1', _gnbWrap);
	_accessbility02 = $('.AccessibilityHtml2', _gnbWrap);

	// S :GNB close
	_btnClose.off('click').on('click', function() {
		gnbCloseFn();
	});
	_gnbWrap.off('click').on('click', function() {
		gnbCloseFn();
	});
	// E :GNB close

	// S : _gnbWrap.click 팝업 close 이벤트 상쇄
	_gnbBox.off('click').on('click', function(e) {e.stopPropagation();});
	// E : _gnbWrap.click 팝업 close 이벤트 상쇄

	// S : GNB 처음, 마지막 포커스 이동 컨트롤
	_accessbility01.off('focusin').on('focusin', function() {
		if(_btnClose.is(':hidden') || !_btnClose.length) {
			_gnbBox.focus();
		}else{
			_btnClose.focus();
		}
	});
	_accessbility02.off('focusin').on('focusin', function() {
		_gnbBox.focus();
	});
	// E : GNB 처음, 마지막 포커스 이동 컨트롤
}

// GNB CLOSE FUNCTION
var gnbCloseFn = function() {
	var _gnbWrap = $('#gnbWrap');
	var _gnbBox = $('.btn_header_gnb', _gnbWrap);
	var _clickEl = $(_gnbWrap.data('btn-gnb'));
	var _accessbility01 = $('.AccessibilityHtml1', _gnbWrap);
	var _accessbility02 = $('.AccessibilityHtml2', _gnbWrap);

	_accessbility01.remove();
	_accessbility02.remove();
	_gnbWrap.attr('aria-hidden', true).removeClass('active');
	// _clickEl.focus().attr('aria-expanded', false);
	_clickEl.focus();
	_gnbBox.removeAttr('tabindex');
	_gnbWrap.removeData('btn-gnb');
}

/*********************************************************************************************************
	input text
*********************************************************************************************************/
//inp_bundle 포커스 dom클릭시 포커스 아웃 처리
$(document).on('click focusin', function(e) {
	$('[class^="inp_bundle"]').removeClass('focus').find('.btn_inp_del').remove();
});
//inp_bundle 클릭시 input[type="text"]에 포커스 이동
$(document).on('click', '[class^="inp_bundle"]', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _inpTxt = $('[class^="inp_txt"]', _this);
	var _inp = $('input', _this);

	_inp.eq(0).focus();
});
//inp_bundle 클릭시 input[type="text"] click 이벤트 방지
$(document).on('click focusin', '[class^="inp_bundle"] input, [class^="inp_bundle"] button, [class^="inp_bundle"] textarea', function(e) {e.stopPropagation();});
//input[type="text"]에 focus in
$(document).on('focusin', '[class^="inp_bundle"] input, [class^="inp_bundle"] textarea', function(e) {
	var _this = $(this);
	var _val = _this.val();
	var _bundle = _this.closest('[class^="inp_bundle"]');
	var _inpTxt = _this.closest('[class^="inp_txt"]');
	var _btnDelHtml = '<button type="button" class="btn_inp_del" aria-hidden="true"><span class="blind">입력값 삭제</span></button>';
	var _inpFlexCase = _inpTxt.closest('[class^="inp_flex"]');
	var _appendEl = _inpTxt;
	if(_inpFlexCase.length) {
		if(_inpFlexCase.attr('class').indexOf('inp_flex_amount') < 0) _appendEl = _inpFlexCase;
	}

	$('[class^="inp_bundle"]').removeClass('focus').find('.btn_inp_del').remove();

	_bundle.addClass('focus');
	_appendEl.append(_btnDelHtml);

	if(_val == '') {
		$('.btn_inp_del', _appendEl).hide().attr('aria-hidden', 'true');
	}else {
		$('.btn_inp_del', _appendEl).show().attr('aria-hidden', 'false');
	}
});
$(document).on('keyup change', '[class^="inp_bundle"] input', function(e) {
	var _this = $(this);
	var _val = _this.val();
	var _bundle = _this.closest('[class^="inp_bundle"]');
	var _inpTxt = _this.closest('[class^="inp_txt"]');
	var _btnDelHtml = '<button type="button" class="btn_inp_del" aria-hidden="true"><span class="blind">입력값 삭제</span></button>';
	var _inpFlexCase = _inpTxt.closest('[class^="inp_flex"]');
	var _appendEl = _inpTxt;
	if(_inpFlexCase.length) {
		if(_inpFlexCase.attr('class').indexOf('inp_flex_amount') < 0) _appendEl = _inpFlexCase;
	}

	if(_val == '') {
		$('.btn_inp_del', _appendEl).hide().attr('aria-hidden', 'true');
	}else {
		$('.btn_inp_del', _appendEl).show().attr('aria-hidden', 'false');
	}
});
//btn_inp_del 클릭시 value삭제
$(document).on('click', '[class^="inp_bundle"] .btn_inp_del', function() {
	var _this = $(this);
	var _bundle = _this.closest('[class^="inp_bundle"]');
	var _inpTxt = $('[class^="inp_txt"]', _bundle);
	var _inp = $('input', _bundle);

	_inp.val('').eq(0).focus();
});
/*통합검색 입력 박스 키보드 음성변경 버튼*/
$(document).on('click', '[class^="inp_bundle"] .keyboard_btn, [class^="inp_bundle"] .voice_btn', function(e) {
	e.stopPropagation();
});

/*********************************************************************************************************
input textarea
*********************************************************************************************************/
//inp_bundle 클릭시 textarea에 포커스 이동
$(document).on('click', '[class^="inp_bundle_textarea"]', function(e) {
	var _this = $(this);
	var _input = $('textarea', _this);

	_input.focus();
});
$(document).on('click', '[class^="inp_bundle_textarea"] textarea', function(e) {e.stopPropagation();});
//textarea에 focus in
$(document).on('focusin keyup change', '[class^="inp_bundle_textarea"] textarea', function() {
	var _this = $(this);
	var _val = _this.val();
	var _inpBox = _this.closest('[class^="inp_bundle_textarea"]');
	var _inpTxt = $('[class^="inp_txt"]', _inpBox);
	var _btnDelHtml = '<button type="button" class="btn_inp_del" aria-label="입력삭제"></button>';

	_inpBox.addClass('focus');
});
//textarea에 focus out
$(document).on('focusout', '[class^="inp_bundle_textarea"] textarea', function() {
	var _this = $(this);
	var _val = _this.val();
	var _inpBox = _this.closest('[class^="inp_bundle_textarea"]');
	var _inpTxt = $('[class^="inp_txt"]', _inpBox);

	_inpBox.removeClass('focus');
});

/*********************************************************************************************************
	수정 인풋박스 modify_bundle_item
*********************************************************************************************************/
$(document).on('keyup change paste', '[class^="modify_bundle_item"] [class^="inp_modify"] input', function(e) {
	var _this = $(this);
	var _bundleWrap = _this.closest('[class^="modify_bundle_item"]');
	var _hiddenTxt = $('> div[aria-hidden="true"]', _bundleWrap);
	var _txt = _this.val() == '' ? _this.attr('placeholder') : _this.val();

	_hiddenTxt.text(_txt);
});
$(document).on('focusout', '[class^="modify_bundle_item"] [class^="inp_modify"] input', function(e) {
	var _this = $(this);
	var _itemWrap = _this.closest('[class^="modify_bundle_item"]');
	var _inp = $('[class^="inp_modify"] input', _itemWrap);

	_inp.attr('disabled', true);
	_itemWrap.removeClass('focus');
});
$(document).on('click', '[class^="modify_bundle_item"] [class^="modify_btn"]', function(e) {
	var _this = $(this);
	var _itemWrap = _this.closest('[class^="modify_bundle_item"]');
	var _inp = $('[class^="inp_modify"] input', _itemWrap);

	_inp.attr('disabled', false).focus();
	_itemWrap.addClass('focus');

});

/*********************************************************************************************************
	SELECT DROP DOWN
 *********************************************************************************************************/
$(document).on('click focusin', function() {
	$('.combo_bundle02').removeClass('focus');
	$('.combo_bundle02 > button').attr('aria-expanded', 'false');
	$('.combo_bundle02 .combo_opt_box').hide().attr('aria-hidden', 'true');
	$('.combo_bundle02 .combo_opt_box .comboFoucsMov').remove();
});
$(document).on('click', '.combo_bundle02 > button', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _bundle = _this.closest('.combo_bundle02');
	var _optBox = $('.combo_opt_box', _bundle);
	var _isExpanded = _this.attr('aria-expanded');

	$('.combo_bundle02').removeClass('focus');
	$('.combo_bundle02 > button').attr('aria-expanded', 'false');
	$('.combo_bundle02 .combo_opt_box').hide().attr('aria-hidden', 'true');
	$('.combo_bundle02 .combo_opt_box .comboFoucsMov').remove();

	_bundle.addClass('focus');
	if(_isExpanded == 'false') {
		_this.attr('aria-expanded', 'true');
		_optBox.slideDown(300).attr('aria-hidden', 'false');
		_optBox.append('<div class="comboFoucsMov" style="overflow:hidden;height:0;line-height:0;font-size:1px;" tabindex="0" aria-hidden="true"></div>')
		$('.comboFoucsMov', _optBox).off().on('focusin', function(e) {
			e.stopPropagation();
			$('li:first button', _optBox).focus()
		});
	} else if(_isExpanded == 'true') {
		_this.attr('aria-expanded', 'false');
		_optBox.slideUp(300, function() {$(this).attr('aria-hidden', 'true');});
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
		if(_thisChild.children().length) {
			_selectView.empty().append(_thisChild.children().clone());
		}else{
			_selectView.text(_thisChild.text());
		}
		_inpHidden.val(_thisVal);
	}
	_btnBundle.attr('aria-expanded', 'false');
	_optBox.slideUp(300, function() {
		$(this).attr('aria-hidden', 'true');
		_btnBundle.focus();
	});
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
var tabControlFn = function(target, options) {
	// initial function
	this.initialFn = function() {
		_innerWrap.scrollLeft(0);
		_setTabAttrFn();
	}

	// 함수 옵션
	var options = options || {};

	var _targetWrap = $(target);
	var _innerWrap = $('> .tab_list_inner', _targetWrap);

	// data-tab-name
	var _tabUiName = _targetWrap.attr('tab-name');

	// tab position index
	var _oldIdx;
	var _nowIdx;

	// rol = tablist
	var _tabList = $(' > [role="tablist"], > .tab_list', _innerWrap);
	var _tabItemsCase = $('> [class^="tab_item"]', _tabList);
	var _tabItems = $(' > [role="tab"], > .tab_item', _tabItemsCase);

	// expanded list button
	var _btnFold = $('> [class^="btn_tab_fold"]', _targetWrap);

	// rol = tabpanel
	var _tabPanelName = 'panel_' + _tabUiName;
	var _tabPanelWrap = $('[tab-name="' + _tabPanelName + '"]');
	var _tabPanelSwipeBox = _tabPanelWrap.closest('[class^="panel_swiper_box"]');
	var _tabPanelItems = $('> [role="tabpanel"]', _tabPanelWrap);
	var _panelSwiperFn;

	// fixed box
	var _tabFixedWrap = _targetWrap.closest('[class^="tab_fixed_box"]');

	// layer wrap
	var _layerWrap = _targetWrap.closest('[class^="layer_wrap"]');

	// swiper
	var _isSwiperUI = options.swiperUI != undefined ? options.swiperUI : false;

	// id, aria 속성 셋팅
	var _setTabAttrFn = function() {
		var _lastInt = _tabItems.length;

		_tabItems.each(function(i) {
			var _this = $(this);
			var _num = i + 1;
			var _tabId = ('tab_' + _tabUiName) + '_' + (_num < 10 ? '0' + _num : i+1);
			var _tagName = _this.prop('tagName').toUpperCase();

			_this.attr('id', _tabId);
			if(_tagName === 'BUTTON') _setPanelAttrFn(i, 'aria-labelledby', _tabId);
			if($(this).parent().hasClass('active')) {
				_this.attr('aria-selected', true).attr('tabindex', 0);
				if(_tagName === 'BUTTON') _setPanelAttrFn(i, 'aria-hidden', 'false');
				if(_tagName === 'A') {
					_setPanelAttrFn(0, 'aria-labelledby', _tabId);
					_setPanelAttrFn(0, 'aria-hidden', 'false');
				}
				_oldIdx = _idxCycleFn(i - 1);
				_nowIdx = i;
			} else {
				_this.attr('aria-selected', false).attr('tabindex', -1);
				if(_tagName === 'BUTTON') _setPanelAttrFn(i, 'aria-hidden', 'true');
			}
		});

		if(_isSwiperUI) {
			_panelSwiperFn = new swiperFn('.' + _tabPanelSwipeBox.attr('class').split(' ')[0], {
				'initialSlide' : _nowIdx,
				'pagination' : false,
				'navigation' : false,
				'transitionStart' : function() {
					var _slides = this.slides;
					var _idx = this.realIndex;
					_oldIdx = _nowIdx;
					_nowIdx = _idx;

					_scrollMov(_nowIdx);
					_tabChFn (_nowIdx);
					_panelChFn(_nowIdx);
				},
				'transitionEnd' : function() {
					var _slides = this.slides;
					var _idx = this.realIndex;
					_oldIdx = _nowIdx;
					_nowIdx = _idx;

					_tabPanelItems.scrollTop(0).css({'visibility' : 'hidden'});
					_tabPanelItems.eq(_nowIdx).css({'visibility' : 'visible'});
				},
				'touchMove' : function() {
					_tabPanelItems.css({'visibility' : 'visible'});
				}
			});

			var _swiperOffset = _tabPanelSwipeBox.offset().top;
			var _height = window.innerHeight - _swiperOffset;

			_tabPanelItems.css({
				'height' : _height
			});
			_tabPanelItems.eq(_nowIdx).css({'visibility' : 'visible'});
		}

		if(_tabItemsCase.eq(_nowIdx).position()) {
			var _activeLeft = _tabItemsCase.eq(_nowIdx).position().left;
			var _activeWidth = _tabItemsCase.eq(_nowIdx).outerWidth();

			if(_activeLeft > 0) {
				var _spillover = _activeLeft + _activeWidth;

				if(_innerWrap.outerWidth() < _spillover) {
					_scrollMov(_nowIdx);
				}
			}
		}

		if(_btnFold.length) {
			_btnFold.attr('aria-hidden', false);
		}
		if(options.setInit) options.setInit(_nowIdx, _tabPanelItems);
	}

	var _setPanelAttrFn = function(idx, attrName, attrVale) {
		var _num = idx + 1;
		var _panelId = ('tabpanel_' + _tabUiName) + (_num < 10 ? '0' + _num : _num+1);

		_tabPanelItems.eq(idx).attr(attrName, attrVale);
		_tabItems.eq(idx).attr('aria-controls', _panelId);
	}

	// initial function
	var _initialFn = function() {
		_innerWrap.scrollLeft(0);
		_setTabAttrFn();
	}

	// tab change
	var _tabChFn = function(idx) {
		_tabItems.attr('aria-selected', 'false');
		_tabItems.attr('tabindex', '-1');
		_tabItems.parent().removeClass('active');
		_tabItems.eq(idx).attr('aria-selected', 'true');
		_tabItems.eq(idx).attr('tabindex', '0');
		_tabItems.eq(idx).parent().addClass('active');
	}

	// tab panel change
	var _panelChFn = function(idx) {
		_tabPanelItems.attr('aria-hidden', 'true');
		_tabPanelItems.eq(idx).attr('aria-hidden', 'false');


		if(options.panelChangeAfter) {
			options.panelChangeAfter(idx, _tabPanelItems.eq(idx));
		}
	}

	// index recycle function
	var _idxCycleFn = function(idx) {
		_oldIdx = _nowIdx;
		_nowIdx = (_tabItems.length + (idx % _tabItems.length)) % _tabItems.length;
		return _nowIdx;
	}

	// tab item disabled check function
	var _isDisabledFn = function(idx) {
		return _tabItems.eq(idx).parent().hasClass('disabled');
	}

	// calculate move tab idx function
	var _calcMoveIdx = function(idx, dir) {
		var _isDisabled;
		_oldIdx = idx;
		if(dir === 'minus') {
			_nowIdx = _idxCycleFn(idx-1);
			_isDisabled = _isDisabledFn(_nowIdx);
		} else if(dir === 'plus') {
			_nowIdx = _idxCycleFn(idx+1);
			_isDisabled = _isDisabledFn(_nowIdx);
		}

		if(_isDisabled) {
			return _calcMoveIdx(_nowIdx, dir);
		} else {
			return _nowIdx;
		}
	}

	var _scrollMov = function(i) {
		var _positionL = _tabItemsCase.eq(i).position().left;
//		var _mov = _positionL - (_innerWrap.outerWidth() / 2);
		var _tabListType;
		var _mov;
		if(_tabItemsCase.eq(i).closest('.tab_list_wrap').length) {
			_tabListType = 'type01';
		} else if(_tabItemsCase.eq(i).closest('.tab_list_wrap02').length) {
			_tabListType = 'type02';
		}
		if(_tabListType == 'type01') {
			_mov = _innerWrap.scrollLeft() == 0 ? _positionL - 24 : _innerWrap.scrollLeft() + (_positionL - 24);
		} else if(_tabListType == 'type02') {
			_mov = _innerWrap.scrollLeft() == 0 ? _positionL - 24 : _innerWrap.scrollLeft() + (_positionL - 24);
		} else {
			_mov = _innerWrap.scrollLeft() == 0 ? _positionL - 14 : _innerWrap.scrollLeft() + (_positionL - 14);
		}

		_innerWrap.animate({
			scrollLeft : _mov
		}, 300);
	}

	// 화면 스크롤시 상단 고정
	if(_tabFixedWrap.length) {
		var _tabOffsetT;
		var _tabTopFixFn = function(fixT, movT) {
			if(movT >= fixT) {
				_tabFixedWrap.addClass('fixed');
			}else{
				_tabFixedWrap.removeClass('fixed');
			}

		}

		if(_layerWrap.length) { // 팝업 내부 탭이 존재 할 경우
			_tabOffsetT = _targetWrap.position().top
			$('.layer_container', _layerWrap).scroll(function() {
				var _fixT = _tabOffsetT - options.fixedT || _tabOffsetT - 68;
				var _scrollT = $(this).scrollTop();
				var _movT = _scrollT + _fixT;

				_tabTopFixFn(_fixT, _movT);
			});
		} else { // 본 화면에 탭이 존재할 경우
			_tabOffsetT = _targetWrap.offset().top;
			$(window).scroll(function() {
				var _fixT = _tabOffsetT - options.fixedT || _tabOffsetT - 68;
				var _scrollT = $(window).scrollTop();
				var _movT = _scrollT;

				_tabTopFixFn(_fixT, _movT);
			});
		}
	}

	setTimeout(function() {
		if(_tabList.attr('role') == 'tablist') {// TAB TYPE
			_initialFn();
		}else{// NAVI TYPE
			_nowIdx = $('> .tab_list > .tab_item.active', _innerWrap).index();
			if(_tabItemsCase.eq(_nowIdx).position()) {
				var _activeLeft = _tabItemsCase.eq(_nowIdx).position().left;
				var _activeWidth = _tabItemsCase.eq(_nowIdx).outerWidth();

				if(_activeLeft > 0) {
					var _spillover = _activeLeft + _activeWidth;

					if(_innerWrap.outerWidth() < _spillover) {
						_scrollMov(_nowIdx);
					}
				}
			}

			return;
		}
	}, 0);

	// 2Depth tab 클릭이벤트 중복방지
	_tabItems.off();

	// click event
	_tabItems.on('click', function() {
		var _this = $(this);
		var _thisIdx = _tabItems.index(this);
		var _tagName = _this.prop('tagName').toUpperCase();

		if(_tagName === 'BUTTON') {
			_oldIdx = _nowIdx;
			_nowIdx = _thisIdx;
			_tabChFn(_thisIdx);
			_panelChFn(_thisIdx);
			_scrollMov(_nowIdx);

			if(_isSwiperUI) {
				_panelSwiperFn.swiper.slideTo(_nowIdx);
			}
		}
	});

	// key event
	_tabItems.on('keyup', function(e) {
		/**
		 * e.keyCode
		 * 37 : 좌, 39 : 우
		 * 38 : 상, 40: 하
		 */
		var _this = $(this);
		var _thisIdx = _tabItems.index(this);
		var _keycode = e.keyCode;
		var _tagName = _this.prop('tagName').toUpperCase();
		var _moveIdx;

		if(_keycode < 37 || _keycode > 40 ) return;

		if(_keycode === 37 || _keycode === 38) {
			_moveIdx = _calcMoveIdx(_thisIdx, 'minus');
		} else if(_keycode === 39 || _keycode === 40) {
			_moveIdx = _calcMoveIdx(_thisIdx, 'plus');
		}

		if(_tagName === 'BUTTON') {
			_tabChFn(_moveIdx);

			if(options.asyncPanelChange) options.asyncPanelChange(_moveIdx, _panelChFn);
			if(!options.asyncPanelChange) _panelChFn(_moveIdx);
		}
		_tabItems.eq(_moveIdx).focus();
	});

	// folding button event
	_targetWrap.off().on('click', '> [class^="btn_tab_fold"]', function() {
		var _this = $(this);
		if(_targetWrap.hasClass('active')) {
			_targetWrap.removeClass('active');
			_scrollMov(_nowIdx);
			_this.attr('aria-expanded', false);
		}else{
			_targetWrap.addClass('active');
			_innerWrap.scrollLeft(0);
			_this.attr('aria-expanded', true);
		}

	});

	return {
		'goToPanel' : function(idx) {
			_oldIdx = _nowIdx;
			_nowIdx = idx;
			_tabChFn(_nowIdx);
			_panelChFn(_nowIdx);
			_scrollMov(_nowIdx);

			if(_isSwiperUI) {
				_panelSwiperFn.swiper.slideTo(_nowIdx);
			}
		}
	}
}

/*********************************************************************************************************
Accordion (toggle type)
*********************************************************************************************************/
$(document).on('click', '[class^="toggle_list_wrap"] .toggle_tit', function() {
	var _this = $(this);
	var _thisCase = _this.closest('[class^="toggle_case"]');
	var _thisConts = $('.toggle_conts', _thisCase);
	var _toggleWrap = _this.closest('[class^="toggle_list_wrap"]');
	var _toggleCase = $('[class^="toggle_case"]', _toggleWrap);

	if(_toggleWrap.hasClass('multi')) {
		if(!_thisCase.hasClass('active')) {
			_this.attr('aria-expanded', true);
			_thisConts.slideDown(300).attr('aria-hidden', false);
			_thisCase.addClass('active');
		}else{
			_this.attr('aria-expanded', false);
			_thisConts.slideUp(300).attr('aria-hidden', true);
			_thisCase.removeClass('active');
		}
	}else{
		if(!_thisCase.hasClass('active')) {
			_toggleCase.removeClass('active');
			$('.toggle_tit', _toggleCase).attr('aria-expanded', false);
			$('.toggle_conts', _toggleCase).slideUp(300).attr('aria-hidden', true);

			_this.attr('aria-expanded', true);
			_thisConts.slideDown(300).attr('aria-hidden', false);
			_thisCase.addClass('active');
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
		$('.faq_tit', _toggleCase).attr('aria-expanded', false);
		$('.faq_conts', _toggleCase).slideUp(300).attr('aria-hidden', true);

		_this.attr('aria-expanded', true);
		_thisConts.slideDown(300).attr('aria-hidden', false);
		_thisCase.addClass('active');
	}
});

/*********************************************************************************************************
	TOOLTIP
*********************************************************************************************************/
$(document).on('click', '[class^="tip_info_box"] [class^="btn_tip_open"]', function() {
	var _globalTipWrap = $('[class^="tip_info_box"]');
	var _this = $(this);
	var _thisW = _this.outerWidth();
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
			var _tipZone = _tipConts.outerWidth() - 16;
			var _tipCaseW = _tipCase.outerWidth();
			var _posC = (_tipCaseW - _thisW) / 2;
			var _tipPos;

			if(_posC - 16 >= _tipOffsetX) {
				_tipPos = 8;
			} else if(_posC - 16 < _tipOffsetX) {
				_tipPos = _offsetX - _posC;

				if(_tipPos + _tipCaseW > _tipZone) {
					_tipPos = _tipZone - _tipCaseW;
				}

			}

			_tipCase.css({'transform' : 'translate('+ _tipPos +'px, 0)'});


		}).attr('aria-hidden', false).css({'left' : -(_offsetX)});

		_tipTail.css({'left' : _offsetX})
	}else{
		_this.attr('aria-expanded', false);
		_tipWrap.removeClass('active');
		_tipConts.hide().attr('aria-hidden', true);
	}
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
	var _bottomFixed = $('[class^="page_bottom_fixed"]');
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
	var _isExpanded = _this.attr('aria-expanded');
	var _viewConts = _this.next();

	if(_isExpanded == 'true') {
		_this.attr('aria-expanded', false);
		_viewConts.slideUp(200).attr('aria-hidden', true);
	}else{
		_this.attr('aria-expanded', true);
		_viewConts.slideDown(200).attr('aria-hidden', false);
	}
});

$(document).on('click', '[class^="info_view_box"] .fold_func', function() {
	var _this = $(this);
	var _textBox = $('span', _this);
	var _infoBox = _this.closest('[class^="info_view_box"]');
	var _foldBox = $('.fold_func_box', _infoBox);
	var _isHidden = _foldBox.attr('aria-hidden');

	if(_isHidden === 'true') {
		_foldBox.attr('aria-hidden', 'false');
		_textBox.text('접기');
	} else if(_isHidden === 'false') {
		_foldBox.attr('aria-hidden', 'true');
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
var scrollTopFixed = function(target, posT) {
	var _target = $(target);
	var _fixedBox = _target;
	var _targetConts = _target.closest('.contents')
	var _layerContain = _target.closest('.layer_container');
	var _targetH = _target.css('height');
	var _offsetT = _target.offset().top;
	var _posT = posT || 44;

	console.log(_target.hasClass('list_top_box02'));
	if(_target.hasClass('list_top_box02')) {//IBsheet
		_fixedBox = $('.list_top_inner', _target);
	}

	console.log(_fixedBox);

	var _fixedFnc = function(scrollT) {
		var _current = (scrollT + _posT) - _offsetT;
		if(_current >= 0) {
			if(_target.hasClass('fixed')) return;
			_target.addClass('fixed');
			_target.css({'height' : _fixedBox.outerHeight()});
			_fixedBox.css({'top' : _posT});
		}else{
			_target.removeClass('fixed').removeAttr('style');
			_fixedBox.removeAttr('style');
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

/*********************************************************************************************************
	IBsheet 검색 바
 *********************************************************************************************************/
$(document).on('click', '.list_sort_case .search_btn', function() {
	var _this = $(this);
	var _wrap = _this.closest('.list_sort_case');
	var _wordInp = $('.word_inp', _wrap);

	if(_wordInp.is(':hidden')) {
		_wordInp.attr('aria-hidden', 'false');
		_wordInp.find('input').focus();
	}else{
		_wordInp.attr('aria-hidden', 'true');
	}
});

//inp_bundle 포커스 dom클릭시 포커스 아웃 처리
$(document).on('click focusin', function(e) {
	$('.list_sort_case .word_inp').removeClass('focus').find('.btn_inp_del').remove();
});
$(document).on('click focusin', '[class^="inp_bundle"], [class^="inp_bundle"] input, [class^="inp_bundle"] textarea, [class^="combo_bundle"], [class^="combo_bundle"] button', function(e) {
	$('.list_sort_case .word_inp').removeClass('focus').find('.btn_inp_del').remove();
});
//inp_bundle 클릭시 input[type="text"] click 이벤트 방지
$(document).on('click focusin', '.list_sort_case .word_inp input, .list_sort_case .word_inp .btn_inp_del', function(e) {e.stopPropagation();});
//input[type="text"]에 focus in
$(document).on('focusin keyup change', '.list_sort_case .word_inp input', function(e) {
	var _this = $(this);
	var _val = _this.val();
	var _bundle = _this.closest('[class^="list_sort_case"]');
	var _inpBox = _this.closest('.word_inp');
	var _btnDelHtml = '<button type="button" class="btn_inp_del" aria-hidden="true"><span class="blind">입력값 삭제</span></button>';

	_inpBox.addClass('focus');
	if(_val == '') {
		if($('.btn_inp_del', _bundle).length) $('.btn_inp_del', _bundle).remove();
	}else {
		if(!$('.btn_inp_del', _bundle).length) _inpBox.append(_btnDelHtml);
	}
});
//btn_inp_del 클릭시 value삭제
$(document).on('click', '.list_sort_case .word_inp .btn_inp_del', function() {
	var _this = $(this);
	var _bundle = _this.closest('[class^="list_sort_case"]');
	var _inpBox = _this.closest('.word_inp');
	var _inp = $('input', _bundle);

	_inp.val('').eq(0).focus();
});

/*********************************************************************************************************
	즐겨찾기 버튼
 *********************************************************************************************************/
$(document).on('click', '.btn_bookmark02, .btn_bookmark03', function() {
	var _this = $(this);

	if(_this.hasClass('active')) {
		_this.removeClass('active');
	}else{
		_this.addClass('active');
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

	$('body').addClass('isPop');

	/*_layerWrap.attr('aria-hidden', false).css({'visibility' : 'visible'});*/
	if(clickEl) _layerWrap.data('click-target', clickEl);
	_layerWrap.data('scroll-pos', $(window).scrollTop());
	_layerWrap.prepend('<div class="AccessibilityHtml1" tabindex="0" aria-hidden="true"></div>');
	_layerWrap.prepend('<div class="layer_mask" aria-hidden="true"></div>');
	_layerWrap.append('<div class="AccessibilityHtml2" tabindex="0" aria-hidden="true"></div>');

	_layerWrap.attr('aria-hidden', false).show(1, function() {
		$('.layer_mask', _layerWrap).addClass('active');
		if(_layerWrap.hasClass('dialog_up')) {
			if(_btnGroupBox.length) {_layerConents.css({'padding-bottom' : _btnGroupBox.outerHeight()})}
			layerScrollCalc(_layerBox);
		} else if(_layerWrap.hasClass('full')) {
			if(_btnGroupBox.length) {_layerConents.css({'padding-bottom' : _btnGroupBox.outerHeight() + 16})}
			fullScrollCalc(_layerBox);
		}else{
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

var layerCloseFn = function(target) {
	var _layerWrap = $(target);
	var _layerBox = $('.layer_box', _layerWrap);
	var _layerContainer = $('.layer_container', _layerBox);
	var _btnClose = $('.layer_close', _layerBox);
	var _btnExpanded = $('[class^="btn_layer_expanded"] button', _layerBox);
	var _accessbility01 = $('.AccessibilityHtml1', _layerWrap);
	var _accessbility02 = $('.AccessibilityHtml2', _layerWrap);


	$('body').removeClass('isPop');

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
var layerScrollCalc = function(target) {
	var _layerBox = $(target);
	var _layerWrap = _layerBox.closest('[class^="layer_wrap"]');
	var _layeraHeader = $('.layer_header', _layerBox);
	var _layerContainer = $('.layer_container', _layerBox);
	var _layerContents = $('.layer_contents', _layerBox);
	var _btnGroupWrap = $('[class^="btn_layer_wrap"]', _layerBox);
	var _btnExpanded = $('.btn_layer_expanded', _layerBox);
	var _maxH = window.innerHeight * 0.6;
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
		'max-height' : _maxH
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
//	_containH = _btnGroupWrap.length ? _containH - _btnGroupWrap.outerHeight() : _containH;

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
		_this.attr('aria-expanded', false)
	} else if(_isExpanded == 'false') {
		_boxH = window.innerHeight;
		_containH = window.innerHeight;
		_this.attr('aria-expanded', true)
	}

	if(_layeraHeader.length) _containH = _containH - _layeraHeader.outerHeight();

	_layerBox.css({
		'max-height' : _boxH,
		'height' : _boxH
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
	var _wrap = $(target);
	var _swipeContain = $(' > .swiper-container', _wrap);
	var _swipeWrap = $(' > .swiper-wrapper', _swipeContain);
	var _swipeSlide = $(' > .swiper-slide', _swipeWrap);
	var _swiperPrev = $(' > .swiper-btn-prev, > .swiper-container > .swiper-btn-prev', _wrap);
	var _swiperNext = $(' > .swiper-btn-next, > .swiper-container > .swiper-btn-next', _wrap);
	var _slideTotal = _swipeSlide.length;
	var _options = options || {};

	var _prevEl = $(' > .swiper-btn-prev', _wrap).length != 0 ? target + '> .swiper-btn-prev' : target + '> .swiper-container > .swiper-btn-prev';
	var _nextEl = $(' > .swiper-btn-next', _wrap).length != 0 ? target + '> .swiper-btn-next' : target + '> .swiper-container > .swiper-btn-next';

	var _swiperOpt = {
		initialSlide : 0,
		allowTouchMove : _options.allowTouchMove != undefined ? _options.allowTouchMove : true,
		longSwipes : _options.longSwipes != undefined ? _options.longSwipes : false,
 		navigation : {
 			prevEl : _prevEl,
 			nextEl : _nextEl
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
			paginationBulletMessage : 'Go to slide {{index}}'
		},
		on : {
			init : function() {
				var _slides = this.slides;
				var _idx = _swiperOpt.loop ? this.activeIndex : this.realIndex;

				_slides.attr('tabindex', '-1').attr('aria-hidden', 'true').eq(_idx).attr('tabindex', '0').attr('aria-hidden', 'false');
			},
			slideChangeTransitionEnd : function() {
				if(_swiperOpt.loop) {
					var _slides = this.slides;
					var _idx = _swiperOpt.loop ? this.activeIndex : this.realIndex;

					_slides.attr('tabindex', '-1').attr('aria-hidden', 'true').eq(_idx).attr('tabindex', '0').attr('aria-hidden', 'false');

					if(_idx === 0) this.slideToLoop(_slideTotal - 1, 1);
					if(_idx === this.slides.length - 1) this.slideToLoop(0, 1);
				}

				/*slideChangeTransitionEnd 함수에 추가 작업 필요 할 경우*/
				if(_options.slideChangeTransitionEnd != undefined) _options.slideChangeTransitionEnd(this);
			}
		}
	}

	_swipeSlide.css({
		'width' : _swipeContain.outerWidth()
	});

	// initialSlide option
	if(_options.initialSlide != undefined) _swiperOpt['initialSlide'] = _options.initialSlide;

	// loop option
	if(_options.loop != undefined && _options.loop === true) _swiperOpt['loop'] = _options.loop;

	// navigation option
	if(_options.navigation != undefined && _options.navigation === false) _swiperOpt['navigation'] = false;

	// pagination custom option
	if(_options.pagination != undefined && _options.pagination === 'custom') {
		_swiperOpt['pagination'] = {
				el : target + ' > .swiper-ctrl-box > .swiper-pagi-box',
				type : 'custom',
				renderCustom : function(swiper, current, total) {
					return '<span >' + current + '</span>' + ' / ' + '<span class="">' + total + '</span>';
				}
		}
	}else if(_options.pagination != undefined && _options.pagination === false){
		_swiperOpt['pagination'] = false;
	}

	// transitionEnd option
	if(_options.transitionEnd != undefined) {
		_swiperOpt['on']['transitionEnd'] = options.transitionEnd;
	}

	// transitionStart option
	if(_options.transitionStart != undefined) {
		_swiperOpt['on']['transitionStart'] = options.transitionStart;
	}

	// touchMove option
	if(_options.touchMove != undefined) {
		_swiperOpt['on']['touchMove'] = options.touchMove;
	}

	var libSwiper = new Swiper(target + ' > .swiper-container', _swiperOpt);

	$(' > .swiper-notification', _swipeContain).attr('aria-live', 'off').attr('aria-atomic', false).attr('aria-hidden', true);

	return {
		swiper : libSwiper,
		slideTo : function(i) {
			libSwiper.slideTo(i);
		}
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
var srchAccNavi = function() {
	var _srchAccNavi = $('.srch_acc_navi');

	/* 스크로로 방향 체크 */
	var _pubLastScrollY = 0;
	var scrollDir = function() {
		var _srollY = $(window).scrollTop();
		var _dir = _pubLastScrollY - _srollY < 0 ? 'down' : 'up';
		_pubLastScrollY = _srollY;
		return _dir;
	}


	$(window).scroll(function(e) {
		var _scrollDir = scrollDir();

		if(_pubLastScrollY === 0) {
			_srchAccNavi.hide().attr('aria-hidden', 'true');
			return;
		}

		if(_scrollDir == 'up' && _pubLastScrollY != 0) {
			_srchAccNavi.show().attr('aria-hidden', 'false');
		} else if(_scrollDir == 'down') {
			_srchAccNavi.hide().attr('aria-hidden', 'true');
		}
	});

	$('.acc_navi_btn', _srchAccNavi).click(function() {
		var _this = $(this);
		var _wrap = _this.closest('.deposit_result_list');
		var _list = $('.toggle_list_wrap > ul', _wrap);
		var _listItems = $('> li', _list);
		var _movPos = _listItems.eq(_this.parent().index()).offset().top - ($('#header').outerHeight() + $('.tran_deposit_fixed').outerHeight());

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
	var _maxAngle = 30;
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

	var _viewBox = $('.info_view_row', _target);
	var _eventTarget;
	var _btnUtil = $('.info_util_case > button', _viewBox);
	var _isTransition = false;

	var start = function(e, el) {
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
		var _touchObj = e.originalEvent.changedTouches[0];
		_delta = {
			X : _touchObj.pageX - _current.X,
			Y : _touchObj.pageY - _current.Y
		}

		_rads = Math.atan(_delta.Y/_delta.X);
		_deg = Math.abs(_rads * (180 / Math.PI));
		_movDist = _delta.X + _posX;
		_dir = _delta.X < 0 ? 'left' : 'right';

		if(_deg < _maxAngle) {
			e.preventDefault();
			if(_dir === 'left' && _movDist < -150) {
				_movDist = -150;
			} else if(_dir === 'right' && _movDist > 0) {
				_movDist = 0;
			}
		}

		_translate(_eventTarget, _movDist, 0);
	}
	var end = function(e) {
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

		if(Math.abs(_delta.X) > 50 && _deg < _maxAngle) {
			if(_dir === 'left') {
				_movDist = -97;
			} else if(_dir === 'right') {
				_movDist = 0;
			}
		} else if(Math.abs(_delta.X) <= 50 && _deg < _maxAngle) {
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
		_isTransition = true;
		_translate(_eventTarget, _movDist, _duration);
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
			_guideBox.show().attr('aria-hidden', 'false');
		}

		if(_options.holdEnd) _options.holdEnd(_tapEvtEl, $(_cardPosInf[_cardPosKey[_selectedIdx]]), _selectedIdx != undefined ? true : false);
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