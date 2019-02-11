import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function editAdmins(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data
  })
}
