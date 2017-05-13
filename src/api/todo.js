import { Promise } from 'es6-promise';
import Vue from 'vue';
import url from 'url';
import mapping from './urlMapping';
import util from 'ut/jsUtil';

export default {
	/**
	 * 获取收纳箱中的任务
	 * @returns {*}
	 */
	getInboxTodos(){
		return new Promise((resolve, reject) => {
			Vue.http.get(url.resolve(RSQ_BACK_SERVER_ADDR, mapping.GET_INBOX_TODOS))
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	/**
	 * 获取指定日程中的任务
	 * @returns {*}
	 */
	getScheduleTodos(params){
		params.isGetDelay = true;
		let path = mapping.GET_SCHEDULE_TODOS + '?' + util.combineUrlParams(params);
		return new Promise((resolve, reject) => {
			Vue.http.get(url.resolve(RSQ_BACK_SERVER_ADDR, path))
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				});
		});
	},
	getTodo(params){
		var path = util.replaceUrlParams(mapping.GET_TODO, params);
		return new Promise((resolve, reject) => {
			Vue.http.get(url.resolve(RSQ_BACK_SERVER_ADDR, path))
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				});
		});
	},
	postNewTodo(props){
		return new Promise((resolve, reject) => {
			Vue.http.post(url.resolve(RSQ_BACK_SERVER_ADDR, mapping.POST_NEW_TODO), props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	putTodoProps(props){
		var path = util.replaceUrlParams(mapping.PUT_TODO_PROP, props);

		return new Promise((resolve, reject) => {
			Vue.http.put(url.resolve(RSQ_BACK_SERVER_ADDR, path), props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	deleteTodo(props){
		var path = util.replaceUrlParams(mapping.DELETE_TODO, props);

		return new Promise((resolve, reject) => {
			Vue.http.delete(url.resolve(RSQ_BACK_SERVER_ADDR, path))
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	postComment(props){
		return new Promise((resolve, reject) => {
			Vue.http.post(url.resolve(RSQ_BACK_SERVER_ADDR, mapping.POST_TODO_COMMENT), props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	}
}
