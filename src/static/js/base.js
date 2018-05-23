(function () {
	function yyAlert(text,callback){
        var alertEle = document.getElementById('yyalert-dialog'), coverbox,popbox,yyBtnConfirm;

		if(alertEle == undefined || alertEle.length <= 0){
            var cover = '<div id="yyalert-cover" class="yyalert-cover" style=""><div class="yyalert-cover-inner"></div></div>';
    		var divelement = '<div class="yyalert" id="yyalert"><div class="yyalert-text">'+text+'</div><div class="yyalert-footer"><a href="javascript:void(0);" id="yyBtnAlert" class="yyalert-btn">知道了</a></div></div>';
            alertEle = document.createElement('div');
            alertEle.setAttribute('id','yyalert-dialog');
            alertEle.innerHTML = cover + divelement;
    		document.body.appendChild(alertEle);
		}
        coverbox = document.getElementById('yyalert-cover');
        popbox = document.getElementById('yyalert');
        yyBtnConfirm = document.getElementById('yyBtnAlert');
        popbox.style.marginTop = -popbox.offsetHeight/2+'px';
        setTimeout(function(){
            alertEle.classList.add('open');
        },50);
        coverbox.onclick=function(){
            alertEle.classList.remove('open');
        }
        yyBtnConfirm.onclick=function(){
            alertEle.classList.remove('open');
            if(callback!=null && typeof(eval(callback)) == "function"){
				callback();
			}
        }
	}
	window.yyAlert = yyAlert;
})();
(function () {
	function yyConfirm(text,callback){
        var confirmEle = document.getElementById('yyconfirm-dialog'), coverbox, popbox, yyBtnConfirm,yyBtnCancel;
        if(confirmEle == undefined || confirmEle.length <= 0){
            var cover = '<div id="yyconfirm-cover" class="yyalert-cover" style=""><div class="yyalert-cover-inner"></div></div>';
    		var divelement = '<div class="yyalert" id="yyconfirm"><div class="yyalert-text">'+text+'</div><div class="yyalert-footer"><a href="javascript:void(0);" id="yyBtnCancel" class="yyalert-btn">取消</a><a href="javascript:void(0);" id="yyBtnConfirm" class="yyalert-btn">知道了</a></div></div>';
            confirmEle = document.createElement('div');
            confirmEle.setAttribute('id','yyconfirm-dialog');
            confirmEle.innerHTML = cover + divelement;
    		document.body.appendChild(confirmEle);
		}
        coverbox = document.getElementById('yyconfirm-cover');
        popbox = document.getElementById('yyconfirm');
        yyBtnConfirm = document.getElementById('yyBtnConfirm');
        yyBtnCancel = document.getElementById('yyBtnCancel');

        popbox.style.marginTop = -popbox.offsetHeight/2+'px';
        setTimeout(function(){
            confirmEle.classList.add('open');
        },50);
        coverbox.onclick=function(){
            confirmEle.classList.remove('open');
        }
        yyBtnCancel.onclick=function(){
            confirmEle.classList.remove('open');
        }
        yyBtnConfirm.onclick=function(){
            confirmEle.classList.remove('open');
            if(callback!=null && typeof(eval(callback)) == "function"){
				callback();
			}
        }

	}

	window.yyConfirm = yyConfirm;
})();
