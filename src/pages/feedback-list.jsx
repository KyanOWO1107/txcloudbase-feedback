// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast } from '@/components/ui';

import { PasswordGate } from '@/components/PasswordGate';
import { FeedbackList } from '@/components/FeedbackList';

// 需要密码保护的反馈列表页面
export default function FeedbackListPage(props) {
  const {
    toast
  } = useToast();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  // 修复缺少 status 字段的记录
  const fixMissingStatus = async records => {
    const updatePromises = [];
    for (const record of records) {
      if (!record.status) {
        updatePromises.push(props.$w.cloud.callDataSource({
          dataSourceName: 'feedback-db',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              status: 'pending',
              resolvedTime: null
            },
            filter: {
              where: {
                $and: [{
                  _id: {
                    $eq: record._id
                  }
                }]
              }
            }
          }
        }));
      }
    }
    if (updatePromises.length > 0) {
      try {
        await Promise.all(updatePromises);
        return updatePromises.length;
      } catch (error) {
        console.error('修复数据失败:', error);
      }
    }
    return 0;
  };

  // 加载反馈列表
  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      // 使用 callDataSource API 操作数据模型
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'feedback-db',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {}
          },
          orderBy: [{
            time: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 100,
          pageNumber: 1,
          getCount: true
        }
      });
      const feedbackData = result.records || [];

      // 检查并修复缺少 status 字段的记录
      const fixedCount = await fixMissingStatus(feedbackData);
      if (fixedCount > 0) {
        toast({
          title: '数据已修复',
          description: `已自动修复 ${fixedCount} 条记录的默认状态`
        });
        // 重新加载数据以确保最新状态
        const updatedResult = await props.$w.cloud.callDataSource({
          dataSourceName: 'feedback-db',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {}
            },
            orderBy: [{
              time: 'desc'
            }],
            select: {
              $master: true
            },
            pageSize: 100,
            pageNumber: 1,
            getCount: true
          }
        });
        setFeedbacks(updatedResult.records || []);
      } else {
        setFeedbacks(feedbackData);
      }
    } catch (error) {
      toast({
        title: '加载失败',
        description: error.message || '无法加载反馈列表',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 删除反馈
  const handleDeleteFeedback = async feedbackId => {
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'feedback-db',
        methodName: 'wedaDeleteV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: feedbackId
                }
              }]
            }
          }
        }
      });
      await loadFeedbacks();
    } catch (error) {
      throw error;
    }
  };

  // 切换反馈状态（已解决/未解决）
  const handleToggleStatus = async feedback => {
    try {
      const currentStatus = feedback.status || 'pending';
      const newStatus = currentStatus === 'resolved' ? 'pending' : 'resolved';
      await props.$w.cloud.callDataSource({
        dataSourceName: 'feedback-db',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: newStatus,
            resolvedTime: newStatus === 'resolved' ? new Date() : null
          },
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: feedback._id
                }
              }]
            }
          }
        }
      });
      await loadFeedbacks();
    } catch (error) {
      throw error;
    }
  };

  // 下载汇总文件
  const handleDownload = async () => {
    try {
      // 使用 callDataSource API 获取所有反馈数据
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'feedback-db',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {}
          },
          orderBy: [{
            time: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 200,
          pageNumber: 1,
          getCount: true
        }
      });

      // 生成CSV文件
      const records = result.records || [];
      const headers = ['用户名', 'UUID', 'IP地址', '反馈内容', '提交时间', '状态'];
      const csvContent = [headers.join(','), ...records.map(record => {
        const status = record.status || 'pending';
        return [record.username || '', record.uuid || '', record.ip || '', record.message || '', record.time || '', status === 'resolved' ? '已解决' : '待处理'].join(',');
      })].join('\n');

      // 创建Blob对象并下载
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `反馈汇总_${new Date().toLocaleDateString('zh-CN')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      throw error;
    }
  };

  // 页面加载时获取反馈列表
  useEffect(() => {
    loadFeedbacks();
  }, []);

  // 受保护的内容
  const ProtectedContent = () => {
    return <div className="min-h-screen bg-[#F5F5F5] font-[Courier_New]">
      <div className="border-4 border-black bg-black text-white py-6 px-8">
        <h1 className="text-4xl font-bold font-[Space_Mono] tracking-tight">
          📋 用户反馈列表
        </h1>
        <p className="mt-2 font-[Courier_New] text-gray-300">
          查看和管理所有用户提交的反馈信息
        </p>
      </div>

      <div className="container mx-auto px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <FeedbackList feedbacks={feedbacks} onDownload={handleDownload} loading={loading} onDelete={handleDeleteFeedback} onToggleStatus={handleToggleStatus} />

          {/* 返回链接 */}
          <div className="mt-8 text-center">
            <button onClick={() => props.$w.utils.navigateTo({
              pageId: 'feedback',
              params: {}
            })} className="inline-flex items-center px-6 py-3 bg-white border-3 border-black hover:bg-gray-100 font-bold font-[Space_Mono] transition-colors">
              ← 返回首页
            </button>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <div className="border-t-4 border-black bg-white py-4 px-8 mt-8">
        <div className="text-center font-[Courier_New] text-sm text-gray-600">
          <p>
            Copyright © 2026 Kyanetwork. All Rights Reserved.
          </p>
          <p>
            💡 提示：管理员可以查看所有反馈记录并下载汇总文件
          </p>
          <p className="mt-1">
            📅 当前时间：{new Date().toLocaleString('zh-CN')}
          </p>
        </div>
      </div>
    </div>;
  };

  // 使用密码门保护整个页面
  return <PasswordGate title="需要管理员权限">
    <ProtectedContent />
  </PasswordGate>;
}