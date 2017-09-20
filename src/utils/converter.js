import jsUtil from 'ut/jsUtil'
import def from 'ut/defaultUtil'

export default {
  /**
   * 将todo转换成todoTime所需要的格式
   * @param todo
   */
  todoTimeBack2Front (todo) {
    //  todo为空的情况下做默认转换
    if (!todo) return null
    var todoClock = todo.clock
    var isAllDay = !todoClock || !todoClock.startTime
    var clock = isAllDay ? def.defaultTodoClock() : jsUtil.extendObject({}, todoClock)
    return {
      isAllDay: isAllDay,
      clock: clock
    }
  },
  /**
   * 将todoTime格式转换成Todo属性
   * @param todoTime
   */
  todoTimeFront2Back (todoTime) {
    if (!todoTime) return null
    if (todoTime.isAllDay) return { clock: {} }
    var clock = {}
    jsUtil.extendObject(clock, todoTime.clock)
    if (todoTime.clock.alert && todoTime.clock.alert.length === 0) {
      delete clock.alert
    }
    return {
      clock: clock
    }
  },
  /**
   * todoTime的比对，规则如下：
   * 1  time1.isAllDay == time2.isAllDay == true，则相等
   * 2  time1.isAllDay == true， time2.isAllDay == false，则不相等
   * 3  time1.isAllDay == false， time2.isAllDay == true，则不相等
   * 4  time1.isAllDay == time2.isAllDay == false，逐项判断clock是否相等
   * @param time1
   * @param time2
   */
  compareTodoTime (time1, time2) {
    time1 = time1.isAllDay ? time1 : this.todoTimeBack2Front(time1)
    time2 = time2.isAllDay ? time2 : this.todoTimeBack2Front(time2)
    if (time1.isAllDay === true && time2.isAllDay === true) {
      return true
    } else if (time1.isAllDay !== time2.isAllDay) {
      return false
    } else {
      return jsUtil.objectEqual(time1.clock, time2.clock)
    }
  },
  /**
   * 将todoAlert对象由后台对象转换为前台对象
   * @param back 对象示例：{alert: []}
   */
  todoAlertBack2Front (back) {
    if (!back || !back.alert || !back.startTime || !back.endTime) return null
    var ruleList = []
    var timeList = []
    back.alert.forEach(b => {
      if (b.isUserDefined) {
        timeList.push({numTime: jsUtil.alertRule2Time(b.schedule, back.taskDate, back.startTime, back.endTime)})
      } else {
        ruleList.push(b)
      }
    })
    return {
      ruleList,
      timeList
    }
  },
  /**
   * 将todoAlert对象由前台对象转换为后台对象
   * @param front
   */
  todoAlertFront2Back (front, todoTime) {
    var list = front.ruleList.slice()
    front.timeList.forEach(t => {
    })
    return list
  }
}
