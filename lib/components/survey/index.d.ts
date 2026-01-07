import React from 'react';
import { SurveyAnswer, Survey as SurveyType } from '../../types';
interface SurveyProps {
    survey: SurveyType;
    visible: boolean;
    onClose: () => void;
    onSubmit: (answers: SurveyAnswer[]) => void;
}
declare const Survey: React.FC<SurveyProps>;
export default Survey;
