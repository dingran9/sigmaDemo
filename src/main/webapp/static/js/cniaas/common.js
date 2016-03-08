/**
 * Created by Administrator on 2015/3/9.
 */


function beforeTableLoad(ulID,tabContentID){
    $("#"+ ulID).find("li").removeClass("active");
    $("#"+ ulID).find("li:first").addClass("active");

    $("#"+ tabContentID).addClass("initPage");
    $(".initPage > .tab-pane").addClass("active").addClass("in");
    $(".initPage > .tab-pane:not(:first)").css("visibility",'hidden');
}

function afterTableLoad(tabContentID){
    $("#"+tabContentID +".initPage > .tab-pane:not(:first)").removeClass("active").removeClass("in").css("visibility",'visible');
    $("#"+tabContentID).removeClass("initPage");
}

function initBindTabSwitch(ulID,callback){
    $(ulID).find("li").each(function(){
        $(this).unbind("click");
        $(this).on("click",function(){
            $(ulID).find("li").removeClass("active");
            $(this).addClass("active");
            $(ulID).next(".tab-content").find(".tab-pane").removeClass("active in");

            var objId = $(this).find("a").attr("href");
            var func = $(this).find("a").attr("func");
            $(objId).addClass("active in");
            callback(func);
        });
    });
}