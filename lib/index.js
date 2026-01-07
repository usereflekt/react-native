"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReflekt = exports.SurveyModal = exports.ReflektSDK = exports.ReflektProvider = void 0;
const reflekt_provider_1 = require("./components/reflekt-provider");
Object.defineProperty(exports, "ReflektProvider", { enumerable: true, get: function () { return reflekt_provider_1.ReflektProvider; } });
Object.defineProperty(exports, "useReflekt", { enumerable: true, get: function () { return reflekt_provider_1.useReflekt; } });
const survey_1 = __importDefault(require("./components/survey"));
exports.SurveyModal = survey_1.default;
const reflekt_sdk_1 = __importDefault(require("./reflekt-sdk"));
exports.ReflektSDK = reflekt_sdk_1.default;
__exportStar(require("./types"), exports);
exports.default = reflekt_sdk_1.default;
