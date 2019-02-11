import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/companyProfile/list',
    method: 'get',
    params: query
  })
}

export function edit(data) {
  return request({
    url: '/companyProfile/edit',
    method: 'post',
    data
  })
}

export function find(query) {
  return request({
    url: '/companyProfile/find',
    method: 'get',
    params: query
  })
}

export function del(data) {
  return request({
    url: '/companyProfile/del',
    method: 'post',
    data
  })
}
