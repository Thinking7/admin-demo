import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/news/list',
    method: 'get',
    params: query
  })
}

export function edit(data) {
  return request({
    url: '/news/edit',
    method: 'post',
    data
  })
}

export function find(query) {
  return request({
    url: '/news/find',
    method: 'get',
    params: query
  })
}

export function del(data) {
  return request({
    url: '/news/del',
    method: 'post',
    data
  })
}

export function fetchGroupList(query) {
  return request({
    url: '/newsGroup/list',
    method: 'get',
    params: query
  })
}

export function groupEdit(data) {
  return request({
    url: '/newsGroup/edit',
    method: 'post',
    data
  })
}

export function groupDel(data) {
  return request({
    url: '/newsGroup/del',
    method: 'post',
    data
  })
}
