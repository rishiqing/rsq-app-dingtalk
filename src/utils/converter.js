export default {
  /**
   * 将todo转换成todoTime所需要的格式
   * @param todo
   */
  todo2TodoTime (todo) {
    //  todo为空的情况下做默认转换
    if (!todo) {
      return {
        isAllDay: true,
        todo: {
          clock: {
            alwaysAlert: true,
            startTime: null,
            endTime: null,
            alert: []
          }
        }
      }
    } else {
      return {
        isAllDay: !todo.clock,
        todo: {
          id: todo.id,
          clock: {
            alwaysAlert: todo.alwaysAlert,
            startTime: todo.startTime,
            endTime: todo.endTime,
            alert: todo.alert || []
          }
        }
      }
    }
  },
  /**
   * 将todoTime格式转换成Todo属性
   * @param todoTime
   */
  todoTime2Todo (todoTime) {
    if (!todoTime) return null
    return {
      clock: {
        alwaysAlert: todoTime.alwaysAlert,
        startTime: todoTime.startTime,
        endTime: todoTime.endTime,
        alert: todoTime.alert || []
      }
    }
  }
}
