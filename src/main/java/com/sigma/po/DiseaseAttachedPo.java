package com.sigma.po;

import com.sigma.util.UIDGenerator;

import javax.persistence.*;

/**
 * Created by Administrator on 2015/12/20.
 */
@Entity
@Table(name = "g_disease_attached")
public class DiseaseAttachedPo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="disease_id",nullable = false)
    private Long diseaseId;
    @Column(name="disease_changes")
    private String change;
    @Column(name="microbial_changes")
    private String microbialChanges;
    @Column(name="related_family")
    private String relatedFamily;
    @Column(name="related_negative_family")
    private String relatedNegativeFamily;
    @Column(name="related_genus")
    private String relatedGenus;
    @Column(name="related_negative_genus")
    private String relatedNegativeGenus;
    @Column(name="pathogen_metabolites")
    private String pathogenMetabolites;
    @Column(name="physiological_process")
    private String physiologicalProcess;
    @Column(name="research_method")
    private String researchMethod;
    @Column(name="document_id")
    private Long documentId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDiseaseId() {
        return diseaseId;
    }

    public void setDiseaseId(Long diseaseId) {
        this.diseaseId = diseaseId;
    }

    public String getChange() {
        return change;
    }

    public void setChange(String change) {
        this.change = change;
    }

    public String getMicrobialChanges() {
        return microbialChanges;
    }

    public void setMicrobialChanges(String microbialChanges) {
        this.microbialChanges = microbialChanges;
    }

    public String getRelatedFamily() {
        return relatedFamily;
    }

    public void setRelatedFamily(String relatedFamily) {
        this.relatedFamily = relatedFamily;
    }

    public String getRelatedNegativeFamily() {
        return relatedNegativeFamily;
    }

    public void setRelatedNegativeFamily(String relatedNegativeFamily) {
        this.relatedNegativeFamily = relatedNegativeFamily;
    }

    public String getRelatedGenus() {
        return relatedGenus;
    }

    public void setRelatedGenus(String relatedGenus) {
        this.relatedGenus = relatedGenus;
    }

    public String getRelatedNegativeGenus() {
        return relatedNegativeGenus;
    }

    public void setRelatedNegativeGenus(String relatedNegativeGenus) {
        this.relatedNegativeGenus = relatedNegativeGenus;
    }

    public String getPathogenMetabolites() {
        return pathogenMetabolites;
    }

    public void setPathogenMetabolites(String pathogenMetabolites) {
        this.pathogenMetabolites = pathogenMetabolites;
    }

    public String getPhysiologicalProcess() {
        return physiologicalProcess;
    }

    public void setPhysiologicalProcess(String physiologicalProcess) {
        this.physiologicalProcess = physiologicalProcess;
    }

    public String getResearchMethod() {
        return researchMethod;
    }

    public void setResearchMethod(String researchMethod) {
        this.researchMethod = researchMethod;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }
}
