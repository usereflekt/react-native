import { ImpressionAction, ImpressionMetadata, Survey, SurveyAnswer, SurveyResponseMetadata } from '../types';
export declare class APIClient {
    private apiUrl;
    private apiKey;
    constructor(apiKey: string);
    fetchActiveSurveys(): Promise<Survey[]>;
    submitResponse(surveyId: string, respondentId: string, answers: SurveyAnswer[], metadata: SurveyResponseMetadata): Promise<void>;
    createImpression(surveyId: string, respondentId: string, action: ImpressionAction, metadata: ImpressionMetadata): Promise<void>;
    checkHasResponded(surveyId: string, respondentId: string): Promise<boolean>;
}
