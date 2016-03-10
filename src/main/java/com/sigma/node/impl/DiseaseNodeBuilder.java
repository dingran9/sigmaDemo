package com.sigma.node.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.sigma.comm.Constants;
import com.sigma.node.NodeBuilder;
import com.sigma.po.DictItemPo;
import com.sigma.po.DiseasePo;
import com.sigma.po.ExperimentalResultPo;
import com.sigma.po.NodePo;
import com.sigma.proxy.ProxyDictItem;
import com.sigma.service.DiseaseService;
import com.sigma.util.UIDGenerator;
/**
 * 疾病节点Builder
 * @author Administrator
 *
 */
@Service
public class DiseaseNodeBuilder implements NodeBuilder{
	private NodePo nodePo=new NodePo();
	private ExperimentalResultPo experimentalResultPo;
	
	@Inject
	private DiseaseService diseaseService;
	
	public DiseaseNodeBuilder (){
	}
	
	public DiseaseNodeBuilder(ExperimentalResultPo experimentalResultPo){
		this.experimentalResultPo=experimentalResultPo;
	}

	@Override
	public void buildLabel() {
		DiseasePo diseasePo=diseaseService.findOne(experimentalResultPo.getDiseaseId());
		nodePo.setLabel(diseasePo.getName());
	}

	@Override
	public void buildColor() {
		DictItemPo invenDict = ProxyDictItem.getDictItem("nodeColor", Constants.NODE_TYPE_MICROORGANISM);
		if (invenDict==null) {
			System.out.println("--------节点颜色设置错误：DiseaseNodeBuilder--------");
			return ;
		}
		nodePo.setColor(invenDict.getValue());
	}

	@Override
	public void buildPositionX() {
		nodePo.setPositionX((int) (Math.random() * 10));
	}

	@Override
	public void buildPositionY() {
		nodePo.setPositionY((int) (Math.random() * 10));
	}

	@Override
	public void buildShapeId() {
		nodePo.setShapeId(experimentalResultPo.getDiseaseId());
	}

	@Override
	public void buildSize() {
		DictItemPo invenDict = ProxyDictItem.getDictItem("nodeSize", Constants.NODE_TYPE_MICROORGANISM);
		if (invenDict==null) {
			System.out.println("-----------节点Size设置出错：DiseaseNodeBuilder--------------");
			return ;
		}
		nodePo.setColor(invenDict.getValue());
	}

	@Override
	public NodePo buildNodePo() {
		return nodePo;
	}
	
	/**
	 * 设置唯一标识符UUid
	 */
	@Override
	public void buildUuid() {
		nodePo.setUuid(UIDGenerator.getUUID());
	}

}
