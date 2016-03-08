package com.sigma.controller;

import com.sigma.po.ShapePo;
import com.sigma.service.EdgeService;
import com.sigma.service.NodeService;
import com.sigma.service.ShapeService;
import com.sigma.util.ResponseCode;
import com.sigma.util.ResponseItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by Administrator on 2015/11/14.
 */
@Controller
@RequestMapping(value = "/shape")
public class ShapeController {

    private final Logger logger = LoggerFactory.getLogger(ShapeController.class);

    @Inject
    private EdgeService edgeService;
    @Inject
    private NodeService nodeService;
    @Inject
    private ShapeService shapeService;
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
            List<ShapePo> shapePos= shapeService.findAll();
            ri.setData(shapePos);
            return ri;
        } catch (Exception e) {
            logger.error("list exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "list exception");

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
            @RequestParam(value = "shapeName") String shapeName,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            ShapePo shapePo=new ShapePo();
            shapePo.setName(shapeName);
            ri.setData(shapeService.save(shapePo));
            return ri;
        } catch (Exception e) {
            logger.error("add exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "add exception");
        }
    }
}
