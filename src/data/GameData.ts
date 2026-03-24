// 游戏数据模型

export interface CaseData {
    id: string;
    title: string;
    description: string;
    scene: string;
    victim?: string;
    stolenItem?: string;
    time: string;
    difficulty: 'easy' | 'medium' | 'hard';
    
    suspects: SuspectData[];
    clues: ClueData[];
    culpritId: string; // 真凶的ID
    
    // 玩家进度
    collectedClues: string[]; // 已收集的线索ID
    questionedSuspects: string[]; // 已询问的嫌疑人ID
    playerTheory?: string;
    isSolved: boolean;
    solvedTime?: number;
    rating?: number; // 1-5星评价
    
    createdAt: number;
    updatedAt: number;
}

export interface SuspectData {
    id: string;
    name: string;
    role: string;
    personality: 'nervous' | 'calm' | 'arrogant' | 'helpful' | 'suspicious' | 'honest';
    description: string;
    alibi: string;
    isGuilty: boolean;
    
    // 对话相关
    dialogueHistory: DialogueEntry[];
    attitude: number; // -10到10，负数为敌对，正数为友好
    revealedClues: string[]; // 已向玩家透露的线索ID
    
    // 视觉
    spriteKey?: string;
    position?: { x: number; y: number };
}

export interface ClueData {
    id: string;
    type: 'fingerprint' | 'dna' | 'weapon' | 'document' | 'surveillance' | 'witness' | 'physical' | 'digital';
    location: string;
    description: string;
    detailedDescription: string;
    relatedSuspects: string[]; // 关联的嫌疑人ID
    
    // 游戏内表现
    isCollected: boolean;
    collectedTime?: number;
    position?: { x: number; y: number };
    spriteKey?: string;
}

export interface DialogueEntry {
    id: string;
    speaker: 'player' | 'suspect';
    content: string;
    timestamp: number;
    emotion?: string;
}

export interface PlayerData {
    id: string;
    name: string;
    level: number;
    experience: number;
    reputation: number; // 声望，影响嫌疑人态度
    
    // 统计
    casesSolved: number;
    casesFailed: number;
    totalPlayTime: number;
    averageRating: number;
    
    // 技能
    skills: {
        observation: number; // 观察力
        interrogation: number; // 审讯技巧
        analysis: number; // 分析能力
        intuition: number; // 直觉
    };
    
    // 库存
    inventory: {
        magnifyingGlass: boolean;
        fingerprintKit: boolean;
        camera: boolean;
        notebook: boolean;
    };
    
    createdAt: number;
    lastPlayed: number;
}

export interface GameState {
    player: PlayerData;
    currentCase?: CaseData;
    caseHistory: CaseData[];
    settings: GameSettings;
    
    // 系统状态
    isSoundEnabled: boolean;
    isMusicEnabled: boolean;
    lastSaveTime: number;
    version: string;
}

export interface GameSettings {
    language: 'zh' | 'en';
    textSpeed: 'slow' | 'normal' | 'fast';
    autoSave: boolean;
    autoSaveInterval: number; // 分钟
    showHints: boolean;
    difficulty: 'easy' | 'normal' | 'hard';
}

// 案件模板
export const CASE_TEMPLATES = [
    {
        id: 'template_jewelry_theft',
        title: '珠宝店失窃案',
        scene: 'jewelry_shop',
        victim: '珠宝店老板',
        stolenItem: '钻石项链',
        time: '昨晚10点',
        difficulty: 'easy' as const,
        description: '一家高档珠宝店发生失窃，价值连城的钻石项链不翼而飞。'
    },
    {
        id: 'template_mansion_murder',
        title: '别墅谋杀案',
        scene: 'mansion',
        victim: '富商',
        stolenItem: undefined,
        time: '午夜',
        difficulty: 'medium' as const,
        description: '一位富商在自家别墅中被发现身亡，现场没有强行闯入的痕迹。'
    },
    {
        id: 'template_museum_heist',
        title: '博物馆盗窃案',
        scene: 'museum',
        victim: '博物馆馆长',
        stolenItem: '古代文物',
        time: '闭馆后',
        difficulty: 'hard' as const,
        description: '博物馆的一件珍贵文物在闭馆后神秘消失，安保系统似乎被绕过。'
    },
    {
        id: 'template_corporate_espionage',
        title: '商业间谍案',
        scene: 'office',
        victim: '公司CEO',
        stolenItem: '商业机密文件',
        time: '工作日',
        difficulty: 'medium' as const,
        description: '一家科技公司的机密文件被盗，怀疑是内部人员所为。'
    },
    {
        id: 'template_hotel_mystery',
        title: '酒店谜案',
        scene: 'hotel',
        victim: '酒店客人',
        stolenItem: '贵重物品',
        time: '深夜',
        difficulty: 'easy' as const,
        description: '酒店客人的贵重物品在房间内失踪，房门锁完好无损。'
    }
];

// 嫌疑人性格类型
export const PERSONALITY_TYPES = [
    { id: 'nervous', name: '紧张', description: '容易紧张，说话结巴' },
    { id: 'calm', name: '冷静', description: '沉着冷静，思路清晰' },
    { id: 'arrogant', name: '傲慢', description: '态度傲慢，不配合调查' },
    { id: 'helpful', name: '友善', description: '乐于助人，积极配合' },
    { id: 'suspicious', name: '可疑', description: '行为可疑，言辞闪烁' },
    { id: 'honest', name: '诚实', description: '坦诚直率，实话实说' }
];

// 线索类型
export const CLUE_TYPES = [
    { id: 'fingerprint', name: '指纹', icon: '🔍', description: '现场留下的指纹痕迹' },
    { id: 'dna', name: 'DNA', icon: '🧬', description: '生物样本证据' },
    { id: 'weapon', name: '凶器', icon: '🗡️', description: '可能的作案工具' },
    { id: 'document', name: '文件', icon: '📄', description: '相关文件记录' },
    { id: 'surveillance', name: '监控', icon: '📹', description: '监控录像证据' },
    { id: 'witness', name: '证言', icon: '🗣️', description: '目击者证词' },
    { id: 'physical', name: '物证', icon: '🔎', description: '物理证据' },
    { id: 'digital', name: '数字', icon: '💻', description: '数字证据' }
];

// 场景配置
export const SCENE_CONFIGS = {
    jewelry_shop: {
        name: '珠宝店',
        width: 800,
        height: 600,
        background: '#1a1a2e',
        interactiveAreas: [
            { id: 'counter', x: 400, y: 300, width: 200, height: 100, label: '柜台' },
            { id: 'safe', x: 600, y: 200, width: 100, height: 150, label: '保险柜' },
            { id: 'window', x: 200, y: 400, width: 150, height: 80, label: '橱窗' },
            { id: 'office', x: 100, y: 100, width: 120, height: 120, label: '办公室' }
        ]
    },
    mansion: {
        name: '别墅',
        width: 800,
        height: 600,
        background: '#2a1a2e',
        interactiveAreas: [
            { id: 'living_room', x: 400, y: 300, width: 300, height: 200, label: '客厅' },
            { id: 'study', x: 150, y: 150, width: 180, height: 180, label: '书房' },
            { id: 'bedroom', x: 600, y: 150, width: 150, height: 200, label: '卧室' },
            { id: 'garden', x: 200, y: 450, width: 400, height: 100, label: '花园' }
        ]
    },
    museum: {
        name: '博物馆',
        width: 800,
        height: 600,
        background: '#1a2a2e',
        interactiveAreas: [
            { id: 'exhibit_hall', x: 400, y: 300, width: 400, height: 250, label: '展厅' },
            { id: 'security_room', x: 100, y: 100, width: 150, height: 120, label: '监控室' },
            { id: 'storage', x: 650, y: 100, width: 120, height: 150, label: '储藏室' },
            { id: 'entrance', x: 400, y: 500, width: 200, height: 80, label: '入口' }
        ]
    }
};

// 工具函数
export class GameDataHelper {
    static generateCaseId(): string {
        return `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    static generateSuspectId(): string {
        return `suspect_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    static generateClueId(): string {
        return `clue_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    static getRandomTemplate() {
        const template = CASE_TEMPLATES[Math.floor(Math.random() * CASE_TEMPLATES.length)];
        return { ...template };
    }
    
    static getRandomPersonality() {
        const personality = PERSONALITY_TYPES[Math.floor(Math.random() * PERSONALITY_TYPES.length)];
        return personality.id;
    }
    
    static calculateCaseProgress(caseData: CaseData): number {
        const totalClues = caseData.clues.length;
        const collectedClues = caseData.collectedClues.length;
        const questionedSuspects = caseData.questionedSuspects.length;
        const totalSuspects = caseData.suspects.length;
        
        const clueProgress = (collectedClues / totalClues) * 50;
        const suspectProgress = (questionedSuspects / totalSuspects) * 30;
        const theoryProgress = caseData.playerTheory ? 20 : 0;
        
        return Math.min(100, clueProgress + suspectProgress + theoryProgress);
    }
    
    static calculateRating(caseData: CaseData, solveTime: number): number {
        let rating = 5;
        
        // 时间惩罚
        const timePenalty = Math.min(4, Math.floor(solveTime / 300000)); // 每5分钟扣0.5星
        rating -= timePenalty * 0.5;
        
        // 线索收集奖励
        const clueBonus = caseData.collectedClues.length / caseData.clues.length;
        rating += clueBonus;
        
        // 询问效率奖励
        const efficientQuestioning = caseData.questionedSuspects.length <= caseData.suspects.length * 0.7;
        if (efficientQuestioning) rating += 0.5;
        
        // 确保在1-5星之间
        return Math.max(1, Math.min(5, Math.round(rating * 2) / 2));
    }
    
    static createNewPlayer(): PlayerData {
        return {
            id: `player_${Date.now()}`,
            name: '新手侦探',
            level: 1,
            experience: 0,
            reputation: 0,
            casesSolved: 0,
            casesFailed: 0,
            totalPlayTime: 0,
            averageRating: 0,
            skills: {
                observation: 1,
                interrogation: 1,
                analysis: 1,
                intuition: 1
            },
            inventory: {
                magnifyingGlass: true,
                fingerprintKit: false,
                camera: false,
                notebook: true
            },
            createdAt: Date.now(),
            lastPlayed: Date.now()
        };
    }
    
    static createDefaultSettings(): GameSettings {
        return {
            language: 'zh',
            textSpeed: 'normal',
            autoSave: true,
            autoSaveInterval: 5,
            showHints: true,
            difficulty: 'normal'
        };
    }
}