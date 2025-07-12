/*
 * Carousel 轮播图组件（支持无缝循环）
 * 使用方法：
 *   1. 在HTML中准备一个容器元素（如<div id="carousel"></div>）。
 *   2. 调用 new Carousel(container, images, options) 创建实例。
 *   3. 支持自动播放、左右切换、指示点、循环、暂停、API控制等。
 *
 * 参数说明：
 *   container: DOM元素或选择器字符串
 *   images: 图片URL数组
 *   options: 可选配置对象
 *     - width: 轮播图宽度（默认600px）
 *     - height: 轮播图高度（默认300px）
 *     - interval: 自动播放间隔（ms，默认3000）
 *     - showArrows: 是否显示左右箭头（默认true）
 *     - showIndicators: 是否显示指示点（默认true）
 *     - loop: 是否循环播放（默认true）
 *     - pauseOnHover: 悬停是否暂停（默认true）
 *       slide: 是否鼠标左右滑动
 */
class Carousel {
    constructor(container, images, options = {}) {
        this.container = typeof container === "string" ? document.querySelector(container) : container;
        this.images = images;
        this.options = Object.assign({
            width: 600, //轮播图宽度
            height: 300, //轮播图高度
            interval: 3000, //自动播放间隔时间
            showArrows: true, //是否显示左右箭头
            showIndicators: true, //是否显示指示点
            loop: true, //是否循环播放
            pauseOnHover: true, //悬停是否暂停
            slide: true //是否鼠标左右滑动
        }, options);

        //无缝循环关键变量
        this.realCount = images.length; //原始图片数量
        this.current = 1; //当前显示的位置(从索引1开始)
        this.timer = null; //自动播放定时器
        this.isPaused = false; //暂停状态标识
        this.transitioning = false; //过渡动画状态锁(防止动画冲突)
        this.init(); //初始化轮播图
    }

    //初始化轮播图
    init() {
        //容器的基础样式
        this.container.classList.add('carousel-container'); //添加类名
        this.container.style.position = "relative"; //相对自身定位
        this.container.style.overflow = "hidden"; //超出容器范围的内容隐藏起来，而且也不会显示滚动条。
        this.container.style.width = this.options.width + "px"; //设置宽度
        this.container.style.height = this.options.height + "px"; //设置高度

        //创建图片列表(无缝循环：首尾个克隆一张图片)/创建轨道元素(核心移动容器)
        this.track = document.createElement('div'); //创建一个div标签
        this.track.className = "carousel-track"; //设置新的类名
        this.track.style.display = "flex"; //设置弹性盒
        this.track.style.transition = 'transform 0.5s'; //过渡动画
        this.track.style.width = ((this.realCount + 2) * this.options.width + "px");
        this.container.appendChild(this.track); //向父元素添加新建的节点

        /**
       * 无缝循环核心机制：
       * 1. 开头克隆最后一张图片（索引0）
       * 2. 添加原始图片（索引1~realCount）
       * 3. 结尾克隆第一张图片（索引realCount+1）
       * 视觉轨迹：[克隆尾]-[图1]-[图2]...[图N]-[克隆头]
       */


        //克隆最后一张到最后面
        const firstClone = document.createElement('img'); //创建图片元素标签
        firstClone.src = this.images[this.realCount - 1]; //获取最后一张图片
        firstClone.style.width = this.options.width + "px"; //设置宽度
        firstClone.style.height = this.options.height + "px"; //设置高度
        firstClone.style.objectFit = "cover";
        //当设置为 "cover" 时，元素会按比例缩放，直至完全填满容器。
        //在这个过程中，元素可能会有部分被裁剪，但不会出现变形的情况
        this.track.appendChild(firstClone); //把元素插入容器中

        //添加所有图片
        this.images.forEach((src) => {
            const img = document.createElement('img');
            img.src = src;
            img.style.width = this.options.width + "px";
            img.style.height = this.options.height + "px";
            img.style.objectFit = "cover";
            this.track.appendChild(img);
        });

        //克隆第一张到最后面
        const lastClone = document.createElement("img");
        lastClone.src = this.images[0];
        lastClone.style.width = this.options.width + "px";
        lastClone.style.height = this.options.height + "px";
        lastClone.style.objectFit = "cover";
        this.track.appendChild(lastClone);

        //初始位置(显示第一张，实际索引)
        this.track.style.transform = `translateX(-${this.current * this.options.width}px)`;

        //创建左右箭头
        if (this.options.showArrows) {
            this.createArrows();
        }
        //创建指示点
        if (this.options.showIndicators) {
            this.createIndicators();
        }

        //是否自动播放
        if (this.options.loop) {
            this.start();
            //悬停暂停
            if (this.options.pauseOnHover) {
                this.container.addEventListener("mouseenter", () => this.pause());
                this.container.addEventListener("mouseleave", () => this.start())
            }
        } else {
            this.pause();
        }

        //监听过度事件，实现无缝跳转
        // 这段代码给 DOM 元素this.track
        // 添加了transitionend事件监听器，
        // 一旦 CSS 过渡动画结束，就会触发this.onTransitionEnd()方法
        this.track.addEventListener("transitionend", () => this.onTransitionEnd())

        //是否可滑动
        if (this.options.slide) {
            this.createSlide()
        }
    }
    // ====== 新增：触摸滑动事件监听 ======
    // 创建滑动检测功能的方法
    createSlide() {
        // 初始化触摸起始点坐标
        this.startX = 0;
        // 初始化触摸结束点坐标
        this.endX = 0;
        // 标记当前是否正在触摸中
        this.touching = false;

        // 添加触摸开始事件监听器
        this.container.addEventListener('touchstart', (e) => {
            // 确保是单指操作（避免多指触摸干扰）
            if (e.touches.length === 1) {
                // 记录触摸起始点的X坐标（手指接触屏幕的水平位置）
                this.startX = e.touches[0].clientX;
                // 标记开始触摸状态
                this.touching = true;
            }
        });

        // 添加触摸移动事件监听器
        this.container.addEventListener('touchmove', (e) => {
            // 如果不在有效触摸状态则退出
            if (!this.touching) return;
            // 实时更新触摸结束点的X坐标（手指移动时的位置）
            this.endX = e.touches[0].clientX;
        });

        // 添加触摸结束事件监听器
        this.container.addEventListener('touchend', (e) => {
            // 如果不在有效触摸状态则退出
            if (!this.touching) return;

            // 计算滑动距离（结束点与起始点的水平差值）
            const deltaX = this.endX - this.startX;
            // 设置滑动触发阈值（50像素）
            const threshold = 50;

            // 判断滑动距离是否超过阈值
            if (Math.abs(deltaX) > threshold) {
                // 负值表示向左滑动
                if (deltaX < 0) {
                    this.next(); // 执行下一页操作
                }
                // 正值表示向右滑动
                else {
                    this.prev(); // 执行上一页操作
                }
            }

            // 重置触摸状态
            this.touching = false;
            // 重置起始点坐标
            this.startX = 0;
            // 重置结束点坐标
            this.endX = 0;
        });
    }

    //创建左右箭头
    createArrows() {
        this.prevBth = document.createElement('buttom'); //创建上一个按钮
        this.nextBtn = document.createElement('button'); //创建下一个按钮
        this.prevBth.className = "carousel-arrow carousel-prev"; //设置类名
        this.nextBtn.className = 'carousel-arrow carousel-next'; //设置类名
        this.prevBth.innerHTML = "&#8592"; //"&#8592;"：这是一个 HTML 实体编码，对应的是左箭头符号（←）
        this.nextBtn.innerHTML = '&#8594;';//"&#8594;"：这是一个 HTML 实体编码，对应的是左箭头符号（→）
        this.prevBth.style.position = this.nextBtn.style.position = "absolute"; //设置相对定位
        //先把元素上边缘定位到父容器垂直中心，再让元素向上移动自身高度的一半，最终达成垂直居中的效果
        this.prevBth.style.top = this.nextBtn.style.top = "50%";
        this.prevBth.style.transform = this.nextBtn.style.transform = "translateY(-50%)";
        this.prevBth.style.left = "10px";
        this.nextBtn.style.right = "10px";
        this.container.appendChild(this.prevBth); //把元素插入父容器中
        this.container.appendChild(this.nextBtn);
        this.prevBth.addEventListener('click', () => this.prev()); //点击上一页
        this.nextBtn.addEventListener('click', () => this.next()); //点击下一页

    }

    //创建指示点
    createIndicators() {
        //指示点点容器
        this.indicators = document.createElement("div");
        this.indicators.className = "carousel-indicators";
        this.indicators.style.position = "absolute";
        this.indicators.style.left = "50%";
        this.indicators.style.transform = "translateX(-50%)";
        this.indicators.style.bottom = "10px";
        this.indicators.style.display = "flex";
        //  gap = "8px"：gap属性主要用于控制网格（Grid）或者弹性布局
        // （Flexbox）中元素之间的间距。这里把间距设定为 8 像素，意味
        // 着元素之间会留出 8 像素宽的空白区域。
        this.indicators.style.gap = "8px";
        this.container.appendChild(this.indicators);
        //生成指示点按钮
        this.dots = [];
        this.images.forEach((item, index) => {
            const dot = document.createElement("span"); //创建span标签
            dot.className = "carousel-dot";
            dot.style.display = "inline-block"; //把元素设置为行内元素
            dot.style.width = dot.style.height = "10px";
            dot.style.borderRadius = "50%"; //把指示点按钮设置为圆形
            dot.style.background = index === 0 ? "#333" : "#ccc"; // 设置按钮背景
            dot.style.cursor = "pointer"; //把鼠标移动到特定元素上方时的指针形状变为手形图标
            // 点击跳转逻辑（索引+1匹配真实位置）
            dot.addEventListener("click", () => this.goTo(index + 1))
            this.indicators.appendChild(dot);
            this.dots.push(dot); //添加到空数组里面
        })
    }
    //跳转到指定图片(index为真实图片索引)
    goTo(index) {
        //防止动画重叠（当前动画未完成时禁止新操作）
        if (this.transitioning) return;
        this.transitioning = true;  // 设置状态锁
        this.current = index;       // 更新当前位置
        this.update();      // 执行位置更新

    }

    //上一张
    prev() {
        if (this.transitioning) return;
        this.goTo(this.current - 1);
    }
    //下一张
    next() {
        if (this.transitioning) return;
        this.goTo(this.current + 1);
    }

    // 过渡结束处理器 (无缝循环核心逻辑)
    // 职责：检测是否到达边界克隆项，执行无缝跳转
    onTransitionEnd() {
        this.transitioning = false; //释放状态锁
        /* 边界情况处理：
       * 场景1：显示开头的克隆项（索引0）→ 实际应跳转至最后一张
       * 场景2：显示结尾的克隆项（索引realCount+1）→ 实际应跳转至第一张
       */
        //到假首（current = 0）,无动画跳到真尾
        if (this.current === 0) {
            this.track.style.transition = "none"; //把动画关闭
            this.current = this.realCount; //更新索引位置 
            this.track.style.transform = `translateX(-${this.cursor * this.options.width}px)`;
            //强制重绘，恢复动画
            void this.track.offsetWidth;
            this.track.style.transition = "transform 0.5s";
        }
        // 到假尾（current=realCount+1），无动画跳到真首
        if (this.current === this.realCount + 1) {
            this.track.style.transition = 'none';
            this.current = 1;
            this.track.style.transform = `translateX(-${this.current * this.options.width}px)`;
            void this.track.offsetWidth;
            this.track.style.transition = 'transform 0.5s';
        }

        //更新指示点
        if (this.options.showIndicators && this.dots) {
            this.dots.forEach((dot, i) => {
                dot.style.background = (i + 1) === this.current ? "#333" : "#ccc";
            })
        }
    }

    //更新轮播图显示
    update() {
        this.track.style.transition = "transform 0.5s"; //轮播时添加动画
        this.track.style.transform = `translateX(-${this.current * this.options.width}px)`; //动画移动
        //指示点在onTransitionEnd里更新
    }
    //自动播放
    start() {
        if (this.timer) clearInterval(this.timer); //清除已有的定时器
        this.isPaused = false;
        this.timer = setInterval(() => {
            if (!this.isPaused) this.next(); //非暂停状态跳转下一张
        }, this.options.interval);
    }

    //暂停自动播放
    pause() {
        this.isPaused = true;
        if (this.timer) clearInterval(this.timer); //暂停定时器
    }

    //销毁轮播图
    destroy() {
        this.pause();
        this.container.innerHTML = "";
        this.container.classList.remove("carousel-container");
    }
}
