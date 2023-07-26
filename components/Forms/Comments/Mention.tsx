import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export default forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: any) => {
    const item = props?.items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props?.items?.length - 1) % props?.items?.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onkeydown: ({ event }: any) => {
      if (event?.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event?.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event?.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="bg-gray-50 border border-green-300 rounded shadow-md overflow-hidden p-2 relative">
      {props.items.length ? (
        props.items.map((item: any, index: any) => (
          <button
            className={`bg-transparent flex justify-start border-1 border-transparent m-0 p-2 w-full`}
            key={index}
            onClick={() => selectItem(index)}>
            {item}
          </button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </div>
  );
});
