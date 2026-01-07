import { SDKConfig, Survey, SurveyAnswer } from './types';
declare class ReflektSDK {
    private static instance;
    private apiClient;
    private config;
    private surveys;
    private initialized;
    private constructor();
    static getInstance(config?: SDKConfig): ReflektSDK;
    static initialize(config: SDKConfig): Promise<void>;
    private loadSurveys;
    reloadAvailableSurveys(): Promise<Survey[]>;
    getAvailableSurveys(): Promise<Survey[]>;
    private shouldShowSurvey;
    submitResponse(surveyId: string, answers: SurveyAnswer[]): Promise<void>;
    private getCachedSurveys;
    private cacheSurveys;
    private checkHasResponded;
    private syncHasRespondedInBackground;
    private markSurveyCompleted;
}
export default ReflektSDK;
