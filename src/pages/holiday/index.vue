<template>
  <div class="holiday-management clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>节假日配置</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="年份">
          <a-date-picker format="YYYY" mode="year" :allowClear="false" :value="year" :open="open" @openChange="openChange" @panelChange="panelChange" />
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="confirmClick">确定</a-button>
          <a-button @click="resetSelect">清空</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <div class="clx-show-scroll clx-flex-1 beauty-scroll">
      <div class="month-wrapper">
        <HolidayCalendar v-if="calendarShow" :selectDate="holidayDate['1']" @selectedDate="selectedDate" :year="selectedYear" :month="'1'"></HolidayCalendar>
        <HolidayCalendar v-if="calendarShow" :selectDate="holidayDate['2']" @selectedDate="selectedDate" :year="selectedYear" :month="'2'"></HolidayCalendar>
        <HolidayCalendar v-if="calendarShow" :selectDate="holidayDate['3']" @selectedDate="selectedDate" :year="selectedYear" :month="'3'"></HolidayCalendar>
        <HolidayCalendar v-if="calendarShow" :selectDate="holidayDate['4']" @selectedDate="selectedDate" :year="selectedYear" :month="'4'"></HolidayCalendar>
      </div>
      <div class="month-wrapper">
        <HolidayCalendar v-if="calendarShow" :selectDate="holidayDate['5']" @selectedDate="selectedDate" :year="selectedYear" :month="'5'"></HolidayCalendar>
        <HolidayCalendar v-if="calendarShow" :selectDate="holidayDate['6']" @selectedDate="selectedDate" :year="selectedYear" :month="'6'"></HolidayCalendar>
        <HolidayCalendar v-if="calendarShow" :selectDate="holidayDate['7']" @selectedDate="selectedDate" :year="selectedYear" :month="'7'"></HolidayCalendar>
        <HolidayCalendar v-if="calendarShow" :selectDate="holidayDate['8']" @selectedDate="selectedDate" :year="selectedYear" :month="'8'"></HolidayCalendar>
      </div>
      <div class="month-wrapper">
        <HolidayCalendar v-if="calendarShow" :selectDate="holidayDate['9']" @selectedDate="selectedDate" :year="selectedYear" :month="'9'"></HolidayCalendar>
        <HolidayCalendar v-if="calendarShow" :selectDate="holidayDate['10']" @selectedDate="selectedDate" :year="selectedYear" :month="'10'"></HolidayCalendar>
        <HolidayCalendar v-if="calendarShow" :selectDate="holidayDate['11']" @selectedDate="selectedDate" :year="selectedYear" :month="'11'"></HolidayCalendar>
        <HolidayCalendar v-if="calendarShow" :selectDate="holidayDate['12']" @selectedDate="selectedDate" :year="selectedYear" :month="'12'"></HolidayCalendar>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment"
import HolidayCalendar from "./holidayCalendar.vue";
import { HolidayDate, HolidaySet } from "@/services/api.js"
export default {
  components: { moment, HolidayCalendar },
  data() {
    return {
      selectedYear: new Date().getFullYear(),
      calendarShow: true,
      loading: false,
      holidayList: {},
      open: false,
      year: moment(),
      formInline: {
        dictName: ''
      },
      holidayDate: {}
    }
  },
  created() {
    this.setRouterCode("holiday");
    this.getHolidayDate();
  },
  methods: {
    // 选中的日期
    selectedDate(month, value) {
      this.holidayDate[month] = value;
      let selArr = [];
      for (let key in this.holidayDate) {
        let obj = {};
        let val = this.holidayDate[key].map(item => {
          return item.date;
        })
        obj[key] = val;
        selArr.push(obj)
      }
      this.holidayList = selArr;
    },

    //Ant Design封装年份选择组件
    openChange(status) {
      if (status) {
        this.open = true;
      } else {
        this.open = false;
      }
    },
    panelChange(value) {
      this.calendarShow = false;
      this.year = value;
      this.open = false;
      this.$nextTick(() => {
        this.selectedYear = moment(value).format('YYYY');
        this.calendarShow = true;
        this.getHolidayDate();
      })
    },
    // 获取默认的节假日日期
    getHolidayDate() {
      HolidayDate({ year: this.selectedYear }).then(res => {
        const data = res.data;
        this.holidayList = data;
        // 将后端返回的数据结构置换为前端需要的结构
        let date = {};
        for (let obj of data) {
          for (let key in obj) {
            let arr = []
            obj[key].forEach(item => {
              let mark = {};
              mark.className = "mark1";
              mark.date = item;
              arr.push(mark)
            })
            date[key] = arr;
          }
        }
        this.holidayDate = date;
      }).catch(err => {
        console.log(err);
      })
      // const data = [
      //   {
      //   "1":["2022/01/07","2022/01/09","2022/01/11"],
      //   },
      //   {
      //   "2":["2022/02/17","2022/02/19"],
      //   },
      //   {
      //   "3":["2022/03/23","2022/03/29"],
      //   },
      // ];
      // this.holidayList = data;
      // // 将后端返回的数据结构置换为前端需要的结构
      // let date = {};
      // for(let obj of data){
      //   for(let key in obj) {
      //     let arr = []
      //     obj[key].forEach(item=>{
      //       let mark = {};
      //       mark.className = "mark1";
      //       mark.date = item;
      //       arr.push(mark)
      //     })
      //     date[key] = arr;
      //   }
      // }
      // this.holidayDate = date;
    },
    // 确定
    confirmClick() {
      const params = {
        year: this.selectedYear,
        holidayList: this.holidayList
      }
      HolidaySet(params).then(res => {
        if (res.code == 20000) {
          this.$antMessage.success("操作成功");
          this.getHolidayDate();
        }
      }).catch(err => {
        console.log(err);
      })
    },
    //重置选中的日期
    resetSelect() {
      const _this = this;
      this.$antConfirm({
        title: '确认清空所有日期？',
        // content: h => <div>Some descriptions</div>,
        // icon: "redo",
        onOk() {
          const params = {
            year: _this.selectedYear,
            holidayList: []
          }
          HolidaySet(params).then(res => {
            if (res.code == 20000) {
              _this.$antMessage.success("操作成功");
              _this.getHolidayDate();
              _this.calendarShow = false;
              _this.$nextTick(() => {
                // _this.holidayDate = {};
                // _this.holidayList = []
                _this.calendarShow = true;
              })
            }
          }).catch(err => {
            console.log(err);
          })
        },
        onCancel() {
        },
      });
    },
  }
}
</script>
<style lang="less" scoped>
.holiday-management {
  // width: 100%;
  // min-width: 1200px;
  // overflow-x: auto;
  .month-wrapper {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
  }
}
</style>