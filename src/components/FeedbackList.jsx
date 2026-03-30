// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Download, Clock, Globe, Trash2, CheckCircle2, XCircle } from 'lucide-react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';

export function FeedbackList({
  feedbacks,
  onDownload,
  loading = false,
  onDelete,
  onToggleStatus
}) {
  const {
    toast
  } = useToast();
  const handleDownload = async () => {
    try {
      await onDownload();
      toast({
        title: '下载成功',
        description: '汇总文件已下载'
      });
    } catch (error) {
      toast({
        title: '下载失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const formatTime = time => {
    if (!time) return '-';
    const date = new Date(time);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const handleDelete = async feedbackId => {
    if (window.confirm('确定要删除这条反馈吗？')) {
      try {
        await onDelete(feedbackId);
        toast({
          title: '删除成功',
          description: '反馈已删除'
        });
      } catch (error) {
        toast({
          title: '删除失败',
          description: error.message || '请稍后重试',
          variant: 'destructive'
        });
      }
    }
  };
  const handleToggleStatus = async feedback => {
    try {
      await onToggleStatus(feedback);
      toast({
        title: '状态更新成功',
        description: '反馈状态已更新'
      });
    } catch (error) {
      toast({
        title: '状态更新失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  if (loading) {
    return <div className="border-4 border-black p-6 bg-white min-h-[400px]">
        <h2 className="text-2xl font-bold mb-6 font-[Space_Mono] border-b-4 border-black pb-4">
          📋 反馈列表
        </h2>
        <div className="text-center py-12">
          <p className="font-[Courier_New] text-lg text-gray-600">
            加载中...
          </p>
        </div>
      </div>;
  }
  if (!feedbacks || feedbacks.length === 0) {
    return <div className="border-4 border-black p-6 bg-white min-h-[400px]">
        <h2 className="text-2xl font-bold mb-6 font-[Space_Mono] border-b-4 border-black pb-4">
          📋 反馈列表
        </h2>
        <div className="text-center py-12">
          <p className="font-[Courier_New] text-lg text-gray-600">
            暂无反馈数据
          </p>
        </div>
      </div>;
  }
  return <div className="border-4 border-black p-6 bg-white min-h-[400px]">
      <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-4">
        <h2 className="text-2xl font-bold font-[Space_Mono]">
          📋 反馈列表 ({feedbacks.length})
        </h2>
        <Button onClick={handleDownload} className="bg-[#00B4D8] border-3 border-black hover:bg-[#0096C7] font-bold font-[Space_Mono]">
          <Download className="mr-2" />
          下载汇总
        </Button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {feedbacks.map(feedback => <div key={feedback._id} className={`border-3 border-black bg-[#F5F5F5] p-4 hover:border-[#00B4D8] transition-colors ${feedback.status === 'resolved' ? 'opacity-70' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`inline-flex items-center px-3 py-1 text-sm font-bold font-[Space_Mono] ${feedback.status === 'resolved' ? 'bg-green-500 text-white' : 'bg-[#00B4D8] text-white'}`}>
                {feedback.status === 'resolved' ? <>
                    <CheckCircle2 className="mr-1" size={14} />
                    已解决
                  </> : <>
                    <XCircle className="mr-1" size={14} />
                    待处理
                  </>}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleToggleStatus(feedback)} size="sm" className={`border-2 border-black font-bold font-[Space_Mono] text-sm ${feedback.status === 'resolved' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-[#00B4D8] hover:bg-[#0096C7]'} text-white`}>
                  {feedback.status === 'resolved' ? '标记未解决' : '标记已解决'}
                </Button>
                <Button onClick={() => handleDelete(feedback._id)} size="sm" variant="destructive" className="border-2 border-black font-bold font-[Space_Mono] text-sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-[Courier_New] font-bold text-sm mb-1">
                  👤 用户名
                </div>
                <div className="font-[Space_Mono] text-base">
                  {feedback.username || '-'}
                </div>
              </div>

              <div>
                <div className="font-[Courier_New] font-bold text-sm mb-1">
                  🔑 UUID
                </div>
                <div className="font-[Space_Mono] text-sm">
                  {feedback.uuid || '-'}
                </div>
              </div>

              <div>
                <div className="font-[Courier_New] font-bold text-sm mb-1 flex items-center">
                  <Globe className="mr-1" size={14} />
                  IP 地址
                </div>
                <div className="font-[Space_Mono] text-sm">
                  {feedback.ip || '-'}
                </div>
              </div>

              <div>
                <div className="font-[Courier_New] font-bold text-sm mb-1 flex items-center">
                  <Clock className="mr-1" size={14} />
                  提交时间
                </div>
                <div className="font-[Space_Mono] text-sm">
                  {formatTime(feedback.time)}
                </div>
              </div>

              <div className="col-span-2">
                <div className="font-[Courier_New] font-bold text-sm mb-1">
                  💬 反馈内容
                </div>
                <div className="font-[Space_Mono] text-base bg-white border-2 border-black p-2">
                  {feedback.message || '-'}
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
}