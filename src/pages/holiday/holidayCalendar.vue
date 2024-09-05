<template>
  <div class="mainBox">
    <Calendar :textTop="['日','一','二','三','四','五','六']" v-on:choseDay="clickDay" @changeMonth="changeMonth" ref="Calendar" :markDateMore="selectDate" :sundayStart="true"></Calendar>
  </div>
</template>

<script>
// import Calendar from 'vue-calendar-component';
import Calendar from '@/components/calendar';
export default {
  components: { Calendar },
  props: {
    year: {
      default: new Date().getFullYear()
    },
    month: {

    },
    selectDate: {
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    const month = this.year + '-' + this.month + '-1';
    this.$refs.Calendar.ChoseMonth(month, false)
  },
  methods: {
    //选中日期
    clickDay(today) {
      // today格式为2020/8/7 改为 20200807
      let existDate = this.selectDate;
      let isExist = true;
      for (var i = 0; i < existDate.length; i++) {
        if (existDate[i].date === today) {
          this.selectDate.splice(i, 1);
          isExist = false;
        }
      }
      if (isExist) {//当前日期存在移除
        let tempDate = { date: today, className: "mark1" }
        this.selectDate.push(tempDate)
      }
      this.$emit("selectedDate", this.month, this.selectDate)
    },
    // 当前月份不可选择下月或者上月的数据
    changeMonth(value) {
      const mm = value.split("/")[1];
      if (mm != this.month) {
        const month = this.year + '-' + this.month + '-1';
        this.$refs.Calendar.ChoseMonth(month, false)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.month-wrapper {
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
}
::v-deep .mark1 {
  color: white !important;
  background: #1890ff !important;
  border-radius: 50%;
}

.mainBox {
  // width: 295px;
  width: calc(100% / 4 - 5px);
  ::v-deep .wh_container {
    height: 100%;
  }
  ::v-deep .wh_content_all {
    /*主体*/
    background-color: #ffffff;
    border: 1px silver solid;
    border-radius: 5px;
    height: 100%;
    .wh_jiantou1 {
      /*左箭头*/
      border-top: 2px solid #000000;
      border-left: 2px solid #000000;
    }
    .wh_jiantou2 {
      /*右箭头*/
      border-top: 2px solid #000000;
      border-right: 2px solid #000000;
    }
    .wh_top_changge li {
      /*当前年月标题*/
      color: black;
    }
    .wh_top_changge li:first-child {
      /*左箭头*/
      display: none;
    }
    .wh_top_changge li:last-child {
      /*右箭头*/
      display: none;
    }
    .wh_content_item {
      margin-top: 5px;
      height: 30px;
      .wh_top_tag {
        /*星期标题*/
        color: #000000;
      }
      .wh_item_date {
        /*当前月*/
        color: #000000;
        width: 30px;
        height: 30px;
      }
      .wh_item_date:hover {
        //悬浮
        color: #1890ff;
        background: #ffffff;
        border-radius: 50%;
      }
      .wh_other_dayhide {
        /*上月和下月时间*/
        color: #bfbfbf;
      }
      .wh_chose_day {
        //选中
        background: #ffffff;
        color: #000000;
      }
      .wh_isToday {
        /*当前天*/
        /*background: #33ad53;*/
        background: #ff4d4d;
        color: #ffffff;
      }
    }
  }
}
</style>