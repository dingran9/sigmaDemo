package com.sigma;

import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Copyright：CNIaas Technology (Beijing) CO.,LTD
 * Author: DingRan
 * Date: 2015/4/5
 * Description:
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath*:conf/**/spring-*.xml" })
public class BaseTest {
}
