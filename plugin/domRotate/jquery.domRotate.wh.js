
;(function($,window,document,undefined){

    $.fn.domRotate= function(editCallback){
        var $element = this;
        var elcont = $element.children('.el-content');
        moveCtrlBtn($element.children().slice(1));

        var bx, by, _bx, _by,move=false;
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
            } else if (event.type == "touchmove") {
                move = true;
                if (move){
                    bx = e.pageX;
                    by = e.pageY;
                    var sx = bx - _bx + elep.left;
                    var sy = by - _by + elep.top;
                    $element.css({'left': sx + 'px', top: sy + 'px'});
                    moveCtrlBtn($element.children().slice(1));
                }
            }else{
                if(!move){
                    moveCtrlBtn($element.children().slice(1));
                }
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
                    elcont.css({'width':ew+'px','height':eh+'px'});
                    $element.css({'left':nl+'px','top':nt+'px','transform':tranf});
                    moveCtrlBtn($element.children().slice(1));
                }
            } else {
                move = false;
            }
        });
        /* element编辑 */
        $('#ele-editor-ctrl').off('click').on('click',function(){
            if($.isFunction(editCallback)){
                editCallback($element);
            }
        });
        /* element删除 */
        $('#ele-delete-ctrl').off('click').on('click',function(e){
            e.stopPropagation();
            var $prevElement = $element.siblings('.text-element');
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
            var fbox = $obj.parent().parent().offset();
            for(var i=0;i<$obj.length;i++){
                var ths = $($obj[i]);
                var clas = ths.attr('class');
                var item = clas.slice(3);
                var pos = ths.offset();
                var sx = pos.left-fbox.left;
                var sy = pos.top-fbox.top;
                $('#ele-'+item+'-ctrl').css({left:sx+'px',top:sy+'px'});
            }
        }
    }
})(jQuery,window,document);
