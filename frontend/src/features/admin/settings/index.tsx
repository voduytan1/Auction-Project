import { ConfigSettings } from "./components/ConfigSettings";

function Settings() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Cài đặt hệ thống</h1>
      <ConfigSettings />
    </div>
  );
}

export default Settings;
