import request from '../utils/request';

export function setNickName(value) {
  return request('/api/setNickName', {
    method: 'POST',
    body: value,
    headers: {}
  })
}

export function backendLogin(value) {
  return request('/api/authBackend', {
    method: 'POST',
    body: value,
    headers: {}
  })
}

export function postVoteContent(value, token) {
  delete value.files;
  return request('/api/upload', {
    method: 'POST',
    body: value,
    headers: { Authorization: 'Bearer ' + token }
  })
}

export function getVoteContent(token) {
  return request('/api/getContetn', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token }
  })
}

// 点赞
export function like(value) {
  return request('/api/like', {
    method: 'POST',
    body: value,
    headers: {}
  })
}

// 更新内容
export function update(value, token) {
  return request('/api/update', {
    method: 'POST',
    body: value,
    headers: { Authorization: 'Bearer ' + token }
  })
}

// 删除内容
export function remove(value, token) {
  return request('/api/delete', {
    method: 'POST',
    body: value,
    headers: { Authorization: 'Bearer ' + token }
  })
}

export function query() {
  return request('/api/users');
}
