package com.sigma.controller;

import com.sigma.po.EdgePo;
import com.sigma.po.NodePo;
import com.sigma.po.ShapePo;
import com.sigma.service.EdgeService;
import com.sigma.service.NodeService;
import com.sigma.service.ShapeService;
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
import javax.validation.Valid;
import javax.ws.rs.PathParam;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2015/11/14.
 */
@Controller
@RequestMapping(value = "/edge")
public class EdgeController {

    private final Logger logger = LoggerFactory.getLogger(EdgeController.class);


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
    public ResponseItem list(@PathParam(value = "shapeId") Long shapeId,
                             HttpServletRequest request) throws Exception {

        ResponseItem ri = new ResponseItem();

        try {
            ShapePo shapePo= shapeService.findOne(shapeId);
            if(shapePo==null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "shapePo");
            }
            Map<String,Object> data=new HashMap<>();
            List<EdgePo> edgePos= edgeService.findByShapeId(shapeId);
            data.put("edgePos",edgePos);
            List<NodePo> nodePos= nodeService.findByShapeId(shapeId);
            data.put("nodePos",nodePos);
            ri.setData(data);
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
            @RequestParam(value = "sourceId") Long sourceId,
            @RequestParam(value = "targetId") Long targetId,
            @RequestParam(value = "type") String type,
            @RequestParam(value = "arrowType") String arrowType,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            NodePo sourceNode= nodeService.findOne(sourceId);
            if(sourceNode==null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "sourceNode");
            }
            NodePo targetNode= nodeService.findOne(targetId);
            if(targetNode==null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "targetNode");
            }
            EdgePo edgePo=new EdgePo();
            edgePo.setSource(sourceNode);
            edgePo.setShapeId(sourceNode.getShapeId());
            edgePo.setTarget(targetNode);
            edgePo.setEdgeType(getEdgeType(type));
            edgePo.setArrowType(getEdgeArrowType(arrowType));
            ri.setData(edgeService.save(edgePo));
            return ri;
        } catch (Exception e) {
            logger.error("add exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "add exception");
        }
    }

    private  EdgePo.EdgeType getEdgeType(String type){
        switch (type){
            case "Line":
                return EdgePo.EdgeType.line;
            default:
                return EdgePo.EdgeType.curve;
        }
    }
    private  EdgePo.ArrowType getEdgeArrowType(String type){
        switch (type){
            case "Source":
                return EdgePo.ArrowType.Source;
            case "Both":
                return EdgePo.ArrowType.Both;
            case "None":
                return EdgePo.ArrowType.None;
            default:
                return EdgePo.ArrowType.Target;
        }
    }
}
