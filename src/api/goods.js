import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: query
  })
}

export function edit(data) {
  return request({
    url: '/goods/edit',
    method: 'post',
    data
  })
}

export function find(query) {
  return request({
    url: '/goods/find',
    method: 'get',
    params: query
  })
}

export function del(data) {
  return request({
    url: '/goods/del',
    method: 'post',
    data
  })
}

export function fetchGroupList(query) {
  return request({
    url: '/goodsCategory/list',
    method: 'get',
    params: query
  })
}

export function groupEdit(data) {
  return request({
    url: '/goodsCategory/edit',
    method: 'post',
    data
  })
}

export function groupDel(data) {
  return request({
    url: '/goodsCategory/del',
    method: 'post',
    data
  })
}
