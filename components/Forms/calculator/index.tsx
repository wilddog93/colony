import React, { Component, Dispatch, SetStateAction, useState } from "react";
import KeyPadComponent from "./KeyPadComponent";
import ResultComponent from "./ResultComponent";

interface Props {
  className?: string;
  result: string | any;
  setResult: Dispatch<SetStateAction<string | any>>;
}

export default function Calculator({ result, setResult, className }: Props) {
  const calculate = () => {
    let checkResult = "";
    if (result.includes("--")) {
      checkResult = result?.replace("--", "+");
    } else {
      checkResult = result;
    }

    try {
      setResult((eval(checkResult) || "") + "");
    } catch (e) {
      setResult("error");
    }
  };

  const reset = () => {
    setResult("0");
  };

  const backspace = () => {
    setResult(result?.slice(0, -1));
  };

  const maxValue = () => {
    setResult(1000);
  };

  const minValue = () => {
    setResult(1);
  };

  const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const button: HTMLButtonElement = event.currentTarget;
    if (button.name === "=") {
      calculate();
    } else if (button.name === "C") {
      reset();
    } else if (button.name === "CE") {
      backspace();
    } else if (button.name === "MIN") {
      minValue();
    } else if (button.name === "MAX") {
      maxValue();
    } else {
      setResult(result + button.name);
    }
  };

  return (
    <div className="w-full rounded-b-lg">
      <ResultComponent result={result} setResult={setResult} />
      <KeyPadComponent onClick={buttonHandler} />
    </div>
  );
}
