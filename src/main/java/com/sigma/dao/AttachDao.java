package com.sigma.dao;

import java.util.List;

import com.sigma.po.AttachPo;
import com.sigma.po.DictPo;

import org.springframework.data.repository.CrudRepository;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface AttachDao  extends CrudRepository<AttachPo, Long> {
	/**
	 * 根据关联对象Id查找附件
	 * @param objId
	 * @return
	 */
    List<AttachPo> findByObjId(String objId);
    /**
     * 根据UUid唯一值查找附件
     * @param uuid
     * @return
     */
    AttachPo findByUuid(String uuid);
}
