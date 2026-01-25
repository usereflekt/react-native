import { SDKConfig, Survey, SurveyAnswer, Theme } from './types';
declare class ReflektSDK {
    private static instance;
    private apiClient;
    private config;
    private surveys;
    private theme;
    private initialized;
    private activeImpressions;
    private constructor();
    static getInstance(config?: SDKConfig): ReflektSDK;
    static initialize(config: SDKConfig): Promise<void>;
    private loadSurveys;
    reloadAvailableSurveys(): Promise<Survey[]>;
    getTheme(): Theme;
    getAvailableSurveys(): Promise<Survey[]>;
    private shouldShowSurvey;
    /**
     * Build impression/response metadata from config
     */
    private buildMetadata;
    /**
     * Called when a survey is shown to the user.
     * Creates an impression and returns the impressionId.
     */
    recordImpression(surveyId: string): Promise<string>;
    /**
     * Called when the user dismisses the survey without completing.
     * If the survey was already submitted, no dismissal is recorded.
     */
    recordDismissal(surveyId: string): Promise<void>;
    /**
     * Get the active impression ID for a survey.
     */
    getActiveImpressionId(surveyId: string): string | undefined;
    /**
     * Submit survey response.
     * Requires an active impression to have been recorded first.
     */
    submitResponse(surveyId: string, answers: SurveyAnswer[]): Promise<void>;
    private getCachedSurveys;
    private getCachedTheme;
    private cacheSurveys;
    private cacheTheme;
    private checkHasResponded;
    private syncHasRespondedInBackground;
    private markSurveyCompleted;
}
export default ReflektSDK;
