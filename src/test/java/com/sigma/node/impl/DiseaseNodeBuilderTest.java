package com.sigma.node.impl;

import javax.inject.Inject;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.sigma.node.NodeBuilder;
import com.sigma.node.NodeDirector;
import com.sigma.po.ExperimentalResultPo;
import com.sigma.po.NodePo;

@RunWith(SpringJUnit4ClassRunner.class)  
@ContextConfiguration(locations={"classpath:/conf/spring-comm-conf.xml","classpath:/conf/spring-comm-dao.xml"})
public class DiseaseNodeBuilderTest {

	@Inject
	private DiseaseNodeBuilder diseaseNodeBuilder;
	@Test
	public void testBuildLabel() {
//		ExperimentalResultPo exp=new ExperimentalResultPo();
//		exp.setDiseaseId(10L);
//		NodeBuilder disNode=new DiseaseNodeBuilder(exp);
		NodePo nodePo=new NodeDirector().constructNode(diseaseNodeBuilder);
		System.out.println(nodePo.getLabel());
	}

}
