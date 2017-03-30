if((!(window.plus)) || (window.plus && (!window.plus.isReady))) window.plus = navigator.plus = {
	isReady: true
};

(function(plus) {
	var tools = plus.tools = {
		__UUID__: 0,
		UNKNOWN: -1,
		IOS: 0,
		ANDROID: 1,
		platform: -1,
		debug: false,
		UUID: function(obj) {
			return obj + (this.__UUID__++) + new Date().valueOf();
		},
		extend: function(destination, source) {
			for(var property in source) {
				destination[property] = source[property];
			}
		},
		typeName: function(val) {
			return Object.prototype.toString.call(val).slice(8, -1);
		},
		isDate: function(d) {
			return tools.typeName(d) == 'Date';
		},
		isArray: function(a) {
			return tools.typeName(a) == 'Array';
		},
		isDebug: function() {
			return plus.tools.debug;
		},
		stringify: function(args) {
			if(window.JSON3) {
				return window.JSON3.stringify(args);
			}
			return JSON.stringify(args);
		},
		isNumber: function(a) {
			return(typeof a === 'number') || (a instanceof Number);
		},
		execJSfile: function(path) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = path;

			function insertScript(s) {
				var h = document.head,
					b = document.body;
				if(h) {
					h.insertBefore(s, h.firstChild);
				} else if(b) {
					b.insertBefore(s, b.firstChild);
				} else {
					setTimeout(function() {
						insertScript(s);
					}, 100);
				}
			};
			insertScript(script);
		},
		copyObjProp2Obj: function(wb, param, excludeProperties) {
			var exclude = excludeProperties instanceof Array ? true : false;
			for(var p in param) {
				var copy = true;
				if(exclude) {
					for(var i = 0; i < excludeProperties.length; i++) {
						if(p == excludeProperties[i]) {
							copy = false;
							break;
						}
					}
				}
				if(copy) {
					wb[p] = param[p];
				} else {
					copy = true;
				}
			}
		},
		clone: function(obj) {
			if(!obj || typeof obj == 'function' || tools.isDate(obj) || typeof obj != 'object') {
				return obj;
			}

			var retVal, i;

			if(tools.isArray(obj)) {
				retVal = [];
				for(i = 0; i < obj.length; ++i) {
					retVal.push(tools.clone(obj[i]));
				}
				return retVal;
			}
			retVal = {};
			for(i in obj) {
				if(!(i in retVal) || retVal[i] != obj[i]) {
					retVal[i] = tools.clone(obj[i]);
				}
			}
			return retVal;
		}
	};
	tools.debug = (window.__nativeparamer__ && window.__nativeparamer__.debug) ? true : false;
	tools.platform = window._____platform_____;

})(window.plus);

(function(plus) {
	function createExecIframe() {
		function insertScript(s) {
			var b = document.body;
			if(b) {
				if(!s.parentNode) {
					b.appendChild(s);
				}
			} else {
				setTimeout(function() {
					insertScript(s);
				}, 100);
			}
		};

		var iframe = document.createElement("iframe");
		iframe.id = "exebridge";
		iframe.style.display = 'none';
		// document.body.appendChild(iframe);
		insertScript(iframe);
		return iframe;
	}
	var T = plus.tools,
		B = plus.bridge = {
			NO_RESULT: 0,
			OK: 1,
			CLASS_NOT_FOUND_EXCEPTION: 2,
			ILLEGAL_ACCESS_EXCEPTION: 3,
			INSTANTIATION_EXCEPTION: 4,
			MALFORMED_URL_EXCEPTION: 5,
			IO_EXCEPTION: 6,
			INVALID_ACTION: 7,
			JSON_EXCEPTION: 8,
			ERROR: 9,
			callbacks: {},
			commandQueue: [],
			commandQueueFlushing: false,
			synExecXhr: new XMLHttpRequest(),
			execIframe: null,
			nativecomm: function() {
				var json = '[' + B.commandQueue.join(',') + ']';
				B.commandQueue.length = 0;
				return json
			},
			execImg: null,
			createImg: function() {
				function insertScript(s) {
					var b = document.body;
					console.log('11111111111111111110' + b);
					if(b) {
						b.appendChild(s);
					} else {
						setTimeout(function() {
							insertScript(s);
						}, 100);
					}
				};

				var img = document.createElement("img");
				img.id = "exebridge";
				img.style.display = 'none';
				insertScript(img);
				return img;
			},
			exec: function(service, action, args, callbackid) {
				if(T.IOS == T.platform) {
					B.commandQueue.push(T.stringify([window.__HtMl_Id__, service, action, callbackid || null, args]));
					if(B.execIframe && !B.execIframe.parentNode) {
						document.body.appendChild(B.execIframe);
					}
					if(B.commandQueue.length == 1 && !B.commandQueueFlushing) {
						B.execIframe = B.execIframe || createExecIframe();
						B.execIframe.src = "plus://command"
					}
				} else if(T.ANDROID == T.platform) {
					/*if(B.execImg && !B.execImg.parentNode){
						document.body.appendChild(B.execImg);
					}else{
						B.execImg = B.execImg || B.createImg();
						B.execImg.src = 'pdr:'+T.stringify([service,action,true,T.stringify(args)]);
					}*/

					//window.prompt(T.stringify(args), 'pdr:' + T.stringify([service, action, true]))
				}
			},
			execSync: function(service, action, args, fn) {
				if(T.IOS == T.platform) {
					var json = T.stringify([
							[window.__HtMl_Id__, service, action, null, args]
						]),
						sync = B.synExecXhr;
					sync.open('post', "http://localhost:13131/cmds", false);
					sync.setRequestHeader("Content-Type", 'multipart/form-data');
					//sync.setRequestHeader( "Content-Length", json.length );
					sync.send(json);
					if(fn) {
						return fn(sync.responseText);
					}
					return window.eval(sync.responseText);
				} else if(T.ANDROID == T.platform) {
					//					var ret = window.prompt(T.stringify(args), 'pdr:' + T.stringify([service, action, false]));
					//					if(fn) {
					//						return fn(ret);
					//					}
					//					return eval(ret);
				}
			},
			callbackFromNative: function(callbackId, playload) {
				var fun = B.callbacks[callbackId];
				if(fun) {
					if(playload.status == B.OK && fun.success) {
						if(fun.success) fun.success(playload.message)
					} else {
						if(fun.fail) fun.fail(playload.message)
					}
					if(!playload.keepCallback) {
						delete B.callbacks[callbackId]
					}
				}
			},
			callbackId: function(successCallback, failCallback) {
				var callbackId = T.UUID('plus');
				B.callbacks[callbackId] = {
					success: successCallback,
					fail: failCallback
				};
				return callbackId;
			}
		}

})(window.plus);
plus.obj = plus.obj || {};
plus.obj.Callback = (function() {
	function Callback() {
		var __me__ = this;
		__me__.__callbacks__ = {};

		__me__.__callback_id__ = plus.bridge.callbackId(function(args) {
			var _evt = args.evt,
				_args = args.args,
				_arr = __me__.__callbacks__[_evt];
			if(_arr) {
				var len = _arr.length,
					i = 0;
				for(; i < len; i++) {
					__me__.onCallback(_arr[i], _evt, _args)
				}
			}
		})
	}

	function onCallback(fun, evt, args) {
		//抛异常
		throw "Please override the function of 'Callback.onCallback'"
	}

	Callback.prototype.addEventListener = function(evtType, fun, capture) {
		var notice = false,
			that = this;
		if(fun) {
			if(!that.__callbacks__[evtType]) {
				that.__callbacks__[evtType] = [];
				notice = true
			}
			that.__callbacks__[evtType].push(fun)
		}
		return notice
	}

	Callback.prototype.removeEventListener = function(evtType, fun) {
		var notice = false,
			that = this;
		if(that.__callbacks__[evtType]) {
			that.__callbacks__[evtType].pop(fun);
			notice = (that.__callbacks__[evtType].length === 0);
			if(notice) that.__callbacks__[evtType] = null
		}
		return notice
	}
	return Callback;
})();

(function($) {
	$.bytesToSize = function(bytes) {
		if(bytes === 0) return '0 B';
		var k = 1000, // or 1024
			sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
			i = Math.floor(Math.log(bytes) / Math.log(k));

		return(bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
	}

	$.fn.selectUpdateIcon = function() {
		$(this).on('change', function() {
			var _options = $$(this).find("option");
			var currentOption = null;
			for(var i = 0; i < _options.length; i++) {
				if($(_options[i]).attr('value') == $$(this).val()) {
					currentOption = _options[i];
				}
			}
			if(currentOption) {
				$($(this).parent()).find('.item-content .item-media .icon').attr('class', $(currentOption).attr('data-option-icon'));
			}

		});
	}

})(Dom7);

(function(plus) {
	try {
		if(mui == undefined) window.mui = null;
	} catch(e) {}
	if(/Android [\d+|\.]{0,10}/.exec(navigator.userAgent)) {
		var os_version = (/Android [\d+|\.]{0,10}/.exec(navigator.userAgent).toString().replace(/Android/g, ''));
		if(os_version) {
			plus.os = {};
			plus.os.name = 'Android';
		}
	}

	//alert(window.Notification);
	//扩展通知栏
	plus.notification = {
		"setProgress": function(incr) {
			return plus.bridge.exec("notification", "setProgress", [incr]);
		},
		"setNotification": function(contentTitle, ticker) {
			return plus.bridge.exec("notification", "setProgressNotification", [contentTitle, ticker]);
		},
		"compProgressNotification": function(contentTitle) {
			return plus.bridge.exec("notification", "compProgressNotification", [contentTitle]);
		}
	};
	// 检测更新
	var checkUrl = "http://www.0744.cn/plugins/fx_phone/api/update/check";
	// 下载wgt文件
	//var wgtUrl = "http://m.0744.cn/plugins/fx_phone/api/update/H5CB0E96A.wgt";

	var t_checkUpdate_runing = false;
	plus.t_checkUpdate = function(wgtVer, options) {
		if(t_checkUpdate_runing) {
			plus.nativeUI.toast('请不要重复操作，正在检查更新');
			return;
		}
		t_checkUpdate_runing = true;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			switch(xhr.readyState) {
				case 4:
					if(xhr.status == 200) {
						t_checkUpdate_runing = false;
						var verdata = eval('(' + xhr.responseText + ')');

						if(verdata.status && verdata.data) {
							verdata = eval('(' + verdata.data + ')');
						}
						if(verdata && verdata.ver_info) {
							//服务器最新版本
							newVer = verdata.ver_info.version;
							//app应用基座版本
							baseVer = plus.runtime.version;
							//alert(baseVer);
							//alert(wgtVer);
							if(wgtVer && newVer && (parseInt(wgtVer.replace(/\.|bata/g, '')) < parseInt(newVer.replace(/\.|bata/g, '')))) {
								/**
								 * 更新提示
								 * @param {Object} title
								 * @param {Object} text
								 * @param {Object} buttons
								 * @param {Object} version_data
								 */
								var updateTip = function(title, text, buttons, version_data) {
										currentApp.modal({
											title: title,
											text: version_data.ver_info.version_info + '<br/>' + '<span style="color:#999;font-size:12px;">[' + $$.bytesToSize(verdata.ver_info.file_size_bytes) + ']</span>',
											buttons: buttons
										})
									}
									/**
									 * 点击更新按钮  
									 */
								var clickBtnUpdate = function() {
										if(verdata.ver_info.upgrade_type == 1) {
											plus.t_downinstallRes(verdata.ver_info.app_file, verdata.ver_info.file_size_bytes); // 下载升级包
										} else if(verdata.ver_info.upgrade_type == 2) {
											plus.t_downinstallRes(verdata.ver_info.wgt_file, verdata.ver_info.file_size_bytes); // 下载资源升级包
										}
									}
									//是否强制更新
								var _buttons = verdata.ver_info.option == 1 ? [{
									text: (verdata.ver_info.upgrade_type == 1 ? "立即更新" : "秒速更新资源包"),
									bold: true,
									onClick: clickBtnUpdate
								}] : [{
									text: '稍后再说'
								}, {
									text: (verdata.ver_info.upgrade_type == 1 ? "立即更新" : "秒速更新资源包"),
									bold: true,
									onClick: clickBtnUpdate
								}];
								updateTip((verdata.ver_info.ver_title ? verdata.ver_info.ver_title : '发现新版本 ' + newVer), verdata.ver_info.version_info, _buttons, verdata);

							} else {
								if(options && options.tips) {
									plus.nativeUI.toast('已经是最新版本了！');
								}
							}
						}
					} else {
						plus.nativeUI.alert("检测更新失败！");
						t_checkUpdate_runing = false;
					}
					break;
				default:
					t_checkUpdate_runing = false;
					break;
			}
		}
		xhr.open('GET', checkUrl + "?basever=" + wgtVer + "&resver=" + plus.runtime.version + "&_=" + Math.random());
		xhr.send();
	}

	plus.t_downinstallRes = function(wgtUrl, size_bytes) {
		currentApp.showPreloader('正在下载更新文件...');
		//		dtask=plus.downloader.createDownload(wgtUrl, {
		//			filename: "_doc/update/"
		//		}, function(d, status) {
		////			if(status == 200) {
		////				plus.t_installWgt(d.filename); // 安装wgt包
		////			} else {
		////				plus.nativeUI.alert("下载失败！");
		////			}
		////			currentApp.hidePreloader();
		//		}).start();
		var options = {
			method: "GET"
		};
		dtask = plus.downloader.createDownload(wgtUrl, options);
		dtask.addEventListener("statechanged", function(task, status) {
			//alert(task.state);
			switch(task.state) {
				case 1: // 开始

					break;
				case 2: //已连接到服务器

					break;
				case 3: // 已接收到数据 
					$$('.modal-preloader .modal-title').html('正在下载更新文件...<br/>' + '<span style="color:#999;font-size:12px;">[' + $$.bytesToSize(task.downloadedSize) + '/' + $$.bytesToSize(size_bytes) + ']</span>');
					break;
				case 4: // 下载完成         
					currentApp.hidePreloader();
					if(task.filename.indexOf('.apk') > 0) {
						plus.runtime.install(plus.io.convertLocalFileSystemURL(task.filename), //安装APP
							{
								force: true
							},
							function() {

							},
							function() {
								plus.nativeUI.toast('安装失败');
							});
					} else if(task.filename.indexOf('.wgt') > 0) {
						plus.t_installWgt(task.filename);
					}

					break;
			}
		});
		dtask.start();
	}

	plus.t_downApp = function(appUrl) {
		currentApp.showPreloader('正在下载更新文件...');
		dtask = plus.downloader.createDownload(appUrl, {}, function(d, status) {}).start();

	}

	// 更新应用资源
	plus.t_installWgt = function(path) {
		currentApp.showPreloader('正在应用资源文件...');
		plus.runtime.install(path, {}, function() {
			currentApp.hidePreloader();
			plus.nativeUI.toast("资源更新完成");
			//currentApp.alert('', '资源更新完成', function() {
			plus.io.resolveLocalFileSystemURL("_doc/update", function(entry) {
				entry.removeRecursively(function(a) {}, function(e1) {});
			}, function(e) {
				console.log(e);
			});
			plus.runtime.restart();
			//});
		}, function(e) {
			currentApp.hidePreloader();
			plus.nativeUI.toast("更新资源文件失败[" + e.code + "]：" + e.message);
		});
	}

	plus.t_init = function(container) {
		if(!isPlus) return;
		$$(container).find('.new-webview').each(function(index, obj) {
			if(window.os_version && parseFloat(window.os_version) > 4.2 && window.os_version && parseFloat(window.os_version) < 5) {
				$$(this).addClass('no-animation');
			} else {
				if(window.mui) {
					var _href = $$(this).attr('href');
					$$(this).click(function() {
						plus.t_openNewPage({
							url: _href
						});
					});
					$$(this).attr('_href', _href);
					$$(this).attr('href', 'javascript:void(0);');
				}
			}
		});
	}

	plus.KEY_BACK_FIRST = null;
	plus.t_back = function() {
		for(var i = 0; i < currentApp.mainView.history.length; i++) {
			console.log(currentApp.mainView.history[i]);
		}
		if($$('.modal').hasClass('modal-in')) {
			if($$('.modal.modal-in .modal-button').length == 1 && ($$('.modal.modal-in .modal-buttons').html().indexOf('更新') > 0)) {
				plus.nativeUI.toast('请在更新后进行操作');
				return false;
			}
		}
		if($$('.popup-scanning').hasClass('modal-in') || $$('.smart-select-popup').hasClass('modal-in') || $$('.modal').hasClass('modal-in')) {
			currentApp.closeModal();
			return false;
		}
		if(window.plus && window.plus.webview) {
			var wvs = window.plus.webview.all();
			for(var i = 0; i < wvs.length; i++) {
				if(wvs[i].id == 'viewScanCode') {
					window.plus.webview.close(wvs[i]);
					return false;
				}
			}
		}
		if(window.plus && window.plus.webview && window.plus.webview.currentWebview().id == plus.runtime.appid) {
			if(currentApp.mainView.activePage.name == "index") {
				//首次按键，提示‘再按一次退出应用’
				if(!plus.KEY_BACK_FIRST) {
					plus.KEY_BACK_FIRST = new Date().getTime();
					plus.nativeUI.toast('再按一次退出应用');
					setTimeout(function() {
						plus.KEY_BACK_FIRST = null;
					}, 1500);
				} else {
					if(new Date().getTime() - plus.KEY_BACK_FIRST < 1500) {
						plus.runtime.quit();
					}
				}
				return false;
			} else if(currentApp.mainView.activePage.name == "login") {
				return false;
			} else if(currentApp.mainView.history.length != 1) {
				currentApp.mainView && currentApp.mainView.back();
				return false;
			}
		} else if(currentApp.mainView.history.length == 1) {
			plus.webview.currentWebview().close();
			return false;
		} else if(currentApp.mainView.history.length != 1) {
			currentApp.mainView && currentApp.mainView.back();
			return false;
		}
	}

	plus.t_openNewPage = function(options) {
		if(!window.mui) return;
		var _aniShow = 'slide-in-right';
		if(window.os_version && parseFloat(window.os_version) < 5) {
			_aniShow = 'pop-in';
		}
		window.mui.openWindow({
			url: options.url,
			id: options.id,
			styles: {
				//			top: newpage - top - position, //新页面顶部位置
				//			bottom: newage - bottom - position, //新页面底部位置
				//			width: newpage - width, //新页面宽度，默认为100%
				//height: 500, //新页面高度，默认为100%
				//			......
			},
			extras: {
				//			..... //自定义扩展参数，可以用来处理页面间传值
			},
			createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				aniShow: _aniShow, //页面显示动画，默认为”slide-in-right“；
				duration: 200 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			},
			//			hide:{
			//				aniClose: 'slide-out-left', //页面显示动画，默认为”slide-in-right“；
			//			},
			waiting: {
				autoShow: false, //自动显示等待框，默认为true
				title: '正在加载...', //等待对话框上显示的提示内容
				options: {
					//      width:waiting-dialog-widht,//等待框背景区域宽度，默认根据内容自动计算合适宽度
					//      height:waiting-dialog-height,//等待框背景区域高度，默认根据内容自动计算合适高度
					//      ......
				}
			}
		})

	}

})(window.plus);

(function($) {
	//系统相关配置
	config = {
			// urlData:'http://service2.com/api/',
		    /*urlData: 'http://www.0744.cn/plugins/fx_phone/api/',*/
		    // urlData: 'http://www.0744.cn/plugins/fx_phone/api/',
			urlData: 'http://pandaTrip.com/api/',
			/*urlData:'http://www.xmlx.com/api/',*/
			apiUrl: {
				//登录接口地址.
				login: 'auth/login',  //登录
				sendMessage: 'auth/sendMessage', //发送短信
				forgotPassword: 'auth/forgotPassword',//忘记密码
				updatePassword: 'auth/update',
				veifyPhone: 'auth/phoneVeify',
				register: 'auth/register',  //APP用户注册
				getuser: 'users/get_my_index_data',
				orderList: 'order/getUserOrderList',
				orderInfo: 'order/getOrderInfo',
				addOrderComment: 'order/addOrderComment',
				getUserComment: 'order/getUserOrderComment',
				appOrderCancel: 'order/appOrderCancel',
				getmember: 'users/get_mysubmember',
				getprogressList: 'address/list',
				getbankcardinfo: 'pub/apply_metch',
				applyinfo: 'users/apply_info',
				applysave: 'users/apply_save',
				getmemberinfo: 'users/get_memberinfo',
				addbankcard: 'bank/create',
				bankCode: 'bank/send',
				bankCardType: 'bank/pay_type',
				thirdlogin: 'pub/thirdlogin',
				getthirdinfo: 'users/get_thirdinfo',
				resetpassword: 'users/reset_password',//重置密码
				sendmsgcode: 'pub/send_msg_code', 
				userBind: 'users/userbind',
				getphoneneedcode: 'pub/get_phone_need_code',
				getthird: 'users/get_thirdinfo',
				Unbundling: 'users/userunbind',
				sendcode: 'users/send_msg_code',
				checkcode: 'users/check_msg_code',
				sendnum: 'users/msg_sendnum',
				changemobile: 'users/savemobile',
				getbalancedetail: 'users/balance_detail',
				getqrcsign: 'users/materiel_qrcsign',
				modifynickname: 'users/modify_nickname',
				modifytruename: 'users/modify_truename',
				addcardid: 'users/add_cardid',
				modifyaddress: 'users/modify_address',
				drawalrecord: 'users/get_withdraw',
				modifyremark: 'users/edit_remark',
				modifysex: 'users/modify_sex',
				defaultcard: 'users/default_bankcard',
//				platformdynamics: 'pub/platform_dynamics',
				headportrait: 'users/head_portrait',
				msgdynamics: 'users/msg_dynamics',
				message: 'userfeedback/create',
				imprint: 'pub/aboutapp',
				get_my_qrcode: 'users/get_my_qrcode',
				myapplication: 'users/myapplication',
				getdistribution: 'pub/get_distribution',
				grouplist: 'users/grouplist',
				getmyfans: 'users/get_myfans',
				qrcodesetting: 'users/ajax_qrcode_setting',
//				checklogin: 'pub/checklogin',
				materialconduct: 'users/material_conduct',
				myfansorder: 'users/myfans_order',
				singout: 'auth/singout',
				mycollect:'userinfo/list',
				contactlist:'contact/list',
				addresslist:'address/list',
				addcontact:'contact/creat',
				contactdel:'contact/del',
				addressdel:'address/del',
				question:'question/getQuestion',
				addaddress:"address/creat",
				about:      "about/list",
				about_info:'about/about_info',
				balancedetail:'bank/transactionDetails',
				addpaybaby:'bank/create_pay',
				userinfo:'userinfo/user',
				edit_personal_save:'userinfo/user_edit',
				unbundingcard:'bank/del',
				bankcardlist:'bank/list',
				cashwithdraw:'bank/withdrawal'
			}
		}
		//根据接口地址获取远程请求连接
	function getApiUrl(apiurl) {
		return config.urlData + apiurl;
	}

	//用户登录
	//user：用户名
	//pwd：密码
	$.service = {};
	$.localStorage = {};
	$.common = {};
	$.USER_SECRET = 'USER_SECRET';
	$.LOGIN_USER = 'LOGIN_USER';

	/**
	 * 登录接口
	 * @param {Object} user 用户名
	 * @param {Object} pwd  密码
	 * @param {Object} callback 成功回调方法
	 */
	$.service.login = function(user, pwd, callback) {
		$.common.post(
			getApiUrl(
				config.apiUrl.login
			),{	
				username: user,
				password: pwd 
			},
			function(data) {
				var data = eval('('+data+')');  
				if(data.status == 1) {
//					var srcret = JSON.parse(data.data);
					var calldata = eval('(' + data.data + ')');
//					alert(calldata.secret);
					$.localStorage.setUserSecret(calldata.secret);
					$.localStorage.setLoginUser(JSON.stringify(calldata.user));
					callback && callback(calldata.user);
				} else {
					currentApp.alert(data.message, '登录提示');
				}
			}
		);
	}
	/**
	 * 注册
	 * @param {Object} user 用户名
	 * @param {Object} pwd  密码
	 * @param {Object} phone 手机号
	 * @param {Object} sms_code  验证码
	 * @param {Object} callback 成功回调方法
	 */
	$.service.register = function(user, pwd, phone, sms_code, callback) {
		console.log(phone);
		$.common.post(
			getApiUrl(
				config.apiUrl.register
			),{	
				username: user,
				password: pwd, 
				phone: phone,
				sms_code: sms_code,
			},
			function(data) {
				console.log(data);
				data = eval('('+data+')');  
				if(data.status == 1) {
					$.localStorage.setUserSecret(data.id);
					$.localStorage.setLoginUser(data.username);
					callback && callback(data);
				} else {
					currentApp.alert(data.message, '注册提示');
				}
			}
		);
	}
	/**
	 * 重置密码
	 * @param {string} user_secret
	 * @param {string} password
	 * @param {Object} callback
	 */
	$.service.resetpassword = function(password, callback) {
		$.post(
			getApiUrl(config.apiUrl.resetpassword), {
				user_secret: encodeURI($.localStorage.getUserSecret()),
				password: password
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					var calldata = eval('(' + data.data + ')');
					$.localStorage.setUserSecret(calldata.secret);
					callback && callback(calldata);
				}
			}
		);
	}
	
	/**
	 * 忘记密码
	 * @param {string} =[]
	 * @param {string} new_pass
	 * @param {Object} callback
	 */
	$.service.forgotPassword = function(phone,sms_code,new_pass,type, callback) {
		if(type==1){
			$.post(
				getApiUrl(config.apiUrl.forgotPassword), {
					phone: phone,
					sms_code: sms_code
				},
				function(data) {
					data = eval('(' + data + ')');
					console.log(data);
					if(data.status == 1) {
//						var calldata = eval('(' + data.data + ')');
						console.log(data.data);
//						$.localStorage.setUserSecret(data.data);
						callback && callback(data.data);
					}else{
						currentApp.alert(data.message, '错误提示');
					}
				}
			);
		}else if(type==2){
			$.post(
				getApiUrl(config.apiUrl.forgotPassword), {
					phone: phone,
					new_password: new_pass
				},
				function(data) {
					data = eval('(' + data + ')');	
					if(data.status == 1) {
						callback && callback();
					}else{
						currentApp.alert(data.message, '错误提示');
					}
				}
			);
		}
	}
	
	/**
	 * 修改密码
	 * @param {string} =[]
	 * @param {string} new_pass
	 * @param {Object} callback
	 */
	$.service.updatePassword = function(password,new_pass, callback) {
		var userData = JSON.parse($.localStorage.getloginUser());
		$.post(
			getApiUrl(config.apiUrl.updatePassword), {
				uid:userData.uid,
				password: password,
				new_password: new_pass
			},
			function(data) {
				var data = eval('(' + data + ')');
				console.log(data);
				if(data.status == 1) {
					callback && callback();
				}else{
					currentApp.alert(data.message, '错误提示');
				}
			}
		);
	}
	
	/**
	 * 检测手机号是否存在
	 */
	$.service.phoneVeify = function(phone,sms_code, callback){
		var userData = JSON.parse($.localStorage.getloginUser());
		$.post(
			getApiUrl(config.apiUrl.veifyPhone), {
				uid:userData.uid,
				phone: phone,
				sms_code: sms_code
			},
			function(data) {
				var data = eval('(' + data + ')');
				console.log(data);
				if(data.status == 1) {
					callback && callback();
				}else{
					currentApp.alert(data.message, '错误提示');
				}
			}
		);
	}

	/**
	 * 检查是否登录
	 * @param {Object} callback
	 * @param {Object} failback
	 */
	$.service.checklogin = function(callback, failback) {
		$.common.post(
			getApiUrl(config.apiUrl.checklogin), {
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					var calldata = eval('(' + data.data + ')');
					$.localStorage.setUserSecret(calldata.secret);
					$.localStorage.setLoginUser(JSON.stringify(calldata.user));
					callback && callback();
				} else {
					failback && failback();
				}
			}
		);
	}
	/**
	 * 退出登录  
	 * @param {Object} callback
	 * time：2017.3.28   zwr
	 */
	$.service.singout = function(callback) {
		$.common.post(
			getApiUrl(config.apiUrl.singout), {

			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					$.localStorage.setUserSecret(null);
					$.localStorage.setLoginUser(null);
					$.common.thirdLogoutAll();
					callback && callback();
				}
			}
		);
	}

	/**
	 * 退出登录接口
	 * @param {Object} callback
	 */
	$.service.outLogin = function(callback) {
		$.localStorage.setUserSecret(null);
		$.localStorage.setLoginUser(null);
		// $.common.thirdLogoutAll();
		callback && callback();
	}	
	
	/**
	 * 首頁数据
	 * @param {Object} callback
	 */
	$.service.initindex = function(callback) {
		var userData = $.localStorage.getloginUser();
		callback && callback(userData);
	}
	/**
	 * 登录用户数据接口
	 * auther:zwr
	 * @param {Object} data 地址列表数据
	 * @param {Object} callback 成功回调方法
	 * time：        2017.03.27   
	 */
	$.service.userinfo = function(callback) {
		$.common.post(
			getApiUrl(
				config.apiUrl.userinfo
			),{user_secret: encodeURI($.localStorage.getUserSecret())},
			function(data) {
				data = eval('('+data+')');
				if(data.status == 1) {
					var calldata = data;
					callback && callback(calldata);
				} else {
					currentApp.alert(data.msg, '登录提示');
				}
			}
		);
	}
	$.service.edit_personal_save = function(data,callback) {
		$.common.post(
			getApiUrl(
				config.apiUrl.edit_personal_save
			),{user_secret: encodeURI($.localStorage.getUserSecret()),
				data:data},
			function(data) {
				data = eval('('+data+')');
				if(data.status == 1) {
					var calldata = data;
					callback && callback(calldata);
				} else {
					currentApp.alert(data.msg, '登录提示');
				}
			}
		);
	}
	

	/**
	 * 常用地址提交接口
	 * auther:zwr
	 * @param {Object} data 地址数据
	 * @param {Object} callback 成功回调方法
	 * time：       2017.03.24   
	 */
	$.service.addaddress = function(address, callback) {
		console.log(address);
		$.common.post(
			getApiUrl(
				config.apiUrl.addaddress
			),address,
			function(data) {
				data = eval('('+data+')');
				if(data.status == 1) {
					var calldata = data;
					callback && callback(calldata);
				} else {
					currentApp.alert(data.msg, '登录提示');
				}
			}
		);
	}
	/**
	 * 常用地址删除
	 * auther:zwr
	 * @param   callback 成功回调方法
	 * time：        2017.03.24   
	 */
	$.service.addressdel = function(id, callback) {
		console.log(id);
		$.common.post(
			getApiUrl(
				config.apiUrl.addressdel
			),{user_secret: encodeURI($.localStorage.getUserSecret()),
			   id:id,},
			function(data) {
				data = eval('('+data+')');
				if(data.status == 1) {
					var calldata = data;
					callback && callback(calldata);
				} else {
					currentApp.alert(data.msg, '操作提示');
				}
			}
		);
	}	
	/**
	 * 常用地址列表获取接口
	 * auther:zwr
	 * @param {Object} data 地址列表数据
	 * @param {Object} callback 成功回调方法
	 * time：        2017.03.24   
	 */
	$.service.addresslist = function(pageIndex, pageSize, callback) {
		$.common.post(
			getApiUrl(
				config.apiUrl.addresslist
			),{user_secret: encodeURI($.localStorage.getUserSecret()),
			   page:pageIndex,
			   limit:pageSize,},
			function(data) {
				data = eval('('+data+')');
				if(data.status == 1) {
					var calldata = data;
					callback && callback(calldata);
				} else {
					currentApp.alert(data.msg, '登录提示');
				}
			}
		);
	}	
	/**
	 * 常用联系人列表获取接口
	 * auther:zwr
	 * @param {Object} data 联系人数据
	 * @param {Object} callback 成功回调方法
	 * time：        2017.03.24   
	 */
	$.service.contactlist = function(pageIndex, pageSize, callback) {
		$.common.post(
			getApiUrl(
				config.apiUrl.contactlist
			),{user_secret: encodeURI($.localStorage.getUserSecret()),
			   page:pageIndex,
			   limit:pageSize,},
			function(data) {
				data = eval('('+data+')');
				if(data.status == 1) {
					var calldata = data;
					callback && callback(calldata);
				} else {
					currentApp.alert(data.msg, '登录提示');
				}
			}
		);
	}
	/**
	 * 常用联系人删除
	 * auther:zwr
	 * @param   callback 成功回调方法
	 * time：        2017.03.24   
	 */
	$.service.contactdel = function(id, callback) {
		$.common.post(
			getApiUrl(
				config.apiUrl.contactdel
			),{user_secret: encodeURI($.localStorage.getUserSecret()),
			   id:id,},
			function(data) {
				data = eval('('+data+')');
				if(data.status == 1) {
					var calldata = data;
					callback && callback(calldata);
				} else {
					currentApp.alert(data.msg, '操作提示');
				}
			}
		);
	}
	
	/**
	 * 常用联系人提交接口
	 * auther:zwr
	 * @param {Object} data 联系人数据
	 * @param {Object} callback 成功回调方法
	 * time：         2017.03.24
	 */
	$.service.addcontact = function(contact, callback) {
		$.common.post(
			getApiUrl(
				config.apiUrl.addcontact
			),contact,
			function(data) {
				data = eval('('+data+')');
				if(data.status == 1) {
					var calldata = data;
					callback && callback(calldata);
				} else {
					currentApp.alert(data.msg, '登录提示');
				}
			}
		);
	}		

	/**
	 * 关于我们
	 * auther:zwr
	 * time：        2017.03.24   
	 */
	$.service.about = function(callback) {
		$.common.post(
			getApiUrl(
				config.apiUrl.about
			),{user_secret: encodeURI($.localStorage.getUserSecret())},
			function(data) {
				data = eval('('+data+')');
				if(data.status == 1) {
					var calldata = data;
					callback && callback(calldata);
				} else {
					currentApp.alert(data.msg, '登录提示');
				}
			}
		);
	};
	/**
	 * 关于我们
	 * auther:zwr
	 * time：        2017.03.24   
	 */
	$.service.about_info = function(id,callback) {
		$.common.post(
			getApiUrl(
				config.apiUrl.about_info
			),{user_secret: encodeURI($.localStorage.getUserSecret()),
				id :id},
			function(data) {
				data = eval('('+data+')');
				if(data.status == 1) {
					var calldata = data;
					callback && callback(calldata);
				} else {
					currentApp.alert(data.msg, '登录提示');
				}
			}
		);
	};				



	/**
	 **获取我的首页数据接口
	 * @param {Object} callback 
	 */
	$.service.getuser = function(callback) {
		$.common.post(
			getApiUrl(config.apiUrl.getuser), {
				user_secret: encodeURI($.localStorage.getUserSecret())
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					data.data = eval('(' + data.data + ')');
					callback && callback(data.data);
				}
			}

		);
	}


	/**
	 * 第三方登录
	 * @param {string} user_secret
	 * @param {Object} callback
	 */
	$.service.thirdlogin = function(openid, thirdtype, callback) {
		$.post(
			getApiUrl(config.apiUrl.thirdlogin), {
				user_secret: encodeURI($.localStorage.getUserSecret()),
				openid: openid,
				opentype: thirdtype
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					var calldata = eval('(' + data.data + ')');
					$.localStorage.setUserSecret(calldata.secret);
					$.localStorage.setLoginUser(JSON.stringify(calldata.user));
					callback && callback(calldata);
				} else
					callback && callback(undefined);
			}
		);
	}

	/**
	 * 查询用户绑定了哪些社交账号
	 * @param {string} user_secret
	 * @param {Object} callback
	 */
	$.service.getthirdinfo = function(callback) {
		$.post(
			getApiUrl(config.apiUrl.getthirdinfo), {
				user_secret: encodeURI($.localStorage.getUserSecret())
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					data.data = eval('(' + data.data + ')');
					callback && callback(data.data);
				} else
					callback && callback(undefined);
			}
		);
	}

	/**
	 * 发送短信验证码
	 * @param {string} phone
	 * @param {Object} callback
	 */

	$.service.sendmsgcode = function(mark,phone, callback) {
		console.log(mark);
		console.log(phone);
		$.post(
			getApiUrl(config.apiUrl.sendMessage), {
				phone: phone,
				mark: mark
			},
			function(data) {
				console.log(data);
				data = eval('(' + data + ')');
				
				callback && callback();
				currentApp.alert(data.msg, '短信提示');
			}
		);
	}
	/**
	 * 问答
	 * @param {Object} page
	 * @param {Object} pagesize
	 * @param {Object} callback
	 */
	$.service.question=function(page,pagesize,callback){
		$.post(
			getApiUrl(config.apiUrl.question),{
				user_secret: encodeURI($.localStorage.getUserSecret()),
				page:page,
				pagesize:pagesize
			},function(data){
				data=eval('('+data+')');
				if(data.status==1){
					//data=eval('('+data+')');
					callback && callback(data);
				}
			}
		);
	}
	/**
	 * 手机发送短信验证码次数
	 * @param {string} phone
	 * @param {Object} callback
	 */

	$.service.getphoneneedcode = function(phone, callback) {
		$.post(
			getApiUrl(config.apiUrl.getphoneneedcode), {
				phone: phone
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					data.data = eval('(' + data.data + ')');
					callback && callback(data.data);
				}
			}
		);
	}

	/**
	 * APP获取我的分销商接口 
	 * @param {int} page
	 * @param {int} pagesize
	 * @param {int} level
	 * @param {string} user_secret
	 * @param {Object} callback
	 */

	$.service.getmember = function(page, pagesize, level, callback) {
		$.common.postData(getApiUrl(config.apiUrl.getmember), {
			user_secret: encodeURI($.localStorage.getUserSecret()),
			page: page,
			pageSize: pagesize,
			level: level
		}, function(data) {
			data = eval('(' + data + ')');
			if(data.status == 1) {
				data.data = eval('(' + data.data + ')');
				callback && callback(data.data);
			}
		});
	}

	/**
	 * 获取我的分销商提现的数据
	 * @param {string} user_secret
	 * @param {int} pagesize
	 * @param {Object} callback
	 */

	$.service.applyinfo = function(callback) {
			$.post(
				getApiUrl(config.apiUrl.applyinfo), {
					user_secret: encodeURI($.localStorage.getUserSecret())
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 设置默认银行卡
		 * @param {Object} cardid
		 * @param {Object} callback
		 */
	$.service.defaultcard = function(cardid, callback) {
			$.post(
				getApiUrl(config.apiUrl.defaultcard), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					id: cardid
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);

		}
		/**
		 * 分销商申请提现
		 * @param {string} user_secret 用户登录秘钥
		 * @param {float} withdrawamount 提现金额
		 * @param {int} cardno 卡号
		 * @param {Object} callback
		 */
	$.service.applysave = function(withdrawamount, cardno, callback) {
		$.post(
			getApiUrl(config.apiUrl.applysave), {
				user_secret: encodeURI($.localStorage.getUserSecret()),
				withdrawamount: withdrawamount,
				cardid: cardno
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					data.data = eval('(' + data.data + ')');
					callback && callback(data.data);
				}
			}
		);
	}
	/**
	 * 获取我的订单列表数据
	 * @param {string} keyName   搜索关键词
	 * @param {int}    type      订单类型
	 * @param {int}    pageIndex 当前第几页
	 * @param {int}    pageSize  页面数量到
	 */
	$.service.getOrderList = function(keyName, type, pageIndex, pageSize, callback) {
		$.common.postData(getApiUrl(config.apiUrl.orderList), {
			user_secret: encodeURI($.localStorage.getUserSecret()),
			status: type,
			pagesize: pageSize,
			page: pageIndex,
			keyword: keyName
		}, function(result) {
			var result = eval('(' + result + ')');
			if(result.status == 1) {
				/*if(typeof(result.list) == "string") {
					result.list = eval('(' + result.list + ')');
					callback && callback(result.list);
					return;
				}*/
				callback && callback(result);
			} else {
				callback && callback(result);
			}
		})
	}

	/**
	 * 获取用户订单详细
	 * @param  {[int]}    order_sn [订单编号]
	 * @param  {[int]}    type     [订单类型]
	 * @param  {Function} callback [回调函数]
	 */
	$.service.getorderInfo = function(order_sn, type, callback) {
		$.common.postData(getApiUrl(config.apiUrl.orderInfo), {
			// user_secret: encodeURI($.localStorage.getUserSecret()),
			order_sn: order_sn,
			order_type: type
		}, function(result) {
			var result = eval('(' + result + ')');
			if (result.status == 1) {
				callback && callback(result);
			}
		});
	}

	/**
	 * 添加用户订单评论
	 * @param {[int]} order_sn        [订单编号]
	 * @param {[int]} type            [订单类型]
	 * @param {[text]} content        [评论内容]
	 * @param {[int]} score           [评论星级]
	 * @param {[string]} image        [图片URL地址]
	 * @param {[function]} sucessback [成功回调]
	 * @param {[function]} failback   [失败回调]
	 */
	$.service.addOrderComment = function(order_sn, type, content, score, image, sucessback, failback) {
		$.common.postData(getApiUrl(config.apiUrl.addOrderComment), {
			user_secret: encodeURI($.localStorage.getUserSecret()),
			order_sn: order_sn,
			type: type,
			content: content,
			score: score,
			image: image
		}, function(data) {
			data = eval('(' + data + ')');
			if(data.status == 1) {
				sucessback && sucessback(data.message);
			} else {
				failback && failback(data.message);
			}
		});
	}

	/**
	 * 订单评论列表
	 * @param  {Boolean}  is_image [是否有图查询]
	 * @param  {Function} callback [执行完成回调函数]
	 * @return {[type]}            [description]
	 */
	$.service.getUserComment = function(is_image, page, pagesize, callback) {
		$.common.postData(getApiUrl(config.apiUrl.getUserComment), {
			user_secret: encodeURI($.localStorage.getUserSecret()),
			is_image: is_image,
			page: page,
			pagesize: pagesize
		}, function(data) {
			data = eval('(' + data + ')');
			callback && callback(data);
		});
	}

	/**
	 * 用户取消订单
	 * @param  {[int]}      order_sn   [订单编号]
	 * @param  {[function]} sucessback [成功回调]
	 * @param  {[function]} failback   [失败回调]
	 * @return {[json]}                [JSON]
	 */
	$.service.getappOrderCancel = function(order_sn, sucessback, failback) {
		$.common.postData(getApiUrl(config.apiUrl.appOrderCancel), {
			user_secret: encodeURI($.localStorage.getUserSecret()),
			order_sn : order_sn
		}, function(data) {
			data = eval('(' + data + ')');
			if(data.status == 1) {
				sucessback && sucessback(data.message);
			} else {
				failback && failback(data.message);
			}
		});
	}

	/**
	 * 获取平台佣金提现交易记录
	 * @param {int} page
	 * @param {int} pagesize
	 * @param {Object} callback
	 */

	$.service.getprogressList = function(page, pageSize, callback) {
			$.common.postData(getApiUrl(config.apiUrl.getprogressList), {
				user_secret: encodeURI($.localStorage.getUserSecret()),
				page: page,
				pageSize: pageSize
			}, function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					data.data = eval('(' + data.data + ')');
					callback && callback(data.data);
				}
			});
		}
		/**
		 * 获取银行卡号信息
		 * @param {string} card_no
		 * @param {Object} callback
		 */

	$.service.getbankcardinfo = function(card_no, callback) {
		$.post(
			getApiUrl(config.apiUrl.getbankcardinfo), {
				cardno: card_no
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					data.data = eval('(' + data.data + ')');
					callback && callback(data.data);
				}
			}
		);
	}

	/**
	 * 添加银行卡号
	 * @param {string} user_secret
	 * @param {string} truename
	 * @param {string} card_no
	 * @param {int} phone
	 * @param {Object} callback
	 */
	$.service.addbankcard = function(truename, personality, card_no, phone, identity_card, sucessback, failback) {
		$.post(
			getApiUrl(config.apiUrl.addbankcard), {
				// user_secret: encodeURI($.localStorage.getUserSecret()),
				bank_name: truename,
				personality: personality,
				card_id : card_no,
				mobile : phone,
				identity_card: identity_card
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					sucessback && sucessback(data);
				} else {
					failback && failback(data);
				}
			}
		);
	}

	/**
	 * 发送银行卡验证码
	 * @param {int} phone
	 * @param {object} callback
	 */
	$.service.getbankCode = function(phone, callback) {
		$.post(getApiUrl(config.apiUrl.bankCode), {
			mobile: phone
		}, function(data) {
			data = eval('(' + data + ')');
			if(data.status == 1) {
				data = eval('(' + data.data + ')');
				callback && callback(data);
			} else {
				callback && callback(data);
			}
		});
	}

	/**
	 * 判断银行卡类型
	 * @param  {[int ]}   card_id  [银行卡ID]
	 * @param  {Function} callback [回调函数]
	 * @return {[JSON]}            [返回数据]
	 */
	$.service.getbankCardType = function(card_id, callback) {
		$.common.postData(getApiUrl(config.apiUrl.bankCardType), {
			card_id: card_id
		}, function(data) {
			data = eval('(' + data + ')');
			callback && callback(data);
		});
	}

	/**
	 * 用户银行卡列表
	 */
	/*$.service.getbankLists = function(type, callback) {
		$.post(getApiUrl(config.apiUrl.bankLists), {
			pay_type: type
		}, function(data) {
			data = eval('(' + data + ')');
			if(data.status == 1) {
				data = eval('(' + data + ')');
				callback && callback(data);
			} else {
				callback && callback(data);
			}
		});
	}*/

	/**
	 * 
	 * @param {Object} from
	 * @param {Object} openid
	 * @param {Object} unionid 微信开放平台唯一标示，可不填写
	 * @param {Object} nickname
	 * @param {Object} callback
	 */
	$.service.userBind = function(from, openid, unionid, nickname, successback, failback) {
		$.post(
			getApiUrl(config.apiUrl.userBind), {
				user_secret: encodeURI($.localStorage.getUserSecret()),
				from: from,
				openid: openid,
				unionid: unionid,
				nickname: nickname
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					successback && successback(data);
				} else {
					failback && failback(data);
				}
			},
			function(data) {}
		);
	}

	/**
	 * 重新获取用户信息
	 * @param {string} user_secret
	 * @param {Object} callback
	 */

	$.service.getmemberinfo = function(callback) {
			$.post(
				getApiUrl(config.apiUrl.getmemberinfo), {
					user_secret: encodeURI($.localStorage.getUserSecret())
				},
				function(data) {
					var data = $.localStorage.getloginUser();
					data = eval('(' + data + ')');
					callback && callback(data);
				}
			);
		}
		/**
		 * 获取第三方平台数据
		 * @param {Object} callback
		 */
	$.service.getthird = function(callback) {
			$.post(
				getApiUrl(config.apiUrl.getthird), {
					user_secret: encodeURI($.localStorage.getUserSecret())
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 解绑第三方平台
		 * @param {Object} from 第三方平台名称
		 * @param {Object} callback 回调函数
		 */
	$.service.unbundling = function(from, callback) {
			$.post(
				getApiUrl(config.apiUrl.Unbundling), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					from: from
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						callback && callback();
					}
				}
			);
		}
		/**
		 * 手机发送验证码
		 * @param {Object} callback
		 */
	$.service.sendcode = function(mobile, callback) {
			$.post(
				getApiUrl(config.apiUrl.sendcode), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					mobile: mobile
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						callback && callback();
					}
				}
			);
		}
		/**
		 * 验证验证码是否正确
		 * @param {Object} code
		 * @param {Object} callback
		 */
	$.service.checkcode = function(code, successback, failback) {
			$.post(
				getApiUrl(config.apiUrl.checkcode), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					msgcode: code
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						successback && successback();
					} else {
						failback && failback();
					}
				}
			);
		}
		/**
		 * 获得一共发送几次验证码
		 * @param {Object} callback
		 */
	$.service.sendnum = function(callback) {
			$.post(
				getApiUrl(config.apiUrl.sendnum), {
					user_secret: encodeURI($.localStorage.getUserSecret())
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 判断图形验证码是否成功
		 * @param {Object} code
		 * @param {Object} callback
		 * @param {Object} failback
		 */
	$.service.check_code = function(code, callback, failback) {
			$.common.post(
				getApiUrl(config.apiUrl.check_code), {
					code: code
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						callback && callback();
					} else {
						failback && failback();
					}
				}
			);
		}
		/**
		 * 更改手机号
		 * @param {Object} phone
		 * @param {Object} sucessback
		 * @param {Object} failback
		 */
	$.service.changemobile = function(phone, sucessback, failback) {
			$.post(
				getApiUrl(config.apiUrl.changemobile), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					mobile: phone
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						sucessback && sucessback();
					} else {
						failback && failback();
					}
				}
			);
		}
		/**
		 * 获取常用联系人列表
		 * @param {Object} page
		 * @param {Object} pagesize
		 * @param {Object} callback
		 */
	$.service.getcontactlist = function(page, pageSize, type, callback) {
			$.common.postData(
				getApiUrl(config.apiUrl.getcontactlist), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					page: page,
					pageSize: pageSize,
					type: type
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 获取常用地址列表
		 * @param {Object} page
		 * @param {Object} pagesize
		 * @param {Object} callback
		 */
	$.service.getaddresslist = function(page, pageSize, type, callback) {
			$.common.postData(
				getApiUrl(config.apiUrl.getaddresslist), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					page: page,
					pageSize: pageSize,
					type: type
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 上传头像
		 * @param {Object} files
		 * @param {Object} callback
		 */
	$.service.headportrait = function(files, callback) {
			$.common.post(
				getApiUrl(config.apiUrl.headportrait), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					files: files
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						callback && callback();
					}
				}
			);
		}
		/**
		 * 修改昵称
		 * @param {Object} nickname
		 * @param {Object} callback
		 */
	$.service.modifynickname = function(nickname, callback) {
			$.common.post(
				getApiUrl(config.apiUrl.modifynickname), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					nickname: nickname
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						//data.data=eval('('+data.data+')');
						callback && callback();
					}
				}
			);
		}
		/**
		 * 添加真实姓名
		 * @param {Object} truename
		 * @param {Object} callback
		 */
	$.service.modifytruename = function(truename, callback) {
			$.common.post(
				getApiUrl(config.apiUrl.modifytruename), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					truename: truename
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						callback && callback();
					}
				}
			);
		}
		/**
		 * 提现记录
		 * @param {Object} page
		 * @param {Object} pageSize
		 * @param {Object} type
		 * @param {Object} callback
		 */
	$.service.drawalrecord = function(page, pageSize, type, callback) {
			$.common.postData(
				getApiUrl(config.apiUrl.drawalrecord), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					page: page,
					pageSize: pageSize,
					type: type
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 修改备注
		 * @param {Object} remark
		 * @param {Object} group_num
		 * @param {Object} callback 
		 */
	$.service.modifyremark = function(remark, group_num, callback) {
			$.common.post(
				getApiUrl(config.apiUrl.modifyremark), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					remark: remark,
					group_num: group_num
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						callback && callback();
					}
				}
			);
		}
		/**
		 * 添加身份证号码
		 * @param {Object} cardid
		 * @param {Object} callback	 */
	$.service.addcardid = function(cardid, callback) {
			$.common.post(
				getApiUrl(config.apiUrl.addcardid), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					cardid: cardid
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						callback && callback();
					}
				}
			);
		}
		/**
		 * 修改常用地址
		 * @param {Object} address
		 * @param {Object} callback
		 */
	$.service.modifyaddress = function(address, callback) {
			$.common.post(
				getApiUrl(config.apiUrl.modifyaddress), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					address: address
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						callback && callback();
					}
				}
			);
		}
		/**
		 * 修改性别
		 * @param {Object} sex
		 * @param {Object} callback
		 */
	$.service.modifysex = function(sex, callback) {
			$.common.post(
				getApiUrl(config.apiUrl.modifysex), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					sex: sex
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						callback && callback();
					}
				}
			);
		}
		/**
		 * 平台动态
		 * @param {Object} page
		 * @param {Object} pageSize
		 * @param {Object} callback
		 */
	$.service.platformdynamics = function(page, pageSize, callback) {
			$.common.postData(
				getApiUrl(config.apiUrl.platformdynamics), {
					page: page,
					pageSize: pageSize
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 消息动态
		 * @param {Object} page
		 * @param {Object} pageSize
		 * @param {Object} callback
		 */
	$.service.msgdynamics = function(page, pageSize, level, id, callback) {
			$.common.postData(
				getApiUrl(config.apiUrl.msgdynamics), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					page: page,
					pageSize: pageSize,
					level: level,
					id: id
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 反馈
		 * @param {Object} message
		 * @param {Object} callback
		 */
	$.service.getmessage = function(message,phone, callback, faliback) {
			$.common.post(
				getApiUrl(config.apiUrl.message), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					content: message,
					tel:phone
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						callback && callback();
					} else {
						faliback && faliback();
					}
				}
			);
		}
		/**
		 * 版本说明
		 * @param {Object} version
		 * @param {Object} callback
		 */
	$.service.imprint = function(version, callback) {
			$.common.post(
				getApiUrl(config.apiUrl.imprint), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					version: version
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 获取首页我的二维码
		 * @param {Object} callback
		 */
	$.service.getmyqrcode = function(callback) {
			$.common.post(
				getApiUrl(config.apiUrl.get_my_qrcode), {
					user_secret: encodeURI($.localStorage.getUserSecret())
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 审核申请
		 * @param {Object} level
		 * @param {Object} page
		 * @param {Object} pageSize
		 * @param {Object} callback
		 */
	$.service.myapplication = function(page, pageSize, level, callback) {
			$.common.post(
				getApiUrl(config.apiUrl.myapplication), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					level: level,
					page: page,
					pageSize: pageSize
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 分销秘籍
		 * @param {Object} page
		 * @param {Object} pageSize
		 * @param {Object} types
		 * @param {Object} id
		 * @param {Object} keyword
		 * @param {Object} callback
		 */
	$.service.getdistribution = function(page, pageSize, types, id, keyword, callback) {
		$.common.postData(
			getApiUrl(config.apiUrl.getdistribution), {
				page: page,
				pageSize: pageSize,
				types: types,
				id: id,
				keyword: keyword
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					data.data = eval('(' + data.data + ')');
					callback && callback(data.data);
				}
			}
		);
	}

	/**
	 * 查看分组下二维码
	 * @param {Object} qrc_num
	 * @param {Object} page
	 * @param {Object} pageSize
	 * @param {Object} callback
	 */
	$.service.showgrouplist = function(page, pageSize, qrc_num, callback) {
			$.common.post(
				getApiUrl(config.apiUrl.grouplist), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					qrc_num: qrc_num,
					page: page,
					pageSize: pageSize
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 我的粉丝
		 * @param {Object} page
		 * @param {Object} pageSize
		 * @param {Object} keyword
		 * @param {Object} callback
		 */
	$.service.getmyfans = function(page, pageSize, keyword, callback) {
			$.common.postData(
				getApiUrl(config.apiUrl.getmyfans), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					page: page,
					pageSize: pageSize,
					keyword: keyword
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						data.data = eval('(' + data.data + ')');
						callback && callback(data.data);
					}
				}
			);
		}
		/**
		 * 分组下二维码修改设置
		 * @param {Object} bind
		 * @param {Object} verify
		 * @param {Object} theme
		 * @param {Object} type
		 * @param {Object} qrc_sign
		 */
	$.service.qrcodesetting = function(bind, verify, theme, type, qrc_sign, callback) {
			$.common.post(
				getApiUrl(config.apiUrl.qrcodesetting), {
					user_secret: encodeURI($.localStorage.getUserSecret()),
					bind: bind,
					verify: verify,
					theme: theme,
					type: type,
					qrc_sign: qrc_sign
				},
				function(data) {
					data = eval('(' + data + ')');
					if(data.status == 1) {
						callback && callback();
					}
				}
			)
		}
		/**
		 * 平面物料与微信宣传
		 * @param {Object} user_secret
		 * @param {Object} page
		 * @param {Object} pageSize
		 * @param {Object} status
		 */
	$.service.materialconduct = function(page, pageSize, status, callback) {
		$.common.postData(
			getApiUrl(config.apiUrl.materialconduct), {
				user_secret: encodeURI($.localStorage.getUserSecret()),
				page: page,
				pageSize: pageSize,
				status: status
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					data.data = eval('(' + data.data + ')');
					callback && callback(data.data);
				}
			}
		)

	}
	$.service.myfansorder = function(page, pageSize, fansid, callback) {
		$.common.postData(
			getApiUrl(config.apiUrl.myfansorder), {
				user_secret: encodeURI($.localStorage.getUserSecret()),
				page: page,
				pageSize: pageSize,
				fansid: fansid
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					data.data = eval('(' + data.data + ')');
					callback && callback(data.data);
				}
			}
		)
	}
	$.service.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	$.service.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}
	
	$.service.getmycollect = function(page, pageSize,keyword, callback) {
		$.common.postData(
			getApiUrl(config.apiUrl.mycollect), {
				user_secret: encodeURI($.localStorage.getUserSecret()),
				page: page,
				pageSize: pageSize
				
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					data.data = data;
					callback && callback(data.data);
				}
				
			}
		);
	}
	
	$.service.getmybalance = function(page, pageSize, type, callback) {
		$.common.postData(
			getApiUrl(config.apiUrl.balancedetail), {
				user_secret: encodeURI($.localStorage.getUserSecret()),
				page: page,
				pageSize: pageSize
				
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					data.data = data;
					callback && callback(data.data);
				}
				
			}
		);
	}
	
	/**
	 * 用户银行卡列表
	 */
	$.service.bankcardlist = function(page, pageSize,pay_type,callback) {
		$.common.postData(
			getApiUrl(config.apiUrl.bankcardlist), {
				user_secret: encodeURI($.localStorage.getUserSecret()),
				page: page,
				pageSize: pageSize,
				pay_type: pay_type
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.status == 1) {
					data.data = data.info;
					callback && callback(data.data);
				}
				
			}
		);
	}
	
	/**
	 * 用户银行卡解除绑定
	 */
	$.service.unbundingcard = function(password,id, callback) {
		$.common.postData(
			getApiUrl(config.apiUrl.unbundingcard), {
				user_secret: encodeURI($.localStorage.getUserSecret()),
				password:password,
                id:id		
			},
			function(data) {
				data = eval('(' + data + ')');
				if(data.message=="解除绑定成功"){
				    viewMain.router.back({
					url: 'bank/successunbund.html',
					force: true
			    });
				}else{
					if(plus && plus.nativeUI){
			        plus.nativeUI.toast("密码错误，解除绑定失败");
					}
				}
				if(data.status == 1) {
					data.data = data;
					callback && callback(data.data);
				}		
			}
		);
	}

    /**
	 * 用户银行卡提现
	 */
    $.service.cashwithdraw = function(money,bank_id,password,callback){
    	$.common.postData(
			getApiUrl(config.apiUrl.cashwithdraw), {
				user_secret: encodeURI($.localStorage.getUserSecret()),
				money: money,
				bank_id: bank_id,
				password: password
			},
			function(data) {
				data = eval('(' + data + ')');			
				if(data.status == 1) {
					data.data = data;
					callback && callback(data.data);
				}		
			}
		);
    }

	$.common.isLogin = function() {
		var loginUser = $.localStorage.getloginUser();
		if(loginUser) {
			return true;
		} else {
			return false;
		}

	}
	$.localStorage.getloginUser = function() {
		return localStorage.getItem($.LOGIN_USER);
	}
	$.localStorage.setLoginUser = function(user_obj) {
		if(user_obj)
			localStorage.setItem($.LOGIN_USER, user_obj);
		else
			localStorage.removeItem($.LOGIN_USER);
	}
	$.localStorage.setUserSecret = function(secret) {
		localStorage.setItem($.USER_SECRET, secret);
	}
	$.localStorage.setUserInfo = function() {
		localStorage.setItem($.USER_SECRET, secret);
	}
	$.localStorage.getUserSecret = function() {
		return localStorage.getItem($.USER_SECRET);
	}
	$.localStorage.lastLoginInfo = {
		userName: function() {
			var _loginInfo = localStorage.getItem('loginInfo');
			try {
				_loginInfo = (_loginInfo ? eval('(' + _loginInfo + ')') : '');
			} catch(err) {}
			return _loginInfo ? _loginInfo.userName : null;
		}
	}
	$.localStorage.setAddBankInfo = function(bank_info) {
		localStorage.setItem('add_bank_info', bank_info);
	}
	$.localStorage.getAddBankInfo = function() {
		return localStorage.getItem('add_bank_info');
	}
	$.localStorage.setLoginInfo = function(options) {
		localStorage.setItem('loginInfo', JSON.stringify(options));
	};
	$.newFocus = function(obj) {
		if(typeof(obj) == "string") {
			obj = $$("#" + obj);
		}
		setTimeout(function() {
			$$(obj).focus();
		}, 200);
	}

	window.alert = function(content, title, callback) {
		if(plus && plus.nativeUI) {
			plus.nativeUI.alert(content, callback, title);
		} else
			window.currentApp.alert(content, title, callback);

	}

	var _loading_html = '<div class="infinite-scroll-preloader"><div class="preloader"></div></div>';
	var _first_load = '<div class="infinite-scroll-preloader" id="scroll-infinite-prel-tmp"><div class="preloader"></div></div>';
	/**
	 * 
	 * @param {Object} container
	 * @param {Object} scrollPanel
	 * @param {Object} pageIndex
	 * @param {Object} pageSize
	 */
	$.t_infiniteScroll = function(scrollPanel, pageIndex, pageSize, callback) {
		scrollPanel = scrollPanel ? '.infinite-scroll' : scrollPanel;
		$(scrollPanel).each(function() {
			$(this).data('_infinite_container', this);
			$(this).data('_infinite_scrollPanel', this);
		});
		//加载提示符
		$(scrollPanel).append(_first_load);
		// 注册'infinite'事件处理函数
		$$(scrollPanel).on('infinite', function() {
			_that = this;
			//去除首次页面加载提示
			if (_that.loads === undefined) {
				$$(_that).find('#scroll-infinite-prel-tmp').hide();
				_that.loads = 1;
			}
			this.t_removePreloaderScroll = function(loaded) {
				$.t_removePreloaderScroll(_that, loaded);
			};
			// 如果正在加载，则退出
			if($(_that).data('loading')) return;
			// 设置flag
			$$(_that).data('loading', true);
			
			callback && callback.call(_that, function(loaded) {
				$.t_removePreloaderScroll(_that, loaded);
			});
		});
	}

	$.t_removePreloaderScroll = function(scrollPanel, loaded) {
		if(!scrollPanel) return;
		var container = $(scrollPanel).data('_infinite_container');
		//所有数据加载完成时需调用此方法  
		// 重置加载flag  
		$(scrollPanel).data('loading', false);
		//	console.log(scrollPanel);
		// 删除加载提示符  
		$($(scrollPanel).find('.infinite-scroll-preloader')).remove();
		// 加载完毕，则注销无限加载事件，以防不必要的加载
		if(loaded) {
			currentApp.detachInfiniteScroll(scrollPanel);
		} else {
			$(scrollPanel).append(_loading_html);
		}
	}

	$.common._isThirdLoginInit = false;
	$.common.thirdLoginInit = function() {
		if($.common._isThirdLoginInit) return;
		$.common._isThirdLoginInit = true;
		var auths = {};

		var loadOauthService = function() {
			// 获取登录认证通道
			plus.oauth.getServices(function(services) {
				for(var i in services) {
					var service = services[i];
					auths[service.id] = service;
				}
				$.common.thirdLogoutAll();
			}, function(e) {
				console.log("获取登录认证失败：" + e.message);
			});
		}

		document.addEventListener('plusready', loadOauthService, false);
		var loadNum = 0;

		var thirdnum = new Array();
		thirdnum['weixin'] = 1;
		thirdnum['qq'] = 2;
		thirdnum['sinaweibo'] = 3;
		// 登录认证
		$.common.oauth = function(id, callback) {
			currentApp.t_showPreloader();
			setTimeout(function() {
				var auth = auths[id];
				if(auth) {
					document.addEventListener("pause", function() {
						setTimeout(function() {
							currentApp.t_hidePreloader();
						}, 2000);
					}, false);
					auth.login(function() {
						currentApp.t_hidePreloader();
						auth.getUserInfo(function() {
							callback && callback(auth);
						}, function(e) {
							console.log("获取用户信息失败：");
							console.log("[" + e.code + "]：" + e.message);
							plus.nativeUI.alert("获取用户信息失败！", null, "登录");
						});
					}, function(e) {
						if(e.code == '-100' || e.code == '-2' || e.code == '-8') {
							plus.nativeUI.toast('已取消登录');
						} else {
							currentApp.t_hidePreloader();
							console.log("登录认证失败：");
							console.log("[" + e.code + "]：" + e.message);
							plus.nativeUI.alert("详情错误信息请参考授权登录(OAuth)规范文档：http://www.html5plus.org/#specification#/specification/OAuth.html", null, "登录失败[" + e.code + "]：" + e.message);
						}
					});
				} else {
					console.log("无效的登录认证通道！");
					currentApp.t_hidePreloader();
					loadOauthService();
					if(loadNum < 1)
						$.common.thirdLogin(id);
					loadNum++;
				}
			}, 100);
		}

		// 登录认证
		$.common.thirdLogin = function(id) {
			$.common.oauth(id, function(auth) {
				var nickname = auth.userInfo.nickname || auth.userInfo.name;
				var _openid = auth.authResult.unionid || auth.authResult.openid;
				$$.service.thirdlogin(_openid, thirdnum[id], function(userInfo) {
					if(!userInfo) {
						alert('用户不存在，无法进行登录！');
						return;
					}
					//记录登录信息到本地
					$$.localStorage.setLoginInfo({
						userName: userInfo.user.mobile
					});
					initMyIndex();
					$$('input[name=pwd]').val('');
					//关闭登录页面 
					currentApp.closeModal();
				});
			});
		}

		// 第三方账号授权绑定
		$.common.userBind = function(id, success, fail) {
				$.common.oauth(id, function(auth) {
					var nickname = auth.userInfo.nickname || auth.userInfo.name;
					$.service.userBind(id, auth.authResult.openid, auth.authResult.unionid, nickname, function(result) {
						success && success();
					}, function() {
						fail && fail();
					});
				});
			}
			//解绑第三方平台
		$.common.unBind = function(from, success, fail) {
			$.service.unbundling(from, function(result) {
				success && success();
			}, function() {
				fail && fail();
			});
		}

		// 获取用户信息
		function userinfo(a) {
			console.log("----- 获取用户信息 -----");
			a.getUserInfo(function() {
				console.log("获取用户信息成功：");
				console.log(JSON.stringify(a.userInfo));
				var nickname = a.userInfo.nickname || a.userInfo.name;
			}, function(e) {
				console.log("获取用户信息失败：");
				console.log("[" + e.code + "]：" + e.message);
				plus.nativeUI.alert("获取用户信息失败！", null, "登录");
			});
		}
		// 注销登录
		$.common.thirdLogoutAll = function() {
			console.log("----- 注销登录认证 -----");
			for(var i in auths) {
				logout(auths[i]);
			}
		}

		function logout(auth) {
			auth.logout(function() {
				console.log("注销\"" + auth.description + "\"成功");
			}, function(e) {
				console.log("注销\"" + auth.description + "\"失败：" + e.message);
			});
		}

	}

	$.common.post = function(url, data, success, fail, isLoading) {
		if(isLoading)
			currentApp.t_showPreloader();
		$.post(url, data, function(xhr) {
			if(isLoading)
				currentApp.t_hidePreloader();
			success && success(xhr);
		}, function(e) {
			if(isLoading)
				currentApp.t_hidePreloader();
			fail && fail(e);
		});
	};
	$.common.postData = function(url, data, success, fail, isLoading) {
		isLoading = isLoading ? isLoading : false;
		$.common.post(url, data, success, fail, isLoading);
	};
	$.common.postDataLoading = function(url, data, success, fail, isLoading) {
		isLoading = isLoading ? isLoading : true;
		$.common.post(url, data, success, fail, isLoading);
	};

	$.common.back = function() {
		//返回主界面 
		if(window.plus) {
			window.plus.t_back();
		} else
			currentApp.mainView.back();

	}

	$.common.topWebViewJS = function(js) {
		if(window.plus && window.plus.webview) {
			var parentView = window.plus.webview.getLaunchWebview();
			if(js.call) parentView.evalJS('(' + js + ')();');
			else parentView.evalJS(js);
		} else {
			if(js.call) js();
			else eval('(' + js + ')();');
		}
	}

})(Dom7);

(function($) {
	window.$$ = Dom7;
	var ua = navigator.userAgent;
	window.isPlus = false;
	var _android = /Android [\d+|\.]{0,10}/.exec(navigator.userAgent);
	window.os_version = _android ? _android.toString().replace(/Android/g, '') : '';
	//判断5+环境下，且不是流应用
	if(ua.indexOf("Html5Plus") > 0 && ua.indexOf("StreamApp") == -1) {
		window.isPlus = true;
	}
	//获取状态栏高度 
	window.statusBar = {
		height: 0
	};
	//是否沉侵式状态 
	window.isImmersive = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(ua);
	if(window.isImmersive && window.isImmersive.length >= 3) { // 当前环境为沉浸式状态栏模式
		window.statusBar.height = parseFloat(window.isImmersive[2]); // 获取状态栏的高度 
		window.isImmersive = true;
	} else {
		window.isImmersive = false;
	}

	//- 判断当前环境是否支持沉浸式状态栏 
	if(window.isImmersive) {
		//plus.navigator.getStatusbarHeight() //获取状态栏高度
		var statusBarHeight = window.statusBar.height;
		$$('html').addClass('with-statusbar-overlay');
		//获取状态栏高度，加入相关样式
		var style = '<style>.statusbar-overlay{height:' + statusBarHeight + 'px}';
		style += '.html.with-statusbar-overlay body{padding-top:' + statusBarHeight + 'px}';
		style += '.html.with-statusbar-overlay .login-screen,html.with-statusbar-overlay .popup.tablet-fullscreen{height:-webkit-calc(100% - ' + statusBarHeight + 'px);height:calc(100% - ' + statusBarHeight + 'px);top:' + statusBarHeight + 'px}';
		style += '@media all and (max-width:629px),(max-height:629px){html.with-statusbar-overlay .popup{height:-webkit-calc(100% - ' + statusBarHeight + 'px);height:calc(100% - ' + statusBarHeight + 'px);top:' + statusBarHeight + 'px}}';
		style += '</style>';
		$$(document.body).append(style);
	}

	document.addEventListener('plusready', function() {
		window.plus = plus;
	});
})(Dom7);

(function(app) {

	app.prototype.t_showPreloader = function(tips) {
		tips = tips ? tips : '正在加载...';
		//console.log(plus.nativeUI.showWaiting());
		if(window.plus && window.plus.nativeUI) {
			window.plus.nativeUI.showWaiting(tips);
		} else if(window.currentApp) {
			window.currentApp.showPreloader(tips);
		}
	}

	app.prototype.t_hidePreloader = function() {
		if(window.plus && window.plus.nativeUI) {
			window.plus.nativeUI.closeWaiting();
		} else if(window.currentApp) {
			window.currentApp.hidePreloader();
		}
	}
	app.prototype.t_confirm = function(text, title, backok, backno) {
		this.modal({
			title: title,
			text: text,
			buttons: [{
				text: '取消',
				onClick: function() {
					backok && backok();
				}
			}, {
				text: '确认',
				bold: true,
				onClick: function() {
					backno && backno();
				}
			}, ]
		})
	}
})(Framework7);