/**
 * Created by Administrator on 2015/3/9.
 */


function beforeTableLoad(ulID,tabContentID){
    var $objUl = $("#"+ ulID);
    $objUl.find("li").removeClass("active");
    $objUl.find("li:first").addClass("active");

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

/**
 * 获取列表查询 时间keyword
 * @param start
 * @param end
 * @returns {string}
 */
function getStartEndTime(start,end){
    var keyword = "";
    if(start == "" && end != ""){
        keyword = "|" + end + " 23:59:59";
    }else if (start != "" && end == "" ){
        keyword = start + "|";
    }else if(start != "" && end != ""){
        keyword = start + "|" + end + " 23:59:59";
    }else{
        keyword = "|";
    }
    return keyword;

}

function setCopyRightInfo(){
    var copyrightInfo = $("#copyrightInfo");
    doPost("/action/systemDictionary/list",{},function(objs){
        if(objs.httpCode == "200" && objs.data && objs.data != ""){
            copyrightInfo.text(objs.data);
        }
        copyrightInfo.show();
    });
}