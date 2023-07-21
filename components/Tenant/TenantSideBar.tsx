import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import EditInfo from "./button/EditInfo";
import Button from "../Button/Button";
import Modal from "../Modal";
import { ModalFooter, ModalHeader } from "../Modal/ModalComponent";
import { SearchInput } from "../Forms/SearchInput";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdOutlineCheckBox } from "react-icons/md";

const TenantSideBar = () => {
  const [isForm, setIsForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [search, setSearch] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const isOpenForm = () => {
    setIsForm(true);
  };
  const isCloseForm = () => {
    setIsForm(false);
  };

  return (
    <div className="h-screen w-full bg-[#1C2D3D] px-5 pt-6">
      <div className="flex flex-col justify-center">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row items-center space-x-2 text-white">
            <FaChevronLeft />
            <span className=" text-lg">Back</span>
          </div>
          {/* <EditInfo /> */}
          <button
            onClick={isOpenForm}
            className="flex flex-row space-x-2 bg-white rounded-lg content-center items-center text-slate-400 p-2">
            <span>Edit Info</span>
            <MdSettings className=" w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col space-y-4 mt-5">
          <span className="text-white font-bold text-xl">4</span>
          <div className="flex flex-row space-x-2 items-center text-white">
            <FaBuilding className=" w-7 h-7" />
            <span className="text-xl font-bold">Unit D</span>
          </div>
        </div>
        <div className="flex flex-col text-white space-y-2 mt-8">
          <span className="font-bold text-xl">Amenities</span>
          <span className="">Swimming Pool 1</span>
        </div>
      </div>
      <Modal isOpen={isForm} onClose={isCloseForm} size="medium">
        <div>
          <ModalHeader
            className="border-b-2 border-gray p-4"
            isClose
            onClick={isCloseForm}>
            <div className="w-full flex">
              <h3 className="text-base lg:text-xl font-semibold leading-6">
                Edit Info
              </h3>
            </div>
          </ModalHeader>
          <div className="flex w-full items-start">
            <div className="w-1/2 flex flex-col gap-5 p-4 border-r-2 border-stroke">
              <div className="flex flex-col">
                <p className="font-bold">Amenities</p>
                <div className="border border-stroke rounded-lg p-4 bg-gray flex flex-col text-gray-5">
                  <SearchInput
                    className="w-full text-sm rounded-xl"
                    classNamePrefix=""
                    filter={search}
                    setFilter={setSearch}
                    placeholder="Search..."
                  />
                  <div className="overflow-y-auto max-h-36 mt-2 flex flex-col gap-2">
                    <button
                      onClick={() => setIsChecked(!isChecked)}
                      className="w-full flex items-center gap-2 bg-white rounded-md shadow-md p-2 focus:outline-none">
                      {!isChecked ? (
                        <MdCheckBoxOutlineBlank className="h-5 w-5" />
                      ) : (
                        <MdOutlineCheckBox className="h-5 w-5" />
                      )}
                      <p className="text-gray-5">Bedroom</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2 flex flex-col p-4">
              <p className="border-b-2 border-stroke font-bold">
                List of Amenities
              </p>
              <div className="w-full overflow-x-auto">
                <table className="mt-2 w-full">
                  <thead>
                    <tr>
                      <th className="w-8/12 flex flex-start">Type</th>
                      <th className="w-4/12">
                        <center>Qty</center>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isChecked ? (
                      <td>No Amenity Selected</td>
                    ) : (
                      <tr>
                        <td className="w-8/12 flex flex-start">Bedroom</td>
                        <td className="w-4/12">
                          <input
                            type="number"
                            className="p-1 w-full rounded-md shadow-lg"
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Footer */}
          <ModalFooter
            className="w-full flex border-t-2 border-gray py-2 px-4"
            isClose
            onClick={isCloseForm}>
            <Button
              type="button"
              variant="primary"
              className="rounded-lg text-sm">
              Save
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
};

export default TenantSideBar;
