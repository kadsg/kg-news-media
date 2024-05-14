import request from '@/utils/request'

// 获取角色列表
export function getList() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}
