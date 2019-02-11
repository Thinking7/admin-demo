import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/navigation/list',
    method: 'get',
    params: query
  })
}

export function edit(data) {
  return request({
    url: '/navigation/edit',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/navigation/del',
    method: 'post',
    data
  })
}
