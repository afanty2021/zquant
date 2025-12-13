// Copyright 2025 ZQuant Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
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

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * 页面缓存数据结构
 */
export interface PageCache {
  dataSource?: any[];           // 表格数据
  formValues?: any;              // 表单值
  rawData?: any[];               // 原始数据
  modalStates?: Record<string, boolean>; // 弹窗状态
  [key: string]: any;            // 其他自定义状态
}

/**
 * 页面缓存Context类型
 */
interface PageCacheContextType {
  /**
   * 保存页面缓存
   * @param path 页面路径（作为缓存key）
   * @param cache 缓存数据
   */
  saveCache: (path: string, cache: PageCache) => void;
  
  /**
   * 获取页面缓存
   * @param path 页面路径
   * @returns 缓存数据，如果不存在则返回undefined
   */
  getCache: (path: string) => PageCache | undefined;
  
  /**
   * 清除指定页面的缓存
   * @param path 页面路径
   */
  clearCache: (path: string) => void;
  
  /**
   * 清除所有页面缓存
   */
  clearAllCache: () => void;
  
  /**
   * 检查指定页面是否有缓存
   * @param path 页面路径
   * @returns 是否存在缓存
   */
  hasCache: (path: string) => boolean;
}

const PageCacheContext = createContext<PageCacheContextType | undefined>(undefined);

/**
 * 页面缓存Provider组件
 */
interface PageCacheProviderProps {
  children: ReactNode;
}

export const PageCacheProvider: React.FC<PageCacheProviderProps> = ({ children }) => {
  // 使用Map存储页面缓存，key为页面路径
  const [cacheMap, setCacheMap] = useState<Map<string, PageCache>>(new Map());

  /**
   * 保存页面缓存
   */
  const saveCache = useCallback((path: string, cache: PageCache) => {
    setCacheMap((prev) => {
      const newMap = new Map(prev);
      // 合并现有缓存和新缓存
      const existingCache = newMap.get(path) || {};
      newMap.set(path, { ...existingCache, ...cache });
      return newMap;
    });
  }, []);

  /**
   * 获取页面缓存
   */
  const getCache = useCallback((path: string): PageCache | undefined => {
    return cacheMap.get(path);
  }, [cacheMap]);

  /**
   * 清除指定页面的缓存
   */
  const clearCache = useCallback((path: string) => {
    setCacheMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(path);
      return newMap;
    });
  }, []);

  /**
   * 清除所有页面缓存
   */
  const clearAllCache = useCallback(() => {
    setCacheMap(new Map());
  }, []);

  /**
   * 检查指定页面是否有缓存
   */
  const hasCache = useCallback((path: string): boolean => {
    return cacheMap.has(path);
  }, [cacheMap]);

  const contextValue: PageCacheContextType = {
    saveCache,
    getCache,
    clearCache,
    clearAllCache,
    hasCache,
  };

  return (
    <PageCacheContext.Provider value={contextValue}>
      {children}
    </PageCacheContext.Provider>
  );
};

/**
 * 使用页面缓存Context的Hook
 * @throws 如果不在PageCacheProvider内使用会抛出错误
 */
export const usePageCacheContext = (): PageCacheContextType => {
  const context = useContext(PageCacheContext);
  if (!context) {
    throw new Error('usePageCacheContext must be used within PageCacheProvider');
  }
  return context;
};

