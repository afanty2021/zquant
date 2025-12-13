// Copyright 2025 ZQuant Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the Apache License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Author: kevin
// Contact:
//     - Email: kevin@vip.qq.com
//     - Wechat: zquant2025
//     - Issues: https://github.com/yoyoung/zquant/issues
//     - Documentation: https://github.com/yoyoung/zquant/blob/main/README.md
//     - Repository: https://github.com/yoyoung/zquant

import { useState, useCallback } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { usePageCache } from './usePageCache';

/**
 * 数据校验Hook
 * 
 * 提供统一的数据校验状态管理和逻辑
 * 
 * @param validateFn 校验函数，接收校验参数，返回Promise
 * @param options 可选配置项
 * @returns 校验相关的状态和方法
 */
export function useDataValidation<TParams = any, TResponse = any>(
  validateFn: (params: TParams) => Promise<TResponse>,
  options?: {
    onSuccess?: (response: TResponse) => void;
    onError?: (error: any) => void;
    successMessage?: string | ((response: TResponse) => string);
    errorMessage?: string;
    enableCache?: boolean;
    cacheKey?: string;
    maxDateRange?: number; // 最大日期范围（天数），用于校验
    singleCodeOnly?: boolean; // 是否仅支持单个代码
  }
) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const pageCache = usePageCache();

  // 从缓存恢复状态
  const cachedResult = options?.enableCache && options?.cacheKey
    ? pageCache.get()?.[options.cacheKey]
    : null;

  if (cachedResult && !result) {
    setResult(cachedResult);
  }

  const handleValidate = useCallback(async (params: TParams) => {
    try {
      setLoading(true);

      // 日期范围校验
      if (options?.maxDateRange && (params as any).start_date && (params as any).end_date) {
        const startDate = dayjs((params as any).start_date);
        const endDate = dayjs((params as any).end_date);
        const daysDiff = endDate.diff(startDate, 'day');
        if (daysDiff > options.maxDateRange) {
          message.error(`数据校验功能的时间范围不能超过${options.maxDateRange}天，请缩小查询范围`);
          return;
        }
      }

      // 单个代码校验
      if (options?.singleCodeOnly && (params as any).ts_codes) {
        const codes = String((params as any).ts_codes).split(',').filter(c => c.trim());
        if (codes.length > 1) {
          message.error('数据校验功能仅支持单个TS代码，请只输入一个代码');
          return;
        }
      }

      const response = await validateFn(params);
      setResult(response);

      // 保存到缓存
      if (options?.enableCache && options?.cacheKey) {
        pageCache.update({ [options.cacheKey]: response });
      }

      // 显示弹窗
      setTimeout(() => {
        setModalVisible(true);
        if (options?.enableCache && options?.cacheKey) {
          pageCache.saveModalState(`${options.cacheKey}Modal`, true);
        }
      }, 0);

      // 显示成功消息
      if (response && (response as any).success) {
        const successMsg = options?.successMessage
          ? typeof options.successMessage === 'function'
            ? options.successMessage(response)
            : options.successMessage
          : (response as any).message || '校验完成';
        message.success(successMsg);
      } else if (response && !(response as any).success) {
        message.warning((response as any).message || '校验完成，但存在差异');
      }

      if (options?.onSuccess) {
        options.onSuccess(response);
      }

      return response;
    } catch (error: any) {
      const errorMsg = options?.errorMessage || error?.response?.data?.detail || error?.message || '数据校验失败';
      message.error(errorMsg);

      if (options?.onError) {
        options.onError(error);
      }

      setResult(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [validateFn, options, pageCache]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    if (options?.enableCache && options?.cacheKey) {
      pageCache.saveModalState(`${options.cacheKey}Modal`, false);
    }
  }, [options, pageCache]);

  return {
    loading,
    result,
    modalVisible,
    handleValidate,
    closeModal,
    setResult,
    setModalVisible,
  };
}
