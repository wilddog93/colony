import React from "react";
import { MdArrowBack } from "react-icons/md";

interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function KeyPadComponent({ onClick }: Props) {
  return (
    <div className="grid grid-cols-4 text-xl divide-x-2 divide-y-2 divide-gray">
      <button
        className="col-span-1 p-4 border-t-2 border-gray"
        name="("
        onClick={onClick}>
        (
      </button>
      <button className="col-span-1 p-4" name=")" onClick={onClick}>
        )
      </button>
      <button className="col-span-1 p-4" name="CE" onClick={onClick}>
        <MdArrowBack className="w-6 h-6 mx-auto" />
      </button>
      <button className="col-span-1 p-4" name="C" onClick={onClick}>
        C
      </button>

      <button className="col-span-1 p-4" name="1" onClick={onClick}>
        1
      </button>
      <button className="col-span-1 p-4" name="2" onClick={onClick}>
        2
      </button>
      <button className="col-span-1 p-4" name="3" onClick={onClick}>
        3
      </button>
      <button className="col-span-1 p-4" name="+" onClick={onClick}>
        +
      </button>

      <button className="col-span-1 p-4" name="4" onClick={onClick}>
        4
      </button>
      <button className="col-span-1 p-4" name="5" onClick={onClick}>
        5
      </button>
      <button className="col-span-1 p-4" name="6" onClick={onClick}>
        6
      </button>
      <button className="col-span-1 p-4" name="-" onClick={onClick}>
        -
      </button>

      <button className="col-span-1 p-4" name="7" onClick={onClick}>
        7
      </button>
      <button className="col-span-1 p-4" name="8" onClick={onClick}>
        8
      </button>
      <button className="col-span-1 p-4" name="9" onClick={onClick}>
        9
      </button>
      <button className="col-span-1 p-4" name="*" onClick={onClick}>
        x
      </button>

      <button className="col-span-1 p-4" name="." onClick={onClick}>
        .
      </button>
      <button className="col-span-1 p-4" name="0" onClick={onClick}>
        0
      </button>
      <button className="col-span-1 p-4" name="=" onClick={onClick}>
        =
      </button>
      <button className="col-span-1 p-4" name="/" onClick={onClick}>
        ÷
      </button>
      <button
        className="grids col-span-2 p-4 border-t-2 border-gray"
        name="MIN"
        onClick={onClick}>
        MIN
      </button>
      <button
        className="grids col-span-2 p-4 border-t-2 border-gray"
        name="MAX"
        onClick={onClick}>
        MAX
      </button>
    </div>
  );
}
