// ============================================
// 游戏数据：试用期六个月
// ============================================

const GAME_DATA = {
  // 角色定义
  characters: {
    pm: {
      id: 'pm',
      name: '产品经理',
      emoji: '🦄',
      color: '#00d4ff',
      speed: 1.0,
      maxHealth: 6,
      description: '连接用户与技术的桥梁，用数据驱动产品进化',
      unlockCondition: null // 默认可选
    },
    algorithm: {
      id: 'algorithm',
      name: '大模型算法',
      emoji: '🧠',
      color: '#bf5af2',
      speed: 0.9,
      maxHealth: 6,
      description: '驯服AI巨兽的驯兽师，在数据与算力间寻找最优解',
      unlockCondition: null
    },
    backend: {
      id: 'backend',
      name: '后端工程师',
      emoji: '⚙️',
      color: '#30d158',
      speed: 1.1,
      maxHealth: 6,
      description: '系统架构的守护者，用代码构建数字世界的基石',
      unlockCondition: null
    },
    boss: {
      id: 'boss',
      name: '老板',
      emoji: '👔',
      color: '#ffd60a',
      speed: 0.8,
      maxHealth: 6,
      description: '掌舵者，在商业迷雾中寻找方向，带领团队穿越风暴',
      unlockCondition: 'score' // 需要当前关卡达到一定积分
    }
  },

  // 关卡定义
  levels: {
    1: {
      id: 1,
      name: '入职一个月',
      subtitle: '新手上路',
      description: '一切都是新的，熟悉环境、建立认知',
      speed: 3.8,
      spawnInterval: 250,
      passScore: 80,
      scoreToUnlockNext: 80,
      scoreToUnlockBoss: 100,
      bgColor: '#0a0a1a',
      accentColor: '#1a3a5c'
    },
    2: {
      id: 2,
      name: '入职三个月',
      subtitle: '独当一面',
      description: '开始承担核心工作，挑战与成长并行',
      speed: 4.8,
      spawnInterval: 125,
      passScore: 90,
      scoreToUnlockNext: 90,
      scoreToUnlockBoss: 110,
      bgColor: '#0f0a1a',
      accentColor: '#3a1a5c'
    },
    3: {
      id: 3,
      name: '入职六个月',
      subtitle: '转正之战',
      description: '证明自己的最终考验，一切都将加速',
      speed: 5.8,
      spawnInterval: 100,
      passScore: 100,
      scoreToUnlockNext: null,
      scoreToUnlockBoss: 120,
      bgColor: '#1a0a0a',
      accentColor: '#5c1a1a'
    }
  },

  // 游戏时间上限（秒）
  maxGameTime: 120,

  // ============================================
  // 障碍物与收集物清单
  // ============================================
  items: {
    // ==========================================
    // 产品经理
    // ==========================================
    pm: {
      1: {
        obstacles: [
          { id: 'pm_1_o1', name: '需求理解偏差', emoji: '❓', desc: '对业务不熟导致理解错误' },
          { id: 'pm_1_o2', name: '会议轰炸', emoji: '📅', desc: '一天排满无效会议' },
          { id: 'pm_1_o3', name: '跨部门沟通壁垒', emoji: '🧱', desc: '找不到对接人' },
          { id: 'pm_1_o4', name: '文档格式混乱', emoji: '📄', desc: '历史文档无人维护' },
          { id: 'pm_1_o5', name: '业务流程不熟', emoji: '🌀', desc: '不了解内部审批流程' },
          { id: 'pm_1_o6', name: '竞品信息缺失', emoji: '🔍', desc: '没有竞品数据积累' }
        ],
        collectibles: [
          { id: 'pm_1_c1', name: '用户调研报告', emoji: '📋', desc: '完成首次用户访谈' },
          { id: 'pm_1_c2', name: '导师指点', emoji: '🧑‍🏫', desc: '获得前辈经验传授' },
          { id: 'pm_1_c3', name: 'PRD评审通过', emoji: '✅', desc: '需求文档一次通过' },
          { id: 'pm_1_c4', name: '竞品分析完成', emoji: '🎯', desc: '输出有价值的竞品报告' },
          { id: 'pm_1_c5', name: '团队破冰成功', emoji: '🤝', desc: '融入团队获得认可' },
          { id: 'pm_1_c6', name: '首个功能上线', emoji: '🚀', desc: '负责的第一个功能发布' }
        ]
      },
      2: {
        obstacles: [
          { id: 'pm_2_o1', name: '需求频繁变更', emoji: '🔄', desc: '方向反复调整' },
          { id: 'pm_2_o2', name: '技术方案冲突', emoji: '⚡', desc: '产品想法技术实现不了' },
          { id: 'pm_2_o3', name: '排期延误', emoji: '⏰', desc: '依赖方延期交付' },
          { id: 'pm_2_o4', name: '用户投诉', emoji: '😡', desc: '功能上线后差评' },
          { id: 'pm_2_o5', name: '数据指标下降', emoji: '📉', desc: '核心数据不升反降' },
          { id: 'pm_2_o6', name: '资源被砍', emoji: '✂️', desc: '人力/预算缩减' }
        ],
        collectibles: [
          { id: 'pm_2_c1', name: '数据指标飙升', emoji: '📈', desc: '功能带来显著增长' },
          { id: 'pm_2_c2', name: '用户好评', emoji: '⭐', desc: '收到真实正面反馈' },
          { id: 'pm_2_c3', name: '成功迭代', emoji: '🔁', desc: '快速验证假设并优化' },
          { id: 'pm_2_c4', name: 'OKR达成', emoji: '🏆', desc: '季度目标完成' },
          { id: 'pm_2_c5', name: '晋升提名', emoji: '📜', desc: '获得主管推荐' },
          { id: 'pm_2_c6', name: '方案获最佳实践', emoji: '💡', desc: '产品方案被内部推广' }
        ]
      },
      3: {
        obstacles: [
          { id: 'pm_3_o1', name: '产品方向争议', emoji: '🔀', desc: '高层对方向意见不一' },
          { id: 'pm_3_o2', name: '竞品反超', emoji: '🏃', desc: '对手功能更快更好' },
          { id: 'pm_3_o3', name: '团队人员流失', emoji: '🚪', desc: '核心成员离职' },
          { id: 'pm_3_o4', name: '预算削减', emoji: '💸', desc: '公司缩减项目投入' },
          { id: 'pm_3_o5', name: '技术债拖累', emoji: '⛓️', desc: '历史问题限制新功能' },
          { id: 'pm_3_o6', name: '跨团队利益冲突', emoji: '⚔️', desc: '多团队抢资源' }
        ],
        collectibles: [
          { id: 'pm_3_c1', name: '大版本发布', emoji: '🎉', desc: '产品里程碑交付' },
          { id: 'pm_3_c2', name: '用户量破百万', emoji: '👥', desc: '关键增长指标达成' },
          { id: 'pm_3_c3', name: '行业认可', emoji: '🏅', desc: '获得外部媒体报道' },
          { id: 'pm_3_c4', name: '产品方法论沉淀', emoji: '📚', desc: '形成可复用的方法论' },
          { id: 'pm_3_c5', name: '带新人成长', emoji: '🌱', desc: '成为团队导师' },
          { id: 'pm_3_c6', name: '年度最佳产品', emoji: '👑', desc: '获得公司级表彰' }
        ]
      }
    },

    // ==========================================
    // 大模型算法
    // ==========================================
    algorithm: {
      1: {
        obstacles: [
          { id: 'al_1_o1', name: '环境配置地狱', emoji: '🔥', desc: 'CUDA/依赖版本冲突' },
          { id: 'al_1_o2', name: 'GPU资源排队', emoji: '🖥️', desc: '集群满载无卡可用' },
          { id: 'al_1_o3', name: '数据质量差', emoji: '🗑️', desc: '标注数据错误率高' },
          { id: 'al_1_o4', name: '论文读不懂', emoji: '📖', desc: '数学公式推导卡壳' },
          { id: 'al_1_o5', name: '训练任务崩溃', emoji: '💥', desc: 'OOM / NaN Loss' },
          { id: 'al_1_o6', name: '代码跑不通', emoji: '🐛', desc: '前人代码缺依赖' }
        ],
        collectibles: [
          { id: 'al_1_c1', name: '环境一次搭通', emoji: '🛠️', desc: '顺利配好训练环境' },
          { id: 'al_1_c2', name: '首个模型跑通', emoji: '🤖', desc: 'Baseline成功运行' },
          { id: 'al_1_c3', name: '论文复现成功', emoji: '📝', desc: '结果对齐原文指标' },
          { id: 'al_1_c4', name: '高质量数据集', emoji: '💎', desc: '获得清洗好的数据' },
          { id: 'al_1_c5', name: 'Code Review通过', emoji: '✅', desc: '代码规范获认可' },
          { id: 'al_1_c6', name: '基线模型建立', emoji: '📊', desc: '有了可对比的基准' }
        ]
      },
      2: {
        obstacles: [
          { id: 'al_2_o1', name: '模型幻觉', emoji: '👻', desc: '输出一本正经胡说八道' },
          { id: 'al_2_o2', name: '效果不达标', emoji: '📉', desc: '指标离目标差一截' },
          { id: 'al_2_o3', name: '训练成本爆炸', emoji: '💰', desc: '一次实验烧掉大量算力' },
          { id: 'al_2_o4', name: 'Prompt注入攻击', emoji: '🎭', desc: '安全红线被突破' },
          { id: 'al_2_o5', name: '标注团队罢工', emoji: '✋', desc: '数据标注进度停滞' },
          { id: 'al_2_o6', name: '评测指标打架', emoji: '⚖️', desc: 'A指标升B指标降' }
        ],
        collectibles: [
          { id: 'al_2_c1', name: '效果超预期', emoji: '🚀', desc: '模型表现超越目标' },
          { id: 'al_2_c2', name: '论文被接收', emoji: '🎓', desc: '顶会/顶刊中稿' },
          { id: 'al_2_c3', name: '推理速度翻倍', emoji: '⚡', desc: '优化后延迟大幅下降' },
          { id: 'al_2_c4', name: '算法突破', emoji: '💡', desc: '提出新方法有效提升' },
          { id: 'al_2_c5', name: '产品集成成功', emoji: '🔗', desc: '模型接入线上产品' },
          { id: 'al_2_c6', name: '技术分享好评', emoji: '👏', desc: '内部分享获得认可' }
        ]
      },
      3: {
        obstacles: [
          { id: 'al_3_o1', name: '开源模型碾压', emoji: '🌊', desc: '新开源模型效果更好' },
          { id: 'al_3_o2', name: '安全合规红线', emoji: '🚨', desc: '内容安全审查不通过' },
          { id: 'al_3_o3', name: '线上推理故障', emoji: '🔴', desc: '模型服务大面积异常' },
          { id: 'al_3_o4', name: '算力预算砍半', emoji: '✂️', desc: '公司缩减GPU投入' },
          { id: 'al_3_o5', name: '泛化能力不足', emoji: '📦', desc: '换个场景效果暴跌' },
          { id: 'al_3_o6', name: '团队方向分歧', emoji: '🔀', desc: '自研vs调用API争论' }
        ],
        collectibles: [
          { id: 'al_3_c1', name: '模型稳定运行', emoji: '🟢', desc: '线上零故障一个月' },
          { id: 'al_3_c2', name: 'SOTA突破', emoji: '🏆', desc: '核心指标刷榜第一' },
          { id: 'al_3_c3', name: '专利授权', emoji: '📜', desc: '技术方案获得专利' },
          { id: 'al_3_c4', name: '算力扩容批准', emoji: '🖥️', desc: '申请到更多GPU' },
          { id: 'al_3_c5', name: '评测体系建立', emoji: '📐', desc: '形成标准化评测流程' },
          { id: 'al_3_c6', name: '技术影响力', emoji: '🌟', desc: '被外部团队引用合作' }
        ]
      }
    },

    // ==========================================
    // 后端工程师
    // ==========================================
    backend: {
      1: {
        obstacles: [
          { id: 'be_1_o1', name: '代码规范不熟', emoji: '📏', desc: '提交被打回多次' },
          { id: 'be_1_o2', name: '线上环境复杂', emoji: '🌐', desc: '多套环境搞不清' },
          { id: 'be_1_o3', name: 'Git冲突', emoji: '⚔️', desc: '合并代码频繁冲突' },
          { id: 'be_1_o4', name: 'API文档缺失', emoji: '📄', desc: '接口无文档只能问人' },
          { id: 'be_1_o5', name: '依赖版本冲突', emoji: '🔗', desc: '包版本不兼容' },
          { id: 'be_1_o6', name: '新手任务超时', emoji: '⏰', desc: '预估不准延期交付' }
        ],
        collectibles: [
          { id: 'be_1_c1', name: '首个PR合并', emoji: '🔀', desc: '第一段代码进入主干' },
          { id: 'be_1_c2', name: 'Code Review通过', emoji: '✅', desc: '代码质量获认可' },
          { id: 'be_1_c3', name: '本地环境搭通', emoji: '🛠️', desc: '服务顺利跑起来' },
          { id: 'be_1_c4', name: '读懂代码架构', emoji: '🏗️', desc: '理清系统全貌' },
          { id: 'be_1_c5', name: '新手任务完成', emoji: '🎯', desc: '按时交付入职任务' },
          { id: 'be_1_c6', name: 'Mentor好评', emoji: '👍', desc: '导师认可学习能力' }
        ]
      },
      2: {
        obstacles: [
          { id: 'be_2_o1', name: '线上Bug紧急', emoji: '🚨', desc: '凌晨被叫起来修Bug' },
          { id: 'be_2_o2', name: '需求频繁插入', emoji: '📥', desc: '计划被打断' },
          { id: 'be_2_o3', name: '性能瓶颈', emoji: '🐌', desc: '接口响应超时' },
          { id: 'be_2_o4', name: '第三方服务宕机', emoji: '💀', desc: '依赖的外部服务挂了' },
          { id: 'be_2_o5', name: '技术债务', emoji: '⛓️', desc: '祖传代码不敢动' },
          { id: 'be_2_o6', name: '安全漏洞', emoji: '🕳️', desc: '接口被扫出漏洞' }
        ],
        collectibles: [
          { id: 'be_2_c1', name: '核心模块重构', emoji: '🔧', desc: '成功优化核心代码' },
          { id: 'be_2_c2', name: '性能优化50%', emoji: '⚡', desc: '响应速度大幅提升' },
          { id: 'be_2_c3', name: '测试覆盖率提升', emoji: '🧪', desc: '自动化测试更完善' },
          { id: 'be_2_c4', name: '技术方案采纳', emoji: '💡', desc: '架构提案被采用' },
          { id: 'be_2_c5', name: '独立负责模块', emoji: '🏠', desc: '成为模块Owner' },
          { id: 'be_2_c6', name: '老板表扬', emoji: '🌟', desc: '周报被特别提及' }
        ]
      },
      3: {
        obstacles: [
          { id: 'be_3_o1', name: '高并发崩溃', emoji: '🌊', desc: '流量暴增服务雪崩' },
          { id: 'be_3_o2', name: '数据迁移故障', emoji: '💾', desc: '迁移脚本出错丢数据' },
          { id: 'be_3_o3', name: '架构升级阵痛', emoji: '🏚️', desc: '新老架构并行出问题' },
          { id: 'be_3_o4', name: '安全审计不过', emoji: '🛡️', desc: '合规审查被打回' },
          { id: 'be_3_o5', name: '跨团队联调延期', emoji: '🔄', desc: '多方接口对不齐' },
          { id: 'be_3_o6', name: '核心人员离职交接', emoji: '📦', desc: '关键人走了没文档' }
        ],
        collectibles: [
          { id: 'be_3_c1', name: '架构升级完成', emoji: '🏛️', desc: '系统焕然一新' },
          { id: 'be_3_c2', name: '零故障月度', emoji: '🟢', desc: '线上稳定运行一个月' },
          { id: 'be_3_c3', name: '获得晋升', emoji: '📈', desc: '技术能力获认可' },
          { id: 'be_3_c4', name: '开源贡献被认可', emoji: '🌍', desc: '社区影响力提升' },
          { id: 'be_3_c5', name: '带领小组交付', emoji: '👥', desc: '从个人贡献者到Leader' },
          { id: 'be_3_c6', name: '年度技术突破奖', emoji: '🏆', desc: '获得公司级表彰' }
        ]
      }
    },

    // ==========================================
    // 老板
    // ==========================================
    boss: {
      1: {
        obstacles: [
          { id: 'bo_1_o1', name: '投资人质疑方向', emoji: '🤔', desc: '投资人对产品方向不认可' },
          { id: 'bo_1_o2', name: '招聘困难', emoji: '📢', desc: '核心岗位长期空缺' },
          { id: 'bo_1_o3', name: '团队磨合冲突', emoji: '💢', desc: '新团队产生摩擦' },
          { id: 'bo_1_o4', name: '现金流紧张', emoji: '💸', desc: '账上资金告急' },
          { id: 'bo_1_o5', name: '政策合规风险', emoji: '⚖️', desc: 'AI监管政策收紧' },
          { id: 'bo_1_o6', name: '竞品融资消息', emoji: '📰', desc: '竞争对手获得大额融资' }
        ],
        collectibles: [
          { id: 'bo_1_c1', name: '获得融资', emoji: '🏦', desc: '成功完成新一轮融资' },
          { id: 'bo_1_c2', name: '招到核心人才', emoji: '🌟', desc: '关键岗位到位' },
          { id: 'bo_1_c3', name: '产品MVP上线', emoji: '🚀', desc: '最小可行产品发布' },
          { id: 'bo_1_c4', name: '首批种子用户', emoji: '🌱', desc: '获得第一批真实用户' },
          { id: 'bo_1_c5', name: '团队凝聚力提升', emoji: '💪', desc: '团队战斗力形成' },
          { id: 'bo_1_c6', name: '行业会议邀请', emoji: '🎤', desc: '受邀在行业大会演讲' }
        ]
      },
      2: {
        obstacles: [
          { id: 'bo_2_o1', name: '核心员工离职', emoji: '🚪', desc: '关键人才被挖走' },
          { id: 'bo_2_o2', name: '产品数据不及预期', emoji: '📉', desc: '增长未达到投资人预期' },
          { id: 'bo_2_o3', name: '市场竞争加剧', emoji: '🏃', desc: '赛道越来越拥挤' },
          { id: 'bo_2_o4', name: '技术路线分歧', emoji: '🔀', desc: '团队对技术选型有争议' },
          { id: 'bo_2_o5', name: '用户增长停滞', emoji: '📊', desc: '增长曲线趋于平缓' },
          { id: 'bo_2_o6', name: '法务纠纷', emoji: '⚠️', desc: '知识产权或合同纠纷' }
        ],
        collectibles: [
          { id: 'bo_2_c1', name: '用户量翻倍', emoji: '📈', desc: '用户规模快速增长' },
          { id: 'bo_2_c2', name: '战略合作达成', emoji: '🤝', desc: '与行业巨头建立合作' },
          { id: 'bo_2_c3', name: '团队扩张成功', emoji: '👥', desc: '团队规模有序扩大' },
          { id: 'bo_2_c4', name: '产品获奖', emoji: '🏅', desc: '获得行业权威奖项' },
          { id: 'bo_2_c5', name: '营收突破里程碑', emoji: '💰', desc: '商业化取得重大突破' },
          { id: 'bo_2_c6', name: '品牌知名度提升', emoji: '📣', desc: '品牌影响力显著增强' }
        ]
      },
      3: {
        obstacles: [
          { id: 'bo_3_o1', name: '行业寒冬', emoji: '❄️', desc: '融资环境急剧恶化' },
          { id: 'bo_3_o2', name: '大厂入场竞争', emoji: '🏢', desc: '巨头推出同类产品' },
          { id: 'bo_3_o3', name: '数据安全事故', emoji: '🔓', desc: '用户数据泄露危机' },
          { id: 'bo_3_o4', name: '组织管理瓶颈', emoji: '🏗️', desc: '管理跟不上业务增速' },
          { id: 'bo_3_o5', name: '战略方向抉择', emoji: '🔮', desc: '关键十字路口的抉择' },
          { id: 'bo_3_o6', name: '估值下调压力', emoji: '⬇️', desc: '市场对公司估值下调' }
        ],
        collectibles: [
          { id: 'bo_3_c1', name: '成功IPO', emoji: '🔔', desc: '公司成功上市' },
          { id: 'bo_3_c2', name: '年度最佳CEO', emoji: '👑', desc: '获得行业最高认可' },
          { id: 'bo_3_c3', name: '建立行业标准', emoji: '📐', desc: '成为行业标准制定者' },
          { id: 'bo_3_c4', name: '全球化拓展', emoji: '🌍', desc: '产品走向国际市场' },
          { id: 'bo_3_c5', name: '企业文化深入人心', emoji: '❤️', desc: '员工高度认同企业文化' },
          { id: 'bo_3_c6', name: '社会影响力', emoji: '🌈', desc: '成为行业标杆企业' }
        ]
      }
    }
  }
};
