import request from '@/utils/request'

// 分页获取标签列表
export function queryNewsTag(data) {
  return request({
    url: '/newsTag/query',
    method: 'post',
    data
  })
}

// 获取所有标签
export function getAllNewsTag() {
  return request({
    url: '/newsTag/list',
    method: 'get'
  })
}

// 获取标签详情
export function getNewsTag(id) {
  return request({
    url: '/newsTag/' + id,
    method: 'get'
  })
}

// 添加标签
export function addNewsTag(data) {
  return request({
    url: '/newsTag',
    method: 'post',
    data
  })
}

// 更新标签
export function updateNewsTag(data) {
  return request({
    url: '/newsTag',
    method: 'put',
    data
  })
}

// 获取用户发布的新闻的所属标签
export function getPublishedNewsTags(id) {
  return request({
    url: '/newsTag/published/' + id,
    method: 'get'
  })
}
