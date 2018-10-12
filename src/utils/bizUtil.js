export default {
  /**
   * 目前只使用了其中四个模板，这个方法从所有模板中提取出这四个模板，以后需要使用那个模板，直接修改这个方法即可
   * 该接口获取到的allTemplate的结构上这样的
   * {"my":[],"t1":[{"id":188,"name":"任务管理","cover":"https://images.timetask.cn/cover/default/kanban_v1/card-default-3.png","tKanbanId":246,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":null,"childCover":[]},{"id":189,"name":"新员工入职","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-13.png","tKanbanId":247,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":null,"childCover":[]},{"id":190,"name":"工作计划","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-38.png","tKanbanId":248,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":null,"childCover":[]},{"id":191,"name":"公司OKR","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-10.png","tKanbanId":249,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":null,"childCover":[]},{"id":192,"name":"销售","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-14.png","tKanbanId":250,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":null,"childCover":[]},{"id":193,"name":"行政","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-11.png","tKanbanId":251,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":null,"childCover":[]},{"id":194,"name":"财务报销","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-12.png","tKanbanId":252,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":null,"childCover":[]},{"id":195,"name":"市场活动策划","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-15.png","tKanbanId":253,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":null,"childCover":[]}],"t2":[{"id":213,"name":"设计","cover":"https://images.timetask.cn/cover/default/kanban_v1/card-default-25.png","tKanbanId":null,"displayOrder":327679.0,"creatorId":686938,"parentCoverId":null,"childCover":[{"id":214,"name":"VI设计","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-37.png","tKanbanId":267,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":213,"childCover":[]}]},{"id":208,"name":"研发","cover":"https://images.timetask.cn/cover/default/kanban_v1/card-default-20.png","tKanbanId":null,"displayOrder":262143.0,"creatorId":686938,"parentCoverId":null,"childCover":[{"id":212,"name":"需求管理","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-22.png","tKanbanId":266,"displayOrder":262143.0,"creatorId":686938,"parentCoverId":208,"childCover":[]},{"id":211,"name":"产品设计","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-20.png","tKanbanId":265,"displayOrder":196607.0,"creatorId":686938,"parentCoverId":208,"childCover":[]},{"id":210,"name":"BUG管理","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-19.png","tKanbanId":264,"displayOrder":131071.0,"creatorId":686938,"parentCoverId":208,"childCover":[]},{"id":209,"name":"敏捷开发","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-21.png","tKanbanId":263,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":208,"childCover":[]}]},{"id":206,"name":"法律","cover":"https://images.timetask.cn/cover/default/kanban_v1/card-default-18.png","tKanbanId":null,"displayOrder":196607.0,"creatorId":686938,"parentCoverId":null,"childCover":[{"id":207,"name":"民事诉讼","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-17.png","tKanbanId":262,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":206,"childCover":[]}]},{"id":201,"name":"电商","cover":"https://images.timetask.cn/cover/default/kanban_v1/card-default-26.png","tKanbanId":null,"displayOrder":131071.0,"creatorId":686938,"parentCoverId":null,"childCover":[{"id":205,"name":"活动","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-25.png","tKanbanId":261,"displayOrder":262143.0,"creatorId":686938,"parentCoverId":201,"childCover":[]},{"id":204,"name":"销售","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-27.png","tKanbanId":260,"displayOrder":196607.0,"creatorId":686938,"parentCoverId":201,"childCover":[]},{"id":203,"name":"新品发布","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-28.png","tKanbanId":259,"displayOrder":131071.0,"creatorId":686938,"parentCoverId":201,"childCover":[]},{"id":202,"name":"客服","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-26.png","tKanbanId":258,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":201,"childCover":[]}]},{"id":196,"name":"制造业","cover":"https://images.timetask.cn/cover/default/kanban_v1/card-default-34.png","tKanbanId":null,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":null,"childCover":[{"id":200,"name":"生产","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-34.png","tKanbanId":257,"displayOrder":262143.0,"creatorId":686938,"parentCoverId":196,"childCover":[]},{"id":199,"name":"销售","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-36.png","tKanbanId":256,"displayOrder":196607.0,"creatorId":686938,"parentCoverId":196,"childCover":[]},{"id":198,"name":"物料","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-35.png","tKanbanId":255,"displayOrder":131071.0,"creatorId":686938,"parentCoverId":196,"childCover":[]},{"id":197,"name":"仓库","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-33.png","tKanbanId":254,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":196,"childCover":[]}]}],"t3":[{"id":215,"name":"个人安排","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-29.png","tKanbanId":268,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":null,"childCover":[]},{"id":216,"name":"读书计划","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-30.png","tKanbanId":269,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":null,"childCover":[]},{"id":217,"name":"旅行计划","cover":"https://images.timetask.cn/cover/default/kanban_v2/cover-default-31.png","tKanbanId":270,"displayOrder":65535.0,"creatorId":686938,"parentCoverId":null,"childCover":[]}],"normal":[],"company":[]}
   * @param allTemplate
   */
  extractTemplate (allTemplate) {
    const recursiveExtractTemplate = (templateList, targetArray, resultArray) => {
      templateList.forEach(template => {
        const index = targetArray.indexOf(template.name)
        if (index !== -1 && template.tKanbanId) {
          resultArray.push(template)
          targetArray.splice(index, 1)
        }
        if (template.childCover) {
          recursiveExtractTemplate(template.childCover, targetArray, resultArray)
        }
      })
    }
    const templateArray = []
    const templateNameArray = ['工作计划', '研发计划', '销售计划', '战略计划']
    templateNameArray.forEach(name => {
      const templateToFind = [name]

      const t1 = allTemplate['t1']
      const t2 = allTemplate['t2']
      const t3 = allTemplate['t3']
      const normal = allTemplate['normal']

      recursiveExtractTemplate(t1, templateToFind, templateArray)
      recursiveExtractTemplate(t2, templateToFind, templateArray)
      recursiveExtractTemplate(t3, templateToFind, templateArray)
      recursiveExtractTemplate(normal, templateToFind, templateArray)
    })

    return templateArray
  }
}
