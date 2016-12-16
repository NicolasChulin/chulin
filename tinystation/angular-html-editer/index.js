var ROOT_CONFIG = {
//    domain: "http://localhost:8000"
    domain: "http://192.168.153.128:8000",
    // domain: "http://www.yunye123.com:8000",
//    domain: "http://www.yunye123.com",
};

var app = angular.module('app',[]);
app.factory('editFuncConfigService',function(){
    var config = [
        {'type':'text', 'icon':'fa-text-width'},
        {'type':'image', 'icon':'fa-image'},
        {'type':'video', 'icon':'fa-video-camera'},
        {'type':'music', 'icon':'fa-music'},
        {'type':'svg', 'icon':'fa-star-o'},
        {'type':'new-page', 'icon':'fa-plus-square-o'}
    ];
    var eleDefaultData = {
    	'text':{
    		'nid':0,
            'type':'text',
            'content':'一个文字',
            'style':{
                'font-size':'16px',
                'color':'red',
                'width':'100px',
                'height':'30px'
            },
            'func':{}
		},
		'image':{
            'nid':0,
            'type':'image',
            'src':'../../images/pcimgs/002.jpg',
            'style':{
                'width':'200px',
                'height':'150px'
            },
            'func':{}
		},
        'video':{
            'nid':0,
            'type':'video',
            'src':'../../images/pcimgs/004.jpg',
            'style':{
                'width':'200px',
                'height':'150px'
            },
            'func':{}
        },
        'svg':{
            'nid':0,
            'type':'svg',
            'content':'haochang de wenti',
            'style':{
                'width':'200px',
                'height':'150px'
            },
            'func':{}
        }
    };
    return {
        'getConfig':function () {
            return config;
        },
        'getConfig':function () {
            return config;
        },
		'getData':function(type){
			return eleDefaultData[type];
        }
    }
});

app.controller('NewDireController',function($scope,editFuncConfigService){
	$scope.editFuncConfig = editFuncConfigService.getConfig();
    $scope.showEditPanel = 'text';
    $scope.elems = [];

    $scope.actEle = '';
    $scope.actElement = function (eledata) {
        $scope.actEle = eledata;
        $scope.showEditPanel = eledata.type;
    }

    $scope.addElement =function(eledata){
		var obj = editFuncConfigService.getData(eledata.type);
		var objnew = {};
        obj['nid']=$scope.elems.length;
        angular.copy(obj, objnew);
        $scope.elems.push(objnew);
        $scope.actElement(objnew);
	}


});

