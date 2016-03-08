package com.sigma.service;

import com.sigma.po.NodePo;
import com.sigma.po.ShapePo;

import java.util.List;

/**
 * Created by Administrator on 2015/11/14.
 */
public interface NodeService {


    /**
     * 查找
     *
     * @return
     */
    NodePo findOne(Long id);
    /**
     * 查找
     *
     * @return
     */
    List<NodePo> findAll();
    /**
     * 查找
     *
     * @return
     */
    List<NodePo> findByShapeId(Long shapeId);
    /**
     * 新增/更新
     *
     * @param nodePo
     * @return
     */
    NodePo save(NodePo nodePo, ShapePo shapePo);
    /**
     * 新增/更新
     *
     * @param nodePo
     * @return
     */
    NodePo save(NodePo nodePo);
    /**
     * 删除
     *
     * @param id
     */
    void delete(Long id);

}
