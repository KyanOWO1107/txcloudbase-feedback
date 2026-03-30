// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { Send } from 'lucide-react';

import { useForm } from 'react-hook-form';
export function FeedbackForm({
  onSubmit
}) {
  const {
    toast
  } = useToast();
  const form = useForm({
    defaultValues: {
      username: '',
      message: ''
    }
  });
  const handleSubmit = async data => {
    try {
      await onSubmit(data);
      form.reset();
      toast({
        title: '提交成功',
        description: '您的反馈已成功提交'
      });
    } catch (error) {
      toast({
        title: '提交失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  return <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="border-4 border-black p-6 bg-white">
          <h2 className="text-2xl font-bold mb-6 font-[Space_Mono] border-b-4 border-black pb-4">
            📝 提交反馈
          </h2>

          <FormField control={form.control} name="username" rules={{
          required: '请输入用户名'
        }} render={({
          field
        }) => <FormItem>
                <FormLabel className="font-[Courier_New] font-bold text-lg">
                  用户名
                </FormLabel>
                <FormControl>
                  <Input placeholder="请输入您的用户名" {...field} className="border-3 border-black bg-white focus:border-[#00B4D8]" />
                </FormControl>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="message" rules={{
          required: '请输入反馈内容'
        }} render={({
          field
        }) => <FormItem>
                <FormLabel className="font-[Courier_New] font-bold text-lg">
                  反馈信息
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="请输入您的反馈内容" {...field} rows={6} className="border-3 border-black bg-white focus:border-[#00B4D8] resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>} />

          <Button type="submit" className="w-full bg-[#00B4D8] border-3 border-black hover:bg-[#0096C7] font-bold text-lg font-[Space_Mono]">
            <Send className="mr-2" />
            提交反馈
          </Button>
        </div>
      </form>
    </Form>;
}