import React, { Fragment, useEffect, useMemo, useState } from "react";
import CurrencyFormat from "react-currency-format";
import {
  Controller,
  EventType,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { MdCheck, MdInfo, MdWarning } from "react-icons/md";
import { ModalFooter } from "../../../Modal/ModalComponent";
import Button from "../../../Button/Button";
import {
  createBillingManual,
  selectBillingManagement,
} from "../../../../redux/features/billing/billingReducers";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import { FaCircleNotch } from "react-icons/fa";

type Props = {
  items?: any;
  isOpen?: boolean;
  token?: any;
  getData: () => void;
  onClose: () => void;
};

type WatchProps = {
  value?: any | null;
};

type WatchChangeProps = {
  name?: any | null;
  type?: EventType | any;
};

type FormValues = {
  billingUnit?: number | any;
  paymentManualAmount?: number | any;
  paymentDiscount?: number | any;
  paymentPenalty?: number | any;
};

const ManualForm = ({ items, isOpen, onClose, getData, token }: Props) => {
  const [watchValue, setWatchValue] = useState<WatchProps | any>();
  const [watchChangeValue, setWatchChangeValue] = useState<WatchChangeProps>();

  const dispatch = useAppDispatch();
  const { pending } = useAppSelector(selectBillingManagement);

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isValid },
    control,
  } = useForm({
    mode: "all",
    defaultValues: useMemo(
      () => ({
        billingUnit: items?.billingUnit,
        paymentManualAmount: items?.paymentPenalty,
        paymentDiscount: items?.paymentDiscount,
        paymentPenalty: items?.paymentPenalty,
        remainingPayment: items?.totalPayment,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        billingUnit: items?.billingUnit,
        paymentManualAmount: items?.paymentPenalty,
        paymentDiscount: items?.paymentDiscount,
        paymentPenalty: items?.paymentPenalty,
        remainingPayment: items?.totalPayment,
      });
    }
  }, [items]);

  const amount = useWatch({
    name: "paymentManualAmount",
    control,
  });

  const discount = useWatch({
    name: "paymentDiscount",
    control,
  });

  const pinalty = useWatch({
    name: "paymentPenalty",
    control,
  });

  const subTotal = useMemo(() => {
    const result =
      Number(amount || 0) - Number(discount || 0) + Number(pinalty || 0);
    return result;
  }, [amount, discount, pinalty]);

  useEffect(() => {
    let result: number = 0;
    result =
      items?.totalPayment > 0 ? Number(items?.totalPayment || 0) - subTotal : 0;
    setValue("remainingPayment", result);
  }, [items, subTotal]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value) {
        setWatchValue(value);
        setWatchChangeValue({ name, type });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    let newObj = {
      billingUnit: value?.billingUnit,
      paymentManualAmount: value?.paymentManualAmount
        ? Number(value?.paymentManualAmount)
        : 0,
      paymentDiscount: value?.paymentDiscount
        ? Number(value?.paymentDiscount)
        : 0,
      paymentPenalty: value?.paymentPenalty ? Number(value?.paymentPenalty) : 0,
    };
    dispatch(
      createBillingManual({
        token,
        data: newObj,
        isSuccess: () => {
          toast.dark("Payment has been created");
          getData();
          onClose();
        },
        isError: () => {
          console.log("error-manual-payment");
        },
      })
    );
    console.log(newObj, "form-data");
  };

  console.log(items, "items");

  return (
    <form className="w-full">
      <div className="mb-4 px-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Payment Amount
          <span>*</span>
        </label>
        <Controller
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
          }) => (
            <CurrencyFormat
              onValueChange={(values) => {
                const { value } = values;
                onChange(value);
              }}
              id="amount"
              value={value || ""}
              thousandSeparator={true}
              placeholder="IDR"
              prefix={"IDR "}
              className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          )}
          name="paymentManualAmount"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Payment amount is required.",
            },
          }}
        />
        {errors?.paymentManualAmount && (
          <div className="mt-1 text-xs flex items-center text-red-300">
            <MdWarning className="w-4 h-4 mr-1" />
            <span className="text-red-300">
              {errors.paymentManualAmount.message as any}
            </span>
          </div>
        )}
      </div>

      <div className="w-full grid grid-cols-2 gap-2 mb-3">
        <div className="w-full px-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Discount
            <span>*</span>
          </label>
          <Controller
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
            }) => (
              <CurrencyFormat
                onValueChange={(values) => {
                  const { value } = values;
                  onChange(value);
                }}
                id="discount"
                value={value || ""}
                thousandSeparator={true}
                placeholder="IDR"
                prefix={"IDR "}
                className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            )}
            name="paymentDiscount"
            control={control}
          />
        </div>

        <div className="w-full px-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Pinalty
            <span>*</span>
          </label>
          <Controller
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
            }) => (
              <CurrencyFormat
                onValueChange={(values) => {
                  const { value } = values;
                  onChange(value);
                }}
                id="penalty"
                value={value || ""}
                thousandSeparator={true}
                placeholder="IDR"
                prefix={"IDR "}
                className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            )}
            name="paymentPenalty"
            control={control}
          />
        </div>
      </div>

      <div className="mb-4 px-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Remaining Payment
        </label>
        <div className="relative">
          <Controller
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
            }) => (
              <CurrencyFormat
                onValueChange={(values) => {
                  const { value } = values;
                  onChange(value);
                }}
                id="remainingPayment"
                value={value || ""}
                thousandSeparator={true}
                placeholder="IDR"
                prefix={"IDR "}
                className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            )}
            name="remainingPayment"
            control={control}
          />
        </div>
      </div>

      {/* footer */}
      <ModalFooter
        className="p-4 border-t-2 border-gray mt-3"
        isClose={false}
        onClick={onClose}>
        <div className="w-full flex items-center gap-2">
          <Button
            type="button"
            className="rounded-lg"
            variant="secondary-outline-none">
            <MdInfo className="w-4 h-4" />
            Help
          </Button>

          <Button
            type="button"
            className="rounded-lg ml-auto"
            variant="secondary-outline"
            onClick={onClose}>
            Discard
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            type="button"
            className="rounded-lg"
            variant="primary"
            disabled={pending}>
            {pending ? (
              <Fragment>
                Loading ...
                <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
              </Fragment>
            ) : (
              <Fragment>
                Confirm
                <MdCheck className="w-4 h-4" />
              </Fragment>
            )}
          </Button>
        </div>
      </ModalFooter>
    </form>
  );
};

export default ManualForm;
