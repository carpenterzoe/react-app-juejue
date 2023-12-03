import React from 'react'

import { Input, Button, Checkbox } from 'zarm'
import CustomIcon from '@/components/CustomIcon'

import Captcha from "react-captcha-code"

import s from './style.module.less'

const Login = () => {
  return <div className={s.auth}>
    <div className={s.head} />
    <div className={s.tab}>
      <span>注册</span>
    </div>
    <div className={s.form}>
      <div icon={<CustomIcon type="zhanghao" />}>
        <Input
          clearable
          type="text"
          placeholder="请输入账号"
          />
      </div>
      <div icon={<CustomIcon type="mima" />}>
        <Input
          clearable
          type="password"
          placeholder="请输入密码"
          />
      </div>
      <div icon={<CustomIcon type="mima" />}>
        <Input
          clearable
          type="text"
          placeholder="请输入验证码"
          />
        <Captcha charNum={4} />
      </div>
    </div>
    <div className={s.operation}>
      <div className={s.agree}>
        <Checkbox />
        <label className="text-light">阅读并同意<a>《掘掘手札条款》</a></label>
      </div>
      <Button block theme="primary">注册</Button>
    </div>
  </div>
}

export default Login