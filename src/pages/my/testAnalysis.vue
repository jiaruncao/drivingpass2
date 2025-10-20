<template>
	<view class="login-container">
		<!-- 返回按钮 -->
		<view class="tn-flex tn-flex-direction-row " style="margin-bottom: 48rpx;" :style="{ paddingTop: safeAreaTop + 'rpx' }">
			<view @click="handleBack" class="tn-flex tn-flex-direction-row">
				<u-icon name="arrow-leftward" size="24" color="#333"></u-icon>
				<text class="nav-title tn-padding-left-xs">Exam Analysis</text>
			</view>
		</view>

		<view class="content">
			<view class="student-report">
				<!-- 顶部信息区域 -->
				<view class="top-info tn-padding-left-sm tn-padding-right-sm">
					<view class="left-info ">
						<text class="student-name">Trainee：StormChaser</text>
                                                <text class="date">18/06/2025</text>
					</view>
					<view class="right-info tn-flex-direction-row tn-flex-row-between tn-flex">
						<view class="tn-flex tn-flex-direction-row tn-flex-row-between">
							<view></view>
							<view class="countdown tn-flex tn-flex-col-center tn-flex-row-center">
								<text class="tn-padding-left-xs tn-padding-right-xs">{{countdownDays}} days Left</text>
							</view>
						</view>
						<view class="tn-flex tn-flex-col-center tn-flex-row-center">
                                                        <text class="time-number">28/06/2025</text>
						</view>
						<view class="tn-padding-bottom-sm tn-flex tn-flex-col-center tn-flex-row-center">
							<text class="time-text">Test Date</text>
						</view>
					</view>
				</view>

				<!-- 预测通过率区域 -->
				<view class="pass-rate-section tn-padding-left-sm tn-padding-right-sm">
					<text class="section-title">Your Mock Exam Average</text>
					<view class="rate-info">
						<text class="rate-number tn-padding-right-sm">79%</text>
						<text class="rate-tip">"Your current average is below passing,Significant room for
							improvement</text>
					</view>
				</view>

				<view class="tn-flex" style="height: 20rpx; background-color: #F7F7F7;"></view>

				<!-- 统计卡片区域 -->
				<view
					class="tn-flex tn-flex-direction-row tn-flex-col-center tn-flex-row-center tn-padding-top-sm tn-padding-bottom-sm">
					<view class="tn-flex-1 tn-flex tn-flex-direction-column tn-flex-col-center tn-flex-row-center">
						<text class="card-number">972</text>
						<text class="card-text">Completed</text>
					</view>
					<view class="tn-flex-1 tn-flex tn-flex-direction-column tn-flex-col-center tn-flex-row-center">
						<text class="card-number">266</text>
						<text class="card-text">Unattempted</text>
					</view>
					<view class="tn-flex-1 tn-flex tn-flex-direction-column tn-flex-col-center tn-flex-row-center">
						<text class="card-number">15</text>
						<text class="card-text">Attempts</text>
					</view>
					<view class="tn-flex-1 tn-flex tn-flex-direction-column tn-flex-col-center tn-flex-row-center">
						<text class="card-number">10</text>
						<text class="card-text">Passes</text>
					</view>
				</view>

				<view class="tn-flex" style="height: 20rpx; background-color: #F7F7F7;"></view>

				<!-- 答题统计折线图区域 -->
				<view class="chart-section tn-flex tn-padding-sm">
					<text>Mock Exam Performance</text>
					<!-- <u-chart 
		           :canvasId="canvasId" 
		           :chartData="chartData" 
		           :opts="opts"
		         ></u-chart> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				countdownDays: 10, // 距离考试天数
				passRate: 70, // 预测通过率
				passRateWidth: '70%', // 进度条宽度，根据通过率计算
				pointLeft: '70%', // 标记点位置，根据通过率计算
			}
		},
		onReady() {
			// 可在此处根据实际数据初始化 chartData 等，比如从接口获取数据后更新
		},
		methods: {
			handleBack(){
				uni.navigateBack();
			}
		}
	};
</script>

<style scoped>
	page {
		background-color: #F7F7F7;
	}

	,

	.login-container {
		padding: 40rpx 30rpx;
		background: linear-gradient(180deg, #C5E3FF 0%, rgba(197, 227, 255, 0) 100%);
		min-height: 100vh;
	}

	.nav-title {
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}

	.content {
		/* padding-left: 30rpx;
		padding-right: 30rpx; */
	}


	.student-report {
		background-color: #fff;
		border-radius: 16rpx;
	}

	.top-info {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 30rpx;
	}

	.left-info {
		display: flex;
		flex-direction: column;
		padding-top: 53rpx;
	}

	.student-name {
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 10rpx;
	}

	.date {
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}

	.right-info {
		margin-top: 36rpx;
		width: 248rpx;
		display: flex;
		flex-direction: column;
		background: linear-gradient(0deg, #419FFF 0%, #70BAFF 100%);
		border-radius: 8rpx;
	}

	.countdown {
		background: #FF8D48;
		border-radius: 8rpx;
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 20rpx;
		color: #FFFFFF;
	}



	.time-number {
		font-family: Microsoft YaHei UI;
		font-weight: bold;
		font-size: 48rpx;
		color: #FFFFFF;
	}

	.time-text {
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 22rpx;
		color: #FFFFFF;


	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.pass-rate-section {
		margin-bottom: 30rpx;
	}

	.rate-info {
		display: flex;
		margin-bottom: 20rpx;
	}

	.rate-number {
		font-family: Microsoft YaHei UI;
		font-weight: bold;
		font-size: 68rpx;
		color: #FF8D48;
	}

	.rate-tip {
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 22rpx;
		color: #333333;
	}

	.rate-bar {
		position: relative;
		margin-top: 20rpx;
	}

	.rate-bg {
		height: 10rpx;
		background-color: #ccc;
		border-radius: 5rpx;
		overflow: hidden;
	}

	.rate-progress {
		height: 100%;
		background-color: #419FFF;
	}

	.rate-point {
		position: absolute;
		top: -10rpx;
		width: 20rpx;
		height: 20rpx;
		background-color: #419FFF;
		border-radius: 50%;
		transform: translateX(-50%);
	}

	.rate-label {
		display: flex;
		justify-content: space-between;
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #999;
	}

	.stats-card {
		display: flex;
		margin-bottom: 30rpx;
	}

	.card-item {
		text-align: center;
	}

	.card-number {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.card-text {
		font-size: 28rpx;
		color: #999;
	}

	.chart-section {
		margin-bottom: 30rpx;
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 20rpx;
		color: #333333;
	}
</style>