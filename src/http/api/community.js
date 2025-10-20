import fly from "@/utils/request.js";
/*
 * author：Gengbaodada
 * create by date：2024/06/11
 * content：获取主题列表
 */


export function userFollowedList(params) {
  return fly.get("user/userFollowedList", params, {
     otherQuery: {
     
     },
  });
}

/*
 * 查询分类列表
 * author：huanyun
 * create by date：2025/08/16
 */
export function queryPostCategory(params) {
  return fly.post("/exam/forum/queryPostCategory", params);
}


/*
 * 关注/取消关注
 * author：huanyun
 * follow_user_id 关注/取消关注用户ID
 * create by date：2025/08/16
 */
export function userFollowed(params) {
  return fly.post("/exam/user/userFollowed", params);
}


export function roomIndex(params) {
  return fly.get("room/index", params, {
     otherQuery: {
     
     },
  });
}
/*
 * 添加标签
 * author：huanyun
 * tag 标签
 * create by date：2025/08/17
 */
export function addTag(params) {
  return fly.post("/exam/forum/addTags", params);
}
/*
 * 查询标签
 * author：huanyun
 * create by date：2025/08/17
 */
export function queryTags(params) {
  return fly.post("/exam/forum/queryTags", params);
}

/*
 * 发布帖子
 * author：huanyun
 * question_id试题ID 默认0 传值则评论试题
 * content内容
 * room_id关联考场ID
 * tag_ids标签ID(多个用,隔开)
 * photo_url照片url数组
 * video_url 视频url数组
 * ip 发布帖子IP
 * create by date：2025/08/17
 */
export function createPost(params) {
  return fly.post("/exam/forum/createPost", params);
}

export function queryPostList(params) {
  return fly.post("/exam/forum/queryPostList", params, {});
}
/*
 * 点赞/取消点赞帖子
 * author：huanyun
 * post_id 帖子ID
 * create by date：2025/08/16
 */
export function supportPost(params) {
  return fly.post("/exam/forum/supportPost", params, {});
}

/*
 * 收藏/取消收藏帖子
 * author：huanyun
 * post_id 帖子ID
 * create by date：2025/08/16
 */
export function collectPost(params) {
  return fly.post("/exam/forum/collectPost", params);
}

/*
 * 回复帖子
 * author：huanyun
 * post_id 帖子ID
 * content 内容
 * pid 父级评论ID(为空则评论帖子)
 * create by date：2025/08/16
 */
export function replyPost(params) {
  return fly.post("/exam/forum/replyPost", params);
}
/*
 * 查询帖子详情
 * author：huanyun
 * post_id 帖子ID
 * create by date：2025/08/16
 */
export function queryPostDetail(params) {
  return fly.post("/exam/forum/queryPostDetail", params);
}
/*
 * 点赞/取消点赞评论
 * author：huanyun
 * post_id 帖子ID
 * reply_id 评论ID
 * create by date：2025/08/16
 */
export function supportReply(params) {
  return fly.post("/exam/forum/supportReply", params);
}

export function collectList(params) {
  return fly.get("question/collectList", params, {
     otherQuery: {
     
     },
  });
}
/*
 * 查询考场列表
 * author：huanyun
 * create by date：2025/08/16
 */
export function getCenterIndex(params) {
  return fly.post("/exam/room/index", params);
}
/*
 * 查询用户社区信息
 * author：huanyun
 * create by date：2025/08/16
 */
export function queryUserInfo(params) {
  return fly.post("/exam/forum/queryUserInfo", params);
}
/*
 * 查询收藏帖子列表
 * size
 * page
 * author：huanyun
 * create by date：2025/08/16
 */
export function querySavedPostList(params) {
  return fly.post("/exam/forum/querySavedPostList", params);
}
