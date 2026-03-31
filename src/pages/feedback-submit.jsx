// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { useToast } from '@/components/ui';

import { FeedbackForm } from '@/components/FeedbackForm';

// 简化的提交反馈页面
export default function FeedbackSubmitPage(props) {
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);

  // 生成UUID（基于用户名和IP）
  const generateUUID = async username => {
    try {
      // 尝试获取客户端真实IP地址
      let ip = '127.0.0.1';
      try {
        // 通过API服务获取客户端IP（如果可用）
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          if (ipData.ip) {
            ip = ipData.ip;
          }
        }
      } catch (ipError) {
        // IP获取失败时，使用本地IP
        console.log('无法获取外网IP，使用本地IP');
      }

      // 基于用户名和IP生成UUID
      const uuid = `${username}-${ip}`;
      return {
        uuid,
        ip
      };
    } catch (error) {
      // 错误处理：使用本地IP
      const ip = '127.0.0.1';
      const uuid = `${username}-${ip}-${Date.now()}`;
      return {
        uuid,
        ip
      };
    }
  };

  // 提交反馈
  const handleFeedbackSubmit = async data => {
    setLoading(true);
    try {
      const {
        uuid,
        ip
      } = await generateUUID(data.username);

      // 使用云开发原生 API 操作 NoSQL 数据库
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('feedback-db');
      const result = await collection.add({
        username: data.username,
        message: data.message,
        ip: ip,
        uuid: uuid,
        time: new Date()
      });
      toast({
        title: '提交成功',
        description: '您的反馈已成功提交，感谢您的反馈！'
      });
    } catch (error) {
      toast({
        title: '提交失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-[#F5F5F5] font-[Courier_New]">
    <div className="border-4 border-black bg-black text-white py-6 px-8">
      <h1 className="text-4xl font-bold font-[Space_Mono] tracking-tight">
        📝 提交用户反馈
      </h1>
      <p className="mt-2 font-[Courier_New] text-gray-300">
        请填写下面的表单提交反馈
      </p>
    </div>

    <div className="container mx-auto px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <FeedbackForm onSubmit={handleFeedbackSubmit} />

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
          💡 提示：系统会自动根据您的用户名和IP地址生成唯一标识符（UUID）
        </p>
        <p className="mt-1">
          📅 当前时间：{new Date().toLocaleString('zh-CN')}
        </p>
      </div>
    </div>
  </div>;
}