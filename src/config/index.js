import md5 from 'md5'
import { JPush } from 'jpush-async'

const is_Production = false

export const MESSAGE = {
  OK: {
    code: 0,
    message: '请求成功',
  },
  PASSWORD_ERROR: {
    code: 300,
    message: '密码错误',
  },
  ADMIN_ERROR: {
    code: 301,
    message: '管理员密码错误',
  },
  USER_EXIST: {
    code: 302,
    message: '用户已存在',
  },
  TOKEN_ERROR: {
    code: 403,
    message: 'TOKEN失效',
  },
  USER_NOT_EXIST: {
    code: 404,
    message: '用户不存在',
  },
  CODE_ERROR: {
    code: 405,
    message: '验证码错误',
  },
  PARAMETER_ERROR: {
    code: 422,
    message: '参数错误',
  },
  REQUEST_ERROR: {
    code: 501,
    message: '请求失败',
  },
  QUICK_REQUEST: {
    code: 502,
    message: '请求间隔过短',
  },
  CONNECT_ERROR_CLOSE: {
    code: 600,
    message: '用户已关闭匹配',
  },
  CONNECT_ERROR_ALREADY: {
    code: 601,
    message: '用户已匹配',
  },
  CONNECT_ERROR_BAN: {
    code: 602,
    message: '用户没有匹配权限'
  },
  CONNECT_ERROR_NO_TIME: {
    code: 603,
    message: '用户没有匹配次数'
  },
  CONNECT_ERROR_NO_NOTE: {
    code: 604,
    message: '用户没有写过日记'
  },
  CONNECT_ERROR_BAN_NOW: {
    code: 605,
    message: '用户没有匹配权限'
  },
}

export const KEY = 'airing'
export const SQL_USER = 'root'
export const SQL_PASSWORD = ''
export const YUNPIAN_APIKEY = '' // 云片APIKEY
export const QINIU_ACCESS = '' // 七牛ACCESS
export const QINIU_SECRET = '' // 七牛SECRET
export const BUCKET = '' // 七牛BUCKET
export const ADMIN_USER = 'airing'
export const ADMIN_PASSWORD = ''
const JPUSH_KEY = ''
const JPUSH_SECRET = ''

const client = JPush.buildClient(JPUSH_KEY, JPUSH_SECRET)

export const JiGuangPush = (user_id, message) => {
  client.push().setPlatform('ios', 'android')
    .setAudience(JPush.alias(user_id.toString()))
    .setNotification('双生日记', JPush.ios(message), JPush.android(message, null, 1))
    .setMessage(message)
    .setOptions(null, 60, null, is_Production)
    .send(function (err, res) {
      if (err) {
        if (err instanceof JPush.APIConnectionError) {
          console.log(err.message)
          // Response Timeout means your request to the server may have already received,
          // please check whether or not to push
          console.log(err.isResponseTimeout)
        } else if (err instanceof JPush.APIRequestError) {
          console.log(err.message)
        }
      } else {
        console.log('Sendno: ' + res.sendno)
        console.log('Msg_id: ' + res.msg_id)
      }
    })
}

export const md5Pwd = (password) => {
  const salt = 'Airing_is_genius_3957x8yza6!@#IUHJh~~'
  return md5(md5(password + salt))
}

export const validate = (res, check, ...params) => {

  for (let param of params) {
    if (typeof param === 'undefined' || param === null) {
      return res.json(MESSAGE.PARAMETER_ERROR)
    }
  }

  if (check) {
    const uid = params[0]
    const timestamp = params[1]
    const token = params[2]

    if (token !== md5Pwd(uid.toString() + timestamp.toString() + KEY))
      return res.json(MESSAGE.TOKEN_ERROR)
  }
}
