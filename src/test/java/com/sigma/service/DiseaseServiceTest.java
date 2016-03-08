package com.sigma.service;

import static org.junit.Assert.*;

import javax.inject.Inject;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.sigma.po.DiseasePo;
@RunWith(SpringJUnit4ClassRunner.class)  
@ContextConfiguration(locations={"classpath:/conf/spring-comm-conf.xml","classpath:/conf/spring-comm-dao.xml"})
public class DiseaseServiceTest {
	@Inject
	private DiseaseService diseaseService;

	@Test
	public void testFindOne() {
		DiseasePo diseasePo=diseaseService.findOne(10L);
		System.out.println(diseasePo.getName());
	}

}
