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

import {
  ProForm,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Card, message, Modal, Popconfirm, Space, Tag, Typography } from 'antd';
import { useLocation } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { usePageCache } from '@/hooks/usePageCache';
import { renderDate, renderDateTime } from '@/components/DataTable';
import { createPosition, deletePosition, getPositions, updatePosition } from '@/services/zquant/position';
import { getStocks } from '@/services/zquant/data';

const { Text } = Typography;

const MyPositions: React.FC = () => {
  const location = useLocation();
  const actionRef = useRef<ActionType>(null);
  const searchFormRef = useRef<ProFormInstance>(null);
  const addEditFormRef = useRef<ProFormInstance>(null);
  const pageCache = usePageCache();

  const [dataSource, setDataSource] = useState<ZQuant.PositionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPosition, setEditingPosition] = useState<ZQuant.PositionResponse | undefined>(undefined);
  const [stockOptions, setStockOptions] = useState<{ value: string; label: string }[]>([]);
  const [stockSearchLoading, setStockSearchLoading] = useState(false);

  // 从缓存恢复状态
  useEffect(() => {
    const cachedFormValues = pageCache.getFormValues();
    if (cachedFormValues && searchFormRef.current) {
      searchFormRef.current.setFieldsValue(cachedFormValues);
    }

    const cachedDataSource = pageCache.getDataSource();
    if (cachedDataSource?.dataSource && cachedDataSource.dataSource.length > 0) {
      setDataSource(cachedDataSource.dataSource);
      const cachedTotal = (pageCache.get() as any)?.total;
      setTotal(cachedTotal || 0);
    }

    const cachedAddModalVisible = pageCache.getModalState('addModalVisible');
    if (cachedAddModalVisible !== undefined) {
      setAddModalVisible(cachedAddModalVisible);
    }
    const cachedEditModalVisible = pageCache.getModalState('editModalVisible');
    if (cachedEditModalVisible !== undefined) {
      setEditModalVisible(cachedEditModalVisible);
    }
    const cachedEditingPosition = pageCache.get()?.editingPosition;
    if (cachedEditingPosition) {
      setEditingPosition(cachedEditingPosition);
    }
  }, [pageCache, location.pathname]);

  // 保存状态到缓存
  const saveStateToCache = (key: string, value: any) => {
    pageCache.update({ [key]: value });
  };

  const handleAddModalVisible = (visible: boolean) => {
    setAddModalVisible(visible);
    pageCache.saveModalState('addModalVisible', visible);
    if (!visible) {
      addEditFormRef.current?.resetFields();
    } else {
      addEditFormRef.current?.setFieldsValue({ buy_date: dayjs() });
    }
  };

  const handleEdit = (record: ZQuant.PositionResponse) => {
    setEditingPosition(record);
    setEditModalVisible(true);
    pageCache.saveModalState('editModalVisible', true);
    pageCache.update({ editingPosition: record });
    setTimeout(() => {
      if (addEditFormRef.current) {
        addEditFormRef.current.setFieldsValue({
          quantity: record.quantity,
          avg_cost: record.avg_cost,
          buy_date: record.buy_date ? dayjs(record.buy_date) : undefined,
          current_price: record.current_price,
          comment: record.comment,
        });
      }
    }, 100);
  };

  const handleAdd = async (values: ZQuant.PositionCreate) => {
    try {
      const formattedValues = {
        ...values,
        buy_date: values.buy_date ? dayjs(values.buy_date).format('YYYY-MM-DD') : undefined,
      };
      await createPosition(formattedValues);
      message.success('添加持仓成功');
      handleAddModalVisible(false);
      pageCache.saveModalState('addModalVisible', false);
      // 刷新列表
      if (searchFormRef.current) {
        const formValues = searchFormRef.current.getFieldsValue();
        handleQuery(formValues);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.detail || '添加持仓失败');
    }
  };

  const handleUpdate = async (values: ZQuant.PositionUpdate) => {
    if (!editingPosition) return;
    try {
      const formattedValues = {
        ...values,
        buy_date: values.buy_date ? dayjs(values.buy_date).format('YYYY-MM-DD') : undefined,
      };
      await updatePosition(editingPosition.id, formattedValues);
      message.success('更新持仓成功');
      setEditModalVisible(false);
      setEditingPosition(undefined);
      pageCache.saveModalState('editModalVisible', false);
      pageCache.update({ editingPosition: undefined });
      // 刷新列表
      if (searchFormRef.current) {
        const formValues = searchFormRef.current.getFieldsValue();
        handleQuery(formValues);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.detail || '更新持仓失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePosition(id);
      message.success('删除持仓成功');
      // 刷新列表
      if (searchFormRef.current) {
        const formValues = searchFormRef.current.getFieldsValue();
        handleQuery(formValues);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.detail || '删除持仓失败');
    }
  };

  const handleStockSearch = async (searchText: string) => {
    if (!searchText) {
      setStockOptions([]);
      return;
    }
    setStockSearchLoading(true);
    try {
      const response = await getStocks({ symbol: searchText, name: searchText });
      const options = response.stocks
        .filter((stock) => stock.symbol)
        .map((stock) => ({
          value: stock.symbol!,
          label: `${stock.symbol} - ${stock.name} (${stock.ts_code})`,
        }));
      setStockOptions(options);
    } catch (error) {
      console.error('Failed to fetch stock suggestions:', error);
      setStockOptions([]);
    } finally {
      setStockSearchLoading(false);
    }
  };

  const renderProfit = (profit: number | undefined, profitPct: number | undefined) => {
    if (profit === undefined || profitPct === undefined) {
      return '-';
    }
    const isPositive = profit >= 0;
    return (
      <Space direction="vertical" size={0}>
        <Text style={{ color: isPositive ? '#ff4d4f' : '#52c41a' }}>
          {isPositive ? '+' : ''}
          {profit.toFixed(2)}
        </Text>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {isPositive ? '+' : ''}
          {profitPct.toFixed(2)}%
        </Text>
      </Space>
    );
  };

  const columns: ProColumns<ZQuant.PositionResponse>[] = [
    {
      title: '股票代码',
      dataIndex: 'code',
      width: 120,
      fixed: 'left',
      sorter: true,
      render: (text, record) => (
        <Space>
          <Text strong>{text}</Text>
          {record.stock_ts_code && <Tag color="blue">{record.stock_ts_code}</Tag>}
        </Space>
      ),
    },
    {
      title: '股票名称',
      dataIndex: 'stock_name',
      width: 150,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: '持仓数量',
      dataIndex: 'quantity',
      width: 120,
      sorter: true,
      render: (text) => (text ? text.toLocaleString() : '-'),
    },
    {
      title: '平均成本价',
      dataIndex: 'avg_cost',
      width: 120,
      sorter: true,
      render: (text: any) => (text ? `¥${Number(text).toFixed(2)}` : '-'),
    },
    {
      title: '当前价格',
      dataIndex: 'current_price',
      width: 120,
      render: (text: any) => (text ? `¥${Number(text).toFixed(2)}` : '-'),
    },
    {
      title: '市值',
      dataIndex: 'market_value',
      width: 120,
      sorter: true,
      render: (text: any) => (text ? `¥${Number(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'),
    },
    {
      title: '盈亏',
      dataIndex: 'profit',
      width: 150,
      sorter: true,
      render: (_, record) => renderProfit(record.profit, record.profit_pct),
    },
    {
      title: '买入日期',
      dataIndex: 'buy_date',
      width: 120,
      sorter: true,
      render: renderDate,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      width: 200,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      width: 180,
      sorter: true,
      render: renderDateTime,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_: any, record: ZQuant.PositionResponse) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条持仓吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 查询持仓列表
  const handleQuery = async (values: any) => {
    try {
      setLoading(true);
      pageCache.saveFormValues(values);

      const params: any = {
        skip: 0,
        limit: 100,
      };

      if (values.code) {
        params.code = values.code;
      }
      if (values.dateRange && values.dateRange.length === 2) {
        params.start_date = values.dateRange[0].format('YYYY-MM-DD');
        params.end_date = values.dateRange[1].format('YYYY-MM-DD');
      }

      const response = await getPositions(params);
      setDataSource(response.items);
      setTotal(response.total);

      pageCache.saveDataSource(response.items, response.total);
      message.success(`查询成功，共${response.total}条记录`);
    } catch (error: any) {
      message.error(error?.response?.data?.detail || '查询失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <ProForm
        formRef={searchFormRef}
        layout="inline"
        onFinish={handleQuery}
        onValuesChange={() => {
          if (searchFormRef.current) {
            const formValues = searchFormRef.current.getFieldsValue();
            pageCache.saveFormValues(formValues);
          }
        }}
        submitter={{
          render: (props, doms) => {
            return (
              <Space>
                <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                  查询
                </Button>
                <Button
                  key="create"
                  onClick={() => {
                    handleAddModalVisible(true);
                  }}
                >
                  添加持仓
                </Button>
              </Space>
            );
          },
        }}
      >
        <ProFormText
          name="code"
          label="股票代码"
          placeholder="请输入股票代码，如：000001"
          width="sm"
        />
        <ProFormDateRangePicker
          name="dateRange"
          label="买入日期范围"
        />
      </ProForm>

      <ProTable<ZQuant.PositionResponse>
        actionRef={actionRef}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        search={false}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          total: total,
        }}
        style={{ marginTop: 16 }}
        rowKey="id"
      />

      {/* 创建持仓 Modal */}
      <Modal
        title="添加持仓"
        open={addModalVisible}
        onCancel={() => {
          handleAddModalVisible(false);
          pageCache.saveModalState('addModalVisible', false);
        }}
        footer={null}
        width={600}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <ProForm
          formRef={addEditFormRef}
          layout="vertical"
          onFinish={handleAdd}
          initialValues={{
            buy_date: dayjs(),
          }}
          submitter={{
            render: (props, doms) => {
              return (
                <Space style={{ float: 'right' }}>
                  <Button onClick={() => handleAddModalVisible(false)}>取消</Button>
                  <Button type="primary" onClick={() => props.form?.submit?.()}>
                    确定
                  </Button>
                </Space>
              );
            },
          }}
        >
          <ProFormSelect
            name="code"
            label="股票代码"
            showSearch
            debounceTime={500}
            fieldProps={{
              onSearch: handleStockSearch,
              options: stockOptions,
              loading: stockSearchLoading,
              filterOption: false,
            }}
            placeholder="请输入股票代码或名称搜索"
            rules={[{ required: true, message: '请选择股票代码' }]}
            disabled={!!editingPosition}
          />
          <ProFormDigit
            name="quantity"
            label="持仓数量（股）"
            placeholder="请输入持仓数量"
            rules={[{ required: true, message: '请输入持仓数量' }]}
            fieldProps={{
              min: 0,
              precision: 0,
            }}
          />
          <ProFormDigit
            name="avg_cost"
            label="平均成本价（元）"
            placeholder="请输入平均成本价"
            rules={[{ required: true, message: '请输入平均成本价' }]}
            fieldProps={{
              min: 0,
              precision: 3,
            }}
          />
          <ProFormDatePicker
            name="buy_date"
            label="买入日期"
            placeholder="请选择买入日期"
          />
          <ProFormDigit
            name="current_price"
            label="当前价格（元）"
            placeholder="请输入当前价格（可选）"
            fieldProps={{
              min: 0,
              precision: 3,
            }}
          />
          <ProFormText
            name="comment"
            label="备注"
            placeholder="请输入备注"
            fieldProps={{
              maxLength: 2000,
            }}
          />
        </ProForm>
      </Modal>

      {/* 编辑持仓 Modal */}
      <Modal
        title="编辑持仓"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingPosition(undefined);
          pageCache.saveModalState('editModalVisible', false);
          pageCache.update({ editingPosition: undefined });
        }}
        footer={null}
        width={600}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <ProForm
          formRef={addEditFormRef}
          layout="vertical"
          onFinish={handleUpdate}
          submitter={{
            render: (props, doms) => {
              return (
                <Space style={{ float: 'right' }}>
                  <Button
                    onClick={() => {
                      setEditModalVisible(false);
                      setEditingPosition(undefined);
                      pageCache.saveModalState('editModalVisible', false);
                      pageCache.update({ editingPosition: undefined });
                    }}
                  >
                    取消
                  </Button>
                  <Button type="primary" onClick={() => props.form?.submit?.()}>
                    确定
                  </Button>
                </Space>
              );
            },
          }}
        >
          <ProFormDigit
            name="quantity"
            label="持仓数量（股）"
            placeholder="请输入持仓数量"
            rules={[{ required: true, message: '请输入持仓数量' }]}
            fieldProps={{
              min: 0,
              precision: 0,
            }}
          />
          <ProFormDigit
            name="avg_cost"
            label="平均成本价（元）"
            placeholder="请输入平均成本价"
            rules={[{ required: true, message: '请输入平均成本价' }]}
            fieldProps={{
              min: 0,
              precision: 3,
            }}
          />
          <ProFormDatePicker
            name="buy_date"
            label="买入日期"
            placeholder="请选择买入日期"
          />
          <ProFormDigit
            name="current_price"
            label="当前价格（元）"
            placeholder="请输入当前价格（可选）"
            fieldProps={{
              min: 0,
              precision: 3,
            }}
          />
          <ProFormText
            name="comment"
            label="备注"
            placeholder="请输入备注"
            fieldProps={{
              maxLength: 2000,
            }}
          />
        </ProForm>
      </Modal>
    </Card>
  );
};

export default MyPositions;
