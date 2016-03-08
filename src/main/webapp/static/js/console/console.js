/**
 * Created by songxiaoguang on 2014/11/8.
 */

function loadidentity(regionListObj,listRegionsFuc){
        regionListObj.show();
        listRegionsFuc();
}


//时区转换

function convertTimeZoneToLocal(str_time){
    var new_str = str_time.replace(/:/g,'-');
    new_str = new_str.replace(/ /g,'-');
    var arr = new_str.split("-");
    var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
    var strtotime = datum.getTime();
    var timeOffset = new Date().getTimezoneOffset();
    //获得时区小时偏移基数
    var hour = parseInt(timeOffset / 60);
    //获得时区分钟偏移基数
    var munite = timeOffset % 60;
    var prefix = "-";
    if (hour < 0 || munite < 0) {
        prefix = "+";
        hour = -hour;
        if (munite < 0) {
            munite = -munite;
        }
    }
    hour += " ";
    munite += " ";
    if (hour.length == 2) {
        hour = "0" + hour;
    }
    if (munite.length == 2) {
        munite = "0" + munite;
    }
    var localtime =null;
    if(prefix =="+"){
        localtime = strtotime+hour*3600*1000+munite*60*1000;
    }else
    {
        localtime = strtotime-hour*3600*1000+munite*60*1000;
    }

    return new Date(localtime).Format("yyyy-MM-dd hh:mm:ss");
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


/**配置升级和带宽伸缩
 *
 */

/***********************滑动条***********************************/
function SilderBar(eC,eText,opts){
    this.eC=eC||$('');
    this.eText=eText||$('');
    this.init(opts);
}
SilderBar.prototype={
    constructor:SilderBar,
    init:function(opts){
        this.eRange=$('.range',this.eC);
        this.eDragBtn=$('.drag',this.eRange);
        this.eContainer=$('.container',this.eC);

        this.iMaxW=this.eC.width();
        this.iLeft=this.eC.offset()['left'];
        this.iDragW=this.eDragBtn.width()/2+2;//拖拽条框度

        this.opts=opts;
        this.arrUnitCount=this.opts.unit||1;
        this.iSelData=this.opts.iInitData||0;
        this.iUnit=this.opts.iUnit;
        this.costFn =this.opts.costFn;
        this.switchData=this.opts.switchData;
        this.iMin=this.opts.iMin||0;

        this.initRender();
        this.bind();
        this.initBarPos(this.iSelData);
    },
    initRender:function(){
        var _this=this;
        this.arrCUnit=$('.unit',this.eContainer); //选择区域块
        this.arrEUnit=$('.block',this.eRange);//内容区域块
        this.arrUnitWidth=[];

        this.arrEUnit.each(function(i,item){
            var eItem=$(item).attr('data-index',i),iW=eItem.width();
            _this.arrUnitWidth.push(iW);
            _this.arrCUnit.eq(i).css('width',iW).attr('data-index',i);
        });

        this.iMaxValue=(function(){
            var iCount=0;
            $.each(_this.arrUnitCount,function(i,item){
                iCount+=item;
            });
            return iCount;
        })();
    },
    initBarPos:function(iSelData){
        var iSection=0, iUnit = 0,iW=0,iLen=this.arrUnitCount.length,iTemp=0,iCut=0;
        iSelData =iSelData/this.iUnit;
        if(iSelData>this.iMaxValue)iSelData=this.iMaxValue;
        for(;iSection<iLen;iSection++){
            iTemp+=this.arrUnitCount[iSection];
            if(iSelData<=iTemp)break;
            iW+=this.arrUnitWidth[iSection];
            iCut +=this.arrUnitCount[iSection];
        }
        iSection=iSection==iLen?iSection-1:iSection;
        iUnit=this.arrUnitWidth[iSection]/this.arrUnitCount[iSection];
        iW +=(iSelData-iCut)*iUnit
        iW = iW ==0?-7:iW ;
        this.sliderAnimateTo(iW-this.iDragW,iW-this.iDragW,iSection,iSelData-iCut);
    },
    bind:function(){//事件绑定
        var _this=this;
        this.eDragBtn.bind('drag',function(event){
            _this._dragFn(event);
        });
        this.eDragBtn.bind('dragend',function(event){
            _this._dragEndFn(event);
        });
        this.arrCUnit.click(function(event){
            _this.clickFn(event,$(this).attr('data-index'));
        });
        this.arrEUnit.click(function(event){
            _this.clickFn(event,$(this).attr('data-index'));
        });
        this.eText.bind('blur',function(event){
            _this._fillBackFn($(this).val());
        })
    },
    unbind:function(){//事件绑定
        //var _this=this;
        this.eDragBtn.unbind('drag');
        this.eDragBtn.unbind('dragend');
        this.arrCUnit.unbind("click");
        this.arrEUnit.unbind("click");

        this.eText.unbind('blur');
    },
    _dragFn:function(event){
        var oPos=this._getDragPos(event);
        this.eDragBtn.css('left',oPos['left']);
        this.eContainer.css('width',oPos['width']);
        this._setSelectedData(oPos['index'],oPos['count']);
    },
    _dragEndFn:function(event){
        var oPos=this._getDragPos(event);
        if(oPos['left']>0){
            this.sliderAnimateTo(oPos['iRelLeft'],oPos['iRelLeft'],oPos['index'],oPos['count']);
        }else{
            this.sliderAnimateTo(this.iMin*oPos['iUnit']-this.iDragW,this.iMin*oPos['iUnit']-this.iDragW,0,this.iMin);
        }
        this.costFn && this.costFn();
    },
    _fillBackFn:function(sValue){
        sValue =$.trim(sValue);
        if(sValue=='' ||/\D/g.test(sValue)||sValue< this.iUnit){
            sValue=0;
        }
        this.initBarPos(sValue);
    },
    clickFn:function(event,iIndex){
        var iStartRLeft=this._getStartLeft(iIndex),
            iX=event.pageX-iStartRLeft,
            iUnit = this.arrUnitWidth[iIndex]/this.arrUnitCount[iIndex],
            iCounts=0,iRLeft=0;

        iX =iX <this.iMaxW?iX:this.iMaxW,
            iCounts=Math.ceil(iX/iUnit);
        iRLeft=iCounts*iUnit+iStartRLeft-this.iLeft-this.iDragW;

        this.sliderAnimateTo(iRLeft,iRLeft,iIndex,iCounts);
        this.costFn && this.costFn();
    },
    _getStartLeft:function(iIndex){
        var iLeft=this.iLeft;
        for (var i = 0; i < iIndex; i++) {
            iLeft+=this.arrUnitWidth[i];
        }
        return iLeft;
    },
    _getDragPos:function(event){//获取拖拽位置（矫正）
        var iW=event.pageX-this.iLeft,iLeft=iW,iToalL;
        iW =iW>0?iW:(iLeft=-this.iDragW,0);
        iW =iW <this.iMaxW?iW:(iLeft=this.iMaxW ,this.iMaxW),
            iToalL=0,iLen=this.arrUnitWidth.length,iCount=0,iCut=0,iUnit=0;

        for (var i = 0; i < iLen; i++) {
            iToalL +=this.arrUnitWidth[i];
            if(iW<iToalL) break;
            iCut +=this.arrUnitWidth[i];
        }
        if(i==iLen){
            i=iLen-1;
            iCount=this.arrUnitCount[i];
        }else{
            iUnit=this.arrUnitWidth[i]/this.arrUnitCount[i];
            iCount=Math.ceil((iW-iCut)/iUnit);
        }
        return {'width':iW,'left':iLeft- this.iDragW,'index':i,'count':iCount,"iUnit":iUnit,"iRelLeft":iCut+iUnit*iCount- this.iDragW};
    },
    sliderTo:function(iLeft,iW){
        this.eDragBtn.css('left',iLeft);
        this.eContainer.css('width',iW);
        this._setSelectedData(iIndex,iCounts);
    },
    sliderAnimateTo:function(iLeft,iW,iIndex,iCounts){
        this.eDragBtn.stop().animate({
            'left':iLeft
        });
        this.eContainer.stop().animate({
            'width':iW
        });
        this._setSelectedData(iIndex,iCounts);
    },
    _setSelectedData:function(iIndex,iCounts){
        for (var i = 0; i < iIndex; i++) {
            iCounts +=this.arrUnitCount[i]
        }
        this.iSelData=iCounts*this.iUnit;
        if(this.switchData){
            this.iSelData=this.switchData(this.iSelData)||this.iSelData;
        }
        this.eText.val(this.iSelData);
    },
    getData:function(){
        return this.iSelData;
    }
};

function initBandwidthSlider(barId,barInput){
    var oBandwidthManager={
        init:function(unitArray,costFn){
            var _this=this;
            this.costFn =costFn;
            this.unitArray =unitArray;
            this.oSilderBar=new SilderBar($('#'+barId),$('#'+barInput),{
                unit:unitArray,
                iInitData:1,
                iUnit:1,
                iMin:0,
                costFn:function(){
                    _this.costFn &&  _this.costFn();
                }
            });
        },
        initPage:function(data){
            var bandwidthList=data;
            if(bandwidthList.length === 0 ){
                notification("没有产品","该地域下带宽产品数据为空",function(){});
                return;
            }
            var unitWidth = 100 / bandwidthList.length;

            var unitArray = [],
                firstStr = "",
                secondStr = '<div class="container"><div class="bandwidth-unit current">';

            this.bandwidthList = bandwidthList;

            for(var i = 0;i < bandwidthList.length;i++){
                if(i === 0){
                    unitArray[i] = bandwidthList[i].unitCountMax;
                }else{
                    unitArray[i] = bandwidthList[i].unitCountMax - bandwidthList[i-1].unitCountMax;
                }
                if( i === (bandwidthList.length - 1)){
                    firstStr += '<span class="block" style="width:'+ unitWidth +'%"><div  class="last" style="border-right: solid 1px #E5e5e5;"><span>' + bandwidthList[i].unitCountMax + 'M</span></div></span>';
                    secondStr += '<span class="unit"><div class="last" style="border-right: solid 1px #E5e5e5;"><span>' + bandwidthList[i].unitCountMax + 'M</span></div></span></div></div>';
                }else {
                    firstStr += '<span class="block" style="width:'+ unitWidth +'%"><div><span>' + bandwidthList[i].unitCountMax + 'M</span></div></span>';
                    secondStr += '<span class="unit"><div><span>' + bandwidthList[i].unitCountMax + 'M</span></div></span>';
                }
            }

            $("#init-bandwidth").empty().append(firstStr + secondStr + '<a href="javascript:;" class="drag" hidefocus="" id="test"><i></i><i></i><i></i></a>');

            return unitArray;
        },
        getData:function(){
            return this.oSilderBar.getData();
        }
    };
    return oBandwidthManager;

}
function initHardDiskSlider(){
    var oHardDiskManager1={
        init:function(data,unitArray,minValue,costFn){
            var _this=this;
            this.diskDataObj = {};
            for(var i = 0, length = data.length; i < length; i++){
                this.diskDataObj[data[i].id] = data[i];
            }

            this.costFn =costFn;
            this.diskServices=$("#uc-diskServices");
            var diskServicesStr = "";
            for(var i=0;i<data.length;i++){
                if(i==0 ){
                    diskServicesStr += '<a  href="javascript:;" data-value="'+ data[i].id +'" class="unit current" hidefocus="">'+ data[i].name+'</a>';
                }else{
                    diskServicesStr += '<a  href="javascript:;" data-value="'+ data[i].id +'" class="unit" hidefocus="">'+ data[i].name+'</a>';
                }
            }
            _this.diskServices.empty().append(diskServicesStr);


            _this.diskServices.click(function(event){//添加地域容器点击事件
                $("#uc-diskServices a").removeClass("current");
                $(event.target).addClass("current");
                var diskDataID = $(event.target).attr("data-value");

                oManager.productsInfo.disk = [];
                oManager.productsInfo.disk.push(_this.diskDataObj[diskDataID]);
                $("#maxDiskValue,#maxDiskValue1").text(_this.diskDataObj[diskDataID].unitCountMax +"G");
                _this.oSilderBar=new SilderBar($('#hard-disk'),$('#hard-disk-value'),{
                    unit:[_this.diskDataObj[diskDataID].unitCountMax / _this.diskDataObj[diskDataID].billUnitCount],
                    //iInitData:_this.diskDataObj[diskDataID].billUnitCount,
                    iInitData:minValue,
                    iUnit:_this.diskDataObj[diskDataID].billUnitCount,
                    iMin:minValue,
                    iMax:_this.diskDataObj[diskDataID].unitCountMax,
                    costFn:function(){
                        _this.costFn &&  _this.costFn();
                    }
                });
                _this.costFn &&  _this.costFn();
                $('span[name="productPackage_add_disk_note"]').html("数据盘以"+_this.diskDataObj[diskDataID].billUnitCount+"GB为步长");
            });
            $("#maxDiskValue,#maxDiskValue1").text(unitArray[1] +"G");
            this.oSilderBar=new SilderBar($('#hard-disk'),$('#hard-disk-value'),{
                unit:[ unitArray[1] / data[0].billUnitCount],
                //iInitData:data[0].billUnitCount,
                iInitData:minValue,
                iUnit:data[0].billUnitCount,
                iMin:minValue,
                iMax:data[0].unitCountMax,
                costFn:function(){
                    _this.costFn &&  _this.costFn();
                }
            });
            $('span[name="productPackage_add_disk_note"]').html("数据盘以"+data[0].billUnitCount+"GB为步长");
        },
        initPage:function(data,index){
            var diskType=data;
            if(diskType.length === 0 ){
                showErrorMsg("磁盘产品数据为空");
                return;
            }
            var unitArray = [];
            unitArray.push(data[index].unitCountMin);
            unitArray.push(data[index].unitCountMax);
            return unitArray;
        },
        getData:function(){
            return this.oSilderBar.getData();
        },
        unbind:function(){
            this.oSilderBar.unbind();
        }
    };
    return oHardDiskManager1;

}
