// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { ArrowRight, Send, List, Shield, Lock } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

// 反馈系统入口页面
export default function FeedbackLandingPage(props) {
  return <div className="min-h-screen bg-[#F5F5F5] font-[Courier_New]">
    <div className="border-4 border-black bg-black text-white py-12 px-8">
      <h1 className="text-5xl font-bold font-[Space_Mono] tracking-tight mb-4">
        🎯 用户反馈收集系统
      </h1>
      <p className="mt-2 font-[Courier_New] text-lg text-gray-300 max-w-3xl">
        通过反馈系统，您可以轻松提交反馈，我之后会查看和解决反馈信息。
      </p>
      <p>
        By Kyan v.s. Kyanetwork
      </p>
    </div>

    <div className="container mx-auto px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* 提交反馈卡片 */}
        <div className="border-4 border-black bg-white p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow">
          <div className="flex items-center mb-6">
            <div className="bg-[#00B4D8] border-3 border-black p-4 mr-4">
              <Send className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-[Space_Mono]">
                提交反馈
              </h2>
              <p className="font-[Courier_New] text-gray-600">
                所有用户都可以访问
              </p>
            </div>
          </div>

          <p className="font-[Courier_New] text-base text-gray-700 mb-8">
            请填写表单提交您的意见和反馈。系统会自动根据您的用户名和IP地址生成唯一标识符（UUID），帮助我们更好地管理反馈信息。
          </p>

          <Button onClick={() => props.$w.utils.navigateTo({
            pageId: 'feedback-submit',
            params: {}
          })} className="w-full bg-[#00B4D8] border-3 border-black hover:bg-[#0096C7] font-bold text-lg font-[Space_Mono] py-4">
            立即提交反馈
            <ArrowRight className="ml-2" />
          </Button>
        </div>

        {/* 反馈列表卡片 */}
        <div className="border-4 border-black bg-white p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow">
          <div className="flex items-center mb-6">
            <div className="bg-black border-3 border-black p-4 mr-4">
              <List className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-[Space_Mono]">
                查看反馈列表
              </h2>
              <p className="font-[Courier_New] text-gray-600 flex items-center">
                <Lock className="mr-1" size={14} />
                需要管理员密码
              </p>
            </div>
          </div>

          <p className="font-[Courier_New] text-base text-gray-700 mb-8">
            管理员可以查看所有反馈记录，包括用户名、UUID、IP地址、反馈内容和提交时间。支持下载汇总文件。
          </p>

          <Button onClick={() => props.$w.utils.navigateTo({
            pageId: 'feedback-list',
            params: {}
          })} className="w-full bg-black border-3 border-black hover:bg-gray-800 font-bold text-lg font-[Space_Mono] py-4">
            <Shield className="mr-2" />
            访问反馈列表
          </Button>
        </div>
      </div>

      {/* 功能说明 */}
      <div className="mt-12 max-w-5xl mx-auto">
        <div className="border-4 border-black bg-white p-8">
          <h3 className="text-2xl font-bold font-[Space_Mono] mb-6 pb-4 border-b-4 border-black">
            📋 系统功能说明
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-[#00B4D8] text-white font-bold font-[Space_Mono] rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-[Courier_New] font-bold text-lg mb-1">自动生成 UUID</h4>
                <p className="font-[Courier_New] text-gray-600">
                  基于用户名和IP地址自动生成唯一标识符，无需手动输入
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-[#00B4D8] text-white font-bold font-[Space_Mono] rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-[Courier_New] font-bold text-lg mb-1">实时数据存储</h4>
                <p className="font-[Courier_New] text-gray-600">
                  所有反馈实时保存到云数据库，数据安全可靠
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-[#00B4D8] text-white font-bold font-[Space_Mono] rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-[Courier_New] font-bold text-lg mb-1">管理员权限保护</h4>
                <p className="font-[Courier_New] text-gray-600">
                  反馈列表需要密码验证才能访问，保护用户隐私
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-[#00B4D8] text-white font-bold font-[Space_Mono] rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-[Courier_New] font-bold text-lg mb-1">反馈信息导出</h4>
                <p className="font-[Courier_New] text-gray-600">
                  支持一键下载反馈汇总文件，方便数据分析和备份
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 返回首页按钮 */}
      <div className="mt-12 text-center">
        <button onClick={() => props.$w.utils.navigateTo({
          pageId: 'feedback',
          params: {}
        })} className="inline-flex items-center px-8 py-3 bg-white border-3 border-black hover:bg-gray-100 font-bold font-[Space_Mono] transition-colors">
          ← 返回首页
        </button>
      </div>
    </div>

    {/* 页脚 */}
    <div className="border-t-4 border-black bg-white py-4 px-8 mt-8">
      <div className="text-center font-[Courier_New] text-sm text-gray-600">
        <p>
          Copyright © 2026 Kyanetwork. All Rights Reserved.
        </p>
        <p className="mt-1">
          📅 当前时间：{new Date().toLocaleString('zh-CN')}
        </p>
      </div>
    </div>
  </div>;
}