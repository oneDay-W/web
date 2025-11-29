// 页面加载完成后隐藏加载动画
window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('loader').classList.add('hidden');
        
        // 初始化技能水平指示器
        initSkillLevels();
        
        // 初始化摄影集筛选功能
        initPhotoFilters();
    }, 2000);
});

// 移动端导航菜单切换
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // 移动端点击后关闭菜单
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// 滚动时添加动画
function checkScroll() {
    const elements = document.querySelectorAll('.section-title, .about-content, .skill-card, .portfolio-item, .photo-item, .blog-item, .contact-container');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('animated');
        }
    });
}

// 初始检查
checkScroll();

// 滚动时检查
window.addEventListener('scroll', checkScroll);

// 表单提交
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('感谢您的留言！我会尽快回复您。');
    this.reset();
});

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 26, 0.95)';
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.background = 'rgba(10, 10, 26, 0.8)';
        header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
    }
});

// 鼠标跟随效果
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// 粒子背景配置
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#00a8ff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#00a8ff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
        }
    },
    retina_detect: true
});

// 音乐播放器功能
const audio = new Audio();
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const volumeBtn = document.getElementById('volume-btn');
const volumeLevel = document.getElementById('volume-level');
const playlistItems = document.querySelectorAll('.playlist-item');
const closeBtn = document.getElementById('close-btn');
const musicPlayer = document.getElementById('music-player');
const musicToggle = document.getElementById('music-toggle');
const visualizerBars = document.querySelectorAll('.bar');

// 模拟音乐数据 - 使用可访问的音乐文件
const tracks = [
  {
        title: '又活了一天（哈基米版）',
        artist: '哈基米',
        src: './music/又活了一天（哈基米版）.mp3',
        cover: './pictures/又活了一天（哈基米版）.jpeg'
    },
    {
        title: 'This Is Why I Was Born',
        artist: '8 Dawn Music',
        src: './music/This Is Why I Was Born.mp3',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    },
    {
        title: '程艾影',
        artist: '赵雷',
        src: './music/程艾影.mp3',
        cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    },
];

let currentTrackIndex = 0;
let isPlaying = false;
let isPlayerVisible = false;

// 初始化播放器
function initPlayer() {
    loadTrack(currentTrackIndex);
    audio.volume = 0.7;
    updateVolumeUI();
    
    // 事件监听
    playPauseBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    volumeBtn.addEventListener('click', toggleMute);
    musicToggle.addEventListener('click', togglePlayer);
    closeBtn.addEventListener('click', togglePlayer);
    
    // 进度条点击事件
    const progressBar = document.querySelector('.progress-bar');
    progressBar.addEventListener('click', setProgress);
    
    // 音量条点击事件
    const volumeBar = document.querySelector('.volume-bar');
    volumeBar.addEventListener('click', setVolume);
    
    // 播放列表点击事件
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            loadTrack(index);
            playTrack();
        });
    });
    
    // 音频事件
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateTotalTime);
    audio.addEventListener('ended', nextTrack);
    
    // 点击播放器外部关闭播放器
    document.addEventListener('click', (e) => {
        if (!musicPlayer.contains(e.target) && !musicToggle.contains(e.target) && isPlayerVisible) {
            togglePlayer();
        }
    });
}

// 切换播放器显示/隐藏
function togglePlayer() {
    isPlayerVisible = !isPlayerVisible;
    if (isPlayerVisible) {
        musicPlayer.classList.add('active');
    } else {
        musicPlayer.classList.remove('active');
    }
}

// 加载曲目
function loadTrack(index) {
    currentTrackIndex = index;
    const track = tracks[index];
    audio.src = track.src;
    document.querySelector('.track-name').textContent = track.title;
    document.querySelector('.track-artist').textContent = track.artist;
    document.querySelector('.track-cover img').src = track.cover;
    
    // 更新播放列表活动项
    playlistItems.forEach(item => item.classList.remove('active'));
    playlistItems[index].classList.add('active');
}

// 播放/暂停
function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function playTrack() {
    isPlaying = true;
    audio.play();
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
    
    // 启动频谱动画
    visualizerBars.forEach(bar => {
        bar.style.animationPlayState = 'running';
    });
}

function pauseTrack() {
    isPlaying = false;
    audio.pause();
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    
    // 暂停频谱动画
    visualizerBars.forEach(bar => {
        bar.style.animationPlayState = 'paused';
    });
}

// 上一曲/下一曲
function prevTrack() {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
        currentTrackIndex = tracks.length - 1;
    }
    loadTrack(currentTrackIndex);
    playTrack();
}

function nextTrack() {
    currentTrackIndex++;
    if (currentTrackIndex >= tracks.length) {
        currentTrackIndex = 0;
    }
    loadTrack(currentTrackIndex);
    playTrack();
}

// 更新进度条
function updateProgress() {
    const { currentTime, duration } = audio;
    if (isNaN(duration)) return;
    
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // 更新时间显示
    currentTimeEl.textContent = formatTime(currentTime);
}

// 设置进度
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    if (isNaN(duration)) return;
    
    audio.currentTime = (clickX / width) * duration;
}

// 更新总时间
function updateTotalTime() {
    totalTimeEl.textContent = formatTime(audio.duration);
}

// 格式化时间
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// 音量控制
function toggleMute() {
    audio.muted = !audio.muted;
    const icon = volumeBtn.querySelector('i');
    
    if (audio.muted) {
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
    } else {
        icon.classList.remove('fa-volume-mute');
        icon.classList.add('fa-volume-up');
    }
}

function setVolume(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const volume = clickX / width;
    
    audio.volume = volume;
    updateVolumeUI();
}

function updateVolumeUI() {
    const volumePercent = audio.volume * 100;
    volumeLevel.style.width = `${volumePercent}%`;
}

// 初始化播放器
initPlayer();

// 项目筛选功能
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 移除所有按钮的active类
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // 为当前按钮添加active类
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// 摄影集筛选功能
function initPhotoFilters() {
    const photoFilterButtons = document.querySelectorAll('.photo-filter-btn');
    const photoItems = document.querySelectorAll('.photo-item');
    
    photoFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            photoFilterButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前按钮添加active类
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            photoItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// 项目详情模态框
const modal = document.getElementById('project-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalBody = document.getElementById('modal-body');
const viewProjectBtns = document.querySelectorAll('.view-project');

// 项目数据
const projects = {
    1: {
        title: '基于Unity3D的机械臂虚拟交互平台系统',
        image: './pictures/机械臂.jpg',
        description: '使用Unity3D进行仿真，实现机械臂的虚拟操作',
        details: '本项目旨在开发一个基于Unity3D的机械臂虚拟交互平台，允许用户通过虚拟环境进行机械臂的操作和编程。该平台集成了物理引擎，实现了真实的机械臂运动模拟，并提供了用户友好的界面，方便用户进行交互和控制。',
        technologies: ['Unity3D', 'C#', 'SolidWorks', '3DMAX'],
        link: '#'
    }
};

viewProjectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project');
        const project = projects[projectId];
        
        modalBody.innerHTML = `
            <h2>${project.title}</h2>
            <div style="display: flex; gap: 2rem; margin: 2rem 0;">
                <div style="flex: 1;">
                    <img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 10px;">
                </div>
                <div style="flex: 1;">
                    <h3>项目概述</h3>
                    <p>${project.description}</p>
                    <h3>项目详情</h3>
                    <p>${project.details}</p>
                    <h3>技术栈</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0;">
                        ${project.technologies.map(tech => `<span style="background: rgba(0, 168, 255, 0.2); padding: 0.3rem 0.8rem; border-radius: 20px; border: 1px solid rgba(0, 168, 255, 0.5);">${tech}</span>`).join('')}
                    </div>
                    <a href="${project.link}" class="btn" style="margin-top: 1rem;">访问项目</a>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    });
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// 技能水平指示器
function initSkillLevels() {
    const skillProgresses = document.querySelectorAll('.skill-progress');
    
    skillProgresses.forEach(progress => {
        const level = progress.getAttribute('data-level');
        progress.style.width = `${level}%`;
    });
}

// 主题切换功能
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    
    if (document.body.classList.contains('light-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});

// 添加浅色主题样式
const style = document.createElement('style');
style.textContent = `
    body.light-theme {
        --primary-color: #f0f0f0;
        --secondary-color: #ffffff;
        --text-color: #333333;
        --white: #333333;
        background-color: var(--primary-color);
        color: var(--text-color);
    }
    
    body.light-theme .skill-card,
    body.light-theme .portfolio-item,
    body.light-theme .blog-item,
    body.light-theme .photo-item {
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    body.light-theme header {
        background-color: rgba(240, 240, 240, 0.9);
    }
    
    body.light-theme .nav-links a {
        color: var(--text-color);
    }
    
    body.light-theme .form-group input,
    body.light-theme .form-group textarea {
        background: rgba(255, 255, 255, 0.8);
        color: var(--text-color);
    }
    
    body.light-theme footer {
        background-color: rgba(240, 240, 240, 0.9);
        color: var(--text-color);
    }
`;
document.head.appendChild(style);

// 全局点击效果 - 修复定位问题
document.addEventListener('click', function(e) {
    // 获取点击位置相对于文档的坐标
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const x = e.clientX + scrollX;
    const y = e.clientY + scrollY;
    
    createClickParticles(x, y);
    createRippleEffect(x, y);
    createClickText(x, y);
});

// 创建点击粒子效果
function createClickParticles(x, y) {
    const colors = ['#00a8ff', '#a855f7', '#00f3ff', '#ff6b6b', '#4ecdc4'];
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('click-particle');
        
        // 随机颜色
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        
        // 随机位置偏移
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        // 设置位置 - 使用文档坐标
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        document.body.appendChild(particle);
        
        // 动画结束后移除元素
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// 创建涟漪效果
function createRippleEffect(x, y) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    
    // 设置位置和大小 - 使用文档坐标
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    
    document.body.appendChild(ripple);
    
    // 动画结束后移除元素
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 创建点击文字效果
function createClickText(x, y) {
    const texts = ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法治', '爱国', '敬业', '诚信', '友善'];
    const text = texts[Math.floor(Math.random() * texts.length)];
    
    const textElement = document.createElement('div');
    textElement.classList.add('click-text');
    textElement.textContent = text;
    
    // 设置位置 - 使用文档坐标
    textElement.style.left = `${x}px`;
    textElement.style.top = `${y}px`;
    
    document.body.appendChild(textElement);
    
    // 动画结束后移除元素
    setTimeout(() => {
        textElement.remove();
    }, 1500);
}

// 滚动进度条
window.addEventListener('scroll', function() {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    scrollProgress.style.width = `${progress}%`;
    
    // 显示/隐藏回到顶部按钮
    const backToTop = document.getElementById('back-to-top');
    if (scrollTop > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// 回到顶部功能
document.getElementById('back-to-top').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});