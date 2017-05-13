import { Promise } from 'es6-promise';
import Vue from 'vue';
import url from 'url';
import mapping from './urlMapping';
import util from 'ut/jsUtil';

export default {
	getKanbans(){
		return new Promise((resolve, reject) => {
			Vue.http.get(url.resolve(RSQ_BACK_SERVER_ADDR, mapping.GET_KANBANS))
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	postNewKanban(props){
		return new Promise((resolve, reject) => {
			Vue.http.post(url.resolve(RSQ_BACK_SERVER_ADDR, mapping.POST_NEW_KANBAN), props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	putKanban(props){
		let path = util.replaceUrlParams(mapping.PUT_KANBAN, props);

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
	deleteKanban(props){
		let path = util.replaceUrlParams(mapping.DELETE_KANBAN, props);

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
	fetchKanbanDetail(props){
		let path = util.replaceUrlParams(mapping.GET_KANBAN_DETAIL, props);

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
	postNewKanbanCard(props){
		return new Promise((resolve, reject) => {
			Vue.http.post(url.resolve(RSQ_BACK_SERVER_ADDR, mapping.POST_NEW_KANBAN_CARD), props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	putKanbanCard(props){
		let path = util.replaceUrlParams(mapping.PUT_KANBAN_CARD, props);

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
	deleteKanbanCard(props){
		let path = util.replaceUrlParams(mapping.DELETE_KANBAN_CARD, props);

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
	getKanbanTodo(props){
		var path = util.replaceUrlParams(mapping.GET_KANBAN_TODO, props);
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
	postNewKanbanTodo(props){
		return new Promise((resolve, reject) => {
			Vue.http.post(url.resolve(RSQ_BACK_SERVER_ADDR, mapping.POST_NEW_KANBAN_TODO), props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	},
	putKanbanTodo(props){
		let path = util.replaceUrlParams(mapping.PUT_KANBAN_TODO, props);

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
	deleteKanbanTodo(props){
		let path = util.replaceUrlParams(mapping.DELETE_KANBAN_TODO, props);

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
	postComment(props){
		return new Promise((resolve, reject) => {
			Vue.http.post(mapping.POST_KBTODO_COMMENT, props)
				.then(res => {
					resolve(res.json());
				}, err => {
					rsqadmg.log(JSON.stringify(err));
					reject(err);
				})
		});
	}
}
