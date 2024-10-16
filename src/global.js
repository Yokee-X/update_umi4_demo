import React from 'react';
import { Modal, DatePicker, InputNumber, message, ConfigProvider } from 'antd';
import SimpleEvent from '@/utils/SimpleEvent';
import moment from 'moment';
import TrimBlurInput from '@/components/TrimBlurInput';
import theme from './theme';
window.appMeta = APP_METADATA;
window.eventCenter = new SimpleEvent();
message.config({ maxCount: 1 });

// // 模态窗上扩展prompt 弹出输入组件
// Modal.prompt = function (opts) {
//     const { inputProps, onOk, content, inputType, ...restProps } = opts;
//     let ref = React.createRef();
//     const Field = inputType === 'textarea' ? TrimBlurInput.TextArea : TrimBlurInput;
//     return Modal.confirm({
//         ...restProps,
//         content: (
//             <div className={'gutter-v_lg'} ref={ref}>
//                 {content}
//                 <Field {...inputProps} />
//             </div>
//         ),
//         onOk: () => {
//             const value = ref.current.querySelector('.ant-input').value;
//             return onOk(value);
//         }
//     });
// };

// Modal.defaultProps.maskClosable = false;
// const disabledDate = c => {
//     return c < moment('2021-1-1') || moment() < c;
// };
// DatePicker.defaultProps.disabledDate = disabledDate;
// DatePicker.RangePicker.defaultProps.disabledDate = disabledDate;
// DatePicker.WeekPicker.defaultProps.disabledDate = disabledDate;
// DatePicker.MonthPicker.defaultProps.disabledDate = disabledDate;
// InputNumber.defaultProps.maxLength = 30;
