/*
 * 熊猫旅行移动端的插件脚本 
 * 作者Geek.Yu 在2017-04-07 09:50:00 创建了它，
 * 若您对此脚本存在疑问，请联系作者Geek.Yu  qq:1098654043
 */


(function($){ 
    
    $.fn.indexTopNav = function(option){

        var $el,                      // 所指定的$DOM
            defaults,                 // 默认配置
            setting,                  // 实际的配置
            $P,                       // 获得侦听滚动事件的DOM区域
            $navbar_bg,               // 获得当前导航条的背景DOM
            $navbar_child,            // 获得当前导航条的子DOM
            p_scrollTop;              // 定义win滚动条高度

        $el = $(this);
        $navbar_bg = $el.find(".navbar-bg");
        $navbar_child = $el.find(".navbar-inner > *");
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
            p_scrollTop = $P.scrollTop();
            var maxY = setting.maxScrollY-15;
            if(p_scrollTop>20){
                $navbar_bg.css("opacity","1");
                return false;
            }
            if(p_scrollTop>15){
                
            }
        }

    }

    // 侧边悬浮条
    $.fn.suspensionNav = function(option){

        var $el,                      // 所指定的$DOM
            defaults,                 // 默认配置
            setting,                  // 实际的配置
            childSize,                // 浮动导航的个数
            boxDataItems = [],        // 数据集，浮动导航所带的数据=>指向实际页面内容
            boxHeightItems = [],      // 数据集，浮动导航指向页面内容的高度
            boxScrollTopItems = [],   // 数据集，浮动导航指向页面内容的滚动条高度
            w_scrollTop;              // 定义win滚动条高度
        
        var $W = $(window);
        w_scrollTop = $W.scrollTop();
        // 获取页面中的主要内容盒子
        var $boxMain = $("#box-items");
       
        $el = $(this);
        childSize = $el.find("li").length;
        
        // 赋值，浮动导航所带的数据=>指向实际页面内容
        for(var i=0; i<childSize;i++){
            var _boxData = $el.find("li").eq(i).attr("data-box");
            var _height = $boxMain.find("[data-box='"+_boxData+"']").height();
            var _scrollTop = $boxMain.find("[data-box='"+_boxData+"']").offset().top;
            boxDataItems.push(_boxData);
            boxHeightItems.push(_height);
            boxScrollTopItems.push(_scrollTop);
        }

        defaults = {
            onShowY : 300,       // 滚动条起始显示位置
            unShowY : 10000,     // 滚动条结束显示位置
        };
        // 参数继承，意思是后面的参数如果和前面的参数存在相同的名称，那么后面的会覆盖前面的参数值。
        setting = $.extend(defaults,option);
        
        // 初始化调用findPosition
        scrollFunc();
        $W.scroll(scrollFunc);

        for (i=0;i<boxDataItems.length;i++) {
            var section = $el.find("li").eq(i);
            section.on("click",scrollPageTo);
        }
        
        // 显示侧浮导航条
        function eShow(){
            $el.fadeIn(300);
        }
        // 隐藏侧浮导航条
        function eHide(){
            $el.fadeOut(300);
        }
        // 页面滚动回调
        function scrollFunc(){
            w_scrollTop = $W.scrollTop();
            if(w_scrollTop<setting.onShowY||w_scrollTop>setting.unShowY){
                eHide();   
                return false;
            }
            eShow();
            findPosition(); 
        }

        // 更新当前页面滚动块元素
        function findPosition(){
            for (i=0;i<boxDataItems.length;i++) {
                var section = $el.find("li").eq(i);
                if(w_scrollTop>=boxScrollTopItems[i]-(boxHeightItems[i]/1.8)){
                    if(i==5||i==6){
                        $el.find("li").removeClass("active");
                        $el.find("li").eq(5).addClass("active");
                        $el.find("li").eq(6).addClass("active");
                    }else{
                        section.addClass("active").siblings("li").removeClass("active");
                    }
                    
                }
                
            }
        }

        // 跳转至目标部分
        function scrollPageTo(el){
            var $el,
                thisData,           
                _index = -1,        //获取所点击元素的下标
                _scrollTop = 0,     // 获取目标位置的滚动条高度
                _boxHeight = 0,     // 获取目标盒子高度
                oScrollVal = 0,     
                scrollDiff = 0,     // 当前滚动条距离目标滚动条的差值
                speed = 0;          // 滚动速率

            $el = $(el.currentTarget);
            thisData = $el.attr("data-box");

            for(var i = 0 ;i< boxDataItems.length;i++){
                if(thisData===boxDataItems[i]){
                    _index = i;
                    break;
                }
            }
            _scrollTop = boxScrollTopItems[_index];
            _boxHeight = boxHeightItems[_index];
            
            // 计算出一个speed值，让滚动效果更好
            oScrollVal = Math.floor(boxScrollTopItems[i]-(boxHeightItems[i]/1.8))+80;
            scrollDiff = Math.floor(Math.abs(w_scrollTop-oScrollVal)/1.3);
            speed = (100-Math.floor((Math.sqrt(scrollDiff))))*12 + 200;
            // 再次触发时强制溢出dom上的全部动画，然后进行新一轮动画
            $("html,body").stop().animate({  
                scrollTop:  oScrollVal+"px",
            }, speed);  
        }

    }

})(Zepto);  
