import request from '@/utils/request'

export function getFansList(data) {
  return request({
    url: `/fans/list`,
    method: 'post',
    data
  })
}
