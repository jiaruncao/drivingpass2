<template>
	<view class="container">
		<u-navbar leftText="Switch Question Bank" :safeAreaInsetTop="true" :autoBack="true">
		</u-navbar>
		<view class="content tn-flex tn-padding-sm tn-flex-direction-column">
			<text class="title">Question Bank Type</text>
		</view>
		<view class="type-list tn-padding-sm">
			<view v-for="(item, index) in typeList" :key="index" class="type-item"
				:class="{ active: selectedType === index }" @click="handleTypeClick(index)">
				<text>{{ item }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typeList: ['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5'], // 题库类型列表
				selectedType: 0 // 默认选中第一个类型
			};
		},
		methods: {
			// 点击类型项
			handleTypeClick(index) {
				this.selectedType = index;
				// 可以在这里添加点击后的逻辑，例如跳转到对应的题库页面
				console.log('Selected type:', this.typeList[index]);
			}
		}
	};
</script>

<style>
	page {
		background-color: #F7F7F7;
	}

	.container {
		background-color: white;
	}

	.content {
		margin-top: 64px;
	}

	.title {
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}

	.type-list {
		display: flex;
		flex-wrap: wrap;
	}

	.type-item {
		padding: 15rpx 30rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		background-color: #f5f5f5;
		border-radius: 8rpx;
		font-size: 28rpx;
		color: #666;
	}

	.type-item.active {
		background-color: #e6f7ff;
		color: #1890ff;
	}
</style>