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
            showRatio : 1.2,          // 高度比例（相对于一屏的高度）
        };
        // 参数继承
        setting = $.extend(defaults,option);

        $el.append("<div class='backTo-top'><i class='icon iconfont icon-huidaodingbu'></i><span>顶部</span></div>"); 
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
            backDOM.fadeIn(250);
        }
        // 隐藏返回顶部按钮
        function oHide(){
            backDOM.fadeOut(150);
        }

    }  
  
})(jQuery);  
