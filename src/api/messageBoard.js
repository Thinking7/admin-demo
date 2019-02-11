import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/messageBoard/list',
    method: 'get',
    params: query
  })
}
