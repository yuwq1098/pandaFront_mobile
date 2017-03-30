// Initialize your app
var currentApp = new Framework7({
	//swipePanel: 'left' ,//侧边栏打开方向
	init: false, //是否自动初始化
	animatePages: true, //是否显示页面切换动画
	material: false, //加载页面是否去掉顶部和底部
	pushState: false, //跳转使用“锚”进行链接
	cache: false, //是否缓存页面 
	animateNavBackIcon: true,
	materialRipple: false,
	swipeBackPage: true, //滑动返回
	modalButtonOk: '确定',
	modalButtonCancel: '取消',
	//template7Pages: true, //Tell Framework7 to compile templates on app init
	//precompileTemplates: true,
	//	template7Data: {
	//		'page:order-index': {
	//			all: '全部'
	//		}
	//	},  
	//reloadPages:true,
	onPageInit: function(app, page) {
		$$("select.update-icon").selectUpdateIcon();
		//		document.addEventListener('plusready', function() {
		//			$$('.back').click(function() {
		//				plus.t_back();
		//			});
		//		});
		if(window.isPlus) {
			$$('.back').click(function() {
				if(window.plus)
					window.plus.t_back();
			});
			plus.t_init(page.container);
			//判断安卓系统版本是否为4.5以下版本 
			if(window.os_version && parseFloat(window.os_version) < 6) {
				//去掉效果 
				// $$('.tabs-animated-wrap').removeClass('tabs-animated-wrap');
			}
		}
	}
});

// Add view
var viewMain = currentApp.addView('.view-main', {
	// Because we use fixed-through navbar we can enable dynamic navbar
	dynamicNavbar: true,
	main: true,
	domCache: false //enable inline pages
		//  url:'fenxiao/index.html'
});

currentApp.onPageInit('index', function(e) {
	initIndex();
});
currentApp.onPageInit('forget-password-verifi-phone', function(e) {
	forgotPassword();
});
currentApp.onPageInit('forget-password-reset-password', function(e) {
	forgotPassword();
});
currentApp.onPageInit('verifi-phone', function(e) {
	phoneVeify();
});

// 登录page 2017.3.24 zwh
currentApp.onPageInit('login', function(e) {
	initLogin();
	phoneLogin();
	showpwdeye();
});
// 2017.3.28 cwh 修改密码
currentApp.onPageInit('chagepassword', function(e) {
	updatePassword();
});
// 2017.3.28 cwh 安全中心
currentApp.onPageInit('securitycenter', function(e) {
	updatePassword();
});
// 常用联系人列表  2017.3.24 zwr
currentApp.onPageInit('contactlist', function(e) {
	initAddresslist(e);
	initContactlist();
});
// 常用地址列表  2017.3.24  zwr 
currentApp.onPageInit('addresslist', function(e) { 
	initAddresslist(e);
});
// 常用联系人添加  2017.3.24 zwr  
currentApp.onPageInit('add_customer', function(data) {
	initadd_contact(data);
	add_customer_gender();
	add_customer_birth();
});
// 常用地址添加  2017.3.24 zwr  
currentApp.onPageInit('add_address', function(e) {
	initadd_address();
});
// 显示个人资料  2017.3.24 zwr 
currentApp.onPageInit('personal_data', function(e) {
	initpersonal_data();
	initloginout();
});
// 修改个人资料  2017.3.24 zwr 
currentApp.onPageInit('edit_personal_data', function(e) {
	initeditpersonal_data();
	edit_personal_data_gender();
	edit_personal_data_birth();
});
// 关于我们   2017.3.28 zwr
currentApp.onPageInit('aboutus', function(e) {
	initaboutus();
});
// 关于我们详情文章页   2017.3.29 zwr
currentApp.onPageInit('aboutus_info', function(page) {
	initaboutus_info(page);
});
currentApp.onPageInit('register', function(e) {
	initRegister();
});
currentApp.onPageInit('passwordset3', function(e) {
	initSendCode(plus);
});
currentApp.onPageInit('passwordset4', function(e) {
	initPassword4();
	initResetPassword(plus);
});
currentApp.onPageInit('about', function(e) {
	initAbout();
});
currentApp.onPageInit('question', function(e) {
	initQuestion();
});
currentApp.onPageInit('opinion', function(e) {
	initOpinion(e);
});
currentApp.onPageInit('mymateriel', function(e) {
	initMymateriel();
});
currentApp.onPageInit('platformdynamics', function(e) {
	initPlatform();
});
currentApp.onPageInit('cheats', function(e) {
	initCheats();
});
currentApp.onPageInit('cheatsDetails', function(e) {
	initCheatdetails(e);
});
currentApp.onPageInit('nicknamepage', function(e) {
	initNickname();
});
currentApp.onPageInit('truenamepage', function(e) {
	initTrueName();
});
currentApp.onPageInit('cardidpage', function(e) {
	initCardid();
});
currentApp.onPageInit('personadress', function(e) {
	initAddress();
});
currentApp.onPageInit('safety', function(e) {
	initSafety();
});
currentApp.onPageInit('distributor', function() {
	initDistributor();
});
currentApp.onPageInit('Newdrawals', function() {
	initNewdrawals();
});
currentApp.onPageInit('add-bank', function() {
	initAddbank();
});
currentApp.onPageInit('orderinfo', function(data) {
	initOrderinfo(data);
});
currentApp.onPageInit('addorderinfocomment', function(data) {
	initAddOrderComment(data);
});
currentApp.onPageInit('headerphoto', function(plus) {
	/*initHeaderphoto(plus);*/
});
currentApp.onPageInit('changemobile', function() {
	initSetMobile();
});
currentApp.onPageInit('changemobile2', function(page) {
	initChangeMobile(page);
});
currentApp.onPageInit('feedback', function() {
	initFeedback();
});
currentApp.onPageInit('review', function() {
	initReview();
});
currentApp.onPageInit('writeinfo', function(page) {
	initWriteinfo(page);
});
currentApp.onPageInit('writecode', function(page) {
	initWriteCode(page);
});
currentApp.onPageInit('addbank', function(page) {
	initWriteCode(page);
});
currentApp.onPageInit('sendmessagecode', function(page) {
	initAddBankInfo(page);
});
currentApp.onPageInit('withdrawals', function() {
	initWithdrawals();
	initWithdrawJudge();
});
currentApp.onPageInit('fans', function(e) {
	initFans();
});
currentApp.onPageInit('fansDetails', function(e) {
	initFansDetails(e);
});
currentApp.onPageInit('collection', function(e) {
	initMyCollections(e);
});
currentApp.onPageInit('detailed', function(e) {
	initMyBalanceDetail(e);
});
currentApp.onPageInit('managebank', function(e) {
    initManageBank(e);
});
currentApp.onPageInit('postal', function(e) {
    initManageBank(e);
});
currentApp.onPageInit('unbundling', function(e) {
	initUnBundingCard(e);
});
currentApp.onPageInit('successunbund',function(e){
	$$('.button-fill').click(function(){
		viewMain.router.back({
				url: 'bank/managebank.html',
				force: true
			});
	})
});
currentApp.onPageInit('postal',function(e){
	initCashWithdraw(e);
});
currentApp.onPageInit('setting', function(e) {
	viewMain.showNavbar();
	$$.common.thirdLoginInit && $$.common.thirdLoginInit();
	$$('#btnOutLogin').click(function() {
		if(isPlus) {
			$$.service.outLogin(function() {
				//返回主界面 
				plus.t_back();
				//跳转到登录页面
				$$.common.topWebViewJS(function() {
					currentApp.loginScreen();
				});
				//currentApp.mainView.router.back();
				//currentApp.mainView.refreshPage();
			});
		}else{
			$$.service.singout(function(){
				$$.common.topWebViewJS(function() {
					currentApp.loginScreen();
				});
			});
		}
	});
});
currentApp.onPageInit('account',function(){
	viewMain.showNavbar();
});

currentApp.onPageInit('personalinfo', function(e) {
	viewMain.showNavbar();
	initPersonal();
});
currentApp.onPageBack('personalinfo', function(e) {
	if($$(document.body).data('tabMian') == 'tab_my') {
		currentApp.showTab('#tab_my');
	}
	viewMain.hideNavbar();
})
currentApp.onPageInit('accountmanage', function(e) {
	initAccountmanageIndex();
});
currentApp.onPageInit('balancedetail', function(e) {
	initBalanceDetail();
	viewMain.showNavbar();
});

currentApp.onPageInit('message', function(e) {
	viewMain.showNavbar();
	initMsgDynamics();
});
currentApp.onPageInit('messageDetails', function(e) {
	initMsgDetails(e);
});
currentApp.onPageInit('commission', function(e) {
	viewMain.showNavbar();
	initCommission();

});
currentApp.onPageInit('balance', function(e) {
	viewMain.showNavbar();
	initMyBalance()
});
currentApp.onPageInit('drawalrecord', function(e) {
	viewMain.showNavbar();
	initdrawalRecord();
});
currentApp.onPageAfterAnimation('literature', function(e) {
	waterfall('water-main','water-box');
});
currentApp.onPageInit('literature', function(e) {
	initliterature();
});
currentApp.onPageBack('setting', function(e) {
	if($$(document.body).data('tabMian') == 'tab_my') {
		currentApp.showTab('#tab_my');
		viewMain.hideNavbar();
	} else if($$(document.body).data('tabMian') == 'tab_fenxiao') {
		currentApp.showTab('#tab_fenxiao');
		viewMain.showNavbar();
	}

});
currentApp.onPageBack('drawalrecord', function(e) {
	if($$(document.body).data('tabMian') == 'tab_my') {
		viewMain.hideNavbar();
	};
	if($$(".page").data("page") == "balance") {
		viewMain.showNavbar();
	};
});

currentApp.onPageBack('balancedetail', function(e) {
	if($$(document.body).data('tabMian') == 'tab_my') {
		currentApp.showTab('#tab_my');
		viewMain.hideNavbar();
	}

})
currentApp.onPageBack('balance', function(e) {
	if($$(document.body).data('tabMian') == 'tab_my') {
		currentApp.showTab('#tab_my');
		viewMain.hideNavbar();
	}
})
currentApp.onPageBack('message', function(e) {
	if($$(document.body).data('tabMian') == 'tab_my') {
		currentApp.showTab('#tab_my');
		viewMain.hideNavbar();
	} else if($$(document.body).data('tabMian') == 'tab_fenxiao') {
		currentApp.showTab('#tab_fenxiao');
		viewMain.showNavbar();
	}

})
currentApp.onPageBack('commission', function(e) {
		if($$(document.body).data('tabMian') == 'tab_my') {
			viewMain.hideNavbar();
		} else if($$(document.body).data('tabMian') == 'tab_fenxiao') {
			currentApp.showTab('#tab_fenxiao');
			viewMain.showNavbar();
		};
		if($$(".page").data("page") == "balance") {
			viewMain.showNavbar();
		};
	})
	/**
	 * 订单首页
	 */
currentApp.onPageInit('order-index', function(e) {
	initOrderIndex(e);
});
currentApp.onPageInit('order-search', function(e) {
	initOrderSearch();
});

currentApp.onPageInit('nextgroup', function(page) {
	initshowgrouplist(page);
});





//currentApp.template7Data = {
//	'page:order-index': {
//		all: '全部'
//	}
//}
currentApp.init();

initGlobal();

function initGlobal() {
	if(isPlus) {
		currentApp.loginUser = $$.localStorage.getloginUser();
		//检查是否登录
		if(!$$.common.isLogin()) {
			//跳转到登录页面 
			currentApp.loginScreen();
		}
	} else {
		currentApp.loginUser = $$.localStorage.getloginUser();
		//检查是否登录
		if($$.common.isLogin()) {
			$$.service.checklogin(
				function() {
					initIndex();
				},
				function() {
					initIndex();
					//跳转到登录页面 
					/*currentApp.loginScreen();
					$$(".other-login").attr('style', 'display:none');*/
				}
			);
		} else {
			initIndex();
		}
	}
	document.addEventListener('plusready', function() {
		try {
			if(mui)
				mui.init({
					//					swipeBack: true, //启用右滑关闭功能
					//					keyEventBind: {
					//						backbutton: false //关闭back按键监听
					//					}
				});
		} catch(e) {}
		window.Framework7.prototype.device.webView = plus.webview.currentWebview();

		// 在Android5以上设备，如果默认没有开启硬件加速，则强制设置开启
		if(!plus.webview.defaultHardwareAccelerated() && parseInt(plus.os.version) >= 5) {
			styles.hardwareAccelerated = true;
		}
		plus.navigator && plus.navigator.closeSplashscreen();
		// 获取本地应用资源版本号
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			if(plus.runtime.appid != 'HBuilder')
				plus.t_checkUpdate(inf.version);
		});

		//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。"
		plus.key.addEventListener("backbutton", onback);
		plus.key.addEventListener("menubutton", onmenu);

		$$('#tab_zw').on('show', function() {});
		// 显示自动消失的提示消息
		//plus.nativeUI.toast( "I'am toast information!");  
		$$('#tab_fenxiao').on('show', function() {});
		$$('#tab_my').on('show', function() {});
		$$(document).on('ajaxStart', function(e) {
			//plus.nativeUI.showWaiting('正在加载...');
			//currentApp.t_showPreloader();
		});
		$$(document).on('ajaxComplete', function(e) {
			//plus.nativeUI.closeWaiting();
			//currentApp.t_hidePreloader();
		});
		var ws = window.plus.webview.currentWebview();
		var scrennHeight = plus.screen.resolutionHeight; // % 10 == 0 ? plus.screen.resolutionHeight : (plus.screen.resolutionHeight - plus.screen.resolutionHeight % 10);
		if(!window.statusBar.height) {
			window.statusBar.height = 20;
		}
		console.log(document.body.clientHeight);
		console.log(scrennHeight);
		//代码暂时不要删掉
		if(window.isImmersive) {
			console.log(scrennHeight);
			//			$$(document.body).css('height', scrennHeight + 'px');
			$$('.view-main').css('height', (scrennHeight - window.statusBar.height) + 'px');
			//			ws.setStyle({
			//				height: plus.screen.resolutionHeight,
			//			});
		} else {
			//			$$(document.body).css('height', (scrennHeight - window.statusBar.height) + 'px');
			$$('.view-main').css('height', document.body.clientHeight + 'px');
			//			ws.setStyle({
			//				dock: 'top',
			//				render: 'always',
			//				height: plus.screen.resolutionHeight - window.statusBar.height,
			//				softinputMode: 'adjustResize'
			//			});
		}
		//注销掉mui推出事件
		try {
			if(mui) {
				mui.back = function() {};
			}
		} catch(e) {}

		document.addEventListener("netchange", function() {
			alert(plus.networkinfo);
			var network = plus.networkinfo.getCurrentType();
			if(network < 2) {
				if(this.network > 1) {
					plus.nativeUI.toast('您的网络已断开', undefined, '期待乐');
				}
			}

			if(this.network == 3 && network < 3) {
				plus.nativeUI.toast('您网络已从wifi切换到蜂窝网络，浏览会产生流量', undefined, '期待乐', '我知道了');
			}

			this.network = network;
		});
	});

	//键盘呼出影藏工具栏
	window.addEventListener('resize', function() {
		console.log(document.body.clientHeight);
		if(document.body.clientHeight <= 400) {

		} else {

		}
	}, false);
}

function onback() {
	return globalBack();
}

function onmenu() {
	currentApp.openPanel('left');
	return false;
}

function globalBack() {

	//	if($$('#tab_zw').hasClass('active')) {
	//		webview0744.back();
	//	} else {
	//		
	//	} 
	var isBack = plus.t_back();
	console.log(isBack);
	return isBack;
}
//银行卡输入验证
function formatBankNo(BankNo) {
	if(BankNo.value == "") return;
	var account = new String(BankNo.value);
	account = account.substring(0, 22); /*帐号的总数, 包括空格在内 */
	if(account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
		/* 对照格式 */
		if(account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
				".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
			var accountNumeric = accountChar = "",
				i;
			for(i = 0; i < account.length; i++) {
				accountChar = account.substr(i, 1);
				if(!isNaN(accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
			}
			account = "";
			for(i = 0; i < accountNumeric.length; i++) { /* 可将以下空格改为-,效果也不错 */
				if(i == 4) account = account + " "; /* 帐号第四位数后加空格 */
				if(i == 8) account = account + " "; /* 帐号第八位数后加空格 */
				if(i == 12) account = account + " "; /* 帐号第十二位后数后加空格 */
				account = account + accountNumeric.substr(i, 1)
			}
		}
	} else {
		account = " " + account.substring(1, 5) + " " + account.substring(6, 10) + " " + account.substring(14, 18) + "-" + account.substring(18, 25);
	}
	if(account != BankNo.value) BankNo.value = account;
}
//验证银行卡号是否正确
function luhmCheck(bankno) {
	bankno = bankno.replace(/\s+/g, "");
	if(bankno.length < 16 || bankno.length > 19) {
		alert("银行卡号长度必须在16到19之间", "错误提示");
		return false;
	}
	var num = /^\d*$/; //全数字
	if(!num.exec(bankno)) {
		alert("银行卡号必须全为数字", "错误提示");
		return false;
	}
	//开头6位
	var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
	if(strBin.indexOf(bankno.substring(0, 2)) == -1) {
		alert("银行卡号开头6位不符合规范", "错误提示");
		return false;
	}
	var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhm进行比较）
	var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
	var newArr = new Array();
	for(var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
		newArr.push(first15Num.substr(i, 1));
	}
	var arrJiShu = new Array(); //奇数位*2的积 <9
	var arrJiShu2 = new Array(); //奇数位*2的积 >9
	var arrOuShu = new Array(); //偶数位数组
	for(var j = 0; j < newArr.length; j++) {
		if((j + 1) % 2 == 1) { //奇数位
			if(parseInt(newArr[j]) * 2 < 9)
				arrJiShu.push(parseInt(newArr[j]) * 2);
			else
				arrJiShu2.push(parseInt(newArr[j]) * 2);
		} else //偶数位
			arrOuShu.push(newArr[j]);
	}
	var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
	var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
	for(var h = 0; h < arrJiShu2.length; h++) {
		jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
		jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
	}
	var sumJiShu = 0; //奇数位*2 < 9 的数组之和
	var sumOuShu = 0; //偶数位数组之和
	var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
	var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
	var sumTotal = 0;
	for(var m = 0; m < arrJiShu.length; m++) {
		sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
	}
	for(var n = 0; n < arrOuShu.length; n++) {
		sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
	}
	for(var p = 0; p < jishu_child1.length; p++) {
		sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
		sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
	}
	//计算总和
	sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
	//计算Luhm值
	var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
	var luhm = 10 - k;
	if(lastNum == luhm) {
		if(plus && plus.nativeUI)
			plus.nativeUI.toast('验证通过');
		return true;
	} else {
		if(plus && plus.nativeUI)
			plus.nativeUI.toast('银行卡号校验失败');
		return false;
	}
}
//验证身份证号码是否正确
function IdentityCodeValid(code) {
	var city = {
		11: "北京",
		12: "天津",
		13: "河北",
		14: "山西",
		15: "内蒙古",
		21: "辽宁",
		22: "吉林",
		23: "黑龙江 ",
		31: "上海",
		32: "江苏",
		33: "浙江",
		34: "安徽",
		35: "福建",
		36: "江西",
		37: "山东",
		41: "河南",
		42: "湖北 ",
		43: "湖南",
		44: "广东",
		45: "广西",
		46: "海南",
		50: "重庆",
		51: "四川",
		52: "贵州",
		53: "云南",
		54: "西藏 ",
		61: "陕西",
		62: "甘肃",
		63: "青海",
		64: "宁夏",
		65: "新疆",
		71: "台湾",
		81: "香港",
		82: "澳门",
		91: "国外 "
	};
	var tip = "";
	var pass = true;

	if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
		tip = "身份证号格式错误";
		pass = false;
	} else if(!city[code.substr(0, 2)]) {
		tip = "地址编码错误";
		pass = false;
	} else {
		//18位身份证需要验证最后一位校验位
		if(code.length == 18) {
			code = code.split('');
			//∑(ai×Wi)(mod 11)
			//加权因子
			var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
			//校验位
			var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
			var sum = 0;
			var ai = 0;
			var wi = 0;
			for(var i = 0; i < 17; i++) {
				ai = code[i];
				wi = factor[i];
				sum += ai * wi;
			}
			var last = parity[sum % 11];
			if(parity[sum % 11] != code[17]) {
				tip = "校验位错误";
				pass = false;
			}
		}
	}
	/*if(!pass) alert(tip);*/
	return pass;
}

function initQRcode() {
	$$('.rename').click(function() {
		var that = this;
		var value = $$(this).parents('li').find(".remark-text").text();
		currentApp.modal({
			title: "<div class='rebz'>" + '修改二维码备注' + '</div>',
			text: '<div class="groupbz"><span>分组备注 </span>' + '<input type="text" name="renameText" value=' + value + '>' + '</div>',
			buttons: [{
				text: "<div class='sure'>" + '确定' + '</div>',
				onClick: function() {
					var groupNum;
					var remarkText = $$("input[name=renameText]").val();
					groupNum = parseInt($$(that).parents('li').find('.numfz-bh').text());
					$$.service.modifyremark(remarkText, groupNum, function(data) {
						currentApp.mainView.refreshPage();
					});
				}
			}, {
				text: "<div class='reno'>" + '取消' + '</div>',
				onClick: function() {}
			}, ]

		});
	});
}
