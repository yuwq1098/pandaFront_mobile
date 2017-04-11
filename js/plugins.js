/*
 * 熊猫旅行移动端的插件脚本 
 * 作者Geek.Yu 在2017-04-07 09:50:00 创建了它，
 * 若您对此脚本存在疑问，请联系作者Geek.Yu  qq:1098654043
 */

(function($){ 

    // 首页顶部条样式随滚动条高度变化
    $.fn.indexTopNav = function(option){

        var $el,                      // 所指定的$DOM
            defaults,                 // 默认配置
            setting,                  // 实际的配置
            $P,                       // 获得侦听滚动事件的DOM区域
            $navbar_bg,               // 获得当前导航条的背景DOM
            $navbar_child,            // 获得当前导航条的子DOM
            $navbar_height,           // 获得当前导航条的高度
            p_scrollTop;              // 定义win滚动条高度

        $el = $(this);
        $navbar_bg = $el.find(".navbar-bg");
        $navbar_child = $el.find(".navbar-inner > *");
        $navbar_height = $el[0].offsetHeight;

        $P = $("#home .page-content");
        p_scrollTop = $P.scrollTop();

        defaults = {
            maxScrollY : 300,         // 滚动条起始显示位置
        };
        // 参数继承
        setting = $.extend(defaults,option);

        // 初始化调用scrollFunc
        scrollFunc();
        // 页面滚动触发相应事件
        $P.on("scroll",scrollFunc);
        
        // 页面滚动回调
        function scrollFunc(){
            var maxY,               // 规定最大滚动高度（效果）
                par,                // 百分比
                proportionA,        // 当前导航条的背景DOM的透明百分比
                proportionB,        // 当前导航条子元素的透明百分比
                scroll_start = 20;

            p_scrollTop = $P.scrollTop();
            maxY = setting.maxScrollY-scroll_start-$navbar_height/2;
            par  = maxY/100;
            // 当滚动条高度超出规定值
            if(p_scrollTop>maxY+scroll_start){
                $navbar_bg.css("opacity",".8");
                $navbar_child.css("backgroundColor","rgba(255,255,255,1)");
                return false;
            }
            // 当滚动条高度低于规定值
            if(p_scrollTop<=scroll_start){
                $navbar_bg.css("opacity","0");
                $navbar_child.css("backgroundColor","rgba(255,255,255,.75)");
                return false;
            }
            if(p_scrollTop>scroll_start&&p_scrollTop<=maxY+scroll_start){
                var Y =  p_scrollTop - scroll_start;
                //调整导航条的背景色
                proportionA = ((Y/par)/125).toFixed(4).toString();
                $navbar_bg.css("opacity",proportionA);
                //调整导航条子元素的背景色
                proportionB = parseFloat(((Y/par)/100/4.2).toFixed(4))+0.75;
                $navbar_child.css("backgroundColor","rgba(255,255,255,"+proportionB+")");
            }
        }
    }

    // 同步五个底部导航的高亮
    $.fn.indexToolbar = function(option){
        var $el,                      // 所指定的$DOM
            $toolbarDoms,             // 获取底部导航栏所有的taps dom
            currentHref;              // 用户点击的底部导航标签挂载的href属性值

        $el = $(this);
        $toolbarDoms = $el.find(".toolbar-inner");
        // 点击标签高亮其标签，touchstart比click事件更优，解决移动端单击事件300ms延迟的BUG
        $toolbarDoms.find("a").on("touchstart",function(e){
            currentHref =  $(this).attr("href");
            $toolbarDoms.find("a[href='"+currentHref+"']").addClass("active").siblings("a").removeClass("active");
        });
    }  

    // 返回顶部
    $.fn.backToTOP = function(option){

        var $el,                      // 所指定的$DOM
            bodyHeight,               // 一屏的高度
            defaults,                 // 默认配置
            setting,                  // 实际的配置
            backDOM,                  // 返回顶部按钮的DOM
            $P,                       // 获得侦听滚动事件的DOM区域
            p_scrollTop;              // 定义win滚动条高度
        
        $el = $(this);
        $P = $el.find(".page-content");
        p_scrollTop = $P.scrollTop();
        bodyHeight = $("body")[0].offsetHeight;
        defaults = {
            showRatio : 1.5,          // 高度比例（相对于一屏的高度）
        };
        // 参数继承
        setting = $.extend(defaults,option);

        backDOM = $el.find(".backTo-top");
        // 初始化调用scrollFunc
        scrollFunc();
        // 页面滚动触发相应事件
        $P.on("scroll",scrollFunc);
        
        // 页面滚动回调
        function scrollFunc(){
            p_scrollTop = $P.scrollTop();
            if(p_scrollTop >= bodyHeight * setting.showRatio){
                oShow();
            }else{
                oHide();
            }
        }
        
        // 移动端返回顶部，移动端不需要页面滚动过渡效果
        backDOM.on("touchstart",function(){
            $P.scrollTop(0);
        })
        
        // 显示返回顶部按钮
        function oShow(){
            backDOM.show().addClass("active");
        }
        // 隐藏返回顶部按钮
        function oHide(){
            backDOM.hide().removeClass("active");
        }

    }  

    // 悬浮球菜单
    $.fn.floatingMenu = function(option){
        
        var $el,                      // 所指定的$DOM
            $ballFont,                // 悬浮球上的字
            defaults,                 // 默认配置
            setting,                  // 实际的配置
            $menuBoxDOM,              // 悬浮球菜单内容的DOM
            $linkItem,                // 菜单内容的link元素
            $contentDOM,              // 菜单link区域的DOM
            $closeDOM;                // 关闭按钮的DOM区域

        $el = $(this);
        $ballFont = $el.find("span");
        defaults = {
            parentDOM : null,          // 高度比例（相对于一屏的高度）
        };

        // 参数继承
        setting = $.extend(defaults,option);
        $menuBoxDOM = setting.parentDOM?$(setting.parentDOM).find("[data-box='floating-menu']"):$("[data-box='floating-menu']");
        $linkItem =  $menuBoxDOM.find(".link-item");
        $contentDOM = $menuBoxDOM.find(".box-content");
        $closeDOM = $menuBoxDOM.find(".box-close");
        
        // 用户点击悬浮球
        $el.on('touchstart',openBOX);

        // 用户触发关闭按钮
        $closeDOM.on('touchstart',closeBOX);

        // 将$ .Velocity.mock设置为任意乘数，以加快或减慢页面上的所有动画
        $.Velocity.mock = 1;

        $linkItem.on("touchstart",function(){
            $(this).addClass("active").siblings().removeClass("active");
        })
        
        // 定义打开菜单的序列函数方法
        var openMeun = [
            { e: $ballFont, p: {  scale: [0,1], transformOriginY: ["85%","50%"] }, o: {  delay: 0, duration:250, easing: [ 0, 0, 0.2, 1 ] } },
            { e: $el, p: { opacity: 0 }, o: { delay: 120, duration: 350, easing: [ 0, 0, 0.2, 1 ] , sequenceQueue: false } },
            { e: $menuBoxDOM, p: { opacity: 1 }, o: { delay: 0, duration: 350 , display: "block" , sequenceQueue: false} },
            { e: $closeDOM, p: { scale: .5 , bottom: "0.5rem" }, o: { delay: 0, duration: 0 , sequenceQueue: false} },
            { e: $closeDOM, p: { scale: [1,.5], rotateZ: ["0deg","-135deg"], bottom: ["1rem","0.5rem"], }, o: { delay: 100, duration: 300 , sequenceQueue: false} },
            { e: $contentDOM, p: { scale: 0 }, o: { delay: 0, duration: 0 , sequenceQueue: false } },
            { e: $contentDOM, p: { scale: [1,.3], opacity: 1 }, o: { delay: 100, duration: 300, easing: [ .2,1.14,.65,1.5 ], display: "block",  sequenceQueue: false} },
        ];

        // 定义关闭菜单的序列函数方法
        var closenMeun = [
            { e: $contentDOM, p: "reverse", o: { delay: 0, duration: 300 } },
            { e: $closeDOM, p: "reverse", o: { delay: 0, duration: 300,sequenceQueue: false } },
            { e: $menuBoxDOM, p: "reverse", o: { delay: 120, duration: 200 , display: "none", sequenceQueue: false} },
            { e: $el, p: "reverse", o: { delay: 0, duration: 200, sequenceQueue: false } },
            { e: $ballFont, p: "reverse", o: {  delay: 120, duration: 200, sequenceQueue: false } },
        ];
        
        // 显示菜单内容的方法
        function openBOX(){
            // 每次打开菜单的时候去除所有link的高亮
            $linkItem.removeClass("active");
            $.Velocity.RunSequence(openMeun);
        }
        // 关闭菜单内容的方法
        function closeBOX(){
            $.Velocity.RunSequence(closenMeun);
            // 每次关闭菜单的时候去除所有link的高亮
            $linkItem.removeClass("active");
        }

    }

    // 加减（数量）选择器
    $.fn.choicesNUM = function(option){
        var $el,                      // 所指定的$DOM
            $addDom,                  // 加号DOM
            $subtractDom,             // 减号DOM
            $numDom,                  // number值区
            _number,                  // 当前的数值  
            defaults,                 // 默认配置
            setting;                  // 实际的配置

        $el = $(this);
        $addDom = $el.find("span.add");
        $subtractDom = $el.find("span.subtract");
        $numDom = $el.find(".number");
        _number = $numDom.text();
        
        // 触发加数量方法
        $addDom.on("touchstart",function(){
            add();
        });
        // 触发减数量方法
        $subtractDom.on("touchstart",function(){
            sbu();
        });
        
        // 数值自增1
        function add(){
            _number++;
            $numDom.text(_number);
        }
        // 数值自减1
        function sbu(){
            _number>0?_number--:0;
            $numDom.text(_number);
        }

    }
  
})(jQuery);  
