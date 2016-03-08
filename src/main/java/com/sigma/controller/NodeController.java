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
import javax.ws.rs.PathParam;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2015/11/14.
 */
@Controller
@RequestMapping(value = "/node")
public class NodeController {
    private final Logger logger = LoggerFactory.getLogger(NodeController.class);
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
            @RequestParam(value = "shapeId",required = false) Long shapeId,
            @RequestParam(value = "shapeName",required = false) String shapeName,
            @RequestParam(value = "label") String label,
            @RequestParam(value = "positionX") Integer positionX,
            @RequestParam(value = "positionY") Integer positionY,
            @RequestParam(value = "size") Integer size,
            @RequestParam(value = "color") String color,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            NodePo nodePo=new NodePo();
            nodePo.setColor(color);
            nodePo.setSize(size);
            nodePo.setPositionX(positionX);
            nodePo.setPositionY(positionY);
            nodePo.setLabel(label);
            if(shapeId!=null){
              ShapePo shapePo= shapeService.findOne(shapeId);
                if(shapePo!=null){
                    nodePo.setShapeId(shapeId);
                    nodeService.save(nodePo);
                }
            }else {
                if(StringUtils.isBlank(shapeName)){
                    return ResponseItem.responseWithName(ri, ResponseCode.PARAMETER_MISS.toString(), "shapeName");
                }
                ShapePo shapePo=new ShapePo();
                shapePo.setName(shapeName);
                nodeService.save(nodePo,shapePo);
            }
            return ri;
        } catch (Exception e) {
            logger.error("add exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "add exception");

        }
    }

}
