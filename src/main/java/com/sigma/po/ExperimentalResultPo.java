package com.sigma.po;

import com.sigma.util.UIDGenerator;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Administrator on 2015/12/20.
 */
@Entity
@Table(name = "g_experimental_result")
public class ExperimentalResultPo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String uuid = UIDGenerator.getUUID();
    /**
     * 实验结果类型
     */
    private Integer type;
    /**
     * 疾病ID
     */
    @Column(name = "disease_id")
    private Long diseaseId;
    /**
     * 干预物
     */
    @Column(name="intervention")
    private String intervention;
    /**
     * 干预物注释
     */
    @Column(name="intervention_note")
    private String interventionNote;
    /**
     * 干预物对疾病影响
     */
    @Column(name = "intervention_effect")
    private String interventionEffect;
    /**
     * 微生物
     */
    @Column(name="microorganism")
    private String microorganism;
    /**
     * 菌种变化
     */
    @Column(name = "strain_variation")
    private String strainVariation;
    /**
     * 生理过程
     */
    @Column(name = "physiological_process")
    private String physiologicalProcess;
    /**
     * 生理过程变化
     */
    @Column(name = "physiological_process_change")
    private String physiologicalProcessChange;
    /**
     * 实验类型
     */
    @Column(name = "experiment_type")
    private Integer experimentType;
    /**
     * 宿主名称
     */
    @Column(name = "host_name")
    private String hostName;
    /**
     * 动物模型/人群特征
     */
    @Column(name = "animal_model")
    private String animalModel;
    /**
     * 引发源
     */
    @Column(name = "source_element")
    private String sourceElement;
    /**
     * 文献Id
     */
    @Column(name = "document_id")
    private String documentId;
    /**
     * 创建时间
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_date", updatable = false)
    private Date createDate= new Date();

    @Transient
    private DiseasePo diseasePo;

    public enum Type {
        Linear(0),//阶梯价
        Nonlinear(1);//单一价

        private final int value;

        public int getValue() {
            return value;
        }

        Type(int value) {
            this.value = value;
        }
    }

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

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Long getDiseaseId() {
        return diseaseId;
    }

    public void setDiseaseId(Long diseaseId) {
        this.diseaseId = diseaseId;
    }

    public String getIntervention() {
        return intervention;
    }

    public void setIntervention(String intervention) {
        this.intervention = intervention;
    }

    public String getInterventionEffect() {
        return interventionEffect;
    }

    public void setInterventionEffect(String interventionEffect) {
        this.interventionEffect = interventionEffect;
    }

    public String getMicroorganism() {
        return microorganism;
    }

    public void setMicroorganism(String microorganism) {
        this.microorganism = microorganism;
    }

    public String getStrainVariation() {
        return strainVariation;
    }

    public void setStrainVariation(String strainVariation) {
        this.strainVariation = strainVariation;
    }

    public String getPhysiologicalProcess() {
        return physiologicalProcess;
    }

    public void setPhysiologicalProcess(String physiologicalProcess) {
        this.physiologicalProcess = physiologicalProcess;
    }

    public String getPhysiologicalProcessChange() {
        return physiologicalProcessChange;
    }

    public void setPhysiologicalProcessChange(String physiologicalProcessChange) {
        this.physiologicalProcessChange = physiologicalProcessChange;
    }

    public Integer getExperimentType() {
        return experimentType;
    }

    public void setExperimentType(Integer experimentType) {
        this.experimentType = experimentType;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getAnimalModel() {
        return animalModel;
    }

    public void setAnimalModel(String animalModel) {
        this.animalModel = animalModel;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public DiseasePo getDiseasePo() {
        return diseasePo;
    }

    public void setDiseasePo(DiseasePo diseasePo) {
        this.diseasePo = diseasePo;
    }

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getSourceElement() {
        return sourceElement;
    }

    public void setSourceElement(String sourceElement) {
        this.sourceElement = sourceElement;
    }

    public String getInterventionNote() {
		return interventionNote;
	}

	public void setInterventionNote(String interventionNote) {
		this.interventionNote = interventionNote;
	}
}
