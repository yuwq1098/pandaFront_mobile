function openHtml(url) {
	console.log(url);
	currentApp.mainView.router.loadPage(url);
}
function initRegister() {
	$$('.agree-tk').click(function() {
		$$(this).toggleClass('read')
	})
}

function initPassword4() {
	$$('.password-s').click(function() {
		$$(this).toggleClass('show');
		if($$("input[name=newPwd]").attr("type") == "text") {
			$$("input[name=newPwd]").attr('type', 'password');
		} else if($$("input[name=newPwd]").attr("type") == "password") {
			$$("input[name=newPwd]").attr('type', 'text');
		}
	})
}

function initAbout() {
	if(isPlus) {
		// 获取本地应用资源版本号
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			$$(".edition").text(inf.version);
			$$('#btnAppUpdate').click(function() {
				plus.t_checkUpdate(inf.version, {
					tips: true
				});
			});
		});
	} else {
		$$('.webviews').css('display', 'none');
	}
}


function initRecharge() {
	
	$$('.open-info').on('click', function() {
		console.log(1);
		currentApp.pickerModal('.picker-info')
	});
}
//版本说明
function initImprint() {
	if(isPlus) {
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			$$.service.imprint(version, function(data) {

			})

		});
	}
}

function initPhoneIndex(plus) {
	//
	document.addEventListener('plusready', function() {
		var wvs = window.plus.webview.all();
		for(var i = 0; i < wvs.length; i++) {
			if(wvs[i].id != window.plus.runtime.appid)
				window.plus.webview.close(wvs[i]);
		}
		window.plus.webview.currentWebview().id = window.plus.runtime.appid;

	});

	// 下拉刷新页面
	var ptrContent = $$('.pull-to-refresh-content');
	// 添加'refresh'监听器 
	ptrContent.on('refresh', function(e) {
		// 模拟2s的加载过程
		setTimeout(function() {
			// 加载完毕需要重置 
			currentApp.pullToRefreshDone();
		}, 2000);
	});
	$$("#zw").click(function() {
		if(isPlus) {
			$$('#tab_zw').on('show', function() {
				$$(document.body).data('tabMian', 'tab_zw');
				viewMain.showNavbar();
				if($$("#tab_zw .frame_0744").length == 0) {
					//currentApp.showProgressbar();
					$$("#tab_zw").html('<iframe id="frame_0744" class="frame_0744" src="http://m.0744.cn" style="background-color:#FFF;"></iframe>');

					function iframeload() {
						if(!frame_0744.readyState || frame_0744.readyState == "complete") {
							//currentApp.hideProgressbar(); 
						}
					}
					frame_0744.onload = frame_0744.onreadystatechange = iframeload;
				}
			});
		} else {
			$$("#zw").attr("href", "http://m.0744.cn");
		}
	});

	$$('#tab_my').on('show', function() {
		$$(document.body).data('tabMian', 'tab_my');
		viewMain.hideNavbar();
		if($$("#tab_my .myinfo-top").length == 0) {
			$$.get('my/index.html', {}, function(data) {
				$$("#tab_my").html($$(data).find('.page-content').html());
				initMyIndex();
			});
		}
	});
	$$('#tab_fenxiao').on('show', function() {
		$$(document.body).data('tabMian', 'tab_fenxiao');
		viewMain.showNavbar();
	});
	$$(".open-scanning").click(function() {
		if(isPlus) {
			$$('.popup-scanning').on('open', function() {
				startRecognize();
			});
			$$('.popup-scanning').on('closed', function() {
				closeScan();
			});
		} else {
			currentApp.alert("微信内暂不支持扫一扫", "张网旅游");
			$$(".open-scanning").removeAttr("data-popup");
			$$(".open-scanning").removeClass("open-popup");
		}
	});
	//二维码扫描页面

	$$(".popup-ewm").on('open', function() {
		$$.service.getmyqrcode(function(data) {
			/*console.log(JSON.stringify(data));*/
			$$("#imgdirect").attr('src', data.direct);
			$$("#imgdevelopment").attr('src', data.development);
		});
	})
	initindexNewdrawals();
	// initIndexList();
	initPlatIndex();

	//currentApp.mainView.loadPage('set/passwordset3.html');
}

/**
 * 首頁初始化
 */
function initIndex(){
	var _this = this;
	$$.service.initindex(function(data){
		var data = JSON.parse(data);
		var indexContact = $$("script#indexcontact").html();
		var indexWalletContent = $$("script#indexWalletContent").html();
		// console.log(indexContact);
		var indexContactTemplate = Template7.compile(indexContact);
		// console.log(indexContactTemplate);
		var indexWalletContentTemplate = Template7.compile(indexWalletContent);
		var personHTML1 = indexContactTemplate(data ? data : {});
		var personHTML2 = indexWalletContentTemplate(data ? data : {});
		
		$$('#index_head').html(personHTML1);
		$$('#index_wallet').html(personHTML2);
	});
}
/**
 * 会员信息 
 * @Author   zwr
 * @DateTime 2017-03-27
 */
function initpersonal_data()
{
	$$.service.userinfo(function(data){
		var info=data.info
		var tmpuserinfo = $$("#tmpuserinfo").html();
		var tmpuserinfoTemplate = Template7.compile(tmpuserinfo);
		var personHTML = tmpuserinfoTemplate((info ? info : {}));
		$$("#userinfo").html(personHTML);
	
	})
}
/**
 * [修改会员信息]
 * @Author   zwr
 * @DateTime 2017-03-27
 */
function initeditpersonal_data()
{
	$$.service.userinfo(function(data){
		var info=data.info
		var tmpuserinfo = $$("script#tmpuserinfo_edit").html();
		var tmpuserinfoTemplate = Template7.compile(tmpuserinfo);
		var personHTML = tmpuserinfoTemplate((info ? info : {}));
		$$("#userinfo_edit").html(personHTML);
	})
	$$('.edit_personal_save').on('click',function(){
		var formData = currentApp.formToJSON('#edit_userinfo_form');
		$$.service.edit_personal_save(formData,function () {
			currentApp.mainView.loadPage('commoninfo/personal_data.html');
		})
	})

}
/**
 * 关于我们
 * @Author   zwr
 * @DateTime 2017-03-28
 */
function initaboutus()
{
	$$.service.about(function(
		data) {
		var tmpabout = $$('script#tmpabout').html();
		var tmpaboutTemplate = Template7.compile(tmpabout);
		var personHTML = tmpaboutTemplate((data ? data : {
			list: []
		}));
		$$("#about").html(personHTML);	
		$$('.aboutinfo').on('click', function(e){
			var _id = $$(e.currentTarget).attr('id');
			currentApp.mainView.loadPage('aboutus/aboutinfo.html?id=' + _id);
		});	     
	})


}
/**
 * 关于我们详情页
 * @Author   zwr
 * @DateTime 2017-03-28
 */
function initaboutus_info(page)
{
	var id = page.query.id;
	$$.service.about_info(id,function(data) {
		var info =data.info;
		var tmpaboutinfo = $$('script#tmpaboutinfo').html();
		var tmpabout_infoTemplate = Template7.compile(tmpaboutinfo);
		var personHTML = tmpabout_infoTemplate((info ? info : {}));
		$$("#aboutinfo").html(personHTML);	
	})
}
/**
 * [退出登录]
 * @Author   zwr
 * @DateTime 2017-03-28
 */
function initloginout(){
	$$('.loginout').on('click', function () {
    	currentApp.confirm('确认退出吗?', '退出', function () {
	    	$$.service.outLogin(function(){
	    		currentApp.mainView.router.loadPage("auth/login.html");
	    	})
	    });
    });
}


/**
 * 初始化登录页面
 * @param {Object} plus
 */
function initLogin(plus) {
	//把历史登录记录用户名写入登录用户名
	$$('input[name=username]').val($$.localStorage.lastLoginInfo.userName());
	// 激活按钮
	$$('input:last-child').focus(function() {
		if($$('input').val()){
			$$('.default_btn_green').addClass('active');
		} else{
			$$('.default_btn_green').removeClass('active');
		}
	})
	//登录操作 
	$$('.btnlogin').click(function() {
		_user = $$('input[name=username]').val();
		_pwd = $$('input[name=password]').val();
		if(_user == '') {
			alert('用户名不能为空！', '登录提示', function() {
				$$.newFocus($$('input[name=username]'));
			});
			return false;
		}
		if(_pwd == '') {
			alert('密码不能为空！', '登录提示', function() {
				$$.newFocus($$('input[name=password]'));
			});
			return false;
		}
		if(_pwd.length < 6) {
			alert('密码长度不能小余6位！', '登录提示', function() {
				$$.newFocus($$('input[name=password]'));
			});
			return false;
		}
		$$.service.login(_user, _pwd, function(data) {
			//记录登录信息到本地
			$$.localStorage.setLoginInfo({
				userName: _user,
			});
			$$('input[name=password]').val('');
			//关闭登录页面
			currentApp.closeModal();
			currentApp.mainView.router.loadPage("index/index.html");
		});
	});

	//初始化第三方登录方法
	$$.common.thirdLoginInit();
}


//注册
function initRegister(){
	$$('.register_btn').click(function() {
		_user = $$('input[name=username]').val();
		_pwd = $$('input[name=password]').val();
		_affirmPwd = $$('input[name=affirmPassword]').val();
		_phone = $$('input[name=phone]').val();
		_sms_code = $$('input[name=sms_code]').val();
		
		if(_user == '') {
			alert('用户名不能为空！', '注册提示', function() {
				$$.newFocus($$('input[name=username]'));
			});
			return false;
		}
		if(_pwd == '') {
			alert('密码不能为空！', '注册提示', function() {
				$$.newFocus($$('input[name=password]'));
			});
			return false;
		}
		if(_pwd.length < 6) {
			alert('密码长度不能小余6位！', '注册提示', function() {
				$$.newFocus($$('input[name=password]'));
			});
			return false;
		}
		if(_pwd != _affirmPwd) {
			alert('两次重复密码不正确！', '注册提示', function() {
				$$.newFocus($$('input[name=affirmPassword]'));
			});
			return false;
		}
		if(!checkPhone(_phone)) {
			alert('手机号填写错误！', '注册提示', function() {
				$$.newFocus($$('input[name=phone]'));
			});
			return false;
		}
		if(_sms_code == '') {
			alert('验证码不能为空！', '注册提示', function() {
				$$.newFocus($$('input[name=sms_code]'));
			});
			return false;
		}
		
		$$.service.register(_user, _pwd, _phone ,_sms_code, function(e) {
			//记录登录信息到本地
			$$.localStorage.setLoginInfo({
				userName: _user
			});
			$$('input[name=password]').val('');
			//关闭登录页面
			currentApp.closeModal();
			currentApp.mainView.router.loadPage("index/index.html");
		});
		
	})
}

var forgotPhone = '';
//忘记密码
function forgotPassword(){
	$$('.pd_btn').click(function(){ //手机验证
		_phone = document.getElementById('phone').value;
		_sms_code = document.getElementById('sms_code').value;
		
		if(!checkPhone(_phone)) {
			alert('手机号格式错误！', '验证提示', function() {
				$$.newFocus($$('input[name=phone]'));
			});
			return false;
		}
		if(_sms_code == '') {
			alert('验证码不能为空！', '验证提示', function() {
				$$.newFocus($$('input[name=sms_code]'));
			});
			return false;
		}
		
		$$.service.forgotPassword(_phone,_sms_code,null,1, function(data){
			forgotPhone = data.phone;
			currentApp.mainView.router.loadPage('auth/forget-password-reset-password.html');
		})
		
	});
	$$('.register_btn').click(function(){ //修改密码
		_newPasword = $$('input[name=newPassword]').val();
		_confirmPasword = $$('input[name=confirmPasword]').val();
		if(_newPasword == '') {
			alert('密码不能为空！', '修改提示', function() {
				$$.newFocus($$('input[name=newPasword]'));
			});
			return false;
		}
		if(_newPasword.length < 6) {
			alert('密码长度不能小余6位！', '修改提示', function() {
				$$.newFocus($$('input[name=newPasword]'));
			});
			return false;
		}
		if(_newPasword != _confirmPasword) {
			alert('两次重复密码不正确！', '修改提示', function() {
				$$.newFocus($$('input[name=confirmPasword]'));
			});
			return false;
		}
		
		$$.service.forgotPassword(forgotPhone,null,_newPasword,2,function(data){
			forgotPhone = '';
			currentApp.mainView.router.loadPage('auth/forget-password-reset-success.html');
		})
	})
}

//修改密码
function updatePassword(){
	$$('.update_password_btn').click(function(){
		_password = $$('input[name=password]').val();
		_newPasword = $$('input[name=new_password]').val();
		_confirmPasword = $$('input[name=confirm_pasword]').val();
		if(_password == '') {
			alert('原密码不能为空！', '修改提示', function() {
				$$.newFocus($$('input[name=password]'));
			});
			return false;
		}
		if(_newPasword == '') {
			alert('新密码不能为空！', '修改提示', function() {
				$$.newFocus($$('input[name=newPasword]'));
			});
			return false;
		}
		if(_newPasword.length < 6) {
			alert('新密码长度不能小余6位！', '修改提示', function() {
				$$.newFocus($$('input[name=newPasword]'));
			});
			return false;
		}
		if(_newPasword != _confirmPasword) {
			alert('两次重复密码不正确！', '修改提示', function() {
				$$.newFocus($$('input[name=confirmPasword]'));
			});
			return false;
		}
		$$.service.updatePassword(_password,_newPasword, function(){
			//调用清除本地缓存数据方法
			currentApp.mainView.router.loadPage('auth/login.html');
		})
	});
}

//安全中心
function securityCenter(){
	
}

//手机验证
function phoneVeify(){
	$$('.phone_verify_btn').click(function(){ //手机验证
		_phone = $$('input[name=phone]').val();
		_sms_code = $$('input[name=sms_code]').val();
		
		if(!checkPhone(_phone)) {
			alert('手机号格式错误！', '验证提示', function() {
				$$.newFocus($$('input[name=phone]'));
			});
			return false;
		}
		if(_sms_code == '') {
			alert('验证码不能为空！', '验证提示', function() {
				$$.newFocus($$('input[name=sms_code]'));
			});
			return false;
		}
		
		
		$$.service.phoneVeify(_phone,_sms_code, function(data){
			currentApp.alert('验证成功！','操作提示',function(){
				currentApp.mainView.router.loadPage('index/index.html');
    		});
		})
		
	});
}

//添加常用联系人  2017.3.23
function initadd_contact(){
	// console.log('d');
	$$('#contact_add').on('click', function(){
	  var formData = currentApp.formToJSON('#contact_form');
	  // console.log(formData);
		// if(formData.contact_birthday == '') {
		// 	alert('请填写生日！', '提示', function() {
		// 		$$.newFocus($$('input[name=contact_birthday]'));
		// 	});
		// 	return false;
		// }
		if(formData.contact_email == '') {
			alert('请填写email！', '提示', function() {
				$$.newFocus($$('input[name=contact_email]'));
			});
			return false;
		}
		if(formData.contact_name < 6) {
			alert('请填写姓名', '提示', function() {
				$$.newFocus($$('input[name=contact_name]'));
			});
			return false;
		}
		if(formData.contact_num == '') {
			alert('请填写身份证号！', '提示', function() {
				$$.newFocus($$('input[name=contact_num]'));
			});
			return false;
		}
		if(formData.contact_phone == '') {
			alert('请填写手机号！', '提示', function() {
				$$.newFocus($$('input[name=contact_phone]'));
			});
			return false;
		}
		formData.contact_sex=1;
		// if(formData.contact_sex < 6) {
		// 	alert('请填写性别', '提示', function() {
		// 		$$.newFocus($$('input[name=contact_sex]'));
		// 	});
		// 	return false;
		// }
		formData.user_secret=encodeURI($$.localStorage.getUserSecret());
		$$.service.addcontact(formData, function(data) {
			currentApp.alert("添加成功", '提示');
			currentApp.mainView.router.loadPage("commoninfo/commoninfo.html");
			});
	});
}
//添加常用地址  2017.3.23 zwr
function initadd_address(){
	console.log(111)
	$$('#address_add').on('click', function(){
	  var formData = currentApp.formToJSON('#address_form');
		if(formData.area == '') {
			alert('请填详细地址！', '提示', function() {
				$$.newFocus($$('input[name=contact_phone]'));
			});
			return false;
		}
		if(formData.phone == '') {
			alert('请填写手机号！', '提示', function() {
				$$.newFocus($$('input[name=contact_phone]'));
			});
			return false;
		}
		if(formData.username == '') {
			alert('请填写收件人！', '提示', function() {
				$$.newFocus($$('input[name=contact_phone]'));
			});
			return false;
		}
		if(formData.zip == '') {
			alert('请填写邮编！', '提示', function() {
				$$.newFocus($$('input[name=contact_phone]'));
			});
			return false;
		}
		formData.user_secret=encodeURI($$.localStorage.getUserSecret());
		console.log(121212121)
		$$.service.addaddress(formData, function(data) {
			currentApp.alert("添加成功", '提示');
			currentApp.mainView.router.loadPage("commoninfo/commoninfo.html");

			});
	});
}

// 用户评论
function initOpinion(e) {
	var is_image = '';
	var _pageIndex = 1;
	var _pagesize = 5;
	var _that = this;
	//数据加载完毕回调
	function dataLoaded(loaded, param) {
		var _that = this;
		var _com_type = $$(this).attr('data-comment-type');
		if (_com_type == 0) {
			var _pageIndex = $$(this).find("#comment_info_list").attr('data-page-index');
		} else if(_com_type == 1) {
			var _pageIndex = $$(this).find("#comment_image_info_list").attr('data-page-index');
		} else {
			var _pageIndex = $$(this).attr('data-page-index');
		}
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		if (param != true) {
			++_pageIndex;
		} else {
			_pageIndex = 1;
		}
		if (_com_type == 0) {
			$$(this).find("#comment_info_list").attr('data-page-index', _pageIndex);
		} else if(_com_type == 1) {
			$$(this).find("#comment_image_info_list").attr('data-page-index', _pageIndex);
		}
		$$(this).attr('data-page-index', _pageIndex);
	}
	//监听滚动事件
	$$.t_infiniteScroll(_that, _pageIndex, _pagesize, function() {
		var _tmp_type = $$(this).attr('data-comment-type');
		if (_tmp_type == 0) {
			var t = $$(this).find('#comment_info_list');
		} else if(_tmp_type == 1) {
			var t = $$(this).find('#comment_image_info_list');
		} else {
			return false;
		}
		if (t.attr('data-page-index') == _pageIndex) {
			dataLoaded.call(this, true, true);
			return false;
		}
		loadUserComment.call(this, _tmp_type, t.attr('data-page-index'), _pagesize, false, dataLoaded, false);
	});
	$$.service.getOrderList('', 3, _pageIndex, _pagesize, function(data) {
		var tmpproductList = $$("script#order_uncomment_product_info").html();
		var tmpproductListTemplate = Template7.compile(tmpproductList);
		var personHTML = tmpproductListTemplate((data ? {info: data.list} : {
			info: []
		}));
		$$("#uncomment_order_list").append(personHTML);
	});
	loadUserComment.call($$('#comment_info_list'), 0, _pageIndex, _pagesize, false, dataLoaded, false);
	$$(".buttons-row .btn-is-image").on('click', function() {
		var type = $$(this).attr("data-comment-type");
		loadUserComment.call($$('#comment_image_info_list'), type, _pageIndex, _pagesize, false, dataLoaded, false);
	});
}

// 查询用户评论展示
function loadUserComment(is_image, pageIndex, pageSize, isindex, loadedCall, page_index) {
	var _that = this;
	$$.service.getUserComment(is_image, pageIndex, pageSize, function(data) {
		// 数据状态检测
		if (data.status == 0) {
			var _loadedHtml = '<div style="margin:50px;background-color: #f8f8f8;color: #999;font-size: 14px;height: 14px;line-height: 14px;text-align: center;">数据加载失败！</div>';
			$$(_that).html(_loadedHtml);
			if(plus && plus.nativeUI && data.message)
				plus.nativeUI.toast(data.message);
			return false;
		}
		if (typeof data.data == "object") {
			if (page_index) {
				$$(_that).html('<div></div>');
			}
			for (i = 0; i < data.data.list.length; i++) {
				var login_user = JSON.parse($$.localStorage.getloginUser());
				data.data.list[i]['username'] = login_user.username;
				data.data.list[i]['userimage'] = login_user.image || '';
				var add_time = new Date(parseInt(data.data.list[i].add_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
				data.data.list[i].add_time = add_time;
				var tmpcommentList = $$("script#tmp_Order_product_info").html();
				var tmpCommentListTemplate = Template7.compile(tmpcommentList);
				var personHTML = tmpCommentListTemplate((data ? {info: data.data.list[i]} : {
					info: []
				}));
				$$(_that).append(personHTML);
			}
		}
		if (isindex) {
			return;
		}
		//判断总页数是否小于等于当前页数
		if(data.data.page == 0 || data.data.page <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕！</div>';
			$$(_that).append(_loadedHtml);
			loadedCall && loadedCall.call(_that, true, page_index);
		} else {
			$$(_that).append('<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第 ' +
				pageIndex + ' 页&nbsp;&nbsp;&nbsp;&nbsp;总共 ' + (data.data.page) + ' 页</div>');
			loadedCall && loadedCall.call(_that, false, page_index);
		}
		$$(_that).attr('loaded', true);
	});
}

//问答
function initQuestion(){
	var _pageIndex = 1;
	var _pageSize = 10;
	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		console.log(_pageIndex);
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		/*console.log(loaded);*/
		$$.t_removePreloaderScroll(this, loaded);
		console.log(1);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	//监听滚动事件
	$$.t_infiniteScroll($$("#question"), _pageIndex, _pageSize, function() {
		window.testID = $$(this);
		loadQuestion.call(this, $$(this).attr('data-page-index'), _pageSize, dataLoaded);
	});
	loadQuestion.call($$("#question"), _pageIndex, _pageSize, dataLoaded);
}
//问答替换数据
function loadQuestion(pageIndex, pageSize,loadedCall) {
	var _that = this;
	$$.service.question(pageIndex, pageSize, function(data) {
		var tmpQuestionList = $$('script#tmpQuestion').html();
		var tmpQuestionListTemplate = Template7.compile(tmpQuestionList);
		var personHTML = tmpQuestionListTemplate((data ? data : {
			list: []
		}));
		//判断总页数是否小于等于当前页数
		if(data.page == 0 || data.page <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(data.page != 0)
				$$(_that).append(personHTML + _loadedHtml);
			else
				$$(_that).append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data ? data.page : '0') + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
	});
}

// 添加旅客 性别选择  zwr  2017.3.24
function add_customer_gender() {
	currentApp.picker({
	    input: '#add_customer_gender',
	    cols: [
	        {
	            textAlign: 'center',
	            values: ['男', '女']
	        }
	    ]
	});
}
// 添加旅客 生日   2017.3.24  zwr
function add_customer_birth (){
	currentApp.calendar({
	    input: '#add_customer_birth'
	});  
}
//常用联系人 list 数据 2017.3.24  zwr
function initContactlist(){
	var _pageIndex = 1;
	var _pageSize = 5;
	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	};
	loadContact.call($$("[data-page=contactlist] #tab1"), _pageIndex, _pageSize, dataLoaded);
	$$.t_infiniteScroll($$("[data-page=contactlist] #tab1"), _pageIndex, _pageSize, function() {
		loadContact.call(this, $$(this).attr('data-page-index'), _pageSize, dataLoaded);
	});
};

//替换常用联系人 list 数据 2017.3.24  zwr
function loadContact(pageIndex, pageSize, loadedCall) {
	var _that = this;
	$$.service.contactlist(pageIndex, pageSize, function(data) {
		var tmpContactlist = $$("script#tmpcontactlist").html();
		var tmpContactlistTemplate = Template7.compile(tmpContactlist);
		var personHTML = tmpContactlistTemplate((data ? data : {
			list: []
		}));
		var len = data.page;
		var totalpage = Math.ceil(len/pageSize);
		if(len == 0 || len <= pageIndex) {
			var _loadedHtml = '<div style="padding-top:4px;padding-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(len != 0)
				$$(_that).find('#contact_list').append(personHTML + _loadedHtml);
			else
				$$(_that).find('#contact_list').append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).find('#contact_list').append(personHTML + '<div style="padding-top:4px;padding-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (totalpage) + '页</div>');
			// loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', false);
		//点击删除
		$$('#tab1 .swipeout').on('delete', function(e) {
			var id=	$$(this).attr('data-id');
			$$.service.contactdel(id, function(data){
				console.log(data)
			})				
	  });
	  		
	});
};
//常用地址 list 数据 2017.3.24  zwr
function initAddresslist(){
	var _pageIndex = 1;
	var _pageSize = 5;
	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	};
	loadAddress.call($$("[data-page=contactlist] #tab2"), _pageIndex, _pageSize, dataLoaded);
	$$.t_infiniteScroll($$("[data-page=contactlist] #tab2"), _pageIndex, _pageSize, function() {
		loadAddress.call(this, $$(this).attr('data-page-index'), _pageSize, dataLoaded);
	});
};
//渲染常用地址 list 数据 2017.3.24  zwr
function loadAddress(pageIndex, pageSize, loadedCall) {
	var _that = this;
	$$.service.addresslist(pageIndex, pageSize, function(data) {
		var tmpaddresslist = $$("script#tmpaddresslist").html();
		var tmpAddresslistTemplate = Template7.compile(tmpaddresslist);
		var personHTML = tmpAddresslistTemplate((data ? data : {
			list: []
		}));
		var len = data.page;
		var totalpage = Math.ceil(len/pageSize);
		if(len == 0 || len <= pageIndex) {
			var _loadedHtml = '<div style="padding-top:4px;padding-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(len != 0)
				$$(_that).find('#address_list').append(personHTML + _loadedHtml);
			else
				$$(_that).find('#address_list').append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).find('#address_list').append(personHTML + '<div style="padding-top:4px;padding-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (totalpage) + '页</div>');
			// loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', false);
		//滑动删除
		$$('#tab2 .swipeout').on('delete', function(e) {
			var id=	$$(this).attr('data-id');
			$$.service.addressdel(id, function(data){
				console.log(data)
			})				
	  });		
	});
};



var smsCodeControl = true;
//获取短信验证码
function getSmscode(){
	if(smsCodeControl){
		$$('.get_code').click(function() {
		    _phone = $$('input[name=phone]').val();
		    _mark = $$('input[name=mark]').val();
		    if(_phone == '') {
		        alert('手机号不能为空！', '登录提示', function() {
		            $$.newFocus($$('input[name=phone]'));
		        });
		        return false;
		    }
		    
		    $$.service.sendmsgcode(_mark, _phone, function() {
		        //关闭登录页面
		        currentApp.closeModal();
		    });
		    time(this);    
		})


	}
}

//无密码快捷登陆
function phoneLogin() {
	//把历史登录记录用户名写入登录用户名
	$$('input[name=username]').val($$.localStorage.lastLoginInfo.userName());
	// 激活按钮
	 $$('input[name=sms_code]').focus(function() {
	     if($$('input').val()){
	         $$('.default_btn_green').addClass('active');
	     } else{
	         $$('.default_btn_green').removeClass('active');
	     }
	 })
	//登录操作 
	$$('.phonelogin').click(function() {
		_phone = $$('input[name=phone]').val();
		_sms = $$('input[name=sms_code]').val();

		if(_phone == '') {
			alert('手机号不能为空！', '登录提示', function() {
				$$.newFocus($$('input[name=phone]'));
			});
			return false;
		}
		if(_sms == '') {
			alert('验证码不能为空！', '登录提示', function() {
				$$.newFocus($$('input[name=sms_code]'));
			});
			return false;
		}
		$$.service.login(_phone, _sms, function(data) {
			//记录登录信息到本地
			$$.localStorage.setLoginInfo({
				userName: data.username
			});
			$$('input[name=sms_code]').val('');
			//关闭登录页面
			currentApp.closeModal();
			currentApp.mainView.router.loadPage("index/index.html");
		});
	});

	//初始化第三方登录方法
	$$.common.thirdLoginInit();
}

var scan = null;
function onmarked(type, result) {
	var text = '未知: ';
	switch(type) {
		case plus.barcode.QR:
			text = 'QR: ';
			if(isPlus)
				plus.t_openNewPage({
					url: result,
					id: 'viewScanCode'
				});
			closeScan();
			break;
		case plus.barcode.EAN13:
			text = 'EAN13: ';
			alert(text + result + '暂不支持识别');
			break;
		case plus.barcode.EAN8:
			text = 'EAN8: ';
			alert(text + result + '暂不支持识别');
			break;
	}
}

function startRecognize() {
	//	alert(plus.navigator.isImmersedStatusbar());
	//	alert(plus.navigator.getStatusbarHeight());
	//	alert($$('.popup-scanning #scancode').length);

	if(plus.navigator.isImmersedStatusbar()) {
		$$('.popup-scanning #scancode').css('top', plus.navigator.getStatusbarHeight() + 'px');
	}
	currentApp.showIndicator();
	scan = new plus.barcode.Barcode('scancode', null, {
		frameColor: '#339A99',
		background: '#000',
		scanbarColor: '#339A99'
	});
	scan.onmarked = onmarked;
	scan.start();
	currentApp.hideIndicator();
}

function cancelScan() {
	scan.cancel();
}

function closeScan() {
	currentApp.showIndicator();
	scan && scan.cancel();
	scan && scan.close();
	currentApp.hideIndicator();
}

function setFlash() {
	scan.setFlash(true);
}
//添加订单评论
function initAddOrderComment(data) {
	var good  = "";
	var _that = this;
	var param = data.query;
	var i = 0;
	_that.image_url = "";
	$$('#fileupload').click(function() {
		// 模拟input点击事件
		/*var evt = new MouseEvent("click", { bubbles: false, cancelable: true, view: window });
		document.getElementById("ufile").dispatchEvent(evt);*/
		$$('input[name=ufile]').click();
		var _file_name = $$('input[name=ufile]');
		_file_name.on('change', function() {
			_file_name.off('change');
			++i;
			if (i > 1) {
				return false;
			}
			var datas = new FormData($$('.importImage')[0]);
			var _url  = "http://file.txjer.com.cn/file/create";
			$$.ajax({
                url : _url,
                type: 'POST',
                data: datas,
                dataType: 'JSON',
                cache: false,
                processData: false,
                contentType: false,
                success: function (res) {
                    res = JSON.parse(res) || {is_image : 0};
                    if (res.is_image == 1) {
                        alert('图片上传成功！', '提 示', function() {
							$$.newFocus($$('textarea[name=comment_order]'));
						});
                    } else {
                    	alert("图片上传出错，请重新上传！", '提 示');
                    	return false;
                    }
                    _that.image_url += res.url;
                    _file_name.val("");
                    return false;
                },
                error: function (returndata) {
                    alert('图片上传失败，请稍后重试!', '提 示', function() {
						$$.newFocus($$('textarea[name=comment_order]'));
					});
					_file_name.val("");
                    return false;
                }
            });
		});
	});
	$$.service.getorderInfo(param._order_sn, param._order_type, function(data) {
		var tmpOrderList = $$("script#tmp_add_Order_comment").html();
		var tmpOrderListTemplate = Template7.compile(tmpOrderList);
		var personHTML = tmpOrderListTemplate((data ? {data: data.data} : {
			data: []
		}));
		$$('#comment_order_info').html(personHTML);
		$$.newFocus($$('textarea[name=comment_order]'));
		
		$$("#btnAddComment").click(function() {
			_comment_content = $$('textarea[name=comment_order]').val();
			if(_comment_content == '') {
				alert('评论内容不能为空！', '提 示', function() {
					$$.newFocus($$('textarea[name=comment_order]'));
				});
				return false;
			}
			if (typeof _that.image_url === 'undefined') {
				var _url_image = '';
			} else {
				var _url_image = _that.image_url;
			}
			$$.service.addOrderComment(param._order_sn, param._order_type, _comment_content, 5, _url_image, function(data) {
				if(plus && plus.nativeUI)
					plus.nativeUI.toast(data);
				viewMain.router.back({
					url: 'order/index.html',
					force: true
				});
			}, function(data) {
				if(plus && plus.nativeUI)
					plus.nativeUI.toast(data);
			});
		});
		
	});
}
//订单详情页面
function initOrderinfo(data) {
	var good  = "";
	var _that = this;
	var param = data.query;
	$$.service.getorderInfo(param._order_sn, param._order_type, function(data) {
		//获取订单详情模板对象
		var tmpOrderList = $$("script#tmpOrderInfo").html();

		var tmpOrderListTemplate = Template7.compile(tmpOrderList);
		var personHTML = tmpOrderListTemplate((data ? {data: data.data} : {
			data: []
		}));
		$$("#order_info").html(personHTML);
		$$('#order_info #btnOrderCancel').click(function(info) {
			var _order_sn = info.view.$$('.local_order_sn')["0"].textContent;
			currentApp.confirm('是否确定取消订单？', '提 示', function() {
				$$.service.getappOrderCancel(_order_sn, function(data) {
					if(plus && plus.nativeUI)
						plus.nativeUI.toast(data);
					currentApp.mainView.refreshPage();
				}, function(data) {
					if(plus && plus.nativeUI)
						plus.nativeUI.toast(data);
				});
			});
		});
	});

	/*function initEvent() {
		var spans = $$("#goodopinion span");
		for(var i = 0; i < spans.length; i++) {
			var span = spans[i];
			span.onclick = change;
		}
	}

	function change() {
		var spans = $$("#goodopinion span");
		for(var i = 0; i < 5; i++) {
			var span = spans[i];
			span.innerHTML = "<img src='img/huibai.png'>";
		}
		var index = indexof(spans, this);
		good = index + 1;
		for(var i = 0; i < index + 1; i++) {
			var span = spans[i];
			span.innerHTML = "<img src='img/huangjin.png'>";
		}
	}

	function indexof(arr, ele) {
		for(var i = 0; i < arr.length; i++) {
			if(arr[i] == ele) {
				return i;
			}
		}
		return -1;
	}*/
}
//订单详情页面
/*function initOrderinfo(data) {
	
	var _that = this;
	
	var param = data.query;
	$$.service.getorderInfo(param._order_sn, param._order_type, function(data) {
		//获取订单详情模板对象
		var tmpOrderList = $$("script#tmpOrderInfo").html();

		var tmpOrderListTemplate = Template7.compile(tmpOrderList);
		var personHTML = tmpOrderListTemplate((data ? {data: data.data} : {
			data: []
		}));
		$$("#order_info").html(personHTML);
	});
}*/
//获取我的分销商数据
function initDistributor() {
	var _pageIndex = 1;
	var _pageSize = 10;

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		/*console.log(loaded);*/
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	/*	$$('#tab-directly').on('show', function() {
			if(!$$("#directlyul").attr('loaded'))
				loadDistributor($$("#directlyul"), _pageIndex, _pageSize, 1);
		});
		$$('#tab-subjection').on('show', function() {
			if(!$$("#subjectionul").attr('loaded'))
				loadDistributor($$("#subjectionul"), _pageIndex, _pageSize, 2);
		});	*/
	var _scrollTab = '#contentDisributorList .tab';
	$$(_scrollTab).on('show', function() {
		if(!$$(this).attr('loaded'))
			loadDistributor.call(this, _pageIndex, _pageSize, $$(this).attr("data-distribuor-type"), dataLoaded);
	});
	//监听滚动事件
	$$.t_infiniteScroll(_scrollTab, _pageIndex, _pageSize, function() {
		/*console.log($$(this).attr('data-page-index'));*/
		window.testID = $$(this);
		loadDistributor.call(this, $$(this).attr('data-page-index'), _pageSize, $$(this).attr("data-distribuor-type"), dataLoaded);
	});
	loadDistributor.call($$("#tab-directly"), _pageIndex, _pageSize, 1, dataLoaded);
}
//我的分销商替换数据
function loadDistributor(pageIndex, pageSize, level, loadedCall) {
	var _that = this;
	$$.service.getmember(pageIndex, pageSize, level, function(data) {
		var tmpMemberList = $$('script#tmpMemberList').html();
		var tmpMemberListTemplate = Template7.compile(tmpMemberList);
		var personHTML = tmpMemberListTemplate((data ? data : {
			list: []
		}));
		//判断总页数是否小于等于当前页数
		if(data.totalpage == 0 || data.totalpage <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(data.totalpage != 0)
				$$(_that).append(personHTML + _loadedHtml);
			else
				$$(_that).append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data ? data.totalpage : '0') + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
	});
}
//获取平台提现动态数据
function initNewdrawals() {
	var _pageIndex = 1;
	var _pageSize = 20;
	loadNewdrawals($$("#Newdrawalsul"), _pageIndex, _pageSize, $$("script#tmpLNewdrawalsist"));
}
//获取首页平台提现动态数据
function initindexNewdrawals() {
	var _pageIndex = 1;
	var _pageSize = 4;
	loadNewdrawals($$("#indexNewdrawalsul"), _pageIndex, _pageSize, $$("script#tmpLIndexNewdrawalsist"));
}
//替换平台提现动态列表数据
function loadNewdrawals(obj, pageIndex, pageSize, objpage) {
	$$.service.getprogressList(pageIndex, pageSize, function(data) {
		var tmpNewdrawalsList = $$(objpage).html();
		var tmpNewdrawalsListTemplate = Template7.compile(tmpNewdrawalsList);
		var personHTML = tmpNewdrawalsListTemplate((data ? data : {
			list: []
		}));
		$$(obj).html(personHTML);
	});
}

//订单搜索功能
function initOrderSearch() {
	var _pageIndex = 1;
	var _pageSize = 10;
	var isindex = false;
	var search = true;
	var changesearch = false;
	var _countobj = $$("script#tmpOrderList");
	var _scrollTab = '#searchList .tab';
	var _keyname = $$("input[type=search]").value;

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	$$('#ordersearch').on('input propertychange', function() {
		_keyname = this.value;
		changesearch = true;
		loadOrderList.call($$("#tab-all-search"), 0, _pageIndex, _pageSize, _countobj, isindex, _keyname, search, changesearch, dataLoaded);
	});
	$$(_scrollTab).on('show', function() {
		if(!$$(this).attr('loaded'))
			loadOrderList.call(this, $$(this).attr("data-order-type"), _pageIndex, _pageSize, _countobj, isindex, _keyname, search, changesearch, dataLoaded);
	});
	$$.t_infiniteScroll(_scrollTab, _pageIndex, _pageSize, function() {
		/*console.log($$(this).attr('data-page-index'));*/
		// window.testID = $$(this);
		loadOrderList.call(this, 0, $$(this).attr('data-page-index'), _pageSize, _countobj, isindex, _keyname, search, changesearch, dataLoaded);
	});
}

//获取订单动态数据
function initOrderIndex(e) {
	var _pageIndex = 1;
	var _pageSize  = 8;
	var isindex = false;
	var _keyname = "";
	var search = false;
	var changesearch = false;
	var _countobj = $$("script#tmpOrderList");
	//数据加载完毕回调
	function dataLoaded(loaded, param) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		if (!loaded) {
			$$.t_removePreloaderScroll(this, loaded);
		}
		if (param != true) {
			_pageIndex++;
		} else {
			_pageIndex = 1;
		}
		$$(this).attr('data-page-index', _pageIndex);
	}
	var _scrollTab = '#contentOrderList .tab';
	$$(_scrollTab).on('show', function() {
		if(!$$(this).attr('loaded'))
			loadOrderList.call(this, $$(this).attr("data-order-type"), _pageIndex, _pageSize, _countobj, isindex, _keyname, search, changesearch, dataLoaded);
	});
	setTimeout(function() {
		if (typeof e.query.type === "undefined") {
			var type_id = 0;
		} else {
			var type_id = e.query.type;
			var a_id    = e.query.aid;
			$$(".buttons-row .button").removeClass('active');
			$$(".buttons-row #"+a_id).addClass('active');
		}
		
		//首次加载订单数据
		loadOrderList.call($$("#tab-all"), type_id, _pageIndex, _pageSize, _countobj, isindex, _keyname, search, changesearch, dataLoaded);
	}, 150);
	//监听滚动事件加载订单数据
	$$.t_infiniteScroll(_scrollTab, _pageIndex, _pageSize, function() {
		// console.log($$(this).attr('data-page-index'));
		// window.testID = $$(this);
		loadOrderList.call(this, 0, $$(this).attr('data-page-index'), _pageSize, _countobj, isindex, _keyname, search, changesearch, dataLoaded);
	});
	//监听TAB CLICK事件
	$$(".buttons-row .button").on('click', function() {
		$$(".buttons-row .button").removeClass('active');
		$$(this).addClass("active");
		var _order_type = $$(this).attr("data-order-type");
		if (_order_type == 0) {
			currentApp.mainView.url = "order/index.html";
			currentApp.mainView.refreshPage();
		}
		loadOrderList.call(document.getElementById("contentOrderList"), _order_type, _pageIndex, _pageSize, _countobj, isindex, _keyname, search, changesearch, dataLoaded, true);
	});
	//	$$("#orderRefresh").click(function() {
	//		loadOrderList($$(this).parents("#tab-specialty"), 0, _pageIndex, _pageSize, _countobj);
	//	})
}
//获取首页订单动态数据
function initIndexList() {
	var _pageIndex = 1;
	var _pageSize  = 8;
	var isindex    = true;
	var _keyname   = "";
	var search     = false;
	var changesearch = false;
	var _countobj    = $$("script#tmpOrderList");
	loadOrderList.call(document.getElementById("contentOrderList"), 0, _pageIndex, _pageSize, _countobj, isindex, _keyname, search, changesearch);
}
/**
 * 替换加载订单列表数据
 * @param {Object} typeid
 * @param {Object} pageIndex
 * @param {Object} pageSize
 * @param {Object} countobj
 * @param {Object} loadedCall 加载完成回调方法
 */
function loadOrderList(typeid, pageIndex, pageSize, countobj, isindex, keyname, search, changesearch, loadedCall, page_index) {
	var _that = this;
	//调用获取订单数据方法 
	$$.service.getOrderList(keyname, typeid, pageIndex, pageSize, function(data) {
		//获取订单模板对象
		if (data.status == 0) {
			var _loadedHtml = '<div style="margin:50px;background-color: #f8f8f8;color: #999;font-size: 14px;height: 14px;line-height: 14px;text-align: center;">数据加载失败！</div>';
			$$(_that).html(_loadedHtml);
			if(plus && plus.nativeUI && data.message)
				plus.nativeUI.toast(data.message);
			return false;
		}
		var tmpOrderList = $$(countobj).html();
		var tmpOrderListTemplate = Template7.compile(tmpOrderList);
		var personHTML = tmpOrderListTemplate((data ? { list: data.list } : {
			list: []
		}));
		if (typeid == 0) {
			page_index = false;
		}
		if(isindex) {
			$$(_that).html(personHTML);
			return;
		}
		//判断总页数是否小于等于当前页数
		if(data.page == 0 || data.page <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕！</div>';
			if (data.page != 0) {
				if(data.page == 1) {
					$$(_that).html(personHTML + _loadedHtml);
				} else if(data.page == pageIndex) {
					$$(_that).append(personHTML + _loadedHtml);
				}
			} else {
				$$(_that).html(personHTML);
			}
			$$(_that).find(".infinite-scroll-preloader").hide();
			loadedCall && loadedCall.call(_that, true, page_index);
		} else {
			if (!search) {
				if (pageIndex == 1) {
					$$(_that).html(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
						pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.page) + '页</div>');
				} else {
					$$(_that).append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
						pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.page) + '页</div>');
				}
			} else {
				if(!changesearch) {
					personHTML = "";
					$$(_that).append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
						pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.page) + '页</div>');
				} else {
					$$(_that).html(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
						pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.page) + '页</div>');
				}
			}
			loadedCall && loadedCall.call(_that, false, page_index);
		}
		$$(_that).attr('loaded', true);
	});
}
//平台动态数据
function initPlatform() {
	var _pageIndex = 1;
	var _pageSize = 10;
	var isindex = false;
	//数据加载完毕回调
	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	//首次加载平台动态数据
	loadplatform.call($$("[data-page=platformdynamics] .platformdy"), _pageIndex, _pageSize, isindex, dataLoaded);
	//监听滚动事件加载平台动态数据
	$$.t_infiniteScroll($$("[data-page=platformdynamics] .platformdy"), _pageIndex, _pageSize, function() {
		window.testID = $$(this);
		loadplatform.call(this, $$(this).attr('data-page-index'), _pageSize, isindex, dataLoaded);
	});
}
//首页获取平台动态数据
function initPlatIndex() {
	var _pageIndex = 1;
	var _pageSize = 3;
	var isindex = true;
	loadplatform.call($$("#platfromindex"), _pageIndex, _pageSize, isindex);
}
//替换加载平台动态数据
function loadplatform(pageIndex, pageSize, isindex, loadedCall) {
	var _that = this;
	$$.service.platformdynamics(pageIndex, pageSize, function(data) {
		var tmpPlateList = $$("script#tmpPlatList").html();
		var tmpPlateListTemplate = Template7.compile(tmpPlateList);
		var personHTML = tmpPlateListTemplate((data ? data : {
			list: []
		}));
		if(isindex) {
			$$(_that).html(personHTML);
		}
		//判断总页数是否小于等于当前页数
		if(data.totalpage == 0 || data.totalpage <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;padding:8px 0;">数据已加载完毕</div>';
			if(data.totalpage != 0)
				$$(_that).find("#Platformdynamics").append(personHTML + _loadedHtml);
			else
				$$(_that).find("#Platformdynamics").append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).find("#Platformdynamics").append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;padding:8px 0;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.totalpage) + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
	});
}
//获取余额明细数据
function initBalanceDetail() {
	var _pageIndex = 1;
	var _pageSize = 10;
	//数据加载完毕回调
	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	//首次加载余额数据
	loadBalanceDetail.call($$("[data-page=balancedetail] .balancedetail"), _pageIndex, _pageSize, 1, dataLoaded);
	//监听滚动事件加载余额数据
	$$.t_infiniteScroll($$("[data-page=balancedetail] .balancedetail"), _pageIndex, _pageSize, function() {
		window.testID = $$(this);
		loadBalanceDetail.call(this, $$(this).attr('data-page-index'), _pageSize, 1, dataLoaded);
	});
}
//替换加载余额明细数据
function loadBalanceDetail(pageIndex, pageSize, type, loadedCall) {
	var _that = this;
	$$.service.getbalancedetail(pageIndex, pageSize, type, function(data) {
		var tmpBalanceList = $$("script#tmpBalanceDetail").html();
		/*console.log(JSON.stringify(data.list[0]));*/
		var tmpBalanceListTemplate = Template7.compile(tmpBalanceList);
		/*console.log(tmpBalanceListTemplate);*/
		var personHTML = tmpBalanceListTemplate((data ? data : {
			list: []
		}));
		//判断总页数是否小于等于当前页数
		if(data.pagetotal == 0 || data.pagetotal <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;padding:8px 0;">数据已加载完毕</div>';
			if(data.pagetotal != 0)
				$$(_that).find("#balanceDetail").append(personHTML + _loadedHtml);
			else
				$$(_that).find("#balanceDetail").append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).find("#balanceDetail").append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;padding:8px 0;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.pagetotal) + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
	});
}
//获取分销秘籍详情数据
function initCheatdetails(page) {
	var cid = page.query.cid;
	loadCheats.call($$('#wxxc_details'), '', '', '', cid, $$("script#tmpcheatesDetails"), '');
}
//获取分销秘籍数据
function initCheats() {
	var _pageIndex = 1;
	var _pageSize = 10;
	var countobj = $$("script#tmpcheates");

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		/*console.log(loaded);*/
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	var _scrollTab = '#contentCheatsList .tab';
	$$(_scrollTab).on('show', function() {
		if(!$$(this).attr('loaded'))
			loadCheats.call(this, _pageIndex, _pageSize, $$(this).attr("data-distribuor-type"), '', countobj, dataLoaded);
	});
	//监听滚动事件
	$$.t_infiniteScroll(_scrollTab, _pageIndex, _pageSize, function() {
		/*console.log($$(this).attr('data-page-index'));*/
		window.testID = $$(this);
		loadCheats.call(this, $$(this).attr('data-page-index'), _pageSize, $$(this).attr("data-distribuor-type"), '', countobj, dataLoaded);
	});
	loadCheats.call($$("#cheats1"), _pageIndex, _pageSize, 1, '', countobj, dataLoaded);
}
//替换加载分销秘籍数据
function loadCheats(pageIndex, pageSize, level, cid, countobj, loadedCall) {
	var _that = this;
	$$.service.getdistribution(pageIndex, pageSize, level, cid, '', function(data) {
		var tmpCheatsList = countobj.html();
		var tmpCheatsListTemplate = Template7.compile(tmpCheatsList);
		var personHTML = tmpCheatsListTemplate((data ? data : {
			list: []
		}));
		if(countobj.attr('id') == 'tmpcheatesDetails') {
			personHTML = tmpCheatsListTemplate({
				list: data
			});
		};
		//判断总页数是否小于等于当前页数
		if(data.totalpage == 0 || data.totalpage <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(data.totalpage != 0)
				$$(_that).append(personHTML + _loadedHtml);
			else
				$$(_that).append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else if(countobj.attr('id') == 'tmpcheatesDetails') {
			$$(_that).append(personHTML);
		} else {
			$$(_that).append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data ? data.totalpage : '0') + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);

		$$('.cheats-list li a').click(function() {
			var cid = $$(this).parents('li').attr('data-id');
			$$(this).attr("href", "cheats/cheats_details.html?cid=" + cid);
		});

	});

}
//获取我的首页数据
function loadMy(obj) {
	$$.service.getuser(function(my) {
		var tmpMy = $$(obj).html();
		var tmpMyTemplate = Template7.compile(tmpMy);
		var personHTML = tmpMyTemplate({
			group: my
		});
		$$(obj).html(personHTML);
		plus.t_init($$(obj));
		$$('.first-hide').removeClass('first-hide');
		$$('.member-img img').attr('src', $$('.member-img img').attr('_src'));
		$$(".menberphone").text(menberTel(my.mobile));
	});
}
//我的首页调用
function initMyIndex() {
	loadMy($$("#myInfo"));
}
//我的余额调用
function initMyBalance() {
	setTimeout(function() {
		loadMy($$("#MyBalance"));
	}, 300);
}
//获取账户管理数据
function initAccountmanageIndex() {
	var loadAccountmanage = function(obj) {
		var _loginUser = $$.localStorage.getloginUser();
		if(_loginUser) {
			$$.service.getthird(function(list) {
				list.arrInfo = {};
				for(var i = 0; i < list.info.length; i++) {
					if(list.info[i].from == 'weixin') {
						list.arrInfo.weixin = list.info[i];
						var Title1 = list.arrInfo.weixin.nickname;
						if(Title1.length > 14) {
							Title1 = Title1.substring(0, 14) + "...";
						};
					} else if(list.info[i].from == 'qq') {
						list.arrInfo.qq = list.info[i];
					} else if(list.info[i].from == 'weibo') {
						list.info[i].sinaweibo == 'weibo';
					}
				}
				_loginUser = eval('(' + _loginUser + ')');
				_loginUser.mobile = menberTel(_loginUser.mobile);
				var tmpthird = $$(obj).html();
				var tmpthirdTemplate = Template7.compile(tmpthird);
				var personHTML = tmpthirdTemplate({
					group: _loginUser,
					infoList: list.arrInfo
				});

				$$(obj).html(personHTML);
				$$('.account-2 img').attr('src', $$('.account-2 img').attr('_src'));
				$$("#thirdul a.item-link[isbind='0']").click(function() {
					$$.common.userBind($$(this).attr('oauth'), function() {
						if(plus && plus.nativeUI)
							plus.nativeUI.toast('绑定成功');
						currentApp.mainView.refreshPage();
					}, function() {
						alert('授权绑定失败，请重试！');
					})
				});
				$$("#thirdul a.item-link[isbind='1']").click(function() {
					currentApp.confirm('是否解除绑定？', '张网旅游', function() {
						$$.common.unBind($$("#thirdul a.item-link[isbind='1']").attr('oauth'), function() {
							if(plus && plus.nativeUI)
								plus.nativeUI.toast('解绑成功');
							currentApp.mainView.refreshPage();
						}, function() {
							alert('授权解绑失败，请重试！');
						})
					});
				});
				$$('.first-hide').removeClass('first-hide');
				$$('#btnChangeLogin').click(function() {
					$$.service.outLogin(function() {
						viewMain.back();
						currentApp.loginScreen();
					});
				});
				$$("#thirdul .account-wxname").text(Title1);
			});
		}
	}
	loadAccountmanage($$("#tmpAccountManage"));

	//初始化第三方登录方法
	$$.common.thirdLoginInit();
}
//改变手机号显示方式
function menberTel(moblie) {
	var mphone = moblie.substr(0, 3) + '****' + moblie.substr(7);
	return mphone;
}
//我的银行卡信息
function initAddbank() {
	var loadaddbank = function(obj) {
		var _loginUser = $$.localStorage.getloginUser();
		_loginUser = eval('(' + _loginUser + ')');
		var tmpBank = $$(obj).html();
		var tmpBankTemplate = Template7.compile(tmpBank);
		var personHTML = tmpBankTemplate({
			BankInfo: _loginUser
		});
		$$(obj).html(personHTML);
		$$('.first-hide').removeClass('first-hide');
		$$.newFocus($$('input[name=card_no]'));
		$$("#btnAddBank").click(function() {
			_truename = $$('input[name=truename]').val();
			_card_no = $$('input[name=card_no]').val();
			if(_truename == '') {
				alert('持卡人姓名不能为空！', '错误提示', function() {
					$$.newFocus($$('input[name=truename]'));
				});
				return false;
			}
			if(_card_no == '') {
				alert('卡号不能为空！', '错误提示', function() {
					$$.newFocus($$('input[name=card_no]'));
				});
				return false;
			}
			var bool = luhmCheck(_card_no);
			if(bool) {
				currentApp.mainView.loadPage('postal/writeinfo.html?_card_no=' + _card_no + '&&_truename=' + _truename);
			}
		});
	}
	loadaddbank($$("#bankcard"));
}
//判断提现金额是否满足需求
function initWithdrawJudge() {
	$$('#pay').click(function() {
		var withdrawamount = $$('#price').val();
		var canuseprice = $$('#canuseprice').html();
		var cardno = $$("#select-banks").val();
		if(cardno == '') {
			alert('你还没有绑定银行卡。', '错误提示');
			return false;
		}
		if(withdrawamount == '') {
			alert('提现余额为空!', '张网旅游');
		} else if(withdrawamount.indexOf(" ") != -1 || !/^\d+$/.test(withdrawamount)) {
			alert('金额格式错误!', '张网旅游');
		} else if(parseInt(withdrawamount) < 50) {
			alert('满50元才可提现的哦亲!', '张网旅游');
		} else {
			alert('提现成功!loading...', '张网旅游');
			$$.service.applysave(withdrawamount, cardno, function() {
				$$.service.defaultcard(cardno, function() {

				})
			});
		}

	});

}
//填写手机号码
function initWriteinfo(page) {
	var card_no = page.query._card_no.replace(/\s+/g, "");
	var truename = page.query._truename;
	var loadwriteinfo = function(obj) {
		$$.service.getbankcardinfo(card_no, function(list) {
			var tmpwriteinfo = $$(obj).html();
			var tmpwriteinfoTemplate = Template7.compile(tmpwriteinfo);
			var personHTML = tmpwriteinfoTemplate({
				writeInfo: list
			});
			$$(obj).html(personHTML);
			$$('.first-hide').removeClass('first-hide');
		});
		$$("#Reserve").click(function() {
			_phone = $$("input[name=phone]").val();
			if(_phone == "") {
				alert("手机号码不能为空！", "错误信息");
			}
			var bool = checkPhone(_phone);
			if(bool) {
				console.log(bool);
				currentApp.mainView.loadPage('postal/writecode.html?card_no=' + card_no + '&&phone=' + _phone + '&&truename=' + truename);
			}
		});
	}
	loadwriteinfo($$("#bank"));
}
//验证手机号码
function checkPhone(val) {
	var phone = val;
	if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
//		alert("手机号码有误，请重填", "错误信息");
		return false;
	} else {
		return true;
	}
}
//验证验证码并添加银行卡
function initAddBankInfo(data) {
	var tmpOrderList = $$("script#tmp_phone_message").html();
	var tmpOrderListTemplate = Template7.compile(tmpOrderList);
	var phone = data.query.phone.substr(-4);
	var personHTML = tmpOrderListTemplate((data.query ? {data: phone} : {
		data: []
	}));
	$$('#check_phone_code').html(personHTML);
	$$.newFocus($$('input[name=modifynick]'));
	$$("#btnAddBank").click(function() {
		infos = $$.localStorage.getAddBankInfo();
		info  = JSON.parse(infos);
		_code = $$('input[name=modifynick]').val();
		if(_code == '') {
			alert('验证码不能为空!', '错误提示', function() {
				$$.newFocus($$('input[name=modifynick]'));
			});
			return false;
		}
		if (_code == info.modify) {
			$$.service.addbankcard(info.bank_name, info.user_name, info.card_no, info.bank_phone, info.identity_card, function() {
				if(plus && plus.nativeUI)
					plus.nativeUI.toast('添加银行卡成功！');
				currentApp.mainView.loadPage('bank/successbank.html');
			}, function(data) {
				if(plus && plus.nativeUI)
					plus.nativeUI.toast(data.message);
				viewMain.router.back({
					url: 'bank/addbank.html',
					force: false
				});
				return false;
			});
		} else {
			alert('验证码错误!', '错误提示', function() {
				$$.newFocus($$('input[name=modifynick]'));
			});
			return false;
		}
	});
}

//发送验证码
function initWriteCode(page) {
	var _that = this;
	// $$(".verphone").text(menberTel(phone));
	/*$$("#sendcodeform").click(function() {
		$$.service.sendcode(phone,
			function() {
				if(plus && plus.nativeUI)
					plus.nativeUI.toast('发送成功');
			}
		);
		time(this);
	});*/
	$$("input[name=bank-card-id]").blur(function() {
		_card_id = $$("input[name=bank-card-id]").val();
		if(_card_id == '') {
			return false;
		}
		$$.service.getbankCardType(_card_id, function(data) {
			if(data.status == 0) {
				alert(data.message, '错误提示');
				$$(".user-bank-name").text('');
				return false;
			}
			$$(".user-bank-name").text(data.info[0] + data.info[1] + data.info[2]);
		});
	});
	$$("#btnSaveBank").click(function(data) {
		_user_name  = $$("input[name=bank-user-name]").val();
		if(_user_name == '') {
			alert('用户姓名不能为空', '错误提示', function() {
				$$.newFocus($$("input[name=bank-user-name]"));
			});
			return false;
		}
		_card_id    = $$("input[name=bank-card-id]").val();
		if(_card_id == '') {
			alert('银行卡号不能为空', '错误提示', function() {
				$$.newFocus($$("input[name=bank-card-id]"));
			});
			return false;
		}
		_bank_name  = $$(".user-bank-name").text();
		if(_bank_name == '') {
			alert('银行名称不能为空', '错误提示');
			return false;
		}
		_bank_phone = $$("input[name=bank-phone]").val();
		if(_bank_phone == '') {
			alert('手机号码不能为空', '错误提示', function() {
				$$.newFocus($$("input[name=bank-phone]"));
			});
			return false;
		}
		_user_id   = $$("input[name=bank-user-id]").val();
		if(_user_id == '') {
			alert('身份证号码不能为空', '错误提示', function() {
				$$.newFocus($$("input[name=bank-user-id]"));
			});
			return false;
		}
		_total = {};
		_total.user_name  = _user_name;
		_total.card_no    = _card_id;
		_total.bank_name  = _bank_name;
		_total.bank_phone = _bank_phone;
		_total.identity_card = _user_id;
		$$.service.getbankCode(_bank_phone, function(data) {
			if (typeof data == "undefined") {
				alert('发送验证码出错，请稍后重试！', '错误提示');
				return false;
			}
			if(data.status == 0) {
				alert(data.message, '错误提示');
				return false;
			}
			_total.modify = data;
			currentApp.mainView.loadPage('bank/sendbank.html?phone=' + _bank_phone);
			str = JSON.stringify(_total);
			$$.localStorage.setAddBankInfo(str);
		});
	});
}
//获取分销商提现数据
function initWithdrawals() {
	var loadwithdrawals = function(obj, objprice) {
		$$.service.applyinfo(
			function(list) {
				var tmpwithdrawals = $$("script#tmpwithdrawal").html();
				var tmpwithdrawalsTemplate = Template7.compile(tmpwithdrawals);
				var personHTML = tmpwithdrawalsTemplate({
					group: list.bankcard
				});
				var tmpwith = $$(objprice).html();
				var tmpwithTemplate = Template7.compile(tmpwith);
				var personHTMLs = tmpwithTemplate({
					price: list
				});
				$$(objprice).html(personHTMLs);
				$$(obj).html(personHTML);
				$$('.first-hide').removeClass('first-hide');
				var def;
				for(var i = 0; i < list.bankcard.length; i++) {
					if(list.bankcard[i].default == 1) {
						def = list.bankcard[i].bankname + '尾号' + list.bankcard[i].cardno + list.bankcard[i].cardtype;
						$$('#icon-img').attr("class", $$('#select-banks option:checked').data("option-icon"));
					};
				};
				//console.log(JSON.stringify(list.bankcard.length) );
				$$('#bankcade').text(def);
				if(list.bankcard.length == 1) {
					def = list.bankcard[0].bankname + '尾号' + list.bankcard[0].cardno + list.bankcard[0].cardtype;
					$$('#bankcade').text(def);
				};
				if(list.bankcard.length == 0) {
					$$('#bankcade').text('请添加银行卡');
					$$('#postala').attr('href', 'postal/addbank.html').removeClass('smart-select');
					$$('#select-banks').css('display', 'none');
				}
			}
		);
	}
	loadwithdrawals($$("#postala"), $$("#blance"));
}
//申请审核
function initReview() {
	var _pageIndex = 1;
	var _pageSize = 10;

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		/*console.log(loaded);*/
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	var _scrollTab = '#contentReviewList .tab';
	$$(_scrollTab).on('show', function() {
		if(!$$(this).attr('loaded'))
			loadReview.call(this, _pageIndex, _pageSize, $$(this).attr("data-review-type"), dataLoaded);
	});
	//监听滚动事件
	$$.t_infiniteScroll(_scrollTab, _pageIndex, _pageSize, function() {
		/*console.log($$(this).attr('data-page-index'));*/
		window.testID = $$(this);
		loadReview.call(this, $$(this).attr('data-page-index'), _pageSize, $$(this).attr("data-review-type"), dataLoaded);
	});
	loadReview.call($$("#tab-examine"), _pageIndex, _pageSize, 1, dataLoaded);
}
//
function loadReview(pageIndex, pageSize, level, loadedCall) {
	var _tmpId = 'script#tmpmyapplyList';
	if($$(this).attr('data-review-type') == '1') {
		_tmpId = 'script#tmpexamineList';
	}
	var _that = this;
	$$.service.myapplication(pageIndex, pageSize, level, function(data) {
		var tmpMemberList = $$(_tmpId).html();
		var tmpMemberListTemplate = Template7.compile(tmpMemberList);
		var personHTML = tmpMemberListTemplate((data ? data : {
			list: []
		}));
		//判断总页数是否小于等于当前页数
		if(data.totalpage == 0 || data.totalpage <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(data.totalpage != 0)
				$$(_that).append(personHTML + _loadedHtml);
			else
				$$(_that).append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data ? data.totalpage : '0') + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
	});
}
//查看分组二维码
function initshowgrouplist(page) {
	var _pageIndex = 1;
	var _pageSize = 10;
	var qrc_mum = page.query.qrc_num;

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-nextgroup');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-nextgroup', _pageIndex);
	}
	//监听滚动事件
	$$.t_infiniteScroll($$("[data-page=nextgroup] .mynextgroup"), _pageIndex, _pageSize, function() {
		window.testID = $$(this);
		loadshowgrouplist.call(this, $$(this).attr('data-page-nextgroup'), _pageSize, qrc_mum, dataLoaded);
	});
	loadshowgrouplist.call($$("[data-page=nextgroup] .mynextgroup"), _pageIndex, _pageSize, qrc_mum, dataLoaded);

}
//替换查看分组二维码数据
function loadshowgrouplist(pageIndex, pageSize, qrc_num, loadedCall) {
	var _tmpId = 'script#tmpNextgroupList';
	var _that = this;
	$$.service.showgrouplist(pageIndex, pageSize, qrc_num, function(data) {
		var tmpMemberList = $$(_tmpId).html();
		var tmpMemberListTemplate = Template7.compile(tmpMemberList);
		var personHTML = tmpMemberListTemplate((data ? data : {
			list: []
		}));
		//判断总页数是否小于等于当前页数
		if(data.totalpage == 0 || data.totalpage <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(data.totalpage != 0)
				$$(_that).find('#nextgroup').append(personHTML + _loadedHtml);
			else
				$$(_that).find('#nextgroup').append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).find('#nextgroup').append(personHTML + '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data ? data.totalpage : '0') + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
		$$('.qrc_img').on('click', function() {
			var src = $$(this).find('img').attr('src');
			currentApp.modal({
				title: '<img width="200" height="200" src =' + src + '>',
				buttons: [{
					text: '<span style="color:#555;font-size:15px;">点击关闭</span>',
					onClick: function() {

					}
				}, ]
			});
		});

		$$('.changesetting').on('click', function() {
			var qrc_num = parseInt($$(this).parents('li').find('.supplies-b .bs-sign').text());
			var bind_status = $$(this).parents('li').find('.supplies-c .fx-bindStatus').text();
			var versity = $$(this).parents('li').find('.supplies-c .fx-autoVerify').text();
			var value1 = $$(this).parents('li').find('.supplies-b .fx-urlpage').text();
			if(bind_status == "开启") {
				var val1 = "checked";
			} else {
				var val1 = null;
			}
			if(versity == "是") {
				var val2 = "checked";
			} else {
				var val2 = null;
			}

			currentApp.modal({
				title: '<span class="ewm-changeTit" style="text-align:center;">修改设置</span>',
				text: '<div style="text-align:center;color:#555; margin:-4px 0 7px;">标识码：<span style="color:#ff9a4a;">' + qrc_num + '</span></div>' +
					'<div class="list-block ewm-changeset"><ul><li><label class="label-checkbox item-content"><input type="checkbox" id="ewm-fxbind" ' + val1 + '><div class="item-media"><i class="icon icon-form-checkbox"></i></div><div class="item-inner"><div class="item-title f12c555">开启分销绑定</div></div></label></li><li><label class="label-checkbox item-content"><input type="checkbox" id="ewm-autoverify" ' + val2 + '><div class="item-media"><i class="icon icon-form-checkbox"></i></div><div class="item-inner"><div class="item-title f12c555">是否需要审核</div></div></label></li></ul></div>' +
					'<div class="ewmsetCon">跳转页面：<select id="setPage1"><option value="index">官网首页</option><option value="spot">景点</option><option value="hotel">酒店</option><option value="line">线路</option></select>&nbsp;&nbsp;<select id="setPage2"><option value="index">频道页</option><option value="list">列表页</option></select></div><div class="ewmsetSm">开启分销绑定后,跳转页面失效！</div>',

				buttons: [{
						text: '<span style="color:#555;font-size:15px;">确定</span>',
						onClick: function() {
							var fxBind = null;
							var autoverify = null;
							var theme = $$('#setPage1').val();
							var type = $$('#setPage2').val();
							if($$("#ewm-fxbind").prop("checked")) {
								fxBind = 1;
							} else {
								fxBind = null;
							};
							if($$('#ewm-autoverify').prop("checked")) {
								autoverify = 1;
							} else {
								autoverify = null;
							};
							$$.service.qrcodesetting(fxBind, autoverify, theme, type, qrc_num, function(data) {
								currentApp.mainView.refreshPage();
							})
						}
					},

					{
						text: '<span style="color:#555;font-size:15px;">取消</span>',
						onClick: function() {}
					},
				]
			});
			$$(".modal").on("opened", function() {
				if(value1 == "官网首页") {
					$$('#setPage1').val("index");
					$$('#setPage2').css('display', 'none');
				} else if(value1 == "景点频道页") {
					$$('#setPage1').val("spot");
					$$('#setPage2').val("index");
				} else if(value1 == "景点列表页") {
					$$('#setPage1').val("spot");
					$$('#setPage2').val("list");
				} else if(value1 == "酒店频道页") {
					$$('#setPage1').val("hotel");
					$$('#setPage2').val("index");
				} else if(value1 == "酒店列表页") {
					$$('#setPage1').val("hotel");
					$$('#setPage2').val("list");
				} else if(value1 == "线路频道页") {
					$$('#setPage1').val("line");
					$$('#setPage2').val("index");
				} else if(value1 == "线路购买页") {
					$$('#setPage1').val("line");
					$$('#setPage2').val("list");
				}
			});
			$$('#setPage1').on('change', function() {
				if($$('#setPage1').val() == 'index') {
					$$('#setPage2').css('display', 'none');
				} else {
					$$('#setPage2').css('display', 'inline-block');
				}
			});

		});

	});
}
//重置密码发送验证码
function initSendCode(plus) {
	var loadSendCode = function(obj) {
		var _loginUser = $$.localStorage.getloginUser();
		if(_loginUser) {
			_loginUser = eval('(' + _loginUser + ')');
			_loginUser.mobile = menberTel(_loginUser.mobile);
			var tmpsendcode = $$(obj).html();
			var tmpsendcodeTemplate = Template7.compile(tmpsendcode);
			var personHTML = tmpsendcodeTemplate({
				mobile: _loginUser.mobile
			});
			$$(obj).html(personHTML);
			$$('.first-hide').removeClass('first-hide');
			$$.service.sendnum(function(data) {
				var num = data.number;
				console.log(num);
				if(num <= 3) {
					$$("#sendcode").click(function() {
						$$.service.sendcode('',
							function() {
								if(plus && plus.nativeUI)
									plus.nativeUI.toast('发送成功');
							}
						);
						time(this);
					});
				} else if(num > 3) {}
			});
			$$("#verification").click(function() {
				_verification = $$("input[name=code]").val();
				if(_verification == '') {
					alert('验证码不能为空', '错误提示', function() {
						$$.newFocus($$('input[name=code]'));
					});
					return false;
				}
				$(_verification, function() {
					if(plus && plus.nativeUI)
						plus.nativeUI.toast('验证成功');
					currentApp.mainView.loadPage('set/passwordset4.html');
				}, function() {
					alert("验证码错误", "错误提示");
				});
			});
		}
	}
	loadSendCode($$(".password-2"));
}
//验证码发送倒计时
var wait = 60;

function time(obj) {
	if(wait == 0) {
		//obj.removeAttribute("disabled");
		$$(obj).html("获取验证码");
		wait = 60;
	} else {
		//obj.setAttribute("disabled", true);
		$$(obj).html("重新发送(" + wait + ")");
		wait--;
		setTimeout(function() {
				time(obj)
			},
			1000);
	}
}
//获取重置密码数据
function initResetPassword(plus) {
	$$("#resetpassword").click(function() {
		_NewPassword = $$("input[name=newPwd]").val();
		if(_NewPassword == '') {
			alert('新密码不能为空！', '错误提示', function() {
				$$.newFocus($$('input[name=pwd]'));
			});
			return false;
		}
		if(_NewPassword.length < 6) {
			alert('密码长度不能小余6位！', '错误提示', function() {
				$$.newFocus($$('input[name=pwd]'));
			});
			return false;
		}
		$$.service.resetpassword(_NewPassword, function() {
			//currentApp.mainView.loadPage('index.html');
			viewMain.router.back({
				url: 'set/safety.html',
				force: true
			});
			plus.nativeUI.toast('修改成功');
		})
	});
}
//设置绑定手机号
function initSetMobile() {
	loadMy($$(".setTel"));
	var _loginUser = $$.localStorage.getloginUser();
	_loginUser = eval('(' + _loginUser + ')');
	_loginUser.mobile = _loginUser.mobile;
	$$("#changeMoble-next").click(function() {
		_tel = $$("input[name=newMobile]").val();
		if(_tel == "") {
			alert("手机号码不能为空！", "错误信息");
			return false;
		};
		if(_tel == _loginUser.mobile) {
			alert("手机号码不能和之前一致", "错误信息");
			return false;
		}
		var bool = checkPhone(_tel);
		if(bool) {
			$$("#changeMoble-next").attr("href", "set/changemobile2.html?tel=" + _tel);
		};
	});
}
//更换绑定手机号
function initChangeMobile(page) {
	var phone = page.query.tel;
	$$(".newTel").text(phone);
	$$("#newTelSendCode").click(function() {
		$$.service.sendcode(phone,
			function() {
				if(plus && plus.nativeUI)
					plus.nativeUI.toast('发送成功');
			}
		);
		time(this);
	});
	$$("#newTel-next").click(function() {
		_code = $$("input[name=changetelcode]").val();
		if(_code == '') {
			alert('验证码不能为空', '错误提示', function() {
				$$.newFocus($$('input[name=changetelcode]'));
			});
			return false;
		}
		$$.service.checkcode(_code, function() {
			$$.service.changemobile(phone, function() {
				if(plus && plus.nativeUI)
					plus.nativeUI.toast('手机号更改成功！');
				viewMain.router.back({
					url: 'set/safety.html',
					force: true
				});
			}, function() {
				if(plus && plus.nativeUI)
					plus.nativeUI.toast('手机号更改失败！');
				viewMain.router.back({
					url: 'set/safety.html',
					force: true
				});
			});
		}, function() {
			alert("验证码错误", "错误提示");
		});
	});
}
//获取我的分组二维码
function initMymateriel() {
	var _page = 1;
	var _pagesize = 10;

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		/*console.log($$(this).attr('id'));*/
		$$(this).attr('data-page-index', _pageIndex);
	}

	$$("#myMateriel .tab").on('show', function() {
		if(!$$(this).attr('loaded'))
			loadinitqrcsign.call(this, _page, _pagesize, $$(this).attr("data-group-type"), dataLoaded);
	});
	$$.t_infiniteScroll('.page[data-page=mymateriel] .page-content', _page, _pagesize, function() {
		/*console.log($$(this).attr('data-page-index'));*/
		var _that = null;
		if($$("#tab-mygroup").hasClass('active')) {
			_that = $$("#tab-mygroup");
		} else {
			_that = $$("#tab-mynextgroup");
		}
		/* console.log(_that.attr('id'));*/
		loadinitqrcsign.call(_that, _that.attr('data-page-index'), _pagesize, _that.attr('data-group-type'), dataLoaded);
	});
	loadinitqrcsign.call($$("#tab-mygroup"), _page, _pagesize, 1, dataLoaded);
}
//替换我的分组二维码数据
function loadinitqrcsign(page, pagesize, level, loadedCall) {
	var _tmpId = 'script#tmpMyqrcodeList';
	if($$(this).attr('data-group-type') == '0') {
		_tmpId = 'script#tmpMyjuniorList';
	}
	_that = this;
	$$.service.getqrcsign(page, pagesize, level,
		function(data) {
			var tmpOrderList = $$(_tmpId).html();
			var tmpOrderListTemplate = Template7.compile(tmpOrderList);
			var personHTML = tmpOrderListTemplate((data ? data : {
				list: []
			}));
			/*console.log('loadOrderList_start2:' + $$(_that).attr('id'));*/
			if(data.totalpage == 0 || data.totalpage <= page) {
				var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
				if(data.totalpage != 0)
					$$(_that).append(personHTML + _loadedHtml);
				else {
					$$(_that).append(personHTML);
				}
				/*$$(_that).attr('loadover', true);*/
				loadedCall && loadedCall.call(_that, true);
			} else {
				$$(_that).append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
					page + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.totalpage) + '页</div>');
				loadedCall && loadedCall.call(_that, false);
			};
			$$(_that).attr('loaded', true);
			if($$(_that).attr('id') == "tab-mygroup") {
				initQRcode();
				$$('.supplies-3 .toop').click(function() {
					var _qrc_num = $$(this).parent().parent().eq(0).find(".numfz-bh").html();
					$$(this).attr("href", "literature/nextgroup.html?qrc_num=" + _qrc_num);
				});

			} else {
				$$(".next-myMateriel").click(function() {
					var _qrc_num = $$(this).find(".numfz i").html();

					$$(this).attr("href", "literature/nextgroup.html?qrc_num=" + _qrc_num);
				});
			}
		}
	);

}
//获取交易记录数据
function initCommission() {
	var _pageIndex = 1;
	var _pageSize = 10;

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	var _scrollTab = '#contentCommission .tab';
	$$(_scrollTab).on('show', function() {
		if(!$$(this).attr('loaded'))
			loadCommissionList.call(this, _pageIndex, _pageSize, $$(this).attr("data-commission-type"), dataLoaded);
	});
	loadCommissionList.call($$("#tab-all"), _pageIndex, _pageSize, 1, dataLoaded);
	$$.t_infiniteScroll(_scrollTab, _pageIndex, _pageSize, function() {
		console.log($$(this).attr('data-page-index'));
		loadCommissionList.call(this, $$(this).attr('data-page-index'), _pageSize, $$(this).attr("data-commission-type"), dataLoaded);
	});
}
//替换加载交易明细数据
function loadCommissionList(pageIndex, pageSize, type, loadedCall) {
	var _that = this;
	$$.service.getbalancedetail(pageIndex, pageSize, type, function(data) {
		var tmpCommissionList = $$("script#tmpCommissionList").html();
		var tmpCommissionListTemplate = Template7.compile(tmpCommissionList);
		var personHTML = tmpCommissionListTemplate((data ? data : {
			list: []
		}));

		if(data.pagetotal == 0 || data.pagetotal <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(data.pagetotal != 0)
				$$(_that).append(personHTML + _loadedHtml);
			else
				$$(_that).append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.pagetotal) + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
	});

}
//获取个人信息
function initPersonal() {
	var _loginUser = $$.localStorage.getloginUser();
	_loginUser = eval('(' + _loginUser + ')');
	var tmpPersonalInfo = $$("#personalInfo").html();
	var tmpPersonalInfoTemplate = Template7.compile(tmpPersonalInfo);
	var personHTML = tmpPersonalInfoTemplate({
		group: _loginUser
	});
	$$("#personalInfo").html(personHTML);
	$$('.first-hide').removeClass('first-hide');
	$$('.personinfo-header img').attr('src', $$('.personinfo-header img').attr('_src'));
	$$("#sexname").html(_loginUser.sex);
	$$("#sex").on('change', function() {
		var sex = $$("#sex").val();
		$$.service.modifysex(sex, function() {
			_loginUser.sex = sex;
			$$.localStorage.setLoginUser(JSON.stringify(_loginUser));
		});
	})
}
//修改昵称
function initNickname() {
	var _loginUser = $$.localStorage.getloginUser();
	_loginUser = eval('(' + _loginUser + ')');
	$$('input[name=modifynick]').val(_loginUser.nickname);
	$$("#savenick").click(function() {
		var nickname = $$("input[name=modifynick]").val();
		if(nickname == '') {
			alert('昵称不能为空！', '错误提示', function() {
				$$.newFocus($$('input[name=modifynick]'));
			});
			return false;
		}
		$$.service.modifynickname(nickname, function() {
			if(plus && plus.nativeUI)
				plus.nativeUI.toast('昵称更改成功！');
			_loginUser.nickname = nickname;
			$$.localStorage.setLoginUser(JSON.stringify(_loginUser));
			viewMain.router.back({
				url: 'personalinfo/index.html',
				force: true
			});
		});
	});
}
//添加真实姓名
function initTrueName() {
	var _loginUser = $$.localStorage.getloginUser();
	_loginUser = eval('(' + _loginUser + ')');
	if(_loginUser.truename == "" || _loginUser.truename == null) {
		$$("#savetrue").click(function() {
			var truename = $$("input[name=modifytrue]").val();
			if(truename == '') {
				alert('真实姓名不能为空！', '错误提示', function() {
					$$.newFocus($$('input[name=modifytrue]'));
				});
				return false;
			}
			$$.service.modifytruename(truename, function() {
				if(plus && plus.nativeUI)
					plus.nativeUI.toast('真实姓名添加成功！');
				_loginUser.truename = truename;
				$$.localStorage.setLoginUser(JSON.stringify(_loginUser));
				viewMain.router.back({
					url: 'personalinfo/index.html',
					force: true
				});
			});
		});
	} else {
		$$('input[name=modifytrue]').attr({
			readonly: true,
			value: _loginUser.truename
		});
		$$("#savetrue").attr({
			disabled: true,
			style: "background-color:#ccc; color:#fff"
		});
	}
}
//添加身份证号码
function initCardid() {
	var _loginUser = $$.localStorage.getloginUser();
	_loginUser = eval('(' + _loginUser + ')');
	if(_loginUser.cardid == "" || _loginUser.cardid == null) {
		$$("#savecard").click(function() {
			var cardid = $$("input[name=cardid]").val();
			if(cardid == "") {
				alert('身份证不能为空！', '错误提示', function() {
					$$.newFocus($$('input[name=cardid]'));
				});
				return false;
			}
			var checkcardid = IdentityCodeValid(cardid);
			if(checkcardid) {
				$$.service.addcardid(cardid, function() {
					if(plus && plus.nativeUI)
						plus.nativeUI.toast('身份证号码添加成功！');
					_loginUser.cardid = cardid;
					$$.localStorage.setLoginUser(JSON.stringify(_loginUser));
					viewMain.router.back({
						url: 'personalinfo/index.html',
						force: true
					});
				});
			} else {
				alert('身份证输入错误！', '错误提示', function() {
					$$.newFocus($$('input[name=cardid]'));
				});
				return false;
			}
		});
	} else {
		$$('input[name=cardid]').attr({
			readonly: true,
			value: _loginUser.cardid
		});
		$$("#savecard").attr({
			disabled: true,
			style: "background-color:#ccc; color:#fff"
		});
	}
}
//修改地址
function initAddress_edit() {
	var _loginUser = $$.localStorage.getloginUser();
	_loginUser = eval('(' + _loginUser + ')');
	$$('input[name=modifyaddress]').val(_loginUser.address);
	$$("#saveaddress").click(function() {
		var address = $$("input[name=modifyaddress]").val();
		if(address == '') {
			alert('地址不能为空！', '错误提示', function() {
				$$.newFocus($$('input[name=modifyaddress]'));
			});
			return false;
		}
		$$.service.modifyaddress(address, function() {
			if(plus && plus.nativeUI)
				plus.nativeUI.toast('地址更改成功！');
			_loginUser.address = address;
			$$.localStorage.setLoginUser(JSON.stringify(_loginUser));
			viewMain.router.back({
				url: 'personalinfo/index.html',
				force: true
			});
		});
	});
}
//安全中心
function initSafety() {
	var _loginUser = $$.localStorage.getloginUser();
	_loginUser = eval('(' + _loginUser + ')');
	_loginUser.mobile = menberTel(_loginUser.mobile);
	var tmpPersonalInfo = $$("#safety").html();
	var tmpPersonalInfoTemplate = Template7.compile(tmpPersonalInfo);
	var personHTML = tmpPersonalInfoTemplate({
		group: _loginUser
	});
	$$("#safety").html(personHTML);
	var moblie = _loginUser.mobile;
	var name = _loginUser.truename;
	var cardid = _loginUser.cardid;
	var stringreturn = "低";
	if(moblie && name && cardid) {
		stringreturn = "高";
	} else if(moblie && (name || cardid)) {
		stringreturn = "中"
	} else if(moblie && !name && !cardid) {
		stringreturn = "低";
	}
	$$("#satfeylevel").html(stringreturn);
}
//反馈
function initFeedback() {
	var pickerCustomToolbar = currentApp.picker({
		input: '#picker-custom-toolbar',
		rotateEffect: true,
		toolbarTemplate: '<div class="toolbar">' +
			'<div class="toolbar-inner">' +
			'<div class="left">' +
			'<a href="#" class="close-picker">取消</a>' +
			'</div>' +
			'<div class="center">' +
			'问题类型' +
			'</div>' +
			'<div class="right">' +
			'<a href="#" class="link close-picker">确定</a>' +
			'</div>' +
			'</div>' +
			'</div>',
		cols: [{
			values: ('景点 酒店 线路 餐饮 特产').split(' ')
		}, ],
		onOpen: function(picker) {
			picker.container.find('.toolbar-randomize-link').on('click', function() {
				var col0Values = picker.cols[0].values;
				var col0Random = col0Values[Math.floor(Math.random() * col0Values.length)];

				var col1Values = picker.cols[1].values;
				var col1Random = col1Values[Math.floor(Math.random() * col1Values.length)];

				/*var col2Values = picker.cols[2].values;
				var col2Random = col2Values[Math.floor(Math.random() * col2Values.length)];*/
				picker.setValue([col0Random, col1Random]);
			});
		}
	});
	$$("#submessage").click(function() {
		var _message = $$("#tmessage").val();
		if(_message == "") {
			alert('输入不能为空！', '错误提示', function() {
				$$.newFocus($$('#tmessage'));
			});
			return false;
		}
		var phone=$$("#phone").val();
		if(!(/^1[34578]\d{9}$/.test(phone))){ 
	        alert("手机号码有误，请重填",'错误提示',function(){
	        	$$.newFocus($$('#phone'));
	        });  
        	return false; 
    	}
		$$.service.getmessage(_message,phone, function() {
			if(plus && plus.nativeUI)
				plus.nativeUI.toast('反馈成功！');
			viewMain.router.back({
				url: 'set/about.html',
				force: true
			});
		}, function() {
			if(plus && plus.nativeUI)
				plus.nativeUI.toast('反馈失败，请稍后重试。');
			viewMain.router.back({
				url: 'set/about.html',
				force: true
			});
		});
	});
}
//获取提现记录
function initdrawalRecord() {
	var _pageIndex = 1;
	var _pageSize = 10;

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	var _scrollTab = '#drawalrecord-content .tab';
	$$(_scrollTab).on('show', function() {
		if(!$$(this).attr('loaded'))
			loaddrawalRecord.call(this, _pageIndex, _pageSize, $$(this).attr('data-drawal-type'), dataLoaded);
	});
	loaddrawalRecord.call($$("#tab-all"), _pageIndex, _pageSize, 0, dataLoaded);
	$$.t_infiniteScroll(_scrollTab, _pageIndex, _pageSize, function() {
		loaddrawalRecord.call(this, $$(this).attr('data-page-index'), _pageSize, $$(this).attr('data-drawal-type'), dataLoaded);
	});

}
//替换加载提现记录数据
function loaddrawalRecord(pageIndex, pageSize, type, loadedCall) {
	var _that = this;
	$$.service.drawalrecord(pageIndex, pageSize, type, function(data) {
		var tmpDrawalList = $$("#tmpCommissionList").html();
		var tmpDrawalListTemplate = Template7.compile(tmpDrawalList);
		var personHTML = tmpDrawalListTemplate((data ? data : {
			list: []
		}));
		if(data.totalpage == 0 || data.totalpage <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(data.totalpage != 0)
				$$(_that).append(personHTML + _loadedHtml);
			else
				$$(_that).append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.totalpage) + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
	});
}
//获取消息详情
function initMsgDetails(page) {
	var mid = page.query.mid;
	loadMsgDynamics.call($$("#message_details"), '', '', $$("#tmpmessageDetails"), 2, mid, '');
}
//获取消息动态
function initMsgDynamics() {
	var _pageIndex = 1;
	var _pageSize = 10;
	var conobj = $$("#tmpmsgDynamics");

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	loadMsgDynamics.call($$("[data-page=message] .message-box"), _pageIndex, _pageSize, conobj, 1, '', dataLoaded);
	$$.t_infiniteScroll($$("[data-page=message] .message-box"), _pageIndex, _pageSize, function() {
		loadMsgDynamics.call(this, $$(this).attr('data-page-index'), _pageSize, conobj, 1, '', dataLoaded);
	});
}
//替换加载消息动态数据
function loadMsgDynamics(pageIndex, pageSize, conobj, level, id, loadedCall) {
	var _that = this;
	$$.service.msgdynamics(pageIndex, pageSize, level, id, function(data) {
		var tmpMsgList = conobj.html();
		var tmpMsgListTemplate = Template7.compile(tmpMsgList);
		var personHTML = tmpMsgListTemplate((data ? data : {
			list: []
		}));
		if(conobj.attr('id') == 'tmpmessageDetails') {
			$$(_that).append(personHTML);
		};
		if(data.totalpage == 0 || data.totalpage <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;padding-top:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(data.totalpage != 0)
				$$(_that).find("#msgDynamics").append(personHTML + _loadedHtml);
			else
				$$(_that).find("#msgDynamics").append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).find("#msgDynamics").append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center; padding:12px 0;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.totalpage) + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
		$$('.msgDynamics-list a').click(function() {
			var mid = $$(this).parent('li').attr('data-id');
			$$(this).attr("href", "message/message_details.html?mid=" + mid);
		})
	});
}
//获取我的粉丝
function initFans() {
	var _pageIndex = 1;
	var _pageSize = 10;

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	loadFans.call($$("[data-page=fans] .fanscount"), _pageIndex, _pageSize, dataLoaded);
	$$.t_infiniteScroll($$("[data-page=fans] .fanscount"), _pageIndex, _pageSize, function() {
		loadFans.call(this, $$(this).attr('data-page-index'), _pageSize, dataLoaded);
	});
}
//替换加载我的粉丝数据
function loadFans(pageIndex, pageSize, loadedCall) {
	var _that = this;
	$$.service.getmyfans(pageIndex, pageSize, "", function(data) {
		var tmpfansList = $$("script#tmpfans").html();
		var tmpfansListTemplate = Template7.compile(tmpfansList);
		var personHTML = tmpfansListTemplate((data ? data : {
			list: []
		}));
		if(data.totalpage == 0 || data.totalpage <= pageIndex) {
			var _loadedHtml = '<div style="padding-top:4px;padding-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(data.totalpage != 0)
				$$(_that).find('#fansul').append(personHTML + _loadedHtml);
			else
				$$(_that).find('#fansul').append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).find('#fansul').append(personHTML + '<div style="padding-top:4px;padding-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.totalpage) + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
		$$('.fans-xfinfo a').click(function() {
			var fid = $$(this).parents('.fans-list1').attr('data-id');
			$$(this).attr("href", "fans/fans_details.html?fid=" + fid);
		})
	});
}
//获取我的粉丝详情
function initFansDetails(page) {
	var fid = page.query.fid;
	var _pageIndex = 1;
	var _pageSize = 10;

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	};
	loadFansDetails.call($$("[data-page=fansDetails] .fansDetails"), _pageIndex, _pageSize, fid, dataLoaded);
	$$.t_infiniteScroll($$("[data-page=fansDetails] .fansDetails"), _pageIndex, _pageSize, function() {
		loadFansDetails.call(this, $$(this).attr('data-page-index'), _pageSize, fid, dataLoaded);
	});
}
//替换加载粉丝消费详情数据
function loadFansDetails(pageIndex, pageSize, fansid, loadedCall) {
	var _that = this;
	$$.service.myfansorder(pageIndex, pageSize, fansid, function(data) {
		var tmpfansList = $$("script#tmpfansDetails").html();
		var tmpfansListTemplate = Template7.compile(tmpfansList);
		var personHTML = tmpfansListTemplate((data ? data : {
			list: []
		}));
		if(data.totalpage == 0 || data.totalpage <= pageIndex) {
			var _loadedHtml = '<div style="padding-top:12px;padding-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(data.totalpage != 0)
				$$(_that).find('#fansDetails-list').append(personHTML + _loadedHtml);
			else
				$$(_that).find('#fansDetails-list').append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).find('#fansDetails-list').append(personHTML + '<div style="padding-top:12px;padding-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.totalpage) + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
	});
}
//宣传物料
function initliterature() {
	var _page = 1;
	var _pagesize = 10;

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}

	$$("#myLiterature .tab").on('show', function() {
		if(!$$(this).attr('loaded'))
			loadliterature.call(this, _page, _pagesize, $$(this).attr("data-literature-type"), dataLoaded);
	});

	$$.t_infiniteScroll('#myLiterature .tab', _page, _pagesize, function() {
		var _that = null;
		if($$("#tab-pmwl").hasClass('active')) {
			_that = $$("#tab-pmwl");
		} else {
			_that = $$("#tab-wxxc");
		}
		loadliterature.call(_that, _that.attr('data-page-index'), _pagesize, _that.attr('data-literature-type'), dataLoaded);
	});
	loadliterature.call($$("#tab-pmwl"), _page, _pagesize, 1, dataLoaded);

}

//获取我的收藏详情数据
function initMyCollections(){
	var _pageIndex = 1;
	var _pageSize = 10;

	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	loadCollect.call($$("[data-page=collection] .collect"), _pageIndex, _pageSize, dataLoaded);
	$$.t_infiniteScroll($$("[data-page=collection] .collect"), _pageIndex, _pageSize, function() {
		window.testID = $$(this);
		loadCollect.call(this, $$(this).attr('data-page-index'), _pageSize, dataLoaded);
	});
}

//替换加载我的收藏详情数据
function loadCollect(pageIndex, pageSize, loadedCall) {
	var _that = this;
	$$.service.getmycollect(pageIndex, pageSize, "", function(data) {
		var tmpCollectList = $$("script#tmpcollect").html();
		var tmpCollectListTemplate = Template7.compile(tmpCollectList);
		var personHTML = tmpCollectListTemplate((data ? data : {
			list: []
		}));
		var len = data.list==null?0:data.list.length;
		var totalpage = Math.ceil(len/pageSize);
		if(len == 0 || len <= pageIndex) {
			var _loadedHtml = '<div style="padding-top:4px;padding-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(len != 0)
				$$(_that).find('#collectres').append(personHTML + _loadedHtml);
			else
				$$(_that).find('#collectres').append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).find('#collectres').append(personHTML + '<div style="padding-top:4px;padding-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (totalpage) + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
		
	});
}

//获取我的交易明细
function initMyBalanceDetail(page){
	var _pageIndex = 1;
	var _pageSize = 10;
	//数据加载完毕回调
	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	//首次加载余额数据
	loadMyBalanceDetail.call($$("[data-page=detailed] .balance"), _pageIndex, _pageSize, dataLoaded);
	//监听滚动事件加载余额数据
	$$.t_infiniteScroll($$("[data-page=detailed] .balance"), _pageIndex, _pageSize, function() {
		// window.testID = $$(this);
		loadMyBalanceDetail.call(this, $$(this).attr('data-page-index'), _pageSize, dataLoaded);
	});
}

//替换加载交易明细详情数据
function loadMyBalanceDetail(pageIndex, pageSize, type, loadedCall) {
	var _that = this;
	$$.service.getmybalance(pageIndex, pageSize, type, function(data) {
		var tmpBalanceList = $$("script#tmpBalance").html();
		/*console.log(JSON.stringify(data.list[0]));*/
		var tmpBalanceListTemplate = Template7.compile(tmpBalanceList);
		/*console.log(tmpBalanceListTemplate);*/
		var personHTML = tmpBalanceListTemplate((data ? data : {
			list: []
		}));
		//判断总页数是否小于等于当前页数
		var sum = data.page.total_items
		var pagetotal = Math.ceil(sum/pageSize);
		if(pagetotal == 0 || pagetotal <= pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;padding:8px 0;">数据已加载完毕</div>';
			if(pagetotal != 0)
				$$(_that).find("#balanceDetail").append(personHTML + _loadedHtml);
			else
				$$(_that).find("#balanceDetail").append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).find("#balanceDetail").append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;padding:8px 0;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (pagetotal) + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
	});
}

//获取用户银行卡信息
function initManageBank(page){
	var _pageIndex = 1;
	var _pageSize = 10;
	var _pay_type = 1;
	//数据加载完毕回调
	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	//首次加载余额数据
	loadManageBank.call($$("[data-page=managebank] .cardinfo"), _pageIndex, _pageSize, _pay_type, dataLoaded);
	//监听滚动事件加载余额数据
	$$.t_infiniteScroll($$("[data-page=managebank] .cardinfo"), _pageIndex, _pageSize, _pay_type,function() {
		window.testID = $$(this);
		loadManageBank.call(this, $$(this).attr('data-page-index'), _pageSize, _pay_type, dataLoaded);
	});
}

//替换加载用户银行卡信息
function loadManageBank(pageIndex, pageSize,pay_type, loadedCall){
	var _that = this;
	$$.service.bankcardlist(pageIndex, pageSize,pay_type, function(data) {
		var tmpBankCardList = $$("script#tmpBankCard").html();
		var tmpBankCardListTemplate = Template7.compile(tmpBankCardList);
		var personHTML = tmpBankCardListTemplate((data ? data : {
			list: []
		}));
		//判断总页数是否小于等于当前页数
		var sum = data.data.bank?data.data.bank.length:0;
	
		var pagetotal = Math.ceil(sum/pageSize);
		if(pagetotal == 0 || pagetotal < pageIndex) {
			var _loadedHtml = '<div style="margin-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;padding:8px 0;">数据已加载完毕</div>';
			if(pagetotal != 0)
				$$(_that).find("#bankCard").append(personHTML + _loadedHtml);
			else
				$$(_that).find("#bankCard").append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			$$(_that).find("#bankCard").append(personHTML + '<div style="background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;padding:8px 0;">第' +
				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (pagetotal) + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);
		//点击解除绑定按钮跳转
		$$('.swipeout').on('delete', function(e) {
		var id=	$$(this).attr('data-id');
		viewMain.router.back({
				url: 'bank/unbundling.html?id='+id,
				force: true
			});
	  });
	});
	
}

//银行卡解除绑定
function initUnBundingCard(page){
	$$("[data-page=unbundling] .button-fill").click(function(){
		var pwd=$$("[data-page=unbundling]").find("input[type='password']").val();
		var id=page.query.id;
		loadUnBunding.call($$("[data-page=unbundling] .unbund"),pwd,id);	
	});
}

function loadUnBunding(password,id,loadedCall){
	$$.service.unbundingcard(password,id,function(data){
		
	});
}

//用户账户提现
function initCashWithdraw(page){
	var _pageIndex = 1;
	var _pageSize = 10;
	var _pay_type = 1;
	//数据加载完毕回调
	function dataLoaded(loaded) {
		var _that = this;
		var _pageIndex = $$(this).attr('data-page-index');
		if(_pageIndex == undefined || _pageIndex == null) _pageIndex = 1;
		$$.t_removePreloaderScroll(this, loaded);
		_pageIndex++;
		$$(this).attr('data-page-index', _pageIndex);
	}
	//首次加载余额数据
	loadBankCard.call($$("[data-page=postal] .withdraw"), _pageIndex, _pageSize, _pay_type, dataLoaded);
	//点击提现提交按钮触发
	$$('[data-page=postal] .button-fill').click(function(){
		var money=$$("[data-page=postal]").find("input[type='text']").val();
		var pwd=$$("[data-page=postal]").find("input[type='password']").val();
		var card_id=$$("[data-page=postal]").find("input[type='hidden']").val();
		loadWithdraw.call($$('[data-page=postal] .withdraw'),money,card_id,pwd);
	});
}

function loadBankCard(pageIndex, pageSize,pay_type, loadedCall){
	var _that = this;
	$$.service.bankcardlist(pageIndex, pageSize,pay_type, function(data) {
		var tmpBankCardList = $$("script#tmpWithdrawal").html();
		var tmpBankCardListTemplate = Template7.compile(tmpBankCardList);
		var personHTML = tmpBankCardListTemplate((data ? data : {
			list: []
		}));
		//判断总页数是否小于等于当前页数
		var sum = data.data.bank?data.data.bank.length:0;
		var pagetotal = Math.ceil(sum/pageSize);	
			if(pagetotal != 0)
				$$(_that).find("#withdrawal").append(personHTML);
	});
}

function loadWithdraw(money,card_id,password,loadedCall){
	$$.service.cashwithdraw(money,card_id,password,function(data){
		if(data.message=="申请提现成功！"){
				    viewMain.router.back({
					url: 'account/waitpostal.html',
					force: true
			    });
				}else{
					if(plus && plus.nativeUI){
			        plus.nativeUI.toast("密码错误，提现失败");
					}
				}
	});

}

function loadliterature(pageIndex, pageSize, type, loadedCall) {
	var _that = this;
	var tmpId = 'script#tmpliterature1';
	if($$(this).attr('data-literature-type') == '2') {
		tmpId = 'script#tmpliterature2';
	};
	$$.service.materialconduct(pageIndex, pageSize, type, function(data) {
		var tmpliteratureList = $$(tmpId).html();
		var tmpliteratureListTemplate = Template7.compile(tmpliteratureList);
		var personHTML = tmpliteratureListTemplate((data ? data : {
			list: []
		}));
		if(data.totalpage == 0 || data.totalpage <= pageIndex) {
			var _loadedHtml = '<div style="padding-top:12px;clear:both;padding-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">数据已加载完毕</div>';
			if(data.totalpage != 0)
				$$(_that).append(personHTML);
			else
				$$(_that).append(personHTML);
			loadedCall && loadedCall.call(_that, true);
		} else {
			//			$$(_that).append(personHTML + '<div style="padding-top:4px;clear:both;padding-bottom:12px;background-color: #f8f8f8;color: #999;font-size: 12px;height: 14px;line-height: 14px;text-align: center;">第' +
			//				pageIndex + '页&nbsp;&nbsp;&nbsp;&nbsp;总共' + (data.totalpage) + '页</div>');
			loadedCall && loadedCall.call(_that, false);
		}
		$$(_that).attr('loaded', true);

	});
}

function waterfall(parent, box) {
	var oParent = document.getElementById(parent);
	var oBoxs = getByClass(oParent, box);
	var oBoxW = oBoxs[0].offsetWidth;
	var cols = Math.floor(document.documentElement.clientWidth / oBoxW);
	oParent.style.cssText = 'width:' + oBoxW * cols + 'px;';
	var hArr = [];
	for(var i = 0; i < oBoxs.length; i++) {
		if(i < cols) {
			hArr.push(oBoxs[i].offsetHeight);
		} else {
			var minH = Math.min.apply(null, hArr);
			var minIndex = getMinIndex(hArr, minH);
			oBoxs[i].style.position = 'absolute';
			oBoxs[i].style.top = minH + 'px';
			oBoxs[i].style.left = oBoxW * minIndex + 'px';
			hArr[minIndex] += oBoxs[i].offsetHeight;
		}

	}

	function getByClass(parent, clsName) {
		var boxArr = new Array(),
			oElements = parent.getElementsByTagName('*');
		for(var i = 0; i < oElements.length; i++) {
			if(oElements[i].className == clsName) {
				boxArr.push(oElements[i]);
			}
		}
		return boxArr;
	}

	function getMinIndex(arr, val) {
		for(var i in arr) {
			if(arr[i] == val) {
				return i;
			}
		}
	}
}

//更换头像
var procinstid = 0;

function initHeaderphoto() {
	var _loginUser = $$.localStorage.getloginUser();
	_loginUser = eval('(' + _loginUser + ')');
	$$(".imghead").attr('src', _loginUser.litpic);
	//初始化页面执行操作  
	function plusReady() {
		//Android返回键监听事件  
		plus.key.addEventListener('backbutton', function() {
			myclose();
		}, false);
	}
	if(plus) {
		plusReady();
		loadheadphoto();
	} else {
		document.addEventListener('plusready', plusReady, false);
	}
}

function loadheadphoto() {
	$$("#Album").click(function() {
		galleryImg('F_CKJLB');
	});
	$$("#Photograph").click(function() {
		getImage('F_CKJLB');
	});
}
//加载页面初始化需要加载的图片信息  
//或者相册IMG_20160704_112620.jpg  
//imgId:图片名称：1467602809090或者IMG_20160704_112620  
//imgkey:字段例如：F_ZDDZZ  
//ID：站点编号ID,例如429  
//src：src="file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/.HBuilder/apps/HBuilder/doc/upload/F_ZDDZZ-1467602809090.jpg"  
function showImgDetail(imgId, imgkey, id, src) {
	var html = "";
	html += '<div  id="Img' + imgId + imgkey + '" class="image-item ">';
	html += '    <img id="picBig" data-preview-src="" data-preview-group="1" ' + src + '/>';
	html += '    <span class="del" onclick="delImg(\'' + imgId + '\',\'' + imgkey + '\',' + id + ');">';
	html += '        <div class="fa icon-t-delete"></div>';
	html += '    </span>';
	html += '</div>';
	/*console.log(html);*/
	$$("#" + imgkey + "S").append(html);
}
//删除图片  
//imgId:图片名称：IMG_20160704_112614  
//imgkey:字段，例如F_ZDDZZ  cai
//ID：站点编号ID，例如429  
function delImg(imgId, imgkey, id) {
	var bts = ["是", "否"];
	plus.nativeUI.confirm("是否删除图片？", function(e) {
		var i = e.index;
		if(i == 0) {
			var itemname = id + "img-" + imgkey; //429img-F_ZDDZZ  
			var itemvalue = plus.storage.getItem(itemname);
			//{IMG_20160704_112614,_doc/upload/F_ZDDZZ-IMG_20160704_112614.jpg,file:///storage/emulated/0/Android/data/io.dcloud...../doc/upload/F_ZDDZZ-1467602809090.jpg}  
			if(itemvalue != null) {
				var index = itemvalue.indexOf(imgId + ",");
				if(index == -1) { //没有找到  
					delImgfromint(imgId, imgkey, id, index);
				} else {
					delImgFromLocal(itemname, itemvalue, imgId, imgkey, index); //修改，加了一个index参数  
				}

			} else {
				delImgfromint(imgId, imgkey, id);
			}
		}
	}, "张网旅游", bts);
	/*var isdel = confirm("是否删除图片？");  
	if(isdel == false){  
	    return;  
	}*/

}

function delImgFromLocal(itemname, itemvalue, imgId, imgkey, index) {
	var wa = plus.nativeUI.showWaiting();
	var left = itemvalue.substr(0, index - 1);
	var right = itemvalue.substring(index, itemvalue.length);
	var end = right.indexOf("}");
	right = right.substring(end + 1, right.length);
	var newitem = left + right;
	plus.storage.setItem(itemname, newitem);
	//myAlert("删除成功");  
	$$("#Img" + imgId + imgkey).remove();
	wa.close();
}
//选取图片的来源，拍照和相册  
/*function showActionSheet(conf) {
	var divid = conf.id;
	var actionbuttons = [{
		title: "拍照"
	}, {
		title: "相册选取"
	}];
	var actionstyle = {
		title: "选择照片",
		cancel: "取消",
		buttons: actionbuttons
	};
	plus.nativeUI.actionSheet(actionstyle, function(e) {
		if(e.index == 1) {
			getImage(divid);
		} else if(e.index == 2) {
			galleryImg(divid);
		}
	});
}*/
//相册选取图片  
function galleryImg(divid) {
	plus.gallery.pick(function(p) {
		//alert(p);//file:///storage/emulated/0/DCIM/Camera/IMG_20160704_112620.jpg  
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			//alert(entry.toLocalURL());//file:///storage/emulated/0/DCIM/Camera/IMG_20160704_112620.jpg  
			//alert(entry.name);//IMG_20160704_112620.jpg  
			compressImage(entry.toLocalURL(), entry.name, divid);
		}, function(e) {
			plus.nativeUI.toast("读取拍照文件错误：" + e.message);
		});
	}, function(e) {}, {
		filename: "_doc/camera/",
		filter: "image"
	});
}
// 拍照  
function getImage(divid) {
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p) {
		//alert(p);//_doc/camera/1467602809090.jpg  
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			//alert(entry.toLocalURL());//file:///storage/emulated/0/Android/data/io.dcloud...../doc/camera/1467602809090.jpg  
			//alert(entry.name);//1467602809090.jpg  
			compressImage(entry.toLocalURL(), entry.name, divid);
		}, function(e) {
			plus.nativeUI.toast("读取拍照文件错误：" + e.message);
		});
	}, function(e) {}, {
		filename: "_doc/camera/",
		index: 1
	});
}
//压缩图片  
function compressImage(url, filename, divid) {
	var name = "_doc/upload/" + divid + "-" + filename; //_doc/upload/F_ZDDZZ-1467602809090.jpg  
	plus.zip.compressImage({
			src: url, //src: (String 类型 )压缩转换原始图片的路径  
			dst: name, //压缩转换目标图片的路径  
			quality: 20, //quality: (Number 类型 )压缩图片的质量.取值范围为1-100  
			overwrite: true //overwrite: (Boolean 类型 )覆盖生成新文件  
		},
		function(event) {
			//uploadf(event.target,divid);  
			var path = name; //压缩转换目标图片的路径  
			//event.target获取压缩转换后的图片url路  
			//filename图片名称  
			saveimage(event.target, divid, filename, path);
		},
		function(error) {
			plus.nativeUI.toast("压缩图片失败，请稍候再试");
		});
}
//保存信息到本地  
/**  
 *   
 * @param {Object} url  图片的地址  
 * @param {Object} divid  字段的名称  
 * @param {Object} name   图片的名称  
 */
function saveimage(url, divid, name, path) {
	console.log(url);
	//alert(url);//file:///storage/emulated/0/Android/data/io.dcloud...../doc/upload/F_ZDDZZ-1467602809090.jpg  
	//alert(path);//_doc/upload/F_ZDDZZ-1467602809090.jpg  
	var state = 0;
	var wt = plus.nativeUI.showWaiting();
	//  plus.storage.clear();   
	name = name.substring(0, name.indexOf(".")); //图片名称：1467602809090  
	var id = document.getElementById("ckjl.id").value;
	var itemname = id + "img-" + divid; //429img-F_ZDDZ  
	var itemvalue = plus.storage.getItem(itemname);
	if(itemvalue == null) {
		itemvalue = "{" + name + "," + path + "," + url + "}"; //{IMG_20160704_112614,_doc/upload/F_ZDDZZ-IMG_20160704_112614.jpg,file:///storage/emulated/0/Android/data/io.dcloud...../doc/upload/F_ZDDZZ-1467602809090.jpg}  
	} else {
		itemvalue = itemvalue + "{" + name + "," + path + "," + url + "}";
	}
	plus.storage.setItem(itemname, itemvalue);

	var src = 'src="' + url + '"';
	//alert("itemvalue="+itemvalue);  
	showImgDetail(name, divid, id, src);
	wt.close();

}
//上传图片，实例中没有添加上传按钮  
function uploadimge(agree, back) {
	//plus.storage.clear();  
	var wa = plus.nativeUI.showWaiting();
	var DkeyNames = [];
	var id = document.getElementById("ckjl.id").value;
	var length = id.toString().length;
	var idnmae = id.toString();
	var numKeys = plus.storage.getLength();
	var task = plus.uploader.createUpload(getUrl() + 'url', {
			method: "POST"
		},
		function(t, status) {
			if(status == 200) {
				console.log("上传成功");
				$.ajax({
					type: "post",
					url: getUrl() + 'url',
					data: {
						taskId: taskId,
						voteAgree: agree,
						back: back,
						voteContent: $("#assign").val(),
					},
					async: true,
					dataType: "text",
					success: function(data) {
						wa.close();
						goList(data);

					},
					error: function() {
						wa.close();
						myAlert("网络错误，提交审批失败，请稍候再试");
					}
				});

			} else {
				wa.close();
				console.log("上传失败");
			}
		}
	);
	task.addData("id", id);
	for(var i = 0; i < imgArray.length; i++) {
		var itemkey = id + "img-" + imgArray[i];
		if(plus.storage.getItem(itemkey) != null) {
			var itemvalue = plus.storage.getItem(itemkey).split("{");
			for(var img = 1; img < itemvalue.length; img++) {
				var imgname = itemvalue[img].substr(0, itemvalue[img].indexOf(","));
				var imgurl = itemvalue[img].substring(itemvalue[img].indexOf(",") + 1, itemvalue[img].lastIndexOf(","));
				task.addFile(imgurl, {
					key: imgurl
				});
			}
		}
	}
	task.start();
}

// 修改个人资料  性别选择
function edit_personal_data_gender (){
	currentApp.picker({
	    input: '#edit_personal_data_gender',
	    cols: [
	        {
	            textAlign: 'center',
	            values: ['男', '女']
	        }
	    ]
	});
}

// 修改个人资料  生日选择
function edit_personal_data_birth () {
	currentApp.calendar({
	    input: '#edit_personal_data_birth'
	});  
}

function showpwdeye() {
	var eye =$$('.member-icon.password');
	eye.click(function() {
		var type= $$(this).prev().find('input').attr('type');
		if(type == 'password'){
			$$(this).addClass('hidepw');		
			$$(this).prev().find('input').attr('type','text');
		}else{
			$$(this).removeClass('hidepw');
			$$(this).prev().find('input').attr('type','password');
		}		
	})
}

function showpwdeye_q() {
	var eye =$$('.member-icon.password');
	eye.click(function() {
		var type= $$(this).prev().attr('type');
		if(type == 'password'){
			$$(this).addClass('hidepw');		
			$$(this).prev().attr('type','text');
		}else{
			$$(this).removeClass('hidepw');
			$$(this).prev().attr('type','password');
		}		
	})	
}

