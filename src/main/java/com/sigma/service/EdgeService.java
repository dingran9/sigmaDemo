package com.sigma.service;

import com.sigma.po.EdgePo;

import java.util.List;

/**
 * Created by Administrator on 2015/11/14.
 */
public interface EdgeService {

    /**
     * 查找
     *
     * @return
     */
    EdgePo findOne(Long id);
    /**
     * 查找
     *
     * @return
     */
    List<EdgePo> findAll();
    /**
     * 查找
     *
     * @return
     */
    List<EdgePo> findByShapeId(Long shapeId);
    /**
     * 新增/更新
     *
     * @param edgePo
     * @return
     */
    EdgePo save(EdgePo edgePo);

    /**
     * 删除
     *
     * @param id
     */
    void delete(Long id);

}
