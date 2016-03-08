package com.sigma.node.impl;

import com.sigma.comm.Constants;
import com.sigma.node.NodeBuilder;
import com.sigma.po.DictItemPo;
import com.sigma.po.ExperimentalResultPo;
import com.sigma.po.NodePo;
import com.sigma.proxy.ProxyDictItem;
import com.sigma.util.ConfigUtil;
/**
 * 干预物节点Builder
 * @author Administrator
 *
 */
public class InterventionNodeBuilder implements NodeBuilder{
	//节点Po
	private NodePo nodePo;
	private ExperimentalResultPo experimentalResultPo;
	
	public InterventionNodeBuilder(){}
	
	public InterventionNodeBuilder(ExperimentalResultPo experimentalResult){
		this.experimentalResultPo=experimentalResult;
	}

	@Override
	public void buildLabel() {
		DictItemPo invenDict = ProxyDictItem.getDictItem(Constants.NODE_TYPE_INTERVENTION, experimentalResultPo.getIntervention());
		nodePo.setLabel(invenDict.getName());
	}

	@Override
	public void buildColor() {
		DictItemPo invenDict = ProxyDictItem.getDictItem("nodeColor", Constants.NODE_TYPE_INTERVENTION);
		if (invenDict==null) {
			System.out.println("--------节点颜色设置错误：InterventionNodeBuilder--------");
			return ;
		}
		nodePo.setColor(invenDict.getValue());
	}

	@Override
	public void buildPositionX() {
		// TODO Auto-generated method stub
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
		DictItemPo invenDict = ProxyDictItem.getDictItem("nodeSize", Constants.NODE_TYPE_INTERVENTION);
		if (invenDict==null) {
			System.out.println("--------节点Size设置错误：InterventionNodeBuilder--------");
			return ;
		}
		nodePo.setColor(invenDict.getValue());
	}

	@Override
	public NodePo buildNodePo() {
		return nodePo;
	}

	public ExperimentalResultPo getExperimentalResultPo() {
		return experimentalResultPo;
	}

	public void setExperimentalResultPo(ExperimentalResultPo experimentalResultPo) {
		this.experimentalResultPo = experimentalResultPo;
	}

}
