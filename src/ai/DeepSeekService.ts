// DeepSeek AI服务
export class DeepSeekService {
    private apiKey: string;
    private baseUrl: string = 'https://api.deepseek.com/v1';
    private cache: Map<string, { response: string; timestamp: number }> = new Map();
    private cacheDuration: number = 24 * 60 * 60 * 1000; // 24小时缓存
    
    constructor(apiKey: string) {
        this.apiKey = apiKey;
        console.log('🤖 DeepSeek AI服务初始化完成');
    }
    
    /**
     * 调用DeepSeek API
     */
    async callAPI(prompt: string, systemPrompt?: string): Promise<string> {
        // 检查缓存
        const cacheKey = this.generateCacheKey(prompt, systemPrompt);
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            console.log('📦 使用缓存响应');
            return cached.response;
        }
        
        try {
            console.log('🤖 调用DeepSeek API...');
            
            const messages = [];
            
            if (systemPrompt) {
                messages.push({
                    role: 'system',
                    content: systemPrompt
                });
            }
            
            messages.push({
                role: 'user',
                content: prompt
            });
            
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7,
                    stream: false
                })
            });
            
            if (!response.ok) {
                throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            const result = data.choices[0]?.message?.content || '没有收到响应';
            
            // 缓存结果
            this.cache.set(cacheKey, {
                response: result,
                timestamp: Date.now()
            });
            
            console.log('✅ DeepSeek API调用成功');
            return result;
            
        } catch (error) {
            console.error('❌ DeepSeek API调用失败:', error);
            
            // 返回备用响应
            return this.getFallbackResponse(prompt);
        }
    }
    
    /**
     * 生成嫌疑人对话
     */
    async generateSuspectResponse(
        suspectName: string,
        suspectPersonality: string,
        isGuilty: boolean,
        playerQuestion: string,
        caseContext?: string
    ): Promise<string> {
        const systemPrompt = `你是一个侦探游戏中的嫌疑人。请以嫌疑人的身份回答玩家的问题，保持角色一致性。`;
        
        const prompt = `
        嫌疑人信息：
        - 姓名：${suspectName}
        - 性格：${suspectPersonality}
        - 是否凶手：${isGuilty ? '是' : '不是'}
        ${caseContext ? `- 案件背景：${caseContext}` : ''}
        
        玩家提问："${playerQuestion}"
        
        请以${suspectName}的身份回答，要符合${suspectPersonality}的性格特点。
        ${isGuilty ? '如果你是凶手，可以适当撒谎或隐瞒信息。' : '如果你不是凶手，尽量配合调查但可能记不清细节。'}
        
        回答要求：
        1. 简短，不超过2句话
        2. 保持角色性格
        3. 不要直接承认或否认罪行
        4. 使用自然的口语
        
        回答：
        `;
        
        return await this.callAPI(prompt, systemPrompt);
    }
    
    /**
     * 生成案件描述
     */
    async generateCaseDescription(
        caseType: string,
        location: string,
        victim?: string,
        stolenItem?: string
    ): Promise<string> {
        const prompt = `
        生成一个侦探案件的描述：
        
        案件类型：${caseType}
        发生地点：${location}
        ${victim ? `受害者：${victim}` : ''}
        ${stolenItem ? `失窃物品：${stolenItem}` : ''}
        
        请生成一个简洁的案件描述（2-3句话），包含：
        1. 案件基本情况
        2. 现场环境描述
        3. 需要调查的疑点
        
        描述：
        `;
        
        return await this.callAPI(prompt);
    }
    
    /**
     * 生成嫌疑人信息
     */
    async generateSuspectInfo(
        count: number = 3,
        caseContext: string
    ): Promise<Array<{
        name: string;
        role: string;
        personality: string;
        alibi: string;
        description: string;
    }>> {
        const prompt = `
        为一个侦探案件生成${count}个嫌疑人信息：
        
        案件背景：${caseContext}
        
        请为每个嫌疑人提供：
        1. 姓名（中文名）
        2. 角色（如：店员、清洁工、顾客等）
        3. 性格特点（如：紧张、冷静、傲慢、友善等）
        4. 不在场证明（简短描述）
        5. 人物描述（1句话描述外貌或特征）
        
        请以JSON数组格式返回，例如：
        [
          {
            "name": "张三",
            "role": "店员",
            "personality": "紧张",
            "alibi": "声称案发时在仓库整理货物",
            "description": "戴着眼镜的年轻男子"
          }
        ]
        
        嫌疑人信息：
        `;
        
        const response = await this.callAPI(prompt);
        
        try {
            // 尝试解析JSON
            const startIndex = response.indexOf('[');
            const endIndex = response.lastIndexOf(']') + 1;
            
            if (startIndex !== -1 && endIndex > startIndex) {
                const jsonStr = response.substring(startIndex, endIndex);
                return JSON.parse(jsonStr);
            }
        } catch (error) {
            console.error('解析嫌疑人信息失败:', error);
        }
        
        // 如果解析失败，返回默认嫌疑人
        return this.getDefaultSuspects(count);
    }
    
    /**
     * 生成案件线索
     */
    async generateCaseClues(
        caseContext: string,
        suspects: Array<{ name: string; role: string }>,
        culpritIndex: number
    ): Promise<Array<{
        id: string;
        type: string;
        location: string;
        description: string;
        relatedTo: string[];
    }>> {
        const culprit = suspects[culpritIndex];
        const prompt = `
        为一个侦探案件生成线索：
        
        案件背景：${caseContext}
        嫌疑人：${suspects.map(s => `${s.name}（${s.role}）`).join('、')}
        真凶：${culprit.name}（${culprit.role}）
        
        请生成5-8个线索，包括：
        1. 指向真凶的关键证据
        2. 误导性的红鲱鱼线索
        3. 环境线索
        4. 证人证言
        
        每个线索包含：
        - 类型（如：指纹、监控、证言、物品等）
        - 发现地点
        - 描述
        - 关联的嫌疑人（数组）
        
        请以JSON数组格式返回。
        
        线索列表：
        `;
        
        const response = await this.callAPI(prompt);
        
        try {
            const startIndex = response.indexOf('[');
            const endIndex = response.lastIndexOf(']') + 1;
            
            if (startIndex !== -1 && endIndex > startIndex) {
                const jsonStr = response.substring(startIndex, endIndex);
                const clues = JSON.parse(jsonStr);
                
                // 为线索添加ID
                return clues.map((clue: any, index: number) => ({
                    id: `clue_${index + 1}`,
                    ...clue
                }));
            }
        } catch (error) {
            console.error('解析线索信息失败:', error);
        }
        
        // 如果解析失败，返回默认线索
        return this.getDefaultClues(suspects, culpritIndex);
    }
    
    /**
     * 生成AI助手提示
     */
    async generateAssistantHint(
        caseProgress: number,
        collectedClues: number,
        totalClues: number,
        playerStuck: boolean = false
    ): Promise<string> {
        const prompt = `
        你是侦探助手"华生2.0"，正在协助玩家破案。
        
        玩家进度：${caseProgress}%
        已收集线索：${collectedClues}/${totalClues}
        ${playerStuck ? '玩家似乎卡住了，需要提示。' : '玩家正在正常调查。'}
        
        请给玩家一个有用的提示（不要直接说出凶手）：
        1. 如果玩家刚开始，提示调查方向
        2. 如果玩家收集了部分线索，提示分析线索的方法
        3. 如果玩家卡住了，提示可能遗漏的地方
        4. 保持助手语气，友好但专业
        
        提示（简短，1-2句话）：
        `;
        
        return await this.callAPI(prompt);
    }
    
    /**
     * 生成推理分析
     */
    async generateAnalysis(
        clues: Array<{ description: string; relatedTo: string[] }>,
        playerTheory: string
    ): Promise<string> {
        const prompt = `
        分析侦探案件线索：
        
        已收集线索：
        ${clues.map(clue => `• ${clue.description}（关联：${clue.relatedTo.join('、')}）`).join('\n')}
        
        玩家推理："${playerTheory}"
        
        请分析：
        1. 线索之间的关联性
        2. 玩家的推理是否合理
        3. 还需要哪些证据支持
        4. 可能的矛盾点
        
        分析（简洁专业）：
        `;
        
        return await this.callAPI(prompt);
    }
    
    /**
     * 清理缓存
     */
    clearCache(): void {
        this.cache.clear();
        console.log('🗑️ AI缓存已清理');
    }
    
    /**
     * 获取缓存统计
     */
    getCacheStats(): { size: number; hits: number } {
        return {
            size: this.cache.size,
            hits: 0 // 这里可以添加命中统计
        };
    }
    
    // 私有方法
    private generateCacheKey(prompt: string, systemPrompt?: string): string {
        return `${systemPrompt || ''}|${prompt}`.replace(/\s+/g, ' ').trim();
    }
    
    private getFallbackResponse(prompt: string): string {
        // 简单的备用响应生成
        if (prompt.includes('嫌疑人') || prompt.includes('回答')) {
            const responses = [
                "我不太清楚你在说什么。",
                "案发时我在做自己的事情。",
                "我需要律师。",
                "我只是个普通人。",
                "你找错人了。"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        if (prompt.includes('案件') || prompt.includes('描述')) {
            return "发生了一起神秘案件，需要你调查现场收集线索。";
        }
        
        if (prompt.includes('提示') || prompt.includes('帮助')) {
            return "建议仔细检查现场，不要遗漏任何细节。";
        }
        
        return "系统暂时无法响应，请稍后再试。";
    }
    
    private getDefaultSuspects(count: number): Array<any> {
        const names = ['张三', '李四', '王五', '赵六', '钱七'];
        const roles = ['店员', '清洁工', '顾客', '经理', '保安'];
        const personalities = ['紧张', '冷静', '傲慢', '友善', '可疑'];
        
        return Array.from({ length: Math.min(count, 5) }, (_, i) => ({
            name: names[i],
            role: roles[i],
            personality: personalities[i],
            alibi: `声称案发时在${['仓库', '办公室', '家里', '餐厅', '停车场'][i]}`,
            description: ['戴眼镜', '穿西装', '有纹身', '留胡子', '戴帽子'][i]
        }));
    }
    
    private getDefaultClues(suspects: Array<any>, culpritIndex: number): Array<any> {
        const culprit = suspects[culpritIndex];
        
        return [
            {
                id: 'clue_1',
                type: '指纹',
                location: '柜台',
                description: `在柜台上发现一组指纹`,
                relatedTo: [culprit.name, suspects[(culpritIndex + 1) % suspects.length].name]
            },
            {
                id: 'clue_2',
                type: '监控',
                location: '门口',
                description: '监控显示有人形迹可疑',
                relatedTo: suspects.map(s => s.name)
            },
            {
                id: 'clue_3',
                type: '物品',
                location: '现场',
                description: '发现一件遗留的物品',
                relatedTo: [culprit.name]
            },
            {
                id: 'clue_4',
                type: '证言',
                location: '询问',
                description: '有人提供了重要信息',
                relatedTo: suspects.map(s => s.name)
            },
            {
                id: 'clue_5',
                type: '文件',
                location: '办公室',
                description: '找到相关文件记录',
                relatedTo: [culprit.name, suspects[(culpritIndex + 2) % suspects.length].name]
            }
        ];
    }
}

// 单例实例
let deepSeekInstance: DeepSeekService | null = null;

export function getDeepSeekService(apiKey?: string): DeepSeekService {
    if (!deepSeekInstance) {
        if (!apiKey) {
            throw new Error('需要提供DeepSeek API Key');
        }
        deepSeekInstance = new DeepSeekService(apiKey);
    }
    return deepSeekInstance;
}