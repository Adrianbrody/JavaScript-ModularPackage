/**
 * 按钮组件类
 * 提供完整的按钮功能，包括样式、状态管理、事件处理等
 */
class Button {
    constructor(options = {}) {
        this.options = {
            text: options.text || '按钮',
            type: options.type || 'primary', // primary, secondary, success, danger, warning, info
            size: options.size || 'default', // sm, default, lg
            variant: options.variant || 'solid', // solid, outline, ghost
            disabled: options.disabled || false,
            loading: options.loading || false,
            icon: options.icon || null,
            ripple: options.ripple || false,
            className: options.className || '',
            onClick: options.onClick || null,
            ...options
        };

        this.element = null;
        this.isLoading = this.options.loading;
        this.isDisabled = this.options.disabled;

        this.init();
    }

    /**
     * 初始化按钮
     */
    init() {
        this.createElement();
        this.setupEventListeners();
        this.updateState();
    }

    /**
     * 创建按钮元素
     */
    createElement() {
        this.element = document.createElement('button');
        this.element.type = 'button';
        this.element.className = this.buildClassName();
        this.element.textContent = this.options.text;

        // 添加图标
        if (this.options.icon) {
            this.addIcon(this.options.icon);
        }

        // 添加波纹效果
        if (this.options.ripple) {
            this.element.classList.add('btn-ripple');
        }
    }

    /**
     * 构建CSS类名
     */
    buildClassName() {
        const classes = ['btn'];

        // 添加类型类
        classes.push(`btn-${this.options.type}`);

        // 添加尺寸类
        if (this.options.size !== 'default') {
            classes.push(`btn-${this.options.size}`);
        }

        // 添加变体类
        if (this.options.variant !== 'solid') {
            classes.push(`btn-${this.options.variant}`);
        }

        // 添加图标类
        if (this.options.icon) {
            classes.push('btn-icon');
        }

        // 添加自定义类
        if (this.options.className) {
            classes.push(this.options.className);
        }

        return classes.join(' ');
    }

    /**
     * 添加图标
     */
    addIcon(icon) {
        if (typeof icon === 'string') {
            // SVG字符串
            this.element.innerHTML = icon + this.element.textContent;
        } else if (icon instanceof HTMLElement) {
            // DOM元素
            this.element.insertBefore(icon, this.element.firstChild);
        } else if (typeof icon === 'object' && icon.path) {
            // 图标对象
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.classList.add('icon');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', icon.path);
            svg.appendChild(path);

            this.element.insertBefore(svg, this.element.firstChild);
        }
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        if (this.options.onClick) {
            this.element.addEventListener('click', (e) => {
                if (!this.isDisabled && !this.isLoading) {
                    this.options.onClick(e, this);
                }
            });
        }

        // 波纹效果
        if (this.options.ripple) {
            this.element.addEventListener('click', (e) => {
                this.createRipple(e);
            });
        }

        // 键盘事件
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.element.click();
            }
        });
    }

    /**
     * 创建波纹效果
     */
    createRipple(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * 更新按钮状态
     */
    updateState() {
        if (this.isDisabled) {
            this.element.disabled = true;
            this.element.classList.add('disabled');
        } else {
            this.element.disabled = false;
            this.element.classList.remove('disabled');
        }

        if (this.isLoading) {
            this.element.classList.add('btn-loading');
            this.element.disabled = true;
        } else {
            this.element.classList.remove('btn-loading');
            if (!this.isDisabled) {
                this.element.disabled = false;
            }
        }
    }

    /**
     * 设置加载状态
     */
    setLoading(loading) {
        this.isLoading = loading;
        this.updateState();
        return this;
    }

    /**
     * 设置禁用状态
     */
    setDisabled(disabled) {
        this.isDisabled = disabled;
        this.updateState();
        return this;
    }

    /**
     * 设置文本
     */
    setText(text) {
        this.options.text = text;
        this.element.textContent = text;
        return this;
    }

    /**
     * 设置类型
     */
    setType(type) {
        this.options.type = type;
        this.element.className = this.buildClassName();
        return this;
    }

    /**
     * 设置尺寸
     */
    setSize(size) {
        this.options.size = size;
        this.element.className = this.buildClassName();
        return this;
    }

    /**
     * 设置变体
     */
    setVariant(variant) {
        this.options.variant = variant;
        this.element.className = this.buildClassName();
        return this;
    }

    /**
     * 添加CSS类
     */
    addClass(className) {
        this.element.classList.add(className);
        return this;
    }

    /**
     * 移除CSS类
     */
    removeClass(className) {
        this.element.classList.remove(className);
        return this;
    }

    /**
     * 切换CSS类
     */
    toggleClass(className) {
        this.element.classList.toggle(className);
        return this;
    }

    /**
     * 获取按钮元素
     */
    getElement() {
        return this.element;
    }

    /**
     * 销毁按钮
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

/**
 * 按钮组类
 * 管理多个按钮的组合
 */
class ButtonGroup {
    constructor(options = {}) {
        this.options = {
            buttons: options.buttons || [],
            vertical: options.vertical || false,
            className: options.className || '',
            ...options
        };

        this.element = null;
        this.buttons = [];

        this.init();
    }

    /**
     * 初始化按钮组
     */
    init() {
        this.createElement();
        this.addButtons(this.options.buttons);
    }

    /**
     * 创建按钮组元素
     */
    createElement() {
        this.element = document.createElement('div');
        this.element.className = this.buildClassName();
    }

    /**
     * 构建CSS类名
     */
    buildClassName() {
        const classes = ['btn-group'];

        if (this.options.vertical) {
            classes.push('btn-group-vertical');
        }

        if (this.options.className) {
            classes.push(this.options.className);
        }

        return classes.join(' ');
    }

    /**
     * 添加按钮
     */
    addButtons(buttons) {
        buttons.forEach(buttonConfig => {
            this.addButton(buttonConfig);
        });
    }

    /**
     * 添加单个按钮
     */
    addButton(buttonConfig) {
        const button = buttonConfig instanceof Button ? buttonConfig : new Button(buttonConfig);
        this.buttons.push(button);
        this.element.appendChild(button.getElement());
        return button;
    }

    /**
     * 移除按钮
     */
    removeButton(button) {
        const index = this.buttons.indexOf(button);
        if (index > -1) {
            this.buttons.splice(index, 1);
            button.destroy();
        }
    }

    /**
     * 清空按钮组
     */
    clear() {
        this.buttons.forEach(button => button.destroy());
        this.buttons = [];
        this.element.innerHTML = '';
    }

    /**
     * 获取按钮组元素
     */
    getElement() {
        return this.element;
    }

    /**
     * 销毁按钮组
     */
    destroy() {
        this.clear();
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

/**
 * 按钮工具类
 * 提供便捷的按钮创建和管理方法
 */
class ButtonUtils {
    /**
     * 创建按钮的便捷方法
     */
    static create(options) {
        return new Button(options);
    }

    /**
     * 创建按钮组的便捷方法
     */
    static createGroup(options) {
        return new ButtonGroup(options);
    }

    /**
     * 批量创建按钮
     */
    static createMultiple(buttonConfigs) {
        return buttonConfigs.map(config => new Button(config));
    }

    /**
     * 为现有元素添加按钮功能
     */
    static enhance(element, options = {}) {
        const button = new Button({
            ...options,
            element: element
        });
        return button;
    }

    /**
     * 预设按钮配置
     */
    static presets = {
        primary: { type: 'primary' },
        secondary: { type: 'secondary' },
        success: { type: 'success' },
        danger: { type: 'danger' },
        warning: { type: 'warning' },
        info: { type: 'info' },
        small: { size: 'sm' },
        large: { size: 'lg' },
        outline: { variant: 'outline' },
        ghost: { variant: 'ghost' },
        loading: { loading: true },
        disabled: { disabled: true },
        ripple: { ripple: true }
    };

    /**
     * 合并预设配置
     */
    static withPreset(options, ...presets) {
        const merged = { ...options };
        presets.forEach(preset => {
            if (this.presets[preset]) {
                Object.assign(merged, this.presets[preset]);
            }
        });
        return merged;
    }
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
    window.Button = Button;
    window.ButtonGroup = ButtonGroup;
    window.ButtonUtils = ButtonUtils;
}

// 导出到模块系统
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Button, ButtonGroup, ButtonUtils };
} 