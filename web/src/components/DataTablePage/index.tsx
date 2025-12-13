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

import React, { useRef } from 'react';
import { Card, Space, Button } from 'antd';
import { ProForm, ProFormInstance } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { DataTable } from '@/components/DataTable';
import { useDataQuery } from '@/hooks/useDataQuery';
import { usePageCache } from '@/hooks/usePageCache';
import dayjs from 'dayjs';

export interface DataTablePageConfig<TItem = any> {
  // 查询相关
  queryFn: (params: any) => Promise<any>;
  getItems: (response: any) => TItem[];
  getKey: (item: TItem, index: number) => string | number;
  
  // 表格相关
  columns: ProColumns<TItem>[];
  tableTitle?: string;
  
  // 表单相关
  formFields?: React.ReactNode[];
  initialFormValues?: any;
  
  // 操作按钮
  showFetchButton?: boolean;
  showValidateButton?: boolean;
  onFetch?: (values: any) => Promise<void>;
  onValidate?: (values: any) => Promise<void>;
  fetchLoading?: boolean;
  validateLoading?: boolean;
  
  // 其他配置
  queryOptions?: {
    successMessage?: string | ((count: number) => string);
    errorMessage?: string;
    enableCache?: boolean;
  };
}

/**
 * 通用数据表格页面组件
 * 
 * 通过配置驱动，统一数据查询、表格展示、表单处理逻辑
 */
export function DataTablePage<TItem extends Record<string, any> = any>(
  config: DataTablePageConfig<TItem>
) {
  const formRef = useRef<ProFormInstance>();
  const pageCache = usePageCache();

  const { dataSource, loading, handleQuery } = useDataQuery<TItem>(
    config.queryFn,
    config.getItems,
    config.getKey,
    config.queryOptions
  );

  // 处理表单值变化
  const handleFormValuesChange = () => {
    if (formRef.current) {
      const formValues = formRef.current.getFieldsValue();
      pageCache.saveFormValues(formValues);
    }
  };

  // 处理查询
  const handleQueryWithCache = async (values: any) => {
    pageCache.saveFormValues(values);
    await handleQuery(values);
  };

  return (
    <Card>
      <ProForm
        formRef={formRef}
        layout="inline"
        onFinish={handleQueryWithCache}
        onValuesChange={handleFormValuesChange}
        request={async () => {
          // 优先从缓存加载
          const cachedFormValues = pageCache.getFormValues();
          if (cachedFormValues) {
            return cachedFormValues;
          }
          // 使用初始值
          return config.initialFormValues || {};
        }}
        submitter={{
          render: (props, doms) => {
            return (
              <Space>
                <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                  查询
                </Button>
                {config.showFetchButton && (
                  <Button
                    key="fetch"
                    onClick={async () => {
                      const values = await props.form?.validateFields();
                      if (values && config.onFetch) {
                        await config.onFetch(values);
                      }
                    }}
                    loading={config.fetchLoading}
                  >
                    接口数据获取
                  </Button>
                )}
                {config.showValidateButton && (
                  <Button
                    key="validate"
                    onClick={async () => {
                      const values = await props.form?.validateFields();
                      if (values && config.onValidate) {
                        await config.onValidate(values);
                      }
                    }}
                    loading={config.validateLoading}
                  >
                    数据校验
                  </Button>
                )}
              </Space>
            );
          },
        }}
      >
        {config.formFields || (
          <>
            <ProFormText
              name="ts_code"
              label="TS代码"
              placeholder="请输入TS代码，多个代码用逗号分隔"
              width="sm"
            />
            <ProFormDateRangePicker
              name="dateRange"
              label="日期范围"
            />
          </>
        )}
      </ProForm>

      <DataTable
        columns={config.columns}
        dataSource={dataSource}
        loading={loading}
        title={config.tableTitle}
      />
    </Card>
  );
}
