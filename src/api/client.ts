import {
  ImpressionAction,
  ImpressionMetadata,
  Survey,
  SurveyAnswer,
  SurveyResponseMetadata,
  Theme
} from '../types';

export class APIClient {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiUrl = 'https://jovial-shepherd-346.convex.site/api';
    this.apiKey = apiKey;
  }

  async fetchActiveSurveys(): Promise<{ surveys: Survey[], theme: Theme }> {
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

  async submitResponse(
    surveyId: string,
    respondentId: string,
    answers: SurveyAnswer[],
    metadata: SurveyResponseMetadata
  ): Promise<void> {
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

  async createImpression(
    surveyId: string,
    respondentId: string,
    action: ImpressionAction,
    metadata: ImpressionMetadata
  ): Promise<void> {
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

  async checkHasResponded(
    surveyId: string,
    respondentId: string
  ): Promise<boolean> {
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