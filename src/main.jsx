import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter as Router,
} from "react-router-dom"

// 移动端项目适配 rem
// import 'lib-flexible/flexible'

import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)
