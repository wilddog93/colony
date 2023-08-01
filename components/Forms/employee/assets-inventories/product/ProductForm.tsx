import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ModalHeader } from "../../../../Modal/ModalComponent";
import {
  MdAdd,
  MdCheck,
  MdDelete,
  MdHorizontalRule,
  MdWarning,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "../../../../Button/Button";
import { FaCircleNotch } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  createProject,
  selectProjectManagement,
  updateProject,
} from "../../../../../redux/features/task-management/project/projectManagementReducers";
import DropdownSelect from "../../../../Dropdown/DropdownSelect";
import { OptionProps } from "../../../../../utils/useHooks/PropTypes";
import { isBase64 } from "../../../../../utils/useHooks/useFunction";
import Modal from "../../../../Modal";
import Calculator from "../../../calculator";
import {
  createProduct,
  selectProductManagement,
  updateProduct,
} from "../../../../../redux/features/assets/products/productManagementReducers";

type Props = {
  items?: any;
  token?: any;
  isOpen: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  getData: () => void;
  typesOpt?: OptionProps[] | any[];
  categoryOpt?: OptionProps[] | any[];
  unitOpt?: OptionProps[] | any[];
  brandOpt?: OptionProps[] | any[];
};

type FormValues = {
  id?: any;
  productImage?: string | any;
  productName?: string | any;
  productDescription?: string | any;
  productType?: any;
  productCategory?: any;
  unitMeasurement?: any;
  brand?: any;
  productMinimumStock?: number | any;
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

export default function ProductForm(props: Props) {
  const {
    isOpen,
    isCloseModal,
    items,
    isUpdate,
    token,
    getData,
    typesOpt,
    categoryOpt,
    unitOpt,
    brandOpt,
  } = props;

  const url = process.env.API_ENDPOINT;
  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);
  const [files, setFiles] = useState<any>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // calculator
  const [isOpenCalculator, setIsOpenCalculator] = useState(false);
  const [calculator, setCalculator] = useState<string | any>("0");

  const onOpenCalculator = () => {
    setIsOpenCalculator(true);
  };

  const onCloseCalculator = () => {
    setIsOpenCalculator(false);
  };

  // status images
  const imageStatus = useMemo(() => {
    return isBase64(files);
  }, [files]);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectProductManagement);

  // form
  const {
    register,
    unregister,
    getValues,
    setValue,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: {
      errors,
      isValid,
      isDirty,
      dirtyFields,
      isSubmitted,
      isLoading,
    },
    control,
  } = useForm({
    mode: "all",
    defaultValues: useMemo<FormValues>(
      () => ({
        id: items?.id,
        productImage: items?.productImage,
        productName: items?.productName,
        productDescription: items?.productDescription,
        productType: items?.productType,
        productCategory: items?.productCategory,
        unitMeasurement: items?.unitMeasurement,
        brand: items?.brand,
        productMinimumStock: items?.productMinimumStock || 0,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        productImage: items?.productImage,
        productName: items?.productName,
        productDescription: items?.productDescription,
        productType: items?.productType,
        productCategory: items?.productCategory,
        unitMeasurement: items?.unitMeasurement,
        brand: items?.brand,
        productMinimumStock: items?.productMinimumStock,
      });
      setFiles(items?.productImage);
      setCalculator(items?.productMinimumStock);
    }
  }, [items]);

  useEffect(() => {
    const subscription = watch((value, { name, type }): any => {
      if (value) {
        setWatchValue(value);
        setWatchChange({ name, type });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const descValue = useWatch({
    name: "productDescription",
    control,
  });

  const stockValue = useWatch({
    name: "productMinimumStock",
    control,
  });

  const typeValue = useWatch({
    name: "productType",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {
      productImage: imageStatus ? value?.productImage : undefined,
      productName: value?.productName,
      productDescription: value?.productDescription,
      productType: value?.productType?.value,
      productCategory: value?.productCategory?.id,
      unitMeasurement: value?.unitMeasurement?.id,
      brand: value?.brand?.id,
      productMinimumStock:
        !value?.productType || value?.productType?.value !== "Inventory"
          ? 0
          : Number(value?.productMinimumStock),
    };
    if (!isUpdate) {
      dispatch(
        createProduct({
          token,
          data: newData,
          isSuccess: async () => {
            await getData();
            await toast.dark("Product has been updated");
            await isCloseModal();
          },
          isError: () => {
            console.log("error-update-product");
          },
        })
      );
    } else {
      dispatch(
        updateProduct({
          token,
          id: value?.id,
          data: newData,
          isSuccess: () => {
            toast.dark("Product has been updated");
            getData();
            isCloseModal();
          },
          isError: () => {
            console.log("error-update-product");
          },
        })
      );
    }
  };

  // images
  const onSelectImage = (e: any) => {
    console.log(e?.target?.files[0]);
    if (e?.target?.files[0]?.size > 3000000) {
      setError("productImage", {
        type: "onChange",
        message: "File can not more than 3MB",
      });
    } else {
      var reader = new FileReader();
      const preview = () => {
        console.log(1, e?.target?.files[0]?.size);

        if (!e.target.files || e.target.files.length == 0) {
          setFiles(undefined);
          setError("productImage", {
            type: "required",
            message: "File is required",
          });
          return;
        }
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
          let val = reader.result;
          setFiles(val);
          setValue("productImage", val as string);
          clearErrors("productImage");
        };
      };
      preview();
    }
  };

  const onDeleteImage = () => {
    if (imageRef.current) {
      imageRef.current.value = "";
      setFiles(undefined);
      setValue("productImage", null);
      clearErrors("productImage");
    }
  };

  useEffect(() => {
    if (!calculator) {
      setValue("productMinimumStock", null);
    } else {
      setValue("productMinimumStock", calculator);
    }
  }, [calculator]);

  useEffect(() => {
    if (!isOpen) {
      reset({
        id: null,
        productImage: null,
        productName: null,
        productDescription: null,
        productType: null,
        productCategory: null,
        unitMeasurement: null,
        brand: null,
        productMinimumStock: null,
      });
      onDeleteImage();
      setCalculator("");
    }
  }, [!isOpen]);

  return (
    <Modal
      size={!typeValue ? "small" : "medium"}
      onClose={isCloseModal}
      isOpen={isOpen}>
      <Fragment>
        <ModalHeader
          onClick={isCloseModal}
          isClose={true}
          className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
          <div className="w-full flex flex-col gap-1 px-2">
            <h3 className="text-lg font-semibold">
              {isUpdate ? "Edit" : "Add"} Product
            </h3>
            <p className="text-gray-5 text-sm">
              Fill your product information.
            </p>
          </div>
        </ModalHeader>
        <div className="w-full">
          <div className={`w-full flex gap-2 divide-x-2 divide-gray`}>
            <div
              className={`w-full duration-300 ease-in-out flex flex-col gap-2 py-2 ${
                typeValue ? "lg:w-1/2" : ""
              }`}>
              <div className="w-full px-4">
                {/* image logo */}
                {/* <label
                className="col-span-1 my-auto font-semibold"
                htmlFor="productImage">
                Product Image
              </label> */}
                <div className="w-full col-span-4">
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-[120px] h-[120px] relative flex gap-2 group hover:cursor-pointer">
                      <label
                        htmlFor="productImage"
                        className="w-full h-full hover:cursor-pointer">
                        {!files ? (
                          <img
                            src={"../../image/no-image.jpeg"}
                            alt="productImage"
                            className="w-full max-w-[200px] h-full min-h-[120px] object-cover object-center border border-gray shadow-card rounded-lg p-1"
                          />
                        ) : (
                          <img
                            src={
                              imageStatus
                                ? files
                                : `${url}product/productImage/${files}`
                            }
                            alt="productImage"
                            className="w-full max-w-[200px] h-full min-h-[120px] object-cover object-center border border-gray shadow-card rounded-lg p-1"
                          />
                        )}
                      </label>
                      <div
                        className={`${
                          !files ? "hidden " : ""
                        }absolute inset-0 flex`}>
                        <Button
                          type="button"
                          variant="danger"
                          className={`rounded-lg text-sm py-1 px-2 shadow-card opacity-0 group-hover:opacity-50 m-auto`}
                          onClick={onDeleteImage}>
                          Delete
                          <MdDelete className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <input
                        type="file"
                        id="logo"
                        placeholder="Domain Logo..."
                        autoFocus
                        className={`w-full focus:outline-none max-w-max text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-primary file:text-sm file:font-semibold file:bg-violet-50 file:text-primary-700 hover:file:bg-violet-100 ${
                          files ? "hidden" : ""
                        }`}
                        onChange={onSelectImage}
                        ref={imageRef}
                        accept="image/*"
                      />
                      {errors?.productImage && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                          <MdWarning className="w-4 h-4 mr-1" />
                          <span className="text-red-300">
                            {errors.productImage.message as any}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full px-4">
                <label
                  className="text-gray-500 font-semibold text-sm"
                  htmlFor="productName">
                  Name<span className="text-primary">*</span>
                </label>
                <div className="w-full flex">
                  <input
                    type="text"
                    placeholder="Name"
                    autoFocus
                    id="productName"
                    className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                    {...register("productName", {
                      required: {
                        value: true,
                        message: "Product name is required.",
                      },
                    })}
                  />
                </div>
                {errors?.productName && (
                  <div className="mt-1 text-xs flex items-center text-red-300">
                    <MdWarning className="w-4 h-4 mr-1" />
                    <span className="text-red-300">
                      {errors.productName.message as any}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full px-4">
                <label
                  className="text-gray-500 font-semibold text-sm"
                  htmlFor="productDescription">
                  Description
                </label>
                <div className="w-full">
                  <textarea
                    rows={3}
                    cols={5}
                    maxLength={400}
                    placeholder="Description"
                    id="productDescription"
                    autoFocus
                    className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                    {...register("productDescription")}
                  />
                </div>
                <div className={`w-full flex text-xs text-gray-5 justify-end`}>
                  {descValue?.length || 0}/400 Characters
                </div>
              </div>

              <div className="w-full px-4">
                <label
                  className="text-gray-500 font-semibold text-sm"
                  htmlFor="productType">
                  Type<span className="text-primary">*</span>
                </label>
                <div className="w-full flex">
                  <Controller
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <DropdownSelect
                        customStyles={stylesSelect}
                        value={value}
                        onChange={onChange}
                        error=""
                        className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                        classNamePrefix=""
                        formatOptionLabel={""}
                        instanceId="productType"
                        isDisabled={false}
                        isMulti={false}
                        placeholder="Type"
                        options={typesOpt}
                        icon=""
                      />
                    )}
                    name="productType"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Product type is required.",
                      },
                    }}
                  />
                </div>
                {errors?.productType && (
                  <div className="mt-1 text-xs flex items-center text-red-300">
                    <MdWarning className="w-4 h-4 mr-1" />
                    <span className="text-red-300">
                      {errors.productType.message as any}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`duration-300 ease-in-out ${
                !typeValue
                  ? "w-0 scale-0 -translate-x-full"
                  : "w-full lg:w-1/2 flex flex-col gap-2 py-2"
              }`}>
              <div className="w-full px-4">
                <label
                  className="text-gray-500 font-semibold text-sm"
                  htmlFor="productCategory">
                  Category<span className="text-primary">*</span>
                </label>
                <div className="w-full flex">
                  <Controller
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <DropdownSelect
                        customStyles={stylesSelect}
                        value={value}
                        onChange={onChange}
                        error=""
                        className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                        classNamePrefix=""
                        formatOptionLabel={""}
                        instanceId="productCategory"
                        isDisabled={false}
                        isMulti={false}
                        placeholder="Choose Category"
                        options={categoryOpt}
                        icon=""
                      />
                    )}
                    name="productCategory"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Product category is required.",
                      },
                    }}
                  />
                </div>
                {errors?.productCategory && (
                  <div className="mt-1 text-xs flex items-center text-red-300">
                    <MdWarning className="w-4 h-4 mr-1" />
                    <span className="text-red-300">
                      {errors.productCategory.message as any}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full px-4">
                <label
                  className="text-gray-500 font-semibold text-sm"
                  htmlFor="unitMeasurement">
                  Unit Measurement<span className="text-primary">*</span>
                </label>
                <div className="w-full flex">
                  <Controller
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <DropdownSelect
                        customStyles={stylesSelect}
                        value={value}
                        onChange={onChange}
                        error=""
                        className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                        classNamePrefix=""
                        formatOptionLabel={""}
                        instanceId="unitMeasurement"
                        isDisabled={false}
                        isMulti={false}
                        placeholder="Choose Unit"
                        options={unitOpt}
                        icon=""
                      />
                    )}
                    name="unitMeasurement"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Unit measurement is required.",
                      },
                    }}
                  />
                </div>
                {errors?.unitMeasurement && (
                  <div className="mt-1 text-xs flex items-center text-red-300">
                    <MdWarning className="w-4 h-4 mr-1" />
                    <span className="text-red-300">
                      {errors.unitMeasurement.message as any}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full px-4">
                <label
                  className="text-gray-500 font-semibold text-sm"
                  htmlFor="brand">
                  Brands<span className="text-primary">*</span>
                </label>
                <div className="w-full flex">
                  <Controller
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <DropdownSelect
                        customStyles={stylesSelect}
                        value={value}
                        onChange={onChange}
                        error=""
                        className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                        classNamePrefix=""
                        formatOptionLabel={""}
                        instanceId="brand"
                        isDisabled={false}
                        isMulti={false}
                        placeholder="Choose Brand"
                        options={brandOpt}
                        icon=""
                      />
                    )}
                    name="brand"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Brand is required.",
                      },
                    }}
                  />
                </div>
                {errors?.brand && (
                  <div className="mt-1 text-xs flex items-center text-red-300">
                    <MdWarning className="w-4 h-4 mr-1" />
                    <span className="text-red-300">
                      {errors.brand.message as any}
                    </span>
                  </div>
                )}
              </div>

              <div
                className={`w-full px-4 ${
                  typeValue?.value !== "Inventory" ? "hidden" : ""
                }`}>
                <label
                  className="text-gray-500 font-semibold text-sm"
                  htmlFor="productMinimumStock">
                  Minimum Stock
                </label>
                <div className="w-full flex items-center gap-2 my-2">
                  <button
                    onClick={() => {
                      console.log(Number.isInteger(+calculator), "value");
                      if (Number.isInteger(+calculator)) {
                        if (Number(calculator) == 0) return;
                        setCalculator(Number(calculator) - 1);
                      }
                    }}
                    type="button"
                    className="inline-flex items-center justify-center hover:bg-gray active:scale-90 p-1 rounded-lg shadow-3 border-2 border-primary">
                    <MdHorizontalRule className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onOpenCalculator}
                    className="w-full min-w-[70px] h-[40px] max-w-max hover:bg-gray active:scale-90 p-1 rounded-lg shadow-3 border-2 border-primary">
                    {calculator}
                  </button>
                  <button
                    onClick={() => {
                      if (Number.isInteger(+calculator)) {
                        setCalculator(Number(calculator) + 1);
                      }
                    }}
                    type="button"
                    className="inline-flex items-center justify-center hover:bg-gray active:scale-90 p-1 rounded-lg shadow-3 border-2 border-primary">
                    <MdAdd className="w-4 h-4" />
                  </button>
                </div>
                <div
                  className={`w-full flex text-xs text-gray-5 justify-end`}></div>
              </div>
            </div>
          </div>

          <div className="w-full flex gap-2 justify-end p-4 border-t-2 border-gray">
            <button
              type="button"
              className="rounded-md text-sm border py-2 px-4 border-gray shadow-card"
              onClick={isCloseModal}>
              <span className="font-semibold">Discard</span>
            </button>

            <Button
              type="submit"
              variant="primary"
              className="rounded-md text-sm shadow-card border-primary"
              onClick={handleSubmit(onSubmit)}
              disabled={pending}>
              <span className="font-semibold">
                {isUpdate ? "Update" : "Save"}
              </span>
              {pending ? (
                <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
              ) : (
                <MdCheck className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <Modal
          isOpen={isOpenCalculator}
          onClose={onCloseCalculator}
          size="small">
          <Fragment>
            <ModalHeader
              onClick={onCloseCalculator}
              isClose={true}
              className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
              <div className="w-full flex flex-col gap-1 px-2">
                <h3 className="text-lg font-semibold">Calculator</h3>
                {/* <p className="text-gray-5 text-sm">
                Fill your product information.
              </p> */}
              </div>
            </ModalHeader>
            <Calculator result={calculator} setResult={setCalculator} />
            <div className="w-full flex justify-end p-4 border-t-2 border-gray">
              <Button
                type="button"
                variant="primary"
                className="rounded-md text-sm shadow-card border-primary"
                onClick={onCloseCalculator}>
                <span className="font-semibold">Save</span>
              </Button>
            </div>
          </Fragment>
        </Modal>
      </Fragment>
    </Modal>
  );
}
