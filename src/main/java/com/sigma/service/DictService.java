package com.sigma.service;

import com.sigma.po.DictPo;

import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface DictService {
    /**
     * 查找
     *
     * @return
     */
    DictPo findOne(Long id);

    DictPo findByUuid(String uuid);
    /**
     * 查找
     *
     * @return
     */
    List<DictPo> findAll();

    /**
     * 新增/更新
     *
     * @param dictPo
     * @return
     */
    DictPo save(DictPo dictPo);
    /**
     * 删除
     *
     * @param id
     */
    void delete(Long id);
}
