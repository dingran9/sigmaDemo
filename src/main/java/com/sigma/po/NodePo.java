package com.sigma.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

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
    /**
     * 节点显示名称
     */
    private String label;
    /**
     * 节点坐标：X\Y
     */
    @Column(name = "position_x",nullable = false)
    private Integer positionX;
    @Column(name = "position_y",nullable = false)
    private Integer positionY;
    /**
     * 节点大小
     */
    @Column(nullable = false)
    private Integer size;
    /**
     * 节点颜色或图形
     */
    @Column(nullable = false)
    private String color;
    /**
     * 唯一标识符，用来保存节点前生成节点关系使用的id
     */
    @Column(name="uuid",length=36)
    private String uuid;

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

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	@Override
	public boolean equals(Object obj){
		if (obj instanceof NodePo) {
			NodePo beComparedNode=(NodePo)obj;
			if (this.label.equals(beComparedNode.getLabel())) {
				return true;
			}
		}
		return false;
	}
}
