import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ModalHeader } from "../../../../Modal/ModalComponent";
import { MdAdd, MdCheck, MdClose } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../../../../Button/Button";
import { FaCircleNotch } from "react-icons/fa";
import DropdownSelect from "../../../../Dropdown/DropdownSelect";
import { selectUnitManagement } from "../../../../../redux/features/building-management/unit/unitReducers";
import {
  getUsersProperty,
  selectUserPropertyManagement,
} from "../../../../../redux/features/building-management/users/propertyUserReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { SearchInput } from "../../../SearchInput";
import { toast } from "react-toastify";

type Options = {
  value?: any;
  label?: any;
};

type Props = {
  items?: any;
  setItems: Dispatch<SetStateAction<any | any[]>>;
  token?: any;
  isOpen?: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  getData: () => void;
};

type FormValues = {
  id?: number | any;
  firstName?: string | any;
  lastName?: string | any;
  email?: string | any;
};

type UserProps = {
  user: FormValues;
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

export default function UsersForm({
  isCloseModal,
  items,
  setItems,
  isUpdate,
  token,
}: Props) {
  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectUnitManagement);
  const { userProperties } = useAppSelector(selectUserPropertyManagement);

  // user-data
  const [userData, setUserData] = useState<any[]>([]);
  const [userOption, setUserOption] = useState<Options[]>([]);
  const [users, setUsers] = useState<Options | any>(null);
  const [userSelected, setUserSelected] = useState<any | any[]>(null);

  // get-user
  const filterUser = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: "user.firstName",
      order: "DESC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token)
      dispatch(getUsersProperty({ token, params: filterUser.queryObject }));
  }, [token, filterUser]);

  useEffect(() => {
    let arr: Options[] = [];
    let { data } = userProperties;
    if (data || data?.length > 0) {
      data?.map((item: any) => {
        arr.push({
          ...item?.user,
          value: item?.user?.id,
          label: `${item?.user?.firstName} ${item?.user?.lastName}`,
        });
      });
    }
    setUserData(arr);
    setUserOption(arr);
  }, [userProperties]);

  const onAddUser = (user: any) => {
    if (!user) return;
    let dataUsers =
      !userSelected || userSelected?.length == 0
        ? [user]
        : [...userSelected, user];
    let filterOpt = userOption?.filter((e) => e?.value != user?.id);

    const filterUser = Array.from(new Set(dataUsers.map((a) => a.id))).map(
      (id) => {
        return dataUsers.find((a) => a.id === id);
      }
    );

    setUserSelected(filterUser);
    setItems(filterUser);
    setUserOption(filterOpt);
    setUsers(null);
  };

  const onDeleteHandler = (value: any) => {
    let filter = userSelected?.filter((e: any) => e?.id != value?.id);

    setUserSelected(filter);
    setItems(filter);
    setUserOption([...userOption, value]);
  };

  useEffect(() => {
    let users: any[] = [];
    if (items?.length > 0) {
      items.map((user: any) => {
        users.push(user);
      });
      setUserSelected(users);
    }
  }, [items]);

  useEffect(() => {
    let dataUser: any[] = [];
    if (userData?.length > 0) {
      userData?.forEach((e) => {
        dataUser.push(e);
      });
      let filterUser = dataUser.filter(
        (e) => !userSelected?.find((user: any) => e.id === user?.id)
      );
      setUserOption(filterUser);
    }
  }, [userData, userSelected]);

  const UserComponent = (props: UserProps) => {
    const { user } = props;
    return (
      <div className="w-full flex gap-2 border-2 border-gray rounded-lg px-4 py-2">
        <div className="flex items-center gap-1">
          <div>{user.firstName}</div>
          <div>{user.lastName}</div>
        </div>
        <button
          type="button"
          onClick={() => onDeleteHandler(user)}
          className="inline-flex items-center ml-auto text-gray-5 focus:outline-none focus:ring-1 focus:ring-primary rounded-lg p-1 border border-gray">
          <MdClose className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <Fragment>
      <ModalHeader
        onClick={isCloseModal}
        isClose={true}
        className="p-2 bg-white rounded-t-xl border-b-2 border-gray">
        <Fragment>
          <div
            className={`w-full flex flex-col gap-1 px-2 ${
              userSelected?.id ? "" : ""
            }`}>
            <h3 className="text-lg font-semibold">
              {isUpdate ? "Edit" : "Add"} User
            </h3>
            <p className="text-gray-5 text-sm">Fill your user information.</p>
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
                  value={users}
                  onChange={setUsers}
                  error=""
                  className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                  classNamePrefix=""
                  formatOptionLabel={""}
                  instanceId="user"
                  isDisabled={false}
                  isMulti={false}
                  placeholder="Select User"
                  options={userOption}
                  icon=""
                />
              </div>
              <button
                type="button"
                onClick={() => onAddUser(users)}
                className="w-[15%] bg-primary focus:outline-none text-white p-1 rounded-lg inline-flex gap-1 items-center justify-center text-xs">
                <MdAdd className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* user data */}
          <div className="w-full max-h-[250px] flex flex-col gap-2 overflow-x-hidden overflow-y-auto">
            {userSelected?.length > 0 ? (
              userSelected?.map((item: any, idx: any) => {
                return <UserComponent key={idx} user={item} />;
              })
            ) : (
              <div className="px-4 text-sm text-gray-5">
                There is no user added
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex gap-2 justify-end p-4 border-t-2 border-gray">
          <button
            type="button"
            className="rounded-md text-sm border py-2 px-4 border-gray shadow-card"
            onClick={isCloseModal}>
            <span className="font-semibold">Close</span>
          </button>
        </div>
      </div>
    </Fragment>
  );
}
