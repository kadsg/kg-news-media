import request from '@/utils/request'

// 获取新闻简介列表
export function getList(data) {
  return request({
    url: '/news/list',
    method: 'post',
    data
  })
}

// 获取新闻详情
export function getDetail(newsId) {
  return request({
    url: '/news/detail',
    method: 'get',
    params: { newsId }
  })
}

// 发布新闻
export function post(data) {
  return request({
    url: '/news/post',
    method: 'post',
    data
  })
}

// 获取新闻收藏状态
export function getNewsLikeStatus(newsId) {
  return request({
    url: '/news/like/status/' + newsId,
    method: 'get'
  })
}

// 收藏新闻
export function likeNews(newsId) {
  return request({
    url: '/news/like/' + newsId,
    method: 'put'
  })
}

// 踩新闻
export function dislikeNews(newsId) {
  return request({
    url: '/news/dislike/' + newsId,
    method: 'put'
  })
}

// 获取收藏新闻列表
export function getFavoriteList(data) {
  return request({
    url: '/news/favorite',
    method: 'post',
    data
  })
}

