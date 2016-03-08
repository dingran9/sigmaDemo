package com.sigma.service;

import com.sigma.po.DiseaseAttachedPo;

import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface DiseaseAttachedService {
    /**
     * 查找
     *
     * @return
     */
    DiseaseAttachedPo findOne(Long id);

    /**
     * 查找
     *
     * @return
     */
    DiseaseAttachedPo findByDiseaseId(Long id);
    /**
     * 查找
     *
     * @return
     */
    List<DiseaseAttachedPo> findAll();

    /**
     * 新增/更新
     *
     * @param diseaseAttached
     * @return
     */
    DiseaseAttachedPo save(DiseaseAttachedPo diseaseAttached);
    /**
     * 删除
     *
     * @param id
     */
    void delete(Long id);
    /**
     * 删除
     *
     * @param id
     */
    void deleteByDiseaseId(Long id);
}
