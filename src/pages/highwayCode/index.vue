<!-- <template>
  <div class="highway_main">
    <div class="top_nav">
      <div class="go_back" @click="goBack">
        <u-icon name="arrow-leftward" size="20"></u-icon>
      </div>
      <div class="head_name">Highway Code</div>
      <div class="header_sum">Completed：21%</div>
    </div>
    <div class="highway_list">
      <div
        class="list_item"
        v-for="(item, i) in highwayList"
        :key="i"
        @click="startLearning(item)"
      >
        <div class="item_img">
          <img :src="item.img" alt="" />
        </div>
        <div class="item_content">
          <div class="content_title">{{ item.title }}</div>
          <div class="content_desc">{{ item.desc }}</div>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      highwayList: [
        {
          img: "https://img2.baidu.com/it/u=488654452,3750536260&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1422",
          progress: 20,
          title: "Driver’s License Application and Usage Regulations",
          desc: "Official Administrative Decree",
          questions: [
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
          ],
        },
        {
          img: "https://img2.baidu.com/it/u=488654452,3750536260&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1422",
          progress: 20,
          title: "Driver’s License Application and Usage Regulations",
          desc: "Official Administrative Decree",
          questions: [
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
          ],
        },
        {
          img: "https://img2.baidu.com/it/u=488654452,3750536260&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1422",
          progress: 20,
          title: "Driver’s License Application and Usage Regulations",
          desc: "Official Administrative Decree",
          questions: [
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
          ],
        },
        {
          img: "https://img2.baidu.com/it/u=488654452,3750536260&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1422",
          progress: 20,
          title: "Driver’s License Application and Usage Regulations",
          desc: "Official Administrative Decree",
          questions: [
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
          ],
        },
        {
          img: "https://img2.baidu.com/it/u=488654452,3750536260&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1422",
          progress: 20,
          title: "Driver’s License Application and Usage Regulations",
          desc: "Official Administrative Decree",
          questions: [
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
            {
              img: require("static/index/highway_img.png"),
              title: "Driver’s License Application and Usage Regulations",
              content:
                "Driver’s License Application and Usage Regulations.Driver’s License Application and Usage Regulations..Driver’s License Application and Usage Regulations.",
              isCollect: false,
            },
          ],
        },
      ],
    };
  },
  methods: {
    startLearning(item) {
      this.$store.commit("saveLearnModeQuestion", item);
      uni.navigateTo({
        url: "/pages/highwayLearn/index",
      });
    },
    goBack() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="scss" scoped>
.highway_main {
  .highway_list {
    padding: 0 30rpx;
    .list_item {
      display: flex;
      padding: 40rpx 0;
      border-bottom: 1px solid #d7d7d7;
      .item_progress {
        margin-right: 20rpx;
        width: 100rpx;
        margin-left: auto;
        .progress {
          margin-top: 40rpx;
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
        margin: 0 27rpx;
        width: 60%;
        .content_desc {
          font-weight: 400;
          font-size: 22rpx;
          color: #999999;
        }
        .content_title {
          font-weight: 400;
          font-size: 28rpx;
          color: #333333;
        }
      }
      .item_img {
        img {
          width: 125rpx;
          height: 125rpx;
          border-radius: 8rpx;
        }
      }
    }
  }
  .top_nav {
    padding: 60rpx 30rpx;
    display: flex;
    .header_sum {
      margin-left: auto;
    }
    .head_name {
      margin-top: -5rpx;
      margin-left: 28rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
    }
  }
}
</style -->

<template>
  <view class="app">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
      <text class="page-title">Highway Code</text>
    </view>

    <!-- 主要内容 -->
    <view class="container">
      <!-- 首页视图 - 保持不变 -->
      <view v-if="currentView === 'home'" class="mode-cards-container">
        <view class="mode-card learn" @tap="selectMode('learn')">
          <view class="mode-icon">📚</view>
          <text class="mode-title">Learn Mode</text>
          <text class="mode-subtitle">Study at your own pace</text>
          <view class="progress-info">
            <text class="progress-label">Progress</text>
            <text class="progress-value">{{ overallProgress }}%</text>
          </view>
        </view>

        <view class="mode-card test" @tap="selectMode('test')">
          <view class="mode-icon">📝</view>
          <text class="mode-title">Test Mode</text>
          <text class="mode-subtitle">Practice like the real exam</text>
          <view class="progress-info">
            <text class="progress-label">Practiced</text>
            <text class="progress-value">{{ testsPracticed }}x</text>
          </view>
        </view>
      </view>

      <!-- 测试模式视图 - 保持不变 -->
      <view v-if="currentView === 'test'" class="options-container">
        <view class="options-card">
          <view class="option-item">
            <text class="option-label">Number of Questions</text>
            <view class="option-value" @tap="showQuantityPicker = true">
              <text>{{ testOptions.questionCount }}</text>
              <text style="color: #999;">›</text>
            </view>
          </view>
          <view class="option-item">
            <text class="option-label">Test All Questions</text>
            <view class="toggle-switch" :class="{active: testOptions.testAll}" @tap="toggleTestAll"></view>
          </view>
          <view class="option-item">
            <text class="option-label">Skip Correct Answers</text>
            <view class="toggle-switch" :class="{active: testOptions.skipCorrect}" @tap="toggleSkipCorrect"></view>
          </view>
        </view>

        <view class="button-container">
          <view class="action-button" @tap="startTest">Start Exam</view>
        </view>
      </view>

      <!-- 学习模式视图 - 修改为Highway Code格式：页数和已读 -->
      <view v-if="currentView === 'learn'" class="categories-container">
        <view v-for="category in categories" 
              :key="category.id"
              class="category-card" 
              :class="{selected: selectedCategory === category.id}"
              @tap="selectCategory(category.id)">
          <view class="category-header">
            <view class="category-left">
              <view class="radio-button" :class="{selected: selectedCategory === category.id}"></view>
              <text class="category-name">{{ category.name }}</text>
            </view>
            <text class="category-progress">{{ category.progress }}%</text>
          </view>
          <view class="category-stats">
            <text>Pages: {{ category.totalPages }}</text>
            <text>Read: {{ category.readPages }}</text>
          </view>
          <view class="progress-bar">
            <view class="progress-fill" :style="{width: category.progress + '%'}"></view>
          </view>
        </view>

        <view class="button-container">
          <view class="action-button" @tap="startLearning">Start Learning</view>
        </view>
      </view>
    </view>

    <!-- 数量选择器模态框 -->
    <view v-if="showQuantityPicker" class="modal-backdrop" @tap="closeModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">Select Number of Questions</text>
        </view>
        <view class="picker-container">
          <text class="range-value">{{ tempQuestionCount }}</text>
          <slider class="range-slider" 
                  :value="tempQuestionCount" 
                  :min="10" 
                  :max="100" 
                  :step="10"
                  @change="onSliderChange"
                  activeColor="#4A9EFF"
                  backgroundColor="#E0E0E0"
                  block-color="#4A9EFF"
                  block-size="24"/>
          <view class="range-labels">
            <text>10</text>
            <text>100</text>
          </view>
        </view>
        <view class="modal-actions">
          <view class="modal-button cancel" @tap="showQuantityPicker = false">Cancel</view>
          <view class="modal-button confirm" @tap="confirmQuantity">Confirm</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentView: 'home', // 当前视图状态
      overallProgress: 73, // 整体学习进度
      testsPracticed: 8, // 测试练习次数
      showQuantityPicker: false, // 是否显示数量选择器
      tempQuestionCount: 50, // 临时题目数量
      selectedCategory: 1, // 选中的学习分类
      testOptions: {
        questionCount: 50, // 测试题目数量
        testAll: true, // 是否测试所有题目
        skipCorrect: false // 是否跳过已答对的题目
      },
      // Highway Code 分类数据 - 修改为页数和已读格式
      categories: [
        {
          id: 1,
          name: 'Introduction',
          totalPages: 8,
          readPages: 8,
          progress: 100
        },
        {
          id: 2,
          name: 'Rules for pedestrians',
          totalPages: 12,
          readPages: 9,
          progress: 75
        },
        {
          id: 3,
          name: 'Rules for users of powered wheelchairs',
          totalPages: 6,
          readPages: 3,
          progress: 50
        },
        {
          id: 4,
          name: 'Rules about animals',
          totalPages: 4,
          readPages: 0,
          progress: 0
        },
        {
          id: 5,
          name: 'Rules for cyclists',
          totalPages: 15,
          readPages: 12,
          progress: 80
        },
        {
          id: 6,
          name: 'Rules for motorcyclists',
          totalPages: 10,
          readPages: 5,
          progress: 50
        },
        {
          id: 7,
          name: 'Rules for drivers and motorcyclists',
          totalPages: 25,
          readPages: 18,
          progress: 72
        },
        {
          id: 8,
          name: 'General rules, techniques and advice',
          totalPages: 20,
          readPages: 15,
          progress: 75
        },
        {
          id: 9,
          name: 'Using the road',
          totalPages: 18,
          readPages: 6,
          progress: 33
        },
        {
          id: 10,
          name: 'Road works, level crossings and tramways',
          totalPages: 8,
          readPages: 8,
          progress: 100
        },
        {
          id: 11,
          name: 'Light signals controlling traffic',
          totalPages: 5,
          readPages: 2,
          progress: 40
        },
        {
          id: 12,
          name: 'Signals by authorised persons',
          totalPages: 3,
          readPages: 3,
          progress: 100
        },
        {
          id: 13,
          name: 'Signals to other road users',
          totalPages: 6,
          readPages: 4,
          progress: 67
        },
        {
          id: 14,
          name: 'Other information',
          totalPages: 12,
          readPages: 0,
          progress: 0
        }
      ]
    }
  },
  computed: {
    // 计算页面标题
    pageTitle() {
      switch(this.currentView) {
        case 'home':
          return 'Highway Code';
        case 'test':
          return 'Test Mode';
        case 'learn':
          return 'Learn Mode';
        default:
          return 'Highway Code';
      }
    }
  },
  methods: {
    // 选择学习或测试模式
    selectMode(mode) {
      this.currentView = mode;
    },
    // 返回上一页或退出应用
    goBack() {
      if (this.currentView === 'home') {
        // 首页的返回按钮可以关闭应用或返回上级页面
        console.log('Navigate back or close app');
        // 实际应用中可以调用返回上级页面的API
        uni.navigateBack({
          fail: () => {
            // 如果没有上级页面，可以退出应用
            console.log('No previous page, exit app');
          }
        });
      } else {
        this.currentView = 'home';
      }
    },
    // 选择学习分类
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
    },
    // 切换测试所有题目选项
    toggleTestAll() {
      this.testOptions.testAll = !this.testOptions.testAll;
    },
    // 切换跳过正确答案选项
    toggleSkipCorrect() {
      this.testOptions.skipCorrect = !this.testOptions.skipCorrect;
    },
    // 滑块变化事件
    onSliderChange(e) {
      this.tempQuestionCount = e.detail.value;
    },
    // 确认题目数量选择
    confirmQuantity() {
      this.testOptions.questionCount = this.tempQuestionCount;
      this.showQuantityPicker = false;
    },
    // 关闭模态框
    closeModal() {
      this.showQuantityPicker = false;
    },
    // 开始测试
    startTest() {
      console.log('Starting Highway Code test with options:', this.testOptions);
      // 这里可以调用API开始Highway Code测试
      uni.showToast({
        title: '开始测试',
        icon: 'success'
      });
    },
    // 开始学习
    startLearning() {
      const category = this.categories.find(c => c.id === this.selectedCategory);
      console.log('Starting Highway Code learning for category:', category);
      // 这里可以调用API开始Highway Code学习
      uni.showToast({
        title: '开始学习',
        icon: 'success'
      });
    },
    // 获取用户进度数据 - API调用示例
    async fetchUserProgress() {
      try {
        const response = await uni.request({
          url: '/api/highway-code/progress',
          method: 'GET'
        });
        if (response[1].statusCode === 200) {
          this.overallProgress = response[1].data.overallProgress;
          this.testsPracticed = response[1].data.testsPracticed;
        }
      } catch (error) {
        console.error('Failed to fetch user progress:', error);
      }
    },
    // 获取分类数据 - API调用示例
    async fetchCategories() {
      try {
        const response = await uni.request({
          url: '/api/highway-code/categories',
          method: 'GET'
        });
        if (response[1].statusCode === 200) {
          this.categories = response[1].data;
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
  },
  onLoad() {
    // 页面加载时获取数据
    // this.fetchUserProgress();
    // this.fetchCategories();
  }
}
</script>

<style lang="scss">
/* 全局重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  color: #333;
}

/* 渐变背景 */
.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 45%;
  background: linear-gradient(180deg, #E3F2FD 0%, #FFFFFF 100%);
}

.gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  background: linear-gradient(180deg, #FFFFFF 0%, #FFF4F4 100%);
}

/* Header 样式 */
.header {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  background: transparent;
  position: relative;
  z-index: 10;
  min-height: 60px;
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

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: center;
  margin-right: 40px;
}

/* 容器 */
.container {
  flex: 1;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
}

/* 模式选择卡片 */
.mode-cards-container {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280rpx, 1fr));
  gap: 24rpx;
  width: 100%;
  margin: 0 auto;
}

.mode-card {
  background: white;
  border-radius: 20px;
  padding: 30px 25px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.mode-card:active {
  transform: scale(0.98);
}

.mode-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.mode-card.learn::before {
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
}

.mode-card.test::before {
  background: linear-gradient(90deg, #FF6B6B 0%, #FF5252 100%);
}

.mode-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background: #F8F9FA;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.mode-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  display: block;
}

.mode-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.4;
  display: block;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 16px;
  border-top: 1px solid #F0F0F0;
}

.progress-label {
  font-size: 14px;
  color: #999;
}

.progress-value {
  font-size: 24px;
  font-weight: 700;
}

.learn .progress-value {
  color: #4A9EFF;
}

.test .progress-value {
  color: #FF6B6B;
}

/* 选项容器 */
.options-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 350px;
  width: 100%;
  margin: 0 auto;
}

.options-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #F5F5F5;
}

.option-item:last-child {
  border-bottom: none;
}

.option-label {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.option-value {
  font-size: 16px;
  color: #4A9EFF;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-switch {
  width: 48px;
  height: 28px;
  background: #E0E0E0;
  border-radius: 14px;
  position: relative;
  transition: background 0.3s;
}

.toggle-switch.active {
  background: #4A9EFF;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.toggle-switch.active::after {
  transform: translateX(20px);
}

/* 分类选择 */
.categories-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280rpx, 1fr));
  gap: 24rpx;
}

.category-card {
  background: white;
  border-radius: 20px;
  padding: 28rpx;
  box-shadow: 0 5px 18px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.category-card:active {
  transform: scale(0.98);
}

.category-card.selected {
  border-color: #4A9EFF;
  background: #F8FBFF;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.category-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.radio-button {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #4A9EFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  flex-shrink: 0;
}

.radio-button.selected::after {
  content: '';
  width: 20rpx;
  height: 20rpx;
  background: #4A9EFF;
  border-radius: 50%;
}

.category-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.category-progress {
  font-size: 32rpx;
  font-weight: 600;
  color: #4A9EFF;
}

.category-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  padding-left: 32rpx;
}

.progress-bar {
  width: 100%;
  height: 12rpx;
  background: #F0F0F0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-left: 32rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* 操作按钮 */
.button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx 40rpx calc(30rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 30%, white 100%);
  z-index: 20;
}

.action-button {
  width: 100%;
  max-width: 500rpx;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  border: none;
  border-radius: 40rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 12rpx 40rpx rgba(74, 158, 255, 0.35);
  transition: all 0.3s ease;
  text-align: center;
}

.action-button:active {
  transform: scale(0.98);
}

/* 模态框 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.modal-content {
  background: white;
  border-radius: 25px 25px 0 0;
  padding: 25px 20px 35px;
  width: 100%;
  animation: slideUp 0.3s ease;
}

.modal-header {
  text-align: center;
  margin-bottom: 25px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.picker-container {
  padding: 15px 0;
}

.range-slider {
  width: 100%;
  margin: 20px 0;
}

.range-value {
  text-align: center;
  font-size: 42px;
  font-weight: 700;
  color: #4A9EFF;
  margin: 15px 0;
  display: block;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
  margin-top: 8px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 35px;
}

.modal-button {
  flex: 1;
  padding: 14px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-button.cancel {
  background: #F5F5F5;
  color: #666;
}

.modal-button.confirm {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  box-shadow: 0 3px 12px rgba(74, 158, 255, 0.3);
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* 移动端优化 */
@media screen and (max-width: 375px) {
  .mode-cards-container {
    max-width: 320px;
  }
  
  .options-container,
  .categories-container {
    max-width: 320px;
  }
  
  .mode-card {
    padding: 25px 20px;
  }
  
  .mode-title {
    font-size: 20px;
  }
  
  .mode-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
}
</style>