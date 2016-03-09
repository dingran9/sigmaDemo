package com.sigma.po;

import org.hibernate.annotations.ForeignKey;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;

/**
 * Created by Administrator on 2015/11/14.
 */

@Entity
@Table(name = "g_edge")
public class EdgePo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * 图形id
     */
    @Column(name = "shape_id",nullable = false)
    private Long shapeId;
    /**
     * 起始节点
     */
    @ManyToOne
    @JoinColumn(name = "source_node_id", referencedColumnName = "id", nullable = false)
    @ForeignKey(name = "none")
    @NotFound(action = NotFoundAction.IGNORE)
    private NodePo source;
    /**
     * 终点节点
     */
    @ManyToOne
    @JoinColumn(name = "target_node_id", referencedColumnName = "id", nullable = false)
    @ForeignKey(name = "none")
    @NotFound(action = NotFoundAction.IGNORE)
    private NodePo target;
    /**
     * 
     */
    @Column(nullable = false)
    private Type type;
    /**
     * 节点关系指向类型：单向指向终止节点、双向指向节点
     */
    @Column(nullable = false)
    private ArrowType arrowType;
    /**
     * 节点之间的线条类型：曲线、直线
     */
    @Column(name="edge_type")
    private ArrowType edgeType;
    /**
     * 节点直接的线条：线条粗细
     */
    @Column(name="edge_size")
    private ArrowType edgeSize;

    /**
     * 状态 0：待支付 1：已支付 2：已取消  3: 已使用
     */
    public enum Type {
        Curve(0),
        Line(1);

        private final int value;

        public int getValue() {
            return value;
        }

        Type(int value) {
            this.value = value;
        }
    }

    /**
     *
     */
    public enum ArrowType {
        Target(0),
        Source(1),
        Both(2),
        None(3);

        private final int value;

        public int getValue() {
            return value;
        }

        ArrowType(int value) {
            this.value = value;
        }
    }

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

    public NodePo getSource() {
        return source;
    }

    public void setSource(NodePo source) {
        this.source = source;
    }

    public NodePo getTarget() {
        return target;
    }

    public void setTarget(NodePo target) {
        this.target = target;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public ArrowType getArrowType() {
        return arrowType;
    }

    public void setArrowType(ArrowType arrowType) {
        this.arrowType = arrowType;
    }

	public ArrowType getEdgeType() {
		return edgeType;
	}

	public void setEdgeType(ArrowType edgeType) {
		this.edgeType = edgeType;
	}

	public ArrowType getEdgeSize() {
		return edgeSize;
	}

	public void setEdgeSize(ArrowType edgeSize) {
		this.edgeSize = edgeSize;
	}
}
