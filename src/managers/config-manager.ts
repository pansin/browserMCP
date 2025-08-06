/**
 * 配置管理器实现
 */

import fs from 'fs/promises';
import path from 'path';
import { IConfigManager } from '../interfaces/browser.js';
import { BrowserConfig, BrowserConfigSchema } from '../types/index.js';
import { DEFAULT_CONFIG } from '../config/default.js';
import { ConfigurationError, ValidationError } from '../errors/index.js';

export class ConfigManager implements IConfigManager {
  private configPath: string | null = null;
  private config: BrowserConfig;

  constructor(configPath?: string) {
    this.configPath = configPath || null;
    this.config = { ...DEFAULT_CONFIG };
  }

  /**
   * 加载配置
   */
  async loadConfig(): Promise<BrowserConfig> {
    // 如果没有指定配置路径，返回默认配置
    if (!this.configPath) {
      return this.config;
    }

    try {
      // 检查配置文件是否存在
      await fs.access(this.configPath);
      
      // 读取配置文件
      const configData = await fs.readFile(this.configPath, 'utf-8');
      const parsedConfig = JSON.parse(configData);
      
      // 验证配置
      this.config = this.validateConfig(parsedConfig);
      
      return this.config;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // 如果文件不存在，创建默认配置文件
        await this.saveConfig(DEFAULT_CONFIG);
        return DEFAULT_CONFIG;
      }
      
      throw new ConfigurationError(`加载配置失败: ${(error as Error).message}`, error as Error);
    }
  }

  /**
   * 保存配置
   */
  async saveConfig(config: BrowserConfig): Promise<void> {
    if (!this.configPath) {
      throw new ConfigurationError('未指定配置路径');
    }

    try {
      // 验证配置
      const validatedConfig = this.validateConfig(config);
      
      // 确保目录存在
      const dir = path.dirname(this.configPath);
      await fs.mkdir(dir, { recursive: true });
      
      // 写入配置文件
      await fs.writeFile(
        this.configPath,
        JSON.stringify(validatedConfig, null, 2),
        'utf-8'
      );
      
      this.config = validatedConfig;
    } catch (error) {
      throw new ConfigurationError(`保存配置失败: ${(error as Error).message}`, error as Error);
    }
  }

  /**
   * 获取默认配置
   */
  getDefaultConfig(): BrowserConfig {
    return { ...DEFAULT_CONFIG };
  }

  /**
   * 验证配置
   */
  validateConfig(config: any): BrowserConfig {
    try {
      // 使用Zod验证配置
      const result = BrowserConfigSchema.safeParse(config);
      
      if (!result.success) {
        throw new ValidationError(`配置验证失败: ${result.error.message}`);
      }
      
      return result.data;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      
      throw new ValidationError(`配置验证失败: ${(error as Error).message}`, error as Error);
    }
  }
}