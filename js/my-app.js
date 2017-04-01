// 初始化 应用程序 framework7
var myApp = new Framework7({});

// 出口选择器引擎定义
var $$ = Dom7;

// Init滑块和它的实例存储在mySwiper变量
var mySwiper = myApp.swiper('.swiper-container', {

    autoplay: 3500,                                //可选选项，自动滑动
    autoplayDisableOnInteraction : false,          //用户操作后，不禁止自动滑动
    width : window.innerWidth,                     //你的slide宽度,全屏写法
    touchAngle : 20,                               //滑动角度
    speed:400,                                     //速度
    loop : true,                                   //环路
    loopAdditionalSlides : 1,                      //从第几张图开始显示
    pagination : '.swiper-pagination',             //分页器
    paginationType : 'bullets',                    //点分页显示
    // 关闭淡出，保留淡入
    fade: {
      crossFade: false,
    },
    // 如果滑动停了，那么重新开启它
    onAutoplayStop: function(swiper){
        mySwiper.startAutoplay();
    },
});

// 添加视图
var mainView = myApp.addView('.view-main', {
    // 因为我们使用固定通过导航条我们可以启用动态导航
    dynamicNavbar: true
});

//给app首页启动动态导航
var homeView = myApp.addView('#home', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

//给个人中心启动动态导航
var homeView = myApp.addView('#personal', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    // 禁用侧滑返回效果
    swipeBackPage: false,
    swipePanel: 'right',
});


// 回调用户信息页面初始化时触发
myApp.onPageInit('userinfo', function (page) {
    var _thisDOM = $$(page.container);
    // Touch events
    var isMoved = false,
        touchesStart = {},
        touchesMove = {},
        touchesDiff,
        touchStartTime;
    _thisDOM.find(".page-content").on("touchstart",function(e){
        isTouched = true;
        touchesStart.x = e.targetTouches[0].pageX || e.pageX;
        touchesStart.y = e.targetTouches[0].pageY || e.pageY;
        touchStartTime = (new Date()).getTime();

        $$(this).on("touchmove",function(e){
            if (!isTouched) return;
            touchesMove.x = e.targetTouches[0].pageX || e.pageX;
            touchesMove.y = e.targetTouches[0].pageY || e.pageY;
        });
        e.preventDefault();
    });
    _thisDOM.find(".page-content").on("touchend",function(e){
        var moved = {};
        var touchTime = ((new Date()).getTime()-touchStartTime)/1000;
        moved.x = touchesMove.x - touchesStart.x;
        moved.y = touchesMove.y - touchesStart.y;
        console.log("您花了"+touchTime+"s,移动的结果是：");
        console.log(moved);
        if(moved.x<-20){
            myApp.openPanel('right');
        }else if(moved.x>20){
            myApp.openPanel('left');
        }
        e.preventDefault();
    });
});
