/**
 * Created by Administrator on 2016/12/15.
 */

/* element move directive */
app.directive('moveEle',function () {
    return {
        'restrict':'A',
        'scope':{
            'ele':'=eleData'
        },
        'template':'',
        'link':function ($scope,$element,$attr) {
            var move = false;
            var elep,_bx,_by,sx,sy;
            $element.on('mousedown mousemove mouseup',function (e) {
                e.preventDefault();
                if (e.type == "mousedown"){
                    _bx = e.pageX;
                    _by = e.pageY;
                    elep = {
                        'left':($scope.ele.style['left'])?parseInt($scope.ele.style['left']):0,
                        'top':($scope.ele.style['left'])?parseInt($scope.ele.style['top']):0
                    }
                    move = true;
                } else if (e.type == "mousemove") {
                    if (move){
                        sx = e.pageX - _bx + elep.left;
                        sy = e.pageY - _by + elep.top;
                        $element.css({left:sx+'px',top:sy+'px'});
                    }
                }else{
                    move = false;
                    $scope.ele.style['left']=sx+'px';
                    $scope.ele.style['top']=sy+'px';
                }
            });
        }
    }
});
