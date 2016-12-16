/**
 * Created by Administrator on 2016/12/14.
 */

/* text directive */
app.directive('editPanelText',function(){

    return {
        'restrict':'AC',
        'replace':false,
        'scope':{
            'eleset':'='
        },
        'templateUrl':'./templates/temp-text.html',
        'link':function($scope,$element,$attrs){
            var oldset = {};
            angular.copy($scope.eleset, oldset);

            $scope.reset = function () {
                angular.copy(oldset,$scope.eleset);
            }
            $scope.bold=function (){
                $scope.eleset.style['font-weight'] = (!$scope.eleset.style['font-weight'] || ($scope.eleset.style['font-weight'] == 'normal'))?'bold':'normal';
            }

        }
    }
});



/* image directive */
app.directive('editPanelImage',function ($http) {

    return {
        'restrict':'AC',
        'templateUrl':'./templates/temp-image.html',
        'scope':{
            'eleset':'='
        },
        'link':function ($scope,$element,$attr) {
            var oldsrc = $scope.eleset.src;
            $scope.selectImage = function (obj) {
                $scope.eleset.src = obj.src;
            }
            $scope.resetImage = function () {
                console.log('image reset');
                $scope.eleset.src = oldsrc;
            }
            $scope.images = [];

            var getImageList = function (page) {
                var page = page?page:1;
                $http.get(ROOT_CONFIG.domain+'/api/v1/poster/system/background?page='+page)
                    .success(function(data){
                        if(data.length>0){
                            var das = [];
                            for(i=0;i<data.length;i++){
                                var d={};
                                d['src'] = data[i]['image']['file'];
                                d['src_nail'] = data[i]['thumbnail_img']['file'];
                                das.push(d);
                            }
                            $scope.images=das;
                        }
                    }).error(function(data){
                        console.log(data);
                    });
            }
            getImageList();
        }
    }
});


/* video directive */
app.directive('editPanelVideo',function () {

    return {
        'restrict':'AC',
        'template':'<div>video</div>',
        'link':function ($scope,$element,$attr) {

        }
    }
});

/* music directive */
app.directive('editPanelMusic',function () {

    return {
        'restrict':'AC',
        'template':'<div>music</div>',
        'link':function ($scope,$element,$attr) {

        }
    }
});

/* svg directive */
app.directive('editPanelSvg',function () {

    return {
        'restrict':'AC',
        'template':'<div>svg</div>',
        'link':function ($scope,$element,$attr) {

        }
    }
});

/* newPage directive */
app.directive('editPanelNewPage',function () {

    return {
        'restrict':'AC',
        'template':'<div>newPage</div>',
        'link':function ($scope,$element,$attr) {

        }
    }
});

