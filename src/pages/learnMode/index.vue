<template>
  <div class="learn_mode">
    <div class="top_nav">
      <div class="go_back" @click="goBack">
        <u-icon name="arrow-leftward" size="20"></u-icon>
      </div>
      <div class="head_name">Learn Mode</div>
    </div>
    <div class="learn_title">Select Question Type</div>
    <div class="learn_mode_list">
      <div
        class="learn_item"
        v-for="(item, i) in questionType"
        :key="i"
        @click="selectLearnMode(item.id)"
      >
        <div class="item_select">
          <u-radio-group v-model="questionTypeI" placement="column">
            <u-radio
              :customStyle="{ marginBottom: '8px' }"
              label=""
              :name="item.id"
              size="20"
            >
            </u-radio>
          </u-radio-group>
        </div>
        <div class="item_content">
          <div class="content_name">{{ item.name }}</div>
          <div class="content_sum">
            <div class="sum_total">Total：{{ item.total }}</div>
            <div class="sum_wrong">Wrong：{{ item.wrong }}</div>
          </div>
        </div>
        <div class="item_progress">
          <div class="progress">
            <u-line-progress
              :percentage="item.progress"
              height="8"
              :showText="false"
              activeColor="#419FFF"
              inactiveColor="#D7D7D7 "
            ></u-line-progress>
          </div>
          <div class="percentage">{{ item.progress }} %</div>
        </div>
      </div>
    </div>
    <div class="btn" @click="startLearning">Start Learning</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questionTypeI: "0",
      questionType: [
        {
          id: "0",
          name: "Category 1",
          total: 124,
          wrong: 24,
          progress: 95,
          questions: [
            {
              type: "SCQ",
              file: "https://feed-image.baidu.com/0/pic/1030162599_-1991004900_1094354586.jpg",
              title:
                "Which document must you carry when driving a motor vehicle?",
              save: true,
              options: [
                {
                  title: "Employee ID",
                  answer: false,
                },
                {
                  title: "Driver's License",
                  answer: true,
                },
                {
                  title: "ID Card",
                  answer: false,
                },
                {
                  title: "Professional Certification",
                  answer: false,
                },
              ],
            },
            {
              type: "MCQ",
              file: "https://feed-image.baidu.com/0/pic/1030162599_-1991004900_1094354586.jpg",
              title:
                "Which document must you carry when driving a motor vehicle?",
              save: false,
              options: [
                {
                  title: "Employee ID",
                  answer: false,
                },
                {
                  title: "Driver's License",
                  answer: true,
                },
                {
                  title: "ID Card",
                  answer: true,
                },
                {
                  title: "Professional Certification",
                  answer: true,
                },
              ],
            },
            {
              type: "TOF",
              file: "https://feed-image.baidu.com/0/pic/1030162599_-1991004900_1094354586.jpg",
              title:
                "Which document must you carry when driving a motor vehicle?",
              save: false,
              options: [
                {
                  title: "Employee ID",
                  answer: true,
                },
                {
                  title: "Driver's License",
                  answer: false,
                },
              ],
            },
          ],
        },
        {
          id: "1",
          name: "Category 2",
          total: 235,
          wrong: 24,
          progress: 0,
          questions: [
            {
              type: "MCQ",
              file: "https://feed-image.baidu.com/0/pic/1030162599_-1991004900_1094354586.jpg",
              title:
                "Which document must you carry when driving a motor vehicle?",
              save: false,
              options: [
                {
                  title: "Employee ID",
                  answer: false,
                },
                {
                  title: "Driver's License",
                  answer: true,
                },
                {
                  title: "ID Card",
                  answer: true,
                },
                {
                  title: "Professional Certification",
                  answer: true,
                },
              ],
            },
            {
              type: "SCQ",
              file: "https://feed-image.baidu.com/0/pic/1030162599_-1991004900_1094354586.jpg",
              title:
                "Which document must you carry when driving a motor vehicle?",
              save: false,
              options: [
                {
                  title: "Employee ID",
                  answer: false,
                },
                {
                  title: "Driver's License",
                  answer: true,
                },
                {
                  title: "ID Card",
                  answer: false,
                },
                {
                  title: "Professional Certification",
                  answer: false,
                },
              ],
            },
            {
              type: "TOF",
              file: "https://feed-image.baidu.com/0/pic/1030162599_-1991004900_1094354586.jpg",
              title:
                "Which document must you carry when driving a motor vehicle?",
              save: false,
              options: [
                {
                  title: "Employee ID",
                  answer: true,
                },
                {
                  title: "Driver's License",
                  answer: false,
                },
              ],
            },
          ],
        },
        {
          id: "2",
          name: "Category 3",
          total: 564,
          wrong: 24,
          progress: 60,
          questions: [
            {
              type: "TOF",
              file: "https://feed-image.baidu.com/0/pic/1030162599_-1991004900_1094354586.jpg",
              title:
                "Which document must you carry when driving a motor vehicle?",
              save: false,
              options: [
                {
                  title: "Employee ID",
                  answer: true,
                },
                {
                  title: "Driver's License",
                  answer: false,
                },
              ],
            },
            {
              type: "SCQ",
              file: "https://feed-image.baidu.com/0/pic/1030162599_-1991004900_1094354586.jpg",
              title:
                "Which document must you carry when driving a motor vehicle?",
              save: false,
              options: [
                {
                  title: "Employee ID",
                  answer: false,
                },
                {
                  title: "Driver's License",
                  answer: true,
                },
                {
                  title: "ID Card",
                  answer: false,
                },
                {
                  title: "Professional Certification",
                  answer: false,
                },
              ],
            },
            {
              type: "MCQ",
              file: "https://feed-image.baidu.com/0/pic/1030162599_-1991004900_1094354586.jpg",
              title:
                "Which document must you carry when driving a motor vehicle?",
              save: false,
              options: [
                {
                  title: "Employee ID",
                  answer: false,
                },
                {
                  title: "Driver's License",
                  answer: true,
                },
                {
                  title: "ID Card",
                  answer: true,
                },
                {
                  title: "Professional Certification",
                  answer: true,
                },
              ],
            },
          ],
        },
        {
          id: "3",
          name: "Category 4",
          total: 332,
          wrong: 24,
          progress: 24,
          questions: [
            {
              type: "SCQ",
              file: "https://feed-image.baidu.com/0/pic/1030162599_-1991004900_1094354586.jpg",
              title:
                "Which document must you carry when driving a motor vehicle?",
              save: false,
              options: [
                {
                  title: "Employee ID",
                  answer: false,
                },
                {
                  title: "Driver's License",
                  answer: true,
                },
                {
                  title: "ID Card",
                  answer: false,
                },
                {
                  title: "Professional Certification",
                  answer: false,
                },
              ],
            },
            {
              type: "MCQ",
              file: "https://feed-image.baidu.com/0/pic/1030162599_-1991004900_1094354586.jpg",
              title:
                "Which document must you carry when driving a motor vehicle?",
              save: false,
              options: [
                {
                  title: "Employee ID",
                  answer: false,
                },
                {
                  title: "Driver's License",
                  answer: true,
                },
                {
                  title: "ID Card",
                  answer: true,
                },
                {
                  title: "Professional Certification",
                  answer: true,
                },
              ],
            },
            {
              type: "TOF",
              file: "https://feed-image.baidu.com/0/pic/1030162599_-1991004900_1094354586.jpg",
              title:
                "Which document must you carry when driving a motor vehicle?",
              save: false,
              options: [
                {
                  title: "Employee ID",
                  answer: true,
                },
                {
                  title: "Driver's License",
                  answer: false,
                },
              ],
            },
          ],
        },
      ],
      testType: null,
    };
  },
  onLoad(option) {
    this.testType = option.type;
  },
  methods: {
    startLearning() {
      let selectLearnMode = this.questionType.find(
        (e) => e.id == this.questionTypeI
      );
      this.$store.commit("saveLearnModeQuestion", selectLearnMode);
      switch (this.testType) {
        case "1":
          console.log("2222222");
          uni.navigateTo({
            url: "/pages/learnQuestion/index",
          });
          break;
        case "2":
          uni.navigateTo({
            url: "/pages/learnQuestion/index",
          });
          break;
        case "3":
          uni.navigateTo({
            url: "/pages/hazard/index",
          });
          break;
        case "4":
          uni.navigateTo({
            url: "/pages/highwayCode/index",
          });
          break;
        case "5":
          uni.navigateTo({
            url: "/pages/hazard/index",
          });
          break;

        default:
          break;
      }
    },
    selectLearnMode(e) {
      this.questionTypeI = e;
    },
    goBack() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="scss" scoped>
.learn_mode {
  .btn {
    width: calc(100% - 60rpx);
    margin: 117rpx 30rpx;
    height: 85rpx;
    background: linear-gradient(90deg, #67a6fe 0%, #4180ff 100%);
    border-radius: 43rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #ffffff;
    text-align: center;
    line-height: 85rpx;
  }
  .learn_mode_list {
    .learn_item {
      width: calc(100% - 60rpx);
      margin: 23rpx 30rpx;
      height: 148rpx;
      background: #dfefff;
      border-radius: 10rpx;
      display: flex;
      .item_progress {
        margin-right: 20rpx;
        width: 100rpx;
        margin-left: auto;
        .progress {
          margin-top: 50rpx;
        }
        .percentage {
          margin-top: 12rpx;
          font-weight: 400;
          font-size: 20rpx;
          color: #999999;
          text-align: center;
        }
      }
      .item_content {
        margin-top: 35rpx;
        .content_name {
          font-weight: bold;
          font-size: 28rpx;
          color: #419fff;
        }
        .content_sum {
          margin-top: 10rpx;
          display: flex;
          font-weight: 400;
          font-size: 22rpx;
          color: #333333;
          .sum_wrong {
            margin-left: 40rpx;
          }
        }
      }
      .item_select {
        padding: 56rpx 29rpx;
      }
    }
  }
  .learn_title {
    padding: 0 29rpx 20rpx 29rpx;
  }
  .top_nav {
    padding: 60rpx 30rpx;
    display: flex;
    .head_name {
      margin-top: -5rpx;
      margin-left: 28rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
    }
  }
}
</style>
