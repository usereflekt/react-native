"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIClient = void 0;
const DEFAULT_API_URL = 'https://jovial-shepherd-346.convex.site/api';
class APIClient {
    constructor(apiKey, apiUrl) {
        this.apiUrl = apiUrl || DEFAULT_API_URL;
        this.apiKey = apiKey;
    }
    async fetchActiveSurveys() {
        const response = await fetch(`${this.apiUrl}/surveys/active`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch surveys: ${response.status}`);
        }
        const data = await response.json();
        return { surveys: data.surveys, theme: data.theme };
    }
    /**
     * Submit a survey response.
     * This also marks the impression as completed on the backend.
     */
    async submitResponse(surveyId, respondentId, impressionId, answers, metadata) {
        const response = await fetch(`${this.apiUrl}/response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            body: JSON.stringify({
                surveyId,
                respondentId,
                impressionId,
                answers,
                metadata,
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to submit response: ${response.status}`);
        }
        const data = await response.json();
        return data.responseId;
    }
    /**
     * Create a new impression when a survey is shown.
     * Returns the impressionId which must be stored locally.
     */
    async createImpression(surveyId, respondentId, metadata) {
        const response = await fetch(`${this.apiUrl}/impression`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            body: JSON.stringify({
                surveyId,
                respondentId,
                metadata,
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to create impression: ${response.status}`);
        }
        const data = await response.json();
        return data.impressionId;
    }
    /**
     * Update an existing impression when user dismisses the survey.
     * Only allowed if the impression has not been completed.
     */
    async updateImpression(impressionId, dismissedAt) {
        const response = await fetch(`${this.apiUrl}/impression`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            body: JSON.stringify({
                impressionId,
                dismissedAt,
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to update impression: ${response.status}`);
        }
    }
    async checkHasResponded(surveyId, respondentId) {
        const response = await fetch(`${this.apiUrl}/has-responded`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            body: JSON.stringify({
                surveyId,
                respondentId,
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to check if has responded: ${response.status}`);
        }
        const data = await response.json();
        return data.hasResponded;
    }
}
exports.APIClient = APIClient;
