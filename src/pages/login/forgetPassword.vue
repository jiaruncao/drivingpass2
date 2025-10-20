<template>
  <view class="app">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
    </view>

    <view class="container">
      <view class="forgot-card">
        <!-- 图标区域 -->
        <view class="icon-section">
          <view class="forgot-icon">{{ currentStep === 1 ? '🔒' : '🔑' }}</view>
        </view>

        <!-- 步骤1: 发送验证码 -->
        <view v-if="currentStep === 1" class="step-content">
          <!-- 标题区域 -->
          <view class="title-section">
            <text class="title">Forgot Password?</text>
          </view>
          
          <!-- 错误/成功消息 -->
          <view v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </view>
          
          <view v-if="successMessage" class="success-message">
            {{ successMessage }}
          </view>

          <!-- 邮箱输入表单 -->
          <view class="forgot-form">
            <!-- 邮箱输入 -->
            <view class="input-group">
              <text class="input-label">Email Address</text>
              <input 
                type="email" 
                class="input-field" 
                v-model="email"
                placeholder="Enter your email address"
                :disabled="isLoading"
              />
            </view>

            <!-- 发送验证码按钮 -->
            <view 
              class="action-button"
              :class="{disabled: isLoading}"
              @tap="handleSendCode"
            >
              <view v-if="isLoading" class="loading"></view>
              <text>{{ isLoading ? 'Sending...' : 'Send Code' }}</text>
            </view>
          </view>

          <!-- 返回登录 -->
          <view class="back-to-login">
            <text class="back-text">Remember your password?</text>
            <text class="login-link" @tap="goToLogin">Back to Login</text>
          </view>
        </view>

        <!-- 步骤2: 验证码和重设密码 -->
        <view v-if="currentStep === 2" class="step-content">
          <!-- 标题区域 -->
          <view class="title-section">
            <text class="title">Reset Password</text>
            <text class="subtitle">Enter the verification code sent to {{ email }}</text>
          </view>
          
          <!-- 错误/成功消息 -->
          <view v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </view>
          
          <view v-if="successMessage" class="success-message">
            {{ successMessage }}
          </view>

          <!-- 重设密码表单 -->
          <view class="forgot-form">
            <!-- 验证码输入 -->
            <view class="input-group">
              <text class="input-label">Verification Code</text>
              <input 
                type="text" 
                class="input-field code-input" 
                v-model="verificationCode"
                placeholder="000000"
                maxlength="6"
                :disabled="isLoading"
              />
            </view>

            <!-- 新密码输入 -->
            <view class="input-group">
              <text class="input-label">New Password</text>
              <view class="password-container">
                <input 
                  :type="showNewPassword ? 'text' : 'password'"
                  class="input-field" 
                  v-model="newPassword"
                  placeholder="Enter your new password"
                  :disabled="isLoading"
                />
                <view 
                  class="password-toggle"
                  @tap="showNewPassword = !showNewPassword"
                >
                  {{ showNewPassword ? '👁️' : '👁️‍🗨️' }}
                </view>
              </view>
            </view>

            <!-- 确认新密码输入 -->
            <view class="input-group">
              <text class="input-label">Confirm New Password</text>
              <view class="password-container">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="input-field" 
                  v-model="confirmPassword"
                  placeholder="Confirm your new password"
                  :disabled="isLoading"
                />
                <view 
                  class="password-toggle"
                  @tap="showConfirmPassword = !showConfirmPassword"
                >
                  {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
                </view>
              </view>
            </view>

            <!-- 重设密码按钮 -->
            <view 
              class="action-button"
              :class="{disabled: isLoading}"
              @tap="handleResetPassword"
            >
              <view v-if="isLoading" class="loading"></view>
              <text>{{ isLoading ? 'Resetting...' : 'Reset Password' }}</text>
            </view>
          </view>

          <!-- 重新发送验证码 -->
          <view class="resend-section">
            <text class="resend-text">Didn't receive the code?</text>
            <text 
              class="resend-link"
              :class="{disabled: resendCountdown > 0}"
              @tap="handleResendCode"
            >
              <text v-if="resendCountdown > 0" class="countdown">Resend in {{ resendCountdown }}s</text>
              <text v-else>Resend Code</text>
            </text>
          </view>

          <!-- 返回上一步 -->
          <view class="back-to-login">
            <text class="back-text">Want to change email?</text>
            <text class="login-link" @tap="goBackToStep1">Go Back</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 1, // 当前步骤：1-发送验证码，2-重设密码
      isLoading: false, // 加载状态
      errorMessage: '', // 错误消息
      successMessage: '', // 成功消息
      email: '', // 用户邮箱
      verificationCode: '', // 验证码
      newPassword: '', // 新密码
      confirmPassword: '', // 确认新密码
      showNewPassword: false, // 新密码显示状态
      showConfirmPassword: false, // 确认密码显示状态
      resendCountdown: 0, // 重发倒计时
      resendTimer: null // 倒计时定时器
    }
  },
  methods: {
    // 处理发送验证码
    async handleSendCode() {
      this.clearMessages();
      
      // 基本验证
      if (!this.validateEmail()) {
        return;
      }

      this.isLoading = true;

      try {
        // 模拟API调用
        await this.simulateApiCall('send');

        // 发送成功处理
        this.successMessage = 'Verification code sent successfully!';
        console.log('Verification code sent to:', this.email);
        
        // 进入下一步
        setTimeout(() => {
          this.currentStep = 2;
          this.clearMessages();
          this.startResendCountdown();
        }, 1500);
        
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // 处理重设密码
    async handleResetPassword() {
      this.clearMessages();
      
      // 基本验证
      if (!this.validateResetForm()) {
        return;
      }

      this.isLoading = true;

      try {
        // 模拟API调用
        await this.simulateApiCall('reset');

        // 重设成功处理
        this.successMessage = 'Password reset successfully! Redirecting to main app...';
        console.log('Password reset successful');
        
        // 延迟跳转到主应用
        setTimeout(() => {
          uni.showToast({
            title: 'Password reset successful!',
            icon: 'success'
          });
          
          // 跳转到主应用首页
          uni.switchTab({
            url: '/pages/index/index'
          });
          
          // 或者跳转到登录页面
          // uni.redirectTo({
          //   url: '/pages/login/login'
          // });
        }, 2000);
        
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // 邮箱验证
    validateEmail() {
      if (!this.email.trim()) {
        this.errorMessage = 'Please enter your email address';
        return false;
      }
      
      if (!this.isValidEmail(this.email)) {
        this.errorMessage = 'Please enter a valid email address';
        return false;
      }
      
      return true;
    },

    // 重设表单验证
    validateResetForm() {
      if (!this.verificationCode.trim()) {
        this.errorMessage = 'Please enter the verification code';
        return false;
      }
      
      if (this.verificationCode.length !== 6) {
        this.errorMessage = 'Verification code must be 6 digits';
        return false;
      }
      
      if (!this.newPassword.trim()) {
        this.errorMessage = 'Please enter your new password';
        return false;
      }
      
      if (this.newPassword.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters';
        return false;
      }
      
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return false;
      }
      
      return true;
    },

    // 邮箱格式验证
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // 处理重新发送验证码
    async handleResendCode() {
      if (this.resendCountdown > 0) return;
      
      this.clearMessages();
      this.isLoading = true;

      try {
        await this.simulateApiCall('send');
        this.successMessage = 'Verification code resent successfully!';
        this.startResendCountdown();
        
        setTimeout(() => {
          this.clearMessages();
        }, 3000);
        
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // 开始重发倒计时
    startResendCountdown() {
      this.resendCountdown = 60;
      this.resendTimer = setInterval(() => {
        this.resendCountdown--;
        if (this.resendCountdown <= 0) {
          clearInterval(this.resendTimer);
        }
      }, 1000);
    },

    // 返回第一步
    goBackToStep1() {
      this.currentStep = 1;
      this.clearMessages();
      this.clearResetForm();
    },

    // 清除重设表单数据
    clearResetForm() {
      this.verificationCode = '';
      this.newPassword = '';
      this.confirmPassword = '';
      if (this.resendTimer) {
        clearInterval(this.resendTimer);
        this.resendCountdown = 0;
      }
    },

    // 清除消息
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },

    // 返回上一页
    goBack() {
      if (this.currentStep === 2) {
        this.goBackToStep1();
      } else {
        uni.navigateBack({
          fail: () => {
            console.log('No previous page, navigate to login');
            uni.redirectTo({
              url: '/pages/login/login'
            });
          }
        });
      }
    },

    // 跳转到登录页面
    goToLogin() {
      console.log('Navigate to login page');
      uni.redirectTo({
        url: '/pages/login/login'
      });
    },

    // 模拟API调用延迟
    simulateApiCall(action) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (action === 'send') {
            // 模拟发送验证码
            if (this.email) {
              resolve();
            } else {
              reject(new Error('Failed to send verification code'));
            }
          } else if (action === 'reset') {
            // 模拟重设密码验证 - 测试验证码: 123456
            if (this.verificationCode === '123456' && this.newPassword) {
              resolve();
            } else {
              reject(new Error('Invalid verification code or password. Try code: 123456'));
            }
          }
        }, 2000);
      });
    },

    // 真实API调用示例 - 发送验证码
    async sendVerificationCodeWithApi() {
      try {
        const response = await uni.request({
          url: '/api/auth/send-verification-code',
          method: 'POST',
          data: {
            email: this.email
          }
        });

        if (response[1].statusCode !== 200) {
          throw new Error(response[1].data.message || 'Failed to send verification code');
        }

        return response[1].data;

      } catch (error) {
        throw error;
      }
    },

    // 真实API调用示例 - 重设密码
    async resetPasswordWithApi() {
      try {
        const response = await uni.request({
          url: '/api/auth/reset-password',
          method: 'POST',
          data: {
            email: this.email,
            verificationCode: this.verificationCode,
            newPassword: this.newPassword
          }
        });

        if (response[1].statusCode !== 200) {
          throw new Error(response[1].data.message || 'Failed to reset password');
        }

        return response[1].data;

      } catch (error) {
        throw error;
      }
    }
  },

  onLoad(options) {
    // 页面加载完成后的初始化
    console.log('Forgot password page loaded');
    
    // 从页面参数获取邮箱（如果有）
    if (options.email) {
      this.email = options.email;
    }
  },

  onUnload() {
    // 页面卸载时清理定时器
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
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

/* Header */
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
  border-radius: 50%;
  transition: all 0.3s ease;
}

.back-button:active {
  background: rgba(0,0,0,0.05);
}

/* 主容器 */
.container {
  flex: 1;
  padding: 20px 20px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 10;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

/* 忘记密码卡片 */
.forgot-card {
  background: white;
  border-radius: 30px;
  padding: 35px 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.12);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

.forgot-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
}

/* 图标区域 */
.icon-section {
  text-align: center;
  margin-bottom: 25px;
}

.forgot-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  box-shadow: 0 8px 24px rgba(74, 158, 255, 0.3);
}

/* 步骤内容容器 */
.step-content {
  width: 100%;
}

/* 标题区域 */
.title-section {
  text-align: center;
  margin-bottom: 28px;
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.subtitle {
  font-size: 15px;
  color: #666;
  line-height: 1.5;
  display: block;
}

/* 表单样式 */
.forgot-form {
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 18px;
}

.input-label {
  font-size: 15px;
  color: #666;
  margin-bottom: 10px;
  display: block;
  font-weight: 500;
}

.input-field {
  width: 100%;
  padding: 18px 22px;
  border: 2px solid #F0F0F0;
  border-radius: 20px;
  font-size: 16px;
  background: #FAFAFA;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #4A9EFF;
  background: white;
  box-shadow: 0 0 0 4px rgba(74, 158, 255, 0.1);
}

/* 验证码输入特殊样式 */
.code-input {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 8px;
  color: #4A9EFF;
}

/* 密码输入框容器 */
.password-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  font-size: 20px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.password-toggle:active {
  background: #F5F5F5;
}

/* 操作按钮 */
.action-button {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(74, 158, 255, 0.4);
  transition: all 0.3s ease;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.action-button:active {
  transform: scale(0.98);
}

.action-button.disabled {
  opacity: 0.6;
  transform: none;
}

/* 重新发送验证码 */
.resend-section {
  text-align: center;
  margin-bottom: 20px;
}

.resend-text {
  font-size: 14px;
  color: #666;
}

.resend-link {
  color: #4A9EFF;
  font-weight: 600;
  margin-left: 5px;
  transition: all 0.3s ease;
}

.resend-link:active {
  color: #2196F3;
}

.resend-link.disabled {
  color: #ccc;
}

/* 倒计时 */
.countdown {
  color: #4A9EFF;
  font-weight: 600;
}

/* 返回链接 */
.back-to-login {
  text-align: center;
  padding-top: 15px;
  border-top: 1px solid #F0F0F0;
}

.back-text {
  font-size: 15px;
  color: #666;
}

.login-link {
  color: #4A9EFF;
  font-weight: 700;
  margin-left: 5px;
  transition: all 0.3s ease;
}

.login-link:active {
  color: #2196F3;
}

/* 加载状态 */
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { 
    transform: rotate(360deg); 
  }
}

/* 错误消息 */
.error-message {
  background: #FFE5E5;
  color: #D32F2F;
  padding: 15px 18px;
  border-radius: 15px;
  font-size: 14px;
  margin-bottom: 25px;
  border: 1px solid #FFCDD2;
  font-weight: 500;
}

/* 成功消息 */
.success-message {
  background: #E8F5E8;
  color: #2E7D32;
  padding: 15px 18px;
  border-radius: 15px;
  font-size: 14px;
  margin-bottom: 25px;
  border: 1px solid #C8E6C9;
  font-weight: 500;
}

/* 移动端优化 */
@media screen and (max-width: 480px) {
  .container {
    max-width: 350px;
    padding: 20px 15px 40px;
  }
  
  .forgot-card {
    padding: 30px 25px;
    border-radius: 25px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .forgot-icon {
    width: 70px;
    height: 70px;
    font-size: 32px;
  }
}

/* 页面加载动画 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>