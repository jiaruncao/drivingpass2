<template>
  <div class="question_main" @scroll="handleScroll">
    <div class="top_nav">
      <div class="go_back" @click="goBack">
        <u-icon name="arrow-leftward" size="20"></u-icon>
      </div>
      <div class="head_name" @click="settingOpen">Settings</div>
    </div>
    <div class="question_info">
      <div class="info_header">
        <div class="info_type">
          {{ startLearnQuestion.type }}
        </div>
        <div class="info_title">{{ startLearnQuestion.title }}</div>
      </div>
      <div class="info_file">
        <img :src="startLearnQuestion.file" alt="" />
      </div>
      <div class="info_option" v-if="startLearnQuestion.type == 'SCQ'">
        <div
          class="option_item"
          v-for="(item, i) in startLearnQuestion.options"
          :key="i"
          @click="selectOptionHandle(item, i)"
        >
          <div class="item_option" :style="handleOptionStyleBg(item)">
            {{ handleOptionStyleText(item, i) }}
          </div>
          <div class="item_title" :style="handleOptionStyle(item)">
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="info_option" v-if="startLearnQuestion.type == 'MCQ'">
        <div
          class="option_item"
          v-for="(item, i) in startLearnQuestion.options"
          :key="i"
          @click="mcqSelectQuestion(item)"
        >
          <div class="item_option" :style="mcqHandleOptionStyleBg(item)">
            {{ macqHandleOptionStyleText(item, i) }}
          </div>
          <div class="item_title" :style="macqHandleOptionStyle(item)">
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="info_option" v-if="startLearnQuestion.type == 'TOF'">
        <div
          class="option_item"
          v-for="(item, i) in startLearnQuestion.options"
          :key="i"
          @click="selectOptionHandle(item)"
        >
          <div class="item_option" :style="handleOptionStyleBg(item)">
            {{ handleOptionStyleText(item, i) }}
          </div>
          <div class="item_title" :style="handleOptionStyle(item)">
            {{ item.title }}
          </div>
        </div>
      </div>
      <template v-if="selectOption">
        <div class="your_select">
          Correct：
          <span class="success">{{
            String.fromCharCode(
              65 + startLearnQuestion.options.findIndex((e) => e.answer)
            )
          }}</span>
          Your choice：
          <span
            class="select"
            :style="{ color: selectOption.answer ? '#419FFF' : '#FF6666' }"
            >{{
              String.fromCharCode(
                65 +
                  startLearnQuestion.options.findIndex(
                    (e) => e.title == selectOption.title
                  )
              )
            }}</span
          >
        </div>
        <div class="question_title">Key point</div>
        <div class="question_ai">
          <div class="ai_title">
            <div class="title_img">
              <img src="static/index/ai.png" alt="" />
            </div>
            <div class="title_name">AI Explanation</div>
          </div>
          <div class="ai_content">
            This question tests the legal requirements for driving. Motorists
            must carry both the driver's license and vehicle registration. Thus,
            select 'Driver's License'. This question tests the legal
            requirements for driving. Motorists must carry both the driver's
            license and vehicle registration.
          </div>
        </div>
        <div class="diffculty">
          <div class="diff_title">Diffculty</div>
          <div class="diff_icon">
            <div class="icon_item" v-for="(item, i) in 5" :key="i">
              <u-icon
                name="star-fill"
                :color="i < 3 ? '#FFD556' : '#999999'"
                size="20"
              ></u-icon>
            </div>
          </div>
          <div class="diff_accuracy">Accuracy：41.3%</div>
        </div>
        <div class="shu"></div>
        <div class="forum_title">
          <span>-</span>Learners' Forum<span>-</span>
        </div>
        <div class="user_forum">Featured Comments</div>
        <div class="forum_list">
          <div class="forum_item" v-for="(item, i) in forumList" :key="i">
            <div class="item_header">
              <div class="header_avatar">
                <img :src="item.avatar" alt="" />
              </div>
              <div class="header_name">{{ item.name }}</div>
              <div
                class="header_thumbsUp"
                :style="{ color: item.isThumbsUp ? '#419FFF' : '#999999' }"
                @click="thumbsUpHandle(item)"
              >
                {{ item.thumbsUp > 999 ? 999 : item.thumbsUp }}
              </div>
              <div class="header_thumbsUp_icon" @click="thumbsUpHandle(item)">
                <u-icon
                  :name="item.isThumbsUp ? 'thumb-up-fill' : 'thumb-up'"
                  :color="item.isThumbsUp ? '#419FFF' : '#999999'"
                  size="20"
                ></u-icon>
              </div>
              <div class="header_disgusted" @click="setDislike(item)">
                <img
                  :src="
                    !item.isDisgusted
                      ? 'static/index/disgusted.png'
                      : 'static/index/CryingFace.png'
                  "
                  alt=""
                />
              </div>
            </div>
            <div class="item_content">{{ item.content }}</div>
            <div class="item_address">
              <div class="address_name">Belonging address：{{ item.ip }}</div>
              <div class="evaluate_reply" @click="handleReply(item)">Reply</div>
              <div class="evaluate_icon" @click="handleComment(item)">
                <u-icon name="more-dot-fill" color="#000" size="20"></u-icon>
              </div>
            </div>
            <div class="comment_section">Comment section</div>
            <div
              class="item_evaluate"
              v-for="(evaluate, e) in item.evaluate"
              :key="e"
            >
              <div class="evaluate_name">{{ evaluate.name }}：</div>
              <div class="evaluate_content">{{ evaluate.content }}</div>
              <div class="evaluate_icon" @click="handleComment(evaluate)">
                <u-icon name="more-dot-fill" color="#000" size="20"></u-icon>
              </div>
            </div>
            <div class="forum_hen"></div>
          </div>
        </div>
        <div class="add_comment" @click="handleReply(null)">Add Comment</div>
      </template>
    </div>
    <div class="bottom_nav">
      <div class="save_icon" @click="saveQuestion">
        <u-icon
          :name="startLearnQuestion.save ? 'star-fill' : 'star'"
          size="20"
          :color="startLearnQuestion.save ? '#ff9900' : '#000'"
        ></u-icon>
      </div>
      <div class="save_name" @click="saveQuestion">
        {{ startLearnQuestion.save ? "Saved" : "Save" }}
      </div>
      <div class="submit_test" @click="submitTest">Submit Test</div>
      <!-- <div class="success">
        <u-icon name="checkmark-circle-fill" color="#419FFF" size="20"></u-icon>
      </div>
      <div class="success_sum">16</div>
      <div class="error">
        <u-icon name="close-circle-fill" size="20" color="#FF6666"></u-icon>
      </div>
      <div class="error_sum">16</div> -->
      <div style="display: flex; margin-left: auto" @click="findAllQuestion">
        <div class="all_question_icon" size="20">
          <u-icon name="grid" size="20"></u-icon>
        </div>
        <div class="answer_sum">23</div>
        <div class="answer_all_sum">/1590</div>
      </div>
    </div>
    <u-popup
      :show="settingShow"
      mode="bottom"
      @close="closeSetting"
      :closeOnClickOverlay="true"
      :customStyle="{ backgroundColor: 'transparent' }"
    >
      <div class="setting_main bottom-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet_header">
          <div class="sheet-title">Practice Preferences</div>
          <div class="sheet-subtitle">Tailor how questions behave during your session</div>
        </div>
        <div class="setting_option">
          <div class="option_name">Auto-next when correct</div>
          <div class="option_switch">
            <u-switch
              v-model="settingQuery.autonext"
              @change="change"
            ></u-switch>
          </div>
        </div>
        <div class="setting_option">
          <div class="option_name">Streak Celebration</div>
          <div class="option_switch">
            <u-switch
              v-model="settingQuery.streakCelebration"
              @change="change"
            ></u-switch>
          </div>
        </div>
      </div>
    </u-popup>
    <u-popup
      :show="commentShow"
      mode="bottom"
      @close="closeComment"
      :closeOnClickOverlay="true"
      :customStyle="{ backgroundColor: 'transparent' }"
    >
      <div class="comment_main bottom-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet_header">
          <div class="sheet-title">Comment Feedback</div>
          <div class="sheet-subtitle">Choose how you'd like to handle this comment</div>
        </div>
        <div class="comment_actions">
          <div class="comment_button danger" @click="reportComment">Report Comment</div>
          <div class="comment_button ghost" @click="commentShow = false">Cancel</div>
        </div>
      </div>
    </u-popup>
    <u-popup
      :show="replyShow"
      mode="bottom"
      @close="closeReply"
      :closeOnClickOverlay="true"
      :customStyle="{ backgroundColor: 'transparent' }"
    >
      <div class="reply_main bottom-sheet">
        <div class="sheet-handle"></div>
        <div class="reply_header">
          <div>
            <div class="sheet-title">Write a reply</div>
            <div class="sheet-subtitle">Share your thoughts with the community</div>
          </div>
          <div class="reply_actions">
            <div class="pill ghost" @click="closeReply">Cancel</div>
            <div class="pill primary" @click="postReply">Post</div>
          </div>
        </div>
        <div class="content_input">
          <u--textarea
            v-model="replyQuery.content"
            placeholder="Add a comment..."
            class="reply_textarea"
          ></u--textarea>
        </div>
      </div>
    </u-popup>
    <allQuestion
      ref="allQuestionRef"
      :startLearnQuestion="startLearnQuestion"
    />
    <submitDetails ref="submitDetailsRef" @findAllQuestion="findAllQuestion" />
  </div>
</template>

<script>
import allQuestion from "@/components/allQuestions.vue";
import submitDetails from "@/components/submitDetails.vue";
export default {
  components: { allQuestion, submitDetails },
  data() {
    return {
      replyShow: false,
      commentShow: false,
      settingShow: false,
      settingQuery: { autonext: false, streakCelebration: false },
      replyQuery: {
        content: "",
      },
      questionI: 0,
      startLearnQuestion: {},
      selectOption: null,
      forumList: [
        {
          avatar:
            "https://img1.baidu.com/it/u=3505470809,2700212068&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
          name: "Jerry's Father",
          thumbsUp: 233,
          content:
            "Intentionally concealing a license plate is illegal.Intentionally concealing a license plate is illegal.",
          isThumbsUp: false,
          isDisgusted: false,
          ip: "California",
          evaluate: [
            {
              name: "Tom",
              content: "it's a nice day today",
            },
            {
              name: "Marry",
              content:
                "This question is too difficultThis question is too difficultThis question is too difficultThis question is too difficultThis question is too difficult",
            },
            {
              name: "Annie",
              content: "I feel very average",
            },
          ],
        },
        {
          avatar:
            "https://img1.baidu.com/it/u=3505470809,2700212068&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
          name: "Jerry's Mather ",
          thumbsUp: 1002,
          content: "Intentionally concealing a license plate is illegal.",
          isThumbsUp: true,
          isDisgusted: true,
          ip: "California",
          evaluate: [
            {
              name: "Tom",
              content: "it's a nice day today",
            },
            {
              name: "Marry",
              content: "This question is too difficult",
            },
            {
              name: "Annie",
              content: "I feel very average",
            },
          ],
        },
      ],
    };
  },
  onLoad(option) {
    this.startLearnQuestion =
      this.$store.state.learnModeQuestion.questions[option.questionI || 0];
    this.selectOption = this.startLearnQuestion.type == "MCQ" ? [] : null;
    // this.selectOption = this.startLearnQuestion.options[0];
  },
  methods: {
    /*
     * author：Gengbaodada
     * create by date：2025/07/27
     * content：提交试卷
     */
    submitTest() {
      this.$refs.submitDetailsRef.init();
    },
    /*
     * author：Gengbaodada
     * create by date：2025/07/27
     * content：查看所有试题
     */
    findAllQuestion() {
      this.$refs.allQuestionRef.init();
    },
    /*
     * author：Gengbaodada
     * create by date：2025/07/27
     * content：评论
     */
    handleReply(row) {
      this.replyShow = true;
    },
    postReply() {
      this.$utils.toast("Comment successful!");
      this.replyShow = false;
    },
    closeReply() {
      this.replyShow = false;
    },
    /*
     * author：Gengbaodada
     * create by date：2025/07/27
     * content：评论反馈
     */
    reportComment() {
      this.$utils.toast(
        "We have received your report, approved it, and will notify you immediately!"
      );
    },
    handleComment(row) {
      this.commentShow = true;
    },
    closeComment() {
      this.commentShow = false;
    },
    /*
     * author：Gengbaodada
     * create by date：2025/07/27
     * content：设置
     */
    closeSetting() {
      this.settingShow = false;
    },
    settingOpen() {
      this.settingShow = true;
    },
    /*
     * author：Gengbaodada
     * create by date：2025/07/27
     * content：设置讨厌
     */
    setDislike(item) {
      item.isDisgusted = !item.isDisgusted;
      if (item.isDisgusted) {
        this.$utils.toast("Setting dislike successfully!");
      } else {
        this.$utils.toast("Cancel dislike successfully!");
      }
    },
    /*
     * author：Gengbaodada
     * create by date：2025/07/27
     * content：点赞评论
     */
    thumbsUpHandle(item) {
      item.isThumbsUp = !item.isThumbsUp;
      if (item.isThumbsUp) {
        this.$utils.toast("Liked successfully!");
      } else {
        this.$utils.toast("Unsubscribed like successfully!");
      }
    },
    /*
     * author：Gengbaodada
     * create by date：2025/07/25
     * content：保存题目
     */
    saveQuestion() {
      this.startLearnQuestion.save = !this.startLearnQuestion.save;
      console.log("this.startLearnQuestion", this.startLearnQuestion);
      this.$utils.toast("Collected questions successfully！");
    },
    /*
     * author：Gengbaodada
     * create by date：2025/07/24
     * content：多选操作
     */
    mcqSelectQuestion(item) {
      this.selectOption.push(item);
    },
    mcqHandleOptionStyleBg(item) {
      if (this.selectOption.length > 0) {
        if (
          this.selectOption.some((obj) => obj.title === item.title) &&
          item.answer
        ) {
          return "background: #419FFF";
        } else {
          return item.answer ? "background: #419FFF" : "background: #FF6666";
        }
      }
    },
    macqHandleOptionStyleText(item, i) {},
    macqHandleOptionStyle(item) {},
    /*
     * author：Gengbaodada
     * create by date：2025/07/24
     * content：单选及判断题
     */
    handleOptionStyleText(item, i) {
      if (this.selectOption) {
        if (this.selectOption.title == item.title) {
          return this.selectOption.answer ? "✔" : "×";
        } else {
          return item.answer ? "✔" : String.fromCharCode(65 + i);
        }
      } else {
        return String.fromCharCode(65 + i);
      }
    },
    handleOptionStyleBg(item) {
      if (this.selectOption) {
        if (this.selectOption.title == item.title) {
          return this.selectOption.answer
            ? "background: #419FFF; color: #fff"
            : "background: #FF6666; color: #fff";
        } else {
          return item.answer
            ? "background: #419FFF; color: #fff"
            : "color: #000";
        }
      } else {
        return "";
      }
    },
    handleOptionStyle(item, i) {
      if (this.selectOption) {
        if (this.selectOption.title == item.title) {
          return this.selectOption.answer ? "color: #419FFF" : "color: #FF6666";
        } else {
          return item.answer ? "color: #419FFF" : "";
        }
      } else {
        return "";
      }
    },
    selectOptionHandle(item, i) {
      this.selectOption = item;
    },
    goBack() {
      const hasSelection = Array.isArray(this.selectOption)
        ? this.selectOption.length > 0
        : !!this.selectOption;

      if (!hasSelection) {
        uni.navigateBack({ delta: 1 });
        return;
      }

      uni.showModal({
        title: "Leave page?",
        content: "Are you sure you want to return to the previous page?",
        cancelText: "Stay",
        confirmText: "Leave",
        success: (res) => {
          if (res.confirm) {
            uni.navigateBack({ delta: 1 });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.question_main {
  padding-bottom: 127rpx;
  .add_comment {
    text-align: center;
    color: #999;
  }
  .bottom-sheet {
    background: linear-gradient(180deg, rgba(74, 158, 255, 0.18), rgba(248, 250, 252, 0.96));
    border-radius: 40rpx 40rpx 0 0;
    padding: 48rpx 40rpx calc(48rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
    box-shadow: 0 -24rpx 60rpx rgba(31, 71, 168, 0.2);
    backdrop-filter: blur(16px);
  }
  .sheet-handle {
    width: 120rpx;
    height: 10rpx;
    background: rgba(255, 255, 255, 0.75);
    border-radius: 999px;
    margin: 0 auto 36rpx;
    box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.35);
  }
  .sheet_header {
    margin-bottom: 36rpx;
  }
  .sheet-title {
    font-size: 34rpx;
    font-weight: 700;
    color: #0f172a;
  }
  .sheet-subtitle {
    font-size: 24rpx;
    color: #475569;
    margin-top: 10rpx;
  }
  .setting_main {
    .setting_option {
      display: flex;
      align-items: center;
      padding: 28rpx 24rpx;
      margin-bottom: 24rpx;
      border-radius: 28rpx;
      background: rgba(255, 255, 255, 0.88);
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.2);
      .option_name {
        font-weight: 600;
        font-size: 28rpx;
        color: #0f172a;
      }
      .option_switch {
        margin-left: auto;
      }
    }
    .setting_option:last-child {
      margin-bottom: 0;
    }
  }
  .comment_main {
    .comment_actions {
      display: flex;
      flex-direction: column;
      gap: 20rpx;
    }
    .comment_button {
      height: 92rpx;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 28rpx;
    }
    .comment_button.danger {
      background: linear-gradient(135deg, #f97316, #ef4444);
      color: #fff;
      box-shadow: 0 18rpx 36rpx rgba(239, 68, 68, 0.35);
    }
    .comment_button.ghost {
      background: rgba(148, 163, 184, 0.12);
      color: #475569;
      box-shadow: inset 0 0 0 2rpx rgba(148, 163, 184, 0.3);
    }
  }
  .reply_main {
    .reply_header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20rpx;
    }
    .reply_actions {
      display: flex;
      gap: 16rpx;
    }
    .pill {
      height: 72rpx;
      padding: 0 32rpx;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26rpx;
      font-weight: 600;
    }
    .pill.ghost {
      background: rgba(148, 163, 184, 0.12);
      color: #475569;
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.4);
    }
    .pill.primary {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #fff;
      box-shadow: 0 16rpx 30rpx rgba(37, 99, 235, 0.3);
    }
    .content_input {
      margin-top: 30rpx;
    }
    .reply_textarea {
      background: rgba(15, 23, 42, 0.04);
      border-radius: 24rpx;
      padding: 20rpx;
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.2);
    }
  }
  .forum_list {
    .forum_item {
      margin-bottom: 20rpx;
      .item_address {
        display: flex;
        font-weight: 400;
        font-size: 20rpx;
        color: #999999;
        padding: 0 0 20rpx 75rpx;
        .evaluate_icon {
          margin-left: auto;
        }
        .evaluate_reply {
          width: 97rpx;
          height: 33rpx;
          background: #f2f2f2;
          border-radius: 17rpx;
          text-align: center;
          margin: 0 0 0 10rpx;
        }
      }
      .comment_section {
        font-weight: 400;
        font-size: 28rpx;
        color: #333333;
        padding: 0 0 20rpx 75rpx;
      }
      .forum_hen {
        margin-top: 20rpx;
        width: calc(100% - 75rpx);
        margin-left: 75rpx;
        height: 1rpx;
        background: #d7d7d7;
      }
      .item_evaluate {
        display: flex;
        font-weight: 400;
        font-size: 20rpx;
        color: #999999;
        margin-bottom: 10rpx;
        .evaluate_content {
          width: 65%;
        }
        .evaluate_icon {
          margin-left: auto;
        }
        .evaluate_name {
          padding: 0 0 0 75rpx;
        }
      }
      .item_content {
        font-weight: 400;
        font-size: 28rpx;
        color: #333333;
        padding: 0 0 26rpx 75rpx;
      }
      .item_header {
        display: flex;
        .header_disgusted {
          padding: 28rpx 0 0 10rpx;
          img {
            width: 30rpx;
            height: 30rpx;
          }
        }
        .header_thumbsUp_icon {
          padding: 30rpx 10rpx 0 0;
        }
        .header_thumbsUp {
          padding: 30rpx 10rpx 0 0;
          margin-left: auto;
          font-weight: 400;
          font-size: 26rpx;
          color: #999999;
        }
        .header_name {
          padding: 30rpx 0 0 15rpx;
          font-weight: 400;
          font-size: 26rpx;
          color: #999999;
        }
        .header_avatar {
          padding: 23rpx 0 0 0;
          img {
            width: 60rpx;
            height: 60rpx;
            border-radius: 100%;
          }
        }
      }
    }
  }
  .user_forum {
    padding-top: 48rpx;
  }
  .forum_title {
    padding: 47rpx 0 0 0;
    text-align: center;
    font-weight: 400;
    font-size: 34rpx;
    color: #333333;
    span {
      padding: 0 20rpx;
    }
  }
  .shu {
    width: 100vw;
    margin-left: -30rpx;
    height: 14rpx;
    background: #f3f6f8;
  }
  .diffculty {
    display: flex;
    padding: 46rpx 0 40rpx 0;
    font-weight: 400;
    font-size: 26rpx;
    color: #333333;
    .diff_accuracy {
      margin-left: auto;
    }
    .diff_icon {
      margin-left: 10rpx;
      display: flex;
    }
  }
  .question_ai {
    width: 100%;
    min-height: 458rpx;
    background: #e7f5fe;
    border-radius: 16rpx;
    padding-bottom: 33rpx;
    .ai_content {
      margin-left: 27rpx;
      width: calc(100% - 54rpx - 66rpx);
      background: #fff;
      padding: 33rpx;
      border-radius: 16rpx;
    }
    .title_name {
      margin-left: 24rpx;
      font-weight: bold;
      font-size: 34rpx;
      color: #333333;
    }
    .ai_title {
      padding: 38rpx 27rpx;
      display: flex;
      img {
        margin-top: -3rpx;
        vertical-align: middle; /* 使图片和文字垂直居中 */
        width: 44rpx;
        height: 37rpx;
      }
    }
  }
  .question_title {
    font-weight: 400;
    font-size: 26rpx;
    color: #333333;
    margin: 33rpx 0 28rpx 0;
  }
  .your_select {
    font-weight: bold;
    font-size: 34rpx;
    color: #333333;
    height: 83rpx;
    background: #f3f6f8;
    line-height: 83rpx;
    border-radius: 4rpx;
    padding: 0 29rpx;
    .select {
      color: #ff6666;
    }
    .success {
      color: #419fff;
      margin: 0 30rpx 0 5rpx;
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
    .submit_test {
      margin-top: 28rpx;
      margin-left: 15rpx;
      width: 197rpx;
      height: 54rpx;
      background: #419fff;
      border-radius: 27rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #ffffff;
      text-align: center;
      line-height: 54rpx;
    }
    .all_question_icon {
      margin: 0 3rpx 0 30rpx;
      display: flex;
      justify-items: center;
    }
    .answer_sum {
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
    }
    .answer_all_sum {
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;
    }
    .error {
      margin-left: 30rpx;
      margin-right: 8rpx;
      display: flex;
      justify-items: center;
    }
    .error_sum {
      font-weight: 400;
      font-size: 28rpx;
      color: #ff6666;
    }
    .success {
      margin-right: 8rpx;
      margin-left: auto;
      display: flex;
      justify-items: center;
    }
    .success_sum {
      font-weight: 400;
      font-size: 28rpx;
      color: #419fff;
    }
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
  .question_info {
    padding: 0 30rpx;
    .info_option {
      margin-top: 35rpx;
      .option_item {
        margin-bottom: 30rpx;
        display: flex;
        flex-wrap: wrap;
        .item_title {
          flex: 1 1 10%;
          margin-left: 25rpx;
          font-weight: 400;
          font-size: 34rpx;
          color: #333333;
        }
        .item_option {
          width: 54rpx;
          height: 54rpx;
          background: #ffffff;
          box-shadow: 0rpx 3rpx 9rpx 1rpx rgba(207, 207, 207, 0.99);
          border-radius: 50%;
          text-align: center;
          line-height: 54rpx;
          font-weight: 400;
          font-size: 30rpx;
          color: #333333;
        }
      }
    }
    .info_file {
      margin-top: 20rpx;
      img {
        width: 100%;
        height: 300rpx;
      }
    }
    .info_header {
      position: relative;
      .info_title {
        text-indent: 100rpx;
        font-weight: 400;
        font-size: 34rpx;
        color: #333333;
        line-height: 40rpx;
      }
      .info_type {
        top: 7rpx;
        position: absolute;
        width: 88rpx;
        height: 33rpx;
        background: #419fff;
        border-radius: 8rpx 8rpx 8rpx 0rpx;
        font-weight: 400;
        font-size: 20rpx;
        color: #ffffff;
        text-align: center;
        line-height: 33rpx;
      }
    }
  }
  .top_nav {
    padding: 60rpx 30rpx;
    display: flex;
    .head_name {
      margin-left: auto;
      margin-top: -5rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
    }
  }
}
</style>
