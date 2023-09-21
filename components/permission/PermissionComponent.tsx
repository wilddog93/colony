import React from "react";
import { usePermission } from "react-use";

const PermissionComponent: React.FC = () => {
  const notificationPermission = usePermission({ name: "notifications" });
  const cameraPermission = usePermission({ name: "camera" });
  const locationPermission = usePermission({ name: "geolocation" });
  const microphonePermission = usePermission({ name: "microphone" });
  const midiPermission = usePermission({ name: "midi" });

  return (
    <div>
      <h2>Permissions:</h2>
      <p>Notification permission: {notificationPermission}</p>
      <p>Camera permission: {cameraPermission}</p>
      <p>Location permission: {locationPermission}</p>
      <p>Microphone permission: {microphonePermission}</p>
      <p>Midi permission: {midiPermission}</p>
    </div>
  );
};

export default PermissionComponent;
