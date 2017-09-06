import util from 'ut/jsUtil'

/**
 * mutation命名规则：
 * 模块前缀_主要操作实体_操作动作
 * 1、模块前缀：
 * SYS：系统级别，例如当前用户、团队用户等
 * INB：inbox收纳箱
 * SCH：schedule日程
 * TD：收纳箱和日程的公共模块
 * PLN：Plan计划（看板）
 * DOC：笔记
 * ME：个人相关
 * 2、操作实体，常用的有：
 * USR：用户
 * STF：员工
 * TODO：任务，包括了收纳箱、日程、计划任务
 * KB：计划看板
 * KBCARD：看板卡片
 * DSET：文集doc set
 * NOTE：笔记
 * LST：各种列表
 * 3、操作动作
 * CREATED
 * UPDATED
 * DELETED
 * GET
 * SET
 * READY
 * CACHED
 */
export default {
  increment (state, p) {
    state.count ++
  },
  /**
   * 登录后设置全局loginUser
   * @param state
   * @param p.user
   * @constructor
   */
  SYS_USR_LOGIN(state, p) {
    state.loginUser = p.user;
  },
  /**
   * 注销后将全局loginUser置为null
   * @param state
   * @constructor
   */
  SYS_USR_LOGOUT(state){
    state.loginUser = null;
  },
  //  section show and hide

  /**
   *
   * @param state
   * @param p.list
   * @constructor
   */
  SYS_STF_LST_READY(state, p){
    state.staff.list = p.list;
  },
  /**
   * 以openid作为key值进行缓存
   * @param state
   * @param p.key
   * @param p.value
   * @constructor
   */
  SYS_OPENID_CACHED(state, p){
    state.openidCache[p.key] = p.value;
  },
  /**
   * 以rsqid作为key值进行缓存
   * @param state
   * @param p.key
   * @param p.value
   * @constructor
   */
  SYS_RSQID_CACHED(state, p){
    state.rsqidCache[p.key] = p.value;
  },
  /**
   * 设置是否显示导航
   * @param state
   * @param p.isShow
   * @constructor
   */
  SYS_NAV_SHOW(state, p){
    state.env.isShowNav = p.isShow;
  },

  /* ----------------inbox----------------- */
  /**
   *
   * @param state
   * @param p
   * @constructor
   */
  INB_TODO_READY(state, p) {
    state.inbox.items = p.items;
  },
  /**
   *
   * @param state
   * @param p.item
   * @constructor
   */
  INB_TODO_CREATED(state, p){
    if(state.inbox.items){
      state.inbox.items.unshift(p.item);
    }
  },
  /* --------------------------------- */

  /* ----------------schedule----------------- */
  SCH_TODO_READY(state, p) {
    state.schedule.strCurrentDate = p.strCurrentDate;
    state.schedule.items = p.items;
  },
  SCH_TODO_CACHED(state, p){
    state.schedule.dateItems[p.strCurrentDate] = p.items;
  },
  SCH_TODO_CACHE_DELETE(state, p){
    delete state.schedule.dateItems[p.strCurrentDate];
  },
  SCH_TODO_CREATED(state, p){
    if(p.list instanceof Array){
      p.list.unshift(p.item);
    }else{
      state.schedule.items.unshift(p.item);
    }
  },
  SCH_LIST_TODO_CHECKED(state, p){
    console.log("mutation进来了")
    p.item.pIsDone = p.status;
  },
  /* --------------------------------- */

  /* ---------------todo收纳箱和日程页面的公共数据------------------ */
  TD_CURRENT_TODO_SET(state, p) {
    console.log("TD_CURRENT_TODO_SET进来了")
    state.todo.currentTodo = p.item;
  },
  TD_TODO_GET(state, p){
    util.extendObject(state.todo.currentTodo, p.todo);
  },
  TD_TODO_UPDATED(state, p) {
    let item = state.todo.currentTodo;
    util.extendObject(item, p.todo);
  },
  TD_TODO_DELETED(state, p){
    let items = p.item.pContainer == 'inbox' ? state.inbox.items : state.schedule.items;
    let index = items.indexOf(p.item);
    if(index > -1){
      items.splice(index, 1);
    }
  },
  TD_COMMENT_CREATED(state, p){
    state.todo.currentTodo.comments.push(p.comment);
  },
  /* --------------------------------- */

  //-------------------------plan v2.0

  PLN_KB_READY(state, p){
    state.plan.commonPlans = p.commonPlans;
    state.plan.starPlans = p.starPlans;
  },

  //-------------------------plan v2.0

  PLN_CURRENT_KB_SET(state, p) {
    item = p.item || {};
    state.plan.currentPlan = item;
    state.plan.lastPlanCard = null;
  },
  PLN_KB_CREATED(state, p){
    if(p.item.starMark){
      state.plan.starPlans.push(p.item);
    }else{
      state.plan.commonPlans.push(p.item);
    }
  },
  PLN_KB_UPDATED(state, p){
    util.extendObject(state.plan.currentPlan, p.item);
  },
  PLN_KB_DELETED(state){
    let item = state.plan.currentPlan;
    let list;
    if(item.starMark){
      list = state.plan.starPlans;
    }else{
      list = state.plan.commonPlans;
    }
    let index = list.indexOf(item);
    if(index > -1){
      list.splice(index, 1);
    }
    state.plan.lastPlanCard = null;
  },
  PLN_KB_STAR_TOGGLE(state, p){
    p.plan.starMark = p.isStar;
    var orgList = p.isStar ? state.plan.commonPlans : state.plan.starPlans;
    var targetList = (!p.isStar) ? state.plan.commonPlans : state.plan.starPlans;
    //  从旧列表中删除
    var orgIndex = orgList.indexOf(p.plan);
    orgList.splice(orgIndex, 1);
    util.insertOrderList(targetList, p.plan, function(cur, obj){
      return obj.dateCreated < cur.dateCreated;
    });
    //  寻找新列表的添加顺，排序顺序，根据时间排序

  },
  PLN_KB_DETAIL_EXIST(state){},
  PLN_KB_DETAIL_READY(state, p){
    util.extendObject(p.plan, p.planWithDetail);
  },
  PLN_CURRENT_TODO_UPDATED(state, p){
    state.planTodo.currentTodo = p.item;
  },
  // KBTODO_SHOW_EDIT(state, status){
  // 	state.kbTodo.isShowEdit = status;
  // },
  /**
   *
   * @param state
   * @param p.plan
   * @param p.planCard
   * @constructor
   */
  PLN_KBCARD_CREATED(state, p){
    var cardList = p.plan.kanbanCardList;
    cardList.push(p.planCard);
  },
  /**
   *
   * @param state
   * @param p.item 新的plan card
   * @constructor
   */
  PLN_KBCARD_UPDATED(state, p){
    let kc = util.findById(state.plan.currentPlan.kanbanCardList, p.item.id);
    if(kc){
      util.extendObject(kc, p.item);
    }
  },
  /**
   *
   * @param state
   * @param p.item
   * @constructor
   */
  PLN_KBCARD_DELETED(state, p){
    util.deleteById(state.plan.currentPlan.kanbanCardList, p.item.id);
    var lastCard = state.plan.lastPlanCard;
    if(lastCard && p.item.id == lastCard.id ){
      state.plan.lastPlanCard = null;
    }
  },
  /**
   *
   * @param state
   * @param p
   * @constructor
   */
  PLN_TODO_CREATED(state, p){
    let cardList = state.plan.currentPlan.kanbanCardList;
    let card = util.findById(cardList, p.item.kanbanCardId);
    if(!card.kanbanItemList){
      card.kanbanItemList = [];
    }
    card.kanbanItemList.push(p.item);
    state.plan.lastPlanCard = card;
  },
  /**
   *
   * @param state
   * @param p.item
   * @constructor
   */
  PLN_TODO_UPDATED(state, p){
    var item = p.item || state.planTodo.currentTodo;
    util.extendObject(item, p.newItem);
  },
  /**
   *
   * @param state
   * @param p.item
   * @constructor
   */
  PLN_TODO_DELETED(state, p){
    let card = util.findById(state.plan.currentPlan.kanbanCardList, p.item.kanbanCardId);
    util.deleteById(card.kanbanItemList, p.item.id);
  },
  /**
   *
   * @param state
   * @param p.item todo comment
   * @constructor
   */
  PLN_TODO_COMMENT_CREATED(state, p){
    state.planTodo.currentTodo.commentList.push(p.item);
  },
  /**
   *
   * @param state
   * @param p.item
   * @param p.sourceCard
   * @param p.targetCard
   * @constructor
   */
  PLN_TODO_MOVE(state, p){
    var newTodo = p.item,
      orgCard = p.sourceCard,
      targetCard = p.targetCard;
    var current = state.planTodo.currentTodo;
    util.extendObject(current, newTodo);
    let index = orgCard.kanbanItemList.indexOf(current);
    orgCard.kanbanItemList.splice(index, 1);
    util.insertOrderList(targetCard.kanbanItemList, current, function(cur, obj){
      return obj.displayOrder >= cur.displayOrder && obj.dateCreated > cur.dateCreated;
    });

  },

  //  文集相关
  /**
   *
   * @param state
   * @param p.list
   * @constructor
   */
  DOC_DSET_READY(state, p){
    state.doc.docSetList = p.list;
  },
  /**
   *
   * @param state
   * @param p.item
   * @constructor
   */
  DOC_DSET_CREATED(state, p){
    var dsList = state.doc.docSetList;
    if(null == dsList){
      dsList = [];
    }
    dsList.push(p.item);
  },
  /**
   *
   * @param state
   * @param p.item
   * @constructor
   */
  DOC_CURRENT_DSET_SET(state, p){
    state.doc.currentDocSet = p.item;
  },
  /**
   *
   * @param state
   * @param p.item
   * @constructor
   */
  DOC_DSET_UPDATED(state, p){
    util.extendObject(state.doc.currentDocSet, p.item);
  },
  /**
   *
   * @param state
   * @constructor
   */
  DOC_DSET_DELETED(state){
    let item = state.doc.currentDocSet;
    let list = state.doc.docSetList;
    let index = list.indexOf(item);
    if(index > -1){
      list.splice(index, 1);
    }
  },
  /**
   *
   * @param state
   * @constructor
   */
  DOC_DSET_DETAIL_EXIST(state){},
  /**
   *
   * @param state
   * @param p.item
   * @param p.newItem
   * @constructor
   */
  DOC_DSET_DETAIL_READY(state, p){
    util.extendObject(p.item, p.newItem);
  },
  /**
   *
   * @param state
   * @constructor
   */
  DOC_NOTE_LIST_RESET(state){
    state.doc.currentDocNoteList = null;
  },
  /**
   * 将list存入cache中
   * @param state
   * @param p.docSet
   * @param p.list
   * @constructor
   */
  DOC_NOTE_LIST_CACHED(state, p){
    var docSet = p.docSet,
      list = p.list;
    state.doc.docNoteListMap[docSet.id] = list;
    if(!state.doc.docNoteListStatusMap[docSet.id]){
      state.doc.docNoteListStatusMap[docSet.id] = {};
    }
  },
  /**
   * 设置当前的currentDocNoteList
   * @param state
   * @param p.list
   * @constructor
   */
  DOC_NOTE_LIST_READY(state, p){
    state.doc.currentDocNoteList = p.list;
  },
  /**
   *
   * @param state
   * @param p.docSet
   * @constructor
   */
  DOC_NOTE_LIST_FINISHED(state, dp){
    state.doc.docNoteListStatusMap[p.docSet.id].isLoadAll = true;
  },
  /**
   *
   * @param state
   * @param p.item
   * @constructor
   */
  DOC_CURRENT_NOTE_SET(state, p){
    state.doc.currentDocNote = p.item;
  },
  /**
   *
   * @param state
   * @param p.item
   * @constructor
   */
  DOC_NOTE_CREATED(state, p){
    state.doc.currentDocNoteList.unshift(p.item);
  },
  /**
   *
   * @param state
   * @param p.item
   * @constructor
   */
  DOC_NOTE_UPDATED(state, p){
    util.extendObject(state.doc.currentDocNote, p.item);
  },
  /**
   * 删除笔记
   * @param state
   * @constructor
   */
  DOC_NOTE_DELETED(state){
    let item = state.doc.currentDocNote;
    let list = state.doc.currentDocNoteList;
    let index = list.indexOf(item);
    if(index > -1){
      list.splice(index, 1);
    }
  }
}
