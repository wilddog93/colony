import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { useAppDispatch } from "../../../../redux/Hook";
import DropdownSelect from "../../../Dropdown/DropdownSelect";
import { OptionProps } from "../../../../utils/useHooks/PropTypes";
import moment from "moment";

type Props = {
  items?: any;
  setItems: Dispatch<SetStateAction<any | any[]>>;
  token?: any;
  isDetail?: boolean;
  options: OptionProps[] | any[];
  isUpdate?: boolean;
  defaultImage: string | any;
};

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

export default function SelectProductRequest({
  items,
  setItems,
  options,
  isDetail,
  token,
  isUpdate,
  defaultImage,
}: Props) {
  // redux
  const dispatch = useAppDispatch();

  const url = process.env.API_ENDPOINT;

  // data
  const [selectedOption, setSelectedOption] = useState<OptionProps[]>([]);
  const [products, setProducts] = useState<OptionProps | any>(null);
  const [productSelected, setProductSelected] = useState<any | any[]>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [selected, setSelected] = useState<any[]>([]);
  const onSelected = (val: any) => {
    const idx = selected.indexOf(val);

    if (idx > -1) {
      const _selected = [...selected];
      _selected.splice(idx, 1);
      setSelected(_selected);
    } else {
      const _selected = [...selected];
      _selected.push(val);
      setSelected(_selected);
    }
  };

  const dateFormat = (value: any) => {
    if (!value) return "-";
    const date = moment(new Date(value)).format("MMMM Do YYYY");
    return date;
  };

  const onAddProduct = (item: any) => {
    if (!item) return;
    let dataProducts =
      !productSelected || productSelected?.length == 0
        ? [item]
        : [...productSelected, item];
    let filterOpt = selectedOption?.filter((e) => e?.value != item?.id);

    const filters = Array.from(new Set(dataProducts.map((a) => a.id))).map(
      (id) => {
        return dataProducts.find((a) => a.id === id);
      }
    );

    setItems(filters);
    setProductSelected(filters);
    setSelectedOption(filterOpt);
    setProducts(null);
  };

  const onDeleteHandler = (value: any) => {
    let filter = productSelected?.filter((e: any) => e?.id != value?.id);

    setItems(filter);
    setProductSelected(filter);
    setSelectedOption([...selectedOption, value]);
  };

  useEffect(() => {
    let products: any[] = [];
    if (items?.length > 0) {
      items.map((item: any) => {
        products.push(item);
      });
      setProductSelected(products);
    }
  }, [items]);

  useEffect(() => {
    let dataProduct: any[] = [];
    if (options?.length > 0) {
      options?.forEach((e) => {
        dataProduct.push(e);
      });
      let filters = dataProduct.filter(
        (e) => !productSelected?.find((item: any) => e.id === item?.id)
      );
      setSelectedOption(filters);
    }
  }, [options, productSelected]);

  // onUpdate
  //   const onSubmit = (value: any) => {
  //     setItems(value);
  //   };

  console.log(productSelected, "item-order");

  const RequestComponent = (props: any) => {
    const { item } = props;
    return (
      <div className="w-full divide-y-2 divide-gray border-2 border-gray rounded-lg text-xs">
        <div className="w-full flex gap-2 p-4">
          <div className="w-full flex items-center gap-1">
            <div className="w-full flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase">
                {item?.requestNumber}
              </h3>
              <span>{dateFormat(item?.createdAt)}</span>
            </div>
          </div>
          <div className={isDetail ? "hidden" : "ml-auto"}>
            <button
              type="button"
              onClick={() => onDeleteHandler(item)}
              className="inline-flex items-center ml-auto text-gray-5 focus:outline-none focus:ring-1 focus:ring-primary rounded-lg p-1 border border-gray">
              <MdClose className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FormatOptionLabel = (props: any) => {
    return (
      <div className="w-full flex items-center justify-between">
        <div className="uppercase text-sm">{props?.label}</div>
      </div>
    );
  };

  return (
    <Fragment>
      {/* step-1 */}
      <div className={`w-full`}>
        <div className={`w-full mb-3 ${!isDetail ? "" : "hidden"}`}>
          {/* <label htmlFor="user">Search :</label> */}
          <div className="w-full flex gap-1">
            <div className="w-[85%]">
              <DropdownSelect
                customStyles={stylesSelect}
                value={products}
                onChange={setProducts}
                error=""
                className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                classNamePrefix=""
                instanceId="user"
                isDisabled={false}
                isMulti={false}
                placeholder="Choose request no."
                options={selectedOption}
                formatOptionLabel={FormatOptionLabel}
                icon=""
              />
            </div>
            <button
              type="button"
              onClick={() => onAddProduct(products)}
              className="w-[15%] bg-primary focus:outline-none text-white p-1 rounded-lg inline-flex gap-1 items-center justify-center text-xs active:scale-95">
              <MdAdd className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* user data */}
        <div className="w-full max-h-[250px] flex flex-col gap-2 overflow-x-hidden overflow-y-auto">
          {productSelected?.length > 0 ? (
            productSelected?.map((item: any, idx: any) => {
              return <RequestComponent key={idx} item={item} />;
            })
          ) : (
            <div className="text-sm italic text-gray-500 font-semibold">
              There is no request data
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
