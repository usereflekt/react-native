"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIClient = void 0;
class APIClient {
    constructor(apiKey) {
        this.apiUrl = 'https://jovial-shepherd-346.convex.site/api';
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
        return data.surveys;
    }
    async submitResponse(surveyId, respondentId, answers, metadata) {
        const response = await fetch(`${this.apiUrl}/response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            body: JSON.stringify({
                surveyId,
                respondentId,
                answers,
                metadata,
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to submit response: ${response.status}`);
        }
    }
    async createImpression(surveyId, respondentId, action, metadata) {
        const response = await fetch(`${this.apiUrl}/impression`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            body: JSON.stringify({
                surveyId,
                respondentId,
                action,
                metadata,
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to submit response: ${response.status}`);
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
