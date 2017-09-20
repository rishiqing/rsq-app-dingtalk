import store from '@/store'

export default {
  defaultTodo () {
    var state = store.state
    var userId = state.loginUser ? state.loginUser.rsqUser.id : 0
    return {
      pTitle: '',
      pDisplayOrder: 0,
      pUserId: userId,
      pNote: '',
      pContainer: 'IE',
      pIsDone: false,
      pFinishedTime: null,
      pPlanedTime: '',
      startDate: null,
      endDate: null,
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
      taskDate: store.getters.createTaskDate,
      alert: []
    }
  },
  defaultTodoAlert () {
    return {
      list: []
    }
  }
}
