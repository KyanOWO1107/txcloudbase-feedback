// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { Lock, Shield } from 'lucide-react';

import { useForm } from 'react-hook-form';

// 预设密码（实际应用中应该从服务端获取）
const ADMIN_PASSWORD = 'S3lhbl9EYWlseUZlZWRiYWNrQWRtaW4=';
export function PasswordGate({
  children,
  title = '需要验证'
}) {
  const {
    toast
  } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const form = useForm({
    defaultValues: {
      password: ''
    }
  });
  const handlePasswordSubmit = async data => {
    setIsChecking(true);
    try {
      // 模拟密码验证（实际应用中应该调用云函数验证）
      await new Promise(resolve => setTimeout(resolve, 500));
      if (data.password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        toast({
          title: '验证成功',
          description: '正在加载内容...'
        });
      } else {
        toast({
          title: '密码错误',
          description: '请输入正确的密码',
          variant: 'destructive'
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: '验证失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsChecking(false);
    }
  };
  if (isAuthenticated) {
    return <>{children}</>;
  }
  return <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-8">
    <div className="w-full max-w-md">
      <div className="border-4 border-black bg-white p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Lock className="text-[#00B4D8]" size={64} />
          </div>
          <h1 className="text-3xl font-bold font-[Space_Mono] mb-2">
            {title}
          </h1>
          <p className="font-[Courier_New] text-gray-600">
            请输入密码以访问受保护的内容
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePasswordSubmit)} className="space-y-6">
            <FormField control={form.control} name="password" rules={{
              required: '请输入密码'
            }} render={({
              field
            }) => <FormItem>
                <FormLabel className="font-[Courier_New] font-bold text-lg">
                  密码
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="请输入密码" {...field} className="border-3 border-black bg-white focus:border-[#00B4D8]" />
                </FormControl>
                <FormMessage />
              </FormItem>} />

            <Button type="submit" disabled={isChecking} className="w-full bg-[#00B4D8] border-3 border-black hover:bg-[#0096C7] font-bold text-lg font-[Space_Mono]">
              {isChecking ? '验证中...' : <>
                <Shield className="mr-2" />
                验证密码
              </>}
            </Button>
          </form>
        </Form>

        <div className="mt-6 pt-6 border-t-2 border-black text-center">
          <p className="font-[Courier_New] text-sm text-gray-600">
            Kyanetwork Admin
          </p>
        </div>
      </div>
    </div>
  </div>;
}