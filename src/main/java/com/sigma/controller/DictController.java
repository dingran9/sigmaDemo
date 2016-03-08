package com.sigma.controller;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sigma.po.DictItemPo;
import com.sigma.po.DictPo;
import com.sigma.service.DictItemService;
import com.sigma.service.DictService;
import com.sigma.util.ResponseCode;
import com.sigma.util.ResponseItem;

/**
 * Created by Administrator on 2015/12/20.
 */
@Controller
@RequestMapping(value = "/dictmanager")
public class DictController {


    private final Logger logger = LoggerFactory.getLogger(DocumentController.class);

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
    public ResponseItem list(HttpServletRequest request) throws Exception {

        ResponseItem ri = new ResponseItem();

        try {
            List<DictPo> dictPos= dictService.findAll();
            for(DictPo d: dictPos){
                d.setDictItemPos(dictItemService.findByDictId(d.getId()));
            }
            ri.setData(dictPos);
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
            @RequestParam(value = "dictmanagerId") String dictmanagerId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DictPo dictPo= dictService.findByUuid(dictmanagerId);
            if(dictPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "dictPo");
            }
            dictPo.setDictItemPos(dictItemService.findByDictId(dictPo.getId()));
            ri.setData(dictPo);
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
            @RequestParam(value = "code") String code,
            @RequestParam(value = "name") String name,
            @RequestParam(value = "validMark") Integer validMark,
            @RequestParam(value = "describe",required = false) String describe ,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DictPo dictPo=new DictPo();
            dictPo.setCode(code);
            dictPo.setName(name);
            dictPo.setValidMark(validMark);
            dictPo.setRemark(describe);
            ri.setData(dictService.save(dictPo));
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
            @RequestParam(value = "dictmanagerId") String dictmanagerId,
            @RequestParam(value = "code",required = false) String code,
            @RequestParam(value = "name",required = false) String name,
            @RequestParam(value = "describe",required = false) String describe ,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DictPo dictPo= dictService.findByUuid(dictmanagerId);
            if(dictPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "dictPo");
            }
            if(StringUtils.isNotBlank(code)){
                dictPo.setCode(code);
            }
            if(StringUtils.isNotBlank(name)){
                dictPo.setName(name);
            }
            if(StringUtils.isNotBlank(describe)){
                dictPo.setRemark(describe);
            }
            ri.setData(dictService.save(dictPo));
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
            @RequestParam(value = "dictmanagerId") String dictmanagerId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DictPo dictPo= dictService.findByUuid(dictmanagerId);
            if(dictPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "dictPo");
            }
            List<DictItemPo> list=  dictItemService.findByDictId(dictPo.getId());
            if(list!=null && list.size()>0){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_INUSE.toString(), "该字典下有字典项，不能删除.");
            }
            dictService.delete(dictPo.getId());
            return ri;
        } catch (Exception e) {
            logger.error("delete exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "delete exception");
        }
    }
    
}
