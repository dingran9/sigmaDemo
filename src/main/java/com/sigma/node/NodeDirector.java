package com.sigma.node;

import com.sigma.po.NodePo;

public class NodeDirector {
	public NodePo constructNode(NodeBuilder nodeBuilder){
		nodeBuilder.buildColor();
		nodeBuilder.buildPositionX();
		nodeBuilder.buildPositionY();
		nodeBuilder.buildLabel();
		nodeBuilder.buildShapeId();
		nodeBuilder.buildSize();
		return nodeBuilder.buildNodePo();
	}
}
