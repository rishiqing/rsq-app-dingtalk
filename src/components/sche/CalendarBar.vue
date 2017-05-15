<template>
	<div class="cal-bar" :style="{'left': barOffsetStyle}">
		<table class="cal-table">
			<tr>
				<td class="cal-weekday"
				    v-for="day in days"
            :key="day.date"
				    >
					<v-touch class="cal-day" @tap="calDayclick(day.date)"
                   :class="{'cal-day--focus': isHighLight(day.date)}">
            {{day.date.getDate()}}
          </v-touch>
        </td>
			</tr>
		</table>
	</div>
</template>
<script>
	export default{
		data(){
			return{};
		},
		props: {
			days: Array,
			barIndex: Number,
			highlightDay: Date
		},
		computed: {
			barOffsetStyle(){
				return (this.barIndex * 100) + '%';
			}
		},
		components:{},
		methods: {
			isHighLight(date){
				return this.highlightDay!=null && date.getTime() == this.highlightDay.getTime();
			},
			calDayclick(date){
				if(date.getTime() != this.highlightDay.getTime()){
					this.$emit('click-cal-bar-day', date);
				}
			}
		}
	};
</script>
<style lang="scss" scope>
  @import '../../assets/css/variables.scss';

  .cal-bar {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;display: inline-block;
  }
  .cal-table {
    border-collapse: collapse;
    text-align: center;
    border-spacing: 0;
    table-layout: fixed;
    width: 100%;
    height: 100%;
  }
  .cal-weekday {}
  .cal-day {margin:0 auto;width:30px;height:30px;line-height:30px;}
  .cal-day--focus {
    background:$mainColor;color:$bgColor;
    border-radius: 50%;
  }
</style>
