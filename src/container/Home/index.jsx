import React, { useState, useEffect, useRef } from 'react'
import { Icon, Pull, List } from 'zarm'
import dayjs from 'dayjs'

import CustomIcon from '@/components/CustomIcon'
import BillItem from '@/components/BillItem'

import PopupType from '@/components/PopupType'
import PopupDate from '@/components/PopupDate'
import PopupAddBill from '@/components/PopupAddBill'

import { get, REFRESH_STATE, LOAD_STATE } from '@/utils' // Pull 组件需要的一些常量

import s from './style.module.less'

const Home = () => {
  const [list, setList] = useState([]); // 账单列表

  const [page, setPage] = useState(1); // 分页
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态

  /**
   * useRef 返回一个带有 current 属性的对象，你可以通过 ref.current 访问当前值。
   * useRef 与 useState 返回的状态不同之处就是：ref.current 的值是可读可变的，可以直接通过 ref.current = newValue 进行更改。
   * 并且更改 useRef 不会触发组件的重新渲染，这是因为 react 没有对 ref 的值进行 track 操作。
   */
  const typeRef = useRef(); // 账单类型 ref
  const monthRef = useRef(); // 月份筛选 ref
  const addRef = useRef(); // 添加账单项 ref

  const [currentSelect, setCurrentSelect] = useState({}); // 当前筛选类型
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM')); // 当前筛选时间

  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入

  useEffect(() => {
    getBillList() // 初始化
  }, [page, currentSelect, currentTime])

  // 获取账单方法
  const getBillList = async () => {
    try {
      const params = {
        page,
        date: currentTime,
        type_id: currentSelect.id || 'all',
        pageSize: 5,
      }
      const { data } = await get(`/api/bill/list`, { params });
      // 下拉刷新，重制数据
      if (page == 1) {
        setList(data.list);
      } else {
        setList(list.concat(data.list));
      }
      setTotalPage(data.totalPage);
      setTotalExpense(data.totalExpense.toFixed(2));
      setTotalIncome(data.totalIncome.toFixed(2));
      // 上滑加载状态
      setLoading(LOAD_STATE.success);
      setRefreshing(REFRESH_STATE.success);
    } catch (error) {
      console.log('error: ', error);
    }
  }

  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    };
  };

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }

  // popup
  const typeToggle = () => {
    typeRef.current && typeRef.current.show() // 访问子组件的方法
  };
  const monthToggle = () => {
    monthRef.current && monthRef.current.show()
  }
  const addToggle = () => {
    addRef.current && addRef.current.show()
  }

  // 选中账单类型
  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    // 触发刷新列表，将分页重制为 1
    setPage(1);
    setCurrentSelect(item)
  }

  // 选中月份
  const selectMonth = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item)
  }

  return <div className={s.home}>
    <div className={s.header}>
      <div className={s.dataWrap}>
        <span className={s.expense}>总支出：<b>¥ { totalExpense }</b></span>
        <span className={s.income}>总收入：<b>¥ { totalIncome }</b></span>
      </div>
      <div className={s.typeWrap}>
        <div className={s.left} onClick={typeToggle}>
          <span className={s.title}>{currentSelect.name || '全部类型'} <Icon className={s.arrow} type="arrow-bottom" /></span>
        </div>
        <div className={s.right} onClick={monthToggle}>
        <span className={s.time}>{ currentTime }<Icon className={s.arrow} type="arrow-bottom" /></span>

        </div>
      </div>
    </div>
    <div className={s.contentWrap}>
      {
        list.length ?
          <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData
            }}
          >
            <List>
              {
                list.map((item, index) => <BillItem
                  bill={item}
                  key={index}
                />)
              }
            </List>
          </Pull> : null
      }
    </div>

    {/* add bill */}
    <div className={s.add} onClick={addToggle}><CustomIcon type='tianjia' /></div>

    {/* ref 在父组件用到子组件时绑定 */}
    <PopupType ref={typeRef} onSelect={select} />
    <PopupDate ref={monthRef} mode={['year', 'month']} onSelect={selectMonth} />
    
    {/* 子组件调 props.onReload() 刷新父组件 */}
    <PopupAddBill ref={addRef} onReload={refreshData} />
  </div>
}

export default Home;