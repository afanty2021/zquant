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

import { request } from '@umijs/max';

/**
 * 获取因子定义列表
 * GET /api/v1/factor/definitions
 */
export async function getFactorDefinitions(params?: {
  skip?: number;
  limit?: number;
  enabled?: boolean;
  order_by?: string;
  order?: string;
}) {
  return request<ZQuant.FactorDefinitionListResponse>('/api/v1/factor/definitions', {
    method: 'GET',
    params,
  });
}

/**
 * 创建因子定义
 * POST /api/v1/factor/definitions
 */
export async function createFactorDefinition(body: ZQuant.FactorDefinitionCreate) {
  return request<ZQuant.FactorDefinitionResponse>('/api/v1/factor/definitions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/**
 * 更新因子定义
 * PUT /api/v1/factor/definitions/{id}
 */
export async function updateFactorDefinition(id: number, body: ZQuant.FactorDefinitionUpdate) {
  return request<ZQuant.FactorDefinitionResponse>(`/api/v1/factor/definitions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/**
 * 删除因子定义
 * DELETE /api/v1/factor/definitions/{id}
 */
export async function deleteFactorDefinition(id: number) {
  return request<void>(`/api/v1/factor/definitions/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取因子定义详情
 * GET /api/v1/factor/definitions/{id}
 */
export async function getFactorDefinition(id: number) {
  return request<ZQuant.FactorDefinitionResponse>(`/api/v1/factor/definitions/${id}`, {
    method: 'GET',
  });
}

/**
 * 获取因子配置列表
 * GET /api/v1/factor/configs
 */
export async function getFactorConfigs(params?: {
  skip?: number;
  limit?: number;
  enabled?: boolean;
  order_by?: string;
  order?: string;
}) {
  return request<ZQuant.FactorConfigListResponse>('/api/v1/factor/configs', {
    method: 'GET',
    params,
  });
}

/**
 * 获取单个因子配置
 * GET /api/v1/factor/configs/{factor_id}
 */
export async function getFactorConfigById(factorId: number) {
  return request<ZQuant.FactorConfigResponse>(`/api/v1/factor/configs/${factorId}`, {
    method: 'GET',
  });
}

/**
 * 更新因子配置
 * PUT /api/v1/factor/configs/{factor_id}
 */
export async function updateFactorConfigById(
  factorId: number,
  body: {
    mappings?: Array<{
      model_id: number;
      codes: string[] | null;
    }> | null;
    enabled?: boolean | null;
  }
) {
  return request<ZQuant.FactorConfigResponse>(`/api/v1/factor/configs/${factorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/**
 * 删除因子配置
 * DELETE /api/v1/factor/configs/{factor_id}
 */
export async function deleteFactorConfigById(factorId: number) {
  return request<void>(`/api/v1/factor/configs/${factorId}`, {
    method: 'DELETE',
  });
}

/**
 * 获取因子配置（JSON格式）（已废弃，向后兼容）
 * GET /api/v1/factor/definitions/{factor_id}/config
 */
export async function getFactorConfig(factorId: number) {
  return request<{
    enabled: boolean;
    mappings: Array<{
      model_id: number;
      codes: string[] | null;
    }>;
  }>(`/api/v1/factor/definitions/${factorId}/config`, {
    method: 'GET',
  });
}

/**
 * 更新因子配置（JSON格式）
 * PUT /api/v1/factor/definitions/{factor_id}/config
 */
export async function updateFactorConfigJson(
  factorId: number,
  body: {
    enabled: boolean;
    mappings: Array<{
      model_id: number;
      codes: string[] | null;
    }>;
  }
) {
  return request<{
    enabled: boolean;
    mappings: Array<{
      model_id: number;
      codes: string[] | null;
    }>;
  }>(`/api/v1/factor/definitions/${factorId}/config`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/**
 * 删除因子配置（清空配置）
 * DELETE /api/v1/factor/definitions/{factor_id}/config
 */
export async function deleteFactorConfigJson(factorId: number) {
  return request<void>(`/api/v1/factor/definitions/${factorId}/config`, {
    method: 'DELETE',
  });
}

/**
 * 获取因子模型列表
 * GET /api/v1/factor/models
 */
export async function getFactorModels(params?: {
  factor_id?: number;
  skip?: number;
  limit?: number;
  enabled?: boolean;
  order_by?: string;
  order?: string;
}) {
  return request<ZQuant.FactorModelListResponse>('/api/v1/factor/models', {
    method: 'GET',
    params,
  });
}

/**
 * 创建因子模型
 * POST /api/v1/factor/models
 */
export async function createFactorModel(body: ZQuant.FactorModelCreate) {
  return request<ZQuant.FactorModelResponse>('/api/v1/factor/models', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/**
 * 更新因子模型
 * PUT /api/v1/factor/models/{id}
 */
export async function updateFactorModel(id: number, body: ZQuant.FactorModelUpdate) {
  return request<ZQuant.FactorModelResponse>(`/api/v1/factor/models/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/**
 * 删除因子模型
 * DELETE /api/v1/factor/models/{id}
 */
export async function deleteFactorModel(id: number) {
  return request<void>(`/api/v1/factor/models/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取因子模型详情
 * GET /api/v1/factor/models/{id}
 */
export async function getFactorModel(id: number) {
  return request<ZQuant.FactorModelResponse>(`/api/v1/factor/models/${id}`, {
    method: 'GET',
  });
}

/**
 * 创建因子配置
 * POST /api/v1/factor/configs
 */
export async function createFactorConfig(body: ZQuant.FactorConfigCreate) {
  return request<ZQuant.FactorConfigResponse>('/api/v1/factor/configs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/**
 * 获取因子配置列表（按因子分组）（已废弃）
 * GET /api/v1/factor/configs/grouped
 */
export async function getFactorConfigsGrouped(params?: {
  enabled?: boolean;
}) {
  return request<ZQuant.FactorConfigGroupedListResponse>('/api/v1/factor/configs/grouped', {
    method: 'GET',
    params,
  });
}

/**
 * 更新因子配置（按因子ID，支持多映射）
 * PUT /api/v1/factor/configs/by-factor/{factor_id}
 */
export async function updateFactorConfigByFactor(factorId: number, body: ZQuant.FactorConfigUpdate) {
  return request<ZQuant.FactorConfigGroupedResponse>(`/api/v1/factor/configs/by-factor/${factorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/**
 * 更新单个因子配置（使用查询参数）
 * PUT /api/v1/factor/configs?config_id={id}
 */
export async function updateFactorConfig(id: number, body: ZQuant.FactorConfigSingleUpdate) {
  return request<ZQuant.FactorConfigResponse>('/api/v1/factor/configs', {
    method: 'PUT',
    params: {
      config_id: id,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/**
 * 删除因子配置（使用查询参数）
 * DELETE /api/v1/factor/configs?config_id={id}
 */
export async function deleteFactorConfig(id: number) {
  return request<void>('/api/v1/factor/configs', {
    method: 'DELETE',
    params: {
      config_id: id,
    },
  });
}

/**
 * 删除因子配置（按因子ID，删除该因子的所有配置）
 * DELETE /api/v1/factor/configs/by-factor/{factorId}
 */
export async function deleteFactorConfigByFactor(factorId: number) {
  return request<void>(`/api/v1/factor/configs/by-factor/${factorId}`, {
    method: 'DELETE',
  });
}

/**
 * 手动触发因子计算
 * POST /api/v1/factor/calculate
 */
export async function calculateFactor(body: ZQuant.FactorCalculationRequest) {
  return request<ZQuant.FactorCalculationResponse>('/api/v1/factor/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/**
 * 查询因子计算结果
 * POST /api/v1/factor/results
 */
export async function getFactorResults(body: ZQuant.FactorResultQueryRequest) {
  return request<ZQuant.FactorResultResponse>('/api/v1/factor/results', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

