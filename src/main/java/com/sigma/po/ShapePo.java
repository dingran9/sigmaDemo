package com.sigma.po;

import javax.persistence.*;

/**
 * Created by Administrator on 2015/11/14.
 */
@Entity
@Table(name = "g_shape")
public class ShapePo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    public Long getId() {
    return id;
}

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
