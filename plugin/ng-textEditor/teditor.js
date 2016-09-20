var app = require('../../../../../app.js');
app.controller('TextEditController',function($scope){
    var posterView = $('.poster-viewport');
    var posterContn = $('.poster-container');
    var remScale = 16/posterView.innerWidth();
    var postcontainer = posterContn.children('.yunye-container');
    /* 模板滚动后，控件定位需要修正差量 */
//    var rh = parseFloat($('.poster-viewport').css('padding-top'));
    var rh = 0;

    $scope.closeModel=function(){
        $('#text-model').removeClass('open');
        $('#text-cb-text').html('').attr('style','');
        $('#el-cont-style').attr('style','');
        $('.back-link-icon,.back-link-hold').removeClass('back-link-act');
        $('.back-link-input input').prop('disabled','disabled');
    };
    /* 初始化面板 */
    (function(){
        var ctrl = '<div id="ele-rotate-ctrl" class="ele-rotate-ctrl"><i class="fa fa-refresh"></i></div>';
            ctrl += '<div id="ele-editor-ctrl" class="ele-rotate-ctrl"><i class="fa fa-pencil"></i></div>';
            ctrl += '<div id="ele-delete-ctrl" class="ele-rotate-ctrl"><i class="fa fa-trash-o"></i></div>';
            ctrl += '<div id="ele-copy-ctrl" class="ele-rotate-ctrl"><i class="fa fa-clone"></i></div>';
        posterContn.append($(ctrl));
    })();
    (function(){
        var teditOption = {
            colorArr:
                ['#f8aba6','#f58f98','#f391a9','#f05b72','#d93a49','#b3424a','#a7324a','#840228','#6b2c25','#54211d',
                '#8e3e1f','#b4532a','#de773f','#f47920','#faa755','#fab27b','#dea32c','#ffc20e','#fdb933','#ffe600',
                '#f0dc70','#fcf16e','#b2d235','#a3cf62','#7fb80e','#78a355','#769149','#817936','#87843b','#454926',
                '#2e3a1f','#122e29','#274d3d','#225a1f','#007947','#508a88','#70a19f','#008792','#78cdd1','#afdfe4',
                '#90d7ec','#7bbfea','#009ad6','#228fbd','#2570a1','#2468a2','#145b7d','#2a5caa','#224b8f','#2b4490',
                '#1b315e','#11264f','#45224a','#543044','#63434f','#594c6d','#6950a1','#6f60aa','#9b95c9','#afb4db',
                '#fffffb','#f6f5ec','#f2eada','#d3d7d4','#a1a3a6','#999d9c','#72777b','#4f5555','#3e4145','#281f1d',
                '#130c0e'],
            fontFamily:
                ['Helvetica','Microsoft YaHei','Helvetica Neue']
        };
        if($('#ted-color-list').children().length==0){
            var cdiv='';
            for(var i=0;i<teditOption.colorArr.length;i++){
                cdiv += '<li class="color-li" style="background:'+teditOption.colorArr[i]+';" data-color="'+teditOption.colorArr[i]+'"></li>';
            }
            $('#ted-color-list').append(cdiv);
        }
        if($('#effects-color-list').children().length==0){
            cdiv='';
            for(var i=0;i<teditOption.colorArr.length;i++){
                cdiv += '<li class="ef-color-li" style="background:'+teditOption.colorArr[i]+';" data-color="'+teditOption.colorArr[i]+'"></li>';
            }
            $('#effects-color-list').append(cdiv);
        }
        makeColorCanvas($('#bot-cbox-canvas'));
        makeColorCanvas($('#back-color'));

        function makeColorCanvas($canvas){
            var canvas = $canvas[0];
            var ctx=canvas.getContext("2d");
            canvas.width=parseInt($canvas.parent().width());
            canvas.height=parseInt($canvas.parent().height());
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var hGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
                hGrad.addColorStop(0 / 6, '#F00');
                hGrad.addColorStop(1 / 6, '#FF0');
                hGrad.addColorStop(2 / 6, '#0F0');
                hGrad.addColorStop(3 / 6, '#0FF');
                hGrad.addColorStop(4 / 6, '#00F');
                hGrad.addColorStop(5 / 6, '#F0F');
                hGrad.addColorStop(6 / 6, '#F00');
            ctx.fillStyle = hGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            var vGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            vGrad.addColorStop(0, 'rgba(255,255,255,1)');
            vGrad.addColorStop(1/2, 'rgba(255,255,255,0)');
            vGrad.addColorStop(1/2, 'rgba(0,0,0,0)');
            vGrad.addColorStop(2/2, 'rgba(0,0,0,1)');
            ctx.fillStyle = vGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

    })();
    (function($){
        var Plugin = function(ele,option){
            this.$element = ele;
            this.defaults={
                pluginType:'main',
                ctrl:'create'
            };
            this.option= $.extend({},this.defaults,option);
        }

        Plugin.prototype.init=function(){
            var $textBox = $('#text-cb-text');
            var $contStyle = $('#el-cont-style');
            var pluginBox = $('#teditor');
            var option = this.option;
            var $element = this.$element;
            var move = false, color;
            var btnElse = false;

            var canvas = document.getElementById("bot-cbox-canvas");
            var ctx = canvas.getContext("2d");
            var bcanvas = document.getElementById("back-color");
            var bctx = canvas.getContext("2d");
            var domColor = ($element.attr('data-color')) ? $element.attr('data-color') : '';
            var storage = window.localStorage;
            if (storage.getItem('colorSet')) {
                var colorSet = storage.getItem('colorSet');
                colorSet = colorSet.split(';');
                var his = $('#ted-color-his').children('.ted-his-li');
                var num = colorSet.length;
                for (var i = 0; i < num; i++) {
                    his.eq(i).css('background', colorSet[i]).attr('data-color', colorSet[i]);
                }
            } else {
                var colorSet = [];
            }

            if(option.ctrl == 'create'){
                $textBox.removeAttr('style');
                /* 移除文字元素上的激活状态 */
                $('.pst-element').removeClass('pst-element-act');
                $('.ele-rotate-ctrl').css({left:'-200px',top:'-200px'});
            }
            /* 编辑logo时，载入当前logo的文字 */
            if(option.pluginType == 'other'){
                $textBox.html($element.html());
            }
            if($element.attr('data-url')){
                btnElse = true;
                $('#btnUrl').val($element.attr('data-url'));
                $('#back-link-icon,#back-link-hold').addClass('back-link-act');
                $('.back-link-input input').removeProp('disabled');
            }else{
                $('#btnUrl').val('');
            }
            $('.c-l').removeClass('c-l-act');
            $('.c-l').first().addClass('c-l-act');


            /*------------控件操作事件-------------*/
            /*设置文字字体*/
            pluginBox.off('click','.ted-font-li').on('click','.ted-font-li',function(){
                var fontfm = $(this).attr('data-fm');
                $textBox.css('font-family',fontfm);
                $('.ted-font-li').css('color','#fff');
                $(this).css('color','#00e8d4');
            });
            /*设置文字颜色*/
            pluginBox.off('click','.color-li').on('click','.color-li',function(){
                var color = $(this).attr('data-color');
                $('.color-li').removeClass('color-act');
                $(this).addClass('color-act');
                $textBox.css('color',color).attr('data-color',color);
                putColorStor(colorSet,color);
            });
            $('#bot-cbox-canvas').off('click').on('click',function(e){
                var canvasOffset = $(canvas).offset();
                var canvasX = Math.floor(e.pageX - canvasOffset.left);
                var canvasY = Math.floor(e.pageY - canvasOffset.top);
                var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
                var pixel = imageData.data;
                var color = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
                $('.color-li').removeClass('color-act');
                $('#ted-color-tips').css({left:canvasX+'px','top':canvasY+'px'});
                $textBox.css('color',color).attr('data-color',color);
                putColorStor(colorSet,color);
            });
            var _x,_y;
            $('#bot-cbox-canvas').off('touchstart touchmove touchend').on('touchstart touchmove touchend',function(event){
                if(event.type == "touchstart" ){
                    $('.color-li').removeClass('color-act');
                }else if(event.type == "touchmove" ){
                    event.preventDefault();
                    var e = event.originalEvent.targetTouches[0];
                    move=true;
                    if(move){
                        $('#bot-color-selected').show();
                        $('#ted-color-tips').hide();
                        var canvasOffset = $(canvas).offset();
                        var canvasX = Math.floor(e.pageX - canvasOffset.left);
                        var canvasY = Math.floor(e.pageY - canvasOffset.top);
                        _x = canvasX;
                        _y = canvasY;
                        var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
                        var pixel = imageData.data;
                        color = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
                        var s_left = canvasX-20;
                        var s_top = canvasY-45;
                        $('#bot-color-selected').css({'left':s_left+'px',top:s_top+'px','background':color});
                        $textBox.css('color',color);
                    }
                }else{
                    if(move){
                        $textBox.attr('data-color',color);
                        putColorStor(colorSet,color);
                    }
                    move=false;
                    $('#ted-color-tips').css({left:_x+'px','top':_y+'px'}).show();
                    $('#bot-color-selected').hide();
                }
            });
            /*历史色块的选择*/
            pluginBox.off('click','.ted-his-li').on('click','.ted-his-li',function(){
                var color = $(this).attr('data-color');
                $textBox.css('color',color).attr('data-color',color);
            });
            /* 复位颜色 */
            $('#ted-color-reset').off('click').on('click',function(){
                if(domColor){
                    $textBox.css('color',domColor).attr('data-color',domColor);
                }
            });
            /*---设置颜色值---*/
            $('#ted-color-setval').off('click').on('click', function () {
                $('.ted-color-cvbox').fadeIn(200);
            });
            $('.cvbox-li-rgb input').off('input propertychange').on('input propertychange',function(){
                var rgb = {
                    r:(parseInt($('#ted-cv-r').val()))?parseInt($('#ted-cv-r').val()):0,
                    g:(parseInt($('#ted-cv-g').val()))?parseInt($('#ted-cv-g').val()):0,
                    b:(parseInt($('#ted-cv-b').val()))?parseInt($('#ted-cv-b').val()):0
                };
                if(rgb.r>=0 && rgb.r<=255 && rgb.g>=0 && rgb.g<=255 && rgb.b>=0 && rgb.b<=255){
                    var rColor = rgbToHex(rgb);
                    $('#ted-cv-hex').val(rColor);
                    color = '#'+rColor;
                    $textBox.css('color',color).attr('data-color',color);
                }
            });
            $('#ted-cv-hex').off('input propertychange').on('input propertychange',function(){
                var hColor = $(this).val();
                hColor = hColor.toLowerCase();
                var reg = /^([0-9a-fA-f]{6})$/;
                if(hColor && reg.test(hColor)){
                    color = '#'+hColor;
                    var rgb = hexToRgb(hColor);
                    $('#ted-cv-r').val(rgb.r);
                    $('#ted-cv-g').val(rgb.g);
                    $('#ted-cv-b').val(rgb.b);
                    $textBox.css('color',color).attr('data-color',color);
                }
            });
            $('#ted-cv-set').off('click').on('click',function(){
                if(color){
                    putColorStor(colorSet,color);
                    color = '';
                }
                $('.ted-color-cvbox').fadeOut(200);
            });

            /* RGB格式转为16进制颜色 */
            function rgbToHex(rgb) {
                var hex = [rgb.r.toString(16),rgb.g.toString(16),rgb.b.toString(16)];
                $.each(hex, function(nr, val) {
                    if (val.length === 1) hex[nr] = '0' + val;
                });
                return hex.join('');
            }
            /* 16进制颜色转为RGB格式 */
            function hexToRgb(str){
                /* 16进制颜色值的正则表达式 */
                var reg = /^([0-9a-fA-f]{6})$/;
                var sColor = str.toLowerCase();
                if (sColor && reg.test(sColor)) {
                    /* 处理六位的颜色值 */
                    var sColorChange = [];
                    for (var i = 0; i < 6; i += 2) {
                        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                    }
                    return { 'r': sColorChange[0], 'g': sColorChange[1], 'b': sColorChange[2] };
                } else {
                    return sColor;
                }
            }

            /*设置文字加粗*/
            $('#ted-fontweight').off('click').on('click',function(){
                var weight = $textBox.css('font-weight');
                if(weight == 600){
                    $textBox.css('font-weight',300);
                }else{
                    $textBox.css('font-weight',600);
                }
            });
            /*设置文字倾斜*/
            $('#ted-fontstyle').off('click').on('click',function(){
                var style = $textBox.css('font-style');
                if(style == 'normal'){
                    $textBox.css('font-style','italic');
                }else{
                    $textBox.css('font-style','normal');
                }
            });
            /*设置文字下划线*/
            $('#ted-underline').off('click').on('click',function(){
                var style = $textBox.css('text-decoration');
                if(style == 'underline'){
                    $textBox.css('text-decoration','none');
                }else{
                    $textBox.css('text-decoration','underline');
                }
            });

            /*增大文字字号*/
            $('#ted-fontsizebig').off('click').on('click',function(){
                var size = parseInt($textBox.css('font-size'))*remScale;
                if(size<4){
                    size += 0.1;
                    $textBox.css('font-size',size+'rem');
                }
            });
            /*减小文字字号*/
            $('#ted-fontsizesml').off('click').on('click',function(){
                var size = parseInt($textBox.css('font-size'))*remScale;
                if(size>0.5){
                    size -= 0.1;
                    $textBox.css('font-size',size+'rem');
                }
            });

            /*设置文字左对齐*/
            $('#ted-leftalign').off('click').on('click',function(){
                $textBox.css('text-align','left');
            });
            /*设置文字居中对齐*/
            $('#ted-centeralign').off('click').on('click',function(){
                $textBox.css('text-align','center');
            });
            /*设置文字右对齐*/
            $('#ted-rightalign').off('click').on('click',function(){
                $textBox.css('text-align','right');
            });
            /*设置文字等宽对齐*/
            $('#ted-justify').off('click').on('click',function(){
                $textBox.css('text-align','justify');
            });

            var _x, x,barx,blwidth,bawidth,max,min = 0;
            /*阴影参数*/
            var ef={
                color:'#00e8d4',
                distance:'2',
                blur:'0'
            };
            var rgba = {r:255, g:255, b:255, a:1};
            pluginBox.off('touchstart touchmove touchend','.sl-bar').on('touchstart touchmove touchend','.sl-bar',function(event){
                event.preventDefault();
                var e = event.originalEvent.targetTouches[0];
                if(event.type == "touchstart" ){
                    move=true;
                    _x = e.pageX;//鼠标点击的位置
                    var ths = $(this);
                    barx=parseInt($(this).css('left'));
                    blwidth=parseInt(ths.parent().outerWidth());
                    bawidth=parseInt(ths.outerWidth());
                    max = blwidth-bawidth;
                }else if(event.type == "touchmove" ){
                    if(move){
                        x= e.pageX;//鼠标移动时的位置
                        var s = x-_x+barx;
                        var ths = $(this);
                        var item = ths.attr('data-item');
                        if(item == 'shadow'){
                            max = blwidth-bawidth/2;
                            min = bawidth/2;
                        }
                        if(s>max || s<min){return;}
                        var rate = Math.round(s*100/max);
                        ths.css('left',s+'px');

                        /*设置元素属性效果*/
                        if(item == 'wordspace'){
                            var size = Math.floor(20*rate/100);
                            $textBox.css("letter-spacing", pxToRem(size));
                        }
                        if(item == 'lineheight'){
                            var lh= 1+rate/25;
                            $textBox.css("line-height", lh+'em');
                        }
                        if(item == 'opacity'){
                            rate = 100 - rate;
                            var op = rate/100;
                            $textBox.css("opacity",op);
                        }

                        if(item == 'bwidth'){
                            var bw= rate/100;
                            if($contStyle.css('border-color') == 'rgba(0, 0, 0, 0)'){
                                $contStyle.css('border-color','#03ac9a');
                            }
                            $contStyle.css("border-width", bw+'rem');
                        }
                        if(item == 'bradius'){
                            var br= rate/2;
                            $contStyle.css("border-radius", br+'%');
                        }
                        if(item == 'bopacity'){
                            rate = 100-rate;
                            var color = $contStyle.css('background-color');
                            if(color && color != 'transparent'){
                                color = setRgbaColor({a:rate/100});
                                if(colorType == 'border'){
                                    $contStyle.css('border-color',color);
                                }else{
                                    $contStyle.css('background-color',color);
                                }
                            }
                        }

                        /*滑块设置阴影*/
                        if(item == 'shadow'){
                            if(s>blwidth/2){
                                rate = Math.round(((s-max/2)*50)/(max/2));
                            }else{
                                rate = -Math.round(((max/2-s+min)*50)/(max/2));
                            }
                            ef.distance = 10*rate/50;
                            var efstyle = ef.color+' '+ef.distance+'px '+ef.distance+'px ';
                            if(ef.blur != '0'){efstyle += '5px';}
                            $textBox.css("text-shadow", efstyle)
                            var obtog = ths.parents('.ted-effects-top').siblings('.teb-effects-bot').children('.base-bot-name').children('.effect-toggle');
                            openEff(obtog);
                        }
                        ths.parents('.base-bot-slide').siblings('.base-bot-value').html(rate);
                    }
                }else{
                    move=false;
                }
            });
            /*阴影的关闭与打开*/
            pluginBox.off('click','.effect-toggle').on('click','.effect-toggle',function(){
                var ths = $(this);
                var tgo = ths.children('.tog-line');
                var open = ths.attr('data-tog');
                if(open == '0'){
                    tgo.animate({left:'0px'},100);
                    ths.attr('data-tog','1');
                    if(ef.blur != '0'){ef.blur = '5px';}
                    setEff($textBox,ef);
                }else{
                    tgo.animate({left:'-30px'},100);
                    ths.attr('data-tog','0');
                    $textBox.css('text-shadow','');
                }
            });
            /*阴影的模糊与变硬*/
            pluginBox.off('click','.effects-style').on('click','.effects-style',function(){
                if($(this).hasClass('es-act')){
                    ef.blur = '0';
                    $(this).removeClass('es-act');
                }else{
                    ef.blur = '5px';
                    $(this).addClass('es-act');
                }
                setEff($textBox,ef);
                var obtog = $(this).siblings('.base-bot-name').children('.effect-toggle');
                openEff(obtog);
            });
            /*阴影的颜色设置*/
            $('#effects-color-list').off('touchstart touchmove touchend').on('touchstart touchmove touchend',function(event){
                event.preventDefault();
                event.stopPropagation();
                var e = event.originalEvent.targetTouches[0];
                if(event.type == "touchstart" ){
                    var targ=$(event.target);
                    ef.color = targ.attr('data-color');
                    var tbox= $('#teditor').offset();
                    var tX = Math.floor(e.pageX-tbox.left)-20;
                    var tY = Math.floor(e.pageY-tbox.top)-45;
                    $('#eff-color-selected').show().css({'left':tX+'px',top:tY+'px','background':ef.color});
                    setEff($textBox,ef);
                    var obtog = $(this).parents('.teb-effects-bot').children('.base-bot-name').children('.effect-toggle');
                    openEff(obtog);
                }else if(event.type == "touchmove" ){
                    move=true;
                    if(move){
                        $('#eff-color-selected').show();
                        var tbox= $('#teditor').offset();
                        var tX = Math.floor(e.pageX-tbox.left)-20;
                        var tY = Math.floor(e.pageY-tbox.top)-45;
                        var uleft = $('#effects-color-list').offset().left;
                        var utop = $('#effects-color-list').offset().top;
                        var uwidth = $('#effects-color-list').parent().outerWidth();
                        if(utop+20>e.pageY && e.pageY>utop && uleft+uwidth>e.pageX && e.pageX>uleft ){
                            var distance = Math.floor(e.pageX-uleft);
                            var num = Math.floor(distance/5);
                            ef.color = $('#effects-color-list').children().eq(num).attr('data-color');
                            $('#eff-color-selected').show().css({'left':tX+'px',top:tY+'px','background':ef.color});
                            setEff($textBox,ef);
                        }else{
                            $('#eff-color-selected').hide();
                        }
                    }
                }else{
                    move=false;
                    $('#eff-color-selected').hide();
                }
            });


            /* 切换颜色设置类别 */
            var colorType = 'border';
            $('.c-l').off('click').on('click',function(){
                var ths = $(this);
                $('.c-l').removeClass('c-l-act');
                ths.addClass('c-l-act');
                colorType = ths.attr('data-item');
            });
            /* 边框背景的颜色选择-点击 */
            $('#back-color').off('click').on('click',function(e){
                var canvasOffset = $(bcanvas).offset();
                var canvasX = Math.floor(e.pageX - canvasOffset.left);
                var canvasY = Math.floor(e.pageY - canvasOffset.top);
                var imageData = bctx.getImageData(canvasX, canvasY, 1, 1);
                var pixel = imageData.data;
                color = setRgbaColor({r:pixel[0],g:pixel[1],b:pixel[2]});
                if(colorType == 'border'){
                    $contStyle.css('border-color',color);
                }else{
                    $contStyle.css('background-color',color);
                }
            });
            /* 边框背景的颜色选择-滑动 */
            $('#back-color').off('touchstart touchmove touchend').on('touchstart touchmove touchend',function(event){
                if(event.type == "touchstart" ){

                }else if(event.type == "touchmove" ){
                    event.preventDefault();
                    event.stopPropagation();
                    var e = event.originalEvent.targetTouches[0];
                    move=true;
                    if(move){
                        $('#back-color-selected').show();
                        var canvasOffset = $(bcanvas).offset();
                        var canvasX = Math.floor(e.pageX - canvasOffset.left);
                        var canvasY = Math.floor(e.pageY - canvasOffset.top);
                        _x = canvasX;
                        _y = canvasY;
                        var imageData = bctx.getImageData(canvasX, canvasY, 1, 1);
                        var pixel = imageData.data;
                        color = setRgbaColor({r:pixel[0],g:pixel[1],b:pixel[2]});
                        var s_left = canvasX+20;
                        var s_top = canvasY-45;
                        $('#back-color-selected').css({'left':s_left+'px',top:s_top+'px','background':color});
                        if(colorType == 'border'){
                            $contStyle.css('border-color',color);
                        }else{
                            $contStyle.css('background-color',color);
                        }
                    }
                }else{
                    move=false;
                    $('#back-color-selected').hide();
                }
            });
            /* 清除当前元素应用的边框或背景样式 */
            $('#back-color-clear').on('click',function(){
                if(colorType == 'border'){
                    $contStyle.css('border','');
                }else if(colorType == 'background'){
                    $contStyle.css('background-color','transparent');
                }else{}
            });

            /* 激活元素按钮属性 */
            $('#back-link-icon').off('click').on('click',function(){
                var $inp = $(this).siblings('.back-link-input').children();
                if($(this).hasClass('back-link-act') && btnElse){
                    $('#back-link-icon,#back-link-hold').removeClass('back-link-act');
                    $inp.prop('disabled','disabled');
                    btnElse = false;
                }else{
                    $('#back-link-icon,#back-link-hold').addClass('back-link-act');
                    $inp.removeProp('disabled');
                    btnElse = true;
                }
            });
            /* 锁定按钮的链接内容 */
            $('#back-link-hold').off('click').on('click',function(){
                if($('#back-link-icon').hasClass('back-link-act')){
                    var $inp = $(this).siblings('.back-link-input').children();
                    if($(this).hasClass('back-link-act')){
                        $(this).removeClass('back-link-act');
                        $inp.prop('disabled','disabled');
                    }else{
                        $(this).addClass('back-link-act');
                        $inp.removeProp('disabled');
                    }
                }
            });


            /* 确定操作 */
            $('#text-add').off('click').on('click',function(){
                var cont = $('#text-cb-text').html();
                var newt = releaseScript(cont);
                cont = releaseDiv(cont);
                if(cont != ''){
                    if(option.ctrl == 'modify'){
                        if($textBox.attr('data-color')){
                            $element.attr('data-color',$textBox.attr('data-color'));
                            $textBox.attr('data-color','');
                        }
                        if(option.pluginType == 'other'){
                            $element.html(newt);
                            $element.attr('style',$textBox.attr('style')+$contStyle.attr('style'));
                        }else{
                            $element.attr('style',$textBox.attr('style'));
                            $element.children('.el-content').attr('style',$contStyle.attr('style'));
                            /* 高度修正 */
                            $element.children('.el-content').css('height',pxToRem($contStyle.outerHeight()));
                            $element.children('.el-content').html(newt);
                            makeBtn(btnElse,$element);
                            moveCtrlBtn($element.children().slice(1));
                        }
                    }else if(option.ctrl == 'create'){
                        var style= $textBox.attr('style')||'';
                        var contstyle = $contStyle.attr('style')||'';
                        var h = '<div class="pst-element text-element" style="'+style+'">';
                            h+= '   <div class="el-content" style="'+contstyle+'">'+newt+'</div>';
                            h+= '   <div class="el-rotate"></div>';
                            h+= '   <div class="el-editor"></div><div class="el-delete"></div><div class="el-copy"></div>';
                            h+= '</div>';
                        var $h = $(h);
                        if($textBox.attr('data-color')){
                            $h.attr('data-color',$textBox.attr('data-color'));
                            $textBox.attr('data-color','');
                        }
                        var $ele = makeBtn(btnElse,$h);
                        postcontainer.children().first().append($ele);
                        $ele.children('.el-content').trigger('click');
                    }else{
                        return;
                    }

                    $contStyle.attr('style','');
                    $textBox.attr('style','');
                    $('.back-link-icon,.back-link-hold').removeClass('back-link-act');
                    $('.back-link-input input').prop('disabled','disabled');
                }else{
                    if(option.ctrl == 'modify'){
                        if(option.pluginType == 'other'){
                           $element.html('none');
                        }else{
                            $element.remove();
                            $('.ele-rotate-ctrl').css({left:'-200px',top:'-200px'});
                        }
                    }
                }
                $textBox.html('');
                $('#text-model').removeClass('open');
            });


            /* 方法 */
            function getRgbaColor(){
                return 'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+rgba.a+')';
            }
            function setRgbaColor(color){
                if(color){
                    for(c in color){
                        rgba[c] = color[c];
                    }
                    return 'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+rgba.a+')';
                }
                return 'rgba(255,255,255,1)';
            }
            function actTextElement(ths){
                $('.pst-element').removeClass('pst-element-act').css('z-index','100');
                ths.addClass('pst-element-act').css('z-index','110');
                ths.tEditor({ctrl:'modify'});
                ths.domRotate(function(ths){
                    $('#text-model').addClass('open');
                    var text = ths.children('.el-content').html();
                    $('#text-cb-text').html(text).attr('style',ths.attr('style'));
                    $('#el-cont-style').attr('style',ths.children('.el-content').attr('style'));
                });
            }

            function releaseDiv(cont){
                if(cont == ''){ return '';}
                cont = cont.replace(/&nbsp;/g,"");
                cont = cont.replace(/<\/?.+?>/g,"");
                cont = cont.replace(/\n/g,"");
                return cont;
            }
            function releaseScript(cont){
                if(cont == ''){ return '';}
                cont = cont.replace(/\n/g,"<br>");
                var $elem = $('<div>'+cont+'</div>');
                if($elem.find('script').length >0){
                    $elem.find('script').remove();
                }
                return $elem.html();
            }
            function makeBtn(type,$elem){
                if(type){
                    var url = $('#btnUrl').val();
                    url = releaseDiv(url);
                    $elem.attr({'data-url':url}).addClass('button-element');
                }else{
                    $elem.removeAttr('data-url').removeClass('button-element');
                }
                return $elem;
            }
            function openEff(ths){
                var tgo = ths.children('.tog-line');
                var open = ths.attr('data-tog');
                if(open == '1'){return;}
                tgo.animate({left:'0px'},100);
                ths.attr('data-tog','1');
            }
            function setEff(ths,ef){
                var efstyle =ef.color+' '+ef.distance+'px '+ef.distance+'px ';
                if(ef.blur != '0'){
                    efstyle += ef.blur;
                }
                ths.css('text-shadow',efstyle);
            }
            function moveCtrlBtn($obj){
                var stop = posterView.scrollTop();
                for(var i=0;i<$obj.length;i++){
                    var ths = $($obj[i]);
                    var clas = ths.attr('class');
                    var item = clas.slice(3);
                    var pos = ths.offset();
                    var sx = pos.left;
                    var sy = pos.top+stop+rh;
                    $('#ele-'+item+'-ctrl').css({left:sx+'px',top:sy+'px'});
                }
            }

            function putColorStor(colorset, color) {
                var num = colorset.length;
                if (num == 3) {
                    colorset.shift();
                }
                colorset.push(color);
                var his = $('#ted-color-his').children('.ted-his-li');
                for (var i = 0; i < num; i++) {
                    his.eq(i).css('background', colorset[i]).attr('data-color', colorset[i]);
                }
                colorset = colorset.join(';');
                storage.setItem('colorSet', colorset);
            }
            function pxToRem(lenpx){
                return lenpx*remScale+'rem';
            }


        };

        $.fn.tEditor = function(option){
            var tedit = new Plugin(this,option);
            tedit.init();
            return this;
        }

    })(jQuery);
    (function($){
        $.fn.domRotate= function(editCallback){
            var $element = this;
            var elcont = $element.children('.el-content');
            moveCtrlBtn($element.children().slice(1));

            var bx, by, _bx, _by,move=false,active=false;
            var midp={},botp={},rbotp={},movp={},elep={},dlength;
            /* element移动 */
            $element.off('touchstart touchmove touchend','.el-content').on('touchstart touchmove touchend','.el-content',function(event){
                var e = event.originalEvent.targetTouches[0];
                event.preventDefault();
                if (event.type == "touchstart"){
                    _bx = e.pageX;
                    _by = e.pageY;
                    elep.left = parseInt($element.css('left'));
                    elep.top = parseInt($element.css('top'));
                    elep.width = elcont.outerWidth();
                    elep.height = elcont.outerHeight();
                    if($element.hasClass('pst-element-act')){active = true;}
                } else if (event.type == "touchmove") {
                    move = true;
                    if (move){
                        bx = e.pageX;
                        by = e.pageY;
                        var sx = bx - _bx + elep.left;
                        var sy = by - _by + elep.top;
                        $element.css({'left':pxToRem(sx),'top':pxToRem(sy)});
                        if(active){
                            moveCtrlBtn($element.children().slice(1));
                        }
                    }
                }else{
                    move = false;
                }
            });
            /* element旋转控制 */
            $('#ele-rotate-ctrl').off('touchstart touchmove touchend').on('touchstart touchmove touchend',function(event){
                var e = event.originalEvent.targetTouches[0];
                event.stopPropagation();
                event.preventDefault();
                if (event.type == "touchstart"){
                    elep.width = elcont.outerWidth();
                    elep.height = elcont.outerHeight();
                    _bx = e.pageX;
                    _by = e.pageY;
                    /*右下角现在的位置*/
                    var pos = $element.children('.el-rotate').offset();
                    var fbox = $element.parent().offset();
                    rbotp.left = pos.left-fbox.left;
                    rbotp.top = pos.top-fbox.top;
                    /*中点，原右下角的位置*/
                    elep.left = parseInt($element.css('left'));
                    elep.top = parseInt($element.css('top'));
                    midp.left = elep.left+elep.width/2;
                    midp.top = elep.top+elep.height/2;
                    botp.left = elep.left+elep.width;
                    botp.top = elep.top+elep.height;
                    dlength = getTwoPointDistance(midp,botp);
                } else if (event.type == "touchmove") {
                    move = true;
                    if (move){
                        bx = e.pageX;
                        by = e.pageY;
                        movp.left = rbotp.left + bx - _bx;
                        movp.top = rbotp.top + by - _by;
                        var bvl = getTwoPointDistance(botp,movp);
                        var mbl = getTwoPointDistance(midp,botp);
                        var mvl = getTwoPointDistance(midp,movp);
                        var ndeg = getTwoLineDeg(mbl,mvl,bvl);
                        var nrate = mvl/dlength;
                        if(getRotateDirect(midp,botp,movp)>0){
                            ndeg = -180*ndeg/Math.PI;
                        }else{
                            ndeg = 180*ndeg/Math.PI;
                        }
                        ndeg = keepTwoValid(ndeg);
                        nrate = keepTwoValid(nrate);
                        var ew = elep.width*nrate;
                        var eh = elep.height*nrate;
                        var nl = elep.left-(ew-elep.width)/2;
                        var nt = elep.top-(eh-elep.height)/2;
                        var tranf = 'rotate('+ndeg+'deg)';
                        elcont.css({'width':pxToRem(ew),'height':pxToRem(eh)});
                        /*
                        高度自适应--这样控制块不能始终跟随触点
                        elcont.css({'width':pxToRem(ew)});
                        var eh = elcont.outerHeight();
                        var nt = elep.top-(eh-elep.height)/2;
                        */
                        $element.css({'left':pxToRem(nl),'top':pxToRem(nt),'transform':tranf});
                        moveCtrlBtn($element.children().slice(1));
                    }
                } else {
                    move = false;
                }
            });
            /* element编辑 */
            $('#ele-editor-ctrl').off('click').on('click',function(e){
                e.stopPropagation();
                editCallback($element);
            });
            /* element删除 */
            $('#ele-delete-ctrl').off('click').on('click',function(e){
                e.stopPropagation();
                var $prevElement = $element.siblings('.pst-element');
                $element.remove();
                if($prevElement.length){
                    var $ele = $prevElement.last();
                    $ele.children('.el-content').trigger('click');
                }else{
                    $('.ele-rotate-ctrl').css({left:'-200px',top:'-200px'});
                }
            });
            /* element复制 */
            $('#ele-copy-ctrl').off('click').on('click',function(e){
                e.stopPropagation();
                var $newel =$element.clone();
                var top= parseInt($element.css('top'))+30;
                $element.parent().append($newel);
                $newel.css({'top':top+'px'});
                $newel.children('.el-content').trigger('click');
            });
            function pxToRem(lenpx){
                return lenpx*remScale+'rem';
            }

            function getTwoLineDeg(lone,ltwo,lthr){
                return (Math.acos((Math.pow(lone,2)+Math.pow(ltwo,2)-Math.pow(lthr,2))/(2*lone*ltwo))).toFixed(6);
            }
            function getTwoPointDistance(pone,ptwo){
                var x =  ptwo.left-pone.left;
                var y =  ptwo.top-pone.top;
                return Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5);
            }

            function getRotateDirect(a,b,c){
                return (c.left- a.left)*(b.top- a.top)-(b.left-a.left)*(c.top- a.top)
            }
            function keepTwoValid(num){
                num=parseFloat(num);
                return num.toFixed(4);
            }
            function moveCtrlBtn($obj){
                var stop = posterView.scrollTop();
                for(var i=0;i<$obj.length;i++){
                    var ths = $($obj[i]);
                    var clas = ths.attr('class');
                    var item = clas.slice(3);
                    var pos = ths.offset();
                    var sx = pos.left;
                    var sy = pos.top+stop+rh;
                    $('#ele-'+item+'-ctrl').css({left:sx+'px',top:sy+'px'});
                }
            }
        }
    })(jQuery);

//    $('#text-cb-text').tEditor({ctrl:'modify'});
    postcontainer.on('click','.el-content',function(event){
        //event.stopPropagation();
        var ths = $(this).parent();
        $('.pst-element').removeClass('pst-element-act').css('z-index','100');
        ths.addClass('pst-element-act').css('z-index','110');
        if(ths.hasClass('text-element')){
            ths.tEditor({ctrl:'modify'});
            ths.domRotate(function(ths){
                $('#text-model').addClass('open');
                var text = ths.children('.el-content').html();
                $('#text-cb-text').html(text).attr('style',ths.attr('style'));
                $('#el-cont-style').attr('style',ths.children('.el-content').attr('style'));
            });
        }
        if(ths.hasClass('systemimg-element')){
            ths.domRotate(function(ths){
                var nsvg = ths.find('svg');
                nsvg.parent().attr('id','active-svg-edit');
                var $svg = nsvg.clone();
                $('#sysimg-wrap').append($svg);
                var schild = $svg.children();
                var len = schild.length;
                var li='';
                for(var i=0;i<len;i++){
                    li += '<div class="item" data-item="'+i+'" data-style="'+schild.eq(i).attr('style')+'">';
                    li += '<span class="item-name">元素'+(i+1)+'</span>';
                    li += '<span class="item-reset">复位</span>';
                    li += '<span class="item-color">点击修改颜色</span>';
                    li += '</div>';
                }
                $('#sysimg-edit .list').append(li);
                $('#systemimg-edit-model').addClass('open');
            });
        }
        if(ths.hasClass('uploadimg-element')){
            $('#ele-editor-ctrl').hide();
            ths.domRotate(function(ths){return;});
        }else{
            $('#ele-editor-ctrl').show();
        }
    });


    /* contenteditable的聚焦 */
    var editor = document.getElementById('text-cb-text');
    editor.onfocus = function () {
        window.setTimeout(function(){
            var sel,range;
            if (window.getSelection && document.createRange) {
                range = document.createRange();
                range.selectNodeContents(editor);
                range.collapse(true);
                range.setEnd(editor, editor.childNodes.length);
                range.setStart(editor, editor.childNodes.length);
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }else if (document.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(editor);
                range.collapse(true);
                range.select();
            }
        }, 1);
    };

    $('.text-cont-box').on('click',function(){
        $('#text-cb-text').focus();
    });

    /* 文字编辑菜单栏切换 */
    $('.ted-menu-li').on('click',function(){
        var item = $(this).attr('data-item');
        $('.ted-menu-li').removeClass('ted-menu-act');
        $(this).addClass('ted-menu-act');
        $('.ted-ctrl-li').fadeOut(200);
        $('#ted-ctrl-'+item).fadeIn(200);
    });
    $('.text-element').removeClass('text-element-act');

});
