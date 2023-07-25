import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MdAdd, MdOutlineClose } from "react-icons/md";
import DropdownSelect from "../../../../Dropdown/DropdownSelect";
import { OptionProps } from "../../../../../utils/useHooks/PropTypes";
import { sortByArr } from "../../../../../utils/useHooks/useFunction";
import { ModalHeader } from "../../../../Modal/ModalComponent";

const stylesSelect = {
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided: any) => {
    return {
      ...provided,
      color: "#7B8C9E",
    };
  },
  clearIndicator: (provided: any) => {
    return {
      ...provided,
      color: "#7B8C9E",
    };
  },
  control: (provided: any, state: any) => {
    // console.log(provided, "control")
    return {
      ...provided,
      background: "",
      padding: ".2rem",
      borderRadius: ".5rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 33,
      // flexDirection: "row-reverse"
    };
  },
  menuList: (provided: any) => provided,
};

type PropsData = {
  taskCategory: any | any[];
  setTaskCategory: Dispatch<SetStateAction<any | any[]>>;
  options: any | any[];
  onCloseModal: () => void;
};

export default function TaskCategoryForm({
  taskCategory,
  setTaskCategory,
  options,
  onCloseModal,
}: PropsData) {
  const [value, setValue] = useState(null);

  const [categoryOpt, setCategoryOpt] = useState<OptionProps[] | any[]>([]);
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<any | any[]>(
    []
  );

  const onAddHandler = (item: any) => {
    if (!item) return;
    let dataCategory =
      !selectedTaskCategory || selectedTaskCategory?.length == 0
        ? [item]
        : [...selectedTaskCategory, item];
    let filterOpt = categoryOpt?.filter((e) => e?.id != item?.id);

    const filterCategory = Array.from(
      new Set(dataCategory.map((a) => a.id))
    ).map((id) => {
      return dataCategory.find((a) => a.id === id);
    });

    setSelectedTaskCategory(filterCategory);
    setTaskCategory(filterCategory);
    setCategoryOpt(filterOpt);
    setValue(null);
  };

  const onDeleteHandler = (item: any) => {
    let filter = selectedTaskCategory?.filter((e: any) => e?.id != item?.id);

    setSelectedTaskCategory(filter);
    setTaskCategory(filter);
    setCategoryOpt([...options, item]);
  };

  useEffect(() => {
    let cats: any[] = [];
    if (taskCategory?.length > 0) {
      taskCategory.map((item: any) => {
        cats.push(item);
      });
      setSelectedTaskCategory(cats);
    }
  }, [taskCategory]);

  useEffect(() => {
    let dataCategory: any[] = [];
    if (options?.length > 0) {
      options?.forEach((e: any) => {
        dataCategory.push(e);
      });
      let filterCat = dataCategory.filter(
        (e) => !selectedTaskCategory?.find((user: any) => e.id === user?.id)
      );
      setCategoryOpt(filterCat);
    }
  }, [options, selectedTaskCategory]);

  console.log(categoryOpt, "option-category");

  return (
    <Fragment>
      <ModalHeader
        onClick={onCloseModal}
        isClose={true}
        className="p-2 bg-white rounded-t-xl border-b-2 border-gray">
        <Fragment>
          <div className={`w-full flex flex-col gap-1 px-2`}>
            <h3 className="text-lg font-semibold">Task Category</h3>
            <p className="text-gray-5 text-sm">
              Fill your category information.
            </p>
          </div>
        </Fragment>
      </ModalHeader>
      <div className="w-full flex flex-col gap-1 text-sm p-4">
        <div className="w-full mb-3">
          <label className="font-semibold" htmlFor="taskCategory">
            Task Category
          </label>
          <div className="w-full flex gap-1">
            <div className="w-[85%]">
              <DropdownSelect
                customStyles={stylesSelect}
                value={value}
                onChange={setValue}
                error=""
                className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                classNamePrefix=""
                formatOptionLabel={""}
                instanceId="taskCategory"
                isDisabled={false}
                isMulti={false}
                placeholder="Select Category"
                options={categoryOpt}
                icon=""
              />
            </div>
            <button
              type="button"
              onClick={() => onAddHandler(value)}
              className="w-[15%] bg-primary focus:outline-none text-white p-1 rounded-lg inline-flex gap-1 items-center justify-center text-xs">
              <MdAdd className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="w-full mb-3">
          <div className="font-semibold text-sm ">Selected Category</div>
          <div className="bg-gray-100 rounded border-2 border-gray p-2 h-auto max-h-52 overflow-auto items-center flex flex-wrap gap-2">
            {selectedTaskCategory?.length > 0 ? (
              selectedTaskCategory?.map((e: any, idx: any) => (
                <label
                  style={{
                    backgroundColor: e?.taskCategoryFillColor,
                    color: e?.taskCategoryTextColor,
                  }}
                  className="w-full max-w-max p-1 flex items-center rounded cursor-pointer justify-between"
                  htmlFor={e?.id}
                  key={e?.id}>
                  <span className="italic text-xs uppercase">
                    #{e?.taskCategoryName}
                  </span>
                  <button onClick={() => onDeleteHandler(e)}>
                    <MdOutlineClose className="ml-2 w-3 h-3 text-gray-500 hover:text-red-300" />
                  </button>
                </label>
              ))
            ) : (
              <div className="text-xs w-full p-2 flex items-center rounded justify-between">
                There is no task category data
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex gap-2 justify-end p-4 border-t-2 border-gray">
        <button
          type="button"
          className="rounded-md text-sm border py-2 px-4 border-gray shadow-card"
          onClick={onCloseModal}>
          <span className="font-semibold">Close</span>
        </button>
      </div>
    </Fragment>
  );
}
