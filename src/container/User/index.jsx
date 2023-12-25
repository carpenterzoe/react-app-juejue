import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { List } from 'zarm'

import { get } from '@/utils'

import s from './style.module.less'

const User = () => {
  const [user, setUser] = useState({})

  useEffect(() => {
    getUserInfo()
  }, [])

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get('/api/user/get_userinfo')
    setUser(data)
  }

  const navigateTo = useNavigate()

  return (
    <div className={s.user}>
      <div className={s.head}>
        <div className={s.info}>
          <span>昵称：{user.username || '--'}</span>
          <span>
            <img
              style={{ width: 30, height: 30, verticalAlign: '-10px' }}
              src="//s.yezgea02.com/1615973630132/geqian.png"
              alt=""
            />
            <b>{user.signature || '暂无个签'}</b>
          </span>
        </div>
        <img
          className={s.avatar}
          style={{ width: 60, height: 60, borderRadius: 8 }}
          src={user.avatar || ''}
          alt=""
        />
      </div>

      <div className={s.content}>
        <List>
          <List.Item
            hasArrow={true}
            title="用户信息修改"
            onClick={() => navigateTo('/userinfo')}
            icon={
              <img
                style={{ width: 20, verticalAlign: '-7px' }}
                src="//s.yezgea02.com/1615974766264/gxqm.png"
                alt=""
              />
            }
          />
          <List.Item
            hasArrow={true}
            title="重制密码"
            onClick={() => navigateTo('/account')}
            icon={
              <img
                style={{ width: 20, verticalAlign: '-7px' }}
                src="//s.yezgea02.com/1615974766264/zhaq.png"
                alt=""
              />
            }
          />
          <List.Item
            hasArrow={true}
            title="关于我们"
            onClick={() => navigateTo('/about')}
            icon={
              <img
                style={{ width: 20, verticalAlign: '-7px' }}
                src="//s.yezgea02.com/1615975178434/lianxi.png"
                alt=""
              />
            }
          />
        </List>
      </div>
    </div>
  )
}

export default User
