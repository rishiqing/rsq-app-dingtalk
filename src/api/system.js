import { Promise } from 'es6-promise';
import Vue from 'vue';
import url from 'url';
import mapping from './urlMapping';

function transformFormData(obj){
	var str = [];
	for(var p in obj)
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	return str.join("&");
}
export default {
	checkAuth(){
		return new Promise((resolve, reject) => {
			Vue.http.post(mapping.CHECK_AUTH)
				.then((res) => {
					resolve(res.json());
				}, (res) => {
					rsqadmg.log('login error:' + JSON.stringify(res));
					reject(res);
				});
		});
	},
	login({username, password}){

		return new Promise((resolve, reject) => {
			var obj = {
				j_username: username, j_password: password, _spring_security_remember_me: true
			};
			Vue.http.post(mapping.POST_LOGIN, obj, {
        emulateJSON: true,
				headers: {
				  // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        }
			})
				.then((res) => {
					resolve(res.json());
				}, (res) => {
					rsqadmg.log('login error:' + JSON.stringify(res));
					reject(res);
				});
		});
	},
	logout(){
		return new Promise((resolve, reject) => {
			Vue.http.get(mapping.GET_LOGOUT)
				.then((res) => {
					rsqadmg.log('response.status:' + res.status);
					resolve(res);
				}, (res) => {
					rsqadmg.log('login error:' + JSON.stringify(res));
					reject(res);
				});
		});
	},
	fetchTodoTitleList(){
		return new Promise((resolve, reject) => {
			Vue.http.get(mapping.GET_TODO_TITLE)
				.then((res) => {
					resolve(res.json());
				}, (res) => {
					rsqadmg.log('login error:' + JSON.stringify(res));
					reject(res);
				});
		});
	},
	fetchStaffList(){
		return new Promise((resolve, reject) => {
			Vue.http.get(mapping.GET_STAFF_LIST)
				.then((res) => {
					resolve(res.json());
				}, (res) => {
					rsqadmg.log('login error:' + JSON.stringify(res));
					reject(res);
				});
		});
	}
}
