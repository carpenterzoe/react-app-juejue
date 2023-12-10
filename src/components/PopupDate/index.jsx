// 账单筛选 - 时间
import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Popup, DatePicker } from 'zarm'
import dayjs from 'dayjs'

// 将子组件传递给 forwardRef
const PopupDate = forwardRef(({ onSelect, mode = ['year', 'month'] }, ref) => {
  const [show, setShow] = useState(false)
  const [now, setNow] = useState(new Date())

  const choseMonth = (item) => {
    setNow(item)
    setShow(false)
    if (mode.length === 2) {
      onSelect(dayjs(item).format('YYYY-MM'))
    } else if (mode.length === 3) {
      onSelect(dayjs(item).format('YYYY-MM-DD'))
    }
  }

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false)
      }
    }
  };
  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div>
      <DatePicker
        visible={show}
        value={now}
        columnType={mode}
        onConfirm={choseMonth}
        onCancel={() => setShow(false)}
      />
    </div>
  </Popup>
});

PopupDate.propTypes = {
  mode: PropTypes.string, // 日期模式
  onSelect: PropTypes.func, // 选择后的回调
}

export default PopupDate;