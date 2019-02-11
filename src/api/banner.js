import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/banner/list',
    method: 'get',
    params: query
  })
}

export function edit(data) {
  return request({
    url: '/banner/edit',
    method: 'post',
    data
  })
}

export function find(query) {
  return request({
    url: '/banner/find',
    method: 'get',
    params: query
  })
}

export function del(query) {
  return request({
    url: '/banner/del',
    method: 'post',
    params: query
  })
}

export function fetchGroupList(query) {
  return request({
    url: '/bannerGroup/list',
    method: 'get',
    params: query
  })
}

export function groupEdit(data) {
  return request({
    url: '/bannerGroup/edit',
    method: 'post',
    data
  })
}

export function groupDel(data) {
  return request({
    url: '/bannerGroup/del',
    method: 'post',
    data
  })
}
export function fetchGroupAll() {
  return request({
    url: '/bannerGroup/all',
    method: 'get'
  })
}
