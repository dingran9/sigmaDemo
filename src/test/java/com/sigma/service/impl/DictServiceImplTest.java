package com.sigma.service.impl;

import javax.inject.Inject;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.sigma.po.DictPo;
import com.sigma.service.DictService;
@RunWith(SpringJUnit4ClassRunner.class)  
@ContextConfiguration(locations={"classpath:/conf/spring-comm-conf.xml","classpath:/conf/spring-comm-dao.xml"})
public class DictServiceImplTest {
	@Inject
	private DictService dictService;

	@Test
	public void testFindOne() {
		DictPo dictPo=dictService.findOne(10L);
		System.out.println(dictPo.getName());
	}

}
