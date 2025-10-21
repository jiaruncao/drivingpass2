<template>
  <view class="app">
    <view class="container">
      <view class="login-card">
        <!-- 欢迎标题 -->
        <view class="welcome-section">
          <text class="welcome-title">Welcome Back</text>
          <text class="welcome-subtitle">Sign in to continue your driving theory test journey</text>
        </view>
        
        <!-- 错误/成功消息 -->
        <view v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </view>
        
        <view v-if="successMessage" class="success-message">
          {{ successMessage }}
        </view>

        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- 邮箱输入 -->
          <view class="input-group">
            <text class="input-label">Email Address</text>
            <input 
              type="email" 
              class="input-field" 
              v-model="loginForm.email"
              placeholder="Enter your email address"
              :disabled="isLoading"
            />
          </view>

          <!-- 密码输入 -->
          <view class="input-group">
            <text class="input-label">Password</text>
            <view class="password-container">
              <input 
                :type="showPassword ? 'text' : 'password'"
                class="input-field" 
                v-model="loginForm.password"
                placeholder="Enter your password"
                :disabled="isLoading"
              />
              <view 
                class="password-toggle"
                @tap="showPassword = !showPassword"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </view>
            </view>
          </view>

          <!-- 记住我和忘记密码 -->
          <view class="form-options">
            <view class="remember-checkbox" @tap="!isLoading && (loginForm.rememberMe = !loginForm.rememberMe)">
              <view class="checkbox" :class="{checked: loginForm.rememberMe}"></view>
              <text class="remember-text">Remember me</text>
            </view>
            <text class="forgot-password" @tap="handleForgotPassword">Forgot Password?</text>
          </view>

          <!-- 登录按钮 -->
          <view 
            class="login-button"
            :class="{disabled: isLoading}"
            @tap="handleLogin"
          >
            <view v-if="isLoading" class="loading"></view>
            <text>{{ isLoading ? 'Signing In...' : 'Sign In' }}</text>
          </view>
        </form>

        <!-- 分割线 -->
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">or continue with</text>
          <view class="divider-line"></view>
        </view>

        <!-- 社交登录 - 标准设计 -->
        <view class="social-login">
          <!-- Google 登录按钮 -->
          <view class="google-button" :class="{disabled: isLoading}" @tap="handleSocialLogin('google')">
            <view class="google-icon"></view>
            <text>Continue with Google</text>
          </view>
          
          <!-- Apple 登录按钮 -->
          <view class="apple-button" :class="{disabled: isLoading}" @tap="handleSocialLogin('apple')">
            <!-- <view class="apple-icon"></view> -->
            <u-icon name="apple-fill" color="#fff" size="28"></u-icon>
            <text>Continue with Apple</text>
          </view>
        </view>

        <!-- 注册链接 -->
        <view class="signup-section">
          <view class="signup-text">Don't have an account?</view>
          <view class="signup-link" @tap="handleSignUp">Create Account</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { userLogin } from '@/http/api/login.js';
export default {
  data() {
    return {
      isLoading: false, // 登录加载状态
      showPassword: false, // 密码显示状态
      errorMessage: '', // 错误消息
      successMessage: '', // 成功消息
      loginForm: {
        email: '', // 用户邮箱
        password: '', // 用户密码
        rememberMe: false // 记住我选项
      }
    }
  },
  methods: {
    // 处理登录提交
    async handleLogin() {
      this.clearMessages();
      
      // 基本验证
      if (!this.validateForm()) {
        return;
      }

      this.isLoading = true;

      try {
        // 模拟API调用
        const userInfo = await this.loginWithApi();
        // 缓存用户信息
        uni.setStorageSync('userInfo', userInfo);
        uni.setStorageSync('token', userInfo.token);
        // 登录成功处理
        this.successMessage = 'Login successful! Redirecting...';
        console.log('Login successful:', this.loginForm);
        
        // 延迟跳转以显示成功消息
        setTimeout(() => {
          // 这里可以跳转到主应用
          // uni.showToast({
          //   title: 'Login Success',
          //   icon: 'success'
          // });
          uni.setStorageSync('activeTab', 'discover')
          // 跳转到主页
          uni.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
        
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // 表单验证
    validateForm() {
      if (!this.loginForm.email.trim()) {
        this.errorMessage = 'Please enter your email address';
        return false;
      }
      
      if (!this.isValidEmail(this.loginForm.email)) {
        this.errorMessage = 'Please enter a valid email address';
        return false;
      }
      
      if (!this.loginForm.password.trim()) {
        this.errorMessage = 'Please enter your password';
        return false;
      }
      
      if (this.loginForm.password.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters';
        return false;
      }
      
      return true;
    },

    // 邮箱格式验证
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // 清除消息
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },

    // 处理忘记密码
    handleForgotPassword() {
      console.log('Forgot password clicked');
      // 这里可以跳转到忘记密码页面
      this.successMessage = 'Password reset link will be sent to your email';
      
      // 实际应用中可以跳转到忘记密码页面
      // uni.navigateTo({
      //   url: '/pages/forgot-password/forgot-password'
      // });
    },

    // 处理注册
    handleSignUp() {
      console.log('Sign up clicked');
      // 这里可以跳转到注册页面
      uni.navigateTo({
        url: '/pages/login/register'
      });
    },

    // 处理社交登录
    handleSocialLogin(provider) {
      if (this.isLoading) return;
      
      console.log(`Social login with ${provider}`);
      this.clearMessages();
      
      // 模拟社交登录流程
      this.successMessage = `Connecting with ${provider}...`;
      
      setTimeout(() => {
        uni.showToast({
          title: `${provider} login will be implemented`,
          icon: 'none'
        });
        this.clearMessages();
      }, 2000);
    },

    // 模拟API调用延迟
    simulateApiCall() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟登录验证 - 测试账号
          if (this.loginForm.email === 'test@example.com' && this.loginForm.password === 'password') {
            resolve();
          } else {
            reject(new Error('Invalid email or password. Try test@example.com / password'));
          }
        }, 2000);
      });
    },

    // 真实API调用示例
    async loginWithApi() {
      try {
        const response = await userLogin({ email: this.loginForm.email, password: this.loginForm.password })
        
        if (response.code !== 1) {
          throw new Error(response.msg || 'Login failed');
        }
        
        return response.data;

      } catch (error) {
        throw error;
      }
    }
  },

  onLoad() {
    // 页面加载完成后的初始化
    console.log('Login page loaded');
    
    // 检查是否已经登录
    const token = uni.getStorageSync('authToken') || uni.getStorageSync('tempAuthToken');
    if (token) {
      console.log('User already logged in');
      // 可以在这里验证token有效性并跳转
    }
    
    // 从页面参数获取邮箱（如果有）
    // 可以通过页面参数传递预填邮箱
  }
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
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  background: linear-gradient(180deg, rgba(227, 242, 253, 0.9) 0%, #ffffff 45%, #fff4f4 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  color: #333;
}

.container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8vh 6vw;
}

.login-card {
  width: 88vw;
  background: #ffffff;
  border-radius: 60rpx;
  padding: 72rpx 60rpx;
  box-shadow: 0 40rpx 90rpx rgba(74, 158, 255, 0.16);
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  position: relative;
  animation: slideUp 0.6s ease-out;
}

.login-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 8rpx;
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
}

.welcome-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.welcome-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #1f2937;
  word-break: break-word;
}

.welcome-subtitle {
  font-size: 28rpx;
  color: #64748b;
  line-height: 1.5;
  word-break: break-word;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.input-label {
  font-size: 28rpx;
  color: #475569;
  font-weight: 600;
}

.input-field {
  width: 100%;
  padding: 32rpx 40rpx;
  border: 2rpx solid #E2E8F0;
  border-radius: 44rpx;
  font-size: 30rpx;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #4A9EFF;
  background: #ffffff;
  box-shadow: 0 0 0 10rpx rgba(74, 158, 255, 0.12);
}

.password-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 24rpx;
  padding: 12rpx;
  color: #94a3b8;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24rpx;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.checkbox {
  width: 44rpx;
  height: 44rpx;
  border: 2rpx solid #4A9EFF;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  transition: background 0.3s ease;
  flex-shrink: 0;
}

.checkbox.checked {
  background: #4A9EFF;
}

.checkbox.checked::after {
  content: '✓';
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
}

.remember-text,
.forgot-password,
.divider-text,
.signup-text,
.signup-link {
  font-size: 26rpx;
  color: #475569;
  word-break: break-word;
}

.forgot-password {
  font-weight: 600;
  color: #2563eb;
}

.login-button {
  width: 100%;
  min-height: 108rpx;
  background: linear-gradient(135deg, #4A9EFF 0%, #1d4ed8 100%);
  color: #ffffff;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  box-shadow: 0 30rpx 60rpx rgba(74, 158, 255, 0.35);
  transition: transform 0.2s ease;
}

.login-button:active {
  transform: translateY(6rpx);
}

.login-button.disabled {
  opacity: 0.6;
  transform: none;
}

.divider {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.divider-line {
  flex: 1;
  height: 2rpx;
  background: #E2E8F0;
}

.social-login {
  display: grid;
  gap: 24rpx;
}

.google-button,
.apple-button {
  width: 100%;
  min-height: 104rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  font-size: 30rpx;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.google-button {
  background: #ffffff;
  border: 2rpx solid #e2e8f0;
  color: #1f2937;
  box-shadow: 0 12rpx 30rpx rgba(15, 23, 42, 0.08);
}

.google-button:active,
.apple-button:active {
  transform: translateY(4rpx);
}

.apple-button {
  background: #111827;
  color: #ffffff;
}

.signup-section {
  text-align: center;
  border-top: 2rpx solid #E2E8F0;
  padding-top: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.signup-link {
  color: #2563eb;
  font-weight: 700;
}

.loading {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.6);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message,
.success-message {
  padding: 28rpx 32rpx;
  border-radius: 32rpx;
  font-size: 26rpx;
  line-height: 1.4;
  word-break: break-word;
}

.error-message {
  background: rgba(254, 226, 226, 0.8);
  border: 2rpx solid #fecaca;
  color: #b91c1c;
}

.success-message {
  background: rgba(220, 252, 231, 0.9);
  border: 2rpx solid #bbf7d0;
  color: #047857;
}

image {
  max-width: 100%;
  height: auto;
}

.google-icon {
  width: 40rpx;
  height: 40rpx;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyMCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9"
    "aHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGNsaXAtcGF0aD1cIk0wIDAgMjAgMjRc"><path d="M19.6 10.2h-7.61v3.58h4.37c-.19 1.09-.88 2.01-1.89 2.63v2.18h3.06c1.79-1.65 2.81-4.09 2.81-6.97 0-.75-.07-1.47-.21-2.17z" fill="#4285F4"/><path d="M12 20c2.43 0 4.47-.81 5.96-2.21l-3.06-2.18c-.85.57-1.93.9-2.9.9-2.22 0-4.1-1.5-4.78-3.52H4.07v2.21C5.55 17.98 8.57 20 12 20z" fill="#34A853"/><path d="M7.22 12.99c-.19-.57-.3-1.18-.3-1.81 0-.63.11-1.24.3-1.81V7.16H4.07A7.978 7.978 0 0 0 3 11.18c0 1.29.31 2.52.86 3.63l3.36-1.82z" fill="#FBBC05"/><path d="M12 6.15c1.32 0 2.5.45 3.43 1.32l2.57-2.57C16.47 3.45 14.43 2.6 12 2.6 8.57 2.6 5.55 4.62 4.07 7.16l3.36 1.81c.68-2.02 2.56-3.52 4.78-3.52z" fill="#EA4335"/></g></svg>");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.apple-button u-icon {
  max-width: 100%;
  height: auto;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 768px) {
  .container {
    padding: 10vh 18vw;
  }

  .login-card {
    width: 60vw;
    border-radius: 48rpx;
    padding: 88rpx 72rpx;
  }
}
</style>
