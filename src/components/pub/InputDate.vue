<template>
	<div class="itm-outer">
		<v-touch class="itm-inner" @tap="showDatePikcer">
			<div class="riqi">
				日期
			</div>

			<div class="itm-icons itm-rear-icons u-abs-right">
				<span class="itm-note-text">{{ dateString }}</span>
			</div>
		</v-touch>
	</div>
</template>
<style lang="">
  .riqi{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    line-height: 21px;
    line-height: 45px;
  }
</style>
<script>
  import SelectDate from 'com/pub/SelectDate'
  import dateUtil from 'ut/dateUtil'

  export default {
    data () {
      return {}
    },
    props: {
      itemStartDate: String,
      itemEndDate: String,
      itemDates: String,
      itemSep: String
    },
    computed: {
      dateString () {
        if (!this.itemDates && !this.itemStartDate && !this.itemEndDate) {
          return ''
        }
        var parsed = dateUtil.backend2frontend(this.itemDates, this.itemStartDate, this.itemEndDate)
        var result = dateUtil.formatDateDisplay(parsed.dateType, parsed.dateResult)
        return result
      }
    },
    methods: {
      showDatePikcer () {
        // 显示之前先将所有获得焦点的元素失去焦点
        if (document.activeElement) {
          document.activeElement.blur()
        }
        var that = this
        var defDate = dateUtil.backend2frontend(this.itemDates, this.itemStartDate, this.itemEndDate)
        SelectDate.show({
          type: defDate.dateType,
          selectNumDate: defDate.dateResult,
          success: function (result) {
            var resObj = dateUtil.frontend2backend(result.type, result.selectNumDate, that.itemSep)
            that.$emit('date-changed', resObj)
          }
        })
      }
    }
  }
</script>
