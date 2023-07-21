import { useState } from "react";
import { Switch } from "@headlessui/react";

function ToggleSwitch() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex flex-row w-full items-center mx-1 my-1 capitalize">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? "bg-[#5F59F7]" : "bg-slate-300"
        } relative inline-flex h-6 w-11 items-center rounded-full`}>
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${
            enabled ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
      {!enabled ? (
        <span className="ml-2">Inactive</span>
      ) : (
        <span className="ml-2">Active</span>
      )}
    </div>
  );
}

export default ToggleSwitch;
