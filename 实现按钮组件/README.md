# 按钮组件 (Button Component)

一个功能齐全、可复用性高的按钮组件，使用原生 HTML、CSS 和 JavaScript 实现。

## 特性

- 🎨 **多种样式变体**: 支持实心、描边、幽灵三种样式
- 🌈 **丰富的颜色主题**: 6种预设颜色（主要、次要、成功、危险、警告、信息）
- 📏 **灵活的尺寸**: 小、默认、大三种尺寸
- 🔄 **状态管理**: 支持禁用、加载等状态
- ✨ **动画效果**: 悬停动画、波纹效果、加载动画
- 🎯 **图标支持**: 内置SVG图标支持
- 📱 **响应式设计**: 完美适配移动端
- 🌙 **深色模式**: 自动适配系统主题
- ♿ **无障碍支持**: 键盘导航和屏幕阅读器友好
- ⚡ **高性能**: 轻量级实现，无外部依赖

## 快速开始

### 1. 引入文件

```html
<link rel="stylesheet" href="styles.css">
<script src="button.js"></script>
```

### 2. 基础用法

```javascript
// 创建基础按钮
const button = new Button({
    text: '点击我',
    type: 'primary',
    onClick: (e, btn) => {
        console.log('按钮被点击了！');
    }
});

// 添加到页面
document.body.appendChild(button.getElement());
```

### 3. 使用便捷方法

```javascript
// 使用工具类创建按钮
const button = ButtonUtils.create({
    text: '保存',
    type: 'success',
    size: 'lg',
    ripple: true
});

// 使用预设配置
const button = ButtonUtils.withPreset(
    { text: '删除' },
    'danger',
    'outline',
    'small'
);
```

## API 文档

### Button 类

#### 构造函数参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `text` | string | '按钮' | 按钮文本 |
| `type` | string | 'primary' | 按钮类型 (primary, secondary, success, danger, warning, info) |
| `size` | string | 'default' | 按钮尺寸 (sm, default, lg) |
| `variant` | string | 'solid' | 按钮样式 (solid, outline, ghost) |
| `disabled` | boolean | false | 是否禁用 |
| `loading` | boolean | false | 是否显示加载状态 |
| `icon` | string/object | null | 图标配置 |
| `ripple` | boolean | false | 是否启用波纹效果 |
| `className` | string | '' | 自定义CSS类名 |
| `onClick` | function | null | 点击事件回调 |

#### 方法

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `setText(text)` | string | Button | 设置按钮文本 |
| `setType(type)` | string | Button | 设置按钮类型 |
| `setSize(size)` | string | Button | 设置按钮尺寸 |
| `setVariant(variant)` | string | Button | 设置按钮样式 |
| `setDisabled(disabled)` | boolean | Button | 设置禁用状态 |
| `setLoading(loading)` | boolean | Button | 设置加载状态 |
| `addClass(className)` | string | Button | 添加CSS类 |
| `removeClass(className)` | string | Button | 移除CSS类 |
| `toggleClass(className)` | string | Button | 切换CSS类 |
| `getElement()` | - | HTMLElement | 获取按钮DOM元素 |
| `destroy()` | - | - | 销毁按钮 |

### ButtonGroup 类

#### 构造函数参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `buttons` | array | [] | 按钮配置数组 |
| `vertical` | boolean | false | 是否垂直排列 |
| `className` | string | '' | 自定义CSS类名 |

#### 方法

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `addButton(buttonConfig)` | object/Button | Button | 添加按钮 |
| `removeButton(button)` | Button | - | 移除按钮 |
| `clear()` | - | - | 清空按钮组 |
| `getElement()` | - | HTMLElement | 获取按钮组DOM元素 |
| `destroy()` | - | - | 销毁按钮组 |

### ButtonUtils 工具类

#### 静态方法

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `create(options)` | object | Button | 创建按钮 |
| `createGroup(options)` | object | ButtonGroup | 创建按钮组 |
| `createMultiple(configs)` | array | Button[] | 批量创建按钮 |
| `enhance(element, options)` | HTMLElement, object | Button | 为现有元素添加按钮功能 |
| `withPreset(options, ...presets)` | object, ...string | object | 合并预设配置 |

#### 预设配置

| 预设名 | 描述 |
|--------|------|
| `primary` | 主要按钮样式 |
| `secondary` | 次要按钮样式 |
| `success` | 成功按钮样式 |
| `danger` | 危险按钮样式 |
| `warning` | 警告按钮样式 |
| `info` | 信息按钮样式 |
| `small` | 小尺寸 |
| `large` | 大尺寸 |
| `outline` | 描边样式 |
| `ghost` | 幽灵样式 |
| `loading` | 加载状态 |
| `disabled` | 禁用状态 |
| `ripple` | 波纹效果 |

## 使用示例

### 基础按钮

```javascript
// 主要按钮
const primaryBtn = ButtonUtils.create({
    text: '主要操作',
    type: 'primary',
    onClick: () => alert('主要操作')
});

// 成功按钮
const successBtn = ButtonUtils.create({
    text: '保存',
    type: 'success',
    icon: { path: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' }
});
```

### 不同尺寸和样式

```javascript
// 小尺寸描边按钮
const smallOutlineBtn = ButtonUtils.create({
    text: '小按钮',
    type: 'primary',
    size: 'sm',
    variant: 'outline'
});

// 大尺寸幽灵按钮
const largeGhostBtn = ButtonUtils.create({
    text: '大按钮',
    type: 'danger',
    size: 'lg',
    variant: 'ghost'
});
```

### 带图标的按钮

```javascript
// 使用SVG路径
const iconBtn = ButtonUtils.create({
    text: '添加',
    type: 'success',
    icon: { path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' }
});

// 使用SVG字符串
const svgBtn = ButtonUtils.create({
    text: '删除',
    type: 'danger',
    icon: '<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/></svg>'
});
```

### 按钮组

```javascript
const buttonGroup = ButtonUtils.createGroup({
    buttons: [
        {
            text: '保存',
            type: 'success',
            onClick: () => console.log('保存')
        },
        {
            text: '取消',
            type: 'secondary',
            onClick: () => console.log('取消')
        },
        {
            text: '删除',
            type: 'danger',
            onClick: () => console.log('删除')
        }
    ]
});
```

### 状态管理

```javascript
const button = ButtonUtils.create({
    text: '提交',
    type: 'primary'
});

// 设置加载状态
button.setLoading(true);

// 模拟异步操作
setTimeout(() => {
    button.setLoading(false);
    button.setText('提交成功');
    button.setType('success');
}, 2000);
```

### 使用预设

```javascript
// 组合多个预设
const button = ButtonUtils.create(
    ButtonUtils.withPreset(
        { text: '快速创建' },
        'primary',
        'outline',
        'small',
        'ripple'
    )
);
```

## CSS 类名

### 基础类名

- `.btn` - 基础按钮样式
- `.btn-primary` - 主要按钮
- `.btn-secondary` - 次要按钮
- `.btn-success` - 成功按钮
- `.btn-danger` - 危险按钮
- `.btn-warning` - 警告按钮
- `.btn-info` - 信息按钮

### 尺寸类名

- `.btn-sm` - 小尺寸
- `.btn-lg` - 大尺寸

### 样式变体

- `.btn-outline` - 描边样式
- `.btn-ghost` - 幽灵样式

### 状态类名

- `.btn-loading` - 加载状态
- `.btn-ripple` - 波纹效果
- `.btn-icon` - 图标按钮

### 组合类名

- `.btn-group` - 按钮组容器

## 自定义样式

### 修改颜色主题

```css
/* 自定义主要按钮颜色 */
.btn-primary {
    background-color: #your-color;
    border-color: #your-color;
}

.btn-primary:hover:not(:disabled) {
    background-color: #your-hover-color;
    border-color: #your-hover-color;
}
```

### 添加新的按钮类型

```css
/* 自定义按钮类型 */
.btn-custom {
    background-color: #custom-color;
    color: white;
    border-color: #custom-color;
}

.btn-custom:hover:not(:disabled) {
    background-color: #custom-hover-color;
    border-color: #custom-hover-color;
}
```

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 性能优化

- 使用 CSS 硬件加速
- 事件委托优化
- 内存泄漏防护
- 懒加载支持

## 无障碍支持

- 键盘导航支持 (Enter, Space)
- ARIA 属性支持
- 屏幕阅读器友好
- 焦点管理

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基础按钮功能
- 支持多种样式和尺寸
- 支持图标和波纹效果
- 支持按钮组
- 支持响应式设计 