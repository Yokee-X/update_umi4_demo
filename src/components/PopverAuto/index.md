---
title:  
  en-US: PopverAuto 
  zh-CN: PopverAuto
subtitle: 升级版文本自动省略号
---

Ellipsis的升级版，自动检测当前容器内容是否超出容器长度，如果超出长度自动在容器末尾添加省略号并在鼠标放上去的时候在指定位置显示完整的内容（默认左上），支持按照文本长度和最大行数两种方式截取。
基于 antd的popver组件实现

## API

### PopverAuto 组件属性

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| length | 在按照长度截取下的文本最大字符数，超过则截取省略 | number | 0 |
| lines | 在按照行数截取下最大的行数，超过则截取省略 | number | 0 |
| style | 样式 | Object | - |
| title | 卡片标题 | ReactNode | () => ReactNode  | null |
| content | 卡片标题 | ReactNode | () => ReactNode  | null |
| className | 类名，仅对全局作用域的样式生效 | string | '' |
| leaveTime | 鼠标移开leaveTime毫秒关闭提示框 | number | 100 |
| placement | 气泡框位置，可选 top left right bottom topLeft topRight bottomLeft bottomRight leftTop leftBottom rightTop rightBottom | string | leftTop |
| ... | 其他参数和react的一致| ... | - |