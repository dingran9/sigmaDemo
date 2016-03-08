package com.sigma.util;


import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;


/**
 * Copyright：CNIaas Technology (Beijing) CO.,LTD
 * Author: DingRan
 * Date: 2014/11/19
 * Description:
 */
@Component
public class InitService {
    private static final Logger logger = LoggerFactory.getLogger(InitService.class);
    @Inject
    private DataSource dataSource;

    @PostConstruct
    @Transactional
    public void init() {
        try {
            logger.info("begin init portal!");

        } catch (Exception e) {
            logger.error("portal init error!", e);
        }
    }
    @Test
    public void test() {
        try {
            init();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}
