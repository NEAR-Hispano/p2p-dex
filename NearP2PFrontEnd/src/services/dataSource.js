import {GOODS, GOODS_COLUMNS} from './api'
import {METHOD, request} from '@/utils/request'

export async function goodsList(params) {
  return request(GOODS, METHOD.GET, params)
}
export async function getData(url, params) {
  return request(url, METHOD.GET, params)
}
export async function postData(url, params) {
  return request(url, METHOD.POST, params)
}
export async function putData(url, params) {
  return request(url, METHOD.PUT, params)
}
export async function deleteData(url, params) {
  return request(url, METHOD.DELETE, params)
}
export async function crud(url, params, method, id) {
  if (method === 'POST'){
    return request(url, METHOD.POST, params)
  } else if (method === 'PUT'){
    return request(url + id + '/', METHOD.PUT, params)
  } else {
    return request(url + id + '/', METHOD.DELETE, params)
  } 
}

export async function goodsColumns() {
  return request(GOODS_COLUMNS, METHOD.GET)
}


export default {goodsList, goodsColumns, getData, postData, putData, deleteData, crud}