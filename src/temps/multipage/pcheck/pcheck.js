$(function(){

    $('.main-top-list li').on('click',function(){
        var ths = $(this);
        var type = ths.attr('data-type');
        ths.toggleClass('cl_act');
        ths.siblings().removeClass('cl_act');
        $('.main-body').hide();
        $('#main-'+type).show();
    });

    $('.s-li li').on('click',function() {
        var ths = $(this);
        var valu = ths.attr('data-var');
        ths.addClass('sli_act').siblings().removeClass('sli_act');
        if(ths.parent().hasClass('s-select-cont')){
            $('#ss_cont').val(valu);
            var nume = ths.parent().siblings('.s-score-num').children();
            if(valu == 'ok'){
                nume.slice(0,5).hide();
                nume.slice(5).show();
                nume.eq(5).trigger('click');
            }else{
                nume.slice(0,5).show();
                nume.slice(5).hide();
                nume.eq(0).trigger('click');
            }
        }else{
            $('#ss_score').val(valu);
        }
    });
    var warting = {
        'show':function(obj) {
            obj.parent().siblings('.mb-waiting').show();
        },
        'hide':function(obj) {
            obj.parent().siblings('.mb-waiting').hide();
        }
    }
    $('.btn_sub').on('click',function(){
        var ths = $(this);
        var cont = $('#ss_cont').val();
        var score = $('#ss_score').val();
        if(!cont){
            alert('当前海报还没有选择是否合格');
            return;
        }
        if(!score){
            alert('当前海报还没有打分');
            return;
        }
        if(cont == 'ok' && score < 6){
            alert('合格的海报打分不能低于6分');
            return;
        }
        if(cont == 'no' && score >= 6){
            alert('不合格的海报打分不能低高于5分');
            return;
        }
        warting.show(ths);
        ths.parent().siblings('.mb-poster-score').fadeOut();
        ths.parent().siblings('.mb-poster-tips').html(score).fadeIn();
        ths.hide();
        ths.siblings().fadeIn();
        var id =ths.parents('.mb-poster-ctrl').attr('data-id');
        warting.hide(ths);
        console.log('cont:'+cont+' ; score: '+score);
    });
    $('.btn_reset').on('click',function(){
        var ths = $(this);
        ths.parent().siblings('.mb-poster-score').fadeIn();
        ths.parent().siblings('.mb-poster-tips').html('').fadeOut();
        ths.hide();
        ths.siblings().show();
    });

    $('.btn_delete').on('click',function(){
        var ths = $(this);
        var id =ths.parents('.mb-poster-ctrl').attr('data-id');
        if(confirm('您确定要删除当前海报吗')){
            // warting.show(ths);
            // warting.hide(ths);
            console.log(id);
        }
    });


    // $('.mb-poster').on('click',function(){
    //     var ths = $(this);
    //     ths.toggleClass('shadow');
    //     ths.siblings().removeClass('shadow');
    // });

});
