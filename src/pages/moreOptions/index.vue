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
  max-height: 100vh;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  .btn {
    width: calc(100% - 60rpx);
    margin: 50rpx 30rpx;
    height: 86rpx;
    background: #419fff;
    border-radius: 8rpx;
    color: #ffffff;
    line-height: 86rpx;
    text-align: center;
  }
  .opeion_main {
    .option_item {
      margin: 100rpx 29rpx;
      display: flex;
      .item_value {
        margin-left: auto;
      }
      .item_icon {
        margin-left: 10rpx;
        margin-top: 8rpx;
      }
    }
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
