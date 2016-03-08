package com.sigma.po;

import com.sigma.util.UIDGenerator;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */


@Entity
@Table(name = "g_dict")
public class DictPo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String uuid = UIDGenerator.getUUID();
    @Column(name = "dict_code")
    private String code;
    private String name;
    @Column(name = "valid_mark")
    private Integer validMark;
    private String remark;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_date", updatable = false)
    private Date createDate= new Date();

    @Transient
    private List<DictItemPo> dictItemPos;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Integer getValidMark() {
        return validMark;
    }

    public void setValidMark(Integer validMark) {
        this.validMark = validMark;
    }

    public List<DictItemPo> getDictItemPos() {
        return dictItemPos;
    }

    public void setDictItemPos(List<DictItemPo> dictItemPos) {
        this.dictItemPos = dictItemPos;
    }
}
