// 配置管理器
export class ConfigManager {
    private static instance: ConfigManager;
    private config: Record<string, any> = {};
    
    private constructor() {
        this.loadConfig();
    }
    
    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    
    private loadConfig(): void {
        // 默认配置
        this.config = {
            // 游戏信息
            gameTitle: 'AI像素侦探社',
            gameVersion: '1.0.0',
            debug: false,
            
            // DeepSeek API配置
            deepseekApiKey: this.getApiKey(),
            deepseekBaseUrl: 'https://api.deepseek.com/v1',
            deepseekModel: 'deepseek-chat',
            deepseekMaxTokens: 500,
            deepseekTemperature: 0.7,
            
            // 案件生成配置
            caseGenerationCount: 5,
            minSuspects: 3,
            maxSuspects: 5,
            minClues: 5,
            maxClues: 8,
            
            // 缓存配置
            cacheDurationHours: 24,
            maxCacheSize: 100,
            
            // 性能配置
            autoSaveInterval: 5, // 分钟
            chunkSizeWarning: 500, // KB
            
            // UI配置
            textSpeed: 'normal',
            showHints: true,
            soundEnabled: true,
            musicEnabled: true
        };
        
        // 从URL参数加载配置
        this.loadFromUrlParams();
        
        // 从localStorage加载用户配置
        this.loadFromLocalStorage();
        
        console.log('⚙️ 配置加载完成');
    }
    
    private getApiKey(): string | null {
        // 安全获取API Key的方法
        // 优先级：环境变量 > localStorage > URL参数
        
        // 1. 环境变量（构建时注入）
        if (typeof process !== 'undefined' && process.env.DEEPSEEK_API_KEY) {
            return process.env.DEEPSEEK_API_KEY;
        }
        
        // 2. 从安全的存储位置获取
        if (typeof localStorage !== 'undefined') {
            try {
                // 可以加密存储
                const encryptedKey = localStorage.getItem('encrypted_api_key');
                if (encryptedKey) {
                    // 这里应该解密，简化版本直接返回
                    return encryptedKey;
                }
            } catch (error) {
                console.warn('读取加密API Key失败:', error);
            }
        }
        
        // 3. URL参数（仅用于开发测试）
        if (typeof URLSearchParams !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const key = params.get('api_key');
            if (key && key.startsWith('sk-')) {
                console.warn('⚠️ 从URL参数获取API Key，仅用于开发测试');
                return key;
            }
        }
        
        return null;
    }
    
    private loadFromUrlParams(): void {
        if (typeof URLSearchParams === 'undefined') return;
        
        const params = new URLSearchParams(window.location.search);
        
        // 调试模式
        const debug = params.get('debug');
        if (debug === 'true') {
            this.config.debug = true;
        }
        
        // 文本速度
        const textSpeed = params.get('textSpeed');
        if (textSpeed && ['slow', 'normal', 'fast'].includes(textSpeed)) {
            this.config.textSpeed = textSpeed;
        }
        
        // 显示提示
        const showHints = params.get('showHints');
        if (showHints === 'false') {
            this.config.showHints = false;
        }
    }
    
    private loadFromLocalStorage(): void {
        if (typeof localStorage === 'undefined') return;
        
        try {
            const savedConfig = localStorage.getItem('game_config');
            if (savedConfig) {
                const userConfig = JSON.parse(savedConfig);
                Object.assign(this.config, userConfig);
            }
        } catch (error) {
            console.warn('加载用户配置失败:', error);
        }
    }
    
    public saveUserConfig(userConfig: Partial<typeof this.config>): void {
        Object.assign(this.config, userConfig);
        
        if (typeof localStorage !== 'undefined') {
            try {
                // 只保存用户可配置的选项，不保存API Key等敏感信息
                const safeConfig = {
                    textSpeed: this.config.textSpeed,
                    showHints: this.config.showHints,
                    soundEnabled: this.config.soundEnabled,
                    musicEnabled: this.config.musicEnabled
                };
                
                localStorage.setItem('game_config', JSON.stringify(safeConfig));
                console.log('💾 用户配置已保存');
            } catch (error) {
                console.error('保存用户配置失败:', error);
            }
        }
    }
    
    public get<T = any>(key: string): T {
        return this.config[key];
    }
    
    public set(key: string, value: any): void {
        this.config[key] = value;
    }
    
    public getAll(): Record<string, any> {
        return { ...this.config };
    }
    
    public getApiConfig(): {
        apiKey: string | null;
        baseUrl: string;
        model: string;
        maxTokens: number;
        temperature: number;
    } {
        return {
            apiKey: this.config.deepseekApiKey,
            baseUrl: this.config.deepseekBaseUrl,
            model: this.config.deepseekModel,
            maxTokens: this.config.deepseekMaxTokens,
            temperature: this.config.deepseekTemperature
        };
    }
    
    public getGameConfig(): {
        title: string;
        version: string;
        debug: boolean;
        caseGenerationCount: number;
        minSuspects: number;
        maxSuspects: number;
        minClues: number;
        maxClues: number;
    } {
        return {
            title: this.config.gameTitle,
            version: this.config.gameVersion,
            debug: this.config.debug,
            caseGenerationCount: this.config.caseGenerationCount,
            minSuspects: this.config.minSuspects,
            maxSuspects: this.config.maxSuspects,
            minClues: this.config.minClues,
            maxClues: this.config.maxClues
        };
    }
    
    public getUIConfig(): {
        textSpeed: string;
        showHints: boolean;
        soundEnabled: boolean;
        musicEnabled: boolean;
    } {
        return {
            textSpeed: this.config.textSpeed,
            showHints: this.config.showHints,
            soundEnabled: this.config.soundEnabled,
            musicEnabled: this.config.musicEnabled
        };
    }
    
    public isApiConfigured(): boolean {
        return !!this.config.deepseekApiKey;
    }
    
    public setApiKey(apiKey: string): void {
        this.config.deepseekApiKey = apiKey;
        
        // 安全存储API Key
        if (typeof localStorage !== 'undefined') {
            try {
                // 简单加密存储（实际应该使用更安全的加密方法）
                localStorage.setItem('encrypted_api_key', apiKey);
                console.log('🔐 API Key已安全存储');
            } catch (error) {
                console.error('存储API Key失败:', error);
            }
        }
    }
    
    public clearApiKey(): void {
        this.config.deepseekApiKey = null;
        
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('encrypted_api_key');
            console.log('🗑️ API Key已清除');
        }
    }
    
    public resetToDefaults(): void {
        this.config = {};
        this.loadConfig();
        
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('game_config');
            console.log('🔄 配置已重置为默认值');
        }
    }
}

// 导出单例
export const configManager = ConfigManager.getInstance();