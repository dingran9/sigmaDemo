package com.sigma.node.impl;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.sigma.BaseTest;
import com.sigma.po.ExperimentalResultPo;
import com.sigma.po.NodePo;
import com.sigma.service.DiseaseService;
import com.sigma.service.ExperimentalResultService;
import com.sigma.service.NodeService;

public class DiseaseNodeBuilderTest extends BaseTest{
    private final Logger logger = LoggerFactory.getLogger(DiseaseNodeBuilderTest.class);

//	@Inject
//	private DiseaseNodeBuilder diseaseNodeBuilder;

    private Gson gson=new Gson();
    @Inject
    private NodeService nodeService;
    @Inject
    private DiseaseService diseaseService;
    @Inject
    private ExperimentalResultService experimentalResultService;

	@Test
	public void testBuildLabel() {
	/*	ExperimentalResultPo exp=new ExperimentalResultPo();
		exp.setDiseaseId(10L);
		NodeBuilder disNode=new DiseaseNodeBuilder(exp);
		NodePo nodePo=new NodeDirector().constructNode(disNode);
		System.out.println(nodePo.getLabel());*/
        NodePo dNodePo= nodeService.create(diseaseService.findOne(10l));
        ExperimentalResultPo exp= experimentalResultService.findOne(4l);
        Map<String, List> date= experimentalResultService.convertToNodes(exp, dNodePo);
        logger.debug(gson.toJson(date));

    }

}
