package com.sigma.dao;

import com.sigma.po.NodePo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by Administrator on 2015/11/14.
 */
public interface NodeDao  extends CrudRepository<NodePo, Long> {

    List<NodePo> findByShapeId(Long id);
}
