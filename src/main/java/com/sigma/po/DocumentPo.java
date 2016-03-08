package com.sigma.po;

import com.sigma.util.UIDGenerator;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Administrator on 2015/12/20.
 */
@Entity
@Table(name = "g_document")
public class DocumentPo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String uuid = UIDGenerator.getUUID();
    private String name;
    @Column(name = "first_author")
    private String firstAuthor;
    @Column(name = "correspondent_author")
    private String correspondentAuthor;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "publish_date")
    private Date publishDate;
    @Column(name = "entry_type")
    private String entryType;
    @Column(name = "impact_factors")
    private String impactFactors;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFirstAuthor() {
        return firstAuthor;
    }

    public void setFirstAuthor(String firstAuthor) {
        this.firstAuthor = firstAuthor;
    }

    public String getCorrespondentAuthor() {
        return correspondentAuthor;
    }

    public void setCorrespondentAuthor(String correspondentAuthor) {
        this.correspondentAuthor = correspondentAuthor;
    }

    public Date getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(Date publishDate) {
        this.publishDate = publishDate;
    }

    public String getEntryType() {
        return entryType;
    }

    public void setEntryType(String entryType) {
        this.entryType = entryType;
    }

    public String getImpactFactors() {
        return impactFactors;
    }

    public void setImpactFactors(String impactFactors) {
        this.impactFactors = impactFactors;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
}
