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
 * 数据同步Hook
 * 
 * 提供统一的数据同步（从API获取）状态管理和逻辑
 * 
 * @param fetchFn 同步函数，接收同步参数，返回Promise
 * @param options 可选配置项
 * @returns 同步相关的状态和方法
 */
export function useDataSync<TParams = any, TResponse = any>(
  fetchFn: (params: TParams) => Promise<TResponse>,
  options?: {
    onSuccess?: (response: TResponse) => void;
    onError?: (error: any) => void;
    successMessage?: string | ((response: TResponse) => string);
    errorMessage?: string;
    enableCache?: boolean;
    cacheKey?: string;
    validateTsCodes?: (codes: string) => { valid: boolean; invalidCodes?: string[] };
    getTsCodeValidationError?: (invalidCodes: string[]) => string;
  }
) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editableRequestParams, setEditableRequestParams] = useState<string>('');
  const pageCache = usePageCache();

  // 从缓存恢复状态
  const cachedResult = options?.enableCache && options?.cacheKey
    ? pageCache.get()?.[options.cacheKey]
    : null;

  if (cachedResult && !result) {
    setResult(cachedResult);
  }

  const handleFetchFromApi = useCallback(async (params: TParams) => {
    try {
      setLoading(true);

      // TS代码校验
      if (options?.validateTsCodes && (params as any).ts_codes) {
        const validation = options.validateTsCodes(String((params as any).ts_codes));
        if (!validation.valid && options.getTsCodeValidationError) {
          message.error(options.getTsCodeValidationError(validation.invalidCodes || []));
          return;
        }
      }

      const response = await fetchFn(params);
      setResult(response);

      // 格式化请求参数用于显示
      const requestParams = (response as any).request_params || params;
      setEditableRequestParams(JSON.stringify(requestParams, null, 2));

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

      // 显示成功/失败消息
      if (response && (response as any).success) {
        const successMsg = options?.successMessage
          ? typeof options.successMessage === 'function'
            ? options.successMessage(response)
            : options.successMessage
          : (response as any).message || '获取成功';
        message.success(successMsg);
      } else if (response && !(response as any).success) {
        message.error((response as any).message || '获取失败');
      }

      if (options?.onSuccess) {
        options.onSuccess(response);
      }

      return response;
    } catch (error: any) {
      // 处理错误响应
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          message.error(errorData.message);
        } else {
          message.error(`获取接口数据失败: ${error.message || '未知错误'}`);
        }
      } else {
        // 网络错误或其他异常
        message.error(`网络错误: ${error.message || '未知错误'}`);
      }

      if (options?.onError) {
        options.onError(error);
      }

      setResult(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchFn, options, pageCache]);

  const handleRefetchFromApi = useCallback(async (params: TParams) => {
    try {
      setLoading(true);
      const response = await fetchFn(params);
      setResult(response);

      // 更新可编辑的请求参数
      const requestParams = (response as any).request_params || params;
      setEditableRequestParams(JSON.stringify(requestParams, null, 2));

      // 保存到缓存
      if (options?.enableCache && options?.cacheKey) {
        pageCache.update({ [options.cacheKey]: response });
      }

      // 显示成功/失败消息
      if (response && (response as any).success) {
        const successMsg = options?.successMessage
          ? typeof options.successMessage === 'function'
            ? options.successMessage(response)
            : options.successMessage
          : (response as any).message || '重新获取成功';
        message.success(successMsg);
      } else if (response && !(response as any).success) {
        message.error((response as any).message || '重新获取失败');
      }

      return response;
    } catch (error: any) {
      // JSON解析错误
      if (error.message?.includes('JSON') || error instanceof SyntaxError) {
        message.error('请求参数JSON格式错误，请检查');
      } else if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          message.error(errorData.message);
        } else {
          message.error(`重新获取失败: ${error.message || '未知错误'}`);
        }
      } else {
        message.error(`网络错误: ${error.message || '未知错误'}`);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchFn, options, pageCache]);

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
    editableRequestParams,
    handleFetchFromApi,
    handleRefetchFromApi,
    closeModal,
    setResult,
    setModalVisible,
    setEditableRequestParams,
  };
}
