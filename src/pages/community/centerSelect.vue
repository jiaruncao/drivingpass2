<template>
	<view class="container">
		<u-navbar leftText="Link test center" :safeAreaInsetTop="true" :autoBack="true">
			<view class="u-nav-slot" slot="right">
				<u-icon name="search" size="18" color="#000000" @click="searchClick()"></u-icon>
			</view>
		</u-navbar>

		<view class="content" :style="{ paddingTop: safeAreaTop + 'rpx' }">

		</view>

		<view v-for="(item, index) in textCenterList" :key="index">
			<view class="tn-flex tn-flex-direction-row" @click="textcenterClick(index)">
				<view class="tn-flex-5">
					<!-- 左侧图片和标签 -->
					<view class="left-section tn-padding-left-sm tn-padding-bottom-sm">
						<image class="center-photo" :src="item.cover_image" mode="aspectFill"></image>
						<view class="photo-tag">Center Photos</view>
					</view>
				</view>
				<view class="tn-flex-5">
					<view class="right-section tn-flex tn-padding-left tn-padding-top-sm tn-flex-direction-column">
						<text class="center-text">{{ item.name }}</text>
						<text class="center-text">{{ item.contents }}</text>
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
				textCenterList: [{
						"id": 3,
						"name": "Test Center 2",
						"contents": "Test Center 2",
						"cover_image": "http://driving.asszo.com/uploads/20250725/6f7ec2114363d045656b3e3ebf9cd7a4.png"
					},
					{
						"id": 2,
						"name": "Test Center 1",
						"contents": "Test Center 1",
						"cover_image": "http://driving.asszo.com/uploads/20250725/66178e414f2c9fdcdf39ffb6fdfa747e.png"
					}
				]
			};
		},
		methods: {
			textcenterClick(index){
		        uni.$emit('centerSelectBack',{data: this.textCenterList[index]});
				uni.navigateBack();
			}
		},
	}
</script>

<style>
        .container {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 100vh;
                background-color: #fff;
                padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
        }

        .content {
                padding-top: calc(env(safe-area-inset-top) + 64rpx);
                display: flex;
                flex-direction: column;
                gap: 32rpx;
        }

	.left-section {
		position: relative;
		width: 100%;
	}

        .center-photo {
                width: 100%;
                max-width: 100%;
                height: 200rpx;
                border-radius: 16rpx;
                object-fit: cover;
        }

        .photo-tag {
                position: absolute;
                top: 0;
                right: 0;
                background-color: #ff9800;
                color: #fff;
                font-size: 24rpx;
                padding: 4rpx 8rpx;
                border-radius: 8rpx;
        }

        .center-text {
                font-size: 28rpx;
                color: #333;
                line-height: 1.5;
                word-break: break-word;
        }
</style>