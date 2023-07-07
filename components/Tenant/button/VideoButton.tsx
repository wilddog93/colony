import React, { useState } from "react";
import { MdOutlineUpload } from "react-icons/md";

const VideoButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategory, setIsCategory] = useState(false);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopUp = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={openPopup}
        className="bg-primary rounded-lg w-full text-white p-2 flex flex-row gap-2 items-center justify-center"
      >
        <span className="font-semibold text-base">Upload Video</span>
        <MdOutlineUpload className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg flex items-center justify-center">
          <div className="absolute inset-0 z-30 bg-black opacity-70"></div>
          <div className="relative mx-auto w-full inline-block text-left align-middle transition-all transform max-w-5xl z-50 opacity-100 scale-100">
            <div className="bg-white flex flex-col rounded-lg z-50 p-4">
              <div className="flex flex-row justify-between items-center border-b-2 border-b-slate-300 pb-2">
                <h1 className="text-xl">New Video</h1>
                <svg
                  onClick={closePopUp}
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
              </div>
              <div className="flex flex-row w-full mt-2">
                <div className="flex flex-col w-full  lg:w-1/2">
                  <div className="flex flex-row">
                    <img
                      src="../../../image/no-image.jpeg"
                      className="w-full lg:w-[200px] h-[100px] lg:h-[200px] object-cover object-center rounded"
                    />
                    <div className="flex flex-col w-1/2 ml-2 p-2 justify-end space-y-2">
                      <h1 className="font-bold text-xl">Thumbnail</h1>
                      <p>There is no Picture</p>
                      <button className="flex justify-center items-center p-2 rounded-lg bg-white border-[1px] border-slate-400 shadow-sm w-full">
                        Choose File
                      </button>
                    </div>
                  </div>
                  <div className="flex mt-2 space-y-1 flex-col w-full">
                    <label className="font-bold">Title</label>
                    <input
                      placeholder="Category Name"
                      className="w-full border-2 border-slate-300 p-2 rounded-md"
                    ></input>
                  </div>
                  <div className="flex mt-2 space-y-1 flex-col w-full">
                    <label className="font-bold">Description</label>
                    <textarea
                      placeholder="Description"
                      className="border-slate-300 border-2 rounded-md p-2"
                      rows={5}
                      cols={30}
                    ></textarea>
                    <p className="text-slate-400 text-xs">0/400 characters</p>
                  </div>
                </div>
                <div className="flex flex-col w-full p-4 space-y-2 lg:w-1/2">
                    <video className="w-full h-[100px] lg:h-auto" src="../../../video/videoplayback.mp4"></video>
                    <button className="flex justify-center items-center p-2 rounded-lg bg-white border-[1px] border-slate-400 shadow-sm w-full">
                        Choose File
                    </button>
                </div>
              </div>
                <div className="flex justify-end mr-1">
                    <button className="flex justify-center items-center p-2 rounded-lg bg-primary border-[1px] lg:w-1/4 text-white shadow-sm w-full">
                        Upload Video
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoButton;
