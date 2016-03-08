package com.sigma.service;

import com.sigma.po.DocumentPo;

import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface DocumentService {
    /**
     * 查找
     *
     * @return
     */
    DocumentPo findOne(Long id);

    DocumentPo findByUuid(String uuid);
    /**
     * 查找
     *
     * @return
     */
    List<DocumentPo> findAll();

    /**
     * 新增/更新
     *
     * @param documentPo
     * @return
     */
    DocumentPo save(DocumentPo documentPo);
    /**
     * 删除
     *
     * @param id
     */
    void delete(Long id);
}
