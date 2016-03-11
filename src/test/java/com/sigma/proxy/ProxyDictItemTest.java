package com.sigma.proxy;

import static org.junit.Assert.*;

import javax.inject.Inject;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.sigma.BaseTest;
import com.sigma.po.DictItemPo;
import com.sigma.proxy.ProxyDictItem;
public class ProxyDictItemTest extends BaseTest{
	@Inject
	private ProxyDictItem ProxyDictItem;

	@Test
	public void testGetItemByCodeAndValue() {
		DictItemPo dict=ProxyDictItem.getDictItem("intervention", "0");
		System.out.println(dict==null);
	}

}
