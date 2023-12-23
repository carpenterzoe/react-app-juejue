import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

import Header from '@/components/Header'
import CustomIcon from '@/components/CustomIcon'
import { Modal, Toast } from 'zarm'

import dayjs from 'dayjs'
import { get, post, typeMap } from '@/utils'

import cx from 'classnames'
import s from './style.module.less'

const Detail = () => {
  let [params] = useSearchParams()
  const curId = params.get('id')
  const [detail, setDetail] = useState({})

  const getDetail = async () => {
    const { data } = await get(`/api/bill/detail?id=${curId}`)
    setDetail(data)
  }

  const navigateTo = useNavigate()

  const handleDelete = () => {
    Modal.confirm({
      title: '删除',
      content: '确认删除账单？',
      onConfirm: async () => {
        const { data } = await post('/api/bill/delete', { id: curId })
        console.log('data: ', data)
        Toast.show('删除成功')
        navigateTo(-1)
      },
    })
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <div className={s.detail}>
      <Header title="账单详情" />

      <div className={s.card}>
        {/* 类别 and 金额 */}
        <div className={s.type}>
          {/* 通过 pay_type 属性，判断是收入或指出，给出不同的颜色*/}
          <span
            className={cx({
              [s.expense]: detail.pay_type == 1,
              [s.income]: detail.pay_type == 2,
            })}
          >
            {/* typeMap 是我们事先约定好的 icon 列表 */}
            <CustomIcon
              className={s.iconfont}
              type={detail.type_id ? typeMap[detail.type_id].icon : 1}
            />
          </span>
          <span>{detail.type_name || ''}</span>
        </div>
        {detail.pay_type == 1 ? (
          <div className={cx(s.amount, s.expense)}>-{detail.amount}</div>
        ) : (
          <div className={cx(s.amount, s.incom)}>+{detail.amount}</div>
        )}

        <div className={s.info}>
          <div className={s.time}>
            <span>记录时间</span>
            <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={s.remark}>
            <span>备注</span>
            <span>{detail.remark || '-'}</span>
          </div>
        </div>
        {/* 操作 */}
        <div className={s.operation}>
          <span onClick={handleDelete}>
            <CustomIcon type="shanchu" />
            删除
          </span>
          <span>
            <CustomIcon type="tianjia" />
            编辑
          </span>
        </div>
      </div>
    </div>
  )
}

export default Detail
