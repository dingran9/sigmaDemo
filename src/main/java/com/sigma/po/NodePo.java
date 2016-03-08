package com.sigma.po;

import javax.persistence.*;

/**
 * Created by Administrator on 2015/11/14.
 */

@Entity
@Table(name = "g_node")
public class NodePo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "shape_id",nullable = false)
    private Long shapeId;
    private String label;
    @Column(name = "position_x",nullable = false)
    private Integer positionX;
    @Column(name = "position_y",nullable = false)
    private Integer positionY;
    @Column(nullable = false)
    private Integer size;
    @Column(nullable = false)
    private String color;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getShapeId() {
        return shapeId;
    }

    public void setShapeId(Long shapeId) {
        this.shapeId = shapeId;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Integer getPositionX() {
        return positionX;
    }

    public void setPositionX(Integer positionX) {
        this.positionX = positionX;
    }

    public Integer getPositionY() {
        return positionY;
    }

    public void setPositionY(Integer positionY) {
        this.positionY = positionY;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
