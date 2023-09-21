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
import {
  createVendor,
  selectVendorManagement,
  updateVendor,
} from "../../../../../redux/features/assets/vendor/vendorManagementReducers";
import PhoneInput from "react-phone-input-2";

type Props = {
  items?: any;
  token?: any;
  isOpen: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  getData: () => void;
  defaultImage?: string;
};

type FormValues = {
  id?: number | any;
  vendorLogo?: string | any;
  vendorName?: string | any;
  vendorDescription?: string | any;
  vendorWebsite?: string | any;
  vendorPhone?: string | any;
  vendorEmail?: string | any;
  vendorLegalName?: string | any;
  vendorLegalAddress?: string | any;
  webUrl?: any;
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

const urlOpt: OptionProps[] = [
  { value: "http://", label: "http://" },
  { value: "https://", label: "https://" },
];

export default function VendorForm(props: Props) {
  const {
    isOpen,
    isCloseModal,
    items,
    isUpdate,
    token,
    getData,
    defaultImage,
  } = props;

  const url = process.env.API_ENDPOINT;
  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);
  const [files, setFiles] = useState<any>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // status images
  const imageStatus = useMemo(() => {
    return isBase64(files);
  }, [files]);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectVendorManagement);

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
        vendorLogo: items?.vendorLogo,
        vendorName: items?.vendorName,
        vendorDescription: items?.vendorDescription,
        vendorWebsite: items?.vendorWebsite,
        vendorPhone: items?.vendorPhone,
        vendorEmail: items?.vendorEmail,
        vendorLegalName: items?.vendorLegalName,
        vendorLegalAddress: items?.vendorLegalAddress,
        webUrl: items?.webUrl,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (isOpen && items) {
      reset({
        id: items?.id,
        vendorLogo: items?.vendorLogo,
        vendorName: items?.vendorName,
        vendorDescription: items?.vendorDescription,
        vendorWebsite: items?.vendorWebsite,
        vendorPhone: items?.vendorPhone,
        vendorEmail: items?.vendorEmail,
        vendorLegalName: items?.vendorLegalName,
        vendorLegalAddress: items?.vendorLegalAddress,
        webUrl: items?.webUrl,
      });
      setFiles(items?.vendorLogo);
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
    name: "vendorDescription",
    control,
  });

  const legalAddressValue = useWatch({
    name: "vendorLegalAddress",
    control,
  });

  const urlValue = useWatch({
    name: "webUrl",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {
      vendorLogo: imageStatus ? value?.vendorLogo : undefined,
      vendorName: value?.vendorName,
      vendorDescription: value?.vendorDescription,
      vendorWebsite: value?.vendorWebsite
        ? value?.webUrl?.value + value?.vendorWebsite
        : "",
      vendorPhone: value?.vendorPhone,
      vendorEmail: value?.vendorEmail,
      vendorLegalName: value?.vendorLegalName,
      vendorLegalAddress: value?.vendorLegalAddress,
    };
    if (!isUpdate) {
      dispatch(
        createVendor({
          token,
          data: newData,
          isSuccess: async () => {
            await getData();
            await toast.dark("Vendor has been created");
            await isCloseModal();
          },
          isError: () => {
            console.log("error-create-vendor");
          },
        })
      );
    } else {
      dispatch(
        updateVendor({
          token,
          id: value?.id,
          data: newData,
          isSuccess: () => {
            toast.dark("Vendor has been updated");
            getData();
            isCloseModal();
          },
          isError: () => {
            console.log("error-update-vendor");
          },
        })
      );
    }
  };

  // images
  const onSelectImage = (e: any) => {
    console.log(e?.target?.files[0]);
    if (e?.target?.files[0]?.size > 3000000) {
      setError("vendorLogo", {
        type: "onChange",
        message: "File can not more than 3MB",
      });
    } else {
      var reader = new FileReader();
      const preview = () => {
        console.log(1, e?.target?.files[0]?.size);

        if (!e.target.files || e.target.files.length == 0) {
          setFiles(undefined);
          setError("vendorLogo", {
            type: "required",
            message: "File is required",
          });
          return;
        }
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
          let val = reader.result;
          setFiles(val);
          setValue("vendorLogo", val as string);
          clearErrors("vendorLogo");
        };
      };
      preview();
    }
  };

  const onDeleteImage = () => {
    if (imageRef.current) {
      imageRef.current.value = "";
      setFiles(undefined);
      setValue("vendorLogo", null);
      clearErrors("vendorLogo");
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset({
        id: null,
        vendorLogo: null,
        vendorName: null,
        vendorDescription: null,
        vendorWebsite: null,
        vendorPhone: null,
        vendorEmail: null,
        vendorLegalName: null,
        vendorLegalAddress: null,
        webUrl: null,
      });
      onDeleteImage();
    }
  }, [!isOpen]);

  return (
    <Modal size={"medium"} onClose={isCloseModal} isOpen={isOpen}>
      <Fragment>
        <ModalHeader
          onClick={isCloseModal}
          isClose={true}
          className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
          <div className="w-full flex flex-col gap-1 px-2">
            <h3 className="text-lg font-semibold">
              {isUpdate ? "Edit" : "Add"} Vendor
            </h3>
            <p className="text-gray-5 text-sm">Fill your vendor information.</p>
          </div>
        </ModalHeader>
        <div className="w-full">
          <div className={`w-full flex gap-2 divide-x-2 divide-gray`}>
            <div
              className={`w-full lg:w-1/2 duration-300 ease-in-out flex flex-col gap-2 py-2`}>
              <div className="w-full px-4">
                <div className="w-full col-span-4">
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-[120px] h-[120px] relative flex gap-2 group hover:cursor-pointer">
                      <label
                        htmlFor="vendorLogo"
                        className="w-full h-full hover:cursor-pointer">
                        {!files ? (
                          <img
                            src={
                              defaultImage
                                ? defaultImage
                                : "../../image/no-image.jpeg"
                            }
                            alt="vendorLogo"
                            className="w-full max-w-[200px] h-full min-h-[120px] object-cover object-center border border-gray shadow-card rounded-lg p-1"
                          />
                        ) : (
                          <img
                            src={
                              imageStatus
                                ? files
                                : `${url}vendor/vendorLogo/${files}`
                            }
                            alt="vendorLogo"
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
                        placeholder="Vendor Logo..."
                        autoFocus
                        className={`w-full focus:outline-none max-w-max text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-primary file:text-sm file:font-semibold file:bg-violet-50 file:text-primary-700 hover:file:bg-violet-100 ${
                          files ? "hidden" : ""
                        }`}
                        onChange={onSelectImage}
                        ref={imageRef}
                        accept="image/*"
                      />
                      {errors?.vendorLogo && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                          <MdWarning className="w-4 h-4 mr-1" />
                          <span className="text-red-300">
                            {errors.vendorLogo.message as any}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* name */}
              <div className="w-full px-4">
                <label
                  className="text-gray-500 font-semibold text-sm"
                  htmlFor="vendorName">
                  Name<span className="text-primary">*</span>
                </label>
                <div className="w-full flex">
                  <input
                    type="text"
                    placeholder="Name"
                    autoFocus
                    id="vendorName"
                    className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                    {...register("vendorName", {
                      required: {
                        value: true,
                        message: "Vendor name is required.",
                      },
                    })}
                  />
                </div>
                {errors?.vendorName && (
                  <div className="mt-1 text-xs flex items-center text-red-300">
                    <MdWarning className="w-4 h-4 mr-1" />
                    <span className="text-red-300">
                      {errors.vendorName.message as any}
                    </span>
                  </div>
                )}
              </div>

              {/* description */}
              <div className="w-full px-4">
                <label
                  className="text-gray-500 font-semibold text-sm"
                  htmlFor="vendorDescription">
                  Description
                </label>
                <div className="w-full">
                  <textarea
                    rows={3}
                    cols={5}
                    maxLength={400}
                    placeholder="Description"
                    id="vendorDescription"
                    autoFocus
                    className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                    {...register("vendorDescription")}
                  />
                </div>
                <div className={`w-full flex text-xs text-gray-5 justify-end`}>
                  {descValue?.length || 0}/400 Characters
                </div>
              </div>
            </div>

            <div
              className={`duration-300 ease-in-out w-full lg:w-1/2 flex flex-col gap-2 py-2 text-sm`}>
              {/* email */}
              <div className="w-full px-4">
                <label
                  className="col-span-1 my-auto font-semibold"
                  htmlFor="vendorEmail">
                  Email
                </label>
                <div className="w-full col-span-4">
                  <input
                    type="vendorEmail"
                    placeholder="Email..."
                    autoFocus
                    className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                    {...register("vendorEmail", {
                      required: {
                        value: true,
                        message: "Email is required.",
                      },
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Email is invalid.",
                      },
                    })}
                  />
                  {errors?.vendorEmail && (
                    <div className="mt-1 text-xs flex items-center text-red-300">
                      <MdWarning className="w-4 h-4 mr-1" />
                      <span className="text-red-300">
                        {errors.vendorEmail.message as any}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* phone */}
              <div className="w-full px-4">
                <label className="my-auto font-semibold" htmlFor="vendorPhone">
                  Phone No.
                </label>
                <div className="relative">
                  <Controller
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <PhoneInput
                        specialLabel=""
                        country={"id"}
                        value={value}
                        onChange={onChange}
                        buttonClass="shadow-default"
                        placeholder="1 123 4567 8910"
                        inputClass="form-control w-full py-3 px-6 pl-14 border border-stroke focus:border-primary rounded-lg text-sm lg:text-md"
                        dropdownClass="left-0 text-sm lg:text-md"
                        searchClass="w-full p-2 outline-none sticky z-10 bg-white top-0 shadow-2"
                        autocompleteSearch
                        containerClass="w-full flex"
                        enableSearch
                        disableSearchIcon
                      />
                    )}
                    name={`vendorPhone`}
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Phone No. is required.",
                      },
                    }}
                  />
                </div>
                {errors?.vendorPhone && (
                  <div className="mt-1 text-xs flex items-center text-red-300">
                    <MdWarning className="w-4 h-4 mr-1" />
                    <span className="text-red-300">
                      {errors.vendorPhone.message as any}
                    </span>
                  </div>
                )}
              </div>

              {/* website */}
              <div className="w-full px-4">
                <label
                  className="col-span-1 my-auto font-semibold"
                  htmlFor="vendorWebsite">
                  Website
                </label>
                <div className="w-full col-span-4">
                  <div className="relative flex gap-2">
                    <div className="w-full max-w-max">
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
                            instanceId="url"
                            isDisabled={false}
                            isMulti={false}
                            placeholder="URL..."
                            options={urlOpt}
                            icon=""
                          />
                        )}
                        name="webUrl"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: "URL is required.",
                          },
                        }}
                      />
                      {errors?.webUrl && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                          <MdWarning className="w-4 h-4 mr-1" />
                          <span className="text-red-300">
                            {errors.webUrl.message as any}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="Website..."
                        autoFocus
                        className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                        {...register("vendorWebsite", {
                          required: {
                            value: true,
                            message: "Website is required.",
                          },
                        })}
                      />
                      {errors?.vendorWebsite && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                          <MdWarning className="w-4 h-4 mr-1" />
                          <span className="text-red-300">
                            {errors.vendorWebsite.message as any}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* legal name */}
              <div className="w-full px-4">
                <label
                  className="text-gray-500 font-semibold text-sm"
                  htmlFor="vendorLegalName">
                  Legal Name<span className="text-primary">*</span>
                </label>
                <div className="w-full flex">
                  <input
                    type="text"
                    placeholder="Legal Name"
                    autoFocus
                    id="vendorLegalName"
                    className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                    {...register("vendorLegalName", {
                      required: {
                        value: true,
                        message: "Vendor legal name is required.",
                      },
                    })}
                  />
                </div>
                {errors?.vendorLegalName && (
                  <div className="mt-1 text-xs flex items-center text-red-300">
                    <MdWarning className="w-4 h-4 mr-1" />
                    <span className="text-red-300">
                      {errors.vendorLegalName.message as any}
                    </span>
                  </div>
                )}
              </div>

              {/* legal address */}
              <div className="w-full px-4">
                <label
                  className="text-gray-500 font-semibold text-sm"
                  htmlFor="vendorLegalAddress">
                  Legal Address<span className="text-primary">*</span>
                </label>
                <div className="w-full">
                  <textarea
                    rows={3}
                    cols={5}
                    maxLength={400}
                    placeholder="Legal Address"
                    id="vendorLegalAddress"
                    autoFocus
                    className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                    {...register("vendorLegalAddress", {
                      required: {
                        value: true,
                        message: "Legal address is reqiured",
                      },
                    })}
                  />
                </div>
                <div className={`w-full flex text-xs text-gray-5 justify-end`}>
                  {legalAddressValue?.length || 0}/400 Characters
                </div>
                {errors?.vendorLegalAddress && (
                  <div className="mt-1 text-xs flex items-center text-red-300">
                    <MdWarning className="w-4 h-4 mr-1" />
                    <span className="text-red-300">
                      {errors.vendorLegalAddress.message as any}
                    </span>
                  </div>
                )}
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
      </Fragment>
    </Modal>
  );
}
