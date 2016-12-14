/**
 * Created by Administrator on 2016/12/14.
 */

/* text directive */
app.directive('editPanelText',function(){

    return {
        'restrict':'C',
        'replace':false,
        'scope':{
            'eleset':'='
        },
        'templateUrl':'ng-editer-div.html',
        'link':function($scope,$element,$attrs){

        }
    }
});

app.directive('textBold',function () {
    return {
        'restrict':'AE',
        'replace':true,
        'scope':{
            'weight':'='
        },
        'template':'<div class="nd-item nd-item-blod" ng-click="bold()">B</div>',
        'link':function ($scope,$element,$attrs) {
            $scope.bold=function () {
                $scope.weight = ($scope.weight == 'bold')?'normal':'bold';
            }
        }
    }
});

/* image directive */
app.directive('editPanelImage',function () {

    return {
        'restrict':'C',
        'template':'<div>image</div>',
        'link':function ($scope,$element,$attr) {
            
        }
    }
});

/* video directive */
app.directive('editPanelVideo',function () {

    return {
        'restrict':'C',
        'template':'<div>video</div>',
        'link':function ($scope,$element,$attr) {

        }
    }
});

/* music directive */
app.directive('editPanelMusic',function () {

    return {
        'restrict':'C',
        'template':'<div>music</div>',
        'link':function ($scope,$element,$attr) {

        }
    }
});

/* svg directive */
app.directive('editPanelSvg',function () {

    return {
        'restrict':'C',
        'template':'<div>svg</div>',
        'link':function ($scope,$element,$attr) {

        }
    }
});

/* newPage directive */
app.directive('editPanelNewPage',function () {

    return {
        'restrict':'C',
        'template':'<div>newPage</div>',
        'link':function ($scope,$element,$attr) {

        }
    }
});

