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
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #E3F2FD 0%, #FFFFFF 55%, #FFF4F4 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  color: #333;
}

.container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  background: #fff;
  border-radius: 60rpx;
  padding: 70rpx 60rpx;
  box-shadow: 0 30rpx 80rpx rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  animation: slideUp 0.6s ease-out;
}

.welcome-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.welcome-title {
  font-size: 56rpx;
  font-weight: 700;
  color: #333;
}

.welcome-subtitle {
  font-size: 32rpx;
  color: #666;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.input-label {
  font-size: 30rpx;
  color: #666;
  font-weight: 500;
}

.input-field {
  width: 100%;
  padding: 36rpx 44rpx;
  border: 2rpx solid #F0F0F0;
  border-radius: 40rpx;
  font-size: 32rpx;
  background: #FAFAFA;
  transition: all 0.3s ease;
  outline: none;
}

.input-field:focus {
  border-color: #4A9EFF;
  background: #fff;
  box-shadow: 0 0 0 8rpx rgba(74, 158, 255, 0.1);
}

.password-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 36rpx;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  font-size: 40rpx;
  padding: 16rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:active {
  background: #F5F5F5;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10rpx;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.checkbox {
  width: 44rpx;
  height: 44rpx;
  border: 2rpx solid #4A9EFF;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  flex-shrink: 0;
}

.checkbox.checked {
  background: #4A9EFF;
}

.checkbox.checked::after {
  content: '✓';
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
}

.remember-text {
  font-size: 30rpx;
  color: #666;
  font-weight: 500;
}

.forgot-password {
  font-size: 30rpx;
  color: #4A9EFF;
  font-weight: 600;
}

.login-button {
  width: 100%;
  min-height: 96rpx;
  padding: 0 36rpx;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: #fff;
  border: none;
  border-radius: 40rpx;
  font-size: 36rpx;
  font-weight: 600;
  box-shadow: 0 20rpx 60rpx rgba(74, 158, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.login-button:active {
  transform: scale(0.98);
}

.login-button.disabled {
  opacity: 0.6;
  transform: none;
}

.divider {
  display: flex;
  align-items: center;
  margin: 40rpx 0;
  gap: 30rpx;
}

.divider-line {
  flex: 1;
  height: 2rpx;
  background: #E0E0E0;
}

.divider-text {
  font-size: 28rpx;
  color: #999;
  font-weight: 500;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.google-button,
.apple-button {
  width: 100%;
  min-height: 96rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.google-button {
  background: #fff;
  border: 2rpx solid #DADCE0;
  color: #3c4043;
}

.google-button:active {
  box-shadow: 0 2rpx 4rpx rgba(60, 64, 67, 0.3), 0 2rpx 6rpx rgba(60, 64, 67, 0.15);
  background: #fafafa;
}

.google-button.disabled {
  opacity: 0.38;
}

.google-icon {
  width: 40rpx;
  height: 40rpx;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPHBhdGggZD0iTTE3LjY0IDkuMjA0NTVjMC0uNjM5NDUtLjA1NzI3LTEuMjUzNjQtLjE2MzY0LTEuODQwOTFIOXY0LjEzNjM2aDQuODQ0NTVjLS4yMDQ1NSAxLjEwNDU1LS44Mjc3MyAyLjAzMTgyLTEuNzYzNjQgMi42NTY4MnY1LjE4MTgySDEzLjhWMTBzMCAwIDAtMWMxLjMxODY4LTEuMzI5MjggMi45ODg2NC0yLjEwNjczIDMuNzEwOTEtMi4xMDY3My4zNjM2NC0uMDkzNjQuODAyMjgtLjE2MjcgMS4yOTU0NS0uMjM5MDl6bS00LjMxODk1IDYuNjU0MDl2Mi4zNTQ1NWgtLjE3MjczYzEuNzU2ODItLjM2MTc0IDMuNDY4MTgtMS4yNzY3NCA0Ljg5MDkxLTIuNjIwNDVWMTUuMjVsLS4yNDEzOS0uMzA0NTVjLS40ODI3My43NDU0NS0xLjEwOTA5IDEuMzg1NDUtMS44NzI3MyAxLjg2MzY0LS4yNjI3My4xNjM2NC0uNjE4MTgtLjE2MzY0LTEuMDMwNDUtMS4wNzI3M3oiIGZpbGw9IiM0Mjg1RjQiLz4KICAgIDxwYXRoIGQ9Ik05IDE4YzIuNDMgMCA0LjQ2NzI3LS43OTM2NCA1Ljk1NjM2LTIuMTVsLTIuOTEzNjQtMi4yNDU0NUMxMC40MjE4MiAxNC42IDkuNzM2MzYgMTQuNzY3MjcgOSAxNC43NjcyN2MtMi4zMDk4MSAwLTQuMjUwMy0uNDU0NTUtNS45NDMxOC0xLjM4NTQ1TDQuNzE3NjM2IDExLjVjLS4zMDUwOS0uMjU5MDktLjYxNTkxLS41MzYzNi0uOTEwOTEtLjgzNjM2bC0yLjc4MTgyIDIuMTU0NTZDMS4xMjQ3MyAxNS40OTQgNC4xMjUgMjkgOSAxOHoiIGZpbGw9IiMzNEE4NTMiLz4KICAgIDxwYXRoIGQ9Ik0zIDljMC0xLjM5MDkxLjI3MjczLTIuNzE4MTguNzYzNjQtMy45NTE4MmwtMi43ODE4Mi0yLjE1NDU1djIuMTU0NTVoLS4wNDM2NGMtLjY1OTA5IDEuMjI3MjctMS4wMzYzNiAyLjY0NTQ1LTEuMDM2MzYgNC4xNDcyN3MuMzc3MjcgMi45MTkxIDEuMDM2MzYgNC4xNDcyN2wyLjgyNTQ1LTIuMTk4OTFDMy4yNzI3MyAxMS43MTgxOCAzIDEwLjM5MDkxIDMgOXoiIGZpbGw9IiNGQkJDMDUiLz4KICAgIDxwYXRoIGQ9Ik05IDMuMjMxODJjMS4yNzUgMCAyLjQyMy40NjUgMy4zMTQgMS4zOTVsMi40ODUtMi40NzVDMTMuNDY1LjI3NSAxMS40MTkgMCA5IDAgNC4xMjUgMCAuMzE4NzggMy42NzUgMCA4bDIuNzgxODIgMi4xNTQ1NUM0Ljc0OTcgOC40NTQ1NSA2LjY5MDIgMy4yMzE4MiA5IDMuMjMxODJ6IiBmaWxsPSIjRUE0MzM1Ii8+CiAgPC9nPgogIDwvc3ZnPgo=");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.apple-button {
  background: #000;
  border: none;
  color: #fff;
}

.apple-button:active {
  transform: scale(0.98);
  background: #333;
}

.apple-button.disabled {
  opacity: 0.6;
  transform: none;
  background: #666;
}

.signup-section {
  text-align: center;
  padding-top: 30rpx;
  border-top: 2rpx solid #F0F0F0;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.signup-text {
  font-size: 30rpx;
  color: #666;
}

.signup-link {
  color: #4A9EFF;
  font-weight: 700;
  font-size: 32rpx;
}

.loading {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message,
.success-message {
  padding: 30rpx 36rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  border-width: 2rpx;
  border-style: solid;
  font-weight: 500;
}

.error-message {
  background: #FFE5E5;
  color: #D32F2F;
  border-color: #FFCDD2;
}

.success-message {
  background: #E8F5E8;
  color: #2E7D32;
  border-color: #C8E6C9;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(60rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 100rpx 10vw;
    justify-content: center;
  }

  .login-card {
    width: 60vw;
  }
}
</style>
