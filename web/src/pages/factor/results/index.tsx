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

import { ProTable } from '@ant-design/pro-components';
import { Button, message, Form, Input, DatePicker, Select } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import React, { useRef, useState, useEffect } from 'react';
import { getFactorResults, getFactorDefinitions } from '@/services/zquant/factor';
import dayjs from 'dayjs';

const FactorResults: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [factorDefinitions, setFactorDefinitions] = useState<ZQuant.FactorDefinitionResponse[]>([]);

  useEffect(() => {
    getFactorDefinitions({ limit: 1000 }).then((res) => {
      setFactorDefinitions(res.items);
    });
  }, []);

  const columns: ProColumns<ZQuant.FactorResultItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '交易日期',
      dataIndex: 'trade_date',
      width: 120,
      sorter: true,
      render: (_, record) => {
        if (typeof record.trade_date === 'string') {
          return record.trade_date;
        }
        return dayjs(record.trade_date).format('YYYY-MM-DD');
      },
    },
    {
      title: '因子值',
      dataIndex: 'factor_value',
      width: 150,
      sorter: true,
      render: (_, record) => {
        if (record.factor_value === null || record.factor_value === undefined) {
          return '-';
        }
        return Number(record.factor_value).toFixed(4);
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 180,
      render: (_, record) => {
        if (!record.created_at) return '-';
        if (typeof record.created_at === 'string') {
          return record.created_at;
        }
        return dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  const handleQuery = async () => {
    try {
      const values = await form.validateFields();
      actionRef.current?.reload();
    } catch (error: any) {
      if (error?.errorFields) {
        return;
      }
      message.error('查询失败');
    }
  };

  return (
    <div>
      <Form
        form={form}
        layout="inline"
        onFinish={handleQuery}
        style={{ marginBottom: 16, padding: 16, background: '#fff' }}
      >
        <Form.Item name="code" label="股票代码" rules={[{ required: true, message: '请输入股票代码' }]}>
          <Input placeholder="例如：000001.SZ" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="factor_name" label="因子名称">
          <Select
            placeholder="选择因子（留空查询所有）"
            allowClear
            style={{ width: 200 }}
            options={factorDefinitions.map((f) => ({ label: `${f.cn_name} (${f.factor_name})`, value: f.factor_name }))}
          />
        </Form.Item>
        <Form.Item name="start_date" label="开始日期">
          <DatePicker style={{ width: 150 }} />
        </Form.Item>
        <Form.Item name="end_date" label="结束日期">
          <DatePicker style={{ width: 150 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>

      <ProTable<ZQuant.FactorResultItem>
        headerTitle="因子结果"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        request={async () => {
          const values = form.getFieldsValue();
          if (!values.code) {
            return { data: [], success: true, total: 0 };
          }
          try {
            const response = await getFactorResults({
              code: values.code,
              factor_name: values.factor_name || undefined,
              start_date: values.start_date ? dayjs(values.start_date).format('YYYY-MM-DD') : undefined,
              end_date: values.end_date ? dayjs(values.end_date).format('YYYY-MM-DD') : undefined,
            });
            return {
              data: response.items,
              success: true,
              total: response.total,
            };
          } catch (error: any) {
            message.error(error?.response?.data?.detail || '查询失败');
            return { data: [], success: false, total: 0 };
          }
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default FactorResults;

