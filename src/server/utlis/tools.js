// const { Match } = require('./db/mongoose/models/match')
// 在头部引入即可
const fs = require('fs')
const path = require('path')
// 发送邮件的node插件
const nodemailer = require('nodemailer')
/**
 * 向指定邮箱发送验证码
 * @param receiveEmail 接收验证码的邮箱
 * @param verifyCode 发送的验证码
 * @returns {boolean} 是否发送成功
 */
function sendEmail (receiveEmail, verifyCode) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    secureConnection: true, // 安全发邮件
    port: 465, // SMTP 端口
    auth: { // 发送者的账户和授权码
      user: '1058016513@qq.com', // 账户
      pass: 'bmeglqoftiijbebg' // smtp授权码，到邮箱设置下获取
    }
  })
  const mailOptions = {
    from: '"拉吉莫拉拉" <1058016513@qq.com>', // 发送者昵称和地址
    to: receiveEmail, // 接收者的邮箱地址
    subject: '邮箱验证', // 邮件主题
    html: `
    <head>
    <base target="_blank" />
    <style type="text/css">::-webkit-scrollbar{ display: none; }</style>
    <style id="cloudAttachStyle" type="text/css">#divNeteaseBigAttach, #divNeteaseBigAttach_bak{display:none;}</style>
    <style id="blockquoteStyle" type="text/css">blockquote{display:none;}</style>
    <style type="text/css">
        body{font-size:14px;font-family:arial,verdana,sans-serif;line-height:1.666;padding:0;margin:0;overflow:auto;white-space:normal;word-wrap:break-word;min-height:100px}
        td, input, button, select, body{font-family:Helvetica, 'Microsoft Yahei', verdana}
        pre {white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;width:95%}
        th,td{font-family:arial,verdana,sans-serif;line-height:1.666}
        img{ border:0}
        header,footer,section,aside,article,nav,hgroup,figure,figcaption{display:block}
        blockquote{margin-right:0px}
        </style>
    </head>
    <body tabindex="0" role="listitem">
    <table width="700" border="0" align="center" cellspacing="0" style="width:700px;">
        <tbody>
        <tr>
            <td>
                <div style="width:700px;margin:0 auto;border-bottom:1px solid #ccc;margin-bottom:30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="700" height="39" style="font:12px Tahoma, Arial, 宋体;">
                        <tbody><tr><td width="210"></td></tr></tbody>
                    </table>
                </div>
                <div style="width:680px;padding:0 10px;margin:0 auto;">
                    <div style="line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d;">
                        <strong style="display:block;margin-bottom:15px;">尊敬的用户：<span style="color:#f60;font-size: 16px;"></span>您好！</strong>
                        <strong style="display:block;margin-bottom:15px;">
                            您正在进行<span style="color: red">足球小窝网站注册</span>操作，请在验证码输入框中输入：<span style="color:#f60;font-size: 24px">${verifyCode}</span>，以完成操作。
                        </strong>
                    </div>
                    <div style="margin-bottom:30px;">
                        <small style="display:block;margin-bottom:20px;font-size:12px;">
                            <p style="color:#747474;">
                                注意：此操作可能会修改您的密码、登录邮箱或绑定手机。如非本人操作，请及时登录并修改密码以保证帐户安全
                                <br>（工作人员不会向你索取此验证码，请勿泄漏！)
                            </p>
                        </small>
                    </div>
                </div>
                <div style="width:700px;margin:0 auto;">
                    <div style="padding:10px 10px 0;border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;">
                        <p>此为系统邮件，请勿回复<br>
                            请保管好您的邮箱，避免账号被他人盗用
                        </p>
                        <p>拉吉莫拉拉</p>
                    </div>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
    </body>
`
  }
  return new Promise((resolve, reject) => {
    // 发送邮件
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve('发送成功')
      }
    })
  })
}

/**
 * 生成指定范围随机数
 * @param Min
 * @param Max
 * @returns {*}
 */
function random (Min, Max) {
  const Range = Max - Min
  const Rand = Math.random()
  const num = Min + Math.round(Rand * Range)
  return num
}

/**
 * 校验用户角色
 * @param userRole 用户角色
 * @param targetRole 目标角色
 * @return {boolean}
 */
function verifyUserRole (userRole, targetRole) {
  return userRole === targetRole
}

/**
 * 向用户发送系统通知
 * @param matchChange 比赛变化: {matchId: '', change: ''}
 * @param users 接收通知的用户id数组
 * @param type 通知类型：比赛信息变更(change)、比赛删除(delete)
 */
function sendSystemNoticeToUser (matchChange, users, type) {
}

// file 图片文件
// sign 标识（用户唯一id、其他唯一值皆可）
function saveImg (file, sign) {
  return new Promise((resolve, reject) => {
    fs.readFile(file.path, async (err, data) => {
      if (err) {
        reject(err)
      }
      // 拓展名
      const extName = file.mimetype.split('/')[1]
      // 拼接成图片名
      const imgName = `${sign}-${Date.now()}.${extName}`
      // 写入图片
      await fs.writeFile(path.join(__dirname, `../public/areaCover/${imgName}`), data, err => {
        if (err) reject(err)
      })
      // 删除二进制文件
      await fs.unlink(file.path, err => {
        if (err) reject(err)
        const serverUrl = 'http://localhost:5000'
        // 成功就返回图片相对地址
        resolve(`${serverUrl}/public/areaCover/${imgName}`)
      })
      // // 验证是否存入
      // await fs.stat(path.join(__dirname, `../public/areaCover/${imgName}`), err => {
      //   if (err) reject(err)
      // })
    })
  })
}

module.exports = {
  sendEmail,
  random,
  verifyUserRole,
  sendSystemNoticeToUser,
  saveImg
}
