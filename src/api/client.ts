import {
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

  /**
   * Submit a survey response.
   * This also marks the impression as completed on the backend.
   */
  async submitResponse(
    surveyId: string,
    respondentId: string,
    impressionId: string,
    answers: SurveyAnswer[],
    metadata: SurveyResponseMetadata
  ): Promise<string> {
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
  async createImpression(
    surveyId: string,
    respondentId: string,
    metadata: ImpressionMetadata
  ): Promise<string> {
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
  async updateImpression(
    impressionId: string,
    dismissedAt: number
  ): Promise<void> {
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