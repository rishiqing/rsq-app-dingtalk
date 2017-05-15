import { Promise } from 'es6-promise';
import Vue from 'vue';
import url from 'url';
import mapping from './urlMapping';
import util from 'ut/jsUtil';

export default {
	/**
	 * 获取当前登录人的计划列表
	 * @returns {*}
	 */
	getPlans(){
		return new Promise((resolve, reject) => {
			Vue.http.get(mapping.GET_PLANS)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	/**
	 * 新增计划
	 * @param props
	 * @returns {*}
	 */
	postNewPlan(props){
		return new Promise((resolve, reject) => {
			Vue.http.post(mapping.POST_NEW_PLAN, props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	/**
	 * 修改计划
	 * @param props
	 * @returns {*}
	 */
	putPlan(props){
		let path = util.replaceUrlParams(mapping.PUT_PLAN, props);

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
	 * 删除计划
	 * @param props
	 * @returns {*}
	 */
	deletePlan(props){
		let path = util.replaceUrlParams(mapping.DELETE_PLAN, props);

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
	 * 添加计划星标
	 * @param props
	 */
	putPlanStar(props){
		return new Promise((resolve, reject) => {
			Vue.http.put(mapping.PUT_PLAN_STAR, props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	/**
	 * 删除计划星标
	 * @param props
	 */
	deletePlanStar(props){
		let path = mapping.DELETE_PLAN_STAR + '?' + util.combineUrlParams(props);

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
	 * 获取计划详情
	 * @param props
	 * @returns {*}
	 */
	fetchPlanDetail(props){
		let path = util.replaceUrlParams(mapping.GET_PLAN_DETAIL, props);

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
	 * 新建计划卡片
	 * @param props
	 * @returns {*}
	 */
	postNewPlanCard(props){
		return new Promise((resolve, reject) => {
			Vue.http.post(mapping.POST_NEW_PLAN_CARD, props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	/**
	 * 修改计划卡片
	 * @param props
	 * @returns {*}
	 */
	putPlanCard(props){
		let path = util.replaceUrlParams(mapping.PUT_PLAN_CARD, props);

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
	 * 删除计划卡片
	 * @param props
	 * @returns {*}
	 */
	deletePlanCard(props){
		let path = util.replaceUrlParams(mapping.DELETE_PLAN_CARD, props);

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
	 * 获取计划任务详情
	 * @param props
	 * @returns {*}
	 */
	getPlanTodo(props){
		var path = util.replaceUrlParams(mapping.GET_PLAN_TODO, props);
		return new Promise((resolve, reject) => {
			Vue.http.get(path)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				});
		});
	},
	/**
	 * 新增计划任务
	 * @param props
	 * @returns {*}
	 */
	postNewPlanTodo(props){
		return new Promise((resolve, reject) => {
			Vue.http.post(mapping.POST_NEW_PLAN_TODO, props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	/**
	 * 更新计划任务
	 * @param props
	 * @returns {*}
	 */
	putPlanTodo(props){
		let path = util.replaceUrlParams(mapping.PUT_PLAN_TODO, props);

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
	 * 删除计划任务
	 * @param props
	 * @returns {*}
	 */
	deletePlanTodo(props){
		let path = util.replaceUrlParams(mapping.DELETE_PLAN_TODO, props);

		return new Promise((resolve, reject) => {
			Vue.http.delete(path, props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	/**
	 * 提交计划任务评论
	 * @param props
	 * @returns {*}
	 */
	postComment(props){
		return new Promise((resolve, reject) => {
			Vue.http.post(mapping.POST_PLAN_TODO_COMMENT, props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				});
		});
	},
	/**
	 * 移动计划任务
	 * 只能使用www-form的格式，后台需要做修改！
	 * @param props
	 * @returns {*}
	 */
	postPlanTodoMove(props){
		var formData = util.combineUrlParams(props);
		return new Promise((resolve, reject) => {
			Vue.http.post(mapping.POST_PLAN_TODO_MOVE, formData, {
				headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
			})
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				});
		});
	}
}
