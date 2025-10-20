/*
 * author：Gengbaodada
 * create by date：2024/11/11
 * content 试题相关接口统一管理
 */
import fly from "@/utils/request.js";

/*
 * author：huanyun
 * create by date：2025/08/06
 * kind 题库:QUESTION
 * subject_id 科目id
 */
export function getThree(params) {
  return fly.post("/exam/cate/getThree", params);
}
/*
 * author：huanyun
 * create by date：2025/08/06
 * cate_id  按分类查询 分类ID
 * keyword  搜索关键词
 * kind 试题类型查询 Judge:判断题 Single:单选题 Multi:多选题
 * mode normal=普通模式，random=随机查询
 * page_count 每页数量
 * user_id 传入用户ID时，查询收藏状态
 */
export function startTrain(params) {
  return fly.post("/exam/question/train", params);
}
/*
 * author：huanyun
 * create by date：2025/08/06
 * question_id  题目ID
 */
export function collectAdd(params) {
  return fly.post("/exam/question/collectAdd", params);
}
/*
 * author：huanyun
 * create by date：2025/08/06
 * question_id  题目ID
 */
export function collectCancel(params) {
  return fly.post("/exam/question/collectCancel", params);
}
/*
 * author：huanyun
 * create by date：2025/08/06
 * question_id  题目ID
 * user_answer 用户答案
 * source 默认TRAINING:练习
 */
export function wrongAdd(params) {
  return fly.post("/exam/question/wrongAdd", params);
}
/*
 * author：huanyun
 * create by date：2025/08/06
 * question_id  题目ID
 */
export function wrongDelete(params) {
  return fly.post("/exam/question/wrongDelete", params);
}

/*
 * author：huanyun
 * create by date：2025/08/06
 * question_id  题目ID
 */
export function recordAdd(params) {
  return fly.post("/exam/question/recordAdd", params);
}

/*
 * 模考试卷列表
 * author：huanyun
 * create by date：2025/08/12
 */
export function getPaperList(params) {
  return fly.post("/exam/paper/index", params);
}
/*
 * 模考试卷取题
 * author：huanyun
 * paper_id 试卷ID
 * create by date：2025/08/12
 */
export function getExamQuestion(params) {
  return fly.post("/exam/paper/getExamQuestion", params);
}
/*
 * 模考试卷交卷
 * author：huanyun
 * paper_id 试卷ID
 * questions ["[{'id' => '试题ID', 'answer' => '答案'}]"]
 * create by date：2025/08/12
 */
export function submitExamQuestion(params) {
  return fly.post("/exam/paper/submit", params);
}

/*
 * 获取错题列表
 * author：huanyun
 * create by date：2025/08/12
 */
export function getWrongList(params) {
  return fly.post("/exam/question/wrongList", params);
}
/*
 * 获取收藏列表
 * author：huanyun
 * create by date：2025/08/12
 */
export function getCollectList(params) {
  return fly.post("/exam/question/collectList", params);
}
/*
 * 搜索试题
 * author：huanyun
 * keyword 关键词
 * create by date：2025/08/12
 */
export function searchApi(params) {
  return fly.post("/exam/question/search", params);
}

/*
 * 试题详情
 * author：huanyun
 * id 题目ID
 * create by date：2025/08/12
 */
export function getQuestionDetail(params) {
  return fly.post("/exam/question/detail", params);
}

/*
 * 错题分布
 * author：huanyun
 * create by date：2025/08/12
 */
export function mistakeDistribution(params) {
  return fly.post("/exam/question/mistakeDistribution", params);
}
/*
 * 错题分布
 * author：huanyun
 * cate_id 分类ID
 * create by date：2025/08/12
 */
export function mistakeDistributionDetail(params) {
  return fly.post("/exam/question/mistakeDistributionDetail", params);
}
/*
 * 收藏分布
 * author：huanyun
 * create by date：2025/08/16
 */
export function savedDistribution(params) {
  return fly.post("/exam/question/savedDistribution", params);
}
/*
 * 收藏分布详情
 * author：huanyun
 * create by date：2025/08/16
 */
export function savedDistributionDetail(params) {
  return fly.post("/exam/question/savedDistributionDetail", params);
}
/*
 * 自动移除错题
 * author：huanyun
 * auto_remove_wrong 自动移除错题 1:是 2:否
 * create by date：2025/08/16
 */
export function setAutoRemoveWrong(params) {
  return fly.post("/exam/question/autoRemoveWrong", params);
}

/*
 * 清空所有收藏
 * author：huanyun
 * create by date：2025/08/16
 */
export function collectClear(params) {
  return fly.post("/exam/question/collectClear", params);
}

/*
 * 模拟考统计
 * author：huanyun
 * create by date：2025/08/16
 */
export function getTestStatistics(params) {
  return fly.post("/exam/grade/testStatistics", params);
}
/*
 * 查询今日试题练习次数
 * author：huanyun
 * subject_id
 * create by date：2025/08/16
 */
export function getTestRecordCount(params) {
  return fly.post("/exam/question/testRecordCount", params);
}

/*
 * 试题练习记录
 * author：huanyun
 * subject_id
 * time_used
 * wrong_answers
 * accuracy
 * total
 * create by date：2025/08/16
 */
export function testRecordAdd(params) {
  return fly.post("/exam/question/testRecordAdd", params);
}
