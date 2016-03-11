package com.sigma.proxy;

import javax.inject.Inject;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.sigma.dao.DictDao;
import com.sigma.dao.DictItemDao;
import com.sigma.po.DictItemPo;
import com.sigma.po.DictPo;
import com.sigma.util.StringHelper;
@Service
public class ProxyDictItem {
	private static Logger logger=Logger.getLogger(ProxyDictItem.class);
	@Inject
	private DictDao dictDao;
	@Inject
	private DictItemDao dictItemDao;
	
	public ProxyDictItem(){
		
	}
	/**
	 * 根据字典Code以及字典值获取所属字典项
	 * @param dictCode
	 * @param value
	 * @return
	 */
	public DictItemPo getDictItem(String dictCode,String value){
		if (StringHelper.isEmpty(dictCode)||StringHelper.isEmpty(value)) {
			return null;
		}
		DictPo currDict=getDictByCode(dictCode);
		return currDict==null?null:getItemByCodeAndValue(currDict.getId(),value);
	}
	/**
	 * 根据code获取Dict
	 * @param dictCode
	 * @return
	 */
	public DictPo getDictByCode(String dictCode){
		return dictDao.findByCode(dictCode);
	}
	/**
	 * 根据dictCode以及ItemValue获取DictItem
	 * @param dictId
	 * @param value
	 * @return
	 */
	public DictItemPo getItemByCodeAndValue(Long dictId,String value){
		return dictItemDao.findByDictIdAndItemValue(dictId, value);
	}
}
