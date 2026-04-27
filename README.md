# AI Brain - 智能学习助手

## 项目介绍

AI Brain是一个基于Vue 3的智能学习助手应用，旨在为用户提供个性化的学习体验，包括AI辅导、技能评估、学习路径规划等功能。

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI库**: Element Plus
- **图表库**: ECharts
- **代码编辑器**: Monaco Editor
- **图形编辑**: AntV X6
- **HTTP请求**: Axios
- **Markdown解析**: Markdown-it
- **分割面板**: Splitpanes
- **动画库**: GSAP
- **安全处理**: DOMPurify
- **构建工具**: Vite

## 项目结构

```
aibrain/
├── public/             # 静态资源
├── src/
│   ├── api/            # API相关代码
│   │   ├── types/      # 类型定义
│   │   ├── http.ts     # HTTP请求
│   │   └── ws.ts       # WebSocket连接
│   ├── assets/         # 静态资源
│   │   └── styles/     # 样式文件
│   ├── components/     # 组件
│   │   ├── charts/     # 图表组件
│   │   ├── chat/       # 聊天组件
│   │   ├── common/     # 通用组件
│   │   ├── editor/     # 编辑器组件
│   │   ├── graph/      # 图形组件
│   │   └── layout/     # 布局组件
│   ├── composables/    # 组合式API
│   ├── router/         # 路由配置
│   ├── stores/         # 状态管理
│   ├── utils/          # 工具函数
│   ├── views/          # 页面视图
│   ├── App.vue         # 应用根组件
│   ├── env.d.ts        # 环境类型定义
│   └── main.ts         # 应用入口
├── .gitignore          # Git忽略文件
├── index.html          # HTML模板
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript配置
├── tsconfig.node.json  # TypeScript节点配置
└── vite.config.ts      # Vite配置
```

## 主要功能

### 1. 仪表盘 (DashboardView)
- 学习进度跟踪
- 技能掌握情况
- 最近活动概览

### 2. 评估系统 (AssessmentView)
- 技能评估测试
- 个性化学习建议
- 评估结果分析

### 3. 消息中心 (MessagesView)
- AI导师聊天
- 消息历史记录
- 快速回复功能

### 4. 技能实验室 (SkillLabView)
- 技能图谱可视化
- 技能练习
- 学习资源推荐

### 5. 工作区 (WorkspaceView)
- 代码编辑器
- 实时协作
- 项目管理

### 6. 入职引导 (OnboardingView)
- 新用户引导
- 功能介绍
- 个性化设置

## 核心特性

### AI辅导
- 智能学习助手
- 个性化学习建议
- 实时问题解答

### 技能管理
- 技能图谱
- 学习路径规划
- 技能评估

### 实时协作
- WebSocket连接
- 实时消息传递
- 多人协作编辑

### 响应式设计
- 深色/浅色模式
- 适配不同设备
- 流畅的用户体验

## 安装与运行

### 环境要求
- Node.js 16.0+
- npm 7.0+

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 技术亮点

1. **组合式API**: 使用Vue 3的组合式API，提高代码可维护性和复用性
2. **TypeScript**: 全面使用TypeScript，提供类型安全
3. **状态管理**: 使用Pinia进行状态管理，简化状态逻辑
4. **响应式设计**: 支持深色/浅色模式，适配不同设备
5. **实时通信**: 集成WebSocket，实现实时消息传递和协作
6. **数据可视化**: 使用ECharts和AntV X6，提供直观的数据展示
7. **代码编辑**: 集成Monaco Editor，提供专业的代码编辑体验
8. **模块化设计**: 清晰的项目结构，便于维护和扩展

## 未来计划

- [ ] 增加更多AI模型支持
- [ ] 扩展技能库和学习资源
- [ ] 增加多人协作功能
- [ ] 优化移动端体验
- [ ] 集成更多第三方服务

## 贡献指南

欢迎贡献代码和提出建议！请按照以下步骤进行：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 许可证

MIT License

## 联系我们

如有问题或建议，请联系我们的开发团队。
