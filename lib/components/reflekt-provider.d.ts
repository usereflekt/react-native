import React from "react";
import { SDKConfig } from "../types";
type ReflektContextValue = {
    isReady: boolean;
};
type ReflektProviderProps = {
    config: SDKConfig;
    children: React.ReactNode;
};
export declare const ReflektProvider: React.FC<ReflektProviderProps>;
export declare const useReflekt: () => ReflektContextValue;
export {};
//# sourceMappingURL=reflekt-provider.d.ts.map