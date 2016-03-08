package com.sigma.service;

import java.util.List;

import com.sigma.po.AttachPo;

public interface AttachService {
	/**
     * 查找
     *
     * @return
     */
    AttachPo findOne(Long id);
    /**
     * 根据uuid查询
     * @param uuid
     * @return
     */
    AttachPo findByUuid(String uuid);
    /**
     * 根据关联对象id查询附件
     * @param objId
     * @return
     */
    List<AttachPo> findByObjId(String objId);
    /**
     * 查找
     *
     * @return
     */
    List<AttachPo> findAll();
    /**
     * 新增/更新
     *
     * @param AttachPo
     * @return
     */
    AttachPo save(AttachPo AttachPo);
    /**
     * 删除
     *
     * @param id
     */
    void delete(Long id);
}
