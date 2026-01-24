import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { APIClient } from './api/client';
import { DEFAULT_THEME, mergeTheme } from './theme';
import { SDKConfig, Survey, SurveyAnswer, Theme } from './types';

class ReflektSDK {
  private static instance: ReflektSDK | null = null;
  private apiClient: APIClient;
  private config: SDKConfig;
  private surveys: Survey[] = [];
  private theme: Theme = DEFAULT_THEME;
  private initialized: boolean = false;

  private constructor(config: SDKConfig) {
    this.config = config;
    this.apiClient = new APIClient(config.apiKey);
  }

  static getInstance(config?: SDKConfig): ReflektSDK {
    if (!ReflektSDK.instance && config) {
      ReflektSDK.instance = new ReflektSDK(config);
    }
    if (!ReflektSDK.instance) {
      throw new Error('ReflektSDK not initialized. Call initialize() first.');
    }
    return ReflektSDK.instance;
  }

  static async initialize(config: SDKConfig): Promise<void> {
    const sdk = ReflektSDK.getInstance(config);
    await sdk.loadSurveys();
    sdk.initialized = true;
  }

  private async loadSurveys(): Promise<void> {
    try {
      const cachedSurveys = await this.getCachedSurveys();
      const cachedTheme = await this.getCachedTheme();
      if (cachedSurveys) {
        this.surveys = cachedSurveys;
      }
      if (cachedTheme) {
        this.theme = mergeTheme(cachedTheme);
      }

      const { surveys, theme } = await this.apiClient.fetchActiveSurveys();

      this.surveys = surveys;
      this.theme = mergeTheme(theme);
      await this.cacheSurveys(surveys);
      await this.cacheTheme(this.theme);
    } catch (error) {
      console.error('Failed to load surveys:', error);
    }
  }

  async reloadAvailableSurveys(): Promise<Survey[]> {
    await this.loadSurveys();
    return this.getAvailableSurveys();
  }

  getTheme(): Theme {
    return this.theme;
  }

  async getAvailableSurveys(): Promise<Survey[]> {
    const results = await Promise.all(
      this.surveys.map(async (survey) => {
        const shouldShow = await this.shouldShowSurvey(survey._id);
        return shouldShow ? survey : null;
      })
    );

    const availableSurveys = results.filter(
      (survey): survey is Survey => survey !== null
    );

    return availableSurveys;
  }

  private async shouldShowSurvey(surveyId: string): Promise<boolean> {
    const hasResponded = await this.checkHasResponded(surveyId);
    // Room for future logic
    return !hasResponded;
  }

  async submitResponse(surveyId: string, answers: SurveyAnswer[]): Promise<void> {
    const metadata = {
      platform: Platform.OS,
      appVersion: this.config.appVersion || 'Unknown', // TODO: Get app version from package.json
      timestamp: Date.now(),
      startedAt: Date.now(),
      completedAt: Date.now(),
    };

    // Filter out invalid answers (skipped questions, message questions, or deselected ratings)
    const validAnswers = answers.filter((answer) => {
      if (answer === undefined) return false;
      const value = answer.answer;
      // Filter out deselected ratings (value 0)
      if (typeof value === 'number' && value === 0) return false;
      // Filter out empty strings
      if (typeof value === 'string' && value.trim() === '') return false;
      // Filter out empty arrays
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    });

    await this.apiClient.submitResponse(surveyId, this.config.respondentId, validAnswers, metadata);
    
    await this.markSurveyCompleted(surveyId);
  }

  private async getCachedSurveys(): Promise<Survey[] | null> {
    try {
      const cached = await AsyncStorage.getItem('@surveys_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  private async getCachedTheme(): Promise<Theme | null> {
    try {
      const cached = await AsyncStorage.getItem('@theme_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  private async cacheSurveys(surveys: Survey[]): Promise<void> {
    try {
      await AsyncStorage.setItem('@surveys_cache', JSON.stringify(surveys));
    } catch (error) {
      console.error('Failed to cache surveys:', error);
    }
  }

  private async cacheTheme(theme: Theme): Promise<void> {
    try {
      await AsyncStorage.setItem('@theme_cache', JSON.stringify(theme));
    } catch (error) {
      console.error('Failed to cache theme:', error);
    }
  }
  
  private async checkHasResponded(surveyId: string): Promise<boolean> {
    try {
      const key = `@survey_completed_${surveyId}`;
      const value = await AsyncStorage.getItem(key);
      const localHasResponded = !!value;

      if (localHasResponded) {
        void this.syncHasRespondedInBackground(surveyId, true);
        return true;
      }

      const hasResponded = await this.apiClient.checkHasResponded(
        surveyId,
        this.config.respondentId
      );
      if (hasResponded) {
        await this.markSurveyCompleted(surveyId);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to check if has responded:', error);
      return false;
    }
  }

  private async syncHasRespondedInBackground(
    surveyId: string,
    localHasResponded: boolean
  ): Promise<void> {
    try {
      const remoteHasResponded = await this.apiClient.checkHasResponded(
        surveyId,
        this.config.respondentId
      );

      if (remoteHasResponded === localHasResponded) {
        return;
      }

      if (remoteHasResponded) {
        await this.markSurveyCompleted(surveyId);
      } else {
        const key = `@survey_completed_${surveyId}`;
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Failed to sync hasResponded state:', error);
    }
  }

  private async markSurveyCompleted(surveyId: string): Promise<void> {
    try {
      const key = `@survey_completed_${surveyId}`;
      await AsyncStorage.setItem(key, Date.now().toString());
    } catch (error) {
      console.error('Failed to mark survey as completed:', error);
    }
  }
}

export default ReflektSDK;