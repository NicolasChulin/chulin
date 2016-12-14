
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
    		'num':0,
            'type':'text',
            'content':'一个文字',
            'style':{
                'font-size':'16px',
                'color':'red'
            },
            'func':{}
		},
		'image':{
            'num':0,
            'type':'image',
            'src':'../../images/eventree.jpg',
            'style':{
                'font-size':'16px',
                'color':'red'
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
        obj['num']=$scope.elems.length;
        angular.copy(obj, objnew);
        $scope.elems.push(objnew);
        $scope.actElement(objnew);
	}


});

