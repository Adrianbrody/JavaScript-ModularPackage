/**
 * 按钮组件演示文件
 * 展示各种按钮功能和用法
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    initDemo();
});

function initDemo() {
    // 初始化事件演示
    initEventDemo();

    // 初始化动态按钮
    initDynamicButtons();

    // 初始化状态切换
    initStateToggle();

    // 初始化波纹效果
    initRippleEffect();

    // 初始化按钮组
    initButtonGroups();

    // 初始化预设按钮
    initPresetButtons();
}

/**
 * 事件演示
 */
function initEventDemo() {
    const clickBtn = document.getElementById('clickBtn');
    const hoverBtn = document.getElementById('hoverBtn');
    const rippleBtn = document.getElementById('rippleBtn');
    const eventLog = document.getElementById('eventLog');

    // 点击事件
    clickBtn.addEventListener('click', function (e) {
        logEvent('点击事件', e.target.textContent);
        showNotification('按钮被点击了！', 'success');
    });

    // 悬停事件
    hoverBtn.addEventListener('mouseenter', function (e) {
        logEvent('鼠标进入', e.target.textContent);
    });

    hoverBtn.addEventListener('mouseleave', function (e) {
        logEvent('鼠标离开', e.target.textContent);
    });

    // 波纹效果
    rippleBtn.classList.add('btn-ripple');
    rippleBtn.addEventListener('click', function (e) {
        createRipple(e);
        logEvent('波纹效果', e.target.textContent);
    });
}

/**
 * 动态按钮创建
 */
function initDynamicButtons() {
    const dynamicContainer = document.getElementById('dynamicButtons');
    const addButton = document.getElementById('addButton');
    let buttonCount = 0;

    // 添加按钮事件
    addButton.addEventListener('click', function () {
        buttonCount++;
        const button = ButtonUtils.create({
            text: `动态按钮 ${buttonCount}`,
            type: getRandomType(),
            size: getRandomSize(),
            variant: getRandomVariant(),
            ripple: true,
            onClick: function (e, btn) {
                showNotification(`动态按钮 ${buttonCount} 被点击了！`, 'info');
                // 随机改变按钮样式
                setTimeout(() => {
                    btn.setType(getRandomType());
                    btn.setVariant(getRandomVariant());
                }, 500);
            }
        });

        dynamicContainer.appendChild(button.getElement());

        // 限制最多显示5个动态按钮
        if (dynamicContainer.children.length > 5) {
            dynamicContainer.removeChild(dynamicContainer.firstChild);
        }
    });
}

/**
 * 状态切换演示
 */
function initStateToggle() {
    const toggleBtn = document.getElementById('toggleBtn');
    let isEnabled = true;

    toggleBtn.addEventListener('click', function () {
        if (isEnabled) {
            this.setDisabled(true);
            this.setText('已禁用');
            showNotification('按钮已禁用', 'warning');
        } else {
            this.setDisabled(false);
            this.setText('切换状态');
            showNotification('按钮已启用', 'success');
        }
        isEnabled = !isEnabled;
    });
}

/**
 * 波纹效果
 */
function initRippleEffect() {
    // 为所有按钮添加波纹效果
    document.querySelectorAll('.btn').forEach(btn => {
        if (!btn.classList.contains('btn-loading')) {
            btn.classList.add('btn-ripple');
            btn.addEventListener('click', createRipple);
        }
    });
}

/**
 * 按钮组演示
 */
function initButtonGroups() {
    // 创建自定义按钮组
    const customGroup = ButtonUtils.createGroup({
        buttons: [
            {
                text: '保存',
                type: 'success',
                icon: { path: 'M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z' },
                onClick: () => showNotification('保存成功！', 'success')
            },
            {
                text: '取消',
                type: 'secondary',
                onClick: () => showNotification('操作已取消', 'info')
            },
            {
                text: '删除',
                type: 'danger',
                icon: { path: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' },
                onClick: () => showNotification('删除确认', 'warning')
            }
        ]
    });

    // 将按钮组添加到页面
    const buttonGroupSection = document.querySelector('.demo-section:nth-child(6)');
    buttonGroupSection.appendChild(customGroup.getElement());
}

/**
 * 预设按钮演示
 */
function initPresetButtons() {
    const presetContainer = document.createElement('div');
    presetContainer.className = 'button-group';
    presetContainer.style.marginTop = '1rem';

    // 使用预设创建按钮
    const presetButtons = [
        ButtonUtils.withPreset({ text: '预设主要' }, 'primary'),
        ButtonUtils.withPreset({ text: '预设成功' }, 'success'),
        ButtonUtils.withPreset({ text: '预设描边' }, 'primary', 'outline'),
        ButtonUtils.withPreset({ text: '预设小按钮' }, 'danger', 'small'),
        ButtonUtils.withPreset({ text: '预设大按钮' }, 'warning', 'large'),
        ButtonUtils.withPreset({ text: '预设波纹' }, 'info', 'ripple')
    ].map(config => ButtonUtils.create(config));

    presetButtons.forEach(btn => {
        presetContainer.appendChild(btn.getElement());
    });

    // 添加到页面
    const lastSection = document.querySelector('.demo-section:last-child');
    lastSection.appendChild(presetContainer);
}

/**
 * 工具函数
 */
function getRandomType() {
    const types = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
    return types[Math.floor(Math.random() * types.length)];
}

function getRandomSize() {
    const sizes = ['sm', 'default', 'lg'];
    return sizes[Math.floor(Math.random() * sizes.length)];
}

function getRandomVariant() {
    const variants = ['solid', 'outline', 'ghost'];
    return variants[Math.floor(Math.random() * variants.length)];
}

function createRipple(event) {
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

function logEvent(type, buttonText) {
    const eventLog = document.getElementById('eventLog');
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = `[${timestamp}] ${type}: ${buttonText}`;

    eventLog.appendChild(logEntry);
    eventLog.scrollTop = eventLog.scrollHeight;

    // 限制日志条目数量
    if (eventLog.children.length > 10) {
        eventLog.removeChild(eventLog.firstChild);
    }
}

function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // 添加样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });

    // 设置背景色
    const colors = {
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // 添加到页面
    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * 键盘快捷键支持
 */
document.addEventListener('keydown', function (e) {
    // Ctrl + B 创建新按钮
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        document.getElementById('addButton').click();
    }

    // Ctrl + L 清空日志
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        document.getElementById('eventLog').innerHTML = '';
    }
});

/**
 * 性能监控
 */
function monitorPerformance() {
    const startTime = performance.now();

    // 创建100个按钮测试性能
    const testContainer = document.createElement('div');
    testContainer.style.display = 'none';
    document.body.appendChild(testContainer);

    for (let i = 0; i < 100; i++) {
        const btn = ButtonUtils.create({
            text: `测试按钮 ${i}`,
            type: 'primary'
        });
        testContainer.appendChild(btn.getElement());
    }

    const endTime = performance.now();
    console.log(`创建100个按钮耗时: ${(endTime - startTime).toFixed(2)}ms`);

    // 清理测试元素
    document.body.removeChild(testContainer);
}

// 页面加载完成后运行性能测试
window.addEventListener('load', function () {
    setTimeout(monitorPerformance, 1000);
});

/**
 * 响应式处理
 */
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        if (isMobile) {
            btn.style.width = '100%';
        } else {
            btn.style.width = '';
        }
    });
}

window.addEventListener('resize', handleResize);
handleResize(); // 初始调用 