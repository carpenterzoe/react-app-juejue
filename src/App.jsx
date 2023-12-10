// App.jsx
import React, { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom"

// zarm ui库
import { ConfigProvider } from 'zarm'
import zhCN from 'zarm/lib/config-provider/locale/zh_CN'
import 'zarm/dist/zarm.css'

import routes from '@/router'

import NavBar from '@/components/NavBar';

function App() {
  // 想要在函数组件内执行 useLocation，该组件必须被 Router 高阶组件包裹
  const location = useLocation() // 拿到 location 实例
  const { pathname } = location // 获取当前路径
  const needNav = ['/home', '/data', '/user'] // 需要底部导航栏的路径
  const [showNav, setShowNav] = useState(false) // 是否展示 Nav
  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname]) // [] 内的参数若是变化，便会执行上述回调函数
  return (
    <>
      <ConfigProvider primaryColor={'#007fff'} locale={zhCN}>
        <Routes>
          {
            routes.map(route => 
              <Route 
                exact 
                key={route.path} 
                path={route.path} 
                element={<route.component />} 
              />
          )}
        </Routes>
      </ConfigProvider>
      {showNav && (<NavBar />)}
    </>
  )
}

export default App