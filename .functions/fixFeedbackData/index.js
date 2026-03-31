// 云函数：修复反馈数据，为缺少 status 和 resolvedTime 字段的记录补充默认值
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    const collection = db.collection('feedback-db');
    
    // 查找所有缺少 status 字段的记录
    const result = await collection.where({
      status: _.exists(false)
    }).get();
    
    const records = result.data || [];
    const updatePromises = [];
    
    // 为每条缺少 status 的记录补充默认值
    for (const record of records) {
      updatePromises.push(
        collection.doc(record._id).update({
          status: 'pending',
          resolvedTime: null
        })
      );
    }
    
    // 批量更新
    await Promise.all(updatePromises);
    
    return {
      success: true,
      message: `成功更新 ${records.length} 条记录`,
      updatedCount: records.length
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || '更新失败',
      error: error
    };
  }
};
