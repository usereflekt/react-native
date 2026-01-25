import { ImpressionMetadata, Survey, SurveyAnswer, SurveyResponseMetadata, Theme } from '../types';
export declare class APIClient {
    private apiUrl;
    private apiKey;
    constructor(apiKey: string);
    fetchActiveSurveys(): Promise<{
        surveys: Survey[];
        theme: Theme;
    }>;
    /**
     * Submit a survey response.
     * This also marks the impression as completed on the backend.
     */
    submitResponse(surveyId: string, respondentId: string, impressionId: string, answers: SurveyAnswer[], metadata: SurveyResponseMetadata): Promise<string>;
    /**
     * Create a new impression when a survey is shown.
     * Returns the impressionId which must be stored locally.
     */
    createImpression(surveyId: string, respondentId: string, metadata: ImpressionMetadata): Promise<string>;
    /**
     * Update an existing impression when user dismisses the survey.
     * Only allowed if the impression has not been completed.
     */
    updateImpression(impressionId: string, dismissedAt: number): Promise<void>;
    checkHasResponded(surveyId: string, respondentId: string): Promise<boolean>;
}
