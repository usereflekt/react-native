// ----------
// SDK config
// ----------

export interface SDKConfig {
  /** Your Reflekt API key */
  apiKey: string;
  /** Unique identifier for the current user/respondent */
  respondentId: string;
  /** Automatically show surveys when available (default: true) */
  autoShow?: boolean;
  /** Your app's version string for analytics */
  appVersion?: string;
  /** Enable debug logging (default: false) */
  debug?: boolean;
  /** Interval in minutes for polling new surveys. Set to 0 to disable. (default: 60) */
  pollIntervalMinutes?: number;
  /** Custom API URL for self-hosted or staging environments */
  apiUrl?: string;
}

// -----------------
// Project / schema
// -----------------

export interface Project {
  name: string;
  slug: string;
  organizationId: string;
  theme: Theme
}

export interface ThemeColors {
  background: string;        // Sheet/surface/inputs background
  text: string;              // Primary text, labels
  textSecondary: string;     // Descriptions, placeholders
  primary: string;           // Accent, selected states, buttons
  primaryForeground: string; // Text on primary buttons
}

export interface ThemeBorderRadius {
  sheet: number;   // Modal sheet corners
  button: number;  // Button corners
  option: number;  // Option corners
  input: number;   // Input/option corners
}

export interface Theme {
  colors: ThemeColors;
  borderRadius: ThemeBorderRadius;
}

// ---------
// Surveys
// ---------

export type SurveyQuestionType =
  | "free_text"
  | "message"
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
}

export interface SurveyResponse {
  surveyId: string;
  respondentId: string;
  impressionId: string;
  answers: SurveyAnswer[];
  metadata: SurveyResponseMetadata;
}

// ------------
// Impressions
// ------------

export interface ImpressionMetadata {
  platform: string;
  appVersion: string;
  deviceId?: string;
  locale?: string;
}

export interface SurveyImpression {
  surveyId: string;
  respondentId?: string;
  shownAt: number;
  dismissedAt?: number;
  completedAt?: number;
  metadata: ImpressionMetadata;
}