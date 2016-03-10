package com.sigma.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.collections4.map.HashedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.sigma.dao.DictItemDao;
import com.sigma.dao.ExperimentalResultDao;
import com.sigma.node.NodeDirector;
import com.sigma.node.impl.DiseaseNodeBuilder;
import com.sigma.node.impl.InterventionNodeBuilder;
import com.sigma.node.impl.MicroorganismNodeBuilder;
import com.sigma.node.impl.PhysiologicalProcessChangeNodeBuilder;
import com.sigma.node.impl.PhysiologicalProcessNodeBuilder;
import com.sigma.po.EdgePo;
import com.sigma.po.EdgePo.ArrowType;
import com.sigma.po.EdgePo.EdgeType;
import com.sigma.po.ExperimentalResultPo;
import com.sigma.po.NodePo;
import com.sigma.service.ExperimentalResultService;

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
		Map<String, NodePo> nodeList=new HashedMap<String,NodePo>();
		//节点关系List
		List<EdgePo> edgeList=new ArrayList<EdgePo>();
		switch (experimentalResultPo.getType()) {
			case 0:
				/*
				 *实验结果类型1
				 *	包含节点：疾病 干预物 ("干预物对疾病的作用" 暂时定位节点关系) 
				 */
				//疾病
				NodePo diseaseNode=new NodeDirector().constructNode(new DiseaseNodeBuilder(experimentalResultPo));
				nodeList.put("diseaseNode",diseaseNode);
				//干预物
				NodePo intervenNode=new NodeDirector().constructNode(new InterventionNodeBuilder(experimentalResultPo));
				nodeList.put("interventionNode",intervenNode);
				//节点关系
				EdgePo edgePo=new EdgePo();
				edgePo.setSource(intervenNode);
				edgePo.setTarget(diseaseNode);
				edgePo.setEdgeType(EdgeType.Curve);
				break;
			case 1:
				/*
				 * 实验结果类型2
				 * 	疾病 干预物	微生物  （菌种变化、 干预物对疾病的作用  定位节点关系）
				 */
				//疾病
				nodeList.put("diseaseNode",new NodeDirector().constructNode(new DiseaseNodeBuilder(experimentalResultPo)));
				//干预物
				nodeList.put("interventionNode",new NodeDirector().constructNode(new InterventionNodeBuilder(experimentalResultPo)));
				//微生物
				nodeList.put("microorganism",new NodeDirector().constructNode(new MicroorganismNodeBuilder(experimentalResultPo)));
				break;
			case 2:
				/*
				 * 实验结果类型3:
				 * 	疾病 干预物 生理过程  （生理过程变化  干预物对疾病的作用	）	
				 */
				//疾病
				nodeList.put("diseaseNode",new NodeDirector().constructNode(new DiseaseNodeBuilder(experimentalResultPo)));
				//干预物
				nodeList.put("interventionNode",new NodeDirector().constructNode(new InterventionNodeBuilder(experimentalResultPo)));
				//生理过程
				nodeList.put("physiological_process",new NodeDirector().constructNode(new PhysiologicalProcessNodeBuilder(experimentalResultPo)));
				break;
			case 3:
				/*
				 * 实验结果类型4：
				 * 	疾病 微生物  （菌种变化  节点关系）		
				 */
				//疾病
				nodeList.put("diseaseNode",new NodeDirector().constructNode(new DiseaseNodeBuilder(experimentalResultPo)));
				//微生物
				nodeList.put("microorganism",new NodeDirector().constructNode(new MicroorganismNodeBuilder(experimentalResultPo)));
				break;
			case 4:
				/*
				 * 实验结果类型5：
				 * 	  疾病 生理过程  生理过程变化
				 */
				//疾病
				nodeList.put("diseaseNode",new NodeDirector().constructNode(new DiseaseNodeBuilder(experimentalResultPo)));
				//生理过程
				nodeList.put("physiological_process",new NodeDirector().constructNode(new PhysiologicalProcessNodeBuilder(experimentalResultPo)));
				break;
			case 5:
				/*
				 * 实验结果类型6：
				 * 疾病和生理过程、微生物的关系				
				 */
				//疾病
				nodeList.put("diseaseNode",new NodeDirector().constructNode(new DiseaseNodeBuilder(experimentalResultPo)));
				//生理过程
				nodeList.put("physiological_process",new NodeDirector().constructNode(new PhysiologicalProcessNodeBuilder(experimentalResultPo)));
				//微生物
				nodeList.put("microorganism",new NodeDirector().constructNode(new MicroorganismNodeBuilder(experimentalResultPo)));
				break;
			case 6:
				/*
				 * 实验结果7：
				 * 	干预物>>微生物>>生理过程>>疾病
				 */
				//疾病
				nodeList.put("diseaseNode",new NodeDirector().constructNode(new DiseaseNodeBuilder(experimentalResultPo)));
				//生理过程
				nodeList.put("physiological_process",new NodeDirector().constructNode(new PhysiologicalProcessNodeBuilder(experimentalResultPo)));
				//微生物
				nodeList.put("microorganism",new NodeDirector().constructNode(new MicroorganismNodeBuilder(experimentalResultPo)));
				//干预物
				nodeList.put("interventionNode",new NodeDirector().constructNode(new InterventionNodeBuilder(experimentalResultPo)));
				break;
			default:
				break;
		}
		return shapeEle;
	}
	/**
	 * 设置即关系
	 * @param sourcNode 起始节点
	 * @param targetNode 终止节点
	 * @param type 
	 * 	1:干预物_疾病
	 * 	2:干预物_微生物
	 * 	3:干预物_生理过程
	 * 	4:微生物_疾病
	 * 	5：生理过程_疾病
	 * 	6：微生物_生理过程
	 * @param experimentalResultPo
	 * @return
	 */
	private EdgePo buildEdge(NodePo sourceNode,NodePo targetNode,int type,ExperimentalResultPo experimentalResultPo){
		EdgePo edgePo=new EdgePo();
		/*
		 * 设置起始节点、终止节点
		 */
		edgePo.setSource(sourceNode);
		edgePo.setTarget(targetNode);
		//设置图形Id
		edgePo.setShapeId(experimentalResultPo.getDiseaseId());
		//默认统一设置为曲线
		edgePo.setEdgeType(EdgeType.Curve);
		/*
		 * 根据节点类型设置相关属性
		 */
		switch (type) {
			case 1:
				/*
				 * 1:干预物_疾病
				 * 	疾病 干预物	微生物  （菌种变化、 干预物对疾病的作用  定位节点关系）
				 */
				break;
			case 2:
				/*
				 * 2:干预物_微生物
				 */
				break;
			case 3:
				/*
				 * 3:干预物_生理过程
				 */
				break;
			case 4:
				/*
				 * 4:微生物_疾病
				 */
				break;
			case 5:
				/*
				 * 5：生理过程_疾病
				 */
				break;
			case 6:
				/*
				 * 6：微生物_生理过程
				 */
				break;
			default:
				break;
		}
		return edgePo;
	}
}
