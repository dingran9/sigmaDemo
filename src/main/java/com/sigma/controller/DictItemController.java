package com.sigma.controller;

import com.sigma.po.DictItemPo;
import com.sigma.po.DictPo;
import com.sigma.service.DictItemService;
import com.sigma.service.DictService;
import com.sigma.util.ResponseCode;
import com.sigma.util.ResponseItem;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
@Controller
@RequestMapping(value = "/dictItem")
public class DictItemController {
    private final Logger logger = LoggerFactory.getLogger(DictItemController.class);

    @Inject
    private DictService dictService;
    @Inject
    private DictItemService dictItemService;

    /**
     * 查询
     *
     * @return ResponseItem
     * @throws Exception
     */
    @RequestMapping(value = "/list")
    @ResponseBody
    public ResponseItem list(
            @RequestParam(value = "dictmanagerId",required = false) String dictmanagerId,
            @RequestParam(value = "dictmanagerCode",required = false) String dictmanagerCode,
            HttpServletRequest request) throws Exception {

        ResponseItem ri = new ResponseItem();

        try {
            List<DictItemPo> dictItemPos=new ArrayList<>();
            if(StringUtils.isNotBlank(dictmanagerId)){
                DictPo dictPo= dictService.findByUuid(dictmanagerId);
                if(dictPo!=null){
                    dictItemPos= dictItemService.findByDictId(dictPo.getId());
                }
            }else if(StringUtils.isNotBlank(dictmanagerCode)){
                DictPo dictPo= dictService.findByCode(dictmanagerCode);
                if(dictPo!=null){
                    dictItemPos= dictItemService.findByDictId(dictPo.getId());
                }
            }else {
                dictItemPos= dictItemService.findAll();
            }
            ri.setData(dictItemPos);
            return ri;
        } catch (Exception e) {
            logger.error("list exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "list exception");

        }
    }

    /**
     * 详情
     *
     * @return ResponseItem
     * @throws Exception
     */
    @RequestMapping(value = "/detail")
    @ResponseBody
    public ResponseItem detail(
            @RequestParam(value = "dictItemId") String dictItemId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DictItemPo dictItemPo= dictItemService.findByUuid(dictItemId);
            if(dictItemPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "dictItemPo");
            }
            ri.setData(dictItemPo);
            return ri;
        } catch (Exception e) {
            logger.error("detail exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "detail exception");
        }
    }
    /**
     * 新增
     *
     * @return ResponseItem
     * @throws Exception
     */
    @RequestMapping(value = "/add")
    @ResponseBody
    public ResponseItem add(
            @RequestParam(value = "dictmanagerId") String dictmanagerId,
            @RequestParam(value = "name") String name,
            @RequestParam(value = "value") String value,
            @RequestParam(value = "validMark") Integer validMark,
            @RequestParam(value = "remark",required = false) String remark ,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DictPo dictPo= dictService.findByUuid(dictmanagerId);
            if(dictPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "dictPo");
            }
            DictItemPo dictItemPo=new DictItemPo();
            dictItemPo.setDictPo(dictPo);
            dictItemPo.setName(name);
            dictItemPo.setValue(value);
            dictItemPo.setValidMark(validMark);
            dictItemPo.setRemark(remark);
            ri.setData(dictItemService.save(dictItemPo));
            return ri;
        } catch (Exception e) {
            logger.error("add exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "add exception");
        }
    }

    /**
     * 修改
     *
     * @return ResponseItem
     * @throws Exception
     */
    @RequestMapping(value = "/update")
    @ResponseBody
    public ResponseItem update(
            @RequestParam(value = "dictItemId") String dictItemId,
            @RequestParam(value = "name",required = false) String name,
            @RequestParam(value = "value",required = false) String value,
            @RequestParam(value = "validMark",required = false) Integer validMark,
            @RequestParam(value = "remark",required = false) String remark ,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DictItemPo dictItemPo= dictItemService.findByUuid(dictItemId);
            if(dictItemPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "dictItemPo");
            }
            if(StringUtils.isNotBlank(name)){
                dictItemPo.setName(name);
            }
            if(StringUtils.isNotBlank(value)){
                dictItemPo.setValue(value);
            }
            if(validMark!=null){
                dictItemPo.setValidMark(validMark);
            }
            dictItemPo.setRemark(remark);
            ri.setData(dictItemService.save(dictItemPo));
            return ri;
        } catch (Exception e) {
            logger.error("update exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "update exception");
        }
    }
    /**
     * 删除
     *
     * @return ResponseItem
     * @throws Exception
     */
    @RequestMapping(value = "/delete")
    @ResponseBody
    public ResponseItem delete(
            @RequestParam(value = "dictItemId") String dictItemId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DictItemPo dictItemPo= dictItemService.findByUuid(dictItemId);
            if(dictItemPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "dictItemPo");
            }
            dictItemService.delete(dictItemPo.getId());
            return ri;
        } catch (Exception e) {
            logger.error("delete exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "delete exception");
        }
    }
}
