import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/setting/list',
    method: 'get',
    params: query
  })
}

export function edit(data) {
  return request({
    url: '/setting/edit',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/setting/del',
    method: 'post',
    data
  })
}

export function getSeoInfo() {
  return request({
    url: '/setting/seoInfo',
    method: 'get',
  })
}

export function editSeo(data) {
  return request({
    url: '/setting/editSeo',
    method: 'post',
    data
  })
}

export function getContactUsInfo() {
  return request({
    url: '/setting/contactUs',
    method: 'get',
  })
}

export function editContactUs(data) {
  return request({
    url: '/setting/editContactUs',
    method: 'post',
    data
  })
}
