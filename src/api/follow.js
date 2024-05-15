import request from '@/utils/request'

export function getFollowList(data) {
  return request({
    url: `/follow/list`,
    method: 'post',
    data
  })
}
