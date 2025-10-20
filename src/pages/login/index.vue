<template>
  <view class="app">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

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

/* 主容器 */
.container {
  flex: 1;
  padding: 40px 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 10;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

/* 登录卡片 */
.login-card {
  background: white;
  border-radius: 30px;
  padding: 35px 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.12);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
}

/* 标题区域 */
.welcome-section {
  text-align: center;
  margin-bottom: 28px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.welcome-subtitle {
  font-size: 16px;
  color: #666;
  line-height: 1.4;
  display: block;
}

/* 表单样式 */
.login-form {
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
  height: 100%;
  padding: 18px 22px;
  border: 2px solid #F0F0F0;
  border-radius: 20px;
  font-size: 16px;
  background: #FAFAFA;
  transition: all 0.3s ease;
  outline: none;
}

.input-field:focus {
  border-color: #4A9EFF;
  background: white;
  box-shadow: 0 0 0 4px rgba(74, 158, 255, 0.1);
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:active {
  background: #F5F5F5;
}

/* 辅助选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  margin-top: 5px;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
}

.checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid #4A9EFF;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.checkbox.checked {
  background: #4A9EFF;
}

.checkbox.checked::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.remember-text {
  font-size: 15px;
  color: #666;
  font-weight: 500;
}

.forgot-password {
  font-size: 15px;
  color: #4A9EFF;
  font-weight: 600;
  transition: all 0.3s ease;
}

.forgot-password:active {
  color: #2196F3;
}

/* 登录按钮 */
.login-button {
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
  gap: 8px;
}

.login-button:active {
  transform: scale(0.98);
}

.login-button.disabled {
  opacity: 0.6;
  transform: none;
}

/* 分割线 */
.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  gap: 15px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #E0E0E0;
}

.divider-text {
  font-size: 14px;
  color: #999;
  font-weight: 500;
}

/* 社交登录按钮 - 标准设计 */
.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}

/* Google 登录按钮 - 标准样式 */
.google-button {
  width: 100%;
  height: 50px;
  background: white;
  border: 1px solid #DADCE0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #3c4043;
  transition: all 0.2s ease;
}

.google-button:active {
  box-shadow: 0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15);
  background: #fafafa;
}

.google-button.disabled {
  opacity: 0.38;
}

.google-icon {
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPHBhdGggZD0iTTE3LjY0IDkuMjA0NTVjMC0uNjM5NDUtLjA1NzI3LTEuMjUzNjQtLjE2MzY0LTEuODQwOTFIOXY0LjEzNjM2aDQuODQ0NTVjLS4yMDQ1NSAxLjEwNDU1LS44Mjc3MyAyLjAzMTgyLTEuNzYzNjQgMi42NTY4MnY1LjE4MTgySDEzLjhWMTBzMCAwIDAtMWMxLjMxODY4LTEuMzI5MjggMi45ODg2NC0yLjEwNjczIDMuNzEwOTEtMi4xMDY3My4zNjM2NC0uMDkzNjQuODAyMjgtLjE2MjcgMS4yOTU0NS0uMjM5MDl6bS00LjMxODk1IDYuNjU0MDl2Mi4zNTQ1NWgtLjE3MjczYzEuNzU2ODItLjM2MTc0IDMuNDY4MTgtMS4yNzY3NCA0Ljg5MDkxLTIuNjIwNDVWMTUuMjVsLS4yNDEzOS0uMzA0NTVjLS40ODI3My43NDU0NS0xLjEwOTA5IDEuMzg1NDUtMS44NzI3MyAxLjg2MzY0LS4yNjI3My4xNjM2NC0uNjE4MTgtLjE2MzY0LTEuMDMwNDUtMS4wNzI3M3oiIGZpbGw9IiM0Mjg1RjQiLz4KICAgIDxwYXRoIGQ9Ik05IDE4YzIuNDMgMCA0LjQ2NzI3LS43OTM2NCA1Ljk1NjM2LTIuMTVsLTIuOTEzNjQtMi4yNDU0NUMxMC40MjE4MiAxNC42IDkuNzM2MzYgMTQuNzY3MjcgOSAxNC43NjcyN2MtMi4zMDk4MSAwLTQuMjUwMy0uNDU0NTUtNS45NDMxOC0xLjM4NTQ1TDUuMTc2MzYgMTEuNWMtLjMwNTA5LS4yNTkwOS0uNjE1OTEtLjUzNjM2LS45MTA5MS0uODM2MzZsLTIuNzgxODIgMi4xNTQ1NkMuMTI0NzMgMTUuNDk0IDQuMTI1IDI5IDkgMTh6IiBmaWxsPSIjMzRBODUzIi8+CiAgICA8cGF0aCBkPSJNMyA5YzAtMS4zOTA5MS4yNzI3My0yLjcxODE4Ljc2MzY0LTMuOTUxODJsLTIuNzgxODItMi4xNTQ1NXYyLjE1NDU1aC0uMDQzNjRjLS42NTkwOSAxLjIyNzI3LTEuMDM2MzYgMi42NDU0NS0xLjAzNjM2IDQuMTQ3MjdzLjM3NzI3IDIuOTE5MSAxLjAzNjM2IDQuMTQ3MjdsMi44MjU0NS0yLjE5ODkxQzMuMjcyNzMgMTEuNzE4MTggMyAxMC4zOTA5MSAzIDl6IiBmaWxsPSIjRkJCQzA1Ii8+CiAgICA8cGF0aCBkPSJNOSAzLjIzMTgyYzEuMjc1IDAgMi40MjMuNDY1IDMuMzE0IDEuMzk1bDIuNDg1LTIuNDc1QzEzLjQ2NS4yNzUgMTEuNDE5IDAgOSAwIDQuMTI1IDAgLjMxODc4IDMuNjc1IDAgOGwyLjc4MTgyIDIuMTU0NTVDNC43NDk3IDguNDU0NTUgNi42OTAyIDMuMjMxODIgOSAzLjIzMTgyeiIgZmlsbD0iI0VBNDMzNSIvPgogIDwvZz4KICA8L3N2Zz4K");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* Apple 登录按钮 - 标准样式 */
.apple-button {
  width: 100%;
  height: 50px;
  background: #000;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: white;
  transition: all 0.2s ease;
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

.apple-icon {
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyMCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTUuNjM0NSA2LjA5MjczQzE2LjUxNzEgNS4xNzI3MyAxNy4wNjI2IDMuODQzNjQgMTYuOTI2MiAyLjVDMTUuNzQwOCAyLjU4MTgyIDE0LjMzNzQgMy4yNTQ1NSAxMy40MjcxIDQuMjA5MDlDMTIuNTk5MSA1LjA2MzY0IDEyLjAzNTQgNi4zOTI3MyAxMi4xOTkgNy43MjcyN0MxMy41NDg0IDcuODQ1NDUgMTQuOTQzNiA3LjEwOTA5IDE1LjYzNDUgNi4wOTI3M1oiIGZpbGw9IndoaXRlIi8+CiAgPHBhdGggZD0iTTE3LjgxMDQgOC43MTgxOEMxNi4wNzc4IDcuODA5MDkgMTUuNjQzNiA1LjU4MTgyIDE3LjEwNzIgNC4yNzcyN0MxNy41NTk2IDMuNjkwOTEgMTguNzk5NSAzLjE5MDkxIDIwLjA3NTYgMy4xOTA5MUMyMC4xNjY5IDQuMjU5MDkgMTkuNzY4NyA5LjMzNjM2IDE5LjA3NzggNi4wODQ1NUMxOC4yNzI0IDYuOTY4MTggMTcuMDE0MSA3LjQ1IDEzIDdMMTUuNjI1IDguNjM2MzZDMTYuNjAzMSA4LjMzNjM2IDE3LjIzMDQgOC44NTQ1NSAxNy44MTA0IDguNzE4MThaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* 注册链接 */
.signup-section {
  text-align: center;
  padding-top: 15px;
  border-top: 1px solid #F0F0F0;
}

.signup-text {
  font-size: 15px;
  color: #666;
}

.signup-link {
  color: #4A9EFF;
  font-weight: 700;
  margin-left: 5px;
  transition: all 0.3s ease;
}

.signup-link:active {
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
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
    padding: 20px 15px;
  }
  
  .login-card {
    padding: 35px 25px;
    border-radius: 25px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .input-field {
    padding: 16px 18px;
  }
  
  .login-button {
    padding: 18px;
  }
  
  .google-button,
  .apple-button {
    height: 48px;
    font-size: 15px;
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