package com.sigma.service;

import com.sigma.po.NodePo;
import com.sigma.po.ShapePo;

import java.util.List;

/**
 * Created by Administrator on 2015/11/14.
 */
public interface ShapeService {


    /**
     * 查找
     *
     * @return
     */
    ShapePo findOne(Long id);
    /**
     * 查找
     *
     * @return
     */
    List<ShapePo> findAll();

    /**
     * 新增/更新
     *
     * @param shapePo
     * @return
     */
    ShapePo save(ShapePo shapePo);

    /**
     * 删除
     *
     * @param id
     */
    void delete(Long id);

}
