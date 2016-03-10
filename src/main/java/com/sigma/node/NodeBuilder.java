package com.sigma.node;

import com.sigma.po.NodePo;

public interface NodeBuilder {
	public void buildUuid();
	public void buildLabel();
	public void buildColor();
	public void buildPositionX();
	public void buildPositionY();
	public void buildShapeId();
	public void buildSize();
	
	public NodePo buildNodePo();
}
