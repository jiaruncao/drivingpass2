<template>
  <div class="highayw_main">
    <div class="top_nav">
      <div class="go_back" @click="goBack">
        <u-icon name="arrow-leftward" size="20"></u-icon>
      </div>
      <div class="head_name">{{ questionDetails.title }}</div>
      <div class="header_sum">Completed：{{ questionDetails.progress }}%</div>
    </div>
    <div class="question_details">
      <div class="info_title">
        {{ questionDetails.questions[questionsI].title }}
      </div>
      <div class="info_img">
        <img :src="questionDetails.questions[questionsI].img" alt="" />
      </div>
      <div class="info_content">
        {{ questionDetails.questions[questionsI].content }}
      </div>
    </div>
    <div class="question_sum_option">
      <div class="option_left" @click="lastQuestion">
        <u-icon name="arrow-left"></u-icon>
      </div>
      <div class="option_sum">
        {{ questionsI + 1 }} of {{ questionDetails.questions.length }}
      </div>
      <div class="option_right" @click="nextQuestion">
        <u-icon name="arrow-right"></u-icon>
      </div>
    </div>
    <div class="read_btn">Readed</div>
    <div class="bottom_nav">
      <div class="save_icon" @click="saveQuestion">
        <u-icon
          :name="
            questionDetails.questions[questionsI].isCollect
              ? 'star-fill'
              : 'star'
          "
          size="20"
          :color="
            questionDetails.questions[questionsI].isCollect ? '#ff9900' : '#000'
          "
        ></u-icon>
      </div>
      <div class="save_name" @click="saveQuestion">
        {{ questionDetails.questions[questionsI].isCollect ? "Saved" : "Save" }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questionsI: 0,
      questionDetails: {},
    };
  },
  onShow() {
    this.questionDetails = this.$store.state.learnModeQuestion;
  },
  methods: {
    /*
     * author：Gengbaodada
     * create by date：2025/07/28
     * content：上一题下一题
     */
    lastQuestion() {
      if (this.questionsI == 0) {
        return this.$utils.toast("It’s already the first question!");
      } else {
        this.questionsI--;
      }
    },
    nextQuestion() {
      if (this.questionsI == this.questionDetails.questions.length - 1) {
        return this.$utils.toast("This is already the last question!");
      } else {
        this.questionsI++;
      }
    },
    /*
     * author：Gengbaodada
     * create by date：2025/07/25
     * content：保存题目
     */
    saveQuestion() {
      this.questionDetails.questions[this.questionsI].isCollect =
        !this.questionDetails.questions[this.questionsI].isCollect;
      this.$utils.toast("Collected questions successfully！");
    },
    goBack() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="scss" scoped>
.highayw_main {
  padding-bottom: 127rpx;
  .read_btn {
    width: calc(100% - 420rpx);
    margin: 30rpx 210rpx;
    height: 84rpx;
    background: #ffffff;
    border-radius: 42rpx;
    border: 1px solid #419fff;
    font-weight: 400;
    font-size: 28rpx;
    color: #419fff;
    text-align: center;
    line-height: 84rpx;
  }
  .question_sum_option {
    display: flex;
    margin-top: 80rpx;
    .option_right {
      width: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .option_sum {
      width: 40%;
      text-align: center;
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;
    }
    .option_left {
      width: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .question_details {
    .info_content {
      padding: 20rpx 32rpx;
      font-weight: 400;
      font-size: 32rpx;
      color: #333333;
    }
    .info_img {
      width: calc(100% - 220rpx);
      margin: 0 110rpx;
      img {
        width: 100%;
        height: auto;
      }
    }
    .info_title {
      padding: 80rpx 32rpx;
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
    }
  }
  .bottom_nav {
    width: calc(100vw - 60rpx);
    display: flex;
    position: fixed;
    bottom: 0;
    height: 107rpx;
    line-height: 107rpx;
    border-top: 1px solid #d7d7d7;
    padding: 0 30rpx;
    background: #fff;
    z-index: 9;
    .save_name {
      margin-left: 5rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
    }
    .save_icon {
      display: flex;
      justify-items: center;
      // padding: 42rpx 0;
    }
  }
  .top_nav {
    padding: 60rpx 30rpx;
    display: flex;
    .header_sum {
      margin-left: auto;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
    }
    .head_name {
      width: 55%;
      margin-top: -5rpx;
      margin-left: 28rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
      white-space: nowrap; /* 防止换行 */
      overflow: hidden; /* 隐藏溢出部分 */
      text-overflow: ellipsis; /* 显示省略号 */
    }
  }
}
</style>
