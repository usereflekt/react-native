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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReflekt = exports.ReflektProvider = void 0;
const react_1 = __importStar(require("react"));
const reflekt_sdk_1 = __importDefault(require("../reflekt-sdk"));
const survey_1 = __importDefault(require("./survey"));
const ReflektContext = (0, react_1.createContext)(undefined);
const ReflektProvider = ({ config, children, }) => {
    const [isReady, setIsReady] = (0, react_1.useState)(false);
    const [activeSurvey, setActiveSurvey] = (0, react_1.useState)(null);
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        (async () => {
            try {
                await reflekt_sdk_1.default.initialize(config);
                if (isMounted) {
                    setIsReady(true);
                }
            }
            catch (error) {
                if (config.debug) {
                    console.warn("Reflekt: failed to initialize SDK", error);
                }
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [config]);
    // Auto-show survey if available
    (0, react_1.useEffect)(() => {
        if (!isReady || config.autoShow === false)
            return;
        let isMounted = true;
        (async () => {
            try {
                const sdk = reflekt_sdk_1.default.getInstance();
                const available = await sdk.getAvailableSurveys();
                if (!available.length) {
                    return;
                }
                if (!isMounted)
                    return;
                setActiveSurvey(available[0]);
                setIsVisible(true);
            }
            catch (error) {
                if (config.debug) {
                    console.warn("Reflekt: failed to auto-show survey", error);
                }
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [isReady, config.debug, config.autoShow]);
    // Background polling for new surveys
    (0, react_1.useEffect)(() => {
        if (!isReady)
            return;
        const minutes = config.pollIntervalMinutes ?? 60;
        if (minutes <= 0)
            return;
        const intervalMs = minutes * 60 * 1000;
        let isMounted = true;
        const checkForNewSurveys = async () => {
            try {
                const sdk = reflekt_sdk_1.default.getInstance();
                const available = await sdk.reloadAvailableSurveys();
                if (!isMounted)
                    return;
                if (!available.length)
                    return;
                if (activeSurvey || isVisible) {
                    return;
                }
                setActiveSurvey(available[0]);
                setIsVisible(true);
            }
            catch (error) {
                if (config.debug) {
                    console.warn("Reflekt: failed to refresh surveys", error);
                }
            }
        };
        const id = setInterval(checkForNewSurveys, intervalMs);
        return () => {
            isMounted = false;
            clearInterval(id);
        };
    }, [isReady, config.pollIntervalMinutes, config.debug, activeSurvey, isVisible]);
    const hideSurvey = (0, react_1.useCallback)(() => {
        setIsVisible(false);
    }, []);
    const handleSubmit = (0, react_1.useCallback)(async (answers) => {
        if (!activeSurvey)
            return;
        try {
            const sdk = reflekt_sdk_1.default.getInstance();
            await sdk.submitResponse(activeSurvey._id, answers);
        }
        catch (error) {
            if (config.debug) {
                console.warn("Reflekt: failed to submit survey response", error);
            }
        }
        finally {
            setIsVisible(false);
            setActiveSurvey(null);
        }
    }, [activeSurvey, config.debug]);
    const contextValue = {
        isReady,
    };
    return (<ReflektContext.Provider value={contextValue}>
      {children}
      {activeSurvey && (<survey_1.default survey={activeSurvey} visible={isVisible} onClose={hideSurvey} onSubmit={handleSubmit}/>)}
    </ReflektContext.Provider>);
};
exports.ReflektProvider = ReflektProvider;
const useReflekt = () => {
    const context = (0, react_1.useContext)(ReflektContext);
    if (!context) {
        throw new Error("useReflekt must be used within a ReflektProvider");
    }
    return context;
};
exports.useReflekt = useReflekt;
