package com.sigma.node.impl;

import com.sigma.comm.Constants;
import com.sigma.node.NodeBuilder;
import com.sigma.po.DictItemPo;
import com.sigma.po.ExperimentalResultPo;
import com.sigma.po.NodePo;
import com.sigma.proxy.ProxyDictItem;
/**
 * 微生物节点Builder
 * @author Administrator
 *
 */
public class MicroorganismNodeBuilder implements NodeBuilder {
	//节点Po
	private NodePo nodePo;
	private ExperimentalResultPo experimentalResultPo;
	
	public MicroorganismNodeBuilder(){}
	
	public MicroorganismNodeBuilder(ExperimentalResultPo experimentalResult){
		this.experimentalResultPo=experimentalResult;
	}

	@Override
	public void buildLabel() {
		DictItemPo invenDict = ProxyDictItem.getDictItem(Constants.NODE_TYPE_MICROORGANISM, experimentalResultPo.getMicroorganism());
		nodePo.setLabel(invenDict.getName());
	}

	@Override
	public void buildColor() {
		DictItemPo invenDict = ProxyDictItem.getDictItem("nodeColor", Constants.NODE_TYPE_MICROORGANISM);
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
