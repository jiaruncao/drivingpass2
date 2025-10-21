<template>
  <div class="more_option">
    <div class="top_nav">
      <div class="go_back" @click="goBack">
        <u-icon name="arrow-leftward" size="20"></u-icon>
      </div>
    </div>
    <div class="opeion_main">
      <div class="option_item" @click="selectQuestions">
        <div class="item_name">Select Question Quantity</div>
        <div class="item_value">
          {{ optionParams.testAllQuestions ? "All" : optionParams.questionSum }}
        </div>
        <div class="item_icon">
          <u-icon name="arrow-right" size="16"></u-icon>
        </div>
      </div>
      <div class="option_item">
        <div class="item_name">Test All Questions</div>
        <div class="item_value">
          <u-switch
            v-model="optionParams.testAllQuestions"
            @change="testAllQuestions"
          ></u-switch>
        </div>
      </div>
      <div class="option_item">
        <div class="item_name">Skip Correct Answers</div>
        <div class="item_value">
          <u-switch
            v-model="optionParams.skipCorrectAnswers"
            @change="skipCorrectAnswers"
          ></u-switch>
        </div>
      </div>
    </div>
    <div class="btn" @click="startExam">Start Exam</div>
    <u-picker
      :show="questionsShow"
      :columns="questionsSum"
      @cancel="closeQuestion"
      @confirm="subQuestion"
    ></u-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      optionParams: {
        questionSum: 20,
        testAllQuestions: false,
        skipCorrectAnswers: false,
      },
      questionsShow: false,
      questionsSum: [[10, 20, 30, 40, 50, 60]],
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
    console.log("option", option);
  },
  methods: {
    startExam() {
      this.$store.commit("saveMoreOptions", this.optionParams);
      this.$store.commit("saveLearnModeQuestion", this.questionType[0]);
      switch (this.testType) {
        case "1":
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
            url: "/pages/learnQuestion/index",
          });
          break;
        case "5":
          uni.navigateTo({
            url: "/pages/learnQuestion/index",
          });
          break;

        default:
          break;
      }
    },
    testAllQuestions(e) {
      this.optionParams.testAllQuestions = e;
    },
    skipCorrectAnswers(e) {
      this.optionParams.skipCorrectAnswers = e;
    },
    subQuestion(e) {
      this.optionParams.questionSum = e.value[0];
      this.questionsShow = false;
    },
    closeQuestion() {
      this.questionsShow = false;
    },
    selectQuestions() {
      this.questionsShow = true;
    },
    goBack() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="scss" scoped>
.more_option {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  background: #ffffff;
  overflow-x: hidden;
  overflow-y: auto;
  .btn {
    width: calc(100% - 60rpx);
    margin: 40rpx 30rpx 60rpx;
    background: #419fff;
    border-radius: 16rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 96rpx;
    font-weight: 600;
  }
  .opeion_main {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    padding: 40rpx 30rpx 0;
    .option_item {
      display: flex;
      align-items: center;
      gap: 20rpx;
      padding: 32rpx 24rpx;
      border-radius: 20rpx;
      background: #f6f8fb;
      min-height: 96rpx;
      .item_value {
        margin-left: auto;
        display: flex;
        align-items: center;
      }
      .item_icon {
        margin-left: 12rpx;
        margin-top: 0;
        display: flex;
        align-items: center;
      }
    }
  }
  .top_nav {
    padding: 60rpx 30rpx 40rpx;
    display: flex;
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8rpx);
    border-bottom: 2rpx solid rgba(0, 0, 0, 0.05);
    align-items: center;
    gap: 20rpx;
    .head_name {
      margin-left: auto;
      font-weight: 500;
      font-size: 28rpx;
      color: #333333;
    }
  }
}
</style>
