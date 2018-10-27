<template>
  <div>
    <div class="btn-group" >
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_primary"
          href="javascript:;"
          @tap="openMemberSelector">
          打开选人框
        </v-touch>
      </div>
      <ul>
        <li
          v-for="i in selectedIdList"
          :key="i">
          {{ i }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import SelectMember from 'com/pub/SelectMember'

  export default {
    name: 'SelectMemberDemo',
    data () {
      return {
        memberList: [
          {
            id: 1,
            realName: '刘磊',
            avatar: 'http://shp.qpic.cn/bizmp/sfD9v8uDETrX0O6zM5Aw0nkDxHyPPc2oPB0qIc4GxQ3AjvZqdDjHwg/'
          },
          {
            id: 2,
            realName: '刘浩',
            avatar: 'http://p.qlogo.cn/bizmail/qnodhT7pdceG1TtIXWUXQM8aMzIBScW0ibT6DA4dakibDwuibK3mxVibicg/0'
          },
          {
            id: 3,
            realName: '刘镇武',
            avatar: null
          },
          {
            id: 4,
            realName: '曹德季',
            avatar: null,
            isCreator: false
          },
          {
            id: 5,
            realName: '毛文强',
            avatar: 'http://shp.qpic.cn/bizmp/sfD9v8uDETrX0O6zM5Aw0nkDxHyPPc2on1Ca5qsibmtE6b5lDhvY2TA/'
          },
          {
            id: 6,
            realName: '杨悦',
            avatar: 'http://wx.qlogo.cn/mmopen/1ThCvLbktqdibRGY9u6DRBoBibg0vvlqH1NsM2kiac9WVKLtuY3oJGbOibkuXt1HnfPaG5Ib2ehibpE0tSvT7M9zPhiaFibiaXibpqFap/0'
          }
        ],
        selectedIdList: [],
        disabledIdList: [5, 6],
        creatorIdList: [3]
      }
    },
    methods: {
      openMemberSelector () {
        console.log('====this: %o', this)
        const that = this
        SelectMember.show({
          nameAttribute: 'realName',
          memberList: this.memberList,
          selectedIdList: this.selectedIdList,
          disabledIdList: this.disabledIdList,
          creatorIdList: this.creatorIdList,
          success (selList) {
            console.log('selList: ' + JSON.stringify(selList))
            const arr = selList.map(m => {
              return m.id
            })
            console.log('====' + JSON.stringify(arr))
            that.selectedIdList = arr
            // var idArray = util.extractProp(selList, 'emplId')
            // that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId, idArray: idArray})
            //   .then(function (idMap) {
            //     that.selectedLocalList = util.getMapValuePropArray(idMap)
            //     that.$emit('member-changed', that.selectedLocalList)
            //   })
          },
          cancel () {
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
