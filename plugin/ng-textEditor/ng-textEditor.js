/**
 * Created by zhangjie on 2016/7/29.
 */
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 20 * (document.body.clientWidth / 320) + 'px';
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
var remScale = 16/window.innerWidth;
function pxToRem(lenpx,type){
    if(type){
        return lenpx*remScale+'rem';
    }else{
        return lenpx*remScale;
    }
}
function remToPx(remLen){
    return remLen/remScale;
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
        return { 'r': sColorChange[0], 'g': sColorChange[1], 'b': sColorChange[2] ,'a':1};
    } else {
        return sColor;
    }
}


/* angular dom -js */
var app = angular.module('myapp',['ionic','ngSanitize']);
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    });
});
app.directive('contenteditable', ['$sce', function($sce) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;
            ngModel.$render = function() {
                element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
            };

            element.on('blur keyup change', function() {
                scope.$evalAsync(read);
            });
            read();

            function read(){
                var html = element.html();
                if(attrs.stripBr && html == '<br>'){
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
}]);
app.directive('domOper',function(){
    return {
        restrict:'EA',
        template:'<div class="ele-ctrl ele-left-top ele-delete" ng-click="eleAction.deleteElement($event,$index)"><i class="fa fa-trash-o"></i></div>'
            +'<div class="ele-ctrl ele-right-top ele-copy" ng-click="eleAction.copyElement($event,$index)"><i class="fa fa-clone"></i></div>'
            +'<div class="ele-ctrl ele-left-bot ele-edit" ng-click="eleAction.editElement($event,$index)"><i class="fa fa-pencil"></i></div>'
            +'<div class="ele-ctrl ele-right-bot ele-rotate" on-drag="moveEle.rotateEle($event,$index)" on-release="moveEle.releaseEle()"><i class="fa fa-refresh"></i></div>',
    }
});
app.directive('textEditor',function(){
    return {
        restrict:'EA',
        templateUrl:'text-editor.html',
        scope:{
            selectEle:'=',
            modelShow:'='
        },
        link:function(scope,ele,attr){
            /* --------公共方法-------- */
            var comFunc = {
                getRem:function(num){
                    return num+'rem';
                },
                getElePos:function(e){
                    var x=0,y=0;
                    while(e != null){
                        x += e.offsetLeft;
                        y += e.offsetTop;
                        e = e.offsetParent;
                    }
                    return {left:x, top:y,};
                }
            };

            /* --------绘制色彩板-------- */
            var clor = document.getElementById('bot-cbox-canvas');
            var back = document.getElementById('back-color');
            scope.canvas = {
                clor:clor,
                ctx:clor.getContext('2d'),
                clorPos:{},
                back:back,
                btx:back.getContext('2d'),
                backPos:{},
                fetchColor:function(obj,position){
                    var imageData = obj.getImageData(position.x, position.y, 1, 1);
                    var pixel = imageData.data;
                    scope.colorBox.setColor({r:pixel[0],g:pixel[1],b:pixel[2],a:pixel[3]});
                    return scope.colorBox.getColor();
                }
            };
            var makeColorCanvas = function(canvasName){
                var canvas = document.getElementById(canvasName);
                var ctx=canvas.getContext("2d");
                canvas.width=parseInt(canvas.parentNode.offsetWidth);
                canvas.height=parseInt(canvas.parentNode.offsetHeight);
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
            makeColorCanvas('bot-cbox-canvas');
            makeColorCanvas('back-color');

            /* --------数据结构-------- */
            /* ---item-list--- */
            scope.editSet = {
                colorList:
                    ['#f8aba6','#f58f98','#f391a9','#f05b72','#d93a49','#b3424a','#a7324a','#840228','#6b2c25','#54211d',
                    '#8e3e1f','#b4532a','#de773f','#f47920','#faa755','#fab27b','#dea32c','#ffc20e','#fdb933','#ffe600',
                    '#f0dc70','#fcf16e','#b2d235','#a3cf62','#7fb80e','#78a355','#769149','#817936','#87843b','#454926',
                    '#2e3a1f','#122e29','#274d3d','#225a1f','#007947','#508a88','#70a19f','#008792','#78cdd1','#afdfe4',
                    '#90d7ec','#7bbfea','#009ad6','#228fbd','#2570a1','#2468a2','#145b7d','#2a5caa','#224b8f','#2b4490',
                    '#1b315e','#11264f','#45224a','#543044','#63434f','#594c6d','#6950a1','#6f60aa','#9b95c9','#afb4db',
                    '#fffffb','#f6f5ec','#f2eada','#d3d7d4','#a1a3a6','#999d9c','#72777b','#4f5555','#3e4145','#281f1d',
                    '#130c0e'],
                fontList: ['Helvetica','Microsoft YaHei','Helvetica Neue'],
            };

            /* --------编辑区域样式-------- */
            scope.textStyle = {};
            /* ---model-ctrl--- */
            scope.model = {
                close:function(){
                    scope.modelShow = false;
                    scope.textStyle = {};
                },
                open:function(){
                    scope.modelShow = true;
                },
                add:function(){
                    angular.copy(scope.textStyle,scope.selectEle.conStyle);
                    scope.textStyle = {};
                    scope.selectEle.content = scope.textCont;
                    this.close();
                },
                init:function(){
                    scope.wordspace = 0;
                    scope.lineheight = 0;
                    scope.shadow = 0;
                    scope.bwidth = 0;
                    scope.bradius = 0;
                    scope.bopacity = 100;
                    scope.textStyle['font-size'] = '1rem';
                }
            };
            scope.model.init();
            /* --------功能部件展示-------- */
            scope.menu = {
                actItem:'base',
                showOper:function(type){
                    this.actItem = type;
                }
            }
            /* --------样式编辑功能-------- */
            /* --colorBox-- */
            scope.colorBox = {
                rgba:{r:0,g:0,b:0,a:1},
                setColor:function(colorArr){
                    for(c in colorArr){
                        this.rgba[c] = colorArr[c];
                    }
                },
                getColor:function(){
                    return 'rgba(' +this.rgba.r+ ','+this.rgba.g+','+this.rgba.b+','+this.rgba.a+')';
                },
                fetchColor:function(color){
                    return 'rgba(' +color.r+ ','+color.g+','+color.b+','+color.a+')';
                }
            };
            scope.colorHistory = {
                colorList:[],
                setColor:function(color){
                    if(this.colorList.length==3){
                        this.colorList.shift();
                    }
                    this.colorList.push(color);
                }
            };

            /* ---base-function--- */
            scope.base = {
                fontBig:function(){
                    var size = parseFloat(scope.textStyle['font-size']);
                    if(size<4){
                        size += 0.1;
                        scope.textStyle['font-size'] = comFunc.getRem(size);
                    }
                },
                fontSml:function(){
                    var size = parseFloat(scope.textStyle['font-size']);
                    if(size>0.5){
                        size -= 0.1;
                        scope.textStyle['font-size'] = comFunc.getRem(size);
                    }
                },
                fontWeight:function(){
                    var weight = scope.textStyle['font-weight'];
                    if(weight == 600){
                        scope.textStyle['font-weight'] = 300;
                    }else{
                        scope.textStyle['font-weight'] = 600;
                    }
                },
                fontStyle:function(){
                    var style = scope.textStyle['font-style'];
                    if(style == 'normal'){
                        scope.textStyle['font-style'] = 'italic';
                    }else{
                        scope.textStyle['font-style'] = 'normal';
                    }
                },
                fontUnderline:function(){
                    var style = scope.textStyle['text-decoration'];
                    if(style == 'underline'){
                        scope.textStyle['text-decoration'] = 'none';
                    }else{
                        scope.textStyle['text-decoration'] = 'underline';
                    }
                },
                alignLeft:function(){
                    scope.textStyle['text-align'] = 'left';
                },
                alignRight:function(){
                    scope.textStyle['text-align'] = 'right';
                },
                alignCenter:function(){
                    scope.textStyle['text-align'] = 'center';
                },
                alignJust:function(){
                    scope.textStyle['text-align'] = 'justify';
                },
                wordSpace:function(){
                    var size = Math.floor(20*scope.wordspace/100);
                    scope.textStyle["letter-spacing"]= pxToRem(size,1);
                },
                lineHeight:function(){
                    var lh= 1+scope.lineheight/25;
                    scope.textStyle["line-height"] = lh+'em';
                }
            };

            /* ---color-function--- */
            scope.color= {
                colorBlock:function(index){
                    var color = scope.editSet.colorList[index];//hex
                    scope.textStyle.color=color;
                    scope.colorHistory.setColor(color);
                },
                colorHistory:function(index){
                    scope.textStyle.color=scope.colorHistory.colorList[index];
                },
                colorReset:function(){
                    if(scope.selectEle.conStyle && scope.selectEle.conStyle.color){
                        scope.textStyle.color=scope.selectEle.conStyle.color;
                    }
                },
                canvasClick:function($event){
                    scope.colorTip.setType = 'click';
                    var color = scope.canvas.fetchColor(scope.canvas.ctx,{x:$event.offsetX,y:$event.offsetY});
                    scope.textStyle.color=color;
                    scope.colorHistory.setColor(color);
                },
                canvasDrag:function($event){
                    $event.preventDefault();
                    scope.colorTip.setType = 'drag';
                    if(scope.canvas.clorPos.top == undefined){
                        scope.canvas.clorPos = comFunc.getElePos($event.target);
                    }
                    var position = {
                        x:$event.gesture.center.pageX-scope.canvas.clorPos.left,
                        y:$event.gesture.center.pageY-scope.canvas.clorPos.top
                    };
                    var color = scope.canvas.fetchColor(scope.canvas.ctx,position);
                    scope.textStyle.color=color;
                    scope.colorTip.selectShow = true;
                    scope.colorTip.selectStyle = {
                        left:position.x+'px',
                        top:(position.y+45)+'px',
                        background:color
                    };
                },
                canvasRelease:function(){
                    if(scope.colorTip.setType == 'drag'){
                        scope.colorHistory.setColor(scope.colorTip.selectStyle.background);
                        scope.colorTip.selectToggle();
                    }
                    scope.colorTip.setType = 'click';
                }
            };
            /* setColorValue */
            scope.colorValue = {
                show:false,
                rgba:{r:0,g:0,b:0,a:1},
                hex:'',
                open:function(){
                    this.show = true;
                },
                close:function(){
                    this.show = false;
                    if(this.hex != ''){
                        scope.colorHistory.setColor(scope.colorBox.fetchColor(this.rgba));
                    }
                },
                setRgb:function(){
                    var rgb = this.rgb;
                    if(rgb.r>=0 && rgb.r<=255 && rgb.g>=0 && rgb.g<=255 && rgb.b>=0 && rgb.b<=255){
                        var rColor = rgbToHex(rgb);
                        this.hex = rColor;
                        var color = '#'+rColor;
                        scope.textStyle.color = color;
                    }
                },
                setHex:function(){
                    var hColor = this.hex.toLowerCase();
                    var reg = /^([0-9a-fA-f]{6})$/;
                    if(hColor && reg.test(hColor)){
                        var color = '#'+hColor;
                        this.rgb = hexToRgb(hColor);
                        scope.textStyle.color = color;
                    }
                }
            }
            /* colorTips */
            scope.colorTip = {
                setType:'click',
                selectShow:false,
                selectStyle:{},
                selectToggle:function(){
                    this.selectShow = !this.selectShow;
                },
            }

            /* ---effects-function--- */
            scope.effects = {
                shadow:{
                    color:'#00e8d4',
                    distance:2,
                    blur:0
                },
                showShadow:function(){
                    if(scope.sToggle.tog){
                        this.setShadow(true);
                    }else{
                        this.setShadow(false);
                    }
                },
                color:function(index){
                    this.shadow.color = scope.editSet.colorList[index];
                    this.setShadow(true);
                },
                bedim:function(){
                    if(scope.sToggle.btog){
                        this.shadow.blur = 5;
                    }else{
                        this.shadow.blur = 0;
                    }
                    this.setShadow(true);
                },
                distance:function(){
                    this.shadow.distance = scope.shadow/5;
                    this.setShadow(true);
                },
                setShadow:function(type){
                    if(type){
                        var efstyle = this.shadow.color+' '+this.shadow.distance+'px '+this.shadow.distance+'px ';
                        if(this.shadow.blur != '0'){
                            efstyle += this.shadow.blur + 'px';
                        }
                        scope.sToggle.open('tog');
                        scope.textStyle['text-shadow']= efstyle;
                    }else{
                        scope.textStyle['text-shadow'] = '';
                    }
                }
            };
            scope.sToggle = {
                tog:false,
                btog:false,
                open:function(item){
                    if(item == 'tog'){
                        this.tog = true;
                    }else{
                        this.btog = true;
                    }
                }
            };

            /* ---back-function--- */
            scope.back = {
                border:{
                    width:0.1,
                    style:'solid',
                    color:'#03ac9a',
                    radius:0
                },
                bwidth:function(){
                    this.border.width = scope.bwidth/25;
                    this.setBd('border');
                },
                bradius:function(){
                    this.border.radius = scope.bradius+'%';
                    this.setBd('radius');
                },
                bopacity:function(){
                    scope.colorBox.rgba.a = scope.bopacity/100;
                    if(scope.backType.border){
                        this.border.color = scope.colorBox.getColor();
                        this.setBd('border');
                    }else{
                        this.setBd('background');
                    }
                },
                canvasClick:function($event){
                    scope.colorTip.setType = 'click';
                    var color = scope.canvas.fetchColor(scope.canvas.btx,{x:$event.offsetX,y:$event.offsetY});
                    scope.colorHistory.setColor(color);
                    if(scope.backType.border){
                        this.border.color = color;
                        this.setBd('border');
                    }else{
                        this.setBd('background');
                    }
                },
                canvasDrag:function($event){
                    $event.preventDefault();
                    scope.colorTip.setType = 'drag';
                    if(scope.canvas.backPos.top === undefined){
                        scope.canvas.backPos = comFunc.getElePos($event.target);
                    }
                    var position = {
                        x:$event.gesture.center.pageX-scope.canvas.backPos.left,
                        y:$event.gesture.center.pageY-scope.canvas.backPos.top
                    };
                    var color = scope.canvas.fetchColor(scope.canvas.ctx,position);
                    if(scope.backType.border){
                        this.border.color = color;
                        this.setBd('border');
                    }else{
                        this.setBd('background');
                    }
                    scope.colorTip.selectShow = true;
                    scope.colorTip.selectStyle = {
                        left:(position.x+40)+'px',
                        top:(position.y+45)+'px',
                        background:color
                    };
                },
                canvasRelease:function(){
                    if(scope.colorTip.setType == 'drag'){
                        scope.colorHistory.setColor(scope.colorTip.selectStyle.background);
                        scope.colorTip.selectToggle();
                    }
                    scope.colorTip.setType = 'click';
                },
                setBd:function(type){
                    if(type =='border'){
                        scope.textStyle.border = this.border.width+'rem '+this.border.style+' '+this.border.color;
                    }else if(type =='background'){
                        scope.textStyle.background = scope.colorBox.getColor();
                    }else{
                        scope.textStyle['border-radius'] = this.border.radius;
                    }
                },
                delBd:function(){
                    if(scope.backType.border){
                        scope.textStyle.border = '';
                        scope.textStyle['border-radius'] = '';
                    }else{
                        scope.textStyle.background = '';
                    }
                    scope.colorBox.setColor({r:0,g:0,b:0,a:1});
                }
            };
            scope.backType = {
                border:true,
                changeType:function(){
                    this.border = !this.border;
                }
            };

            /* ---link-function--- */
            scope.link = {
                btnLock:false,
                linkLock:false,
                toggleBtn:function(){
                    this.btnLock = !this.btnLock;
                    this.linkLock = this.btnLock;
                },
                toggleLink:function(){
                    if(this.btnLock){
                        this.linkLock = !this.linkLock;
                    }
                }
            };

            /* 监控选中元素数据 */
            scope.$watch('selectEle',function(){
                scope.textStyle = angular.extend(scope.textStyle,scope.selectEle.conStyle);
                scope.textCont = scope.selectEle.content;
            });
        }

    }
});


app.controller('myappController',function($scope){
    /* 文字model的显示 */
    $scope.eles = [
        {
            'content':'yiduanwenzi',
            'eleStyle':{
                top:'4rem',
                left:'5rem'
            },
            'conStyle':{},
            'type':'text-element'
        }
    ];

    var top = 4,i=0;
    $scope.eleAction = {
        act:-1,
        selectEle:{},
        modelShow:false,
        addElement:function(){
            top +=3;
            $scope.eles.push({
                'content':'yiduanwenzi'+i,
                'eleStyle':{
                    top:top+'rem',
                    left:'5rem'
                },
                'conStyle':{},
                'type':'text-element'
            });
        },
        actElement:function($event,index){
            $event.stopPropagation();
            this.act = index;
            this.selectEle = $scope.eles[index];
        },
        inactElement:function(){
            this.act = -1;
        },
        deleteElement:function($event,index){
            $event.stopPropagation();
            $scope.eles.splice(index,1);
            var len = $scope.eles.length;
            if(len>0){
                this.actElement($event,len-1);
            }
        },
        copyElement:function($event,index){
            $event.stopPropagation();
            var newEle = {};
            angular.copy($scope.eles[index],newEle);
            var top = parseFloat(newEle.eleStyle.top)+3;
            newEle.eleStyle.top = top+'rem';/* rem需要修改 */
            $scope.eles.push(newEle);
            this.actElement($event,$scope.eles.length-1);
        },
        editElement:function($event,index){
            $event.stopPropagation();
            this.modelShow = true;
            this.inactElement();
        }
    };
    $scope.moveEle = {
        mele:{},
        rele:{},
        move:false,
        dragEle:function($event,index){
            $event.stopPropagation();
            if(!this.move){
                this.move = true;
                angular.copy($scope.eles[index],this.mele);
            }
            var left  =  parseFloat(this.mele.eleStyle.left);
            var top  =  parseFloat(this.mele.eleStyle.top);
            left +=  pxToRem($event.gesture.deltaX,0);
            top += pxToRem($event.gesture.deltaY,0);
            $scope.eles[index].eleStyle.left = left + 'rem';
            $scope.eles[index].eleStyle.top = top + 'rem';
        },
        releaseEle:function(){
            if(this.move){
                this.move = false;
            }
        },
        rotateEle:function($event,index){
            $event.stopPropagation();
            if(!this.move){
                this.move = true;
                angular.copy($scope.eles[index],this.mele);
                this.rele.elep = {
                    width:$event.target.offsetParent.offsetParent.clientWidth,
                    height:$event.target.offsetParent.offsetParent.clientHeight,
                    left:remToPx(parseFloat(this.mele.eleStyle.left)),
                    top:remToPx(parseFloat(this.mele.eleStyle.top))
                };
                this.rele.midp = {
                    left:this.rele.elep.left+this.rele.elep.width/2,
                    top:this.rele.elep.top+this.rele.elep.height/2
                };
                this.rele.botp = {
                    left:this.rele.elep.left+this.rele.elep.width,
                    top:this.rele.elep.top+this.rele.elep.height
                };
                var pos = this.getElePos($event.target,'body-cont');
                this.rele.rbotp = {
                    left:pos.left+$event.target.clientWidth/2,
                    top:pos.top+$event.target.clientHeight/2
                };
                this.rele.dlength = getTwoPointDistance(this.rele.midp,this.rele.botp);
            }
            this.rele.movp = {
                left:this.rele.rbotp.left+$event.gesture.deltaX,
                top:this.rele.rbotp.top+$event.gesture.deltaY,
            };
            var bvl = getTwoPointDistance(this.rele.botp,this.rele.movp);
            var mbl = this.rele.dlength;
            var mvl = getTwoPointDistance(this.rele.midp,this.rele.movp);
            var ndeg = getTwoLineDeg(mbl,mvl,bvl);
            var nrate = mvl/mbl;
            if(getRotateDirect(this.rele.midp,this.rele.botp,this.rele.movp)>0){
                ndeg = -180*ndeg/Math.PI;
            }else{
                ndeg = 180*ndeg/Math.PI;
            }
            ndeg = keepTwoValid(ndeg);
            nrate = keepTwoValid(nrate);
            var ew = this.rele.elep.width*nrate;
            var eh = this.rele.elep.height*nrate;
            var nl = this.rele.elep.left-(ew-this.rele.elep.width)/2;
            var nt = this.rele.elep.top-(eh-this.rele.elep.height)/2;
            var tranf = 'rotate('+ndeg+'deg)';
            $scope.eles[index].conStyle.width=pxToRem(ew,1);
            $scope.eles[index].conStyle.height=pxToRem(eh,1);
            $scope.eles[index].eleStyle.left=pxToRem(nl,1);
            $scope.eles[index].eleStyle.top=pxToRem(nt,1);
            $scope.eles[index].eleStyle.transform=tranf;
        },
        getElePos:function(ele,stopEle){
            var x=0,y=0;
            while(ele != null && ele.className.indexOf(stopEle) == -1){
                x += ele.offsetLeft;
                y += ele.offsetTop;
                ele = ele.offsetParent;
            }
            return {left:x, top:y};
        }
    };

});

