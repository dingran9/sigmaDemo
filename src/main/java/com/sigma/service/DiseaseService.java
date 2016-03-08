package com.sigma.service;

import com.sigma.po.DiseaseAttachedPo;
import com.sigma.po.DiseasePo;

import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface DiseaseService {
    /**
     * 查找
     *
     * @return
     */
    DiseasePo findOne(Long id);
    /**
     * 查找
     *
     * @return
     */
    DiseasePo findByUuid(String uuid);
    /**
     * 查找
     *
     * @return
     */
    List<DiseasePo> findAll();

    /**
     * 新增/更新
     *
     * @param diseasePo
     * @return
     */
    DiseasePo save(DiseasePo diseasePo);
    /**
     * 新增/更新
     *
     * @param diseasePo
     * @return
     */
    DiseasePo save(DiseasePo diseasePo,DiseaseAttachedPo diseaseAttachedPo);
    /**
     * 新增/更新
     *
     * @param diseasePo
     * @return
     */
    DiseasePo update(DiseasePo diseasePo,DiseaseAttachedPo diseaseAttachedPo);
    /**
     * 删除
     *
     * @param id
     */
    void delete(Long id);
}
