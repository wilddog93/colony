import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ModalHeader } from "../../Modal/ModalComponent";
import { MdAdd, MdCheck, MdClose } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook";
import Button from "../../Button/Button";
import DropdownSelect from "../../Dropdown/DropdownSelect";
import { FaCircleNotch } from "react-icons/fa";
import { OptionProps, ProductProps } from "../../../utils/useHooks/PropTypes";

type Props = {
  items?: any;
  setItems: Dispatch<SetStateAction<any | any[]>>;
  token?: any;
  closeModal: () => void;
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

export default function FormProductOrder({
  closeModal,
  items,
  setItems,
  token,
  options,
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

  const onAddProduct = (user: any) => {
    if (!user) return;
    let dataProducts =
      !productSelected || productSelected?.length == 0
        ? [user]
        : [...productSelected, user];
    let filterOpt = selectedOption?.filter((e) => e?.value != user?.id);

    const filters = Array.from(new Set(dataProducts.map((a) => a.id))).map(
      (id) => {
        return dataProducts.find((a) => a.id === id);
      }
    );

    setProductSelected(filters);
    setSelectedOption(filterOpt);
    setProducts(null);
  };

  const onDeleteHandler = (value: any) => {
    let filter = productSelected?.filter((e: any) => e?.id != value?.id);

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
  const onSubmit = (value: any) => {
    setItems(value);
    closeModal();
  };

  const ProductComponent = (props: any) => {
    const { product } = props;
    return (
      <div className="w-full flex gap-2 border-2 border-gray rounded-lg px-4 py-2 text-xs">
        <div className="w-full flex items-center gap-1">
          <img
            src={
              product?.productImage
                ? `${url}product/productImage/${product?.productImage}`
                : defaultImage
            }
            alt=""
            className="w-6 h-6 object-cover object-center"
          />
          <div className="w-full flex items-center justify-between">
            <span>{product?.productName}</span>
            <span>{product?.productType}</span>
          </div>
        </div>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => onDeleteHandler(product)}
            className="inline-flex items-center ml-auto text-gray-5 focus:outline-none focus:ring-1 focus:ring-primary rounded-lg p-1 border border-gray">
            <MdClose className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const FormatOptionLabel = (props: any) => {
    return (
      <div className="w-full flex items-center justify-between">
        <div>{props?.label}</div>
        <div>{props?.productType}</div>
      </div>
    );
  };

  console.log(options, "options");

  return (
    <Fragment>
      <ModalHeader
        onClick={closeModal}
        isClose={true}
        className="p-2 bg-white rounded-t-xl border-b-2 border-gray">
        <Fragment>
          <div className={`w-full flex flex-col gap-1 px-2`}>
            <h3 className="text-lg font-semibold">Add Product</h3>
            <p className="text-gray-5 text-sm">
              Fill your product information.
            </p>
          </div>
        </Fragment>
      </ModalHeader>

      {/* step-1 */}
      <div className={`w-full`}>
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
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
                  placeholder="Choose product"
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
                return <ProductComponent key={idx} product={item} />;
              })
            ) : (
              <div className="px-4 text-xs text-gray-5">
                There is no product added
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex gap-2 justify-end p-4 border-t-2 border-gray">
          <button
            type="button"
            className="rounded-md text-sm border py-2 px-4 border-gray shadow-card active:scale-90"
            onClick={closeModal}>
            <span className="font-semibold">Close</span>
          </button>

          <Button
            type="button"
            onClick={() => onSubmit(productSelected)}
            className={`rounded-lg shadow-2 active:scale-90`}
            variant="primary"
            disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">Loading...</span>
                <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
              </div>
            ) : (
              <span className="text-sm font-semibold">Add Product</span>
            )}
          </Button>
        </div>
      </div>
    </Fragment>
  );
}
