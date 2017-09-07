<template>
	<div class="itm-edt z-index-xs">
		<div class="content">
			<div class="itm-edt-fields" style="padding-bottom: 80px;">
				<div class="itm-group" :class="{'itm--edit-todo': isCheckable}">
					<slot name="slotTitle"></slot>
				</div>
				<div class="itm-group itm--edit-todo" :class="{'is-hidden': !isShowNote}">
					<slot name="slotNote"></slot>
				</div>
				<div class="itm-group itm--edit-todo itm--part-line">
					<slot name="slotContainer"></slot>
					<slot name="slotDate"></slot>
					<slot name="slotMember"></slot>
					<!--<r-input-date></r-input-date>-->
					<!--<r-input-member></r-input-member>-->
					<!--<r-input-alarm></r-input-alarm>-->
					<!--<r-input-progress></r-input-progress>-->

					<slot name="slotSource"></slot>
					<!--<r-input-source></r-input-source>-->
					<!--<r-input-notify></r-input-notify>-->
					<!--<r-input-auth></r-input-auth>-->
				</div>
				<slot name="slotSourceCard"></slot>
				<!--<div class="itm-group itm&#45;&#45;edit-todo">-->
					<!--<r-sub-todo-list></r-sub-todo-list>-->
				<!--</div>-->
				<div class="itm-group itm--edit-todo">
					<slot name="slotComment"></slot>
					<!--<r-comment-list></r-comment-list>-->
				</div>
				<div class="itm-group">
					<slot name="slotCreateButton"></slot>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="scss">

</style>
<script>
  export default {
    data () {
      return {}
    },
    props: {
      isCheckable: Boolean,
      isShowNote: {
        type: Boolean,
        default: true
      }
    },
    methods: {
    },
    components: {},
    ready () {
    }
  }
</script>
