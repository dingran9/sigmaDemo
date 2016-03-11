package com.sigma.dao;

import java.util.List;

import com.sigma.po.ExperimentalResultPo;

import org.springframework.data.repository.CrudRepository;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface ExperimentalResultDao  extends CrudRepository<ExperimentalResultPo, Long> {

    ExperimentalResultPo findByUuid(String uuid);

    List<ExperimentalResultPo> findByDiseaseId(Long diseaseId);
}
