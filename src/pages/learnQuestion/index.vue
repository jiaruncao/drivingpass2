<template>
  <view class="app" :class="fontSizeClass">
    <!-- 极简头部 -->
    <view class="header">
      <view class="back-button" @tap="goBack">
        ←
      </view>
      <view style="flex: 1;"></view>
      <view class="settings-button" @tap="openSettings">Settings</view>
    </view>

    <!-- Settings 弹窗 -->
    <view class="settings-overlay" :class="{ active: showSettings }" @tap="closeSettings">
      <view class="settings-panel" @tap.stop>
        <view class="settings-header">
          <text class="settings-title">Settings</text>
          <view class="close-settings" @tap="closeSettings">
            <view class="close-icon">×</view>
          </view>
        </view>

        <!-- 设置选项 -->
        <view class="setting-item">
          <view class="setting-row">
            <text class="setting-label">Auto-advance to Next Question</text>
            <view class="toggle-switch" :class="{ active: settings.autoAdvance }" @tap="toggleAutoAdvance"></view>
          </view>
          <text class="setting-description">
            Automatically move to the next question after answering correctly
          </text>
        </view>

        <view class="setting-item">
          <view class="setting-row">
            <text class="setting-label">Voice Auto-read Questions</text>
            <view class="toggle-switch" :class="{ active: settings.voiceAutoRead }" @tap="toggleVoiceAutoRead"></view>
          </view>
          <text class="setting-description">
            Automatically read questions aloud when you navigate to them
          </text>
        </view>

        <view class="setting-item">
          <view class="setting-row">
            <text class="setting-label">Streak Celebration</text>
            <view class="toggle-switch" :class="{ active: settings.streakCelebration }" @tap="toggleStreakCelebration">
            </view>
          </view>
          <text class="setting-description">
            Show celebration animation when you get multiple correct answers in a row
          </text>
        </view>

        <view class="setting-item">
          <text class="setting-label">Font Size</text>
          <view class="font-size-slider">
            <view class="slider-container">
              <slider class="range-slider" :value="settings.fontSize * 25" :min="25" :max="100" :step="25"
                @change="onFontSizeChange" activeColor="#667eea" backgroundColor="#e5e7eb" block-color="#ffffff"
                block-size="28" />
            </view>
            <view class="slider-labels">
              <text class="slider-label">Small</text>
              <text class="slider-label">Medium</text>
              <text class="slider-label">Large</text>
              <text class="slider-label">Extra Large</text>
            </view>
          </view>
        </view>

        <view class="setting-item">
          <text class="setting-label">Theme</text>
          <view class="theme-options">
            <view class="theme-option" :class="{ active: settings.theme === 'light' }" @tap="setTheme('light')">
              <text class="theme-icon">☀️</text>
              <text class="theme-label">Light</text>
            </view>
            <view class="theme-option" :class="{ active: settings.theme === 'dark' }" @tap="setTheme('dark')">
              <text class="theme-icon">🌙</text>
              <text class="theme-label">Dark</text>
            </view>
            <view class="theme-option" :class="{ active: settings.theme === 'system' }" @tap="setTheme('system')">
              <text class="theme-icon">⚙️</text>
              <text class="theme-label">System</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 连续答对庆祝动画 -->
    <view v-if="showStreakCelebration" class="streak-celebration">🎉</view>

    <!-- 滑动容器 -->
    <swiper class="swipe-container" :current="currentQuestionIndex" @change="onSwiperChange" :duration="300">
      <!-- 每道题一个滑动页 -->
      <swiper-item v-for="(question, index) in questions" :key="index">
        <scroll-view scroll-y class="slide" @scroll="onScroll"
    :scroll-with-animation="true">
          <view class="question-page">
            <!-- 题目区域 -->
            <view class="question-section">
              <!-- 题目头部 -->
              <view class="question-header">
                <!-- 音频播放按钮 -->
                <button class="audio-button" :class="{ playing: playingIndex === index }" @tap="playAudio(index)">
                  <text class="audio-icon">🔊</text>
                </button>
                <!-- 题目文本 -->
                <text class="question-text">{{ question.title }}</text>
              </view>

              <!-- 题目图片 -->
              <view class="question-image" v-if="question.title_video_url">
                <image :src="question.title_video_url" mode=""></image>
              </view>
            </view>

            <!-- 选项列表 -->
            <view class="options-list" v-if="mode == 'learn'">
              <view v-for="(option, optIndex) in question.options_json" :key="optIndex" class="option-item" :class="optionClass(question, option)" @tap="selectOption(index, optIndex)">
                <view class="option-label">
                  <text
                    v-if="!question.showAnswer || ((question.selectedOption != option.key) && (option.key != question.answer))">{{ option.key }}</text>
                  <text v-else-if="option.key == question.answer" class="option-label-icon check">✓</text>
                  <text v-else-if="(question.selectedOption == option.key) && (option.key != question.answer)"
                    class="option-label-icon cross">✗</text>
                </view>
                <text class="option-text">{{ option.value }}  111</text>
              </view>
            </view>
            
            <!-- test模式，只出现选中的答案 -->
            <view class="options-list" v-if="mode == 'test'">
              <view v-for="(option, optIndex) in question.options_json" :key="optIndex" class="option-item" :class="optionClass(question, option)" @tap="selectOption(index, optIndex)">
                <view class="option-label">
                  <text>{{ option.key }}</text>
                  <!-- <text v-else-if="option.key == question.answer" class="option-label-icon check">✓</text>
                  <text v-else-if="(question.selectedOption == option.key) && (option.key != question.answer)"
                    class="option-label-icon cross">✗</text> -->
                </view>
                <text class="option-text">{{ option.value }}</text>
              </view>
            </view>
            
            <!-- Key Point - 极简设计，直接跟在选项后面 -->
            <view v-if="question.showAnswer && !isCorrectAnswer(question) && mode == 'learn' || hasAllAnswered" class="key-point-section">
              <text class="key-point-text">💡 {{ question.key_point }}</text>
            </view>

            <!-- AI解释 - 只在答错时显示 -->
            <view v-if="question.showAnswer && !isCorrectAnswer(question) && mode == 'learn' || hasAllAnswered" class="ai-explanation">
              <view class="ai-header">
                <view class="ai-avatar">
                  <text class="ai-avatar-icon">🤖</text>
                </view>
                <text class="ai-title">AI Explanation</text>
              </view>
              <view class="ai-content">
                <text>{{ question.explain }}</text>
                <text class="remember-tip">
                  <text class="strong" style="margin-right: 20rpx;">Remember:</text>
                  {{ question.rememberTip || 'Always check your mirrors and follow the Highway Code.' }}
                </text>
              </view>
            </view>

            <!-- 统计信息 - 只在答错时显示 -->
            <view v-if="question.showAnswer && !isCorrectAnswer(question) && mode == 'learn' || hasAllAnswered" class="stats-container">
              <view class="stat-card">
                <text class="stat-label">Difficulty Level</text>
                <view class="difficulty-visual">
                  <view v-for="i in 5" :key="i" class="difficulty-bar" :class="{ active: i <= question.difficulty }">
                  </view>
                </view>
              </view>
              <view class="stat-card">
                <text class="stat-label">Pass Rate</text>
                <view class="accuracy-visual">
                  <view class="accuracy-circle" :style="{ '--accuracy': Number(question.accuracy) }">
                    <text class="accuracy-value">{{ question.accuracy }}%</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- 社区评论区 - 只在答错时显示 -->
            <view v-if="question.showAnswer && !isCorrectAnswer(question) && mode == 'learn' || hasAllAnswered" class="comments-section">
              <view class="comments-header">
                <text>Community Discussion</text>
                <text class="comments-count">{{ question.comments ? question.comments.length : 0 }} comments</text>
              </view>

              <!-- 评论列表 -->
              <view v-for="(comment, cIndex) in question.displayedComments" :key="comment.id" class="comment-item">
                <!-- 精选标签 -->
                <view v-if="comment.featured" class="featured-badge">
                  <text>🌟 Featured</text>
                </view>

                <view class="comment-header">
                  <view class="comment-avatar">
                    <!-- <text>{{ comment.avatar }}</text> -->
                    <image v-if="comment.avatar" :src="comment.avatar" mode=""></image>
                    <view v-if="!comment.avatar">
                      {{getInitial(comment.nickname)}}
                    </view>
                  </view>
                  <view class="comment-info">
                    <text class="comment-username">{{ comment.nickname }}</text>
                    <text class="comment-meta">{{ comment.test_center }}</text>
                  </view>
                  <view class="comment-actions">
                    <button class="comment-like-button" :class="{ liked: comment.is_support }"
                      @tap="toggleCommentLike(comment)">
                      <u-icon v-if="!comment.is_support" name="heart" size="40rpx" color="#999"></u-icon>
                      <u-icon v-if="comment.is_support" name="heart-fill" size="40rpx" color="#FF6B6B"></u-icon>
                      <!-- <text class="comment-like-icon">{{ comment.is_support ? '❤️' : '🤍' }}</text> -->
                      <text class="comment-like-count">{{ comment.support_count }}</text>
                    </button>
                    <button class="comment-reply-button" @tap="replyToComment(comment)">
                      <!-- <text class="comment-reply-icon">💬</text> -->
                      <u-icon name="chat" size="40rpx"></u-icon>
                      <text class="comment-reply-label">Reply</text>
                    </button>
                  </view>
                </view>
                <text class="comment-text">{{ comment.content }}</text>

                <!-- 回复列表 - 只显示前2条 -->
                <!-- <view v-if="comment.first_reply" class="replies-container">
                  <view v-for="(reply, replyIndex) in comment.first_reply" :key="reply.id" class="reply-item">
                    <view class="reply-header">
                      <view class="reply-avatar">
                        <text>{{ reply.avatar }}</text>
                      </view>
                      <view class="reply-info">
                        <text class="reply-username">{{ reply.nickname }}</text>
                        <text class="reply-meta">{{ reply.test_center || 'Birmingham' }}</text>
                      </view>
                      <view class="reply-actions">
                        <button class="reply-like-button" :class="{ liked: reply.is_support }"
                          @tap="toggleReplyLike(comment, reply)">
                          <text class="reply-like-icon">{{ reply.is_support ? '❤️' : '🤍' }}</text>
                          <text class="reply-like-count">{{ reply.support_count || 0 }}</text>
                        </button>
                        <button class="comment-reply-button" @tap="replyToReply(comment, reply)">
                          <text class="comment-reply-label">Reply</text>
                        </button>
                      </view>
                    </view>
                    <text class="reply-text">{{ reply.content }}</text>
                  </view>

                  Load more replies - 超过2条时显示
                  <view v-if="comment.replies.length > 2 && !comment.showAllReplies" class="load-more-replies">
                    <text class="load-more-replies-text" @tap="loadMoreReplies(comment)">
                      View more replies ({{ comment.replies.length - 2 }} more)
                    </text>
                  </view>
                </view> -->
              </view>

              <!-- 加载更多评论 -->
              <!-- <view v-if="!question.showAllComments">
                <button v-if="question.comments.length > 3" class="view-more-button" @tap="showMoreComments(question)">
                  View More Comments ({{ question.comments.length - 3 }} more)
                </button>
              </view> -->

              <!-- 加载中提示 -->
              <view v-if="question.isLoadingComments" class="load-more-container">
                <view class="loading-spinner"></view>
              </view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" :class="{ 'comment-mode': showCommentInput }">
      <!-- 普通模式：显示Save和题号 -->
      <view v-if="!showCommentInput" class="save-section">
        <view class="save-button" :class="{ saved: currentQuestion && currentQuestion.collected }" @tap="toggleSave">
          <!-- <text class="save-icon">{{ currentQuestion && currentQuestion.collected ? '⭐' : '☆' }}</text> -->
          <u-icon name="star-fill" color="#6b7280" size="40rpx" v-if="currentQuestion && currentQuestion.collected"></u-icon>
          <u-icon name="star" color="#6b7280" size="40rpx" v-if="currentQuestion && !currentQuestion.collected"></u-icon>
          <text style="margin-left: 16rpx;">{{ currentQuestion && currentQuestion.collected ? 'Saved' : 'Save' }}</text>
        </view>
        <view class="question-counter" @tap="showQuestionList">
          {{ currentQuestionIndex + 1 }}/{{ totalQuestions }}
        </view>
      </view>

      <!-- 评论模式：显示评论输入框 -->
      <view v-else class="comment-input-bottom">
        <input type="text" class="comment-input-field" v-model="commentText" placeholder="Leave your comment..."
          @confirm="sendComment">
        <view class="send-button" @tap="sendComment">
          <text>➤</text>
        </view>
      </view>
    </view>

    <!-- 滑动提示 -->
    <view class="swipe-hint" v-if="showSwipeHint">Swipe left or right to navigate</view>
    
    
    <view v-if="showResult" class="result-modal">
      <view class="result-backdrop" @tap.stop></view>
      <view class="result-content completion-content">
        <view class="result-header completion-header">
          <view class="completion-icon">🎉</view>
          <view class="result-title">您已完成本章节学习</view>
          <view class="result-subtitle">是否重置再次学习？</view>
        </view>

        <view class="result-actions completion-actions">
          <button class="result-button reset-btn" @tap="resetLearning">
            重置学习
          </button>
          <button class="result-button home-btn" @tap="returnHome">
            返回主页
          </button>
        </view>
      </view>
    </view>
    
    
  </view>
</template>

<script>
  import {startTrain, collectAdd, collectCancel, wrongAdd, recordAdd} from '@/http/api/testQuestions.js'
  import {queryPostList, createPost, replyPost, supportPost} from '@/http/api/community.js'
  export default {
    data() {
      return {
        mode: 'learn', // 学习模式
        subject_id: null, // 科目id
        cate_id: null, // 分类id
        currentQuestionIndex: 0, // 当前题目索引（从0开始）
        totalQuestions: 0,
        playingIndex: null, // 正在播放音频的题目索引
        showSwipeHint: true, // 显示滑动提示
        showSettings: false, // 显示设置面板
        showStreakCelebration: false, // 显示连续答对庆祝
        correctStreak: 0, // 连续答对数
        commentText: '', // 评论输入
        showCommentInput: false, // 是否显示评论输入框
        // 设置选项
        settings: {
          autoAdvance: true, // 答对自动跳转
          voiceAutoRead: false, // 语音自动读题
          streakCelebration: true, // 连续答对庆祝
          fontSize: 2, // 字体大小 (1-4: small, medium, large, extra-large)
          theme: 'system' // 主题模式
        },
        // 题目数据数组
        questions: [],
        pid: null,
        showResult: false,
        hasAllAnswered: false // 是否全部答完，即是否是回顾
      }
    },
    computed: {
      // 当前题目
      currentQuestion() {
        return this.questions[this.currentQuestionIndex] || this.questions[0];
      },
      // 字体大小类名
      fontSizeClass() {
        const sizes = ['font-size-small', 'font-size-medium', 'font-size-large', 'font-size-extra-large'];
        return sizes[this.settings.fontSize - 1];
      }
    },
    watch: {
      currentQuestionIndex(newIndex) {
        if (this.mode !== 'learn') return;
        if (!this.subject_id || !this.cate_id) return;
        this.$utils.updateSubjectStorage('subjects', {
          subjectId: this.subject_id,
          cateId: this.cate_id
        }, {
          'current_question_index': newIndex
        });
      }
    },
    methods: {
      getInitial(username) {
        return username.charAt(0).toUpperCase();
      },
      onScroll(e) {
        // 只在答错时才需要切换评论输入框
        if (!this.currentQuestion.showAnswer || this.isCorrectAnswer(this.currentQuestion) || this.mode == 'test') {
          this.showCommentInput = false;
          return;
        }
        
        // 获取滚动位置
        const scrollTop = e.detail.scrollTop;
        const scrollHeight = e.detail.scrollHeight;
        const clientHeight = e.detail.clientHeight;
        
        // 判断是否滚动到评论区（页面下半部分）
        const scrollPercentage = scrollTop / scrollHeight;
        
        // 当滚动超过50%时显示评论输入框
        this.showCommentInput = scrollPercentage > 0.3;
        console.log(this.showCommentInput)
      },
      // 返回
      goBack() {
        const hasAnswered = Array.isArray(this.questions)
          ? this.questions.some((question) => {
              if (!question) {
                return false;
              }

              if (typeof question.showAnswer === 'boolean') {
                if (question.showAnswer) {
                  return true;
                }
              }

              if (Array.isArray(question.selectedOption)) {
                return question.selectedOption.length > 0;
              }

              return question.selectedOption !== undefined && question.selectedOption !== null;
            })
          : false;

        if (!hasAnswered) {
          uni.navigateBack();
          return;
        }

        uni.showModal({
          title: 'Leave page?',
          content: 'Are you sure you want to return to the previous page?',
          cancelText: 'Stay',
          confirmText: 'Leave',
          success: (res) => {
            if (res.confirm) {
              uni.navigateBack();
            }
          }
        });
      },
      // 打开设置
      openSettings() {
        this.showSettings = true;
      },
      // 关闭设置
      closeSettings() {
        this.showSettings = false;
      },
      // 切换自动前进
      toggleAutoAdvance() {
        this.settings.autoAdvance = !this.settings.autoAdvance;
      },
      // 切换语音自动读题
      toggleVoiceAutoRead() {
        this.settings.voiceAutoRead = !this.settings.voiceAutoRead;
        if (this.settings.voiceAutoRead) {
          this.readCurrentQuestion();
        }
      },
      // 切换连续答对庆祝
      toggleStreakCelebration() {
        this.settings.streakCelebration = !this.settings.streakCelebration;
      },
      // 设置主题
      setTheme(theme) {
        this.settings.theme = theme;
        this.applyTheme();
      },
      // 应用主题
      applyTheme() {
        // UniApp中主题切换需要通过全局样式或条件编译实现
        uni.setStorageSync('theme', this.settings.theme);
      },
      // 字体大小改变
      onFontSizeChange(e) {
        this.settings.fontSize = Math.round(e.detail.value / 25);
      },
      // Swiper切换
      onSwiperChange(e) {
        this.currentQuestionIndex = e.detail.current;
        
        // 记录当前题目
        this.$utils.updateSubjectStorage('subjects', {
          subjectId: this.subject_id,
          cateId: this.cate_id
        }, {
          'current_question_index': this.currentQuestionIndex
        });
        
        if (this.settings.voiceAutoRead) {
          this.readCurrentQuestion();
        }
      },
      // 播放音频
      playAudio(index) {
        if (this.playingIndex === index) {
          // 停止播放
          this.playingIndex = null;
        } else {
          // 开始播放
          this.playingIndex = index;
          // 使用UniApp的音频API
          const innerAudioContext = uni.createInnerAudioContext();
          innerAudioContext.src = '/static/audio/question.mp3'; // 音频文件路径
          innerAudioContext.play();
          innerAudioContext.onEnded(() => {
            this.playingIndex = null;
          });
          // 模拟播放结束
          setTimeout(() => {
            this.playingIndex = null;
          }, 3000);
        }
      },
      // 读当前题目
      readCurrentQuestion() {
        // UniApp中可以使用讯飞语音等插件实现
        console.log('Read question:', this.currentQuestion.text);
      },
      // 选择选项
      selectOption(questionIndex, optionIndex) {
        const question = this.questions[questionIndex];
        if (question.showAnswer) return;

        // 选择选项
        question.selectedOption = question.options_json[optionIndex].key;
        question.showAnswer = true;

        // 判断是否答对
        const isCorrect = question.options_json[optionIndex].key == question.answer;
        
        question.isCorrect = isCorrect;
        question.status = isCorrect ? 'correct' : 'incorrect';

        if (isCorrect) {
          // 答对了
          this.correctStreak++;
          
          // 移除本地错题
          this.removeWrong()
          
          this.$forceUpdate()
          // 显示连续答对庆祝
          if (this.settings.streakCelebration && this.correctStreak >= 3) {
            this.showStreakCelebration = true;
            setTimeout(() => {
              this.showStreakCelebration = false;
            }, 600);
          }

          // 自动跳转下一题
          if (this.settings.autoAdvance) {
            setTimeout(() => {
              if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
              }
            }, 1000);
          }

        } else {
          if (this.mode == 'learn') {
            // 查询评论
            this.queryPostList()
          } else {
            // test模式下，直接跳转下一题
            if (this.settings.autoAdvance) {
              setTimeout(() => {
                if (this.currentQuestionIndex < this.questions.length - 1) {
                  this.currentQuestionIndex++;
                }
              }, 1000);
            }
          }
          // 答错了，重置连续答对
          this.correctStreak = 0;
          // 加入错题
          this.wrongAdd()
          this.$forceUpdate()
        }
        
        this.recordAdd()
        
        // 如果答题答完
        const hasAllAnswered = this.questions.every(question => {
          return question.showAnswer
        });
        this.hasAllAnswered = hasAllAnswered;
        if (hasAllAnswered) {
          // 所有题目都答完了
          this.showResult = true;
        }
        
        // 缓存答题
        uni.setStorageSync('records', this.questions)
        // this.$forceUpdate()
      },
      resetLearning() {
        this.questions = this.questions.map(question => ({
          ...question,
          showAnswer: false,
          selectedOption: null,
          status: '',
          isCorrect: false
        }));
        this.correctStreak = 0;
        this.currentQuestionIndex = 0;
        this.hasAllAnswered = false;
        this.showResult = false;
        uni.setStorageSync('questions', this.questions);
        uni.setStorageSync('records', this.questions);
        if (this.mode === 'learn' && this.subject_id && this.cate_id) {
          this.$utils.updateSubjectStorage('subjects', {
            subjectId: this.subject_id,
            cateId: this.cate_id
          }, {
            'current_question_index': 0,
            'answerQuestions': []
          });
        }
      },
      returnHome() {
        this.showResult = false;
        uni.switchTab({
          url: '/pages/index/index'
        });
      },
      // 判断是否答对
      isCorrectAnswer(question) {
        if (question.selectedOption === null) return false;
        return question.selectedOption == question.answer;
      },
      optionClass (question, option) {
        if (this.mode == 'learn') {
          if (!question.showAnswer && question.selectedOption == option.key) {
            return 'selected'
          } else if (question.showAnswer && (option.key == question.answer)) {
            return 'correct'
          } else if (question.showAnswer && (question.selectedOption == option.key) && (option.key != question.answer)) {
            return 'incorrect'
          }
        } else if (this.mode == 'test') {
          if (question.showAnswer && question.selectedOption == option.key) {
            return 'selected'
          }
        }
      },
      // 切换评论点赞
      toggleCommentLike(comment) {
        this.supportPost(comment)
      },
      supportPost (comment) {
        supportPost({
          post_id: comment.id
        }).then(res => {
          comment.is_support = !comment.is_support;
          comment.support_count += comment.is_support ? 1 : -1;
          this.$forceUpdate()
        })
      },
      // 回复评论
      replyToComment(comment) {
        this.showCommentInput = true;
        this.pid = comment.id;
        this.commentText = `@${comment.nickname} `;
      },
      // 回复回复
      replyToReply(comment, reply) {
        this.showCommentInput = true;
        this.commentText = `@${reply.nickname} `;
      },
      // 切换回复点赞
      toggleReplyLike(comment, reply) {
        reply.is_support = !reply.is_support;
        if (!reply.likes) reply.likes = 0;
        reply.likes += reply.is_support ? 1 : -1;
      },
      // 加载更多回复
      loadMoreReplies(comment) {
        comment.showAllReplies = true;
      },
      // 显示更多评论
      showMoreComments(question) {
        question.showAllComments = true;
        // 模拟异步加载更多评论
        if (!question.isLoadingComments) {
          question.isLoadingComments = true;
          setTimeout(() => {
            question.isLoadingComments = false;
          }, 1000);
        }
      },
      // 发送评论
      sendComment() {
        if (!this.commentText.trim()) return;
        // 发送题目评论
        if (this.pid) {
          replyPost({
            post_id: this.pid,
            content: this.commentText.trim()
          }).then(res => {
            this.$utils.toast("Comment successful!");
            this.commentText = '';
            this.pid = null;
            this.showCommentInput = false;
            this.queryPostList()
          })
        } else {
          createPost({
            question_id: this.currentQuestion.id,
            content: this.commentText.trim(),
          }).then(res => {
            this.$utils.toast("Comment successful!");
            this.commentText = '';
            this.showCommentInput = false;
            this.queryPostList()
          })
        }
      },
      // 切换收藏状态
      toggleSave() {
        if (!this.currentQuestion.collected) {
          collectAdd({
            question_id: this.currentQuestion.id
          }).then(res => {
            console.log(res)
            this.currentQuestion.collected = true;
            // 缓存收藏
            this.$utils.updateSubjectStorage('subjects', {
              subjectId: this.subject_id,
              cateId: this.cate_id,
              questionId: this.currentQuestion.id
            }, {
              'collected': true
            });

            this.$forceUpdate()
          })
        } else {
          collectCancel({
            question_id: this.currentQuestion.id
          }).then(res => {
            console.log(res)
            this.currentQuestion.collected = false;
            this.$utils.updateSubjectStorage('subjects', {
              subjectId: this.subject_id,
              cateId: this.cate_id,
              questionId: this.currentQuestion.id
            }, {
              'collected': false
            });
            this.$forceUpdate()
          })
        }
      },
      // 显示题目列表
      showQuestionList() {
        this.showResult = false
        console.log('Show question list modal');
        // 可以导航到题目列表页面
        uni.navigateTo({
          url: '/pages/overview/overview?mode=' + this.mode
        })
      },
      // 初始化题目数据
      initQuestions() {
        const questions = uni.getStorageSync('questions')
        if (questions && questions.length) {
          this.questions = questions
          this.totalQuestions = questions.length
          uni.setStorageSync('records', this.questions)
        }
      },
      // 查询评论
      queryPostList () {
        queryPostList({
          question_id: this.currentQuestion.id
        }).then(res => {
          this.questions[this.currentQuestionIndex].comments = res.data.list.data
          this.questions[this.currentQuestionIndex].displayedComments = this.showAllComments ? this.questions[this.currentQuestionIndex].comments : this.questions[this.currentQuestionIndex].comments.slice(0, 3)
        })
      },
      // 移除错题
      removeWrong () {
        // 获取错题数组
        const subjects = uni.getStorageSync('subjects');
        if (!subjects) return;
        
        // 获取当前错题列表
        let wrongList = this.$utils.getWrongList(subjects, this.subject_id, this.cate_id);
        
        // 检查并添加错题
        const removed = this.$utils.removeWrongQuestionIfExists(
          subjects, 
          this.subject_id, 
          this.cate_id, 
          this.currentQuestion.id
        );
        
        if (removed) {
          // 更新缓存
          uni.setStorageSync('subjects', subjects);
        
          console.log('错题移除成功，当前错题数:', wrongList.length);
        }
      },
      // 新增错题
      addWrong () {
        // 获取错题数组
        const subjects = uni.getStorageSync('subjects');
        if (!subjects) return;
        
        // 获取当前错题列表
        let wrongList = this.$utils.getWrongList(subjects, this.subject_id, this.cate_id);
        
        // 检查并添加错题
        const added = this.$utils.addWrongQuestionIfNotExists(
          subjects,
          this.subject_id,
          this.cate_id,
          this.currentQuestion.id
        );
        
        if (added) {
          // 更新缓存
          uni.setStorageSync('subjects', subjects);
        
          console.log('错题添加成功，当前错题数:', wrongList.length);
        }
      },
      // 设置错题记录
      wrongAdd () {
        wrongAdd({
          question_id: this.currentQuestion.id,
          source: 'TRAINING',
          user_answer: this.currentQuestion.selectedOption
        }).then(res => {
          this.addWrong()
        })
      },
      addRecord () {
        // 获取记录数组
        const subjects = uni.getStorageSync('subjects');
        if (!subjects) return;

        // 检查并添加
        const added = this.$utils.addQuestionIfNotExists(
          subjects, 
          this.subject_id, 
          this.cate_id, 
          this.currentQuestion.id
        );
        
        if (added) {
          // 更新缓存
          uni.setStorageSync('subjects', subjects);
        }
      },
      recordAdd () {
        recordAdd({
          question_id: this.currentQuestion.id,
          result: this.currentQuestion.isCorrect
        }).then(res => {
          // 记录答题
          this.addRecord()
          // 记录当前题目
          this.$utils.updateSubjectStorage('subjects', {
            subjectId: this.subject_id,
            cateId: this.cate_id
          }, {
            'current_question_index': this.currentQuestionIndex
          });
        })
      }
    },
    onLoad(option) {
      // 判断模式
      this.mode = option.mode ? option.mode : 'learn'
      if (option.mode == 'test') {
        this.subject_id = option.subject_id
      } else {
        this.subject_id = option.subject_id
        this.cate_id = option.cate_id

        // 自动跳转到当前题目
        const subjects = uni.getStorageSync('subjects');

        if (subjects) {
          const savedIndex = this.$utils.getCurrentQuestionIndex(subjects, this.subject_id, this.cate_id)
          this.currentQuestionIndex = savedIndex >= 0 ? savedIndex : 0
        } else {
          this.currentQuestionIndex = 0
        }
      }
      
      // 初始化题目数据
      this.initQuestions();

      // 3秒后隐藏滑动提示
      setTimeout(() => {
        this.showSwipeHint = false;
      }, 3000);

      // 如果开启了语音自动读题，读第一题
      if (this.settings.voiceAutoRead) {
        this.readCurrentQuestion();
      }
      // 监听
      const _this= this
      uni.$on('chooseQuestion',function(data) {
        console.log(data)
        // 跳转到指定的题目
        _this.currentQuestionIndex = data.index
      })
    },
    onShow () {
      // 这里有一个判断是否是回顾
      const hasAllAnswered = this.questions.every(question => {
        return question.showAnswer
      });
      this.hasAllAnswered = hasAllAnswered
      if (this.hasAllAnswered) {
        this.showResult = true
      }
    }
  }
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* 全局样式 */
  page {
    height: 100vh;
    overflow: hidden;
    background: #ffffff;
  }

  .app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* 可调节字体大小的样式 */
  .font-size-small .question-text {
    font-size: 32rpx !important;
  }

  .font-size-small .option-text {
    font-size: 28rpx !important;
  }

  .font-size-small .ai-content {
    font-size: 28rpx !important;
  }

  .font-size-small .key-point-text {
    font-size: 28rpx !important;
  }

  .font-size-medium .question-text {
    font-size: 40rpx !important;
  }

  .font-size-medium .option-text {
    font-size: 32rpx !important;
  }

  .font-size-medium .ai-content {
    font-size: 32rpx !important;
  }

  .font-size-medium .key-point-text {
    font-size: 32rpx !important;
  }

  .font-size-large .question-text {
    font-size: 48rpx !important;
  }

  .font-size-large .option-text {
    font-size: 36rpx !important;
  }

  .font-size-large .ai-content {
    font-size: 36rpx !important;
  }

  .font-size-large .key-point-text {
    font-size: 36rpx !important;
  }

  .font-size-extra-large .question-text {
    font-size: 56rpx !important;
  }

  .font-size-extra-large .option-text {
    font-size: 40rpx !important;
  }

  .font-size-extra-large .ai-content {
    font-size: 40rpx !important;
  }

  .font-size-extra-large .key-point-text {
    font-size: 40rpx !important;
  }

  /* 极简头部 */
  .header {
    padding: 30rpx 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    position: relative;
    z-index: 100;
  }

  .back-button {
    background: none;
    border: none;
    color: #666;
    font-size: 20px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  }

  .back-button:active {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(0.95);
  }

  .back-arrow {
    width: 20px;
    height: 20px;
    stroke: #1a1a1a;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  body.dark-mode .back-arrow {
    stroke: #e5e5e5;
  }


  .settings-button {
    background: none;
    border: none;
    padding: 16rpx 24rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 500;
    color: #6b7280;
  }

  .settings-button:active {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(0.95);
  }

  /* Settings 弹窗 */
  .settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .settings-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }

  .settings-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-radius: 60rpx 60rpx 0 0;
    padding: 60rpx 50rpx 80rpx;
    z-index: 1001;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 80vh;
    overflow-y: auto;
  }

  .settings-overlay.active .settings-panel {
    transform: translateY(0);
  }

  /* Settings 头部 */
  .settings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 60rpx;
    padding-bottom: 40rpx;
    border-bottom: 2rpx solid #e5e7eb;
  }

  .settings-title {
    font-size: 48rpx;
    font-weight: 700;
    color: #1a1a1a;
  }

  .close-settings {
    background: none;
    border: none;
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-settings:active {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(0.95);
  }

  .close-icon {
    width: 48rpx;
    height: 48rpx;
    font-size: 48rpx;
    color: #6b7280;
    text-align: center;
    line-height: 48rpx;
  }

  /* Settings 选项 */
  .setting-item {
    margin-bottom: 60rpx;
  }

  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
  }

  .setting-label {
    font-size: 32rpx;
    font-weight: 600;
    color: #1a1a1a;
  }

  .setting-description {
    font-size: 26rpx;
    color: #6b7280;
    line-height: 1.4;
    margin-bottom: 30rpx;
    display: block;
  }

  /* Toggle Switch */
  .toggle-switch {
    width: 104rpx;
    height: 64rpx;
    background: #e5e7eb;
    border-radius: 32rpx;
    position: relative;
  }

  .toggle-switch.active {
    background: #667eea;
  }

  .toggle-switch::after {
    content: '';
    position: absolute;
    width: 52rpx;
    height: 52rpx;
    background: white;
    border-radius: 50%;
    top: 6rpx;
    left: 6rpx;
    transition: transform 0.3s ease;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
  }

  .toggle-switch.active::after {
    transform: translateX(40rpx);
  }

  /* Font Size Slider */
  .font-size-slider {
    margin-top: 30rpx;
  }

  .slider-container {
    position: relative;
    padding: 20rpx 0;
  }

  .range-slider {
    width: 100%;
    margin: 20rpx 0;
  }

  .slider-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;
  }

  .slider-label {
    font-size: 24rpx;
    color: #6b7280;
    font-weight: 500;
  }

  /* Theme Selector */
  .theme-options {
    display: flex;
    justify-content: space-between;
    margin-top: 30rpx;
  }

  .theme-option {
    flex: 1;
    padding: 24rpx;
    border: 4rpx solid #e5e7eb;
    border-radius: 24rpx;
    text-align: center;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20rpx;
  }

  .theme-option.active {
    border-color: #667eea;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  }

  .theme-icon {
    font-size: 48rpx;
    margin-bottom: 16rpx;
  }

  .theme-label {
    font-size: 26rpx;
    color: #6b7280;
    font-weight: 500;
  }

  .theme-option.active .theme-label {
    color: #667eea;
  }

  /* Streak Celebration Animation */
  @keyframes streak-celebration {
    0% {
      transform: scale(1) rotate(0deg);
    }

    25% {
      transform: scale(1.1) rotate(5deg);
    }

    50% {
      transform: scale(1.2) rotate(-5deg);
    }

    75% {
      transform: scale(1.1) rotate(5deg);
    }

    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  .streak-celebration {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 120rpx;
    z-index: 2000;
    animation: streak-celebration 0.6s ease;
    pointer-events: none;
  }

  /* 滑动容器 */
  .swipe-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .slide {
    width: 100%;
    height: 100%;
  }

  /* 题目内容容器 - 单页显示 */
  .question-page {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding: 40rpx;
    padding-bottom: 200rpx;
  }

  /* 题目区域 */
  .question-section {
    margin-bottom: 40rpx;
  }

  /* 题目头部 - 音频按钮和题目文本 */
  .question-header {
    display: flex;
    align-items: flex-start;
    gap: 30rpx;
    margin-bottom: 50rpx;
  }

  /* 音频播放按钮 */
  .audio-button {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    // background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    // box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.3);
    flex-shrink: 0;
  }

  .audio-button:active {
    transform: scale(0.95);
  }

  .audio-button.playing {
    animation: pulse-audio 1.5s infinite;
  }

  @keyframes pulse-audio {
    0% {
      box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.3);
    }

    50% {
      box-shadow: 0 8rpx 50rpx rgba(102, 126, 234, 0.5);
    }

    100% {
      box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.3);
    }
  }

  .audio-icon {
    font-size: 48rpx;
    color: white;
  }

  /* 题目文本 */
  .question-text {
    flex: 1;
    font-size: 40rpx;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.5;
    letter-spacing: -0.6rpx;
  }

  /* 题目图片 */
  .question-image {
    width: 100%;
    height: 400rpx;
    border-radius: 40rpx;
    overflow: hidden;
    margin-bottom: 50rpx;
    position: relative;
    // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    box-shadow: 0 20rpx 80rpx rgba(102, 126, 234, 0.15);
    
    > image {
      width: 100%;
      height: 100%;
    }
  }

  /* 3D驾驶场景 */
  .driving-scene {
    width: 100%;
    height: 100%;
    position: relative;
    background: linear-gradient(to bottom, #87CEEB 0%, #98D8E8 60%);
    overflow: hidden;
  }

  .road-perspective {
    position: absolute;
    bottom: 0;
    left: -50%;
    right: -50%;
    height: 240rpx;
    background: #4a4a4a;
    transform: perspective(400rpx) rotateX(40deg);
    transform-origin: bottom;
  }

  .road-markings {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12rpx;
    height: 100%;
    background: repeating-linear-gradient(to bottom,
        #ffffff 0rpx,
        #ffffff 40rpx,
        transparent 40rpx,
        transparent 80rpx);
  }

  .floating-sign {
    position: absolute;
    top: 60rpx;
    right: 60rpx;
    width: 100rpx;
    height: 100rpx;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    font-weight: bold;
    color: #ff4757;
    box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.2);
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {

    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-20rpx);
    }
  }

  /* 选项列表 */
  .options-list {
    display: flex;
    flex-direction: column;
    // gap: 24rpx;
  }

  .option-item {
    display: flex;
    align-items: center;
    padding: 36rpx;
    background: #f8f9fa;
    border-radius: 32rpx;
    border: 4rpx solid transparent;
    position: relative;
    margin-bottom: 24rpx;
  }

  .option-item:active {
    transform: scale(0.98);
  }

  .option-item.selected {
    background: white;
    border-color: #667eea;
    box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.15);
  }

  .option-item.correct {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-color: #22c55e;
  }

  .option-item.incorrect {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border-color: #ef4444;
  }

  /* 选项标签样式 - 直接显示对勾或错叉 */
  .option-label {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    margin-right: 28rpx;
    flex-shrink: 0;
    background: white;
    border-radius: 20rpx;
    font-size: 28rpx;
    position: relative;
  }

  .option-item.correct .option-label {
    background: #22c55e;
    color: white;
  }

  .option-item.incorrect .option-label {
    background: #ef4444;
    color: white;
  }

  .option-label-icon {
    position: absolute;
    font-size: 36rpx;
    font-weight: bold;
    display: none;
  }

  .option-item.correct .option-label-icon.check,
  .option-item.incorrect .option-label-icon.cross {
    display: block;
  }

  .option-text {
    flex: 1;
    font-size: 32rpx;
    color: #1a1a1a;
    line-height: 1.4;
    font-weight: 500;
  }

  /* Key Point - 极简设计，直接显示在选项后面 */
  .key-point-section {
    margin-top: 40rpx;
    padding: 0;
  }

  .key-point-text {
    font-size: 32rpx;
    color: #dc2626;
    line-height: 1.5;
    font-weight: 500;
    display: block;
  }

  /* AI解释 - 增强设计 */
  .ai-explanation {
    margin-top: 48rpx;
    padding: 56rpx;
    background: white;
    border-radius: 48rpx;
    box-shadow: 0 40rpx 120rpx rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }

  .ai-explanation::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 12rpx;
    background: linear-gradient(90deg,
        #667eea 0%,
        #764ba2 25%,
        #f093fb 50%,
        #f5576c 75%,
        #667eea 100%);
    background-size: 200% 100%;
    animation: gradient-shift 3s ease infinite;
  }

  @keyframes gradient-shift {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  .ai-header {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
  }

  .ai-avatar {
    width: 96rpx;
    height: 96rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 28rpx;
    box-shadow: 0 16rpx 48rpx rgba(102, 126, 234, 0.4);
    position: relative;
  }

  .ai-avatar-icon {
    font-size: 56rpx;
    color: white;
  }

  .ai-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #1a1a1a;
  }

  .ai-content {
    font-size: 32rpx;
    color: #374151;
    line-height: 1.8;
  }

  .ai-content .remember-tip {
    display: block;
    margin-top: 20rpx;
  }

  .ai-content .strong {
    color: #1a1a1a;
    font-weight: 600;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
  }

  /* 统计信息 - 卡片式设计 */
  .stats-container {
    margin-top: 48rpx;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32rpx;
  }

  .stat-card {
    padding: 40rpx;
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    border-radius: 40rpx;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .stat-label {
    font-size: 26rpx;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 2rpx;
    font-weight: 600;
    margin-bottom: 24rpx;
    position: relative;
    display: block;
  }

  .difficulty-visual {
    display: flex;
    justify-content: center;
    // gap: 12rpx;
    position: relative;
  }

  .difficulty-bar {
    width: 16rpx;
    height: 64rpx;
    background: #d1d5db;
    border-radius: 8rpx;
    transition: all 0.3s;
    margin-right: 12rpx;
  }

  .difficulty-bar.active {
    background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
    transform: scaleY(1.2);
  }

  .accuracy-visual {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    margin: 0 auto;
  }

  .accuracy-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(from 0deg,
        #667eea 0deg,
        #764ba2 calc(var(--accuracy) * 3.6deg),
        #e5e7eb calc(var(--accuracy) * 3.6deg));
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .accuracy-circle::before {
    content: '';
    position: absolute;
    top: 16rpx;
    left: 16rpx;
    right: 16rpx;
    bottom: 16rpx;
    border-radius: 50%;
    background: white;
  }

  .accuracy-value {
    font-size: 36rpx;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    color: transparent;
    position: relative;
    z-index: 1;
  }

  /* 评论区 */
  .comments-section {
    margin-top: 60rpx;
    background: white;
    border-radius: 40rpx;
    padding: 40rpx;
    box-shadow: 0 10rpx 36rpx rgba(0, 0, 0, 0.06);
    margin-bottom: 40rpx;
  }

  .comments-header {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 40rpx;
    padding-bottom: 30rpx;
    border-bottom: 2rpx solid #F5F5F5;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .comments-count {
    font-size: 28rpx;
    color: #999;
    font-weight: 400;
  }

  .comment-item {
    padding: 30rpx 0;
    border-bottom: 2rpx solid #F5F5F5;
  }

  .comment-item:last-child {
    border-bottom: none;
  }

  /* 精选评论标签 */
  .featured-badge {
    display: inline-flex;
    align-items: center;
    gap: 12rpx;
    background: linear-gradient(135deg, #FFB74D 0%, #FF9800 100%);
    color: white;
    padding: 6rpx 20rpx;
    font-size: 22rpx;
    font-weight: 600;
    border-radius: 16rpx;
    margin-bottom: 16rpx;
    box-shadow: 0 4rpx 16rpx rgba(255, 152, 0, 0.3);
    text-transform: uppercase;
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin-bottom: 24rpx;
  }

  .comment-avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 28rpx;
    flex-shrink: 0;
    > iamge {
      width: 72rpx;
      height: 72rpx;
      border-radius: 50%;
    }
  }

  .comment-info {
    flex: 1;
  }

  .comment-username {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 6rpx;
  }

  .comment-meta {
    font-size: 24rpx;
    color: #999;
  }

  .comment-actions {
    display: flex;
    align-items: center;
    gap: 30rpx;
  }

  .comment-like-button,
  .comment-reply-button {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 10rpx;
    padding: 10rpx;
  }

  .comment-like-button:active,
  .comment-reply-button:active {
    transform: scale(0.95);
  }

  .comment-like-icon,
  .comment-reply-icon {
    font-size: 36rpx;
  }

  .comment-like-count,
  .comment-reply-label {
    font-size: 28rpx;
    color: #666;
    font-weight: 500;
  }

  .comment-like-button.liked .comment-like-count {
    color: #FF6B6B;
  }

  .comment-text {
    font-size: 28rpx;
    line-height: 1.5;
    color: #333;
    padding-left: 96rpx;
  }

  /* 回复容器 */
  .replies-container {
    margin-top: 30rpx;
    padding-left: 40rpx;
    border-left: 4rpx solid #F0F0F0;
  }

  .reply-item {
    padding: 20rpx 0;
    border-bottom: 2rpx solid #F8F8F8;
  }

  .reply-item:last-child {
    border-bottom: none;
  }

  .reply-header {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 16rpx;
  }

  .reply-avatar {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24rpx;
    font-weight: 600;
    flex-shrink: 0;
  }

  .reply-info {
    flex: 1;
  }

  .reply-username {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 4rpx;
  }

  .reply-meta {
    font-size: 22rpx;
    color: #999;
  }

  .reply-actions {
    display: flex;
    align-items: center;
    gap: 24rpx;
  }

  .reply-like-button {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 8rpx;
  }

  .reply-like-button:active {
    transform: scale(0.95);
  }

  .reply-like-icon {
    font-size: 32rpx;
  }

  .reply-like-count {
    font-size: 26rpx;
    color: #666;
    font-weight: 500;
  }

  .reply-like-button.liked .reply-like-count {
    color: #FF6B6B;
  }

  .reply-text {
    font-size: 26rpx;
    color: #333;
    line-height: 1.4;
    padding-left: 76rpx;
  }

  /* Load more replies */
  .load-more-replies {
    margin-top: 20rpx;
    padding-left: 80rpx;
  }

  .load-more-replies-text {
    color: #4A9EFF;
    font-size: 26rpx;
    font-weight: 500;
  }

  .load-more-replies-text:active {
    opacity: 0.7;
  }

  /* View More 按钮 */
  .view-more-button {
    width: 100%;
    padding: 24rpx;
    background: white;
    border: 4rpx solid #4A9EFF;
    border-radius: 50rpx;
    color: #4A9EFF;
    font-size: 28rpx;
    font-weight: 600;
    margin-top: 24rpx;
  }

  .view-more-button:hover {
    background: #F8FBFF;
    border-color: #4A9EFF;
  }

  .view-more-button:active {
    transform: scale(0.98);
  }

  /* 加载更多评论 */
  .load-more-container {
    text-align: center;
    padding: 40rpx 0 20rpx;
  }

  .loading-spinner {
    display: inline-block;
    width: 40rpx;
    height: 40rpx;
    border: 6rpx solid #F0F0F0;
    border-top: 6rpx solid #4A9EFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  /* 底部操作栏 */
  .bottom-bar {
    position: fixed;
    bottom: 40rpx;
    left: 40rpx;
    right: 40rpx;
    background: white;
    padding: 32rpx 40rpx;
    box-shadow: 0 20rpx 80rpx rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 20;
    border-radius: 40rpx;
    backdrop-filter: blur(20rpx);
    background: rgba(255, 255, 255, 0.95);
  }

  /* 评论输入模式的底部栏 */
  .bottom-bar.comment-mode {
    padding: 24rpx 32rpx;
  }

  .bottom-bar.comment-mode .save-section {
    display: none;
  }

  .comment-input-bottom {
    display: flex;
    align-items: center;
    // gap: 24rpx;
    width: 100%;
  }

  .comment-input-field {
    flex: 1;
    padding: 24rpx 36rpx;
    background: #f8f9fa;
    border: 2rpx solid #e5e7eb;
    border-radius: 50rpx;
    font-size: 28rpx;
    outline: none;
    height: 100%;
    margin-right: 24rpx;
  }

  .comment-input-field:focus {
    background: white;
    border-color: #667eea;
    box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
  }

  .send-button {
    // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    border: none;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
    font-size: 40rpx;
    color: white;
  }

  .send-button:active {
    transform: scale(0.95);
  }

  .save-section {
    display: flex;
    align-items: center;
    gap: 40rpx;
    width: 100%;
    justify-content: space-between;
  }

  /* 收藏按钮 */
  .save-button {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    // gap: 16rpx;
    padding: 20rpx 32rpx;
    border-radius: 24rpx;
    font-weight: 600;
    color: #6b7280;
  }

  .save-button:active {
    transform: scale(0.95);
  }

  .save-button.saved {
    // color: #fbbf24;
  }

  .save-icon {
    font-size: 40rpx;
    margin-right: 16rpx;
  }

  /* ========================================
   请将以下代码添加到原文件中 font-size 那一行的位置
   替换掉不完整的 .question-counter 样式
   ======================================== */

  /* 题目计数器 - 集成到底部栏（完整版） */
  .question-counter {
    // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    color: white;
    padding: 20rpx 40rpx;
    border-radius: 50rpx;
    font-size: 32rpx;
    font-weight: 600;
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  }

  .question-counter:active {
    transform: scale(0.95);
  }

  /* 滑动提示器 */
  .swipe-hint {
    position: fixed;
    bottom: 200rpx;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24rpx;
    color: #9ca3af;
    opacity: 0;
    animation: fadeInOut 3s;
    pointer-events: none;
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  /* 夜间模式样式 - UniApp中可通过条件编译或动态类实现 */
  .dark-mode {
    background: #1a1a1a;
    color: #e5e5e5;
  }

  .dark-mode .header {
    background: #2a2a2a;
  }

  .dark-mode .back-arrow {
    border-color: #e5e5e5;
  }

  .dark-mode .settings-button {
    color: #9ca3af;
  }

  .dark-mode .question-text {
    color: #e5e5e5;
  }

  .dark-mode .option-item {
    background: #2a2a2a;
    color: #e5e5e5;
  }

  .dark-mode .option-text {
    color: #e5e5e5;
  }

  .dark-mode .bottom-bar {
    background: rgba(42, 42, 42, 0.95);
  }

  .dark-mode .save-button {
    color: #9ca3af;
  }

  .dark-mode .comment-input-field {
    background: #2a2a2a;
    border-color: #3a3a3a;
    color: #e5e5e5;
  }

  .dark-mode .comments-section {
    background: #2a2a2a;
  }

  .dark-mode .comment-text,
  .dark-mode .reply-text {
    color: #e5e5e5;
  }

  .dark-mode .settings-panel {
    background: #2a2a2a;
  }

  .dark-mode .settings-header {
    border-bottom-color: #3a3a3a;
  }

  .dark-mode .settings-title {
    color: #e5e5e5;
  }

  .dark-mode .close-settings:active {
    background: rgba(255, 255, 255, 0.1);
  }

  .dark-mode .close-icon {
    color: #9ca3af;
  }

  .dark-mode .setting-label {
    color: #e5e5e5;
  }

  .dark-mode .setting-description {
    color: #9ca3af;
  }

  .dark-mode .toggle-switch {
    background: #3a3a3a;
  }

  .dark-mode .slider-track {
    background: #3a3a3a;
  }

  .dark-mode .slider-label {
    color: #9ca3af;
  }

  .dark-mode .theme-option {
    background: #2a2a2a;
    border-color: #3a3a3a;
  }

  .dark-mode .theme-label {
    color: #9ca3af;
  }

  .dark-mode .key-point-label {
    color: #f87171;
  }

  .dark-mode .key-point-text {
    color: #fca5a5;
  }

  .dark-mode .ai-explanation {
    background: #2a2a2a;
    box-shadow: 0 40rpx 120rpx rgba(0, 0, 0, 0.3);
  }

  .dark-mode .ai-title {
    color: #e5e5e5;
  }

  .dark-mode .ai-content {
    color: #9ca3af;
  }

  .dark-mode .ai-content .strong {
    color: #e5e5e5;
    background: linear-gradient(135deg, rgba(254, 243, 199, 0.2) 0%, rgba(253, 230, 138, 0.2) 100%);
  }

  .dark-mode .stat-card {
    background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  }

  .dark-mode .stat-card::before {
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  }

  .dark-mode .stat-label {
    color: #9ca3af;
  }

  .dark-mode .difficulty-bar {
    background: #4a4a4a;
  }

  .dark-mode .difficulty-bar.active {
    background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
  }

  .dark-mode .accuracy-circle {
    background: conic-gradient(from 0deg,
        #667eea 0deg,
        #764ba2 calc(var(--accuracy) * 3.6deg),
        #3a3a3a calc(var(--accuracy) * 3.6deg));
  }

  .dark-mode .accuracy-circle::before {
    background: #2a2a2a;
  }

  .dark-mode .comments-header {
    color: #e5e5e5;
    border-bottom-color: #3a3a3a;
  }

  .dark-mode .comments-count {
    color: #9ca3af;
  }

  .dark-mode .comment-item {
    border-bottom-color: #3a3a3a;
  }

  .dark-mode .comment-username {
    color: #e5e5e5;
  }

  .dark-mode .comment-meta {
    color: #9ca3af;
  }

  .dark-mode .comment-like-count {
    color: #9ca3af;
  }

  .dark-mode .comment-reply-label {
    color: #9ca3af;
  }

  .dark-mode .replies-container {
    border-left-color: #3a3a3a;
  }

  .dark-mode .reply-item {
    border-bottom-color: #3a3a3a;
  }

  .dark-mode .reply-username {
    color: #e5e5e5;
  }

  .dark-mode .reply-meta {
    color: #9ca3af;
  }

  .dark-mode .reply-like-count {
    color: #9ca3af;
  }

  .dark-mode .view-more-button {
    background: #2a2a2a;
  }

  .dark-mode .view-more-button:hover {
    background: #3a3a3a;
  }

  .dark-mode .load-more-button {
    background: #2a2a2a;
  }

  .dark-mode .load-more-button:active {
    background: #3a3a3a;
  }

  .dark-mode .comment-input-field:focus {
    background: #3a3a3a;
  }

  /* 响应式优化 */
  @media screen and (max-width: 375px) {
    .question-text {
      font-size: 36rpx;
    }

    .option-text {
      font-size: 30rpx;
    }

    // .question-page {
    //   padding: 30rpx;
    // }
  }

  /* 平板适配 */
  @media screen and (min-width: 768px) {
    .question-page {
      max-width: 1200rpx;
      margin: 0 auto;
    }

    .options-list {
      max-width: 800rpx;
      margin: 0 auto;
    }

    .ai-explanation,
    .comments-section {
      max-width: 900rpx;
      margin-left: auto;
      margin-right: auto;
    }
  }

  /* iOS安全区域适配 */
  // .bottom-bar {
  //   padding-bottom: constant(safe-area-inset-bottom);
  //   padding-bottom: env(safe-area-inset-bottom);
  // }

  /* Android状态栏适配 */
  .header {
    padding-top: var(--status-bar-height);
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 6rpx;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3rpx;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* 防止文字选中 */
  .question-text,
  .option-text,
  .ai-content,
  .comment-text,
  .reply-text {
    -webkit-user-select: none;
    user-select: none;
  }

  /* 输入框可以选中 */
  .comment-input-field {
    -webkit-user-select: text;
    user-select: text;
  }

  /* 过渡动画优化 */
  view,
  text,
  button {
    transition-property: transform, opacity, background-color;
    transition-duration: 0.3s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 防止按钮点击出现蓝色高亮（iOS） */
  button {
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }

  /* 修复某些Android设备上的圆角问题 */
  .option-item,
  .ai-explanation,
  .comments-section,
  .bottom-bar {
    // -webkit-border-radius: inherit;
  }

  /* 确保图标垂直居中 */
  .audio-icon,
  .save-icon,
  .comment-like-icon,
  .comment-reply-icon,
  .reply-like-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }

  /* 修复某些设备上的flex布局问题 */
  .question-header,
  .comment-header,
  .reply-header,
  .comment-actions,
  .reply-actions {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
  }

  /* 性能优化：使用硬件加速 */
  .swipe-container,
  .slide,
  .floating-sign,
  .streak-celebration {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  /* 修复长文本溢出问题 */
  .question-text,
  .option-text,
  .comment-text,
  .reply-text,
  .ai-content {
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  /* 确保模态框在最上层 */
  .settings-overlay {
    z-index: 9999;
  }

  .settings-panel {
    z-index: 10000;
  }

  .streak-celebration {
    z-index: 10001;
  }

  /* 修复某些设备上渐变显示问题 */
  // .audio-button,
  // .question-counter,
  // .ai-avatar,
  // .accuracy-circle {
  //   background-image: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  //   background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  // }

  /* 确保底部栏始终在最上层（除了模态框） */
  .bottom-bar {
    z-index: 999;
  }

  /* 修复评论输入框焦点样式 */
  .comment-input-field:focus {
    outline: none;
    -webkit-appearance: none;
  }

  /* 防止iOS橡皮筋效果 */
  .swipe-container {
    -webkit-overflow-scrolling: touch;
  }

  /* 修复部分机型上的按钮点击区域 */
  button {
    position: relative;
    -webkit-tap-highlight-color: transparent;
  }

  button::before {
    content: '';
    position: absolute;
    top: -10rpx;
    left: -10rpx;
    right: -10rpx;
    bottom: -10rpx;
  }

  /* 优化加载动画性能 */
  .loading-spinner {
    will-change: transform;
  }

  /* 修复评论头像文字居中 */
  .comment-avatar text,
  .reply-avatar text {
    line-height: 1;
    display: block;
  }

  /* 最终样式结束 */
  uni-button:after {
    border: none;
  }
  
  /* 评论输入模式动画 */
  .bottom-bar.comment-mode {
    background: #f8f9fa;
    padding: 24rpx 32rpx;
  }
  
  .comment-input-bottom {
    display: flex;
    align-items: center;
    gap: 20rpx;
    width: 100%;
    animation: slideIn 0.3s ease;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20rpx);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .comment-input-field {
    flex: 1;
    padding: 20rpx 32rpx;
    background: white;
    border: 2rpx solid #e5e7eb;
    border-radius: 40rpx;
    font-size: 28rpx;
    transition: all 0.3s ease;
  }
  
  // 得分
  /* 结果弹窗 */
  .result-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  }
  
  .result-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
  }
  
  .result-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600rpx;
    background: white;
    border-radius: 30rpx;
    padding: 50rpx;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
  }

  .completion-header {
    text-align: center;
    margin-bottom: 40rpx;
  }

  .completion-icon {
    font-size: 90rpx;
    margin-bottom: 20rpx;
  }

  .result-title {
    font-size: 42rpx;
    font-weight: 600;
    color: #333;
  }

  .result-subtitle {
    margin-top: 12rpx;
    font-size: 28rpx;
    color: #666;
  }

  .result-actions {
    display: flex;
    gap: 30rpx;
  }

  .result-button {
    flex: 1;
    padding: 26rpx;
    border-radius: 50rpx;
    font-size: 28rpx;
    font-weight: 600;
    border: none;
    transition: all 0.3s ease;
  }

  .reset-btn {
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    color: white;
    box-shadow: 0 8rpx 30rpx rgba(74, 158, 255, 0.3);
  }

  .reset-btn:active {
    transform: scale(0.98);
  }

  .home-btn {
    background: #f5f5f5;
    color: #666;
  }

  .home-btn:active {
    background: #e0e0e0;
  }
</style>
