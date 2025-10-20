import store from "@/store/index.js";
import http from "@/http/index.js";
import i18n from "@/i18n/i18n.js";
import {formatScore} from "@/utils/number";

/*
 * author：Gengbaodada
 * create by date：2024/11/11
 * content：toast全局应用
 */
function toast(title, icon = "none", duration = 3000) {
  if (title == "loading") {
    uni.showLoading({
      title: "加载中",
    });
  } else {
    uni.showToast({
      title,
      icon,
      duration,
    });
  }
}

/*
 * author：Gengbaodada
 * create by date：2024/11/11
 * content：文件上传
 */
async function upload(filePath) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: "http://driving.asszo.com/api/common/upload", // 上传图片的接口地址
      filePath: filePath, // 要上传的图片路径
      name: "file", // 服务器接收图片的字段名
      header: {
        token: uni.getStorageSync("token")
      },
      formData: {
        // 可以在这里添加额外的表单数据
      },
      success: (res) => {
        resolve(JSON.parse(res.data));
      },
    });
  });
}

/*
 * author：Gengbaodada
 * create by date：2025/07/18
 * content：全局切换语言
 */
function handleLanguage() {
  const newLang = i18n.locale === "en" ? "zh" : "en";
  i18n.locale = newLang;
}

/*
 * author：Gengbaodada
 * create by date：2024/06/07
 * content：格式化uview时间
 */
function formatDateToDDMMYYYY(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return typeof dateValue === "string" ? dateValue : "";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function handleTime(data) {
  return formatDateToDDMMYYYY(data);
}

function setStore(key, data) {
  if (!key) return;
  uni.setStorageSync(key, data);
}
function getStore(key) {
  if (!key) return;
  return uni.getStorageSync(key);
}
function removeStore(key) {
  if (!key) return;
  uni.removeStorageSync(key);
}
function clearStore() {
  const roleType = uni.getStorageSync("roleType");
  uni.clearStorageSync();
  if (roleType) {
    uni.setStorageSync("roleType", roleType);
  }
}


/**
 * 更新题目缓存数据
 * @param {String} storageKey 缓存键名
 * @param {Object} targetConditions 目标定位条件
 * @param {Object} updates 要更新的属性
 * @returns {Boolean} 是否更新成功
 */
function updateSubjectStorage(storageKey, targetConditions, updates) {
  try {
    const data = uni.getStorageSync(storageKey);
    if (!data || !Array.isArray(data)) {
      console.warn(`未找到缓存数据或数据格式错误: ${storageKey}`);
      return false;
    }
    
    const updatedData = deepUpdateSubjects(data, targetConditions, updates);
    
    console.log('updatedData', updatedData)
    
    uni.setStorageSync(storageKey, updatedData);
    return true;
  } catch (error) {
    console.error('更新缓存失败:', error);
    return false;
  }
}

/**
 * 专门处理题目数据的深度更新
 * @param {Array} subjects 题目数据
 * @param {Object} conditions 定位条件 {subjectId, cateId, questionId}
 * @param {Object} updates 要更新的属性
 * @returns {Array} 更新后的数据
 */
function deepUpdateSubjects(subjects, conditions, updates) {
  const { subjectId, cateId, questionId } = conditions;
  
  console.log('更新条件:', conditions);
  console.log('更新数据:', updates);
  // console.log('原始数据:', JSON.stringify(subjects, null, 2));
  
  const result = subjects.map(subject => {
    console.log('处理科目:', subject.id);
    
    // 检查科目匹配
    if (subjectId && subject.id != subjectId) {
      console.log('科目不匹配，跳过');
      return subject;
    }
    
    console.log('科目匹配，继续处理');
    let updatedSubject = { ...subject };
    
    // 如果需要处理分类
    if (subject.cate && (cateId || questionId)) {
      console.log('需要处理分类或题目');
      updatedSubject.cate = subject.cate.map(cate => {
        console.log('处理分类:', cate.id);
        
        // 检查分类匹配
        if (cateId && cate.id != cateId) {
          console.log('分类不匹配，跳过');
          return cate;
        }
        
        console.log('分类匹配，继续处理');
        let updatedCate = { ...cate };
        
        // 如果需要处理题目
        if (questionId && cate.question) {
          console.log('需要处理题目');
          updatedCate.question = cate.question.map(question => {
            console.log('处理题目:', question.id);
            
            // 检查题目匹配
            if (questionId && question.id != questionId) {
              console.log('题目不匹配，跳过');
              return question;
            }
            
            console.log('题目匹配，更新题目');
            // 题目匹配，更新题目
            return { ...question, ...updates };
          });
        } else if (!questionId) {
          // 只更新分类本身
          console.log('更新分类本身');
          updatedCate = { ...cate, ...updates };
        }
        
        return updatedCate;
      });
    } else if (!cateId && !questionId) {
      // 只更新科目本身
      console.log('更新科目本身');
      updatedSubject = { ...subject, ...updates };
    }
    
    return updatedSubject;
  });
  
  // console.log('更新结果:', JSON.stringify(result, null, 2));
  return result;
}

/**
 * 添加错题到错题集（如果不存在则添加）
 * @param {Array} subjects 科目数据
 * @param {String|Number} subjectId 科目ID
 * @param {String|Number} cateId 分类ID
 * @param {String|Number} questionId 题目ID
 * @returns {Boolean} 是否成功添加
 */
function addWrongQuestionIfNotExists(subjects, subjectId, cateId, questionId) {
  try {
    const subject = subjects.find(item => item.id == subjectId);
    if (!subject) return false;
    
    const cate = subject.cate.find(cate => cate.id == cateId);
    if (!cate) return false;
    
    // 初始化 wrongQuestions 数组
    if (!cate.wrongQuestions) {
      cate.wrongQuestions = [];
    }
    
    // 检查是否已存在，不存在则添加
    if (!cate.wrongQuestions.includes(questionId)) {
      cate.wrongQuestions.push(questionId);
      return true;
    }
    
    return false; // 已存在，未添加
  } catch (error) {
    console.error('添加错题失败:', error);
    return false;
  }
}

/**
 * 从错题集中移除题目（如果存在则移除）
 * @param {Array} subjects 科目数据
 * @param {String|Number} subjectId 科目ID
 * @param {String|Number} cateId 分类ID
 * @param {String|Number} questionId 题目ID
 * @returns {Boolean} 是否成功移除
 */
function removeWrongQuestionIfExists(subjects, subjectId, cateId, questionId) {
  try {
    const subject = subjects.find(item => item.id == subjectId);
    if (!subject) return false;
    
    const cate = subject.cate.find(cate => cate.id == cateId);
    if (!cate) return false;
    
    // 检查错题集是否存在
    if (!cate.wrongQuestions || !Array.isArray(cate.wrongQuestions)) {
      return false;
    }
    
    // 检查是否存在于错题集中
    const index = cate.wrongQuestions.findIndex(id => id == questionId);
    if (index !== -1) {
      // 存在则移除
      cate.wrongQuestions.splice(index, 1);
      return true;
    }
    
    return false; // 不存在，未移除
  } catch (error) {
    console.error('移除错题失败:', error);
    return false;
  }
}

/**
 * 安全的获取错题列表方法
 * @param {Array} subjects 科目数据
 * @param {String|Number} subjectId 科目ID
 * @param {String|Number} cateId 分类ID
 * @returns {Array} 错题列表
 */
function getWrongList(subjects, subjectId, cateId) {
  try {
    const subject = subjects.find(item => item.id == subjectId);
    if (!subject) return [];
    
    const cate = subject.cate.find(cate => cate.id == cateId);
    if (!cate) return [];
    
    return cate.wrongQuestions || [];
  } catch (error) {
    console.error('获取错题列表失败:', error);
    return [];
  }
}

/**
 * 添加答题到答题记录（如果不存在则添加）
 * @param {Array} subjects 科目数据
 * @param {String|Number} subjectId 科目ID
 * @param {String|Number} cateId 分类ID
 * @param {String|Number} questionId 题目ID
 * @returns {Boolean} 是否成功添加
 */
function addQuestionIfNotExists(subjects, subjectId, cateId, questionId) {
  try {
    const subject = subjects.find(item => item.id == subjectId);
    if (!subject) return false;
    
    const cate = subject.cate.find(cate => cate.id == cateId);
    if (!cate) return false;
    
    // 初始化 answerQuestions 数组
    if (!cate.answerQuestions) {
      cate.answerQuestions = [];
    }
    
    // 检查是否已存在，不存在则添加
    if (!cate.answerQuestions.includes(questionId)) {
      cate.answerQuestions.push(questionId);
      return true;
    }
    
    return false; // 已存在，未添加
  } catch (error) {
    console.error('添加错题失败:', error);
    return false;
  }
}

/**
 * 从答题记录中移除题目（如果存在则移除）
 * @param {Array} subjects 科目数据
 * @param {String|Number} subjectId 科目ID
 * @param {String|Number} cateId 分类ID
 * @param {String|Number} questionId 题目ID
 * @returns {Boolean} 是否成功移除
 */
function removeQuestionIfExists(subjects, subjectId, cateId, questionId) {
  try {
    const subject = subjects.find(item => item.id == subjectId);
    if (!subject) return false;
    
    const cate = subject.cate.find(cate => cate.id == cateId);
    if (!cate) return false;
    
    // 检查错题集是否存在
    if (!cate.answerQuestions || !Array.isArray(cate.answerQuestions)) {
      return false;
    }
    
    // 检查是否存在于错题集中
    const index = cate.answerQuestions.findIndex(id => id == questionId);
    if (index !== -1) {
      // 存在则移除
      cate.answerQuestions.splice(index, 1);
      return true;
    }
    
    return false; // 不存在，未移除
  } catch (error) {
    console.error('移除错题失败:', error);
    return false;
  }
}

/**
 * 获取当前题目在分类中的下标
 * @param {Array} subjects 科目数据
 * @param {String|Number} subjectId 科目ID
 * @param {String|Number} cateId 分类ID
 * @returns {Number} 题目下标，找不到返回-1
 */
function getCurrentQuestionIndex(subjects, subjectId, cateId) {
  try {
    const subject = subjects.find(item => item.id == subjectId);
    if (!subject) return -1;
    
    const cate = subject.cate.find(cate => cate.id == cateId);
    if (!cate || !cate.question || !Array.isArray(cate.question)) return -1;
    
    const currentQuestionIndex = cate.current_question_index;
    if (!currentQuestionIndex) return 0; // 如果没有设置当前题目，默认返回第一题下标
    
    return currentQuestionIndex;
  } catch (error) {
    console.error('获取当前题目下标失败:', error);
    return -1;
  }
}

/**
 * 通过题目ID获取题目下标
 * @param {Array} subjects 科目数据
 * @param {String|Number} subjectId 科目ID
 * @param {String|Number} cateId 分类ID
 * @param {String|Number} questionId 题目ID
 * @returns {Number} 题目下标，找不到返回-1
 */
function getQuestionIndexById(subjects, subjectId, cateId, questionId) {
  try {
    const subject = subjects.find(item => item.id == subjectId);
    if (!subject) return -1;
    
    const cate = subject.cate.find(cate => cate.id == cateId);
    if (!cate || !cate.question || !Array.isArray(cate.question)) return -1;
    
    return cate.question.findIndex(question => question.id == questionId);
  } catch (error) {
    console.error('通过ID获取题目下标失败:', error);
    return -1;
  }
}

const utils = {
  clearStore,
  getStore,
  handleTime,
  formatDateToDDMMYYYY,
  removeStore,
  setStore,
  toast,
  upload,
  handleLanguage,
  updateSubjectStorage,
  addWrongQuestionIfNotExists,
  removeWrongQuestionIfExists,
  addQuestionIfNotExists,
  getCurrentQuestionIndex,
  getWrongList,
  formatScore
};

export default utils;
