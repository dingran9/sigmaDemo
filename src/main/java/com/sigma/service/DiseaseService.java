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
     * 查找
     *
     * @return
     */
    List<DiseasePo> findByParents();
    /**
     * 查找
     *
     * @return
     */
    List<DiseasePo> findChildren();
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
     * 根据疾病名称查询疾病
     * @param diseaseName
     * @return
     */
    DiseasePo findByName(String diseaseName);
    /**
     * 根据疾病名称进行模糊查询
     * @param diseaseName
     * @return
     */
    List<DiseasePo> findByKeyWord(String keyWord);
    /**
     * 删除
     *
     * @param id
     */
    void delete(Long id);
}
