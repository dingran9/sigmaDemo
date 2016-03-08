package com.sigma.service;

import com.sigma.po.ExperimentalResultPo;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface ExperimentalResultService {
    /**
     * 查找
     *
     * @return
     */
    ExperimentalResultPo findOne(Long id);

    ExperimentalResultPo findByUuid(String uuid);
    /**
     * 查找
     *
     * @return
     */
    List<ExperimentalResultPo> findAll();

    /**
     * 新增/更新
     *
     * @param experimentalResultPo
     * @return
     */
    ExperimentalResultPo save(ExperimentalResultPo experimentalResultPo);
    /**
     * 删除
     *
     * @param id
     */
    void delete(Long id);
    /**
     * 根据疾病Id查询实验结果记录
     * @return
     */
    List<ExperimentalResultPo> findByDiseaseId(String diseaseId);
    
    /**
     * 将实验结果转换成图形节点、图形节点关系
     * @param experimentalResultPo
     * @return
     */
    Map<String,List> convertToNodes(ExperimentalResultPo experimentalResultPo);
}
