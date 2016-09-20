/**
*Created by zhangjie on 2016/5/9.
*/

;(function($,window,document,undefined){
    var ColorSl = function(ele,option,func){
        var defColorArr = [
            '#000000','#000080','#00008B','#0000CD','#0000FF','#006400','#008000','#008080','#008B8B','#00BFFF',
            '#00CED1','#00FA9A','#00FF00','#00FF7F','#00FFFF','#00FFFF','#191970','#1E90FF','#20B2AA','#228B22',
            '#2E8B57','#2F4F4F','#32CD32','#3CB371','#40E0D0','#4169E1','#4682B4','#483D8B','#48D1CC','#4B0082',
            '#556B2F','#5F9EA0','#6495ED','#66CDAA','#696969','#6A5ACD','#6B8E23','#708090','#778899','#7B68EE',
            '#7CFC00','#7FFF00','#7FFFD4','#800000','#800080','#808000','#808080','#87CEEB','#87CEFA','#8A2BE2',
            '#8B0000','#8B008B','#8B4513','#8FBC8F','#90EE90','#9370DB','#9400D3','#98FB98','#9932CC','#9ACD32',
            '#A0522D','#A52A2A','#A9A9A9','#ADD8E6','#ADFF2F','#AFEEEE','#B0C4DE','#B0E0E6','#B22222','#B8860B',
            '#BA55D3','#BC8F8F','#BDB76B','#C0C0C0','#C71585','#CD5C5C','#CD853F','#D2691E','#D2B48C','#D3D3D3',
            '#D8BFD8','#DA70D6','#DAA520','#DB7093','#DC143C','#DCDCDC','#DDA0DD','#DEB887','#E0FFFF','#E6E6FA',
            '#E9967A','#EE82EE','#EEE8AA','#F08080','#F0E68C','#F0F8FF','#F0FFF0','#F0FFFF','#F4A460','#F5DEB3',
            '#F5F5DC','#F5F5F5','#F5FFFA','#F8F8FF','#FA8072','#FAEBD7','#FAF0E6','#FAFAD2','#FDF5E6','#FF0000',
            '#FF00FF','#FF00FF','#FF1493','#FF4500','#FF6347','#FF69B4','#FF7F50','#FF8C00','#FFA07A','#FFA500',
            '#FFB6C1','#FFC0CB','#FFD700','#FFDAB9','#FFDEAD','#FFE4B5','#FFE4C4','#FFE4E1','#FFEBCD','#FFEFD5',
            '#FFF0F5','#FFF5EE','#FFF8DC','#FFFACD','#FFFAF0','#FFFAFA','#FFFF00','#FFFFE0','#FFFFF0','#FFFFFF'
        ];
        this.$element = ele;
        this.defOption = {
            colorArr:defColorArr,
            clbox:'cbox',
        }
        this.func = func;
        this.select = $.extend({},this.defOption,option);
    }

    ColorSl.prototype.init = function(){
        var box = $('#'+this.select.clbox);
        var ch = box.children().length;
        var ele = this.$element;
        var fun = this.func;
        if(!ch){
            var cdiv= '<div class="js-colorselect"><div class="js-color-title">颜色面板<span class="glyphicon glyphicon-remove" id="csclose"></span></div><div class="js-color-main"><div class="js-color-box"><ul class="color-list">';
            for(var i=0;i<this.select.colorArr.length;i++){
                cdiv += '<li class="color-li" style="background:'+this.select.colorArr[i]+'" data-color="'+this.select.colorArr[i]+'"></li>';
            }
            cdiv += '</ul></div>';
            cdiv += '<div class="js-color-canvas"><div id="js-color-selected"></div><canvas id="js-color-canvas" width="800" height="200"></canvas></div></div>';
            box.append(cdiv);

            var canvas = document.getElementById("js-color-canvas");
            var ctx=canvas.getContext("2d");
            var boxwidth=parseInt($('.js-color-canvas').width());
            var boxheight=parseInt($('.js-color-canvas').height());
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
            var canvas = document.getElementById("js-color-canvas");
            var ctx=canvas.getContext("2d");
            box.fadeIn(200);
        }

        $("#js-color-canvas").off('click').on('click',function(e){
            var canvasOffset = $(canvas).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);
            var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
            var pixel = imageData.data;
            var color = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
            $('.color-li').removeClass('color-act');
            fun(ele,color);
        });

        var move=false;
        $('#js-color-canvas').off('touchstart touchmove touchend').on({
            touchstart:function(){
                move=true;
                $('.color-li').removeClass('color-act');
            },
            touchmove:function(event){
                event.preventDefault();
                var e = event.originalEvent.targetTouches[0];
                if(move){
                    $('#js-color-selected').show();
                    var canvasOffset = $(canvas).offset();
                    var canvasX = Math.floor(e.pageX - canvasOffset.left);
                    var canvasY = Math.floor(e.pageY - canvasOffset.top);
                    var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
                    var pixel = imageData.data;
                    var color = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
                    var sleft = canvasX-5;
                    var stop = canvasY+40;
                    $('#js-color-selected').css({'left':sleft+'px',top:stop+'px','background':color});
                    fun(ele,color);
                }
            },
            touchend:function(){
                move=false;
                $('#js-color-selected').hide();
            }
        });

        /*色块的选择*/
        box.off('click').on('click','.color-li',function(){
            var color = $(this).attr('data-color');
            $('.color-li').removeClass('color-act');
            $(this).addClass('color-act');
            fun(ele,color);
        });
        /*色块的关闭*/
        $('#csclose').off('click').on('click', function () {
            box.fadeOut(200);
        });
    }

    $.fn.colorSelect= function(option,func){
        var colorBox = new ColorSl(this,option,func);
        colorBox.init();
    }
})(jQuery,window,document);

/*
*** 插件的使用
* ths 当前需要修改的颜色的对象 nami-li
* {} 中可以做设置
*   colorArr 自定义色值数组
*   clbox    自定义颜色面板的存放的位置div.id值
    $('.name-li').on('click', function () {
        $(this).colorSelect({},function(ths,color){
            ths.css('color',color);
        });
    });
*/





