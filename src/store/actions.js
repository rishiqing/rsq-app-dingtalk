import { Promise } from 'es6-promise';
import api from 'api/index';
import domUtil from 'ut/domUtil';
import util from 'ut/jsUtil';
import dateUtil from 'ut/dateUtil';
import Vue from 'vue';
import moment from 'moment';

export default {
  // test to be deleted
  requestCount ({ commit, state, getters }, p) {
    setTimeout(() => {
      commit('increment', p + ' walalce')
    }, 1000)
  },
  /**
   * 设置是否显示底部导航栏
   * @param commit
   * @param isShow
   */
  setNav ({ commit }, isShow){
    commit('SYS_NAV_SHOW', {isShow: isShow});
  },
  /**
   * 登录方法
   * @param commit
   * @param state
   * @param username
   * @param password
   */
  login ({ commit }, p) {
    return api.system.login(p)
      .then((user) => {
        commit('SYS_USR_LOGIN', {user: user});
      },(err) => {
        rsqadmg.log(JSON.stringify(err));
      });
  },
/**
 * 登出方法
 * @param commit
 * @param state
 */
  logout ({ commit }) {
    return api.system.logout()
      .then((result) => {
        rsqadmg.log('logout res:' + JSON.stringify(result));
        commit('SYS_USR_LOGOUT');
      })
      .catch((err) => {
        rsqadmg.log(JSON.stringify(err));
      });
  },

  // -----------------inbox actions start-------------------------
  /**
   * 获取inbox页面的所有items列表，并设置到相应state中
   * @param commit
   * @param state
   */
  fetchInboxItems ({ commit, state }) {
    let items = state.inbox.items;
    if( items == null){
      return api.todo.getInboxTodos()
        .then((todos) => {
          commit('INB_TODO_READY', {items: todos.reverse()});
        });
    }else{
      return Promise.resolve().then(()=>{
        commit('INB_TODO_READY', {items: items});
      });
    }
  },
  /**
   * 创建收纳箱任务逻辑，检查state.inbox.items，如果不为null，则需要插入到state.inbox.items中
   * 典型场景：在日程页面创建了一条日期为空的任务，会自动放到收纳箱中
   * @param commit
   * @param state
   */
  createInboxItem ({ commit, state }, props){
    var inbox = state.inbox;
    var mu = 'INB_TODO_CREATED';

    props['pContainer'] = 'inbox';
    var promise;
    //  如果inbox.items不存在，则从服务器先获取到inbox，然后获取inbox中任务的顺序，然后再保存
    if(!inbox.items){
      promise = fetchInboxItems({ commit, state });
    }else{
      promise = Promise.resolve();
    }
    return promise.then(function(){
      props['pDisplayOrder'] = util.getNextOrder(inbox.items, 'pDisplayOrder');
      return api.todo.postNewTodo(props)
        .then((item) => {
          commit(mu, {item: item});
        });
    }).catch(function(err){
      alert('error:' + JSON.stringify(err));
    });
  },
  // -----------------inbox actions end-------------------------

  // -----------------schedule actions start-------------------------
  /**
   * 根据date日期获取当天的日程，如果date为空，则获取今天的日程，流程如下：
   * 1  查找dateItems中是否有以date为key值的items，如果有，则直接读取
   * 2  如果dateItems中没有，则调用api从服务器上读取
   * @param commit
   * @param state
   * @param date
   */
  fetchScheduleItems ({ commit, state }, strDate) {
    if(strDate instanceof Date){
      strDate = moment(strDate).format('YYYY-MM-DD');
    }
    let strCurrentDate = strDate || moment().format('YYYY-MM-DD');
    let dateItems = state.schedule.dateItems;
    if(dateItems[strCurrentDate]){
      return Promise.resolve().then(()=>{
        commit('SCH_TODO_READY', {strCurrentDate: strCurrentDate, items: dateItems[strCurrentDate]});
      });
    }else{
      return api.todo.getScheduleTodos({startDate: strCurrentDate, endDate: strCurrentDate})
        .then((todos) => {
          let reverseTodo = todos.reverse();
          commit('SCH_TODO_READY', {strCurrentDate: strCurrentDate, items: reverseTodo});
          commit('SCH_TODO_CACHED', {strCurrentDate: strCurrentDate, items: reverseTodo});
        });
    }
  },
  /**
   * 提交新建的todo item
   * @param commit
   * @param state
   * @returns {*|Promise|Function|any|Promise.<TResult>}
   */
  submitCreateTodoItem ({ dispatch }, p) {
    // var str = '', todoList = '', mu = '';
    var props = p.props, todoType = p.todoType;
    if(todoType == 'schedule'){
      return dispatch('createScheduleItem', props);
    }else{
      return dispatch('createInboxItem', props);
    }
    // props['pContainer'] = str;
    // props['displayOrder'] = util.getNextOrder(todoList, 'pDisplayOrder');
    //
    // return api.todo.postNewTodo(props)
    // 	.then((item) => {
    // 		commit(mu, item);
    // 	});
  },
  /**
   * 创建日程任务的处理逻辑：
   * 1 单日：
   * @param commit
   * @param state
   * @param props
   * @returns {*}
   */
  createScheduleItem ({ commit, state }, props){
    //  暂时这么处理----日程任务默认为重要不紧急，后面加上选择优先级功能之后再修改
    props['pContainer'] = 'IU';

    var result = dateUtil.backend2frontend(props.dates, props.startDate, props.endDate);

    switch(result.dateType){
      case 'single':
        return createSingleScheduleItem({commit, state}, props, result);
      case 'discrete':
        return createDiscreteScheduleItem({commit, state}, props, result);
      case 'range':
        return createRangeScheduleItem({commit, state}, props, result);
      default:
        break;
    }

    var sche = state.schedule;
    var mu = 'SCH_TODO_CREATED';

    props['displayOrder'] = util.getNextOrder(todoList, 'pDisplayOrder');

    return api.todo.postNewTodo(props)
      .then((item) => {
        commit(mu, {item: item});
      });
  },

  /**
   * 单日逻辑：
   * 1  如果选择的日期中的任务列表存在于缓存中，那么从缓存中读取displayOrder
   * 2  如果未在缓存中，则先从服务器读取
   * 3  执行新增日程任务操作
   * @param commit
   * @param state
   * @param props
   * @param dateStruct
   */
  createSingleScheduleItem ({ commit, state }, props, dateStruct){
    var sche = state.schedule;
    var scheDateStr = moment(dateStruct.dateResult[0]).format('YYYY-MM-DD');
    var itemCache = sche.dateItems;

    return fetchScheduleItems({ commit, state }, scheDateStr)
      .then(function(){
        props['pDisplayOrder'] = util.getNextOrder(itemCache[scheDateStr], 'pDisplayOrder');
        return api.todo.postNewTodo(props)
          .then((item) => {
            commit('SCH_TODO_CREATED', {item: item, list: itemCache[scheDateStr]});
          });
      }).catch(function(err){
        alert('error:' + JSON.stringify(err));
      });
  },
  /**
   * 多日逻辑：
   * 暂时读取第一天的顺序，然后保存，然后让缓存失效
   * @param commit
   * @param state
   * @param props
   * @param dateStruct
   */
  createDiscreteScheduleItem ({ commit, state}, props, dateStruct){
    var sche = state.schedule;
    var scheDateStr = moment(dateStruct.dateResult[0]).format('YYYY-MM-DD');
    var itemCache = sche.dateItems;

    return fetchScheduleItems({ commit, state }, scheDateStr)
      .then(function(){
        props['pDisplayOrder'] = util.getNextOrder(itemCache[scheDateStr], 'pDisplayOrder');
        return api.todo.postNewTodo(props)
          .then((item) => {
            dateStruct.dateResult.forEach(function(valDate){
              return commit('SCH_TODO_CACHE_DELETE', {strCurrentDate: moment(valDate).format('YYYY-MM-DD')});
            });
          });
      }).catch(function(err){
        alert('error:' + JSON.stringify(err));
      });
  },
  /**
   * 范围逻辑：
   * 暂时读取第一天的顺序，然后保存，然后让缓存失效
   * @param commit
   * @param state
   * @param props
   * @param dateStruct
   * @returns {*}
   */
  createRangeScheduleItem ({ commit, state}, props, dateStruct){
    var sche = state.schedule;
    var scheDateStr = moment(dateStruct.dateResult[0]).format('YYYY-MM-DD');
    var itemCache = sche.dateItems;

    return fetchScheduleItems({ commit, state }, scheDateStr)
      .then(function(){
        props['pDisplayOrder'] = util.getNextOrder(itemCache[scheDateStr], 'pDisplayOrder');
        return api.todo.postNewTodo(props)
          .then((item) => {
            var i = dateStruct.dateResult[0];
            for(; i <= dateStruct.dateResult[1]; i = i + 24*3600*1000){
              commit('SCH_TODO_CACHE_DELETE', {strCurrentDate: moment(i).format('YYYY-MM-DD')});
            }
          });
      }).catch(function(err){
        alert('error:' + JSON.stringify(err));
      });
  },
  // -----------------schedule actions end-------------------------

  /* ----------------todo收纳箱和日程公共的数据------------------ */
  /**
   * 更新item参数的完成状态，如果item不存在，则更新当前选中的item的完成状态
   * @param commit
   * @param state
   * @param item
   */
  submitTodoFinish ({ commit, state}, item, status){
    return api.todo.putTodoProps({id: item.id, pIsDone: status})
      .then(() => {
        commit('SCH_LIST_TODO_CHECKED', {item: item, status: status});
      });
  },
  /**
   * 设置inbox页面当前处于选中状态的item，该item将会被现实在edit子页面中
   * 不采用promise的方式返回值
   * @param commit
   * @param item
   */
  setCurrentTodo ({ commit }, item) {
    commit('TD_CURRENT_TODO_SET', {item: item});
  },

  /**
   * 首先检查schedule的items中是否已经获取到todo的详细信息，如果没有获取过，则请求服务器获取
   * 当获取到item的详细信息时，item会添加cDetail标记，表示已经获取过，下次将不会再获取细节信息
   * @param commit
   * @param props
   * @returns {Promise.<TResult>|*|Promise|Function|any}
   */
  getTodo ({ commit, state }){

    let todo = state.todo.currentTodo || {};
    let list = todo.pContainer == 'inbox' ? state.inbox.items : state.schedule.items;
    let orgTodo = util.findById(list, todo.id);
    if(!orgTodo.cDetail){
      return api.todo.getTodo(todo)
        .then((result) => {
          result.cDetail = true;
          commit('TD_TODO_GET', {todo: result});
        });
    }else{
      return Promise.resolve();
    }
  },
  /**
   * 提交当前选中的item的日期属性数据到服务器，以进行更改。
   * 更改了日期之后为避免显示脏数据，需要对缓存数据做一定处理。
   * 当前队列：用户当前所处的队列，如果是日程，则当天的任务数组就是当前队列；如果是收纳箱，则收纳箱任务数组就是当前队列
   * 当前队列群：用户的重复任务所在的队列群。例如当前任务设置了1、4、5日，则1、4、5日各自的任务数组组成目标队列群。当当前日期为null时，收纳箱任务数组组成的集合就是当前队列群
   * 目标队列群：设置了新的日期之后，任务所在的所有队列组成的集合。例如，如果设置了日期为1、4、5日，则1、4、5日各自的任务数组组成目标队列群。当设置为null时，收纳箱任务数组组成的集合就是目标队列群
   *
   * 规则：
   * 目标队列群中包含当前队列，则将目标队列群中除了当前队列的队列都做失效处理
   * 目标队列群中不包含当前队列，则在当前队列中移除todo，则将目标队列群中除了当前队列的队列都做失效处理
   * @param commit
   * @param state
   * @param props
   * @returns {*}
   */
  updateTodoDate ({ commit, state }, orgTodo, props){
    // alert(JSON.stringify(props));
    //  如果id存在，则ajax更新
    props['id'] = orgTodo.id;
    return api.todo.putTodoProps(props)
      .then((todo) => {

        //处理缓存数据
        var sourceDateStruct = dateUtil.backend2frontend(orgTodo.dates, orgTodo.startDate, orgTodo.endDate);
        var targetDateStruct = dateUtil.backend2frontend(props.dates, props.startDate, props.endDate);
        var curArrayIndex = orgTodo.pContainer == 'inbox' ? 0 : moment(state.schedule.strCurrentDate, 'YYYY-MM-DD').toDate().getTime();

        // alert('sourceDateStruct:' + JSON.stringify(sourceDateStruct));
        // alert('targetDateStruct:' + JSON.stringify(targetDateStruct));
        // alert('curArrayIndex' + curArrayIndex);
        // alert(dateUtil.isInDateStruct(curArrayIndex, targetDateStruct));

        if(!dateUtil.isInDateStruct(curArrayIndex, targetDateStruct)){
          commit('TD_TODO_DELETED', {item: orgTodo});
        }
        invalidateDateItems({ commit, state }, targetDateStruct, curArrayIndex);
        invalidateDateItems({ commit, state }, sourceDateStruct, curArrayIndex);

        commit('TD_TODO_UPDATED', {todo: todo});

      });
  },
  /**
   * 使dateStruct所标记的所有日期的缓存失效，其中排除exceptStrVal所表示的日期。
   * 其中dateStruct的dateType为null，表示收纳箱
   * dateStruct.dateType为null且exceptDateNum不为0，则清空收纳箱缓存
   * dateStruct.dateType为single或discrete，则循环dateStruct.dateResult，当dateResult元素不等于exceptDateNum时，清空相应日期的缓存，
   * dateStruct.dateType为range，则分别以dateStruct.dateResult[0]和dateStruct.dateResult[1]为起止日期，循环dateStruct.dateResult，当dateResult元素不等于exceptDateNum时，清空相应日期的缓存，
   * @param commit
   * @param state
   * @param dateStruct
   * @param exceptDateNum
   */
  invalidateDateItems ({ commit, state }, dateStruct, exceptDateNum){
    if(dateStruct.dateType == null && exceptDateNum != 0){
      state.inbox.items = null;
      return;
    }
    switch(dateStruct.dateType){
      case 'single':
      case 'discrete':
        dateStruct.dateResult.forEach(function(timeNum){
          // alert('timeNum:' + timeNum + ',exceptDateNum:' + exceptDateNum);
          if(timeNum != exceptDateNum){
            commit('SCH_TODO_CACHE_DELETE', {strCurrentDate: dateUtil.dateNum2Text(timeNum, '-')});
          }
        });
        break;
      case 'range':
        var i = dateStruct.dateResult[0];
        for(; i <= dateStruct.dateResult[1]; i = i + 24*3600*1000){
          commit('SCH_TODO_CACHE_DELETE', {strCurrentDate: dateUtil.dateNum2Text(i, '-')});
        }
        break;
      default:
        break;
    }

  },
  /**
   * 提交当前选中的item的属性数据到服务器，以进行更改
   * 如果更改的是日期，由于涉及到日程的移动，不能使用这个方法，而应当使用updateTodoDate
   * @param commit
   * @param state
   * @param todo
   * @param props
   * @returns {Function|any|*|Promise.<TResult>|Promise}
   */
  updateTodo ({ commit, state }, todo, props){
    //  如果id存在，则ajax更新
    props['id'] = todo.id;
    return api.todo.putTodoProps(props)
      .then((todo) => {
        commit('TD_TODO_UPDATED', {todo: todo});
      });
  },
  /**
   * 删除当前选中状态的item，删除后如果选择的日期不是单日，则还需要清理缓存数据，逻辑如下：
   * 1  将其他日期的缓存数据清除
   * @param commit
   * @param state
   * @returns {*|Promise|Function|any|Promise.<TResult>}
   */
  deleteTodo ({ commit, state }, todo) {
    //  如果id不存在，则批量保持currentItem中的属性
    return api.todo.deleteTodo(todo)
      .then((res) => {
        commit('TD_TODO_DELETED', {item: todo});

        //  清除缓存数据
        var sourceDateStruct = dateUtil.backend2frontend(todo.dates, todo.startDate, todo.endDate);
        var curArrayIndex = todo.pContainer == 'inbox' ? 0 : moment(state.schedule.strCurrentDate, 'YYYY-MM-DD').toDate().getTime();

        invalidateDateItems({ commit, state }, sourceDateStruct, curArrayIndex);
      });
  },
/* ---------------------------------- */

/* ----------------kanban------------------ */
  /**
   * 获取看板列表，并区分普通看板和星标看板
   * @param commit
   * @param state
   */
  fetchPlanList ({ commit, state }) {
    let commonPlans = state.plan.commonPlans,
      starPlans = state.plan.starPlans;

    if( commonPlans == null || starPlans == null){
      api.plan.getPlans()
        .then((list) => {
          commonPlans = list.filter((k) => {
            return !k.starMark;
          });
          starPlans = list.filter((k) => {
            return k.starMark;
          });
          commit('PLN_KB_READY', {commonPlans: commonPlans, starPlans: starPlans});
        })
        .catch((err) => {
          throw err;
        });
    }else{
      Vue.nextTick(() => {
        commit('PLN_KB_READY', {commonPlans: commonPlans, starPlans: starPlans});
      });
    }
  },
  /**
   * 新增或者更新看板，当currentKanban的id存在时为更新看板，否则为新增
   * @param commit
   * @param state
   */
  submitKanban ({ commit, state }, props){
    if(props.id){
      return submitUpdateKanban({ commit, state }, props);
    }else{
      return submitCreateKanban({ commit, state }, props);
    }
  },
  submitCreatePlanWithDefaultCard ({ commit, state}, props){
    return submitCreatePlan({commit, state}, props)
      .then((plan) => {
        return createPlanCard({commit, state}, {plan: plan, name: '默认卡片'});
      });
  },
  /**
   * 新增看板
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  submitCreatePlan ({ commit, state }, props){
    return api.plan.postNewPlan(props)
      .then((plan) => {
        commit('PLN_KB_CREATED', {item: plan});
        return plan;
      });
  },
  /**
   * 更新当前active状态的看板，即currentKanban
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  submitUpdatePlan ({ commit, state }, props){
    return api.plan.putPlan(props)
      .then((plan) => {
        commit('PLN_KB_UPDATED', {item: plan});
      });
  },
  /**
   * 删除看板
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  deletePlan ({ commit, state }){
    return api.plan.deletePlan(state.plan.currentPlan)
      .then((plan) => {
        commit('PLN_KB_DELETED');
      })
  },
  /**
   *
   * @param commit
   * @param state
   * @param props.plan  需要修改星标状态的plan
   * @returns {*}
   */
  togglePlanStar ({ commit, state }, props){
    var promise,
      isStar = !props.plan.starMark;
    if(isStar){
      promise = api.plan.putPlanStar({id: props.plan.id});
    }else{
      promise = api.plan.deletePlanStar({id: props.plan.id});
    }
    return promise.then(function(res){
      commit('PLN_KB_STAR_TOGGLE', {plan: props.plan, isStar: isStar});
    });
  },
  /**
   * 设置当前当前处于active状态的Plan
   * @param commit
   * @param item
   */
  setCurrentPlan ({ commit }, item) {
    commit('PLN_CURRENT_KB_SET', {item: item});
  },
/* ---------------------------------- */

/* ----------------kbtodo------------------ */
  /**
   * 1  如果state.kbTodo.currentKanban存在，则直接重用该kanban
   * 2  服务器上重新获取kanban
   * @param commit
   * @param state
   */
  fetchPlanDetail ({ commit, state }, props){

    var plan = props.plan || state.plan.currentPlan;
    if(plan && plan.kanbanCardList && plan.kanbanCardList.length > 0){
      return Promise.resolve().then(()=>{
        commit('PLN_KB_DETAIL_EXIST');
      });
    }else{
      return api.plan.fetchPlanDetail({id: plan.id})
        .then((planWithDetail) => {
          commit('PLN_KB_DETAIL_READY', {plan: plan, planWithDetail: planWithDetail});
        });
    }
  },
  /**
   * 新增看板卡片
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  createPlanCard ({ commit, state }, props){
    let currentPlan = props.plan;
    let cardList = currentPlan.kanbanCardList;

    return api.plan.postNewPlanCard(util.mergeObject(state.defaultValue.planCard, {
      name: props.name, kanban: currentPlan.id, displayOrder: util.getNextOrder(cardList, 'displayOrder')
    }))
      .then((kc) => {
        commit('PLN_KBCARD_CREATED', {plan: currentPlan, planCard: kc});
      });
  },
  /**
   * 根据props的id属性，更新相应看板卡片的状态
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  updatePlanCard ({ commit, state }, props){
    return api.plan.putPlanCard(props)
      .then((kc) => {
        commit('PLN_KBCARD_UPDATED', {item: props});
      });
  },
  /**
   * 根据props的id属性，更新相应看板卡片的状态
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  deletePlanCard ({ commit, state }, props){
    return api.plan.deletePlanCard(props)
      .then((kc) => {
        commit('PLN_KBCARD_DELETED', {item: props});
      })
  },
  /**
   * 新增看板任务
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  createPlanTodo ({ commit, state }, props){
    let cardList = state.plan.currentPlan.kanbanCardList;
    let card = util.findById(cardList, props.planCardId);
    props['kanbanCard'] = props.planCardId;
    props['displayOrder'] = util.getNextOrder(card.kanbanItemList, 'displayOrder');

    return api.plan.postNewPlanTodo(util.mergeObject(state.defaultValue.planTodo, props))
      .then((kt) => {
        commit('PLN_TODO_CREATED', {item: kt});
      });
  },
  /**
   * 设置看板任务页面当前处于选中状态的item，该item将会被现实在edit子页面中
   * @param commit
   * @param item
   */
  setCurrentPlanTodo ({ commit }, item) {
    commit('PLN_CURRENT_TODO_UPDATED', {item: item});
  },
  /**
   * 提交当前选中的item的属性数据到服务器，以进行更改
   * @param commit
   * @param state
   * @param props
   * @returns {*|Promise|Function|any|Promise.<TResult>}
   */
  updatePlanTodo ({ commit, state }, item, props){
    props['id'] = item.id;
    return api.plan.putPlanTodo(props)
      .then((planTodo) => {
        commit('PLN_TODO_UPDATED', {item: item, newItem: planTodo});
      });
  },
  /**
   * 删除当前选中状态的item
   * @param commit
   * @param state
   * @returns {*|Promise|Function|any|Promise.<TResult>}
   */
  deletePlanTodo ({ commit, state }) {
    let item = state.planTodo.currentTodo;
    return api.plan.deletePlanTodo(item)
      .then((res) => {
        commit('PLN_TODO_DELETED', {item: item});
      });
  },
  /**
   * 首先检查kanban的items中是否已经获取到todo的详细信息，如果没有获取过，则请求服务器获取
   * 当获取到item的详细信息时，item会添加cDetail标记，表示已经获取过，下次将不会再获取细节信息
   * @param commit
   * @param props
   * @returns {Promise.<TResult>|*|Promise|Function|any}
   */
  getPlanTodo ({ commit, state }){
    var planTodo = state.planTodo.currentTodo;
    if(!planTodo.cDetail){
      return api.plan.getPlanTodo({id: planTodo.id})
        .then((todo) => {
          planTodo.cDetail = true;
          commit('PLN_TODO_UPDATED', {newItem: todo});
        });
    }else{
      return Promise.resolve();
    }
  },

  postPlanTodoComment ({ commit, state }, props){
    if(props.commentContent){
      props['kanbanItemId'] = state.planTodo.currentTodo.id;
      props['type'] = 0;
      return api.plan.postComment(props)
        .then((com) => {
          commit('PLN_TODO_COMMENT_CREATED', {item: com});
        });
    }else{
      return Promise.resolve();
    }
  },
  postPlanTodoMove ({ commit, state }, props){
    var currentItem = state.planTodo.currentTodo;
    return api.plan.postPlanTodoMove({itemId: currentItem.id, cardId: props.targetCard.id})
      .then((todo) => {
        commit('PLN_TODO_MOVE', {item: todo, sourceCard: props.orgCard, targetCard: props.targetCard});
      });
  },
  /**
   * 提交todo的评论
   * @param commit
   * @param state
   * @param props
   * @returns {*}
   */
  postTodoComment ({ commit, state }, props){
    if(props.commentContent){
      var currentItem = state.todo.currentTodo;

      props['todoId'] = currentItem.id;
      props['type'] = 0;
      return api.todo.postComment(props)
        .then((com) => {
          com.type = 0;
          commit('TD_COMMENT_CREATED', {comment: com});
        });
    }else{
      return Promise.resolve();
    }
  },

// -----------doc actions start--------------------------

  /**
   * 获取文集列表
   * @param commit
   * @param state
   * @param props
   */
  fetchDocs ({ commit, state }){
    var docSetList = state.doc.docSetList;
    if(null == docSetList || docSetList.length == 0){
      return api.doc.getDocs()
        .then((list) => {
          commit('DOC_DSET_READY', {list: list});
        })
        .catch((err) => {
          throw err;
        });
    }else{
      return Promise.resolve();
    }

  },

  /**
   * 设置当前当前处于active状态的DocSet
   * @param commit
   * @param item
   */
  setCurrentDocSet ({ commit }, item) {
    commit('DOC_CURRENT_DSET_SET', {item: item});
  },

  /**
   * 新增文集
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  submitCreateDocSet ({ commit, state }, props){
    return api.doc.postNewDocSet(props)
      .then((result) => {
        commit('DOC_DSET_CREATED', {item: result});
        return result;
      });
  },

  /**
   * 更新当前active状态的文集，即currentDocSet
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  submitUpdateDocSet ({ commit, state }, props){
    return api.doc.putDocSet(props)
      .then((item) => {
        commit('DOC_DSET_UPDATED', {item: item});
      });
  },
  /**
   * 删除文集
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  submitDeleteDocSet ({ commit, state }){
    return api.doc.deleteDocSet(state.doc.currentDocSet)
      .then((item) => {
        commit('DOC_DSET_DELETED');
      })
  },

  /**
   * 同时获取currentDocSet的detail信息和currentDocNoteList的noteList
   * @param commit
   * @param state
   * @param docSet
   */
  fetchDocSetAndNote ({ commit, state }, params){
    //  重置当前的docNote列表
    commit('DOC_NOTE_LIST_RESET');
    var current = state.doc.currentDocSet;
    var pDetail = fetchDocSetDetail({ commit, state }, current, params);
    var pList = fetchDocNoteList({ commit, state }, current, params);
    return Promise.all([pDetail, pList]).then((result)=>{
      return result;
    });
  },

  /**
   * 由于使用fetchDocs获取到的docSet不包括权限信息，此方法用于获取docSet的权限信息
   * 1  如果docSet中存在authority.creator，说明该docSet的详情已经获取过，不再获取
   * 2  服务器上重新获取docNoteList
   * @param commit
   * @param state
   * @param docSet
   */
  fetchDocSetDetail ({ commit, state }, docSet, params){

    if(docSet.cDetail){
      return Promise.resolve().then(()=>{
        commit('DOC_DSET_DETAIL_EXIST');
        return docSet;
      });
    }else{
      return api.doc.fetchDocSetDetail({id: docSet.id})
        .then((docSetWithDetail) => {
          docSetWithDetail.cDetail = true;
          commit('DOC_DSET_DETAIL_READY', {item: docSet, newItem: docSetWithDetail});
          return docSet;
        });
    }
  },

  /**
   * 获取指定docSet下的所有笔记列表，需要分页，规则如下：
   * 1  读取分页大小max：state.defaultValue.docNotePageMax。
   * 2  计算state.doc.docNoteList缓存的读取区间：如果是初次读取，则读取缓存的前max条，如果不是初次读取，则读取当前列表的最后一项在缓存中的位置，并读取其后的max条
   * 3  如果能在缓存中正常读取到，则读取缓存。
   * 4  如果缓存中读取不到，且列表状态为完全加载，则返回加载完成。
   * 5  如果缓存中读取不到，且列表状态未完全加载，则去服务器上读取。
   * @param commit
   * @param state
   * @param docSet
   */
  fetchDocNoteList ({ commit, state }, docSet, params) {
    var docSet = docSet || state.doc.currentDocSet;
    var prom, list, lastCurrent, requestParams;

    var max = state.defaultValue.docNotePageMax;
    var currentDocList = state.doc.currentDocNoteList || [];
    var cacheList = state.doc.docNoteListMap[docSet.id] || [];
    var listStatus = state.doc.docNoteListStatusMap[docSet.id] || {};

    var cacheExist = false;
    var offset = 0;
    if (currentDocList.length > 0) {
      lastCurrent = currentDocList[currentDocList.length - 1];
      offset = cacheList.indexOf(lastCurrent) + 1;
    }

    //  判断是否读缓存
    if (listStatus.isLoadAll || cacheList.length > currentDocList.length) {
      cacheExist = true;
    }
    if (cacheExist) {
      //  缓存存在读缓存
      var lastIndex = Math.min(offset + max, cacheList.length);
      list = currentDocList.concat(cacheList.slice(offset, lastIndex));
      prom = Promise.resolve();
    } else {
      //  缓存不存在，则请求服务器读取
      requestParams = {id: docSet.id, max: max, isDefault: true, filter: 'commonSummarys'};
      if (lastCurrent) {
        requestParams['lastSummaryId'] = lastCurrent.id;
      }
      var tempList, loadAll;
      prom = api.doc.fetchDocNoteList(requestParams)
        .then((resultList) => {
          //  由于docList中docNote默认只返回一个userId，不返回用户信息，这里需要处理，将用户信息组合到docNote中
          //  格式如下：docNote: {cAuthor: {authUser: {}, rsqUser: {}}}
          //  每一个docNote中添加cAuthor属性，authUser是指钉钉等的用户信息，rsqUser是指日事清中的用户信息
          tempList = resultList;
          var idArray = [];
          tempList.forEach(function (docNote) {
            if (idArray.indexOf(docNote.userId) == -1) {
              idArray.push(docNote.userId);
            }
          });
          return fetchUseridFromRsqid({commit, state}, {
            corpId: state.loginUser.authUser.corpId,
            idArray: idArray
          });
        }).then((idMap)=> {
          tempList.forEach(function (docNote) {
            docNote.cAuthor = {
              rsqUser: null,  //暂时不做
              authUser: idMap[docNote.userId]
            }
          });
          list = currentDocList.concat(tempList);
          if (tempList.length < max) {
            loadAll = true;
          }
          commit('DOC_NOTE_LIST_CACHED', {docSet: docSet, list: list});
        });
    }

    return prom.then(()=> {
      commit('DOC_NOTE_LIST_READY', {list: list});
      if (loadAll) {
        commit('DOC_NOTE_LIST_FINISHED', {docSet: docSet});
      }
      return {isLoadAll: listStatus.isLoadAll};
    });
  },
  /**
   * 新增笔记
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  submitCreateDocNote ({ commit, state }, props){
    var newDocNote;
    return api.doc.postNewDocNote(props)
      .then((docNote)=>{
        newDocNote = docNote;
        return fetchUseridFromRsqid({ commit, state }, {
          corpId: state.loginUser.authUser.corpId,
          idArray: [newDocNote.userId]
        });
      }).then((idMap)=>{
        newDocNote.cAuthor = {
          rsqUser: null,  //暂时不做
          authUser: idMap[newDocNote.userId]
        };
        commit('DOC_NOTE_CREATED', {item: newDocNote});
      });
  },

  /**
   * 设置看板任务页面当前处于编辑状态的docNote，该docNote将会被现实在edit子页面中
   * @param commit
   * @param item
   */
  setCurrentDocNote ({ commit }, item) {
    commit('DOC_CURRENT_NOTE_SET', {item: item});
  },

  /**
   * 更新当前active状态的笔记，即currentDocNote
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  submitUpdateDocNote ({ commit, state }, props){
    return api.doc.putDocNote(props)
      .then((item) => {
        commit('DOC_NOTE_UPDATED', {item: item});
      });
  },
  /**
   * 删除笔记
   * @param commit
   * @param state
   * @param props
   * @returns {*|Function|any|Promise|Promise.<TResult>}
   */
  submitDeleteDocNote ({ commit, state }){
    return api.doc.deleteDocNote(state.doc.currentDocNote)
      .then((item) => {
        commit('DOC_NOTE_DELETED');
      });
  },
// -----------doc actions end--------------------------

  fetchStaffList ({ commit, state }) {
    if(null == state.staff.list){
      return api.system.fetchStaffList()
        .then((list) => {
          commit('SYS_STF_LST_READY', {list: list});
        });
    }else{
      return Promise.resolve();
    }
  },
  /**
   * 根据传入的openid获取相应的rsqid，首先从缓存中读取，如果缓存中不存在，则从服务器读取
   * @param commit
   * @param state
   * @param props.idArray
   * @param props.corpId
   */
  fetchRsqidFromUserid ({ commit, state }, props) {
    var openidsNotInCache = [],
      result = {},
      cache = state.openidCache,
      promise;
    props.idArray.forEach(function(userId){
      if(cache[userId]){
        result[userId] = cache[userId];
      }else{
        openidsNotInCache.push(userId);
      }
    });
    if(openidsNotInCache.length > 0){
      promise = api.appAuth.getOpenidMap({corpId: props.corpId, idArray: openidsNotInCache})
        .then(function(resp){
          var mapList = resp.result;
          mapList.forEach(function(idMap){
            //  双向缓存
            var key = idMap['userId'];
            result[key] = idMap;
            commit('SYS_OPENID_CACHED', {key: key, value: idMap});
            commit('SYS_RSQID_CACHED', {key: idMap['rsqUserId'], value: idMap});
          });
        });
    }else{
      promise = Promise.resolve();
    }
    return promise.then(()=>{
      return result;
    });
  },

  /**
   * 根据传入的rsqid获取相应的openid，首先从缓存中读取，如果缓存中不存在，则从服务器读取
   * @param commit
   * @param state
   */
  fetchUseridFromRsqid ({ commit, state }, props) {
    var idsNotInCache = [],
      result = {},
      cache = state.rsqidCache,
      promise;
    props.idArray.forEach(function (openid) {
      if (cache[openid]) {
        result[openid] = cache[openid];
      } else {
        idsNotInCache.push(openid);
      }
    });
    if (idsNotInCache.length > 0) {
      promise = api.appAuth.getRsqidMap({corpId: props.corpId, idArray: idsNotInCache})
        .then(function (resp) {
          var mapList = resp.result;
          mapList.forEach(function (idMap) {
            //  双向缓存
            var key = idMap['rsqUserId'];
            result[key] = idMap;
            commit('SYS_OPENID_CACHED',{key: key, value: idMap});
            commit('SYS_RSQID_CACHED', {key: idMap['userId'], value: idMap});
          });
        });
    } else {
      promise = Promise.resolve();
    }
    return promise.then(()=> {
      return result;
    });
  }
}
