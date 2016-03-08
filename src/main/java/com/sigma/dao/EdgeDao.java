package com.sigma.dao;

import com.sigma.po.EdgePo;
import com.sigma.po.NodePo;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by Administrator on 2015/11/14.
 */
public interface EdgeDao  extends CrudRepository<EdgePo, Long> {

    List<EdgePo> findByShapeId(Long id);
}
