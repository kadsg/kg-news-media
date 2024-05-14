import request from '@/utils/request'

// 获取新闻评论列表
export function getNewsCommentList(data) {
  return request({
    url: '/comment/list',
    method: 'post',
    data
  })
}

// 保存评论
export function saveComment(data) {
  return request({
    url: '/comment/save',
    method: 'post',
    data
  })
}

// 删除评论
export function deleteComment(commentId) {
  return request({
    url: '/comment/' + commentId,
    method: 'delete'
  })
}

// 获取评论点赞状态
export function getCommentLikeStatus(commentId) {
  return request({
    url: '/comment/like/status/' + commentId,
    method: 'get'
  })
}

// 点赞评论
export function likeComment(commentId) {
  return request({
    url: '/comment/like/' + commentId,
    method: 'put'
  })
}

// 踩评论
export function dislikeComment(commentId) {
  return request({
    url: '/comment/dislike/' + commentId,
    method: 'put'
  })
}
