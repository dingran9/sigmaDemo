package com.sigma.po;

import com.sigma.util.UIDGenerator;

import javax.persistence.*;

/**
 * Created by Administrator on 2015/12/20.
 * 疾病表
 */
@Entity
@Table(name = "g_disease")
public class DiseasePo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String uuid = UIDGenerator.getUUID();
    private String name;
    @Column(name = "parent_id")
    private Long parentId;
    private Integer level;
    private String category;
    private String pathogeny;

    @Transient
    private DiseaseAttachedPo diseaseAttachedPo;
    @Transient
    private DiseasePo parentDiseasePo;

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

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPathogeny() {
        return pathogeny;
    }

    public void setPathogeny(String pathogeny) {
        this.pathogeny = pathogeny;
    }

    public DiseaseAttachedPo getDiseaseAttachedPo() {
        return diseaseAttachedPo;
    }

    public void setDiseaseAttachedPo(DiseaseAttachedPo diseaseAttachedPo) {
        this.diseaseAttachedPo = diseaseAttachedPo;
    }

    public DiseasePo getParentDiseasePo() {
        return parentDiseasePo;
    }

    public void setParentDiseasePo(DiseasePo parentDiseasePo) {
        this.parentDiseasePo = parentDiseasePo;
    }
}
