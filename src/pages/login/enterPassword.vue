<template>
	<view class="login-container">
		<!-- 返回按钮 -->
		<view class="back-button" @click="handleBack" :style="{ paddingTop: safeAreaTop + 'rpx' }">
			<u-icon name="arrow-leftward" size="24" color="#333"></u-icon>
		</view>


        <view class="content">
			<!-- 标题 -->
			<view class="title">Set New Password</view>
			
			<!-- 邮箱输入框 -->
			<view class="input-group tn-flex-direction-column" style="padding-top: 130rpx;">
				<view class="tn-flex tn-flex-direction-row tn-flex-col-center tn-flex-row-center">
					<image src="/static/register/rigister_pwd.png" style="width: 37rpx; height: 43rpx;"></image>
					<u-input v-model="email" placeholder="set password" class="input" :border="false"></u-input>
				</view>
				<u-line color="#D7D7D7"></u-line>
			</view>
			
			<!-- 密码输入框 -->
			<view class="input-group tn-flex-direction-column">
				<view class="tn-flex tn-flex-direction-row">
					<view class="tn-flex tn-flex-direction-row tn-flex-row-between tn-flex-col-center tn-flex-row-cente">
						<view class="tn-flex tn-flex-direction-row tn-flex-col-center tn-flex-row-center">
							<image src="/static/register/rigister_pwd.png" style="width: 37rpx; height: 43rpx;"></image>
							<u-input v-model="password" placeholder="reset password" class="input" :border="false"
								password></u-input>
						</view>
					</view>					
				</view>
				<u-line color="#D7D7D7"></u-line>
			</view>
			
			<!-- 登录按钮 -->
			<u-button class="signin-button" @click="handleSignIn">Done</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				email: '', // 邮箱
				password: '' // 密码
			};
		},
		methods: {
			// 返回
			handleBack() {
				uni.navigateBack();
			},
			// 登录
			handleSignIn() {
				if (!this.email || !this.password) {
					uni.showToast({
						title: 'Please enter email and password',
						icon: 'none'
					});
					return;
				}
				// 调用登录接口
				console.log('Email:', this.email);
				console.log('Password:', this.password);
				// 模拟登录成功
				uni.showToast({
					title: 'Sign In Success',
					icon: 'success'
				});
			}
		}
	};
</script>

<style scoped>
	.login-container {
		padding: 40rpx 30rpx;
		background: linear-gradient(to bottom right, #e6f7ff, #fff0f0);
		min-height: 100vh;
	}
	
	.content{
		padding-left: 45rpx;
		padding-right: 94rpx;
	}

	.back-button {
		margin-bottom: 60rpx;
	}

	.title {
		font-family: Microsoft YaHei UI;
		font-weight: bold;
		font-size: 48rpx;
		color: #333333;
		padding-left: 107rpx;
	}

	.input-group {
		display: flex;
		border-radius: 8rpx;
	}

	.input {
		flex: 1;
		height: 80rpx;
	}

	.signin-button {
		margin-top: 128rpx;
		height: 87rpx;
		background: linear-gradient(90deg, #67A6FE 0%, #4180FF 100%);
		border-radius: 43rpx;
		color: #fff;
	}
	
	.get-code{
		width: 212rpx;
		height: 69rpx;
		background: #FFFFFF;
		border-radius: 35rpx;
		border: 1rpx solid #419FFF;
		
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 26rpx;
		color: #419FFF;
	}

	
</style>