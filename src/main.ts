import { Game } from './game/Game';

// 游戏主入口
window.addEventListener('DOMContentLoaded', () => {
    console.log('🕵️‍♂️ AI像素侦探社启动...');
    
    // 显示加载状态
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        loadingEl.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">正在连接AI侦探网络...</div>
            <div class="loading-subtext">初始化DeepSeek AI系统</div>
        `;
    }
    
    // 创建游戏实例
    const game = new Game();
    
    // 全局导出，方便调试和控制
    (window as any).gameInstance = game;
    
    console.log('✅ 游戏初始化完成！');
    
    // 3秒后隐藏加载界面
    setTimeout(() => {
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
        
        // 显示欢迎消息
        showWelcomeMessage();
        
        // 开始第一个案件（如果有存档）
        game.checkSavedGame();
    }, 3000);
});

function showWelcomeMessage(): void {
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(10, 10, 26, 0.95);
        color: #4affaa;
        padding: 30px;
        border-radius: 15px;
        border: 3px solid #4a4aff;
        z-index: 1000;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 0 30px rgba(74, 74, 255, 0.5);
        animation: fadeIn 0.5s ease;
    `;
    
    welcomeMsg.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #4affaa; font-size: 1.5rem;">🕵️‍♂️ 欢迎来到AI像素侦探社！</h3>
        <p style="margin: 0 0 10px 0; color: #a0a0ff; line-height: 1.5;">
            你是侦探社的新人，将接手各种神秘案件。<br>
            每个案件都由AI生成，每次体验都不同！
        </p>
        <div style="margin: 20px 0; padding: 15px; background: rgba(74, 74, 255, 0.1); border-radius: 8px;">
            <p style="margin: 0 0 10px 0; color: #ffaa00; font-size: 0.9rem;">🎮 操作指南：</p>
            <p style="margin: 0; color: #8888cc; font-size: 0.8rem; text-align: left;">
                • 点击场景调查收集证据<br>
                • 与嫌疑人对话获取信息<br>
                • 在侦探板上推理分析<br>
                • 找出真凶解决案件！
            </p>
        </div>
        <button onclick="this.parentElement.remove(); startNewCase();" style="
            background: linear-gradient(135deg, #4a4aff 0%, #4affaa 100%);
            color: #000;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 10px;
        ">开始第一个案件</button>
        <p style="margin: 15px 0 0 0; color: #6666aa; font-size: 0.8rem;">
            或点击下方"开始新案件"按钮
        </p>
    `;
    
    document.body.appendChild(welcomeMsg);
    
    // 添加CSS动画
    if (!document.getElementById('welcome-animation')) {
        const style = document.createElement('style');
        style.id = 'welcome-animation';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -60%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 10秒后自动移除欢迎消息
    setTimeout(() => {
        if (welcomeMsg.parentElement) {
            welcomeMsg.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => welcomeMsg.remove(), 500);
        }
    }, 10000);
}

// 全局类型声明
declare global {
    interface Window {
        gameInstance: any;
        startNewCase: () => void;
        saveGame: () => void;
        loadGame: () => void;
        toggleSound: () => void;
    }
}

// 导出全局函数
window.startNewCase = () => {
    if (window.gameInstance) {
        window.gameInstance.startNewCase();
    }
};

window.saveGame = () => {
    if (window.gameInstance) {
        window.gameInstance.saveGame();
    }
};

window.loadGame = () => {
    if (window.gameInstance) {
        window.gameInstance.loadGame();
    }
};

window.toggleSound = () => {
    if (window.gameInstance) {
        return window.gameInstance.toggleSound();
    }
    return false;
};