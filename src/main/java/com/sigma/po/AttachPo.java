package com.sigma.po;


import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="g_attach")
public class AttachPo {
	/**
	 * 主键
	 */
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	/**
	 * 附件所属对象uuid
	 */
	@Column(name="obj_id")
	private String objId;
	/**
	 * 所属对象分类
	 */
	@Column(name="obj_type")
	private int objType;
	/**
	 * 上传附件名称
	 */
	@Column(name="file_name")
	private String attachName;
	/**
	 * 附件存储路径
	 */
	@Column(name="attach_path")
	private String attachPath;
	/**
	 * 附件后缀
	 */
	@Column(name="extension")
	private String extension;
	/**
	 * 操作时间
	 */
	@Column(name="issue_date")
	private Date issueDate;
	/**
	 * ServerId
	 */
	@Column(name="serverId")
	private String serverId;
	/**
	 * 唯一标识
	 */
	@Column(name="uuid")
	private String uuid;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getObjId() {
		return objId;
	}
	public void setObjId(String objId) {
		this.objId = objId;
	}
	public int getObjType() {
		return objType;
	}
	public void setObjType(int objType) {
		this.objType = objType;
	}
	public String getAttachName() {
		return attachName;
	}
	public void setAttachName(String attachName) {
		this.attachName = attachName;
	}
	public String getAttachPath() {
		return attachPath;
	}
	public void setAttachPath(String attachPath) {
		this.attachPath = attachPath;
	}
	public String getExtension() {
		return extension;
	}
	public void setExtension(String extension) {
		this.extension = extension;
	}
	public Date getIssueDate() {
		return issueDate;
	}
	public void setIssueDate(Date issueDate) {
		this.issueDate = issueDate;
	}
	public String getServerId() {
		return serverId;
	}
	public void setServerId(String serverId) {
		this.serverId = serverId;
	}
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
}
