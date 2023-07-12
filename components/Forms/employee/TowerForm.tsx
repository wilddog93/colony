import React, { Fragment, useEffect, useMemo, useState } from "react";
import { ModalFooter, ModalHeader } from "../../Modal/ModalComponent";
import { MdCheck, MdOutlinePlace, MdWarning } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook";
import {
  createTowers,
  getTowers,
  selectTowerManagement,
  updateTowers,
} from "../../../redux/features/building-management/tower/towerReducers";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "../../Button/Button";
import { tokenToString } from "typescript";
import Link from "next/link";
import { FaCircleNotch } from "react-icons/fa";

type Props = {
  items?: any;
  token?: any;
  isOpen?: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  filters?: any;
};

type FormValues = {
  id?: number | string;
  towerName?: string;
  towerDescription?: string;
  gpsLocation?: string;
};

export default function TowerForm(props: Props) {
  const { isOpen, isCloseModal, items, isUpdate, filters, token } = props;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // redux
  const dispatch = useAppDispatch();
  const { towers, tower, pending, error, message } = useAppSelector(
    selectTowerManagement
  );

  // form
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
    defaultValues: useMemo<FormValues>(
      () => ({
        id: items?.id,
        towerName: items?.towerName,
        towerDescription: items?.towerDescription,
        gpsLocation: items?.gpsLocation,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        towerName: items?.towerName,
        towerDescription: items?.towerDescription,
        gpsLocation: items?.gpsLocation,
      });
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

  const descriptionValue = useWatch({
    name: "towerDescription",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    let newData: FormValues = {
      towerName: value.towerName,
      towerDescription: value.towerDescription,
      gpsLocation: value.gpsLocation,
    };
    if (!isUpdate) {
      dispatch(
        createTowers({
          data: newData,
          token: token,
          isSuccess() {
            isCloseModal();
            dispatch(getTowers({ params: filters, token }));
          },
        })
      );
      console.log("this is create");
    } else {
      dispatch(
        updateTowers({
          id: value?.id,
          data: newData,
          token: token,
          isSuccess() {
            isCloseModal();
            dispatch(getTowers({ params: filters, token }));
          },
        })
      );
      console.log("this is update");
    }
  };

  return (
    <Fragment>
      <ModalHeader
        onClick={isCloseModal}
        isClose={true}
        className="p-4 bg-white rounded-t-xl border-b-2 border-gray mb-3">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">
            {isUpdate ? "Edit" : "Add"} Tower
          </h3>
          <p className="text-gray-4">Fill your tower information.</p>
        </div>
      </ModalHeader>
      <form className="w-full p-4">
        <div className="w-full mb-3">
          <label className="text-gray-500 font-semibold" htmlFor="">
            Tower Identity <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            placeholder="Tower Identity ..."
            autoFocus
            className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
            {...register("towerName", {
              required: {
                value: true,
                message: "Tower Identity is required.",
              },
            })}
          />
          {errors?.towerName && (
            <div className="mt-1 text-xs flex items-center text-red-300">
              <MdWarning className="w-4 h-4 mr-1" />
              <span className="text-red-300">
                {errors.towerName.message as any}
              </span>
            </div>
          )}
        </div>

        <div className="w-full mb-3">
          <label className="text-gray-500 font-semibold" htmlFor="">
            Tower Description
          </label>
          <textarea
            cols={0.5}
            rows={5}
            maxLength={400}
            placeholder="Tower Description..."
            className="w-full text-sm rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            {...register("towerDescription")}
          />
          <div className="mt-1 text-xs flex items-center">
            <span className="text-graydark">
              {descriptionValue?.length || 0} / 400 characters.
            </span>
          </div>
        </div>

        <div className="w-full mb-3">
          <label className="text-gray-500 font-semibold" htmlFor="">
            GPS Location
          </label>
          <div className="w-full flex">
            <button
              type="button"
              className="w-18 flex rounded-l-lg border border-gray border-r-0">
              <Link
                href="https://www.google.co.id/maps"
                className="w-full h-full flex"
                target="_blank">
                <MdOutlinePlace className="w-5 h-5 m-auto" />
              </Link>
            </button>
            <input
              type="text"
              placeholder="GPS Location ..."
              className={`w-full text-sm rounded-r-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
              {...register("gpsLocation")}
            />
          </div>
        </div>

        <div className="w-full flex gap-2 justify-end">
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
            disabled={!isValid || pending}>
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
      </form>
    </Fragment>
  );
}
