export default {
	//  第三方集成authServer的接口
	'AUTH_TO_RSQID': 'idmap/userid2rsqid',
	'AUTH_TO_USERID': 'idmap/rsqid2userid',

	'AVATAR_CDN': 'https://rishiqing-avatar.oss-cn-beijing.aliyuncs.com/',
	'SYS_AVATAR_CDN': 'https://rishiqing-images.oss-cn-beijing.aliyuncs.com/avatar/',
	'CHECK_AUTH': 'task/login/authAjax',
	'POST_LOGIN': 'task/j_spring_security_check',
	'GET_LOGOUT': 'task/j_spring_security_logout',
	'GET_INBOX_TODOS': 'task/mainTodoList/getInboxTodos',
	'POST_NEW_TODO': '/v2/todo',
	'PUT_TODO_PROP': 'task/rsqTodoData/:id',
	'DELETE_TODO': 'task/rsqTodoData/:id',
	'GET_TODO': 'task/rsqTodoData/:id',
	'GET_SCHEDULE_TODOS': 'task/mainTodoList/getPeriodTodos',

	'GET_PLANS': 'task/v2/kanban/kanbanList',
	'POST_NEW_PLAN': 'task/v2/kanban',
	'PUT_PLAN': 'task/v2/kanban/:id',
	'GET_PLAN_DETAIL': 'task/v2/kanban/:id',
	'DELETE_PLAN': 'task/v2/kanban/:id',
	'PUT_PLAN_STAR': 'task/kanbanStarMark',
	'DELETE_PLAN_STAR': 'task/kanbanStarMark',
	'POST_NEW_PLAN_CARD': 'task/kanbanCard',
	'PUT_PLAN_CARD': 'task/kanbanCard/:id',
	'DELETE_PLAN_CARD': 'task/kanbanCard/:id',
	'GET_PLAN_TODO': 'task/kanbanItem/:id',
	'POST_NEW_PLAN_TODO': 'task/kanbanItem',
	'PUT_PLAN_TODO': 'task/kanbanItem/:id',
	'DELETE_PLAN_TODO': 'task/kanbanItem/:id',
	'POST_PLAN_TODO_COMMENT': 'task/kanbanItemComment',
	'POST_PLAN_TODO_MOVE': 'task/kanbanItem/kanbanItemMove',

	//  笔记url
	'GET_DOC_SET_LIST': 'task/v2/note/getCorpuses',
	'GET_DOC_SET_DETAIL': 'task/v2/note/:id',
	'POST_NEW_DOC_SET': 'task/v2/note',
	'PUT_DOC_SET': 'task/v2/note/:id',
	'DELETE_DOC_SET': 'task/v2/note/:id',

	'GET_DOC_NOTE_LIST': 'task/v2/summary/getSummarys',
	'GET_DOC_NOTE_DETAIL': 'task/v2/summary/authority/:id',
	'POST_DOC_NOTE': 'task/v2/summary/authority',
	'PUT_DOC_NOTE': 'task/v2/summary/authority/:id',
	'DELETE_DOC_NOTE': 'task/v2/summary/authority/:id',

	'GET_STAFF_LIST': 'task/rsqCommonUser/getAllCompanyUserList',
	'GET_TODO_TITLE': 'task/rsqTodoTitle/getAllTodoTitleList',
	'POST_TODO_COMMENT': 'task/todoComment'
}
