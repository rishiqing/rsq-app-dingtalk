import util from 'ut/jsUtil'

export default {
  increment (state, p) {
    state.count ++
  },
  SYS_DO_LOGIN(state, user) {
    state.loginUser = user;
  },
  SYS_DO_LOGOUT(state){
    state.loginUser = null;
  },
  SYS_PAGE_VIEW_INIT(state, props) {
    state.currentPage = props.path;
  },
  SYS_PAGE_SECTION_PUSH(state, props){
    var section = {
      id: props.sectionId,
      isShowTitle: props.isShowTitle,
      isShowNav: props.isShowNav,
      name: props.titleName,
      buttons: props.titleButtons
    };
    state.section.history.push(section);
  },
  SYS_PAGE_SECTION_POP(state){
    state.section.history.pop();
  },
  SYS_PAGE_SECTION_RESET(state){
    state.section.history = [];
  },

  //  section show and hide
  SYS_SHOW_INBOX_EDIT(state, status){
    state.inbox.isShowEdit = status;
  },
  SYS_SHOW_SCHEDULE_EDIT(state, status){
    state.schedule.isShowEdit = status;
  },
  SYS_SHOW_KBTODO_EDIT(state, status){
    state.kbTodo.isShowEdit = status;
  },
  SYS_SHOW_CONTAINER_EDIT(state, status){
    state.schedule.isShowConEdit = status;
  },
  SYS_SHOW_STAFF_SELECT(state, status){
    state.staff.isShowStaffEdit = status;
  },
  SYS_SHOW_SYSTEM_SELECT_DATE(state, status){
    state.system.isShowDate = status;
  },
  SYS_SHOW_INBOX_LIST(){},
  SYS_SHOW_SCHEDULE_LIST(){},
  SYS_SHOW_KANBAN_LIST(){},
  SYS_SHOW_KBTODO_LIST(){},

  SYS_STAFF_LIST_READY(state, list){
    state.staff.list = list;
  },
  SYS_SHOW_STAFF_EDIT(state, status){
    state.staff.isShowStaffEdit = status;
  },

  SYS_OPENID_CACHE_SET(state, key, value){
    state.openidCache[key] = value;
  },
  SYS_RSQID_CACHE_SET(state, key, value){
    state.rsqidCache[key] = value;
  },

  SYS_SET_SHOW_NAV(state, isShow){
    state.env.isShowNav = isShow;
  },

  /* ----------------inbox----------------- */
  INBOX_TODO_READY(state, items) {
    state.inbox.items = items;
  },
  INBOX_TODO_CREATED(state, item){
    if(state.inbox.items){
      state.inbox.items.unshift(item);
    }
  },
  /* --------------------------------- */

  /* ----------------schedule----------------- */
  SCHEDULE_TODO_READY(state, strCurrentDate, items) {
    state.schedule.strCurrentDate = strCurrentDate;
    state.schedule.items = items;
  },
  SCHEDULE_TODO_CACHE(state, strCurrentDate, items){
    state.schedule.dateItems[strCurrentDate] = items;
  },
  DELETE_SCHEDULE_TODO_CACHE(state, strCurrentDate){
    delete state.schedule.dateItems[strCurrentDate];
  },
  SCHEDULE_TODO_CREATED(state, item, list){
    if(list instanceof Array){
      list.unshift(item);
    }else{
      state.schedule.items.unshift(item);
    }
  },
  SCHEDULE_LIST_TODO_CHECKED(state, item, status){
    item.pIsDone = status;
  },
  /* --------------------------------- */

  /* ---------------todo收纳箱和日程页面的公共数据------------------ */
  TODO_CURRENT_ITEM_SET(state, item) {
    state.todo.currentTodo = item;
  },
  TODO_GET(state, newTodo){
    util.extendObject(state.todo.currentTodo, newTodo);
  },
  TODO_PROP_SET(state, props) {
    let item = state.todo.currentTodo;
    util.extendObject(item, props);
  },
  TODO_DELETED(state, item){
    let items = item.pContainer == 'inbox' ? state.inbox.items : state.schedule.items;
    let index = items.indexOf(item);
    if(index > -1){
      items.splice(index, 1);
    }
  },
  TODO_COMMENT_SAVED(state, comment){
    state.todo.currentTodo.comments.push(comment);
  },
  /* --------------------------------- */

  //-------------------------plan v2.0

  PLAN_READY(state, commonPlans, starPlans){
    state.plan.commonPlans = commonPlans;
    state.plan.starPlans = starPlans;
  },

  //-------------------------plan v2.0

  PLAN_CURRENT_SET(state, item) {
    item = item || {};
    state.plan.currentPlan = item;
    state.plan.lastPlanCard = null;
  },
  KANBAN_SHOW_EDIT(state, status) {
    state.kanban.isShowEdit = status;
  },
  PLAN_CREATED(state, item){
    if(item.starMark){
      state.plan.starPlans.push(item);
    }else{
      state.plan.commonPlans.push(item);
    }
  },
  PLAN_UPDATED(state, item){
    util.extendObject(state.plan.currentPlan, item);
  },
  PLAN_DELETED(state){
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
  TOGGLE_PLAN_STAR(state, plan, isStar){
    plan.starMark = isStar;
    var orgList = isStar ? state.plan.commonPlans : state.plan.starPlans;
    var targetList = (!isStar) ? state.plan.commonPlans : state.plan.starPlans;
    //  从旧列表中删除
    var orgIndex = orgList.indexOf(plan);
    orgList.splice(orgIndex, 1);
    util.insertOrderList(targetList, plan, function(cur, obj){
      return obj.dateCreated < cur.dateCreated;
    });
    //  寻找新列表的添加顺，排序顺序，根据时间排序

  },
  PLAN_DETAIL_EXIST(state){},
  PLAN_DETAIL_READY(state, oldKanban, kanbanWithDetail){
    util.extendObject(oldKanban, kanbanWithDetail);
  },
  PLAN_TODO_CURRENT_SET(state, item){
    state.planTodo.currentTodo = item;
  },
  // KBTODO_SHOW_EDIT(state, status){
  // 	state.kbTodo.isShowEdit = status;
  // },
  PLAN_CARD_CREATED(state, plan, kc){
    var cardList = plan.kanbanCardList;
    cardList.push(kc);
  },
  PLAN_CARD_UPDATED(state, props){
    let kc = util.findById(state.plan.currentPlan.kanbanCardList, props.id);
    if(kc){
      util.extendObject(kc, props);
    }
  },
  PLAN_CARD_DELETED(state, props){
    util.deleteById(state.plan.currentPlan.kanbanCardList, props.id);
    var lastCard = state.plan.lastPlanCard;
    if(lastCard && props.id == lastCard.id ){
      state.plan.lastPlanCard = null;
    }
  },
  PLAN_TODO_CREATED(state, kt){
    let cardList = state.plan.currentPlan.kanbanCardList;
    let card = util.findById(cardList, kt.kanbanCardId);
    if(!card.kanbanItemList){
      card.kanbanItemList = [];
    }
    card.kanbanItemList.push(kt);
    state.plan.lastPlanCard = card;
  },
  PLAN_TODO_GET(state, newTodo){
    util.extendObject(state.planTodo.currentTodo, newTodo);
  },
  PLAN_TODO_PROP_SET(state, item, props){
    util.extendObject(item, props);
  },
  PLAN_TODO_DELETED(state, props){
    let card = util.findById(state.plan.currentPlan.kanbanCardList, props.kanbanCardId);
    util.deleteById(card.kanbanItemList, props.id);
  },
  PLAN_TODO_COMMENT_SAVED(state, comment){
    state.planTodo.currentTodo.commentList.push(comment);
  },
  PLAN_TODO_MOVE(state, newTodo, orgCard, targetCard){
    var current = state.planTodo.currentTodo;
    util.extendObject(current, newTodo);
    let index = orgCard.kanbanItemList.indexOf(current);
    orgCard.kanbanItemList.splice(index, 1);
    util.insertOrderList(targetCard.kanbanItemList, current, function(cur, obj){
      return obj.displayOrder >= cur.displayOrder && obj.dateCreated > cur.dateCreated;
    });

  },
  KBTODO_LIST_TODO_CHECKED(state, item, status){
    item.isDone = status;
  },
  PLAN_TODO_RECEIVER_SET(state, todo){
    util.extendObject(state.planTodo.currentTodo, todo);
  },

  //  文集相关
  DOC_SET_READY(state, list){
    state.doc.docSetList = list;
  },
  DOC_SET_CREATED(state, item){
    var dsList = state.doc.docSetList;
    if(null == dsList){
      dsList = [];
    }
    dsList.push(item);
  },
  DOC_SET_CURRENT_SET(state, item){
    state.doc.currentDocSet = item;
  },
  DOC_SET_UPDATED(state, item){
    util.extendObject(state.doc.currentDocSet, item);
  },
  DOC_SET_DELETED(state){
    let item = state.doc.currentDocSet;
    let list = state.doc.docSetList;
    let index = list.indexOf(item);
    if(index > -1){
      list.splice(index, 1);
    }
  },
  DOC_SET_DETAIL_EXIST(state, item){},
  DOC_SET_DETAIL_READY(state, oldDS, newDS){
    util.extendObject(oldDS, newDS);
  },
  DOC_NOTE_LIST_RESET(state){
    state.doc.currentDocNoteList = null;
  },
  //  将list存入cache中
  DOC_NOTE_LIST_SAVE_CACHE(state, docSet, list){
    state.doc.docNoteListMap[docSet.id] = list;
    if(!state.doc.docNoteListStatusMap[docSet.id]){
      state.doc.docNoteListStatusMap[docSet.id] = {};
    }
  },
  //  设置当前的currentDocNoteList
  DOC_NOTE_LIST_READY(state, docSet, list){
    state.doc.currentDocNoteList = list;
  },
  DOC_NOTE_LIST_LOAD_ALL(state, docSet, list){
    state.doc.docNoteListStatusMap[docSet.id].isLoadAll = true;
  },
  DOC_NOTE_CURRENT_SET(state, docNote){
    state.doc.currentDocNote = docNote;
  },
  DOC_NOTE_CREATED(state, item){
    state.doc.currentDocNoteList.unshift(item);
  },
  DOC_NOTE_UPDATED(state, item){
    util.extendObject(state.doc.currentDocNote, item);
  },
  DOC_NOTE_DELETED(state){
    let item = state.doc.currentDocNote;
    let list = state.doc.currentDocNoteList;
    let index = list.indexOf(item);
    if(index > -1){
      list.splice(index, 1);
    }
  }
}
