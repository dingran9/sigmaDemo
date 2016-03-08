//var current_region="127.0.0.1";

var rpl = {
    zh_cn :{
        hello: "你好",
        helloParam: "第一个参数{{:first}},第二个参数{{:second}}.",

        'name': '名称',
        'email': '邮箱',
        'phone': '手机',
        'type': '类型',
        'status': '状态',
        'description': '描述',
        'number': '序号',
        'roleType': '角色类型',
        'billUnitName': '单位名称',
        'createTime': '创建时间',
        'updateTime': '更新时间',
        'price': '价格（元/月）',
        'totalPrice': '总价格（元）',
        'bill_cycle': '计费周期',
        'unit_count_min': '最大值',
        'unit_count_max': '最小值',
        'billUnitCount': '计费单元',
        'NOT_ACTIVE':'未激活',
        'ENABLE':'可用',
        'DISABLE':'禁用',
        'Linear':'阶梯价',
        'Nonlinear':'单一价',
        'Enable':'可用',
        'NotPay':'未支付',
        'HavePay':'已支付',
        'Cancel':'已取消',
        'rel_pay_amount':'实际支付金额',
        'billType':'订单类型',
        'pay_time':'支付时间',
        'service_begin_time':'开通时间',
        'bill_begin_time':'计费开始时间',
        'bill_end_time':'计费截止时间',
        'User':'线上',
        'Admin':'线下',
        'order_number':'订单号',
        'Ordinary':'购买订单',
        'Renewals':'续费',
        'OrderSources':'来源',
        'operation':'操作',
        'resource_type':'资源类型',
        'Instance':'云主机',
        'Disk':'磁盘',
        'amount':'金额',
        'consumeAmountLimited':'消费限制',
        'productPackage_limit':'套餐限制',
        'productCat_limit':'产品类别限制',
        'usedTime':'使用时间',
        'beginTime':'起始时间',
        'endTime':'结束时间',
        'OnLine':'线上',
        'NotOnLine':'线下',
        'Buy':'新购',
        'account':'用户',
        'receipt_operation':'操作',
        'ValueAddedTax':'增值税',
        'accountDetail':'用户信息',
        'MAN':'男',
        'WOMAN':'女',
        'SELF_REGISTER':'自行创建',
        'ADMIN_REGISTER':'管理员创建',
        'billBeginTime':'计费起始时间',
        'billEndTime':'计费截止时间',
        'receipt_amount_y':'已开发票金额',
        'receipt_amount_n':'未开发票金额(元)',
        'cpu':'CPU',
        'mem':'内存',
        'bandwidth':'带宽',
        'image':'镜像',
        'snapshot':'快照',
        'NotThroughAudit':'未通过',



        'transaction-code': '订单编号',
        'transaction-type': '订单类型',
        'transaction-date': '订单日期',
        'transaction-sum-of-money': '金额/明细（元）',
        'transaction-cash': '现金金额（元）',
        'transaction-voucher': '代金券金额（元）',

        'voucher-code':'代金券编号',
        'voucher-sum':'代金券金额',
        'voucher-endDate':'截止有效期',
        'voucher-descript':'代金券描述',

        'charge-record-sum':"充值金额 (单位：元)",
        'charge-record-type':"类型",
        'charge-record-date':"日期",
        'charge-record-payer':"付款人",

        'receipt_number':"编号",
        'receipt_amount':"金额(元)",
        'receipt_type':"类型",
        'receipt_status':"状态",
        'receipt_title':"发票抬头",
        'receipt_contactor':"联系人",
        'receipt-operation':"操作",
        'Common':"普通",
        'HaveInvoiced':"已开具",
        'PendingAudit':"待审核",
        'ThroughAudit':"已通过",
        'Registered':"挂号",
        'Express':"快递",
        'Self':"自取",

        'bill_type':"计价类型",
        'version':"版本",
        'content':"协议内容",
        'instance':"云主机",
        'disk':"磁盘",
        "diskSnap":"磁盘快照",
        'IP_address' :'IP地址',
        'users_belong' :'所属用户',
        'remaining_time' :'剩余时间',
        'configure':'配置',

        //权限
        'idcManager':"账户管理",
        'idcManager_list':"列表",
        'idcManager_create':"新增",
        'idcManager_edit':"编辑",
        'idcManager_delete':"删除",
        'idcPermission':"操作权限管理",
        'idcPermission_list':"列表",
        'idcRole':"角色管理",
        'idcRole_list':"列表",
        'idcRole_create':"新增",
        'idcRole_edit':"编辑",
        'idcRole_delete':"删除",
        'productCat':"产品类别管理",
        'productCat_list':"列表",
        'productCat_edit':"编辑",
        'productCat_delete':"删除",
        'product':"产品管理",
        'product_list':"列表",
        'product_add':"新增",
        'product_edit':"编辑",
        'product_updateStatus':"启用/禁用",
        'product_delete':"删除",
        'productPackage':"产品套餐管理",
        'productPackage_list':"列表",
        'productPackage_add':"新增",
        'productPackage_edit':"编辑",
        'productPackage_updateStatus':"启用/禁用",
        'productPackage_delete':"删除",
        'systemImage':"镜像管理",
        'systemImage_list':"列表",
        'systemRegion':"地域管理",
        'regionName':"名称",
        'systemRegion_list':"列表",
        'userAccount':"客户管理",
        'userAccount_list':"列表",
        'userAccount_edit':"编辑",
        'userEnterprice':"公司管理",
        'userEnterprice_list':"列表",
        'bill':"计费管理",
        'bill_findCouponByAccountAmountLimited':"代金券列表",
        'bill_findCashByAccountId':"列表",
        'bill_recharge':"充值",
        'bill_pay':"支付",
        'billcoupon':"代金券管理",
        'billcoupon_list':"列表",
        'billcoupon_distribute':"派发",
        'receipt':"发票管理",
        'receipt_list':"列表",
        'receipt_findByReceiptYear':"按年份查询",
        'receipt_findReceiptInfoByAccountId':"按用户年份查询",
        'receipt_apply':"申请",
        'recharge':"充值管理",
        'recharge_pageList':"分页列表",
        'recharge_delete':"删除",
        'receipt_examine':"审核",
        'ledger_detail':"总账信息",
        'systemAgreement_detail':"总账信息",
        'ledger':"总账管理",
        'userAccount_resetPwd':"重置密码",
        'orderInfo':"订单管理",
        'orderInfo_list':"列表",
        'orderInfo_add':"新增",
        'orderInfo_edit':"编辑",
        'idcManager_updateStatus':"启用/禁用",
        'systemAgreement':"服务协议",
        'systemAgreement_findAll':"列表",
        'systemAgreement_create':"新增",
        'systemAgreement_update':"编辑",
        'systemAgreement_delete':"删除"
    },
    en_us :{
        hello : "hello world",
        helloParam: "first param {{:first}},second param {{:second}}."

    }
};