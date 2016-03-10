package com.sigma.service;

import com.sigma.po.DictItemPo;

import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface DictItemService {

    /**
     * 查找
     *
     * @return
     */
    DictItemPo findOne(Long id);

    DictItemPo findByUuid(String uuid);
    /**
     * 查找
     *
     * @return
     */
    List<DictItemPo> findAll();
    /**
     * 查找
     *
     * @return
     */
    List<DictItemPo> findByDictId(Long dictId);
    /**
     * 新增/更新
     *
     * @param dictItemPo
     * @return
     */
    DictItemPo save(DictItemPo dictItemPo);
    /**
     * 删除
     *
     * @param id
     */
    void delete(Long id);

    DictItemPo findByDictCodeAndItemValue(String dictCode,String itemValue);
}
