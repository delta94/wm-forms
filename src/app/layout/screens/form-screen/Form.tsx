import React, { useState, useEffect } from "react";
import {
  IFormAnswerBE,
  QuestionType,
} from "../../../interfaces/form/form.interface";
import { IFormContext } from "./FormScreen";

import localization from "../../../consts/localization";
import RadioInput from "../../../components/inputs/radio-input/RadioInput";
import CheckboxInput from "../../../components/inputs/checkbox-input/CheckboxInput";
import useFormManager from "../../../hooks/useFormManager";
import MessageContainer from "../../../components/message-container/MessageContainer";

interface IFormProps {
  onSelected: (selected: IFormAnswerBE[]) => void;
}

export default function Form({
  props,
  formContext,
}: {
  props: IFormProps;
  formContext: IFormContext;
}) {
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const { getInput } = useFormManager({ ...formContext, selectedIndexes });
  const { onSelected } = props;
  const { currentQuestion, currentId } = formContext;
  const { answers, type } = currentQuestion;
  const isSingleSelect = type === QuestionType.SingleSelect;
  const isMultipleSelect = type === QuestionType.MultipleSelect;
  const { multipleSelectMsg } = localization;
  const formClass = isSingleSelect ? "single" : "multiple";

  const handleChange = (index: number) => {
    if (isSingleSelect) {
      setSelectedIndexes([index]);
    } else {
      const cloned = [...selectedIndexes];
      const existSelection = Boolean(cloned) ? cloned.indexOf(index) : -1;

      if (existSelection > -1) {
        cloned.splice(existSelection, 1);
        setSelectedIndexes(cloned);
      } else {
        setSelectedIndexes([...cloned, index]);
      }
    }
  };

  useEffect(() => {
    setSelectedIndexes([]);
  }, [currentId]);

  useEffect(() => {
    const selectedAnswers = selectedIndexes.map((index) => {
      return answers[index];
    });
    onSelected(selectedAnswers);
  }, [selectedIndexes]);

  return (
    <div className={`form-answers ${formClass}`}>
      {isMultipleSelect && <MessageContainer message={multipleSelectMsg} />}
      <ul className={`options`}>
        {answers.map((answer, index) => {
          const inputData = getInput({ type, option: answer, index });
          const input = {
            ...inputData,
            handleChange: () => handleChange(index),
          };

          return (
            <li className="option" key={`answer-${index}`}>
              {isSingleSelect ? (
                <RadioInput {...input} />
              ) : (
                <CheckboxInput {...input} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
