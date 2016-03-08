package com.sigma.service.impl;

import com.sigma.dao.DictItemDao;
import com.sigma.dao.ExperimentalResultDao;
import com.sigma.po.DictItemPo;
import com.sigma.po.EdgePo;
import com.sigma.po.ExperimentalResultPo;
import com.sigma.po.NodePo;
import com.sigma.proxy.ProxyDictItem;
import com.sigma.service.ExperimentalResultService;
import com.sigma.util.ConfigUtil;

import org.apache.commons.collections4.map.HashedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Created by Administrator on 2015/12/20.
 */
@Service
public class ExperimentalResultServiceImpl implements ExperimentalResultService {
    private final Logger logger = LoggerFactory.getLogger(ExperimentalResultServiceImpl.class);

    @Inject
    private ExperimentalResultDao experimentalResultDao;
    
    @Inject 
    private DictItemDao dictItemDao;

    @Override
    public ExperimentalResultPo findOne(Long id) {
        return experimentalResultDao.findOne(id);
    }

    @Override
    public ExperimentalResultPo findByUuid(String uuid) {
        return experimentalResultDao.findByUuid(uuid);
    }

    @Override
    public List<ExperimentalResultPo> findAll() {
        return (List<ExperimentalResultPo>) experimentalResultDao.findAll();
    }

    @Override
    public ExperimentalResultPo save(ExperimentalResultPo experimentalResultPo) {
        return experimentalResultDao.save(experimentalResultPo);
    }

    @Override
    public void delete(Long id) {
        experimentalResultDao.delete(id);
    }

	@Override
	public List<ExperimentalResultPo> findByDiseaseId(String diseaseId) {
		return experimentalResultDao.findByDiseaseId(diseaseId);
	}

	/**
	 * 将实验结果转化成节点以及节点关系图
	 * 	1、新建map对象存储节点以及节点关系
	 * 	2、将实验记录转化成节点list
	 * 	3、将实验记录转化成节点关系list
	 * 	4、将节点list以及关系list存入步骤1中的map中，并返回
	 */
	@Override
	public Map<String, List> convertToNodes(
			ExperimentalResultPo experimentalResultPo) {
		Map<String, List> shapeEle=new HashedMap<String, List>();
		//节点List
		List<NodePo> nodeList=new ArrayList<NodePo>();
		//生成干预物节点
		nodeList.add(buildNode("intervention", experimentalResultPo.getIntervention(), experimentalResultPo.getDiseaseId()));
		//生成微生物节点
		nodeList.add(buildNode("microorganism", experimentalResultPo.getIntervention(), experimentalResultPo.getDiseaseId()));
		shapeEle.put("nodes", nodeList);
		
		//节点关系List
		List<EdgePo> edgeList=new ArrayList<EdgePo>();
		
		return shapeEle;
	}
	
	private NodePo buildNode(String itemName, String itemValue, Long shapeId) {
		NodePo nodePo = new NodePo();
		DictItemPo invenDict = ProxyDictItem.getDictItem(itemName, itemValue);
		nodePo.setLabel(invenDict.getName());
		nodePo.setColor(ConfigUtil.getString(itemName + "Color"));
		nodePo.setPositionX((int) (Math.random() * 10));
		nodePo.setPositionY((int) (Math.random() * 10));
		nodePo.setShapeId(shapeId);
		nodePo.setSize(Integer.parseInt(ConfigUtil.getString(itemName + "Size")
				.trim()));
		return nodePo;
	}
}
