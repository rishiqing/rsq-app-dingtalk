import dateUtil from 'ut/dateUtil'
import store from '@/store'

export default {
  defaultTodo () {
    var state = store.state
    var currentVal = dateUtil.dateText2Num(state.schedule.strCurrentDate)
    var strDate = dateUtil.dateNum2Text(currentVal)
    return {
      pTitle: '',
      pDisplayOrder: 0,
      pUserId: state.loginUser.rsqUser.id,
      pNote: '',
      pContainer: 'IE',
      pIsDone: false,
      pFinishedTime: null,
      pPlanedTime: '',
      startDate: strDate,
      endDate: strDate,
      dates: null,
      senderId: null,
      receiverIds: null,
      hasAvatar: null,
      systemAvatar: null,
      isDeleted: false,
      kanbanItem: null,
      todoDeployId: null,
      noteFile: [],
      allDoneSubTodosCount: 0,
      allSubTodosCount: 0,
      clock: {},
      receiverUser: [],
      KSLList: [],
      TSLList: [],
      allKList: [],
      allTList: [],
      subTodos: [],
      comments: [],
      noteFiles: []
    }
  },
  defaultTodoClock () {
    return {
      startTime: null,
      endTime: null,
      alwaysAlert: true,
      alert: []
    }
  }
}
