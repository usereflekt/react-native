import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { APIClient } from './api/client';
import { DEFAULT_THEME, mergeTheme } from './theme';
import { ImpressionMetadata, SDKConfig, Survey, SurveyAnswer, Theme } from './types';

class ReflektSDK {
  private static instance: ReflektSDK | null = null;
  private apiClient: APIClient;
  private config: SDKConfig;
  private surveys: Survey[] = [];
  private theme: Theme = DEFAULT_THEME;
  private initialized: boolean = false;
  
  // Track active impressions by surveyId
  private activeImpressions: Map<string, string> = new Map();

  private constructor(config: SDKConfig) {
    this.config = config;
    this.apiClient = new APIClient(config.apiKey, config.apiUrl);
  }

  /**
   * Get the singleton instance of ReflektSDK.
   * @throws Error if SDK has not been initialized
   */
  static getInstance(config?: SDKConfig): ReflektSDK {
    if (!ReflektSDK.instance && config) {
      ReflektSDK.instance = new ReflektSDK(config);
    }
    if (!ReflektSDK.instance) {
      throw new Error('ReflektSDK not initialized. Call initialize() first.');
    }
    return ReflektSDK.instance;
  }

  /**
   * Initialize the SDK with the provided configuration.
   * Must be called before using any other SDK methods.
   */
  static async initialize(config: SDKConfig): Promise<void> {
    // Reset if already initialized with different config
    if (ReflektSDK.instance) {
      ReflektSDK.instance = null;
    }
    const sdk = ReflektSDK.getInstance(config);
    await sdk.loadSurveys();
    sdk.initialized = true;
  }

  /**
   * Reset the SDK instance. Useful when user logs out or
   * when you need to reinitialize with a different configuration.
   */
  static reset(): void {
    if (ReflektSDK.instance) {
      ReflektSDK.instance.activeImpressions.clear();
      ReflektSDK.instance = null;
    }
  }

  /**
   * Check if the SDK has been initialized.
   */
  static isInitialized(): boolean {
    return ReflektSDK.instance?.initialized ?? false;
  }

  private log(message: string, ...args: unknown[]): void {
    if (this.config.debug) {
      console.log(`[Reflekt] ${message}`, ...args);
    }
  }

  private logError(message: string, error?: unknown): void {
    if (this.config.debug) {
      console.error(`[Reflekt] ${message}`, error);
    }
  }

  private getCompletedKey(surveyId: string) {
    const safeRespondentId = encodeURIComponent(this.config.respondentId);
    return `@survey_completed_${surveyId}_${safeRespondentId}`;
  }

  private async loadSurveys(): Promise<void> {
    try {
      const cachedSurveys = await this.getCachedSurveys();
      const cachedTheme = await this.getCachedTheme();
      if (cachedSurveys) {
        this.surveys = cachedSurveys;
        this.log('Loaded surveys from cache', cachedSurveys.length);
      }
      if (cachedTheme) {
        this.theme = mergeTheme(cachedTheme);
      }

      const { surveys, theme } = await this.apiClient.fetchActiveSurveys();

      this.surveys = surveys;
      this.theme = mergeTheme(theme);
      await this.cacheSurveys(surveys);
      await this.cacheTheme(this.theme);
      this.log('Loaded surveys from API', surveys.length);
    } catch (error) {
      this.logError('Failed to load surveys:', error);
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

  /**
   * Build impression/response metadata from config
   */
  private buildMetadata(): ImpressionMetadata {
    return {
      platform: Platform.OS,
      appVersion: this.config.appVersion || 'Unknown',
    };
  }

  /**
   * Called when a survey is shown to the user.
   * Creates an impression and returns the impressionId.
   */
  async recordImpression(surveyId: string): Promise<string> {
    try {
      const metadata = this.buildMetadata();
      const impressionId = await this.apiClient.createImpression(
        surveyId,
        this.config.respondentId,
        metadata
      );
      
      // Store the active impression
      this.activeImpressions.set(surveyId, impressionId);
      this.log('Recorded impression', surveyId, impressionId);
      
      return impressionId;
    } catch (error) {
      this.logError('Failed to record impression:', error);
      throw error;
    }
  }

  /**
   * Called when the user dismisses the survey without completing.
   * If the survey was already submitted, no dismissal is recorded.
   */
  async recordDismissal(surveyId: string): Promise<void> {
    const impressionId = this.activeImpressions.get(surveyId);
    
    // No active impression means survey was already submitted or impression failed
    if (!impressionId) {
      return;
    }

    try {
      await this.apiClient.updateImpression(impressionId, Date.now());
      this.log('Recorded dismissal', surveyId);
    } catch (error) {
      this.logError('Failed to record dismissal:', error);
      // Don't throw - dismissal tracking failure shouldn't break the app
    } finally {
      // Clear the active impression regardless of success/failure
      this.activeImpressions.delete(surveyId);
    }
  }

  /**
   * Get the active impression ID for a survey.
   */
  getActiveImpressionId(surveyId: string): string | undefined {
    return this.activeImpressions.get(surveyId);
  }

  /**
   * Submit survey response.
   * Creates an impression if one isn't active yet.
   */
  async submitResponse(surveyId: string, answers: SurveyAnswer[]): Promise<void> {
    let impressionId = this.activeImpressions.get(surveyId);

    if (!impressionId) {
      impressionId = await this.recordImpression(surveyId);
    }

    const metadata = this.buildMetadata();

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

    await this.apiClient.submitResponse(
      surveyId,
      this.config.respondentId,
      impressionId,
      validAnswers,
      metadata
    );
    
    // Clear the active impression after successful submission
    this.activeImpressions.delete(surveyId);
    
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
      this.logError('Failed to cache surveys:', error);
    }
  }

  private async cacheTheme(theme: Theme): Promise<void> {
    try {
      await AsyncStorage.setItem('@theme_cache', JSON.stringify(theme));
    } catch (error) {
      this.logError('Failed to cache theme:', error);
    }
  }
  
  private async checkHasResponded(surveyId: string): Promise<boolean> {
    try {
      const key = this.getCompletedKey(surveyId);
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
      this.logError('Failed to check if has responded:', error);
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
        const key = this.getCompletedKey(surveyId);
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      this.logError('Failed to sync hasResponded state:', error);
    }
  }

  private async markSurveyCompleted(surveyId: string): Promise<void> {
    try {
      const key = this.getCompletedKey(surveyId);
      await AsyncStorage.setItem(key, Date.now().toString());
      this.log('Marked survey as completed', surveyId);
    } catch (error) {
      this.logError('Failed to mark survey as completed:', error);
    }
  }
}

export default ReflektSDK;