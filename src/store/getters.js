export default {
  getCount: state => {
    return state.count
  },
  // planUserRoles: state => {
  //   return state.plan.currentPlan.userRoles.map(function(ur){
  //     return {id: ur.userId, role: ur.role};
  //   });
  // },
  /**
   * 获取上次新增planTodo时所属于的card。如果上次新增planTodo所属于的card为null，则默认读取当前plan的最后一项card作为返回值
   * @param state
   */
  // lastCard: state => {
  //   if(state.plan.lastPlanCard){
  //     return state.plan.lastPlanCard;
  //   }else{
  //     var length = state.plan.currentPlan.kanbanCardList.length;
  //     return state.plan.currentPlan.kanbanCardList[length-1];
  //   }
  // },
  dType: state => {
    return state.env.dType;
  },
  // planTemplate: state => {
  //   return state.defaultValue.planTemplate;
  // },
  // docSetTemplate: state => {
  //   return state.defaultValue.docSetTemplate;
  // },
  loginUser: state => {
    return state.loginUser;
  },
  // staffList: state => {
  //   return state.staff.list;
  // },
  // getCardInCurrentPlan: state => {
  //
  // },
  // getLoginUser: state => {
  //   return state.loginUser;
  // },
  // getNav: state => {
  //   return state.nav;
  // },
  //
  // getKanbans: state => {
  //   return state.kanban.kanbans;
  // },
  //
  // getCurrentSection: state => {
  //   var history = state.section.history;
  //   return history[history.length - 1] || {};
  // },
  //
  // dateFromNow: state => {
  //
  // }
}
