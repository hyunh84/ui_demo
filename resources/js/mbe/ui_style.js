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
// inp_bundle 클릭시 input[type="text"]에 포커스 이동
$(document).on('click', '[class^="inp_bundle"]', function(e) {
	var _this = $(this);
	var _input = $('input[type="text"]', _this);

	_input.focus();
});
// input[type="text"]클릭시 부모 이벤트 상쇄
$(document).on('click', '[class^="inp_bundle"] [class="inp_txt"], [class^="inp_bundle"] input[type="text"], [class^="inp_bundle"] .btn_inp_del', function(e) {e.stopPropagation();});
//input[type="text"]에 focus in
$(document).on('focusin keyup change', '[class^="inp_bundle"] input[type="text"], [class^="inp_bundle"] input[type="tel"], [class^="inp_bundle"] input[type="password"]', function() {
	var _this = $(this);
	var _val = _this.val();
	var _inpBox = _this.closest('[class^="inp_bundle"]');
	var _inpTxt = _this.closest('[class^="inp_txt"]');
	var _btnDelHtml = '<button type="button" class="btn_inp_del" aria-label="입력삭제"></button>';

	_inpBox.addClass('focus');
	if(_val == '') {
		$('.btn_inp_del', _inpTxt).remove();
	}else {
		if(!$('.btn_inp_del', _inpTxt).length) _inpTxt.append(_btnDelHtml);
	}
});
//input[type="text"]에 focus out
$(document).on('focusout', '[class^="inp_bundle"] input[type="text"], [class^="inp_bundle"] input[type="tel"], [class^="inp_bundle"] input[type="password"]', function() {
	var _this = $(this);
	var _val = _this.val();
	var _inpBox = _this.closest('[class^="inp_bundle"]');
	var _inpTxt = $('[class^="inp_txt"]', _inpBox);

	if(!$('.btn_inp_del', _inpTxt).length) _inpBox.removeClass('focus');

	if(_val == '') {
		$('.btn_inp_del', _inpTxt).remove();
	}else {
		if(!$('.btn_inp_del', _inpTxt).length) _inpTxt.append(_btnDelHtml);
	}
});
//input[type="text"] value delete
$(document).on('click', '[class^="inp_bundle"] [class="inp_txt"] .btn_inp_del', function() {
	var _this = $(this);
	var _inpBox = _this.closest('[class^="inp_bundle"]');
	var _inpTxt = _this.closest('[class^="inp_txt"]');
	var _input = $('input[type="text"], input[type="tel"], input[type="password"]', _inpTxt);

	_input.val('').focus();
	_this.remove();
});
//btn_inp_del focusin
$(document).on('focusin', '[class^="inp_bundle"] [class="inp_txt"] .btn_inp_del', function() {
	var _this = $(this);
	var _inpBox = _this.closest('[class^="inp_bundle"]');

	_inpBox.addClass('focus');
});
//btn_inp_del focusout
$(document).on('focusout', '[class^="inp_bundle"] [class="inp_txt"] .btn_inp_del', function() {
	var _this = $(this);
	var _inpBox = _this.closest('[class^="inp_bundle"]');

	_inpBox.removeClass('focus');
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
	COMBOBOX
*********************************************************************************************************/


/*********************************************************************************************************
	TAB
*********************************************************************************************************/
var tabControlFn = function(target, options) {
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
	var _tabPanelWrap = $('[tab-name="' + _tabPanelName + '"]')
	var _tabPanelItems = $('> [role="tabpanel"]', _tabPanelWrap);

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

			if(_lastInt - 1 === i) {
				var _spillover = _tabItemsCase.eq(_tabItemsCase.length - 1).position().left;

				if(_innerWrap.outerWidth() < _spillover) {
					_scrollMov(_nowIdx);

					if(_btnFold.length) {
						_btnFold.attr('aria-hidden', false);
					}
				}
			}
		});
	}

	var _setPanelAttrFn = function(idx, attrName, attrVale) {
		var _num = idx + 1;
		var _panelId = ('tabpanel_' + _tabUiName) + (_num < 10 ? '0' + _num : _num+1);

		_innerWrap.scrollLeft(0);
		_tabPanelItems.eq(idx).attr(attrName, attrVale);
		_tabItems.eq(idx).attr('aria-controls', _panelId);
	}

	// initial function
	var _initialFn = function() {
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
		var _mov = _positionL - (_innerWrap.outerWidth() / 2);

		_innerWrap.scrollLeft(_mov);
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
		$('.toggle_conts', _toggleCase).slideUp(500).attr('aria-hidden', true);

		_this.attr('aria-expanded', true);
		_thisConts.slideDown(500).attr('aria-hidden', false);
		_thisCase.addClass('active');
	}
});

/*********************************************************************************************************
	TOOLTIP
*********************************************************************************************************/
$(document).on('click', '[class^="tip_info_box"] .btn_tip_open', function() {
	var _tipAreaW = $(window).width() - 80;
	var _globalTipWrap = $('[class^="tip_info_box"]');
	var _this = $(this);
	var _tipWrap = _this.closest('[class^="tip_info_box"]');
	var _tipConts = $('.tip_conts_box', _tipWrap);
	var _tipCase = $('.tip_conts_case', _tipConts);
	var _tipTail = $('.tip_tail', _tipConts);
	var _offsetX = _tipWrap.offset().left;

	if(_tipConts.is(':hidden')) {
		_globalTipWrap.removeClass('active');
		$('.btn_tip_open', _globalTipWrap).attr('aria-expanded', false);
		$('.tip_conts_box', _globalTipWrap).hide().attr('aria-hidden', true)

		_this.attr('aria-expanded', true);
		_tipWrap.addClass('active');
		_tipConts.show(1, function() {
			var _tipCaseW = _tipCase.outerWidth();
			var _tipPos = (_tipAreaW - _offsetX < _tipCaseW) ? _tipAreaW - _tipCaseW : _offsetX - 30;

			_tipCase.css({'transform' : 'translate('+ _tipPos +'px, 0)'})
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
	LAYER POPUP
*********************************************************************************************************/
var layerOpenFn = function(target, clickEl) {
	var _layerWrap = $(target);
	var _layerBox = $('.layer_box', _layerWrap).attr('tabindex', '0');
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
		if(_layerWrap.hasClass('dialog_up')) {
			layerScrollCalc(_layerBox);
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

	$('body').removeClass('isPop');
	_accessbility01.remove();
	_accessbility02.remove();
	$('.layer_mask', _layerWrap).remove();
	_layerBox.removeAttr('tabindex');
	if(_layerWrap.hasClass('dialog_up')) _layerBox.css({'height' : 0});
	_layerWrap.attr('aria-hidden', true).hide();
	_layerBox.removeClass('active');

	if(_btnExpanded.length) {
		_btnExpanded.attr('aria-expanded', false);
		_layerContainer.removeAttr('style');
	}

	if(_layerWrap.data('click-target')) {
		var _clickEl = $(_layerWrap.data('click-target'));
		_layerWrap.removeData('click-target');
		$(_clickEl).focus();
	}
}

// max height 60% 설정 함수
var layerScrollCalc = function(target) {
	var _layerBox = $(target);
	var _layeraHeader = $('.layer_header', _layerBox);
	var _layerContainer = $('.layer_container', _layerBox);
	var _btnGroupWrap = $('[class^="btn_layer_wrap"]', _layerBox);
	var _maxH = window.innerHeight * 0.6;

	var _standardH = _maxH;
	var _containH = _layerContainer.outerHeight();
	var _calcH = _containH;

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
		_standardH = _standardH - 16;
		_calcH = _calcH + 16;
	}

	if(_standardH < _containH) {
		_layerBox.css({'height' : _maxH}).data('max-height', _maxH);
		_layerContainer.css({
			'height' : _standardH
		});
	}else{
		_layerBox.css({'height' : _calcH});
	}
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
			return;
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
		_layerContainer.css({
			'height' : _containH,
			'transition-duration' : speed + 'ms'
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
	var _swipeContain = $('.swiper-container', _wrap);
	var _swipeWrap = $('.swiper-wrapper', _swipeContain);
	var _swipeSlide = $('.swiper-slide', _swipeWrap);
	var _swiperPrev = $('.swiper-btn-prev', _wrap);
	var _swiperNext = $('.swiper-btn-next', _wrap);
	var _slideTotal = _swipeSlide.length;
	var _options = options || {};
	var _swiperOpt = {
 		navigation : {
 			prevEl : target + ' .swiper-btn-prev',
 			nextEl : target + ' .swiper-btn-next'
 		},
		pagination : {
			el : target + ' .swiper-pagi-box',
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
				var _slides = this.slides;
				var _idx = _swiperOpt.loop ? this.activeIndex : this.realIndex;

				_slides.attr('tabindex', '-1').attr('aria-hidden', 'true').eq(_idx).attr('tabindex', '0').attr('aria-hidden', 'false');

				if(_swiperOpt.loop) {
					if(_idx === 0) this.slideToLoop(_slideTotal - 1, 1);
					if(_idx === this.slides.length - 1) this.slideToLoop(0, 1);
				}
			}
		}
	}

	_swipeSlide.css({
		'width' : _swipeContain.outerWidth()
	});

	// loop option
	if(_options.loop != undefined && _options.loop === true) _swiperOpt['loop'] = _options.loop;

	// navigation option
	if(_options.navigation != undefined && _options.navigation === false) _swiperOpt['navigation'] = false;

	// pagination custom potion
	if(_options.pagination != undefined && _options.pagination === 'custom') {
		_swiperOpt['pagination'] = {
			el : target + ' .swiper-pagi-box',
			type : 'custom',
			renderCustom : function(swiper, current, total) {
				return '<span >' + current + '</span>' + ' / ' + '<span class="">' + total + '</span>';
			}
		}
	}

	var libSwiper = new Swiper(target + ' .swiper-container', _swiperOpt);

	$('.swiper-notification', _swipeContain).attr('aria-live', 'off').attr('aria-atomic', false).attr('aria-hidden', true);

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