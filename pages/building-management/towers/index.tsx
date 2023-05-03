import React, { Fragment, useEffect, useMemo, useState } from 'react'
import DefaultLayout from '../../../components/Layouts/DefaultLayouts'
import SidebarBM from '../../../components/Layouts/Sidebar/Building-Management';
import Button from '../../../components/Button/Button';
import { MdAdd, MdArrowDropDown, MdArrowRightAlt, MdCleaningServices, MdEdit, MdLocalHotel, MdLocationOn, MdMoreHoriz } from 'react-icons/md';
import Cards from '../../../components/Cards/Cards';
import DropdownDefault from '../../../components/Dropdown/DropdownDefault';
import CardTower from '../../../components/BM/Towers/CardTower';
import Modal from '../../../components/Modal';
import { ModalFooter, ModalHeader } from '../../../components/Modal/ModalComponent';
import { useInput, useSelect } from '../../../utils/useHooks/useHooks';
import DropdownSelect from '../../../components/Dropdown/DropdownSelect';
import { validation } from '../../../utils/useHooks/validation';

type Props = {}

const customStylesSelect = {
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: 'none',
  }),
  dropdownIndicator: (provided: any) => {
    return ({
      ...provided,
      color: '#5F59F7',
      // padding: 0,
      // paddingTop: 0,
      // paddingBottom: 0,
      // paddingLeft: 0,
      // paddingRight: 0,
    })
  },
  clearIndicator: (provided: any) => {
    return ({
      ...provided,
      color: '#5F59F7',
      // padding: 0,
      // paddingTop: 0,
      // paddingBottom: 0,
      // paddingLeft: 0,
      // paddingRight: 0,
    })
  },
  singleValue: (provided: any) => {
    return ({
      ...provided,
      color: '#5F59F7',
    })
  },
  control: (provided: any, state: any) => {
    console.log(provided, "control")
    return ({
      ...provided,
      background: "#F5F9FD",
      padding: '.5rem',
      borderColor: state.isFocused ? "#5F59F7" : "#5F59F7",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "gray" : "#5F59F7",
        borderColor: state.isFocused ? "gray" : "#5F59F7"
      },
      minHeight: 38
    })
  },
  menuList: (provided: any) => ({
    ...provided,
    padding: 0
  })
};

const Towers = (props: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // modal
  const [isOpenTower, setIsOpenTower] = useState(false);
  const [isOpenAmenities, setIsOpenAmenities] = useState(false);
  const [isOpenFacilities, setIsOpenFacilities] = useState(false);

  interface Option {
    label: string;
    value: string;
  }
  
  const genderOpt: Option[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Any', value: 'any' },
  ];
  
  let data = "ridho@gmail.com"
  const [submitting, setSubmitting] = useState(false);
  const { value: email, reset: resetEmail, error: emailError, onChange: onEmailChange } = useInput({ 
    defaultValue: "", 
    validate: (value) => validation?.email(value),
});
  const { value: password, reset: resetPassword, error: passwordError, onChange: onPasswordChange } = useInput({
    defaultValue: "",
    validate: (value) => validation?.password(value),
  });
  // @ts-ignore
  const { value: gender, error: genderError, onChange: onGenderChange, reset: resetGender } = useSelect<Option>({
    defaultValue: null,
    validate: (value) => validation.select(value),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      console.log({ email, password, gender }, 'event form')
    }
  };

  const handleReset = () => {
    resetEmail()
    resetPassword()
    resetGender()
  }

  useEffect(() => {
    if (emailError || passwordError || genderError) {
      setSubmitting(false);
      // perform submission logic
    } else {
      setSubmitting(true)
    }
  }, [emailError, passwordError, genderError]);

  return (
    <DefaultLayout
      title="Colony"
      header="Building Management"
      head="Tower Management"
      logo="../image/logo/logo-icon.svg"
      description=""
      images="../image/logo/building-logo.svg"
      userDefault="../image/user/user-01.png"
    >
      <div className='absolute inset-0 mt-20 bg-boxdark flex text-white'>
        <SidebarBM sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className=" w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className='shadow-bottom sticky bg-white top-0 z-9 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between py-6 mb-3 gap-2'>
            <div className='w-full flex items-center justify-between py-3'>
              <button
                aria-controls='sidebar'
                aria-expanded={sidebarOpen}
                onClick={(e) => {
                  e.stopPropagation()
                  setSidebarOpen(!sidebarOpen)
                }}
                className='rounded-sm border p-1.5 shadow-sm border-strokedark bg-boxdark lg:hidden'
              >
                <MdArrowRightAlt className={`w-5 h-5 delay-700 ease-in-out ${sidebarOpen ? "rotate-180" : ""}`} />
              </button>
              <h3 className='w-full lg:max-w-max text-center text-2xl font-semibold text-graydark'>Tower Management</h3>
            </div>
            <div className='w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto'>
              <Button
                type="button"
                className='rounded-lg text-sm font-semibold py-3'
                onClick={() => setIsOpenAmenities(true)}
                variant='primary-outline'
                key={'1'}
              >
                <span className='hidden lg:inline-block'>Amenities</span>
                <MdLocalHotel className='w-4 h-4' />
              </Button>

              <Button
                type="button"
                className='rounded-lg text-sm font-semibold py-3'
                onClick={() => setIsOpenFacilities(true)}
                variant='primary-outline'
                key={'2'}
              >
                <span className='hidden lg:inline-block'>Facilities</span>
                <MdCleaningServices className='w-4 h-4' />
              </Button>

              <Button
                type="button"
                className='rounded-lg text-sm font-semibold py-3'
                onClick={() => setIsOpenTower(true)}
                variant='primary'
              >
                <span className='hidden lg:inline-block'>New Tower</span>
                <MdAdd className='w-4 h-4' />
              </Button>
            </div>
          </div>

          <main className='relative tracking-wide text-left text-boxdark-2'>
            <div className="w-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6">
              {/* cards */}
              <CardTower items={""} />

              <CardTower items={""} />

              <CardTower items={""} />
            </div>
          </main>
        </div>
      </div>

      {/* modal tower*/}
      <Modal
        isOpen={isOpenTower}
        onClose={() => setIsOpenTower(false)}
        size='small'
      >
        <ModalHeader onClick={() => setIsOpenTower(false)} isClose={true} className="sticky top-0 p-4 bg-white border-b-2 border-gray mb-3">
          <div className='flex flex-col'>
            <h3 className='text-lg font-semibold'>Add/Edit Tower</h3>
            <p className='text-gray-4'>Fill your tower information.</p>
          </div>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <div className='mb-4 px-4'>
            <label className='mb-2.5 block font-medium text-black dark:text-white'>
              Email
            </label>
            <div className='relative'>
              <input
                type='text'
                placeholder='Enter your email'
                className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                value={email}
                onChange={onEmailChange}
              />

              <span className='absolute right-4 top-4'>
                <svg
                  className='fill-current'
                  width='22'
                  height='22'
                  viewBox='0 0 22 22'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g opacity='0.5'>
                    <path
                      d='M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z'
                      fill=''
                    />
                  </g>
                </svg>
              </span>

              {emailError && <div className='mt-1 text-danger'>{emailError}</div>}
            </div>
          </div>

          <div className='mb-4 px-4'>
            <label className='mb-2.5 block font-medium text-black dark:text-white'>
              Password
            </label>
            <div className='relative'>
              <input
                type='text'
                placeholder='6+ Characters, 1 Capital letter'
                className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                value={password}
                onChange={onPasswordChange}
              />

              <span className='absolute right-4 top-4'>
                <svg
                  className='fill-current'
                  width='22'
                  height='22'
                  viewBox='0 0 22 22'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g opacity='0.5'>
                    <path
                      d='M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z'
                      fill=''
                    />
                    <path
                      d='M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z'
                      fill=''
                    />
                  </g>
                </svg>
              </span>

              {passwordError && <div className='mt-1 text-danger'>{passwordError}</div>}
            </div>
          </div>

          <div className='mb-4 px-4'>
            <label className='mb-2.5 block font-medium text-black dark:text-white'>
              Gender
            </label>
            <div className='relative'>
              {/* <div className='relative z-20 bg-transparent dark:bg-form-input'>
                <select value={gender} onChange={onGenderChange} className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'>
                  {options?.map((item, idx) => {
                    return(<option className={`${!item.value || item.value == "" ? "bg-black" : ""}`} key={idx} value={item?.value}>{item?.label}</option>)
                  })}
                </select>
                <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2'>
                  <svg
                    className='fill-current'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <g opacity='0.8'>
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z'
                        fill=''
                      ></path>
                    </g>
                  </svg>
                </span>
              </div> */}

              <DropdownSelect
                customStyles={customStylesSelect}
                value={gender}
                onChange={onGenderChange}
                error=""
                className='text-sm font-normal'
                classNamePrefix=""
                formatOptionLabel=""
                instanceId='1'
                isDisabled={false}
                isMulti={false}
                isSearch=""
                placeholder='Unit'
                options={genderOpt}
              />

              {genderError && <div className='mt-1 text-danger'>{genderError}</div>}
            </div>
          </div>

          <ModalFooter
            className='sticky bottom-0 bg-white p-4 border-t-2 border-gray mt-3'
            isClose={true}
            onClick={() => setIsOpenTower(false)}
          >
            <Button
              type="submit"
              variant="primary"
              className="rounded-md text-sm"
              onClick={handleSubmit}
              disabled={!submitting}
            >
              Submit
            </Button>

            <Button
              type="buuton"
              variant="danger"
              className="rounded-md text-sm"
              onClick={handleReset}
            >
              Reset
            </Button>
          </ModalFooter>
        </form>

      </Modal>

      {/* modal Facilities*/}
      <Modal
        isOpen={isOpenFacilities}
        onClose={() => setIsOpenFacilities(false)}
        size=''
      >
        <ModalHeader isClose={true} className="sticky top-0 p-4 bg-white border-b-2 border-gray mb-3">
          <h3 className='text-lg font-semibold'>New Facilities</h3>
        </ModalHeader>
        <div className="w-full px-6">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit, distinctio ullam. Cupiditate, nostrum eligendi voluptatibus beatae laboriosam odit facilis ea nihil corporis id dolorum totam, expedita, repellendus nemo natus eius sed qui deleniti molestias maiores ipsam distinctio aliquam? Quaerat reprehenderit, quae in fugit odit mollitia molestias qui possimus nostrum rem ipsa consequatur corrupti sed nemo repellat optio debitis architecto eligendi. Pariatur sed blanditiis dicta aspernatur, cumque sunt, eligendi obcaecati magni eaque tempore dolorem possimus tenetur. Aut distinctio veniam rerum commodi laboriosam laborum reprehenderit earum asperiores praesentium molestiae vel consequuntur dolore, dolorum nihil quisquam? Similique assumenda nostrum eius esse qui nihil!
        </div>
        <ModalFooter
          className='sticky bottom-0 bg-white p-4 border-t-2 border-gray mt-3'
          isClose={true}
        ></ModalFooter>
      </Modal>

      {/* modal Amenities*/}
      <Modal
        isOpen={isOpenAmenities}
        onClose={() => setIsOpenAmenities(false)}
        size=''
      >
        <ModalHeader isClose={true} className="sticky top-0 p-4 bg-white border-b-2 border-gray mb-3">
          <h3 className='text-lg font-semibold'>New Amenities</h3>
        </ModalHeader>
        <div className="w-full px-6">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit, distinctio ullam. Cupiditate, nostrum eligendi voluptatibus beatae laboriosam odit facilis ea nihil corporis id dolorum totam, expedita, repellendus nemo natus eius sed qui deleniti molestias maiores ipsam distinctio aliquam? Quaerat reprehenderit, quae in fugit odit mollitia molestias qui possimus nostrum rem ipsa consequatur corrupti sed nemo repellat optio debitis architecto eligendi. Pariatur sed blanditiis dicta aspernatur, cumque sunt, eligendi obcaecati magni eaque tempore dolorem possimus tenetur. Aut distinctio veniam rerum commodi laboriosam laborum reprehenderit earum asperiores praesentium molestiae vel consequuntur dolore, dolorum nihil quisquam? Similique assumenda nostrum eius esse qui nihil!
        </div>
        <ModalFooter
          className='sticky bottom-0 bg-white p-4 border-t-2 border-gray mt-3'
          isClose={true}
        ></ModalFooter>
      </Modal>
    </DefaultLayout>
  )
}

export default Towers;