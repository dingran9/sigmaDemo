function switchOrderTab(obj,hash){
//    $("#products-tabTitle-order").find('li').removeClass("active");
//    $("#create_order_modal a[href='"+hash+"']").closest("li").addClass("active");
//    $("#create_order_modal .tab-pane").removeClass("active");
    $(obj).parent().addClass("active").siblings().removeClass("active");
    $(hash).addClass("active").show().siblings().hide();

}

; (function ($) {
    var _oBaseConfig = {//数据配置对象
        "cpu": {
        },
        "os":{

        }
    }
    /***********************地域管理******************************/
    var oRegionManager={
        init:function(oManagerInit){
            var _this = this;
            this.oManagerInit = oManagerInit;
            this.regionList=$("#cniaas-region-order");
            doPost("/action/systemRegion/list",{status:"Available"},function(objs){
                if(objs.httpCode == "200"){
                    var regionStr = "";
                    for(var i=0;i<objs.datas.length;i++){
                        regionStr += '<a  href="javascript:;" data-value="'+ objs.datas[i].id +'" class="unit" hidefocus="">'+ objs.datas[i].name+'</a>';
                        //regionStr += '<a onclick="regionChange(this)" href="javascript:;" data-value="'+ objs.datas[i].regionUuid +'" class="unit" hidefocus="">'+ objs.datas[i].name+'</a>';
                    }
                    _this.regionList.empty().append(regionStr);
                    _this.regionList.find("a:first").addClass("current");

                    _this.regionList.click(function(event){//添加地域容器点击事件
                        $("#cniaas-region-order a").removeClass("current");
                        $(event.target).addClass("current");
                        var regionId = _this.regionList.find("a.current").attr("data-value");
                        _this.oManagerInit(regionId);
                    });
                    var regionId = _this.regionList.find("a.current").attr("data-value");
                    _this.oManagerInit(regionId);
                }else{
                    //console.log();
                }
            });
        }
    }

    /***********************CPU内存管理********************************/
    var oCpuManager={
        init:function(costFn){
            this.eCpuList=$('#uc-cpu-order');//cpu容器标签
            this.eMemoryList=$('#uc-ram-order');//内存容器标签
            this.eCpuHidden=$('#uc-cpu-order-hidden');//cpu表单隐藏标签
            this.eMemoryHidden=$('#uc-ram-order-hidden');//内存表单隐藏标签
            this.eMemoryAlert=$('#uc-ram-order-alert');
            this.cupTemplateFn=_.template(this._cpuTemplate);//cpu渲染模板方法
            this.memorylateFn=_.template(this._memoryTemplate);//内存渲染模板方法
            this.bAlert=false;
            var i = 0;
            for(var key in _oBaseConfig['cpu']){
                if(i === 0){
                    this.iCurCpuValue=_oBaseConfig['cpu'][key].value;
                    break;
                }
            }
            //this.iCurCpuValue=1;
            this.iAlert=this.iCurMemoryValue=1024;
            this.oCpuData=_oBaseConfig['cpu'];
            this.costFn =costFn;
            this._renderCpu();
        },
        _renderCpu:function(){//渲染CPU
            var sKey='',oCpu=null,arrHTML=[];

            for (sKey in this.oCpuData) {
                oCpu=this.oCpuData[sKey];
                arrHTML.push(this.cupTemplateFn(oCpu));
            }
            this.eCpuList.html(arrHTML.join(''));

            $('a[data-value="'+ this.iCurCpuValue+'"]',this.eCpuList).addClass('current');
            this._resetCpu();
            this.renderMemory();
            this.bind();
        },
        renderMemory:function(){//渲染内存
            var oCpu=this.oCpuData['cpu_'+this.iCurCpuValue],
                arrMemory=oCpu['arrMemory'],
                iLen=arrMemory.length,
                oTemp=null, i = 0,arrHTML=[];

            for (; i < iLen; i++) {
                oTemp=arrMemory[i];
                arrHTML.push(this.memorylateFn(oTemp));
            }
            this.eMemoryList.html(arrHTML.join(''));
            this._resetMemory();
        },
        _resetCpu:function(){
            $('.current',this.eCpuList).removeClass('current');
            $('a[data-value="'+ this.iCurCpuValue+'"]',this.eCpuList).addClass('current');
        },
        _resetMemory:function(){
            var eCur=$('a[data-value="'+ this.iCurMemoryValue+'"]',this.eMemoryList);
            $('.current',this.eMemoryList).removeClass('current');
            if(eCur.length>0){
                eCur.addClass('current');
            }else{
                eCur=this.eMemoryList.children().first();
                eCur.addClass('current');
                this.iCurMemoryValue=eCur.attr('data-value');
            }
            this._resetData();
        },
        _resetData:function(){
            this.eCpuHidden.val(this.iCurCpuValue);
            this.eMemoryHidden.val(this.iCurMemoryValue);
            this._alert();
        },
        _alert:function(){//内存信息提示
            if(this.iCurMemoryValue == this.iAlert && !this.bAlert){
                this.eMemoryAlert.height(0).animate({
                    height:26
                },.3E3);
                this.bAlert=true;
            }else if(this.bAlert){
                this.eMemoryAlert.animate({
                    height:0
                },.3E3);
                this.bAlert=false;
            }
        },
        bind:function(){
            var _this=this;
            this.eCpuList.click(function(event){//添加cpu容器点击事件
                var oTaget=event.target,iDataValue=$(oTaget).attr('data-value');
                if(iDataValue && _this.iCurCpuValue !==iDataValue){
                    _this.iCurCpuValue=iDataValue;
                    _this._resetCpu();
                    _this.renderMemory();
                    _this.costFn &&  _this.costFn();
                }
            });
            this.eMemoryList.click(function(event){//添加内存容器点击事件
                var oTaget=event.target,iDataValue=$(oTaget).attr('data-value');
                if(iDataValue && _this.iCurMemoryValue !==iDataValue){
                    _this.iCurMemoryValue=iDataValue;
                    _this._resetMemory();
                    _this.costFn &&  _this.costFn();
                }
            })
        },
        getData:function(){
            return {'cpu':this.iCurCpuValue,'memory':this.iCurMemoryValue}
        },
        _cpuTemplate:'<a href="javascript:;" data-value="<%=value%>" class="unit" hidefocus=""><%=text%></a>',
        _memoryTemplate:'<a href="javascript:;" data-value="<%=value%>" class="unit" hidefocus=""><%=text%></a>'
    }
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
            this.iSelData=this.opts.iInitData||1;
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
            var iW=event.pageX-this.iLeft,iLeft=iW;
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
    }
    /***********************带宽管理********************************/
    var oBandwidthManager={
        init:function(unitArray,costFn){
            var _this=this;
            this.costFn =costFn;
            this.oSilderBar=new SilderBar($('#uc-band-order'),$('#uc-band-order-value'),{
                unit:unitArray,
                //unit:[5,45,50],
                iInitData:1,
                iUnit:1,
                iMin:1,
                costFn:function(){
                    _this.costFn &&  _this.costFn();
                }
            });
        },
        initPage:function(data){
            var bandwidthList=data;
            if(bandwidthList.length === 0 ){
                showErrorMsg("带宽产品数据为空");
               // $("#uc-band-order").hide();
              //  $("#init-bandwidth-order").empty();
                return;
            }
            var unitWidth = 100 / bandwidthList.length;

            var unitArray = [];
            firstStr = "",
                secondStr = '<div class="container"><div class="bandwidth-unit current">';

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

            $("#init-bandwidth-order").empty().append(firstStr + secondStr + '<a href="javascript:;" class="drag" hidefocus="" id="test-order"><i></i><i></i><i></i></a>');

            return unitArray;
        },
        getData:function(){
            return this.oSilderBar.getData();
        }
    }
    /***********************磁盘大小管理********************************/
    var oHardDiskManager={
        init:function(costFn){
            var _this=this;
            this.costFn =costFn;
            this.oSilderBar=new SilderBar($('#hard-disk-order'),$('#uc-disk-order-value'),{
                unit:[10,15,25],
                //unit:unitArrayDisk,
                iInitData:10,
                iUnit:10,
                costFn:function(){
                    _this.costFn &&  _this.costFn();
                }
            });
        },
        getData:function(){
            return this.oSilderBar.getData();
        }
    }
    /***********************操作系统管理********************************/
    var oOSManager={
        init:function(costFn){
            this.oData=_oBaseConfig['os'];
            this.eOSSel=$('#os-sel');
            this.eOSVSel=$('#os-v-sel');
            this.eRow=this.eOSSel.parents('.row');
            this.templateFn=_.template(this._template);//操作系统，版本项渲染模板方法

            this.costFn=costFn;
            this.initOSOptions();
        },
        initOSOptions:function(){
            var sHtml=[this.templateFn({
                value:-1,
                text:'操作系统'
            })];
            for (var sKey in this.oData) {
                sHtml.push(this.templateFn(this.oData[sKey]));
            }
            this.eOSSel.html(sHtml.join(''));
            this.bind();
        },
        bind:function(){
            var _this=this;
            this.eOSSel.change(function(){
                _this.renderVOptions($(this).val());
                _this.costFn && _this.costFn();
            });
            this.eOSVSel.change(function(){
                _this.costFn && _this.costFn();
            });
        },
        renderVOptions:function(iIndex){//渲染版本下拉框
            var sHtml=[this.templateFn({
                    value:-1,
                    text:'版本'
                })],
                oData=this.oData['os_'+iIndex]||{},
                arrData=oData['versions'] ||[],_this=this;

            $.each(arrData,function(i,item){
                sHtml.push(_this.templateFn(item));
            });

            this.eOSVSel.html(sHtml.join(''));
            this.hideError();
        },
        showError:function(){
            this.eRow.addClass('row-error');
        },
        hideError:function(){
            this.eRow.removeClass('row-error');
        },
        getData:function(){
            return {'os':this.eOSSel.val(),'osv':this.eOSVSel.val()}
        },
        _template:'<option value="<%=value%>"><%=text%></option>'
    }
    /***********************购买时长管理********************************/
    var oTimeManager={
        init:function(costFn){
            var _this=this;
            this.costFn =costFn;
            this.oSilderBar=new SilderBar($('#uc-duration-order'),$('#uc-duration-value-order'),{
                unit:[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                iInitData:1,
                iUnit:1,
                iMin:1,
                costFn:function(){
                    _this.costFn &&  _this.costFn();
                },
                switchData:function(iValue){
                    return _this.switchData(iValue);
                }
            });
        },
        getData:function(){
            return this.switchData(this.oSilderBar.getData());
        },
        switchData:function(iValue){
            switch (String(iValue)) {
                case '13':{//代表2年
                    return '24'
                }
                case '14':{//代表3年
                    return '36'
                }
            }

            return iValue;
        }
    }

    /********************云主机台数管理**************************/
    var oCountsManager={
        init:function(costFn){
            var _this = this;
            this.counts = 1;
            this.costFn =costFn;

            $("input[name='counts']").val(this.counts);


            $("#countsPlus").unbind("click");
            $("#countsPlus").click(function(){
                var counts =Number($("input[name='counts']").val());;
                $("input[name='counts']").val(counts + 1);
                _this.costFn();
            });

            $("#countsMinux").unbind("click");
            $("#countsMinus").click(function(){
                var counts =Number($("input[name='counts']").val());
                if(counts > 1){
                    $("input[name='counts']").val(counts - 1);
                    _this.costFn();
                }else{
                    $("input[name='counts']").val(1);
                    _this.costFn();
                }
            });

            $("input[name='counts']").unbind("change");
            $("input[name='counts']").change(function(){
                _this.costFn();
            });
        }
    }
    /***********************管理********************************/
    var oManager={
        init:function(regionId){
            var _this=this;
            this.regionId = regionId;
            this.eOSSel=$('#os-sel');
            this.bInit=true;
            this.productsInfo = {};
            this.productsId='';


            this.changeTime();

            /* oBandwidthManager.init(function(){
             _this.setOrderCost();
             });*/
      /*      oHardDiskManager.init(function(){
                _this.setOrderCost();
            });*/
            oTimeManager.init(function(){
                _this.setOrderCost();
            });
            oCountsManager.init(function(){
                _this.setOrderCost();
            });

            this.bind();
        },
        bind:function(){
            var _this=this;
            $('#submit-btn').unbind("click");
            $('#submit-btn').click(function(){
                //TODO:表单提交
                var hostName = $("#order_host_user").val();
                if("" == hostName){
                    showErrorMsg("主机用户名不能为空。");
                    return;
                }
                if(hostName == "root" || hostName == "Administrator" || hostName == "administrator"){
                    showErrorMsg("主机用户名格式不正确。");
                    return;
                }
                if(hostName.length > 50){
                    showErrorMsg("主机用户名长度不能大于50。");
                    return;
                }
                var  cycle = oTimeManager.getData();
                var sel_os = $('#os-sel').val();
                if(sel_os == -1){
                    showErrorMsg("请选择系统镜像");
                    return;
                }
                _this.productsId += sel_os+"_0,";
                var counts = $("input[name='counts']").val();
                if(counts=="" || counts==undefined || counts==null){
                    showErrorMsg("请输入购买台数");
                    return;
                }
                $(this).attr("disabled","disabled");
                var accountId=$("#order_users").val();
                var totalPrice=$("#cost-container").val();
                if(totalPrice=="" || totalPrice==undefined || totalPrice==null){
                    showErrorMsg("请输入费用");
                    return;
                }
                var startTime=$("#order-self_startDate_input").val();
                if(convertStr(startTime)==""){
                    showErrorMsg("请选择开通时间");
                    return;
                }
                doPost("/action/orderInfo/create", {startTime:startTime,hostName:hostName,totalPrice:totalPrice,accountId:accountId,productId:_this.productsId,billCycle:cycle,count:counts,resourceType:0},function(objs){
                    if (objs.httpCode == "200") {
                        loadorderTable();
                        $("#order_widget-grid").show().siblings().hide();
                        $("#order_btns").show();
                        showMsg("温馨提示","新增订单成功");
                    } else {
                        console.log("code :" + objs.code + "  msg:" + objs.message);
                        showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
                    }
                });
            /*    doPost("/action/orderInfo/buy",{productId:_this.productsId,billCycle:cycle,count:counts,resourceType:0},function(objs){
                    if(objs.httpCode == "200"){
                        window.location.replace("/action/orderInfo/confirmOrder?orderId="+objs.data);
                    }else{
                        showErrorMsg("服务器内部错误："+objs.message);
                    }
                });*/
            });

            $("#uc-band-order-value").on('blur',function(){
                _this.setOrderCost();
            });

            $("#uc-disk-order-value").on('blur',function(){
                _this.setOrderCost();
            });
            this.bInit=false;
        },
        getData:function(){
            var oCup=oCpuManager.getData();
            return {
                'cpu':oCup['cpu'],//cup大小
                'memory':oCup['memory'],//内存大小
                'bandwidth':oBandwidthManager.getData(),//带宽
                'harddisk':oHardDiskManager.getData(),//磁盘大小
                'time':oTimeManager.getData()//购买时间
            }
        },
        changeTime:function(){
            var _this=this;
            var  cycle = 1;
            var regionId = _this.regionId;
            doPost("/action/product/findProduct", {"billCycle":cycle,regionId:regionId}, function (objs) {
                if(objs.httpCode == "200"){
                    _this.productsInfo = objs.data;
                    //初始化磁盘
                    if(objs.data['disk'].length  < 1){
                        $("#hard-disk-order,#hard-disk-order-span").hide();
                        $("#hard-disk-order-none").show();
                    }else{
                        $("#hard-disk-order,#hard-disk-order-span").show();
                        $("#hard-disk-order-none").hide();
                        oHardDiskManager.init(function(){
                            _this.setOrderCost();
                        });
                    }
                    //初始化带宽slider
                    if(objs.data['bandwidth'].length  < 1){
                        $("#uc-band-order,#uc-band-order-span").hide();
                        $("#uc-band-order-none").show();
                    }else{
                        $("#uc-band-order,#uc-band-order-span").show();
                        $("#uc-band-order-none").hide();
                        var unitArray = oBandwidthManager.initPage(objs.data['bandwidth']);
                        oBandwidthManager.init(unitArray,function(){
                            _this.setOrderCost();
                        });
                    }

                    //初始化镜像列表
                    _oBaseConfig['os'] = {};
                    var imageList=objs.data['image'];
                    if(objs.data['image'].length  < 1){
                        $("#os-sel").empty().append('<option value="">该地域下无镜像产品</option>');
                        // showErrorMsg("系统镜像的数据为空");
                        //   return;
                    }
                    for(var i=0;i<imageList.length;i++){
                        _oBaseConfig['os']["os_"+i] = {
                            "value":imageList[i].id,
                            "text":imageList[i].name
                        };
                    }
                    _oBaseConfig['cpu'] = {};
                    if(objs.data['mem'].length  < 1){
                        $('#uc-ram-order').empty().append("当前地域下无内存产品");
                    }
                    //CPU和内存初始化
                    if(objs.data['cpu'].length  < 1){
                      //  showErrorMsg("产品CPU的数据为空");
                        $('#uc-cpu-order').empty().append("当前地域下无CPU产品");
                        return;
                    }
                    for(var i = 0;i< objs.data['cpu'].length;i++){

                        var arrMemory = [];
                        for(var j=0;j<objs.data['mem'].length;j++){
                            arrMemory.push({
                                "value":objs.data['mem'][j].billUnitCount*1024,
                                "text":objs.data['mem'][j].billUnitCount+"G"
                            });
                        }
                        if(arrMemory.length < 1){
                          //  showErrorMsg("内存产品的数据为空");
                            $('#uc-ram-order').empty().append("当前地域下无内存产品");
                         //   return;
                        }

                        _oBaseConfig['cpu']['cpu_'+objs.data['cpu'][i].billUnitCount] = {
                            "value": objs.data['cpu'][i].billUnitCount,
                            "text": objs.data['cpu'][i].billUnitCount+"核",
                            "arrMemory": arrMemory
                        }
                    }
                    oCpuManager.init(function(){
                        _this.setOrderCost();
                    });


                    oOSManager.init(function(){
                        _this.setOrderCost();
                    });

                    _this.setOrderCost();
                }else{

                }
            });
        },
        setOrderCost:function(){ //计算费用
            var _this = this;
            var data={},iTotal= 0;
            if(!this.bInit){
                data=this.getData();

                var cycle = data.time;
                var products = {};
                products["cpu"]=data.cpu;
                products["mem"]=data.memory  / 1024;
                //products["bandwidth"]=data.bandwidth;
                products["bandwidth"]=$("#uc-band-order-value").val();
                products["disk"]=$("#uc-disk-order-value").val();

                var sum = 0;
                _this.productsId = "";
                for(var obj in this.productsInfo){
                    if(obj == "image"){
                        continue;
                    }
                    if(this.productsInfo[obj].length > 0){
                        if(this.productsInfo[obj][0].productCat && this.productsInfo[obj][0].productCat.billType == "Nonlinear") {
                            if(obj == "disk"){
                                sum = sum + this.productsInfo[obj][0].price * products[obj] *cycle / 10 ;
                                if($.trim(products[obj]) !== '' && products[obj] !== undefined )
                                {_this.productsId += this.productsInfo[obj][0].id+"_"+ products[obj] +",";}
                            } else {
                                for (var i = 0; i < this.productsInfo[obj].length; i++) {
                                    if(this.productsInfo[obj][i].billUnitCount == products[obj]){
                                        sum = sum + this.productsInfo[obj][i].price * cycle;
                                        if ($.trim(products[obj]) !== '' && products[obj] !== undefined) {
                                            _this.productsId += this.productsInfo[obj][i].id + "_" + products[obj] + ",";
                                        }
                                    }
                                }
                            }
                        }else{
                            if(obj == "bandwidth"){
                                var bandWidthCost = 0;
                                for(var j=0;j<this.productsInfo[obj].length;j++){
                                    if(products[obj] >= this.productsInfo[obj][j].unitCountMin ){
                                        if (products[obj] >= this.productsInfo[obj][j].unitCountMax ){
                                            bandWidthCost = bandWidthCost + (this.productsInfo[obj][j].unitCountMax - this.productsInfo[obj][j].unitCountMin + 1) * this.productsInfo[obj][j].price;
                                            if(products[obj] == this.productsInfo[obj][j].unitCountMax){
                                                if($.trim(products[obj]) !== '' && products[obj] !== undefined )
                                                {_this.productsId += this.productsInfo[obj][j].id+"_"+ products[obj] +",";}
                                            }
                                        }else if(products[obj] < this.productsInfo[obj][j].unitCountMax ){
                                            bandWidthCost = bandWidthCost + (products[obj] - this.productsInfo[obj][j].unitCountMin + 1) * this.productsInfo[obj][j].price;
                                            if($.trim(products[obj]) !== '' && products[obj] !== undefined )
                                            {_this.productsId += this.productsInfo[obj][j].id+"_"+ products[obj] +",";}
                                        }
                                    }else{
                                        break;
                                    }
                                }
                                sum  = sum + bandWidthCost * cycle;
                            } else{
                                for (var i = 0; i < this.productsInfo[obj].length; i++) {
                                    if(this.productsInfo[obj][i].billUnitCount == products[obj]){
                                        sum = sum + this.productsInfo[obj][i].price * cycle;
                                        if ($.trim(products[obj]) !== '' && products[obj] !== undefined) {
                                            _this.productsId += this.productsInfo[obj][i].id + "_" + products[obj] + ",";
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                var counts = $("input[name='counts']").val();
                iTotal = sum * counts;
                $('#cost-container').val(iTotal);
            }
        }
    }

    //初始化所有组件
    $.fn.myOrderPlugin = function () {
        oRegionManager.init(function(regionId){
            oManager.init(regionId);
        });
    };
})(jQuery);



function caculateCost() {
    var price = $("#totalPrice").html();
    var count = $("input[name='counts']").val();
    if (!count) {
        count = 1;
        $("input[name='counts']").val(1);
    }
    var totalCost = price * count;
    $("#meal-costs").html(totalCost);
}


function initPackageDetail(packageId) {

    //var packageId = "${packageId}";
//    var packageId = getQueryString("packageId");
    doPost("/action/product/getPackageInfo", {packageId: packageId}, function (objs) {
       // console.log("packageId");
        if (objs.httpCode == "200") {
            $("#packge-name").html(objs.data.name);
            $("#totalPrice").html(objs.data.totalPrice);
            $("#billCycle").html(objs.data.billCycle);
            $("#package-detail-cpu").html(objs.data.cpu);
            $("#package-detail-mem").html(objs.data.mem);
            $("#package-detail-bandwidth").html(objs.data.bandwidth);
            $("#package-detail-disk").html(objs.data.disk);
            $("#package-detail-region").html(objs.data.regionName);

            getImageList(objs.data.regionId);
            caculateCost();
        }
    });
}


function tabPaneSwitch(id){
    $("div.tab-pane1").removeClass("active").hide();
    $("#region-list").find("li").removeClass("active");
    $("a[href='#region-"+id+"']").closest("li").addClass("active");
    $("div#tabs-"+id).addClass("active").show();
}


