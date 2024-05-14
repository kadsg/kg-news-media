import request from '@/utils/request'

// 登录接口
export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(userId) {
  return request({
    url: '/user/' + userId,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function fetchList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

// 更新用户信息
export function updateInfo(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}
