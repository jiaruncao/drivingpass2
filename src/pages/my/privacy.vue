<template>
  <view class="app">
    <!-- 渐变背景 -->
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
      <text class="page-title">Privacy Policy</text>
    </view>

    <!-- 主要内容 -->
    <scroll-view class="container" scroll-y>
      <!-- 最后更新信息 -->
      <view class="last-updated">
        <text class="update-icon">🔄</text>
        <text class="update-text">Last updated: <text class="update-date">{{ lastUpdated }}</text></text>
      </view>

      <!-- 快速导航 -->
      <view class="content-card">
        <view class="quick-nav">
          <text class="nav-title">Quick Navigation</text>
          <view class="nav-links">
            <view class="nav-link" @tap="scrollToSection('information-collect')">Information We Collect</view>
            <view class="nav-link" @tap="scrollToSection('how-we-use')">How We Use</view>
            <view class="nav-link" @tap="scrollToSection('data-sharing')">Data Sharing</view>
            <view class="nav-link" @tap="scrollToSection('data-security')">Data Security</view>
            <view class="nav-link" @tap="scrollToSection('your-rights')">Your Rights</view>
            <view class="nav-link" @tap="scrollToSection('contact')">Contact Us</view>
          </view>
        </view>
      </view>

      <!-- 介绍 -->
      <view class="content-card">
        <view class="section">
          <view class="section-title">
            <view class="section-icon">📋</view>
            <text>Introduction</text>
          </view>
          <text class="section-content">
            Welcome to DrivingPass ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our UK Driving Theory Test application.
          </text>
          <text class="section-content">
            By using our app, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
          </text>
        </view>
      </view>

      <!-- 信息收集 -->
      <view class="content-card" id="information-collect">
        <view class="section">
          <view class="section-title">
            <view class="section-icon">🔍</view>
            <text>Information We Collect</text>
          </view>
          
          <!-- 使用手风琴展示不同类型的信息 -->
          <view class="accordion-item">
            <view class="accordion-header" @tap="toggleAccordion('personal')">
              <text class="accordion-title">Personal Information</text>
              <text class="accordion-icon" :class="{expanded: expandedItem === 'personal'}">▼</text>
            </view>
            <view class="accordion-content" :class="{expanded: expandedItem === 'personal'}">
              <view class="accordion-body">
                <view class="info-list">
                  <view class="info-list-item">Name and email address when you create an account</view>
                  <view class="info-list-item">Profile information such as username and profile picture</view>
                  <view class="info-list-item">Test centre location (optional)</view>
                  <view class="info-list-item">Payment information for premium subscriptions</view>
                </view>
              </view>
            </view>
          </view>

          <view class="accordion-item">
            <view class="accordion-header" @tap="toggleAccordion('usage')">
              <text class="accordion-title">Usage Information</text>
              <text class="accordion-icon" :class="{expanded: expandedItem === 'usage'}">▼</text>
            </view>
            <view class="accordion-content" :class="{expanded: expandedItem === 'usage'}">
              <view class="accordion-body">
                <view class="info-list">
                  <view class="info-list-item">Test scores and progress data</view>
                  <view class="info-list-item">Questions answered and time spent</view>
                  <view class="info-list-item">Learning preferences and patterns</view>
                  <view class="info-list-item">App feature usage statistics</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 如何使用信息 -->
      <view class="content-card" id="how-we-use">
        <view class="section">
          <view class="section-title">
            <view class="section-icon">⚙️</view>
            <text>How We Use Your Information</text>
          </view>
          <text class="section-content">
            We use the information we collect to:
          </text>
          <view class="info-list">
            <view class="info-list-item">Provide and maintain our service</view>
            <view class="info-list-item">Personalize your learning experience</view>
            <view class="info-list-item">Track your progress and generate performance reports</view>
            <view class="info-list-item">Send you updates about your test preparation</view>
            <view class="info-list-item">Process payments and manage subscriptions</view>
            <view class="info-list-item">Improve our app and develop new features</view>
            <view class="info-list-item">Comply with legal obligations</view>
          </view>
        </view>
      </view>

      <!-- 数据共享 -->
      <view class="content-card" id="data-sharing">
        <view class="section">
          <view class="section-title">
            <view class="section-icon">🤝</view>
            <text>Data Sharing and Disclosure</text>
          </view>
          
          <view class="data-table">
            <view class="table-header">
              <text class="table-cell header">Third Party</text>
              <text class="table-cell header">Purpose</text>
            </view>
            <view class="table-row">
              <text class="table-cell">Payment Processors</text>
              <text class="table-cell">To process subscription payments</text>
            </view>
            <view class="table-row">
              <text class="table-cell">Analytics Providers</text>
              <text class="table-cell">To understand app usage patterns</text>
            </view>
            <view class="table-row">
              <text class="table-cell">Cloud Services</text>
              <text class="table-cell">To store and sync your data</text>
            </view>
            <view class="table-row">
              <text class="table-cell">Customer Support Tools</text>
              <text class="table-cell">To provide user support</text>
            </view>
          </view>

          <view class="important-box">
            <view class="important-title">
              <text>⚠️ Important Note</text>
            </view>
            <text class="important-content">
              We never sell your personal information to third parties. We only share data as necessary to provide our services and as described in this policy.
            </text>
          </view>
        </view>
      </view>

      <!-- 数据安全 -->
      <view class="content-card" id="data-security">
        <view class="section">
          <view class="section-title">
            <view class="section-icon">🔐</view>
            <text>Data Security</text>
          </view>
          <text class="section-content">
            We implement appropriate technical and organizational security measures to protect your personal information, including:
          </text>
          <view class="info-list">
            <view class="info-list-item">Encryption of data in transit and at rest</view>
            <view class="info-list-item">Regular security audits and updates</view>
            <view class="info-list-item">Access controls and authentication</view>
            <view class="info-list-item">Secure payment processing through certified providers</view>
            <view class="info-list-item">Regular backups and disaster recovery procedures</view>
          </view>
        </view>
      </view>

      <!-- 用户权利 -->
      <view class="content-card" id="your-rights">
        <view class="section">
          <view class="section-title">
            <view class="section-icon">✅</view>
            <text>Your Rights</text>
          </view>
          <text class="section-content">
            Under UK GDPR, you have the following rights:
          </text>
          <view class="info-list">
            <view class="info-list-item"><text class="bold">Access:</text> Request a copy of your personal data</view>
            <view class="info-list-item"><text class="bold">Rectification:</text> Request correction of inaccurate data</view>
            <view class="info-list-item"><text class="bold">Erasure:</text> Request deletion of your data</view>
            <view class="info-list-item"><text class="bold">Portability:</text> Receive your data in a portable format</view>
            <view class="info-list-item"><text class="bold">Objection:</text> Object to certain processing activities</view>
            <view class="info-list-item"><text class="bold">Restriction:</text> Request limited processing of your data</view>
          </view>
          <text class="section-content">
            To exercise any of these rights, please contact us using the information below.
          </text>
        </view>
      </view>

      <!-- 儿童隐私 -->
      <view class="content-card">
        <view class="section">
          <view class="section-title">
            <view class="section-icon">👶</view>
            <text>Children's Privacy</text>
          </view>
          <text class="section-content">
            Our service is intended for users who are at least 17 years old (the minimum age for a UK driving license). We do not knowingly collect personal information from children under 17. If you become aware that a child has provided us with personal information, please contact us.
          </text>
        </view>
      </view>

      <!-- Cookie政策 -->
      <view class="content-card">
        <view class="section">
          <view class="section-title">
            <view class="section-icon">🍪</view>
            <text>Cookies and Tracking</text>
          </view>
          <text class="section-content">
            We use cookies and similar tracking technologies solely for technical optimization purposes. These help us improve app performance, fix bugs, and enhance user experience. We do not collect or store any personal sensitive information through cookies.
          </text>
          <text class="section-content">
            The technical data we collect includes:
          </text>
          <view class="info-list">
            <view class="info-list-item">App performance metrics</view>
            <view class="info-list-item">Feature usage statistics for optimization</view>
            <view class="info-list-item">Error logs for troubleshooting</view>
            <view class="info-list-item">Session duration for improving user experience</view>
          </view>
        </view>
      </view>

      <!-- 联系信息 -->
      <view class="content-card" id="contact">
        <view class="contact-box">
          <text class="contact-title">Contact Us</text>
          <view class="contact-item">
            <text class="contact-label">Email:</text>
            <text class="contact-value email-link" @tap="sendEmail">info@drivingpass.co.uk</text>
          </view>
        </view>
      </view>

      <!-- 底部按钮 -->
      <view class="bottom-actions">
        <button class="accept-button" @tap="acceptPolicy">I Understand</button>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      lastUpdated: 'November 1, 2024',
      expandedItem: null
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1,
        fail: () => {
          uni.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    },
    // 滚动到指定部分
    scrollToSection(sectionId) {
      // UniApp中使用pageScrollTo
      uni.createSelectorQuery()
        .select('#' + sectionId)
        .boundingClientRect()
        .exec((res) => {
          if (res[0]) {
            uni.pageScrollTo({
              scrollTop: res[0].top - 100,
              duration: 300
            });
          }
        });
    },
    // 切换手风琴
    toggleAccordion(item) {
      this.expandedItem = this.expandedItem === item ? null : item;
    },
    // 发送邮件
    sendEmail() {
      uni.setClipboardData({
        data: 'info@drivingpass.co.uk',
        success: () => {
          uni.showToast({
            title: 'Email copied!',
            icon: 'success',
            duration: 2000
          });
        }
      });
    },
    // 接受隐私政策
    acceptPolicy() {
      // 保存用户已接受隐私政策
      uni.setStorageSync('privacyPolicyAccepted', 'true');
      uni.setStorageSync('privacyPolicyAcceptedDate', new Date().toISOString());
      this.goBack();
    }
  },
  onLoad() {
    console.log('Privacy Policy page loaded');
  }
}
</script>

<style lang="scss">
/* 全局样式 */
page {
  background: #F8F9FA;
}

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
  padding: 30rpx 40rpx;
  display: flex;
  align-items: center;
  background: transparent;
  position: relative;
  z-index: 10;
  min-height: 120rpx;
}

.back-button {
  background: none;
  border: none;
  color: #666;
  font-size: 40rpx;
  padding: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
}

.page-title {
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: center;
  margin-right: 80rpx;
}

/* 容器 */
.container {
  flex: 1;
  padding: 40rpx;
  position: relative;
  z-index: 10;
  max-width: 1200rpx;
  width: 100%;
  margin: 0 auto;
}

/* 最后更新信息 */
.last-updated {
  background: linear-gradient(135deg, #F8FBFF 0%, #F0F7FF 100%);
  border-radius: 30rpx;
  padding: 30rpx 40rpx;
  margin-bottom: 40rpx;
  border: 2rpx solid rgba(74, 158, 255, 0.15);
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.update-icon {
  font-size: 40rpx;
  color: #4A9EFF;
}

.update-text {
  font-size: 28rpx;
  color: #666;
}

.update-date {
  color: #4A9EFF;
  font-weight: 600;
  margin-left: 16rpx;
}

/* 内容卡片 */
.content-card {
  background: white;
  border-radius: 40rpx;
  padding: 50rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 10rpx 36rpx rgba(0,0,0,0.06);
}

/* 快速导航 */
.quick-nav {
  margin-bottom: 50rpx;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.nav-link {
  padding: 16rpx 32rpx;
  background: #F8F9FA;
  border-radius: 40rpx;
  font-size: 26rpx;
  color: #4A9EFF;
  transition: all 0.3s ease;
}

.nav-link:active {
  background: #4A9EFF;
  color: white;
  transform: scale(0.95);
}

/* 内容部分 */
.section {
  margin-bottom: 60rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.section-icon {
  width: 48rpx;
  height: 48rpx;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28rpx;
}

.section-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
  margin-bottom: 30rpx;
  display: block;
}

/* 列表样式 */
.info-list {
  margin: 30rpx 0;
}

.info-list-item {
  position: relative;
  padding-left: 56rpx;
  margin-bottom: 24rpx;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.info-list-item::before {
  content: '•';
  position: absolute;
  left: 20rpx;
  color: #4A9EFF;
  font-weight: bold;
}

.bold {
  font-weight: 600;
  color: #333;
}

/* 重要提示框 */
.important-box {
  background: linear-gradient(135deg, #FFF8E1 0%, #FFF3CD 100%);
  border: 2rpx solid #FFD700;
  border-radius: 30rpx;
  padding: 30rpx;
  margin: 40rpx 0;
}

.important-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #F9A825;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.important-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

/* 联系信息框 */
.contact-box {
  background: linear-gradient(135deg, #F8FBFF 0%, #F0F7FF 100%);
  border-radius: 40rpx;
  padding: 40rpx;
  margin-top: 60rpx;
  border: 2rpx solid rgba(74, 158, 255, 0.15);
}

.contact-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  font-size: 28rpx;
  color: #666;
}

.contact-label {
  font-weight: 500;
  margin-right: 16rpx;
  color: #333;
}

.contact-value {
  color: #4A9EFF;
}

.email-link {
  text-decoration: underline;
}

/* 表格样式 */
.data-table {
  margin: 30rpx 0;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
}

.table-header {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  display: flex;
  padding: 24rpx;
}

.table-row {
  background: white;
  display: flex;
  padding: 24rpx;
  border-bottom: 2rpx solid #F0F0F0;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  flex: 1;
  font-size: 28rpx;
  color: #666;
}

.table-cell.header {
  color: white;
  font-weight: 600;
}

/* 手风琴样式 */
.accordion-item {
  background: white;
  border: 2rpx solid #E0E0E0;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.accordion-header {
  padding: 30rpx 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease;
}

.accordion-header:active {
  background: #F8F9FA;
}

.accordion-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.accordion-icon {
  transition: transform 0.3s ease;
  color: #999;
  font-size: 24rpx;
}

.accordion-icon.expanded {
  transform: rotate(180deg);
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-content.expanded {
  max-height: 1000rpx;
}

.accordion-body {
  padding: 0 40rpx 30rpx;
}

/* 底部按钮 */
.bottom-actions {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40rpx;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 20%, white 100%);
  z-index: 20;
}

.accept-button {
  width: 100%;
  padding: 32rpx;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 12rpx 40rpx rgba(74, 158, 255, 0.35);
  transition: all 0.3s ease;
}

.accept-button:active {
  transform: scale(0.98);
}

/* 响应式优化 */
@media screen and (max-width: 375px) {
  .container {
    padding: 30rpx;
  }

  .content-card {
    padding: 40rpx;
  }

  .page-title {
    font-size: 40rpx;
  }
}
</style>