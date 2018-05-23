

;(function(){
    var defaults, pluginName;
    var colorArr =
        ['#817936','#7f7522','#80752c','#87843b','#726930','#454926','#2e3a1f','#4d4f36','#b7ba6b','#b2d235',
        '#5c7a29','#bed742','#7fb80e','#a3cf62','#769149','#6d8346','#78a355','#abc88b','#74905d','#cde6c7',
        '#1d953f','#77ac98','#007d65','#84bf96','#45b97c','#225a1f','#367459','#007947','#40835e','#2b6447',
        '#005831','#006c54','#375830','#274d3d','#375830','#27342b','#65c294','#73b9a2','#72baa7','#005344',
        '#122e29','#293047','#00ae9d','#508a88','#70a19f','#50b7c1','#00a6ac','#78cdd1','#008792','#94d6da',
        '#afdfe4','#5e7c85','#76becc','#90d7ec','#009ad6','#145b7d','#11264f','#7bbfea','#33a3dc','#228fbd',
        '#2468a2','#2570a1','#2585a6','#1b315e','#f7acbc','#ef5b9c','#feeeed','#f05b72','#f15b6c','#f8aba6',
        '#f69c9f','#f58f98','#ca8687','#f391a9','#bd6758','#d71345','#d64f44','#d93a49','#b3424a','#c76968',
        '#bb505d','#987165','#ac6767','#973c3f','#b22c46','#a7324a','#aa363d','#ed1941','#f26522','#d2553d',
        '#b4534b','#ef4136','#c63c26','#f3715c','#a7573b','#aa2116','#b64533','#b54334','#853f04','#840228',
        '#7a1723','#a03939','#8a2e3b','#8e453f','#8f4b4a','#892f1b','#6b2c25','#733a31','#54211d','#78331e',
        '#53261f','#f15a22','#b4533c','#84331f','#f47a55','#f15a22','#f3704b','#da765b','#c85d44','#ae5039',
        '#6a3427','#8f4b38','#8e3e1f','#f36c21','#b4532a','#b7704f','#de773f','#c99979','#deab8a','#fedcbd',
        '#f47920','#905a3d','#8f4b2e','#87481f','#5f3c23','#6b473c','#faa755','#fab27b','#f58220','#843900',
        '#905d1d','#8a5d19','#8c531b','#826858','#64492b','#ae6642','#56452d','#96582a','#705628','#4a3113',
        '#412f1f','#845538','#8e7437','#69541b','#d5c59f','#cd9a5b','#cd9a5b','#b36d41','#df9464','#b76f40',
        '#ad8b3d','#dea32c','#d1923f','#c88400','#c37e00','#c37e00','#e0861a','#ffce7b','#fcaf17','#ba8448',
        '#896a45','#76624c','#6d5826','#ffc20e','#fdb933','#d3c6a6','#c7a252','#dec674','#b69968','#c1a173',
        '#dbce8f','#ffd400','#ffd400','#ffe600','#f0dc70','#fcf16e','#decb00','#cbc547','#6e6b41','#596032',
        '#525f42','#5f5d46','#444693','#2b4490','#2a5caa','#224b8f','#003a6c','#102b6a','#426ab3','#46485f',
        '#4e72b8','#181d4b','#1a2933','#121a2a','#0c212b','#6a6da9','#585eaa','#494e8f','#afb4db','#9b95c9',
        '#6950a1','#6f60aa','#867892','#918597','#6f6d85','#594c6d','#694d9f','#6f599c','#8552a1','#543044',
        '#63434f','#7d5886','#401c44','#472d56','#45224a','#411445','#4b2f3d','#402e4c','#c77eb5','#ea66a6',
        '#f173ac','#fffffb','#fffef9','#f6f5ec','#d9d6c3','#d1c7b7','#f2eada','#d3d7d4','#999d9c','#a1a3a6',
        '#9d9087','#8a8c8e','#74787c','#7c8577','#72777b','#77787b','#4f5555','#6c4c49','#563624','#3e4145',
        '#3c3645','#464547','#130c0e','#281f1d','#2f271d','#1d1626'];
    var fontFamily= ['Consolas','微软雅黑'];
    pluginName = "teditor";
    defaults = {
        colorArr:colorArr,
        fontFamily:fontFamily
    };

    var Plugin = function(ele,option) {
        this.$element = ele;
        this.defaults=defaults;
        this.option= $.extend({},this.defaults,option);
    }
    Plugin.prototype.init=function(){
        var _this = this;
        var $element = $(_this.$element);
        var pluginBox = $('#'+pluginName);
        var move=false;
        /*载入控件dom*/
        var ch = pluginBox.children().length;
        if(!ch){
            var cdiv = '';
            cdiv += '<div class="ted-ctrl"><div class="ted-ctrl-li ted-ctrl-base" id="ted-ctrl-base"><div class="ted-base-top"><div class="base-top-left">';
            cdiv += '<ul><li class="btn btn-default" id="ted-fontweight">B</li><li class="btn btn-default" id="ted-fontstyle">/</li><li class="btn btn-default" id="ted-underline">U</li></ul></div>';
            cdiv += '<div class="base-top-right"><ul><li class="btn btn-default" id="ted-copy"><span class="glyphicon glyphicon-duplicate"></span></li><li class="btn btn-default" id="ted-delete"><span class="glyphicon glyphicon-trash"></span></li></ul></div>';
            cdiv += '<div class="base-top-group"><div class="base-top-font btn-group">';
            cdiv += '<button type="button" class="btn btn-default" id="ted-fontsizebig"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></button>';
            cdiv += '<button type="button" class="btn btn-default" id="ted-fontsizesml"><span class="glyphicon glyphicon-zoom-out" aria-hidden="true"></span></button>';
            cdiv += '</div><div class="base-top-align btn-group">';
            cdiv += '<button type="button" class="btn btn-default" id="ted-leftalign"><span class="glyphicon glyphicon-align-left" aria-hidden="true"></span></button>';
            cdiv += '<button type="button" class="btn btn-default" id="ted-centeralign"><span class="glyphicon glyphicon-align-center" aria-hidden="true"></span></button>';
            cdiv += '<button type="button" class="btn btn-default" id="ted-rightalign"><span class="glyphicon glyphicon-align-right" aria-hidden="true"></span></button>';
            cdiv += '<button type="button" class="btn btn-default" id="ted-justify"><span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span></button>';
            cdiv += '</div></div>';
            cdiv += '<div class="ted-base-bot"><div class="base-bot-name">字间宽</div><div class="base-bot-value">0</div><div class="base-bot-slide"><div class="slideline"><div class="sl-bar" data-item="wordspace"></div></div></div></div>';
            cdiv += '<div class="ted-base-bot"><div class="base-bot-name">行高</div><div class="base-bot-value">0</div><div class="base-bot-slide"><div class="slideline"><div class="sl-bar" data-item="lineheight"></div></div></div></div></div></div>';
            cdiv += '<div class="ted-ctrl-li ted-ctrl-color" id="ted-ctrl-color"><div class="ted-color-top"><ul class="color-list">';
            for(var i=0;i<this.option.colorArr.length;i++){
                cdiv += '<li class="color-li" style="background:'+this.option.colorArr[i]+';" data-color="'+this.option.colorArr[i]+'"></li>';
            }
            cdiv += '</ul></div><div class="ted-color-bot"><div class="bot-cbox"><div id="bot-color-selected"></div><canvas id="bot-cbox-canvas" width="800" height="200"></canvas></div></div></div>';
            cdiv += '<div class="ted-ctrl-li ted-ctrl-font" id="ted-ctrl-font"><div class="font-list"><ul>';
            for(var i=0;i<this.option.fontFamily.length;i++){
                cdiv += '<li class="ted-font-li" style="font-family:&#39;'+this.option.fontFamily[i]+'&#39;;" data-fm="'+this.option.fontFamily[i]+'">'+this.option.fontFamily[i]+'</li>';
            }
            cdiv += '</ul></div></div>';
            cdiv += '<div class="ted-ctrl-li ted-ctrl-effects" id="ted-ctrl-effects">';
            cdiv += '<div class="ted-effects-li ted-effects-opacity"><div class="base-bot-name">透明度</div><div class="base-bot-value">100</div><div class="base-bot-slide"><div class="slideline"><div class="sl-bar" data-item="opacity"></div></div></div></div>';
            cdiv += '<div class="ted-effects-li"><div class="base-bot-name">阴影</div><div class="base-bot-value">0</div><div class="base-bot-slide"><div class="slideline"><div class="sl-bar ted-eff-bar" data-item="shadow"></div></div></div></div></div></div></div>';
            cdiv += '<div class="ted-menu"><ul><li class="ted-menu-li ted-menu-base ted-menu-act" data-item="base">基本</li><li class="ted-menu-li ted-menu-color" data-item="color">颜色</li><li class="ted-menu-li ted-menu-font " data-item="font">字体</li><li class="ted-menu-li ted-menu-effects" data-item="effects">特效</li></ul></div>';
            pluginBox.append(cdiv);

            var canvas = document.getElementById("bot-cbox-canvas");
            var ctx=canvas.getContext("2d");
            var boxwidth=parseInt($('.bot-cbox').width());
            var boxheight=parseInt($('.bot-cbox').height());
            var grd=ctx.createLinearGradient(0,0,boxwidth,0);
                grd.addColorStop(0,"red");
                grd.addColorStop(0.15,"#f96");
                grd.addColorStop(0.35,"yellow");
                grd.addColorStop(0.50,"green");
                grd.addColorStop(0.70,"#ace");
                grd.addColorStop(0.85,"blue");
                grd.addColorStop(1,"blueviolet");
                ctx.fillStyle=grd;
                ctx.fillRect(0,0,boxwidth,boxheight);
        }else{
            var canvas = document.getElementById("bot-cbox-canvas");
            var ctx=canvas.getContext("2d");
        }

        /*------------控件操作事件-------------*/
        /*删除文本*/
        pluginBox.off('click','#ted-delete').on('click','#ted-delete',function(){
            $element.remove();
        });
        /*复制文本*/
        pluginBox.off('click','#ted-copy').on('click','#ted-copy',function(){
            var newel =$element.clone();
            var eid = parseInt($element.attr('data-eid'))+1;
            var top= parseInt($element.css('top'))+30;
            $element.parent().append(newel);
            $element.parent().children().css('z-index','100').removeClass('name-li-act');
            newel.attr({'data-eid':eid,'class':'name-li name'+eid,}).css({'top':top+'px','z-index':'110'}).addClass('name-li-act');
        });

        /*设置文字字体*/
        pluginBox.off('click','.ted-font-li').on('click','.ted-font-li',function(){
            var fontfm = $(this).attr('data-fm');
             console.log(fontfm);
            $element.css('font-family',fontfm);
        });
        /*设置文字颜色*/
        pluginBox.off('click','.color-li').on('click','.color-li',function(){
            var color = $(this).attr('data-color');
            $('.color-li').removeClass('color-act');
            $(this).addClass('color-act');
            $element.css('color',color);
        });
        pluginBox.off('click','#bot-cbox-canvas').on('click','#bot-cbox-canvas',function(e){
            var canvasOffset = $(canvas).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);
            var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
            var pixel = imageData.data;
            var color = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
            $('.color-li').removeClass('color-act');
            $element.css('color',color);
        });

        pluginBox.off('touchstart touchmove touchend','#bot-cbox-canvas').on('touchstart touchmove touchend','#bot-cbox-canvas',function(event){
            if(event.type == "touchstart" ){
                move=true;
                $('.color-li').removeClass('color-act');
            }else if(event.type == "touchmove" ){
                event.preventDefault();
                var e = event.originalEvent.targetTouches[0];
                if(move){
                    $('#bot-color-selected').show();
                    var canvasOffset = $(canvas).offset();
                    var canvasX = Math.floor(e.pageX - canvasOffset.left);
                    var canvasY = Math.floor(e.pageY - canvasOffset.top);
                    var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
                    var pixel = imageData.data;
                    var color = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
                    var sleft = e.pageX-20;
                    var stop = e.pageY-40;
                    $('#bot-color-selected').css({'left':sleft+'px',top:stop+'px','background':color});
                    $element.css('color',color);
                }
            }else{
                move=false;
                $('#bot-color-selected').hide();
            }
        });

        /*设置文字加粗*/
        pluginBox.off('click','#ted-fontweight').on('click','#ted-fontweight',function(){
            var weight = $element.css('font-weight');
            if(weight == 600){
                $element.css('font-weight',300);
            }else{
                $element.css('font-weight',600);
            }
        });
        /*设置文字倾斜*/
        pluginBox.off('click','#ted-fontstyle').on('click','#ted-fontstyle',function(){
            var style = $element.css('font-style');
            if(style == 'normal'){
                $element.css('font-style','italic');
            }else{
                $element.css('font-style','normal');
            }
        });
        /*设置文字下划线*/
        pluginBox.off('click','#ted-underline').on('click','#ted-underline',function(){
            var style = $element.css('text-decoration');
            if(style == 'underline'){
                $element.css('text-decoration','none');
            }else{
                $element.css('text-decoration','underline');
            }
        });
        /*增大文字字号*/
        pluginBox.off('click','#ted-fontsizebig').on('click','#ted-fontsizebig',function(){
            var size = parseInt($element.css('font-size'));
            if(size<72){
                size +=1;
                $element.css('font-size',size+'px');
            }
        });
        /*增大文字字号*/
        pluginBox.off('click','#ted-fontsizesml').on('click','#ted-fontsizesml',function(){
            var size = parseInt($element.css('font-size'));
            if(size>12){
                size -=1;
                $element.css('font-size',size+'px');
            }
        });
        /*设置文字左对齐*/
        pluginBox.off('click','#ted-leftalign').on('click','#ted-leftalign',function(){
            $element.css('text-align','left');
        });
        /*设置文字居中对齐*/
        pluginBox.off('click','#ted-centeralign').on('click','#ted-centeralign',function(){
            $element.css('text-align','center');
        });
        /*设置文字右对齐*/
        pluginBox.off('click','#ted-rightalign').on('click','#ted-rightalign',function(){
            $element.css('text-align','right');
        });
        /*设置文字等宽对齐*/
        pluginBox.off('click','#ted-justify').on('click','#ted-justify',function(){
            $element.css('text-align','justify');
        });

        var _x, x,barx;
        var blwidth=parseInt($('.slideline').width());
        var bawidth=parseInt($('.sl-bar').width());
        var max = blwidth-bawidth;
        var min = 0;
        pluginBox.off('touchstart touchmove touchend','.sl-bar').on('touchstart touchmove touchend','.sl-bar',function(event){
            if(event.type == "touchstart" ){
                var e = event.originalEvent.targetTouches[0];
                move=true;
                _x = e.pageX;//鼠标点击的位置
                barx=parseInt($(this).css('left'));
            }else if(event.type == "touchmove" ){
                event.preventDefault();
                var e = event.originalEvent.targetTouches[0];
                if(move){
                    x= e.pageX;//鼠标移动时的位置
                    var s = x-_x+barx;
                    var ths = $(this);
                    var item = ths.attr('data-item');
                    if(item == 'shadow'){
                        max = blwidth-bawidth/2;
                        min = bawidth/2;
                    }
                    s = (s>max)?max:s;
                    s = (s<min)?min:s;
                    var rate = Math.round(s*100/max);
                    ths.css('left',s+'px');

                    /*设置元素属性效果*/
                    if(item == 'wordspace'){
                        var size = Math.floor(20*rate/100);
                        $element.css("letter-spacing", size+'px');
                    }
                    if(item == 'lineheight'){
                        var lh= 1+rate/100;
                        $element.css("line-height", lh+'em');
                    }
                    if(item == 'opacity'){
                        rate = 100 - rate;
                        var op = rate/100;
                        $element.css("opacity",op);
                    }
                    if(item == 'shadow'){
                        if(s>blwidth/2){
                            rate = Math.round(((s-max/2)*50)/(max/2));
                        }else{
                            rate = -Math.round(((max/2-s+min)*50)/(max/2));
                        }
                        var sh = 10*rate/50;
                        var tsh = '#00e8d4 '+sh+'px '+sh+'px 5px';
                        $element.css("text-shadow", tsh);
                    }
                    ths.parents('.base-bot-slide').siblings('.base-bot-value').html(rate);
                }
            }else{
                move=false;
            }
        });

        /*操作后样式控制*/
        pluginBox.off('click','.ted-menu-li').on('click','.ted-menu-li',function(){
            $('.ted-menu-li').removeClass('ted-menu-act');
            $(this).addClass('ted-menu-act');
            var item = $(this).attr('data-item');
            $('.ted-ctrl-li').fadeOut(200);
            $('#ted-ctrl-'+item).fadeIn(200);
        });
        pluginBox.off('click','.ted-font-li').on('click','.ted-font-li',function(){
            $('.ted-font-li').css('color','#fff');
            $(this).css('color','#00e8d4');
        });
    };

    $.fn.tEditor = function(option){
        var tedit = new Plugin(this,option);
        tedit.init();
    }

})(jQuery,window,document,undefined);

$(function(){
    $('.e-list').on('click','.name-li',function(){
        $(this).tEditor({});
    });


//    $('.ted-menu-li').on('click',function(){
//        $('.ted-menu-li').removeClass('ted-menu-act');
//        $(this).addClass('ted-menu-act');
//        var item = $(this).attr('data-item');
//        $('.ted-ctrl-li').fadeOut(200);
//        $('#ted-ctrl-'+item).fadeIn(200);
//    });
//    $('.ted-font-li').on('click',function(){
//        $('.ted-font-li').css('color','#fff');
//        $(this).css('color','#00e8d4');
//    });

    var boxwidth=parseInt($('.bot-cbox').width());
    var boxheight=parseInt($('.bot-cbox').height());
    var canvas = document.getElementById("bot-cbox-canvas");
    var ctx=canvas.getContext("2d");
    var grd=ctx.createLinearGradient(0,0,boxwidth,0);
        grd.addColorStop(0,"red");
        grd.addColorStop(0.15,"#f96");
        grd.addColorStop(0.30,"yellow");
        grd.addColorStop(0.50,"green");
        grd.addColorStop(0.65,"#ace");
        grd.addColorStop(0.8,"blue");
        grd.addColorStop(1,"blueviolet");
        ctx.fillStyle=grd;
        ctx.fillRect(0,0,boxwidth,boxheight);
    $("#bot-cbox-canvas").on('click',function (e){
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);
        // 获取该点像素的数据
        var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        // 获取该点像素数据
        var pixel = imageData.data;
        var pixelColor = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
        $(".name1").css("color", pixelColor);
    });

    /*
    var _x, x,move=false,barx;
    var blwidth=parseInt($('.slideline').width());
    var bawidth=parseInt($('.sl-bar').width());
    var max = blwidth-bawidth;
    var min = 0;
    $('.sl-bar').off('touchstart touchmove touchend').on({
        touchstart:function(event){
            var e = event.originalEvent.targetTouches[0];
            move=true;
            _x = e.pageX;//鼠标点击的位置
            barx=parseInt($(this).css('left'));
        },
        touchmove:function(event){
            event.preventDefault();
            var e = event.originalEvent.targetTouches[0];
            if(move){
                x= e.pageX;//鼠标移动时的位置
                var s = x-_x+barx;
                var ths = $(this);
                var item = ths.attr('data-item');
                if(item == 'shadow'){
                    max = blwidth-bawidth/2;
                    min = bawidth/2;
                }
                s = (s>max)?max:s;
                s = (s<min)?min:s;
                var rate = Math.round(s*100/max);
                $(this).css('left',s+'px');


                if(item == 'wordspace'){
                    var size = Math.floor(20*rate/100);
                    $(".name1").css("letter-spacing", size+'px');
                }
                if(item == 'lineheight'){
                    var lh= 1+rate/100;
                    $(".name1").css("line-height", lh+'em');
                }
                if(item == 'opacity'){
                    rate = 100 - rate;
                    var op = rate/100;
                    $(".name1").css("opacity",op);
                }
                if(item == 'shadow'){
                    if(s>blwidth/2){
                        rate = Math.round(((s-max/2)*50)/(max/2));
                    }else{
                        rate = -Math.round(((max/2-s+min)*50)/(max/2));
                    }
                    var sh = 10*rate/50;
                    var tsh = '#00e8d4 '+sh+'px '+sh+'px 5px';
                    $(".name1").css("text-shadow", tsh);
                }
                ths.parents('.base-bot-slide').siblings('.base-bot-value').html(rate);
            }
        },
        touchend:function(){
            move=false;
        }
    });*/

    /*element 移动*/
    var bx,by,_bx,_by,barx,bary;
    $('.e-list').on('touchstart touchmove touchend','.name-li',function(event){
        var e = event.originalEvent.targetTouches[0];
        if(event.type == "touchstart" ){
            barx = parseInt($(this).css('left'));
            bary = parseInt($(this).css('top'));
            _bx= e.pageX;
            _by= e.pageY;
            move=true;
        }else if(event.type == "touchmove" ){
            event.preventDefault();
            if(move){
                bx= e.pageX;
                by= e.pageY;
                var sx = bx-_bx+barx;
                var sy = by-_by+bary;
                $(this).css({'left':sx+'px',top:sy+'px'});
            }
        }else{
            move=false;
        }
    });
    $('.e-list').on('click','.name-li',function(){
        $('.name-li').removeClass('name-li-act').css('z-index','100');
        $(this).toggleClass('name-li-act').css('z-index','110');
    });


});


//$(function(){
//    $('.name1').on('click', function () {
//        $(this).colorSelect({
//            color:false,
//            background:true
//        });
//    });
//    $('.name2').on('click', function() {
//        $(this).colorSelect({
//            clbox:'bbox'
//        });
//    });
//
//});