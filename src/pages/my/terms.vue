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
      <text class="page-title">Terms of Use</text>
    </view>

    <!-- 主要内容 -->
    <scroll-view class="container" scroll-y>
      <!-- 生效日期 -->
      <view class="effective-date">
        <text class="date-icon">📅</text>
        <text class="date-text">Effective Date: <text class="date-value">{{ effectiveDate }}</text></text>
      </view>

      <!-- 条款导航 -->
      <view class="content-card">
        <view class="terms-nav">
          <text class="nav-title">Terms Overview</text>
          <view class="nav-grid">
            <view class="nav-item" @tap="scrollToSection('acceptance')">1. Acceptance</view>
            <view class="nav-item" @tap="scrollToSection('license')">2. License</view>
            <view class="nav-item" @tap="scrollToSection('account')">3. Account</view>
            <view class="nav-item" @tap="scrollToSection('subscription')">4. Subscription</view>
            <view class="nav-item" @tap="scrollToSection('conduct')">5. User Conduct</view>
            <view class="nav-item" @tap="scrollToSection('content')">6. Content</view>
            <view class="nav-item" @tap="scrollToSection('liability')">7. Liability</view>
            <view class="nav-item" @tap="scrollToSection('termination')">8. Termination</view>
          </view>
        </view>
      </view>

      <!-- 条款1: 接受条款 -->
      <view class="content-card" id="acceptance">
        <view class="term-section">
          <view class="term-title">
            <text class="term-number">1</text>
            <text>Acceptance of Terms</text>
          </view>
          <text class="term-content">
            By downloading, installing, or using the DrivingPass app ("Service"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, do not use the Service.
          </text>
          <view class="info-box">
            <view class="info-title">
              <text>ℹ️ Age Requirement</text>
            </view>
            <text class="info-content">
              You must be at least 17 years old to use this Service, which is the minimum age to apply for a UK provisional driving license.
            </text>
          </view>
        </view>
      </view>

      <!-- 条款2: 许可授予 -->
      <view class="content-card" id="license">
        <view class="term-section">
          <view class="term-title">
            <text class="term-number">2</text>
            <text>License Grant</text>
          </view>
          <text class="term-content">
            Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to:
          </text>
          <view class="sub-terms">
            <view class="sub-term" data-number="2.1">Download and install the app on your personal devices</view>
            <view class="sub-term" data-number="2.2">Access and use the Service for personal, non-commercial purposes</view>
            <view class="sub-term" data-number="2.3">Access content and features according to your subscription level</view>
          </view>
        </view>
      </view>

      <!-- 条款3: 账户责任 -->
      <view class="content-card" id="account">
        <view class="term-section">
          <view class="term-title">
            <text class="term-number">3</text>
            <text>Account Responsibilities</text>
          </view>
          <text class="term-content">
            When you create an account with us, you must:
          </text>
          <view class="sub-terms">
            <view class="sub-term" data-number="3.1">Provide accurate and complete information</view>
            <view class="sub-term" data-number="3.2">Maintain the security of your account credentials</view>
            <view class="sub-term" data-number="3.3">Notify us immediately of any unauthorized access</view>
            <view class="sub-term" data-number="3.4">Be responsible for all activities under your account</view>
            <view class="sub-term" data-number="3.5">Not share your account with others</view>
          </view>
          <view class="warning-box">
            <view class="warning-title">
              <text>⚠️ Security Warning</text>
            </view>
            <text class="warning-content">
              You are responsible for maintaining the confidentiality of your account. We will never ask for your password via email or phone.
            </text>
          </view>
        </view>
      </view>

      <!-- 条款4: 订阅和付款 -->
      <view class="content-card" id="subscription">
        <view class="term-section">
          <view class="term-title">
            <text class="term-number">4</text>
            <text>Subscription and Payment</text>
          </view>
          
          <view class="definition-list">
            <view class="definition-item">
              <text class="definition-term">Free Tier</text>
              <text class="definition-desc">Basic access to limited questions and features</text>
            </view>
            <view class="definition-item">
              <text class="definition-term">Silver Subscription</text>
              <text class="definition-desc">Full access to official DVSA questions and hazard perception videos</text>
            </view>
            <view class="definition-item">
              <text class="definition-term">Gold Subscription</text>
              <text class="definition-desc">Premium features including exclusive content and priority support</text>
            </view>
          </view>

          <text class="term-content">
            <text class="bold">Billing:</text> Subscriptions are billed monthly or annually through your app store account. Prices may vary by region and are subject to change with notice.
          </text>
          <text class="term-content">
            <text class="bold">Auto-Renewal:</text> Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.
          </text>
          <text class="term-content">
            <text class="bold">Refunds:</text> Refund policies are governed by the respective app store's terms and conditions.
          </text>
        </view>
      </view>

      <!-- 条款5: 用户行为 -->
      <view class="content-card" id="conduct">
        <view class="term-section">
          <view class="term-title">
            <text class="term-number">5</text>
            <text>User Conduct</text>
          </view>
          <text class="term-content">
            You agree not to engage in any of the following prohibited activities:
          </text>
          <view class="prohibited-list">
            <view class="prohibited-item">
              <text class="prohibited-icon">✕</text>
              <text>Use the Service for any illegal or unauthorized purpose</text>
            </view>
            <view class="prohibited-item">
              <text class="prohibited-icon">✕</text>
              <text>Reverse engineer or attempt to extract source code</text>
            </view>
            <view class="prohibited-item">
              <text class="prohibited-icon">✕</text>
              <text>Share or distribute premium content without authorization</text>
            </view>
            <view class="prohibited-item">
              <text class="prohibited-icon">✕</text>
              <text>Use automated systems or bots to access the Service</text>
            </view>
            <view class="prohibited-item">
              <text class="prohibited-icon">✕</text>
              <text>Interfere with or disrupt the Service or servers</text>
            </view>
            <view class="prohibited-item">
              <text class="prohibited-icon">✕</text>
              <text>Impersonate another person or entity</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 条款6: 内容和知识产权 -->
      <view class="content-card" id="content">
        <view class="term-section">
          <view class="term-title">
            <text class="term-number">6</text>
            <text>Content and Intellectual Property</text>
          </view>
          <text class="term-content">
            <text class="bold">Our Content:</text> All content provided through the Service, including questions, videos, images, and text, is owned by or licensed to us and is protected by intellectual property laws.
          </text>
          <text class="term-content">
            <text class="bold">User Content:</text> You retain ownership of any content you submit, but grant us a worldwide, non-exclusive license to use, reproduce, and display such content in connection with the Service.
          </text>
          <text class="term-content">
            <text class="bold">DVSA Content:</text> Official DVSA questions and materials are used under license and remain the property of the Driver and Vehicle Standards Agency.
          </text>
        </view>
      </view>

      <!-- 条款7: 免责声明和责任限制 -->
      <view class="content-card" id="liability">
        <view class="term-section">
          <view class="term-title">
            <text class="term-number">7</text>
            <text>Disclaimers and Limitation of Liability</text>
          </view>
          <view class="warning-box">
            <view class="warning-title">
              <text>⚠️ Important Disclaimer</text>
            </view>
            <text class="warning-content">
              The Service is provided "AS IS" without warranties of any kind. We do not guarantee that you will pass your driving theory test, and the Service should be used as a study aid only.
            </text>
          </view>
          <text class="term-content">
            <text class="bold">No Warranty:</text> We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.
          </text>
          <text class="term-content">
            <text class="bold">Limitation of Liability:</text> To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
          </text>
        </view>
      </view>

      <!-- 条款8: 终止 -->
      <view class="content-card" id="termination">
        <view class="term-section">
          <view class="term-title">
            <text class="term-number">8</text>
            <text>Termination</text>
          </view>
          <text class="term-content">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including:
          </text>
          <view class="sub-terms">
            <view class="sub-term" data-number="8.1">Breach of these Terms</view>
            <view class="sub-term" data-number="8.2">Fraudulent or illegal activity</view>
            <view class="sub-term" data-number="8.3">Non-payment of subscription fees</view>
            <view class="sub-term" data-number="8.4">Request by law enforcement</view>
          </view>
          <text class="term-content">
            Upon termination, your right to use the Service will cease immediately. You may delete your account at any time through the app settings.
          </text>
        </view>
      </view>

      <!-- 其他条款 -->
      <view class="content-card">
        <view class="term-section">
          <view class="term-title">
            <text class="term-number">9</text>
            <text>Additional Terms</text>
          </view>
          <text class="term-content">
            <text class="bold">Governing Law:</text> These Terms are governed by the laws of England and Wales.
          </text>
          <text class="term-content">
            <text class="bold">Changes to Terms:</text> We reserve the right to modify these Terms at any time. We will notify you of significant changes via the app or email.
          </text>
          <text class="term-content">
            <text class="bold">Severability:</text> If any provision of these Terms is found to be invalid, the remaining provisions will continue in full force.
          </text>
          <text class="term-content">
            <text class="bold">Entire Agreement:</text> These Terms constitute the entire agreement between you and DrivingPass regarding the Service.
          </text>
        </view>
      </view>

      <!-- 联系信息 -->
      <view class="content-card">
        <view class="contact-section">
          <text class="contact-title">Questions About These Terms?</text>
          <view class="contact-info">
            <text>If you have any questions about these Terms of Use, please contact us at:</text>
            <view style="margin-top: 20rpx;">
              <text class="bold">Email: </text>
              <text class="contact-link" @tap="sendEmail">info@drivingpass.co.uk</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部操作按钮 -->
      <view class="bottom-actions">
        <view class="action-buttons">
          <button class="decline-button" @tap="declineTerms">Decline</button>
          <button class="accept-button" @tap="acceptTerms">I Agree</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      effectiveDate: 'November 1, 2024'
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
    // 接受条款
    acceptTerms() {
      // 保存用户已接受条款
      uni.setStorageSync('termsAccepted', 'true');
      uni.setStorageSync('termsAcceptedDate', new Date().toISOString());
      uni.setStorageSync('termsVersion', '1.0');
      console.log('Terms accepted');
      this.goBack();
    },
    // 拒绝条款
    declineTerms() {
      // 用户拒绝条款
      uni.showModal({
        title: 'Confirm',
        content: 'If you decline the Terms of Use, you will not be able to use the app. Are you sure?',
        success: (res) => {
          if (res.confirm) {
            uni.setStorageSync('termsAccepted', 'false');
            // 可以导航到其他页面或退出应用
            uni.reLaunch({
              url: '/pages/index/index'
            });
          }
        }
      });
    }
  },
  onLoad() {
    console.log('Terms of Use page loaded');
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

/* 生效日期信息 */
.effective-date {
  background: linear-gradient(135deg, #FFF8E1 0%, #FFF3CD 100%);
  border-radius: 30rpx;
  padding: 30rpx 40rpx;
  margin-bottom: 40rpx;
  border: 2rpx solid #FFD700;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.date-icon {
  font-size: 40rpx;
  color: #F9A825;
}

.date-text {
  font-size: 28rpx;
  color: #666;
}

.date-value {
  color: #F9A825;
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

/* 条款导航 */
.terms-nav {
  margin-bottom: 50rpx;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.nav-item {
  padding: 24rpx;
  background: #F8F9FA;
  border-radius: 24rpx;
  font-size: 26rpx;
  color: #4A9EFF;
  text-align: center;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.nav-item:active {
  background: #4A9EFF;
  color: white;
  transform: scale(0.95);
}

/* 条款部分 */
.term-section {
  margin-bottom: 60rpx;
}

.term-number {
  display: inline-block;
  width: 60rpx;
  height: 60rpx;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  text-align: center;
  line-height: 60rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
  margin-right: 20rpx;
}

.term-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
}

.term-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
  margin-bottom: 30rpx;
  display: block;
}

.bold {
  font-weight: 600;
  color: #333;
}

/* 子条款列表 */
.sub-terms {
  margin: 30rpx 0;
}

.sub-term {
  position: relative;
  padding-left: 70rpx;
  margin-bottom: 24rpx;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.sub-term::before {
  content: attr(data-number);
  position: absolute;
  left: 0;
  top: 0;
  width: 48rpx;
  height: 48rpx;
  background: #F8F9FA;
  border-radius: 50%;
  text-align: center;
  line-height: 48rpx;
  font-size: 24rpx;
  color: #4A9EFF;
  font-weight: 600;
}

/* 警告框 */
.warning-box {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
  border: 2rpx solid #FF5252;
  border-radius: 30rpx;
  padding: 30rpx;
  margin: 40rpx 0;
}

.warning-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #D32F2F;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.warning-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

/* 信息框 */
.info-box {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border: 2rpx solid #2196F3;
  border-radius: 30rpx;
  padding: 30rpx;
  margin: 40rpx 0;
}

.info-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1976D2;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.info-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

/* 定义列表 */
.definition-list {
  background: #F8F9FA;
  border-radius: 24rpx;
  padding: 30rpx;
  margin: 30rpx 0;
}

.definition-item {
  margin-bottom: 24rpx;
}

.definition-item:last-child {
  margin-bottom: 0;
}

.definition-term {
  font-weight: 600;
  color: #333;
  font-size: 28rpx;
  margin-bottom: 8rpx;
  display: block;
}

.definition-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  display: block;
}

/* 禁止行为列表 */
.prohibited-list {
  background: linear-gradient(135deg, #FFF5F5 0%, #FFE0E0 100%);
  border-radius: 24rpx;
  padding: 30rpx;
  margin: 30rpx 0;
}

.prohibited-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #666;
}

.prohibited-icon {
  color: #FF5252;
  margin-right: 20rpx;
  font-weight: bold;
}

/* 联系信息 */
.contact-section {
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

.contact-info {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.contact-link {
  color: #4A9EFF;
  font-weight: 500;
  text-decoration: underline;
}

/* 底部操作 */
.bottom-actions {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40rpx;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 20%, white 100%);
  z-index: 20;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
}

.decline-button,
.accept-button {
  flex: 1;
  padding: 32rpx;
  border: none;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}

.decline-button {
  background: #F5F5F5;
  color: #666;
}

.accept-button {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  box-shadow: 0 12rpx 40rpx rgba(74, 158, 255, 0.35);
}

.decline-button:active,
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

  .nav-grid {
    grid-template-columns: 1fr;
  }
}
</style>