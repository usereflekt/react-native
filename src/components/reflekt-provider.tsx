import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ReflektSDK from "../reflekt-sdk";
import { DEFAULT_THEME, ThemeProvider } from "../theme";
import { SDKConfig, Survey as SurveyType, SurveyAnswer, Theme } from "../types";
import Survey from "./survey";


type ReflektContextValue = {
  isReady: boolean;
};

const ReflektContext = createContext<ReflektContextValue | undefined>(
  undefined
);

type ReflektProviderProps = {
  config: SDKConfig;
  children: React.ReactNode;
};

export const ReflektProvider: React.FC<ReflektProviderProps> = ({
  config,
  children,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [activeSurvey, setActiveSurvey] = useState<SurveyType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await ReflektSDK.initialize(config);
        if (isMounted) {
          const sdk = ReflektSDK.getInstance();
          setTheme(sdk.getTheme());
          setIsReady(true);
        }
      } catch (error) {
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
  useEffect(() => {
    if (!isReady || config.autoShow === false) return;

    let isMounted = true;
    (async () => {
      try {
        const sdk = ReflektSDK.getInstance();
        const available = await sdk.getAvailableSurveys();

        if (!available.length) {
          return;
        }

        if (!isMounted) return;

        setActiveSurvey(available[0]);
        setIsVisible(true);
      } catch (error) {
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
  useEffect(() => {
    if (!isReady) return;

    const minutes = config.pollIntervalMinutes ?? 60;
    if (minutes <= 0) return;

    const intervalMs = minutes * 60 * 1000;
    let isMounted = true;

    const checkForNewSurveys = async () => {
      try {
        const sdk = ReflektSDK.getInstance();
        const available = await sdk.reloadAvailableSurveys();

        if (!isMounted) return;

        // Update theme after reload
        setTheme(sdk.getTheme());

        if (!available.length) return;

        if (activeSurvey || isVisible) {
          return;
        }

        setActiveSurvey(available[0]);
        setIsVisible(true);
      } catch (error) {
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

  const hideSurvey = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleSubmit = useCallback(
    async (answers: SurveyAnswer[]) => {
      if (!activeSurvey) return;

      try {
        const sdk = ReflektSDK.getInstance();
        await sdk.submitResponse(activeSurvey._id, answers);
      } catch (error) {
        if (config.debug) {
          console.warn("Reflekt: failed to submit survey response", error);
        }
      } finally {
        setIsVisible(false);
        setActiveSurvey(null);
      }
    },
    [activeSurvey, config.debug]
  );

  const contextValue: ReflektContextValue = {
    isReady,
  };

  return (
    <ReflektContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        {children}
        {activeSurvey && (
          <Survey
            survey={activeSurvey}
            visible={isVisible}
            onClose={hideSurvey}
            onSubmit={handleSubmit}
          />
        )}
      </ThemeProvider>
    </ReflektContext.Provider>
  );
};

export const useReflekt = (): ReflektContextValue => {
  const context = useContext(ReflektContext);
  if (!context) {
    throw new Error("useReflekt must be used within a ReflektProvider");
  }
  return context;
};


