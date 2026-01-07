"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const react_native_1 = require("react-native");
const client_1 = require("./api/client");
class ReflektSDK {
    constructor(config) {
        this.surveys = [];
        this.initialized = false;
        this.config = config;
        this.apiClient = new client_1.APIClient(config.apiKey);
    }
    static getInstance(config) {
        if (!ReflektSDK.instance && config) {
            ReflektSDK.instance = new ReflektSDK(config);
        }
        if (!ReflektSDK.instance) {
            throw new Error('ReflektSDK not initialized. Call initialize() first.');
        }
        return ReflektSDK.instance;
    }
    static async initialize(config) {
        const sdk = ReflektSDK.getInstance(config);
        await sdk.loadSurveys();
        sdk.initialized = true;
    }
    async loadSurveys() {
        try {
            const cached = await this.getCachedSurveys();
            if (cached) {
                this.surveys = cached;
            }
            const surveys = await this.apiClient.fetchActiveSurveys();
            this.surveys = surveys;
            await this.cacheSurveys(surveys);
        }
        catch (error) {
            console.error('Failed to load surveys:', error);
        }
    }
    async reloadAvailableSurveys() {
        await this.loadSurveys();
        return this.getAvailableSurveys();
    }
    async getAvailableSurveys() {
        const results = await Promise.all(this.surveys.map(async (survey) => {
            const shouldShow = await this.shouldShowSurvey(survey._id);
            return shouldShow ? survey : null;
        }));
        const availableSurveys = results.filter((survey) => survey !== null);
        return availableSurveys;
    }
    async shouldShowSurvey(surveyId) {
        const hasResponded = await this.checkHasResponded(surveyId);
        // Room for future logic
        return !hasResponded;
    }
    async submitResponse(surveyId, answers) {
        const metadata = {
            platform: react_native_1.Platform.OS,
            appVersion: this.config.appVersion || '1.0.0',
            timestamp: Date.now(),
            startedAt: Date.now(),
            completedAt: Date.now(),
        };
        await this.apiClient.submitResponse(surveyId, this.config.respondentId, answers, metadata);
        await this.markSurveyCompleted(surveyId);
    }
    async getCachedSurveys() {
        try {
            const cached = await async_storage_1.default.getItem('@surveys_cache');
            return cached ? JSON.parse(cached) : null;
        }
        catch {
            return null;
        }
    }
    async cacheSurveys(surveys) {
        try {
            await async_storage_1.default.setItem('@surveys_cache', JSON.stringify(surveys));
        }
        catch (error) {
            console.error('Failed to cache surveys:', error);
        }
    }
    async checkHasResponded(surveyId) {
        try {
            const key = `@survey_completed_${surveyId}`;
            const value = await async_storage_1.default.getItem(key);
            const localHasResponded = !!value;
            if (localHasResponded) {
                void this.syncHasRespondedInBackground(surveyId, true);
                return true;
            }
            const hasResponded = await this.apiClient.checkHasResponded(surveyId, this.config.respondentId);
            if (hasResponded) {
                await this.markSurveyCompleted(surveyId);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Failed to check if has responded:', error);
            return false;
        }
    }
    async syncHasRespondedInBackground(surveyId, localHasResponded) {
        try {
            const remoteHasResponded = await this.apiClient.checkHasResponded(surveyId, this.config.respondentId);
            if (remoteHasResponded === localHasResponded) {
                return;
            }
            if (remoteHasResponded) {
                await this.markSurveyCompleted(surveyId);
            }
            else {
                const key = `@survey_completed_${surveyId}`;
                await async_storage_1.default.removeItem(key);
            }
        }
        catch (error) {
            console.error('Failed to sync hasResponded state:', error);
        }
    }
    async markSurveyCompleted(surveyId) {
        try {
            const key = `@survey_completed_${surveyId}`;
            await async_storage_1.default.setItem(key, Date.now().toString());
        }
        catch (error) {
            console.error('Failed to mark survey as completed:', error);
        }
    }
}
ReflektSDK.instance = null;
exports.default = ReflektSDK;
