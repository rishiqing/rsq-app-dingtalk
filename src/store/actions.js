import { Promise } from 'es6-promise';
import api from 'api/index';
import domUtil from 'ut/domUtil';
import util from 'ut/jsUtil';
import dateUtil from 'ut/dateUtil';
import Vue from 'vue';
import moment from 'moment';

export default {
  requestCount ({ commit, state, getters }, p) {
    setTimeout(() => {
      commit('increment', p + ' walalce')
    }, 1000)
  },
  setNav ({ commit }, isShow){
    commit('SYS_SET_SHOW_NAV', isShow);
  },
  /**
   * 登录方法
   * @param dispatch
   * @param state
   * @param username
   * @param password
   */
  login ({ commit }, p) {
    return api.system.login(p)
      .then((user) => {
        commit('SYS_DO_LOGIN', user);
      },(err) => {
        rsqadmg.log(JSON.stringify(err));
      });
  },
/**
 * 登出方法
 * @param dispatch
 * @param state
 */
  logout ({ commit }) {
    return api.system.logout()
      .then((result) => {
        rsqadmg.log('logout res:' + JSON.stringify(result));
        commit('SYS_DO_LOGOUT');
      })
      .catch((err) => {
        rsqadmg.log(JSON.stringify(err));
      });
  },

  /**
   * 根据date日期获取当天的日程，如果date为空，则获取今天的日程，流程如下：
   * 1  查找dateItems中是否有以date为key值的items，如果有，则直接读取
   * 2  如果dateItems中没有，则调用api从服务器上读取
   * @param dispatch
   * @param state
   * @param date
   */
  fetchScheduleItems ({ commit, state }, strDate) {
    if(strDate instanceof Date){
      strDate = moment(strDate).format('YYYY-MM-DD');
    }
    let strCurrentDate = strDate || moment().format('YYYY-MM-DD');
    let dateItems = state.schedule.dateItems;
    console.log('dateItems[strCurrentDate]:' + strCurrentDate);
    if(dateItems[strCurrentDate]){
      return Promise.resolve().then(()=>{
        commit('SCHEDULE_TODO_READY', {strCurrentDate: strCurrentDate, items: dateItems[strCurrentDate]});
      });
    }else{
      return api.todo.getScheduleTodos({startDate: strCurrentDate, endDate: strCurrentDate})
        .then((todos) => {
          let reverseTodo = todos.reverse();
          commit('SCHEDULE_TODO_READY', {strCurrentDate: strCurrentDate, items: reverseTodo});
          commit('SCHEDULE_TODO_CACHE', {strCurrentDate: strCurrentDate, items: reverseTodo});
        });
    }
  }
}
