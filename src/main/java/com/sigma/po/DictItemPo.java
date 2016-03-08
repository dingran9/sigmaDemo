package com.sigma.po;

import com.sigma.util.UIDGenerator;
import org.hibernate.annotations.ForeignKey;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Administrator on 2015/12/20.
 */
@Entity
@Table(name = "g_dict_item")
public class DictItemPo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String uuid = UIDGenerator.getUUID();
    @ManyToOne
    @JoinColumn(name = "dict_id", referencedColumnName = "id")
    @ForeignKey(name = "none")
    @NotFound(action= NotFoundAction.IGNORE)
    private DictPo dictPo;
    private String name;
    @Column(name = "dict_item_value")
    private String value;
    @Column(name = "valid_mark")
    private Integer validMark;
    private String remark;
    @Column(name = "item_order")
    private Integer itemOrder;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_date", updatable = false)
    private Date createDate= new Date();


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public DictPo getDictPo() {
        return dictPo;
    }

    public void setDictPo(DictPo dictPo) {
        this.dictPo = dictPo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Integer getValidMark() {
        return validMark;
    }

    public void setValidMark(Integer validMark) {
        this.validMark = validMark;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Integer getItemOrder() {
        return itemOrder;
    }

    public void setItemOrder(Integer itemOrder) {
        this.itemOrder = itemOrder;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
}
