#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const configPath = path.join(projectRoot, 'config.json');

// 读取现有配置
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// 合并图片代理配置
const enhancedConfig = {
  ...config,
  image: {
    ...(config.image || {}),
    proxy: {
      enabled: true,
      service: "cloudflare",
      url: "https://images.weserv.nl/?url=",
      domains: [
        "doubanio.com",
        "douban.com",
        "img1.doubanio.com",
        "img2.doubanio.com",
        "img3.doubanio.com",
        "img9.doubanio.com"
      ],
      ...(config.image?.proxy || {})
    },
    fallback: config.image?.fallback || "/images/default-poster.jpg",
    cacheDuration: config.image?.cacheDuration || 86400
  }
};

// 写回配置文件
fs.writeFileSync(configPath, JSON.stringify(enhancedConfig, null, 2), 'utf8');
console.log('✅ 已增强 config.json 配置');

// 重新生成 runtime.ts
try {
  execSync('node scripts/convert-config.js', { stdio: 'inherit' });
} catch (error) {
  console.error('重新生成 runtime.ts 失败:', error.message);
}
