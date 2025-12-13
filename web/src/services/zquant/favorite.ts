// @ts-ignore
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

/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 查询自选列表
 * GET /api/v1/favorites
 */
export async function getFavorites(params: {
  code?: string;
  start_date?: string;
  end_date?: string;
  skip?: number;
  limit?: number;
  order_by?: string;
  order?: string;
}) {
  return request<ZQuant.FavoriteListResponse>('/api/v1/favorites', {
    method: 'GET',
    params,
  });
}

/**
 * 创建自选
 * POST /api/v1/favorites
 */
export async function createFavorite(body: ZQuant.FavoriteCreate) {
  return request<ZQuant.FavoriteResponse>('/api/v1/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/**
 * 查询单个自选详情
 * GET /api/v1/favorites/{id}
 */
export async function getFavoriteById(id: number) {
  return request<ZQuant.FavoriteResponse>(`/api/v1/favorites/${id}`, {
    method: 'GET',
  });
}

/**
 * 更新自选
 * PUT /api/v1/favorites/{id}
 */
export async function updateFavorite(id: number, body: ZQuant.FavoriteUpdate) {
  return request<ZQuant.FavoriteResponse>(`/api/v1/favorites/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/**
 * 删除自选
 * DELETE /api/v1/favorites/{id}
 */
export async function deleteFavorite(id: number) {
  return request(`/api/v1/favorites/${id}`, {
    method: 'DELETE',
  });
}

