package com.sigma.proxy;

import static org.junit.Assert.*;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.sigma.po.DictItemPo;
import com.sigma.proxy.ProxyDictItem;
@ContextConfiguration(locations={"classpath:/conf/spring-comm-conf.xml","classpath:/conf/spring-comm-dao.xml"})
@RunWith(SpringJUnit4ClassRunner.class)
public class ProxyDictItemTest {

	@Test
	public void testGetItemByCodeAndValue() {
		DictItemPo dict=ProxyDictItem.getDictItem("intervention", "0");
		System.out.println(dict==null);
	}

}
