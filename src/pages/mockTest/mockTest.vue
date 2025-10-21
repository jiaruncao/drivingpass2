<template>
  <view class="app">
    <!-- 横屏提示 -->
    <view v-if="showOrientationMessage" class="orientation-message">
      <view class="orientation-icon">📱</view>
      <text class="orientation-text">Please rotate your device</text>
      <text class="orientation-subtext">This test is best experienced in landscape mode</text>
    </view>

    <!-- 渐变背景 -->
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
      <!-- 装饰性圆圈 -->
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>

    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
    </view>

    <!-- 主内容区域 -->
    <view class="main-container">
      <!-- 标题区域 -->
      <view class="title-section fade-in">
        <text class="main-title">UK DVSA Theory Test (Mock)</text>
        <text class="subtitle">Immersive DVSA Test‑Day Experience</text>
      </view>

      <!-- 测试类型卡片 -->
      <view class="test-types-container fade-in-delay-1">
        <!-- 多选题卡片 -->
        <view class="test-type-card">
          <text class="test-type-title">Multiple-choice</text>
          <view class="test-type-details">
            <text class="test-type-main">50 questions</text>
            <text class="pass-mark">Pass 43/50</text>
          </view>
        </view>

        <!-- 危险感知卡片 -->
        <view class="test-type-card">
          <text class="test-type-title">Hazard Perception</text>
          <view class="test-type-details">
            <text class="test-type-main">14 clips · 15 hazards</text>
            <text class="pass-mark">Pass 44/75</text>
          </view>
        </view>
      </view>

      <!-- 按钮区域 -->
      <view class="buttons-container fade-in-delay-2">
        <view class="primary-button" @tap="startTest">
          <text class="primary-button-text">Start Test</text>
        </view>
        <view class="secondary-button" @tap="viewRecords">
          <text class="secondary-button-text">Your Records</text>
        </view>
      </view>
    </view>
    
    <u-modal width="700rpx" title="Test Instructions" :show="showTest" :showCancelButton="true" cancelText="Cancel" confirmText="Start" content='You will have 57 minutes to complete 50 multiple-choice questions, followed by 14 hazard perception video clips. You must score at least 43/50 in multiple-choice and 44/75 in hazard perception to pass.' @confirm="confirm" @cancel="cancel"></u-modal>
    
  </view>
</template>

<script>
  import {getPaperList} from '@/http/api/testQuestions.js'
  export default {
    data() {
      return {
        // 是否显示横屏提示
        showOrientationMessage: false,
        pages: [],
        choosePage: {},
        // 测试配置
        testConfig: {
          multipleChoice: {
            questions: 50,
            passMarks: 43,
            timeLimit: 57 // 分钟
          },
          hazardPerception: {
            clips: 14,
            hazards: 15,
            passMarks: 44,
            totalMarks: 75
          }
        },
        showTest: false
      }
    },
    onLoad() {
      // 页面加载时检查屏幕方向
      this.setLandscapeMode();
      this.getPaperList()
    },
    onUnload() {
      // #ifdef APP-PLUS
      plus.screen.lockOrientation('portrait-primary');
      // #endif
    },
    onShow() {
      // 页面显示时再次检查
      this.setLandscapeMode();
    },
    methods: {
      // 获取考题列表
      getPaperList () {
        getPaperList().then(res => {
          console.log(res)
          if (res.code == 1) {
            this.pages = res.data.list.data
          }
        })
      },
      doChoosePage(item) {
        this.choosePage = item
      },
      // 设置横屏模式
      setLandscapeMode() {
        // #ifdef APP-PLUS
        // APP端强制横屏
        plus.screen.lockOrientation('landscape-primary');
        plus.navigator.setFullscreen(true); // 全屏显示，隐藏状态栏和导航栏
        plus.navigator.hideSystemNavigation(); // 隐藏系统导航栏
        // #endif

        // #ifdef H5
        // H5端提示横屏效果更佳
        const systemInfo = uni.getSystemInfoSync();
        if (systemInfo.windowWidth < systemInfo.windowHeight) {
          console.log('建议横屏使用以获得最佳体验');
        }
        // #endif
      },
      // 返回上一页
      goBack() {
        console.log('返回上一页');
        // 返回到APP主页
        // uni.navigateBack({
        //   delta: 1,
        //   fail: () => {
        //     // 如果没有上一页，返回到首页
        //     uni.switchTab({
        //       url: '/pages/index/index'
        //     });
        //   }
        // });
        uni.switchTab({
          url: '/pages/index/index'
        });
      },

      // 开始测试
      startTest() {
        console.log('开始模拟测试');
        // 显示测试说明
        this.showTestInstructions();
      },

      // 查看记录
      viewRecords() {
        console.log('查看测试记录');
        // 导航到历史记录页面
        uni.navigateTo({
          url: '/pages/mockTest/record'
        });
      },

      // 显示测试说明
      showTestInstructions() {
        // 显示测试前的说明和准备事项
        // uni.showModal({
        //   title: 'Test Instructions',
        //   content: 'You will have 57 minutes to complete 50 multiple-choice questions, followed by 14 hazard perception video clips. You must score at least 43/50 in multiple-choice and 44/75 in hazard perception to pass.',
        //   confirmText: 'Start',
        //   cancelText: 'Cancel',
        //   success: (res) => {
        //     if (res.confirm) {
        //       // 开始测试
        //       this.navigateToTest();
        //     }
        //   }
        // });
        this.showTest = true
      },
      confirm () {
        this.navigateToTest();
        this.showTest = false
      },
      cancel () {
        this.showTest = false
      },
      // 导航到测试页面
      navigateToTest() {
        uni.navigateTo({
          url: '/pages/mockTest/test',
          success: () => {
            console.log('导航到多选题测试页面');
          }
        });
      },

      // 检查设备方向
      checkOrientation() {
        // 获取系统信息
        const systemInfo = uni.getSystemInfoSync();
        const isLandscape = systemInfo.windowWidth > systemInfo.windowHeight;

        // 在竖屏模式下显示提示
        this.showOrientationMessage = !isLandscape;

        if (!isLandscape) {
          console.log('请旋转设备到横屏模式');
        }
      }
    },
    // onResize() {
    //   // 监听窗口尺寸变化（支持H5）
    //   this.checkOrientation();
    // }
  }
</script>

<style lang="scss">
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
    overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: env(safe-area-inset-bottom);
    background-color: rgba(255, 255, 255, 0.92);
  }

  .gradient-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
  }

  .gradient-top {
    position: absolute;
    inset: 0 0 50% 0;
    background: linear-gradient(180deg, #E3F2FD 0%, #FFFFFF 100%);
  }

  .gradient-bottom {
    position: absolute;
    inset: 50% 0 0 0;
    background: linear-gradient(180deg, #FFFFFF 0%, #FFF4F4 100%);
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 20;
    padding: calc(env(safe-area-inset-top) + 24rpx) 64rpx 32rpx;
    display: flex;
    align-items: center;
    gap: 24rpx;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(16rpx);
  }

  .back-button {
    background: none;
    border: none;
    color: #666;
    font-size: 48rpx;
    padding: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80rpx;
    height: 80rpx;
    transition: opacity 0.3s;

    &:active {
      opacity: 0.7;
    }
  }

  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40rpx 80rpx 120rpx;
    position: relative;
    z-index: 10;
    gap: 60rpx;
  }

  .title-section {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .main-title {
    font-size: 84rpx;
    font-weight: 700;
    color: #333;
  }

  .subtitle {
    font-size: 40rpx;
    background: linear-gradient(90deg, #4A9EFF 0%, #A78BFA 50%, #EC4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 400;
  }

  .test-types-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 60rpx;
    width: 100%;
    max-width: 900rpx;
  }

  .test-type-card {
    flex: 1 1 320rpx;
    background: rgba(255, 255, 255, 0.96);
    border-radius: 48rpx;
    padding: 70rpx 60rpx;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.08);
    text-align: center;
    min-height: 360rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24rpx;
  }

  .test-type-title {
    font-size: 52rpx;
    font-weight: 600;
    color: #333;
  }

  .test-type-details {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
    align-items: center;
  }

  .test-type-main {
    font-size: 36rpx;
    color: #333;
  }

  .pass-mark {
    color: #999;
    font-size: 32rpx;
  }

  .buttons-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40rpx;
    width: 100%;
    max-width: 700rpx;
  }

  .primary-button,
  .secondary-button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120rpx;
    padding: 32rpx 96rpx;
    border-radius: 100rpx;
    transition: all 0.3s ease;
    text-align: center;
  }

  .primary-button {
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    box-shadow: 0 16rpx 48rpx rgba(74, 158, 255, 0.35);

    &:active {
      transform: scale(0.98);
    }
  }

  .primary-button-text {
    color: #fff;
    font-size: 44rpx;
    font-weight: 600;
  }

  .secondary-button {
    background: #fff;
    border: 4rpx solid #4A9EFF;

    &:active {
      transform: scale(0.98);
      background: #F8FBFF;
    }
  }

  .secondary-button-text {
    color: #4A9EFF;
    font-size: 40rpx;
    font-weight: 600;
  }

  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
    background: #4A9EFF;
  }

  .circle-1 {
    width: 400rpx;
    height: 400rpx;
    top: 10%;
    right: 5%;
  }

  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    bottom: 10%;
    left: 5%;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20rpx);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in {
    animation: fadeIn 0.6s ease;
  }

  .fade-in-delay-1 {
    animation: fadeIn 0.6s ease 0.2s both;
  }

  .fade-in-delay-2 {
    animation: fadeIn 0.6s ease 0.4s both;
  }

  .orientation-message {
    position: fixed;
    inset: 0;
    background: #fff;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
    text-align: center;
  }

  .orientation-icon {
    font-size: 120rpx;
    margin-bottom: 40rpx;
    animation: rotate 2s infinite;
    display: block;
  }

  .orientation-text {
    font-size: 36rpx;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }

  .orientation-subtext {
    font-size: 28rpx;
    color: #666;
    display: block;
  }

  @keyframes rotate {
    0%,
    100% {
      transform: rotate(-90deg);
    }

    50% {
      transform: rotate(0deg);
    }
  }
</style>