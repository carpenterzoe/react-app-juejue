import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Input, Button, Checkbox, Toast } from 'zarm'
import CustomIcon from '@/components/CustomIcon'
import Captcha from "react-captcha-code"
import { post } from '@/utils'

// ? cx是干啥的
import cx from 'classnames'
import s from './style.module.less'

const Login = () => {
  const navigateTo = useNavigate(); // 路由实例

  const [username, setUsername] = useState(''); // 账号
  const [password, setPassword] = useState(''); // 密码
  const [verify, setVerify] = useState(''); // 验证码
  const [captcha, setCaptcha] = useState(''); // 验证码变化后存储值
  const [loginType, setType] = useState('login'); // 登录注册类型

  // ? useCallback
  const handleChange = useCallback((captcha) => {
    console.log('captcha', captcha)
    setCaptcha(captcha)
  }, []);

  const handleLogin = async () => {
    const { data } = await post('/api/user/login', {
      username,
      password
    });
    localStorage.setItem('token', data.token)
    navigateTo('/home')
  }
  const handleRegister = () => {
    if (!verify) {
      return Toast.show('请输入验证码')
    };
    if (verify !== captcha) {
      return Toast.show('验证码错误')
    };
    const params = {
      username,
      password
    }
    const api = '/api/user/register'
    post(api, params).then(res => {
      console.log('res: ', res);
      Toast.show('注册成功');
      setType('login');
    })
  }

  const onSubmit = () => {
    if (!username) {
      return Toast.show('请输入账号')
    }
    if (!password) {
      return Toast.show('请输入密码')
    }
    if (loginType === 'login') {
      handleLogin()
    } else {
      handleRegister()
    }
  }

  return <div className={s.auth}>
    <div className={s.head} />
    <div className={s.tab}>
      <span className={cx({ [s.avtive]: loginType === 'login' })} onClick={() => setType('login')}>登录</span>
      <span className={cx({ [s.avtive]: loginType === 'register' })} onClick={() => setType('register')}>注册</span>
    </div>
    <div className={s.form}>
      <div className={s.inputWrap}>
        <CustomIcon type="zhanghao" />
        <Input
          clearable
          type="text"
          placeholder="请输入账号"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className={s.inputWrap}>
        <CustomIcon type="mima" />
        <Input
          clearable
          type="password"
          placeholder="请输入密码"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {
        loginType == 'register' && (
          <div className={s.inputWrap}>
            <CustomIcon type="mima" />
            <Input
              clearable
              type="text"
              placeholder="请输入验证码"
              onChange={(e) => setVerify(e.target.value)}
            />
            <Captcha charNum={4} onChange={handleChange} />
          </div>
        )
      }
    </div>
    <div className={s.operation}>
      {
        loginType === 'register' ? <div className={s.agree}>
          <Checkbox />
          <label className="text-light">阅读并同意<a>《掘掘手札条款》</a></label>
        </div> : null
      }
      <Button onClick={onSubmit} block theme="primary">
        {loginType == 'login' ? '登录' : '注册'}
      </Button>
    </div>
  </div>
}

export default Login