/*********************************************************************************************************
DOCUMENT READY
*********************************************************************************************************/
$(document).ready(function() {

	contsPaddingSet();
	goToTop();

});

var contsPaddingSet = function() {
	var _layoutContain = $('#container');
	var _pageBotFixed = $('[class^="page_bottom_fixed"]');
	var _btnGroupBox = $('[class^="btn_group_wrap"]', _pageBotFixed);

	if(_pageBotFixed.length) {
		_pageBotFixed.each(function() {
			$(this).closest('.contents').css({
				'padding-bottom' : $(this).outerHeight() + 40
			});
		});
	}
}

/* 탑으로가기 */
var goToTop = function() {
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
$(document).on('click', function(e) {
	$('[class^="inp_bundle"]').removeClass('focus').find('.btn_inp_del').remove();
});
//inp_bundle 클릭시 input[type="text"]에 포커스 이동
$(document).on('click', '[class^="inp_bundle"]', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _inpTxt = $('[class^="inp_txt"]', _this);

	_inpTxt.each(function(i) {
		var _thisInpBox = $(this);
		if(_thisInpBox.find('input').length) {
			_thisInpBox.find('input').focus()
			return false;
		}
	});

});
//inp_bundle 클릭시 input[type="text"] click 이벤트 방지
$(document).on('click', '[class^="inp_bundle"] input, [class^="inp_bundle"] .inp_util', function(e) {e.stopPropagation();});
//input[type="text"]에 focus in
$(document).on('focusin keyup change', '[class^="inp_bundle"] input[type="text"], [class^="inp_bundle"] input[type="tel"], [class^="inp_bundle"] input[type="password"]', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _val = _this.val();
	var _bundle = _this.closest('[class^="inp_bundle"]');
	var _inpTxt = _this.closest('[class^="inp_txt"]');
	var _btnDelHtml = '<button type="button" class="btn_inp_del" aria-label="입력삭제"></button>';
	var _appendEl = _inpTxt;
	var _inpFlexCase = _inpTxt.closest('[class^="inp_flex"]');
	var _isSetVal = $('.btn_inp_del', _bundle).length ? true : false;
	if(_inpFlexCase.length) {
		if(_inpFlexCase.attr('class').indexOf('inp_flex_amount') < 0) _appendEl = _inpFlexCase;
	}

	$('[class^="inp_bundle"]').removeClass('focus').find('.btn_inp_del').remove();
	_bundle.addClass('focus');
	if(_isSetVal) _appendEl.append(_btnDelHtml)
	if(_val == '') {
		if(!_isSetVal) $('.btn_inp_del', _appendEl).remove();
	}else {
		if(!$('.btn_inp_del', _appendEl).length) _appendEl.append(_btnDelHtml);
	}
});
//btn_inp_del 클릭시 value삭제
$(document).on('click', '[class^="inp_bundle"] .btn_inp_del', function(e) {
	e.stopPropagation();
	var _this = $(this);
	var _bundle = _this.closest('[class^="inp_bundle"]');
	var _inpTxt = $('[class^="inp_txt"]', _bundle);

	$('input', _inpTxt).val('');
	_inpTxt.each(function(i) {
		var _thisInpBox = $(this);
		if(_thisInpBox.find('input').length) {
			_this.remove();
			_thisInpBox.find('input').focus();
			return false;
		}
	});

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
$(document).on('keyup change focusout paste', '[class^="modify_bundle_item"] [class^="inp_modify"] input', function(e) {
	var _this = $(this);
	var _bundleWrap = _this.closest('[class^="modify_bundle_item"]');
	var _hiddenTxt = $('> div', _bundleWrap);
	var _inpModify = $('[class^="inp_modify"]', _bundleWrap);

	_hiddenTxt.text(_this.val());
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
	var _tabList = $('[role="tablist"]', _innerWrap);
	var _tabItemsCase = $('[class^="tab_item"]', _tabList);
	var _tabItems = $('[role="tab"]', _tabItemsCase);

	// expanded list button
	var _btnFold = $('> [class^="btn_tab_fold"]', _targetWrap);

	// rol = tabpanel
	var _tabPanelName = 'panel_' + _tabUiName;
	var _tabPanelWrap = $('[tab-name="' + _tabPanelName + '"]');
	var _tabPanelSwipeBox = _tabPanelWrap.closest('[class^="panel_swiper_box"]');
	var _tabPanelItems = $('> [role="tabpanel"]', _tabPanelWrap);
	var _panelSwiperFn;

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

				}
			});
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
		console.log(`_scrollMov = ${i}`);
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
			_mov = _innerWrap.scrollLeft() == 0 ? _positionL - 14 : _innerWrap.scrollLeft() + (_positionL - 14);
		} else if(_tabListType == 'type02') {
			_mov = _innerWrap.scrollLeft() == 0 ? _positionL - 24 : _innerWrap.scrollLeft() + (_positionL - 24);
		} else {
			_mov = _innerWrap.scrollLeft() == 0 ? _positionL - 14 : _innerWrap.scrollLeft() + (_positionL - 14);
		}

		_innerWrap.animate({
			scrollLeft : _mov
		}, 300);
	}

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

	_initialFn();

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

	if(!_thisCase.hasClass('active')) {
		_toggleCase.removeClass('active');
		$('.toggle_tit', _toggleCase).attr('aria-expanded', false);
		$('.toggle_conts', _toggleCase).slideUp(300).attr('aria-hidden', true);

		_this.attr('aria-expanded', true);
		_thisConts.slideDown(300).attr('aria-hidden', false);
		_thisCase.addClass('active');
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
$(document).on('click', '[class^="tip_info_box"] .btn_tip_open', function() {
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
$(document).on('click', '[class^="info_view_box"] button.tit_view', function() {
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
	리스트 상세보기 스위치
 *********************************************************************************************************/
$(document).on('click', '.switch_func input[type="checkbox"]', function() {
	var _this = $(this);
	var _detailItems = $('.switch_func_item')
	var _isChecked = _this.prop('checked');

	if(_isChecked) {
		_detailItems.slideDown().attr('aria-hidden', 'false');
	}else{
		_detailItems.slideUp().attr('aria-hidden', 'true');
	}
});

/*********************************************************************************************************
	리스트 탑 바 영역 스크롤시 상단 고정
 *********************************************************************************************************/
var scrollTopFixed = function(target) {
	var _target = $(target);
	var _layerContain = _target.closest('.layer_container');
	var _offsetT = _target.offset().top;

	var _fixedFnc = function(scrollT) {
		var _current = (scrollT + 44) - _offsetT;
		if(_current >= 0) {
			_target.addClass('fixed');
		}else{
			_target.removeClass('fixed');
		}
	}

	if(_layerContain.length) {
		_layerContain.scroll(function() {
			var _scrollT = $(this).scrollTop();
			_fixedFnc(_scrollT);
		});
	}else{
		$(window).scroll(function() {
			var _scrollT = $(window).scrollTop();
			_fixedFnc(_scrollT);
		});
	}

}

$(document).on('click', '.word_search_case > button', function() {
	var _this = $(this);
	var _wordInp = _this.next();

	if(_wordInp.is(':hidden')) {
		_wordInp.attr('aria-hidden', 'false');
	}else{
		_wordInp.attr('aria-hidden', 'true');
	}
});

/*********************************************************************************************************
	즐겨찾기 버튼
 *********************************************************************************************************/
$(document).on('click', '.btn_bookmark02', function() {
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
			layerScrollCalc(_layerBox);
		} else if(_layerWrap.hasClass('full')) {
			fullScrollCalc(_layerBox);
		}
	});

	_layerBox.addClass('active');

	_layerBox.focus();
	_accessbility01 = $('.AccessibilityHtml1', _layerWrap);
	_accessbility02 = $('.AccessibilityHtml2', _layerWrap);

	// S :팝업 close
	_btnClose.off('click').on('click', function() {
		layerCloseFn(target);
	});
	$('.layer_mask', _layerWrap).off('click').on('click', function() {
		layerCloseFn(target);
	});
	// E :팝업 close

	// S : 팝업 처음, 마지막 포커스 이동 컨트롤
	_accessbility01.off('focusin').on('focusin', function() {
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
	_accessbility02.off('focusin').on('focusin', function() {
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
	var _btnExpanded = $('[class^="btn_layer_expanded"] button', _layerBox);
	var _accessbility01 = $('.AccessibilityHtml1', _layerWrap);
	var _accessbility02 = $('.AccessibilityHtml2', _layerWrap);


	_layerBox.removeClass('active');
	$('.layer_mask', _layerWrap).removeClass('active');
	if(_layerWrap.hasClass('dialog_up')) {
		_layerBox.css({
			'height' : 0,
			'transition-duration' : '300ms'
		});
	}

	_layerBox.one('transitionend', function() {
		$('body').removeClass('isPop');
		_accessbility01.remove();
		_accessbility02.remove();
		$('.layer_mask', _layerWrap).remove();
		_layerBox.removeAttr('tabindex');
		if(_layerWrap.hasClass('dialog_up')) _layerBox.css({'height' : 0});
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
var layerScrollCalc = function(target, speed) {
	var _layerBox = $(target);
	var _layeraHeader = $('.layer_header', _layerBox);
	var _layerContainer = $('.layer_container', _layerBox);
	var _layerContents = $('.layer_contents', _layerBox);
	var _btnGroupWrap = $('[class^="btn_layer_wrap"]', _layerBox);
	var _btnExpanded = $('.btn_layer_expanded', _layerBox);
	var _maxH = window.innerHeight * 0.6;
	var _standardH = _maxH;
	var _containH = _layerContents.outerHeight();
	var _calcH = _containH;
	var _speed = speed != undefined ? speed : 300;

	if(_layeraHeader.length) {
		_standardH = _standardH - _layeraHeader.outerHeight();
		_calcH = _calcH + _layeraHeader.outerHeight();
	}else{
		_standardH = _standardH - 32;
		_calcH = _calcH + 32;
	}
	if(_btnGroupWrap.length) {
		_standardH = _standardH - _btnGroupWrap.outerHeight();
		_calcH = _calcH + _btnGroupWrap.outerHeight();
	}else{
		_standardH = _standardH;
		_calcH = _calcH + 16;
	}

	if(_standardH < _containH || _btnExpanded.length) {
		_layerBox.css({
			'height' : _maxH,
			'transition-duration' : _speed + 'ms'
		}).data('max-height', _maxH);
		_layerContainer.css({
			'height' : _standardH,
			'transition-duration' : _speed + 'ms'
		});
	}else{
		_layerBox.css({
			'height' : _calcH,
			'transition-duration' : _speed + 'ms'
		});
	}
}

// 풀팝업 스크롤 영역 계산
var fullScrollCalc = function(target) {
	var _layerBox = $(target);
	var _layeraHeader = $('.layer_header', _layerBox);
	var _layerContainer = $('.layer_container', _layerBox);
	var _btnGroupWrap = $('[class^="btn_layer_wrap"]', _layerBox);
	var _containH = window.innerHeight;

	_containH = _layeraHeader.length ? _containH - _layeraHeader.outerHeight() : _containH;
	_containH = _btnGroupWrap.length ? _containH - _btnGroupWrap.outerHeight() : _containH;

	_layerContainer.css({
		'height' : _containH
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
	if(_btnGroupWrap.length) _containH = _containH - _btnGroupWrap.outerHeight();

	_layerBox.css({
		'height' : _boxH
	});
	_layerContainer.css({
		'height' : _containH
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
		if(_btnGroupWrap.length) _containH = _containH - _btnGroupWrap.outerHeight();

		_layerBox.css({
			'height' : _boxH,
			'transition-duration' : speed + 'ms'
		});

		if(_boxH >= _maxH) {
			_layerContainer.css({
				'height' : _containH,
				'transition-duration' : speed + 'ms'
			});
		}

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

	var _prevEl = $(' > .swiper-btn-prev, _wrap').length != 0 ? target + '> .swiper-btn-prev' : target + '> .swiper-container > .swiper-btn-prev';
	var _nextEl = $(' > .swiper-btn-next, _wrap').length != 0 ? target + '> .swiper-btn-next' : target + '> .swiper-container > .swiper-btn-next';

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
	font face onload
*********************************************************************************************************/
var isWebfontLoaded = false;
var wewFontloadFnc = [];
var fontFaceOnload = function(options) {
	var options = options || {};
	document.fonts.onloading = function() {
		if(options.loading) options.loading();
	}
	document.fonts.onloadingdone = function() {
		if(options.success) options.success();
	}
	document.fonts.onloadingerror = function() {
		if(options.error) options.error();
	}
}

fontFaceOnload({
	loading : function() {
		alert('Font is loading');
	},
	success : function() {
		alert('Font successfully loaded');
		isWebfontLoaded = true;
		for(var i = fontloadFnc - 1; i >= 0; i--) {
			wewFontloadFnc[i]();
		}
	},
	error : function() {
		alert('Error loading font');
	}
});


