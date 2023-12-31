// PopupAddBill/index.jsx
import React, { forwardRef, useEffect, useRef, useState } from 'react'

import cx from 'classnames'
import s from './style.module.less'

import { post, get, typeMap } from '@/utils'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

import { Popup, Keyboard, Input, Toast } from 'zarm'
import { Close, ArrowDown } from '@zarm-design/icons'
import PopupDate from '../PopupDate'
import CustomIcon from '../CustomIcon'

// 通过 forwardRef 拿到外部传入的 ref，并添加属性，使得父组件可以通过 ref 控制子组件。
// eslint-disable-next-line react/display-name
const PopupAddBill = forwardRef((props, ref) => {
  const [show, setShow] = useState(false) // 内部控制弹窗显示隐藏
  const [payType, setPayType] = useState('expense') // 支出或收入类型
  const [amount, setAmount] = useState('')
  const [remark, setRemark] = useState('') // 备注
  const [showRemark, setShowRemark] = useState(false) // 备注输入框展示控制

  const [currentType, setCurrentType] = useState({}) // 当前选中账单类型
  const [expense, setExpense] = useState([]) // 支出类型数组
  const [income, setIncome] = useState([]) // 收入类型数组

  const dateRef = useRef()
  const [date, setDate] = useState(new Date()) // 日期

  // 日期选择回调
  const selectDate = (val) => {
    setDate(val)
  }

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false)
      },
    }
  }

  const getType = async () => {
    const {
      data: { list },
    } = await get('/api/type/list')
    const _expense = list.filter((i) => i.type == 1) // 支出类型
    const _income = list.filter((i) => i.type == 2) // 收入类型
    setExpense(_expense)
    setIncome(_income)

    if (!props.detail?.id) {
      setCurrentType(_expense[0]) // 新建账单，类型默认是支出类型数组的第一项
    }
  }

  const changeType = (type) => {
    setPayType(type)
  }

  const resetBill = () => {
    setAmount('')
    setPayType('expense')
    setCurrentType(expense[0])
    setDate(new Date())
    setRemark('')
  }

  const addBill = async () => {
    if (!amount) return Toast.show('请输入金额')

    const params = {
      amount: Number(amount).toFixed(2), // 账单金额小数点后保留两位
      type_id: currentType.id, // 账单种类id
      type_name: currentType.name, // 账单种类名称
      date: dayjs(date).unix() * 1000, // 日期传时间戳
      pay_type: payType == 'expense' ? 1 : 2, // 账单类型传 1 或 2
      remark: remark || '', // 备注
      id: props.detail?.id || '',
    }

    const api = props.detail?.id ? '/api/bill/update' : '/api/bill/add'
    try {
      await post(api, params)
      Toast.show('添加成功')
    } catch (error) {
      console.log('error: ', error)
    }
    resetBill() // 重置数据
    setShow(false)

    // 父组件传入的刷新func
    if (props.onReload) props.onReload()
  }

  // 监听输入框改变值
  const handleMoney = (value) => {
    console.log('value: ', value)
    value = value.toString()
    // 点击是删除按钮时
    if (value == 'delete') {
      let _amount = amount.slice(0, amount.length - 1)
      setAmount(_amount)
      return
    }
    if (value == 'close') {
      setShow(false)
      return
    }
    // 点击确认按钮时
    if (value == 'ok') {
      addBill()
      return
    }

    if (value == '.' && amount.includes('.')) return
    // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
    if (
      value != '.' &&
      amount.includes('.') &&
      amount &&
      amount.split('.')[1].length >= 2
    )
      return
    setAmount(amount + value)
  }

  const initDetail = () => {
    const detail = props.detail
    if (detail?.id) {
      setPayType(detail.pay_type == 1 ? 'expense' : 'income')
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name,
      })
      setRemark(detail.remark)
      setAmount(detail.amount)
      setDate(dayjs(Number(detail.date)).$d)
    }
  }

  useEffect(() => {
    getType()
  }, [])

  useEffect(() => {
    initDetail()
  }, [props.detail])

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.addWrap}>
        {/* 右上角关闭弹窗 */}
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}>
            <Close />
          </span>
        </header>
        {/* 「收入」和「支出」类型切换 */}
        <div className={s.filter}>
          <div className={s.type}>
            <span
              onClick={() => changeType('expense')}
              className={cx({
                [s.expense]: true,
                [s.active]: payType == 'expense',
              })}
            >
              支出
            </span>
            <span
              onClick={() => changeType('income')}
              className={cx({
                [s.income]: true,
                [s.active]: payType == 'income',
              })}
            >
              收入
            </span>
          </div>

          <div
            className={s.time}
            onClick={() => dateRef.current && dateRef.current.show()}
          >
            {dayjs(date).format('MM-DD')}
            <ArrowDown />
          </div>
        </div>

        <div className={s.money}>
          <span className={s.sufix}>¥</span>
          <span className={cx(s.amount, s.animation)}> {amount} </span>
        </div>

        <div className={s.typeWarp}>
          <div className={s.typeBody}>
            {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
            {(payType == 'expense' ? expense : income).map((item) => (
              <div
                onClick={() => setCurrentType(item)}
                key={item.id}
                className={s.typeItem}
              >
                {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
                <span
                  className={cx({
                    [s.iconfontWrap]: true,
                    [s.expense]: payType == 'expense',
                    [s.income]: payType == 'income',
                    [s.active]: currentType.id == item.id,
                  })}
                >
                  <CustomIcon
                    className={s.iconfont}
                    type={typeMap[item.id].icon}
                  />
                </span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={s.remark}>
          {showRemark ? (
            <Input
              autoHeight
              showLength
              maxLength={50}
              type="text"
              rows={2}
              value={remark}
              placeholder="请输入备注"
              onChange={(e) => setRemark(e.target.value)}
              onBlur={() => setShowRemark(false)}
            />
          ) : (
            <span onClick={() => setShowRemark(true)}>
              {remark || '添加备注'}
            </span>
          )}
        </div>

        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />

        <PopupDate
          ref={dateRef}
          mode={['year', 'month', 'day']}
          onSelect={selectDate}
        />
      </div>
    </Popup>
  )
})

PopupAddBill.propTypes = {
  onReload: PropTypes.func,
  detail: PropTypes.object,
}

export default PopupAddBill
