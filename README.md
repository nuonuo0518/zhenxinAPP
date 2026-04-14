# 🚀 Summer's App Hub

个人工具/应用合集。每个 App 独立一个子目录，部署后通过统一入口访问。

## 📦 应用列表

| App | 目录 | 说明 |
|-----|------|------|
| 八字命理 | [`apps/fengshui`](apps/fengshui) | 命盘排盘 + AI 解读，PWA 支持 |

> 后续新增的 App 放在 `apps/` 下即可，会自动出现在导航首页。

## 🔧 本地开发

```bash
# 启动本地服务（在根目录）
npx serve .

# 或用 Python
python -m http.server 8765
```

浏览器打开 `http://localhost:8765` 即可看到导航首页。

## 📱 部署 & 使用

推荐 Vercel 部署，`git push` 自动更新：
1. 关联 GitHub 仓库到 Vercel
2. 得到 `https://xxx.vercel.app` 链接
3. 手机 Safari 打开 → 添加到主屏幕

各 App 访问路径：`https://xxx.vercel.app/apps/fengshui`
