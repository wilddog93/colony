import React, { FormEvent } from "react";

export default function ResultComponent({ result, setResult }: any) {
  return (
    <div className="w-full">
      <input
        type="text"
        value={result}
        onChange={(event: FormEvent<HTMLInputElement>) =>
          setResult(event.currentTarget.value)
        }
        className="w-full bg-gray focus:outline-none px-4 py-3 overflow-hidden"
      />
    </div>
  );
}
