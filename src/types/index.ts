// ----------
// SDK config
// ----------

export interface SDKConfig {
  apiKey: string;
  respondentId: string;
  autoShow?: boolean;
  appVersion?: string;
  debug?: boolean;
  pollIntervalMinutes?: number; // If <= 0, no background polling is performed. Default is 60 minutes.
}

// -----------------
// Project / schema
// -----------------

export type ProjectPlatform =
  | "react-native-bare"
  | "react-native-expo"
  | "flutter"
  | "ios"
  | "android";

export interface Project {
  name: string;
  slug: string;
  organizationId: string;
  platforms: ProjectPlatform[];
}

// ---------
// Surveys
// ---------

export type SurveyQuestionType =
  | "free_text"
  | "multi_select"
  | "single_select"
  | "rating";

export interface SurveySelectOption {
  // Matches comment in schema: { id: string, label: string }
  id: string;
  label: string;
}

export interface SurveySelectConfig {
  options: SurveySelectOption[];
  allowOther: boolean;
}

export type SurveyRatingScale = "stars" | "numbers" | "smiley";

export type SurveyRatingRange = 3 | 4 | 5 | 7 | 10;

export interface SurveyRatingConfig {
  scale: SurveyRatingScale;
  range: SurveyRatingRange;
  lowerLabel?: string;
  upperLabel?: string;
}

export interface SurveyQuestion {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  type: SurveyQuestionType;
  selectConfig?: SurveySelectConfig;
  ratingConfig?: SurveyRatingConfig;
}

export type SurveyStatus = "draft" | "active" | "paused" | "archived";

export interface Survey {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  status: SurveyStatus;
  updatedAt: number;
  publishedAt?: number;
}

// ----------
// Responses
// ----------

export type SurveyAnswerValue = string | number | string[];

export interface SurveyAnswer {
  questionId: string;
  answer: SurveyAnswerValue;
  otherText?: string;
}

export interface SurveyResponseMetadata {
  platform: string;
  appVersion: string;
  deviceId?: string;
  locale?: string;
  timestamp: number;
  startedAt: number;
  completedAt: number;
}

export interface SurveyResponse {
  surveyId: string;
  respondentId: string;
  answers: SurveyAnswer[];
  metadata: SurveyResponseMetadata;
}

// ------------
// Impressions
// ------------

export type ImpressionAction = "shown" | "dismissed" | "completed";

export interface ImpressionMetadata {
  platform: string;
  appVersion: string;
  deviceId?: string;
  locale?: string;
  timestamp: number;
}

export interface SurveyImpression {
  surveyId: string;
  respondentId?: string;
  action: ImpressionAction;
  metadata: ImpressionMetadata;
  createdAt: number;
}