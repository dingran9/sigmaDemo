package com.sigma.node.impl;

import javax.inject.Inject;

import com.sigma.comm.Constants;
import com.sigma.node.NodeBuilder;
import com.sigma.po.DictItemPo;
import com.sigma.po.ExperimentalResultPo;
import com.sigma.po.NodePo;
import com.sigma.proxy.ProxyDictItem;
import com.sigma.util.UIDGenerator;
/**
 * 生理过程节点Builder
 * @author Administrator
 *
 */
public class PhysiologicalProcessChangeNodeBuilder implements NodeBuilder {
	private NodePo nodePo=new NodePo();
	private ExperimentalResultPo experimentalResultPo;
	@Inject
	private ProxyDictItem proxyDictItem;
	
	public PhysiologicalProcessChangeNodeBuilder (){
	}
	
	public PhysiologicalProcessChangeNodeBuilder(ExperimentalResultPo experimentalResultPo){
		this.experimentalResultPo=experimentalResultPo;
	}

	@Override
	public void buildLabel() {
		DictItemPo invenDict = proxyDictItem.getDictItem(Constants.NODE_TYPE_PHYSIOLOGICALPROCESS, experimentalResultPo.getPhysiologicalProcess());
		if (invenDict==null) {
			System.out.println("--------节点label设置错误：PhysiologicalProcessNodeBuilder--------");
			return ;
		}
		nodePo.setLabel(invenDict.getValue());
	}

	@Override
	public void buildColor() {
		DictItemPo invenDict = proxyDictItem.getDictItem("nodeColor", Constants.NODE_TYPE_MICROORGANISM);
		if (invenDict==null) {
			System.out.println("--------节点颜色设置错误：PhysiologicalProcessNodeBuilder--------");
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
		DictItemPo invenDict = proxyDictItem.getDictItem("nodeSize", Constants.NODE_TYPE_MICROORGANISM);
		if (invenDict==null) {
			System.out.println("-----------节点Size设置出错：PhysiologicalProcessNodeBuilder--------------");
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
