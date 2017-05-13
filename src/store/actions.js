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
  }
}
