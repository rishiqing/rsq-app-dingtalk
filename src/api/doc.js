import { Promise } from 'es6-promise';
import Vue from 'vue';
import url from 'url';
import mapping from './urlMapping';
import util from 'ut/jsUtil';

export default {
	/**
	 * 获取文集列表
	 * @returns {*}
	 */
	getDocs(){
		return new Promise((resolve, reject) => {
			Vue.http.get(mapping.GET_DOC_SET_LIST)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	/**
	 * 新增文集
	 * @param props
	 * @returns {*}
	 */
	postNewDocSet(props){
		return new Promise((resolve, reject) => {
			Vue.http.post(mapping.POST_NEW_DOC_SET, props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},

	/**
	 * 获取文集详情（权限信息）
	 * @param props
	 * @returns {*}
	 */
	fetchDocSetDetail(props){
		let path = util.replaceUrlParams(mapping.GET_DOC_SET_DETAIL, props);

		return new Promise((resolve, reject) => {
			Vue.http.get(path)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	/**
	 * 获取指定docSet中默认的docNoteList
	 * @param props
	 */
	fetchDocNoteList(props){
		let path = mapping.GET_DOC_NOTE_LIST + '?' + util.combineUrlParams(props);

		return new Promise((resolve, reject) => {
			Vue.http.get(path)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	putDocSet(props){
		let path = util.replaceUrlParams(mapping.PUT_DOC_SET, props);

		return new Promise((resolve, reject) => {
			Vue.http.put(path, props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	deleteDocSet(props){
		let path = util.replaceUrlParams(mapping.DELETE_DOC_SET, props);

		return new Promise((resolve, reject) => {
			Vue.http.delete(path)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	/**
	 * 新增笔记
	 * @param props
	 * @returns {*}
	 */
	postNewDocNote(props){
		return new Promise((resolve, reject) => {
			Vue.http.post(mapping.POST_DOC_NOTE, props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	/**
	 * 更新笔记
	 * @param props
	 * @returns {*}
	 */
	putDocNote(props){
		let path = util.replaceUrlParams(mapping.PUT_DOC_NOTE, props);

		return new Promise((resolve, reject) => {
			Vue.http.put(path, props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	/**
	 * 删除笔记
	 * @param props
	 * @returns {*}
	 */
	deleteDocNote(props){
		let path = util.replaceUrlParams(mapping.DELETE_DOC_NOTE, props);

		return new Promise((resolve, reject) => {
			Vue.http.delete(path)
				.then(() => {
					resolve();
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	}
}
