<template>
  <div class="sel-canvas">
    <div class="sel-header">
      <div class="sel-search-wrap">
        <input
          v-model="nameSearch"
          type="text"
          class="sel-search"
          placeholder="搜索">
        <i class="icon2-search sel-icon-search"/>
        <v-touch
          v-show="nameSearch"
          tag="i"
          class="icon2-error sel-icon-reset"
          @tap="clearNameSearch"/>
      </div>
    </div>
    <!-- 首页层 -->
    <!-- 首页显示，搜索时候隐藏 -->
    <ul
      v-if="index"
      v-show="!nameSearch"
      :class="{'mt': cache.length === 0}"
      class="sel-member-list">
      <div class="organization">
        <v-touch
          class="sel-member-info organization-inner relative"
          @tap="goNext">
          <div class="sel-member-avatar department">
            <img src="../../../assets/img/department.svg">
          </div>
          <div
            class="sel-member-name">
            组织结构
          </div>
          <i class="icon2-arrow-right-small arrow right department-right"/>
        </v-touch>
      </div>
      <li
        v-if="!singleSelect"
        class="all-select">
        <v-touch
          class="sel-member-info"
          @tap="allIndex">
          <div
            :class="{'sel-selected': allIndexSelect}"
            class="sel-member-icon">
            <div class="sel-icon-selected-bg" />
            <i class="icon2-selected sel-icon-selected"/>
          </div>
          <div
            class="sel-member-name all-name">
            全选
          </div>
        </v-touch>
      </li>
      <v-touch
        v-for="member in localList"
        :key="member.id"
        tag="li"
        @tap="changeSelect(member, !member.isSelected)">
        <v-touch class="sel-member-info">
          <div
            :class="{'sel-selected': member.isSelected}"
            class="sel-member-icon">
            <div class="sel-icon-selected-bg" />
            <i class="icon2-selected sel-icon-selected"/>
          </div>
          <div class="sel-member-avatar">
            <avatar
              :src="member.avatar"
              :username="member.name"
              :size="36"
              :round-radius="'2px'"
              :background-color="'#4A90E2'"/>
          </div>
          <div
            :class="{'sel-disabled': member.isDisabled}"
            class="sel-member-name">
            {{ member.name }}
          </div>
        </v-touch>
        <div class="sel-member-tag">
          {{ member.isCreator ? '创建者' : '' }}
        </div>
      </v-touch>
    </ul>
    <!-- 组织结构层 -->
    <!-- 有数据的时候(一般情况肯定有)并且非主页显示 -->
    <ul
      v-if="arr.length !== 0 && !index"
      v-show="!nameSearch"
      ref="man"
      class="sel-member-list">
      <!-- 导航条 -->
      <v-touch class="organization back-auto">
        <v-touch
          v-if="!index && !nameSearch"
          class="back organization-inner"
          tag="li">
          <v-touch
            tag="span"
            class="all-people"
            @tap="goIndex">
            所有成员
          </v-touch>
          <v-touch
            v-if="cache.length > 0"
            tag="span"
            class="all-people"
            @tap="back">
            <span class="b9b">
              /.../
            </span>
            返回上一级
          </v-touch>
          {{ '/' + newStaff.name }}
        </v-touch>
      </v-touch>
      <li
        v-if="!singleSelect"
        class="all-select">
        <v-touch
          class="sel-member-info"
          @tap="all">
          <div
            :class="{'sel-selected': allSelect}"
            class="sel-member-icon">
            <div class="sel-icon-selected-bg" />
            <i class="icon2-selected sel-icon-selected"/>
          </div>
          <div
            class="sel-member-name all-name">
            全选
          </div>
        </v-touch>
      </li>
      <!-- 正常人员 -->
      <v-touch
        v-for="member in newStaff.userList"
        v-if="member.orgUser"
        :key="member.id"
        tag="li"
        @tap="changeSelect(member, !member.isSelected)">
        <v-touch class="sel-member-info">
          <div
            :class="{'sel-selected': member.isSelected}"
            class="sel-member-icon">
            <div class="sel-icon-selected-bg" />
            <i class="icon2-selected sel-icon-selected"/>
          </div>
          <div class="sel-member-avatar">
            <avatar
              :src="member.avatar"
              :username="member.name"
              :size="36"
              :round-radius="'2px'"
              :background-color="'#4A90E2'"/>
          </div>
          <div
            :class="{'sel-disabled': member.isDisabled}"
            class="sel-member-name">
            {{ member.name }}
          </div>
        </v-touch>
        <div class="sel-member-tag">
          {{ member.isCreator ? '创建者' : '' }}
        </div>
      </v-touch>
      <!-- 未分配人员 -->
      <v-touch
        v-for="member in unDept.userList"
        v-if="member.orgUser && cache.length === 0"
        :key="member.id"
        tag="li"
        @tap="changeSelect(member, !member.isSelected)">
        <v-touch class="sel-member-info">
          <div
            :class="{'sel-selected': member.isSelected}"
            class="sel-member-icon">
            <div class="sel-icon-selected-bg" />
            <i class="icon2-selected sel-icon-selected"/>
          </div>
          <div class="sel-member-avatar">
            <avatar
              :src="member.avatar"
              :username="member.name"
              :size="36"
              :round-radius="'2px'"
              :background-color="'#4A90E2'"/>
          </div>
          <div
            :class="{'sel-disabled': member.isDisabled}"
            class="sel-member-name">
            {{ member.name }}
          </div>
        </v-touch>
        <div class="sel-member-tag">
          {{ member.isCreator ? '创建者' : '' }}
        </div>
      </v-touch>
      <!-- 部门列表 -->
      <li
        v-for="member in newStaff.childList"
        :key="member.id">
        <v-touch
          class="sel-member-info"
          @tap="changeSelectStaff(member)">
          <div class="sel-member-avatar">
            <img src="../../../assets/img/staff.svg">
          </div>
          <div
            class="sel-member-name">
            {{ member.name }}
          </div>
        </v-touch>
        <i class="icon2-arrow-right-small arrow right"/>
      </li>
    </ul>
    <ul
      v-show="nameSearch && filteredUsers.length > 0"
      class="sel-member-list mt">
      <v-touch
        v-for="member in filteredUsers"
        :key="member.id"
        tag="li"
        @tap="changeSelect(member, !member.isSelected)">
        <v-touch class="sel-member-info">
          <div
            :class="{'sel-selected': member.isSelected}"
            class="sel-member-icon">
            <div class="sel-icon-selected-bg" />
            <i class="icon2-selected sel-icon-selected"/>
          </div>
          <div class="sel-member-avatar">
            <avatar
              :src="member.avatar"
              :username="member.name"
              :size="36"
              :round-radius="'2px'"
              :background-color="'#4A90E2'"/>
          </div>
          <div
            :class="{'sel-disabled': member.isDisabled}"
            class="sel-member-name">
            {{ member.name }}
          </div>
        </v-touch>
        <div class="sel-member-tag">
          {{ member.isCreator ? '创建者' : '' }}
        </div>
      </v-touch>
    </ul>
    <div
      v-if="filteredUsers.length === 0 && nameSearch"
      class="sel-member-blank">
      <div>
        <img src="../../../assets/img/nopeople.svg">
      </div>
      <p>搜索无结果</p>
    </div>
    <div class="sel-footer">
      <div class="sel-footer-list-container">
        <ul class="sel-footer-list">
          <v-touch
            v-for="m in localSelectedList"
            :key="m.id"
            tag="li"
            @tap="changeSelect(m, false)">
            <avatar
              :src="m.avatar"
              :username="m.name"
              :size="34"
              :round-radius="'2px'"
              :background-color="'#4A90E2'"/>
          </v-touch>
        </ul>
      </div>
      <v-touch
        class="sel-footer-confirm"
        @tap="confirmSelect">
        确定({{ selectedCount }})
      </v-touch>
    </div>
  </div>
</template>

<script>
  import Avatar from 'com/pub/TextAvatar'

  export default{
    components: {
      'avatar': Avatar
    },
    data () {
      return {
        //  ------------------------------------------
        //  传入的参数，只读，不要修改
        btnText: '',
        idAttribute: '',
        nameAttribute: '',
        avatarAttribute: '',
        maximum: 0,    //  最多选择的用户数量
        memberList: [],    //  所有用户的列表
        selectedIdList: [],  //  默认选中的用户列表
        disabledIdList: [],  //  不可更改选择状态的用户id列表
        creatorIdList: [],  //  任务创建者的id列表
        success: function () {},  //  点击确定按钮的回调
        cancel: function () {},  //  点击取消按钮的回调
        //  -------------------------------------------
        //  选择框操作的临时存储对象
        localList: [],
        localSelectedList: [],
        nameSearch: '',
        singleSelect: false,
        realStaff: [],
        newStaff: [],
        cache: [],
        backName: '',
        arr: [],
        index: true,
        // 因为array无法set，因此只能分情况判断
        allSelect: false
      }
    },
    computed: {
      // 全部人员的全选判断
      allIndexSelect () {
        return this.localList.every(function (o) {
          return o.isSelected === true
        })
      },
      filteredUsers () {
        // 两套数据结构，搜索用最开始的无组织数据结构，正常显示用有组织、挂载了微信数据的数据结构
        return this.localList.filter(staff => {
          return staff.name.indexOf(this.nameSearch) !== -1
        })
      },
      selectedCount () {
        return this.localSelectedList.length
      },
      // 已分配
      hasDept () {
        return this.arr[0]
      },
      // 未分配
      unDept () {
        return this.arr[1]
      }
    },
    mounted () {
      var that = this
      this.cache = []
      this.makeLocalList()
      window.rsqadmg.exec('setTitle', {title: '编辑成员'})
      //  如果通过任意方式跳出页面了，那么关闭当前选择框
      window.onpopstate = () => {
        this.selfClose()
      }
      // 利用json方式深复制数组对象
      this.arr = JSON.parse(JSON.stringify(that.realStaff))
      // 数据挂载
      this.addObj(this.arr)
      // 拷贝保存已分配人员
      this.newStaff = {...this.hasDept}
      // 保存back部门名称
      this.backName = this.hasDept.name
      // 初始化层级标识
      this.index = true
    },
    methods: {
      // 非首页全选
      all () {
        var that = this
        if (this.allSelect === true) {
          if (that.cache.length === 0) {
            this.unDept.userList.map(function (o) {
              if (o.orgUser) {
                that.changeSelect(o, false)
              }
            })
          }
          this.newStaff.userList.map(function (o) {
            if (o.orgUser) {
              that.changeSelect(o, false)
            }
          })
          return
        }
        // 分有未分配部门无未分配部门情况
        if (that.cache.length === 0) {
          this.unDept.userList.map(function (o) {
            if (o.orgUser) {
              that.changeSelect(o, true)
            }
          })
        }
        this.newStaff.userList.map(function (o) {
          if (o.orgUser) {
            that.changeSelect(o, true)
          }
        })
      },
      allSelectChange (tag) {
        this.allSelect = tag
      },
      // 回归主页
      goIndex () {
        this.index = true
        this.cache = []
        this.newStaff = {...this.hasDept}
        window.rsqadmg.exec('setTitle', {title: '编辑成员'})
      },
      // 进入组织结构
      goNext () {
        this.index = false
        var tagUse = this.newStaff.userList.every(function (o) {
          if (o.orgUser) {
            return o.isSelected === true
          } else {
            return true
          }
        })
        var tagUnDept = this.unDept.userList.every(function (o) {
          if (o.orgUser) {
            return o.isSelected === true
          } else {
            return true
          }
        })
        this.allSelectChange(tagUse && tagUnDept)
        window.rsqadmg.exec('setTitle', {title: this.newStaff.name})
      },
      // 首页全选
      allIndex () {
        var that = this
        if (this.allIndexSelect === true) {
          this.localList.map(function (o) {
            that.changeSelect(o, false)
          })
          return
        }
        this.localList.map(function (o) {
          that.changeSelect(o, true)
        })
      },
      selfClose () {
        window.onpopstate = null
        this.cancel()
        this.$emit('self-close')
      },
      // 选择部门
      changeSelectStaff (member) {
        // 变动部门回滚开头
        document.body.scrollTop = document.documentElement.scrollTop = 0
        this.backName = this.newStaff.name
        window.rsqadmg.exec('setTitle', {title: member.name})
        // 缓存历史记录
        this.cache.push({...this.newStaff})
        this.newStaff = member
        var tag = member.userList.every(function (o) {
          if (o.orgUser) {
            return o.isSelected === true
          } else {
            return true
          }
        })
        this.allSelectChange(tag)
      },
      // 返回上一层
      back () {
        this.newStaff = this.cache.pop()
        // 分为上一层有无未分配部门的情况
        if (this.cache.length === 0) {
          var tagUse = this.newStaff.userList.every(function (o) {
            if (o.orgUser) {
              return o.isSelected === true
            } else {
              return true
            }
          })
          var tagUnDept = this.unDept.userList.every(function (o) {
            if (o.orgUser) {
              return o.isSelected === true
            } else {
              return true
            }
          })
          this.allSelectChange(tagUse && tagUnDept)
          window.rsqadmg.exec('setTitle', {title: this.newStaff.name})
        } else {
          this.backName = this.cache[this.cache.length - 1].name
          window.rsqadmg.exec('setTitle', {title: this.newStaff.name})
          var tag = this.newStaff.userList.every(function (o) {
            if (o.orgUser) {
              return o.isSelected === true
            } else {
              return true
            }
          })
          this.allSelectChange(tag)
        }
      },
      clearNameSearch () {
        this.nameSearch = ''
      },
      /**
       * 将memberList/selectedIdList/disabledIdList/creatorIdList整合成localList的对象格式。
       * localList中单个对象的格式如下：
       * {
       *   id: 123，
       *   name: 'aaa',
       *   avatar: 'xxxxx',
       *   isSelected: false,
       *   isDisabled: false,
       *   isCreator: false,
       *   orgUser: {}
       * }
       * 其中orgUser表示的是memberList中的原始对象的指针，用来方便获取用户的选择，不要修改原始对象中的数据！
       * @returns {any[]}
       */
      makeLocalList () {
        this.nameSearch = ''
        this.localSelectedList = []
        this.localList = this.memberList.map(mem => {
          const id = mem[this.idAttribute]
          const isSelect = this.selectedIdList.indexOf(id) !== -1
          const isDisabled = this.disabledIdList.indexOf(id) !== -1
          const isCreator = this.creatorIdList.indexOf(id) !== -1
          const obj = {
            id: id,
            name: mem[this.nameAttribute],
            avatar: mem[this.avatarAttribute],
            isSelected: isSelect,
            isDisabled: isDisabled,
            isCreator: isCreator,
            orgUser: mem
          }
          if (isSelect) {
            this.localSelectedList.push(obj)
          }
          return obj
        })
      },
      // 挂载数据
      addObj (arr) {
        var that = this
        for (let i = 0, lenI = arr.length; i < lenI; i++) {
          for (let j = 0, lenJ = arr[i].userList.length; j < lenJ; j++) {
            for (let k = 0, lenK = that.localList.length; k < lenK; k++) {
              if (arr[i].userList[j].id.toString() === that.localList[k].id) {
                // 三重循环数据挂载，绝对有优化的余地，但for性能比其他遍历性能要好，优化方向在于length的保存上与循环次数的减少上
                Object.assign(arr[i].userList[j], that.localList[k])
                break
              }
            }
          }
          if (Array.isArray(arr[i].childList)) {
            // 三重循环之后就是递归
            if (arr[i].childList.length !== 0) {
              that.addObj(arr[i].childList)
            }
          }
        }
      },
      // 两个数据结构联动
      changeSelectObj (arr, id, isSelect) {
        var that = this
        for (let i = 0, lenI = arr.length; i < lenI; i++) {
          if (arr[i].userList.length === 0) {
            continue
          }
          for (let j = 0, lenJ = arr[i].userList.length; j < lenJ; j++) {
            if (arr[i].userList[j].id === id) {
              arr[i].userList[j].isSelected = isSelect
              break
            } else if (id === null) {
              arr[i].userList[j].isSelected = isSelect
            }
          }
          if (arr[i].childList.length !== 0) {
            // 三重循环之后就是递归
            that.changeSelectObj(arr[i].childList, id, isSelect)
          }
        }
      },
      changeSelect (mem, isSelect) {
        var that = this
        if (!mem || mem.isDisabled) {
          return
        }
        if (this.selectedCount >= this.maximum && isSelect) {
          window.rsqadmg.exec('alert', {message: '超出最大数量限制'})
          return
        }
        if (mem.isSelected === isSelect) {
          return
        }
        if (this.singleSelect) {
          // 如果为单人，清除所有选项
          this.localList.map(function (o) {
            o.isSelected = false
          })
          this.changeSelectObj(that.arr, null, false)
        }
        mem.isSelected = isSelect
        if (isSelect === false) {
          // 如果有一个被取消，就单人
          this.allSelectChange(false)
        } else {
          var tag = this.newStaff.userList.every(function (o) {
            if (o.orgUser) {
              return o.isSelected === true
            } else {
              return true
            }
          })
          this.allSelectChange(tag)
        }
        this.changeSelectObj(that.arr, mem.id, isSelect)
        this.localList.map(function (o) {
          if (o.id === mem.id) {
            o.isSelected = isSelect
          }
        })
        if (isSelect) {
          if (this.singleSelect) {
            this.localSelectedList.map(function (o) {
              o.isSelected = false
            })
            // this.changeSelectObj(that.arr, null, false)
            // this.changeSelectObj(that.arr, mem.id, isSelect)
            this.localSelectedList = []
            this.localSelectedList.push(mem)
          } else {
            this.localSelectedList.push(mem)
          }
        } else {
          // 因为是双数据结构，因此不能用indexof
          for (let i = 0; i < this.localSelectedList.length; i++) {
            if (mem.id === this.localSelectedList[i].id) {
              this.localSelectedList.splice(i, 1)
              // this.allIndexSelect = false
              break
            }
          }
        }
      },
      confirmSelect () {
        const arr = this.localSelectedList.map(mem => {
          return mem.orgUser
        })
        this.success(arr)
        this.selfClose()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .sel-canvas {
    position: absolute;
    top: 0;right: 0;bottom: 0;left: 0;
    z-index: 10000;
    background: #f5f5f5;
    overflow:hidden;
    padding-bottom: 100px;
  }
  .sel-header {
    position: fixed;
    box-sizing: border-box;
    top: 0;right: 0;left:0;height: 51px;
    z-index: 10100;
    background: #F5F5F5;
    padding: 8px 10px;
    box-shadow: inset 0 0 0 0 #d4d4d4;
    // border-bottom: solid 1px #E0E0E0;
  }
  .sel-header:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .sel-footer {
    position: fixed;
    box-sizing: border-box;
    right: 0;bottom: 0;left:0;height: 51px;
    z-index: 10100;
    background: #FAFAFA;
    // border-top: solid 1px #D5D5D5;
  }
  .sel-footer:after{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .sel-search-wrap {
    position: relative;
    box-sizing: border-box;
    width: 100%;height: 100%;
    border-radius: 2px;
    background: #FFFFFF;
    border: solid 1px #D7DADE;
    padding: 2px 36px 2px 24px;
  }
  .sel-search {
    width: 100%;height: 100%;
  }
  .sel-icon-search {
    position: absolute;top: 8px;left: 5px;
  }
  .sel-icon-reset {
    position: absolute;top: 8px;right: 10px;color: #8D8D92;
  }
  .sel-footer-list-container {
    position: absolute;
    left: 0;top: 0;bottom: 0;right: 92px;
    white-space: nowrap;
    overflow-y: auto;
  }
  ul.sel-footer-list {
    height: 100%;
    display: inline-block;
  }
  ul.sel-footer-list li:last-child {
    margin-right: 10px;
  }
  ul.sel-footer-list li {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    margin-top: 8px;
  }
  .sel-footer-confirm {
    position: absolute;
    top: 0;right: 0;height: 50px;
    width: 92px;
    line-height: 50px;
    text-align: center;
    color: #5176AB;
    font-size: 18px;
    background: #FAFAFA;
  }
  ul.sel-member-list {
    background-color: #FFF;
    overflow: hidden;
    overflow-y: scroll;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    padding: 51px 0 51px;
    padding-top: 0;
    margin-top: 51px;
    position: relative;
    // border-top: 0.5px solid #d4d4d4;
    padding-bottom: 0;
    margin-bottom: 51px;
  }
  .sel-member-list:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  ul.sel-member-list li {
    position: relative;
    height: 57px;
    padding-left: 15px;
  }
  .sel-member-info {
    box-sizing: border-box;
    height: 100%;
    // border-bottom: solid 0.5px #D4D4D4;
    overflow: hidden;
  }
  .sel-member-info:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    margin-left: 15px;
  }
  .sel-member-info > * {
    float: left;
    height: 100%;
    line-height: 56px;
  }
  .sel-member-icon {
    float: right;
    margin-right: 15px;
    width: 15px;
    display: flex;
    align-items: center;
  }
  .sel-icon-selected-bg {
    box-sizing: border-box;
    position: absolute;
    top: 50%; margin-top: -8px;
    width: 16px;height: 16px;border-radius: 50%;
    border: solid 1px #DADADE;
    background: #FEFEFE;
  }
  .sel-selected .sel-icon-selected-bg {
    border: solid 1px #5684BA;
    background: #5684BA;
  }
  .sel-icon-selected {
    display: none;
    font-size: 10px;
    padding: 3px;
  }
  .sel-selected .sel-icon-selected {
    display: flex;
    color: #FFFFFF;
    position: relative;
    align-items: center;

  }
  .sel-member-avatar {
    box-sizing: border-box;padding: 10px;
    padding-left: 0;
  }
  .sel-member-name {
    font-size: 16px;
  }
  .sel-member-tag {
    position: absolute;
    top: 0;right: 0;height: 100%;
    padding-right: 45px;
    line-height: 56px;color: #4F77AA;
  }
  .sel-member-blank {
    margin: 100px auto 0;
    color: #9B9B9B;
    text-align: center;
  }
  .sel-member-blank i {
    font-size: 76px;
  }
  .sel-member-blank p {
    font-size: 14px;
  }
  .sel-disabled {
    color: #999999;
  }
  .back{
    // margin-top: 51px;
    height: auto !important;
    background-color: #fff;
    line-height: 36px;
    color:#9B9B9B;
    font-size: 14px;
    padding-left: 15px;
    // border-bottom: 0.5px solid #d4d4d4;
    // overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    position: relative;
    .all-people{
      color: #4F77AA
    }
  }
  .back-auto{
    height: auto !important;
    padding-bottom: 20px;
  }
    .back:after{
      content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    }
  ul.mt{
    margin-top: 51px;
  }
  .right{
    position: absolute;
    right: 15px;
    top: 0;
    height: 100%;
    line-height: 57px;
  }
  .organization{
    background-color: #f5f5f5;
    height: 77px;
    position: relative;
    // border-bottom: 0.5px solid #d4d4d4;
    .organization-inner{
      background-color: #fff;
      height: 56px;
      // border-bottom: 0.5px solid #d4d4d4;
    }
    .organization-inner:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    }

  }
  .organization:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .b9b{
    color: #9B9B9B
  }
  .department{
    padding-left: 15px;
    position: relative;
  }
  .department-right{
    top: auto;
  }
  ul.sel-member-list .all-select{
    height: 46px;
  }
  .all-name{
    line-height: 46px
  }
  .relative{
    position: relative;
  }
  li:last-child .sel-member-info:after{
    margin-left: 0;
  }
  .organization .sel-member-info:after{
    margin-left: 0;
  }
</style>
