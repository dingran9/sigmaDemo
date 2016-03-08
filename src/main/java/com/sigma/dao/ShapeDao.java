package com.sigma.dao;

import com.sigma.po.ShapePo;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Administrator on 2015/11/14.
 */
public interface ShapeDao  extends CrudRepository<ShapePo, Long> {
}
