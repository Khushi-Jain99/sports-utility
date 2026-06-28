import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { updateCredentials } from "../api/adminApi";

export default function Settings() {
  const [username, setUsername] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      newPassword &&
      newPassword.length < 10
    ) {
      toast.error(
        "Password must be at least 10 characters."
      );
      return;
    }

    if (
      newPassword &&
      newPassword !== confirmPassword
    ) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await updateCredentials({
        username,
        currentPassword,
        newPassword,
      });

      toast.success(
        "Credentials Updated Successfully"
      );

      setUsername("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          "Update Failed"
      );
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow-lg">

      <h1 className="mb-8 text-3xl font-bold">
        Change Admin Credentials
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Username */}

        <div>

          <label className="mb-2 block font-medium">
            New Username
          </label>

          <input
            type="text"
            placeholder="Leave empty if not changing"
            className="w-full rounded-lg border p-3"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

        </div>

        {/* Current Password */}

        <div>

          <label className="mb-2 block font-medium">
            Current Password
          </label>

          <div className="relative">

            <input
              type={
                showCurrent
                  ? "text"
                  : "password"
              }
              placeholder="Current Password"
              className="w-full rounded-lg border p-3 pr-12"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowCurrent(
                  !showCurrent
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showCurrent ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

        </div>

        {/* New Password */}

        <div>

          <label className="mb-2 block font-medium">
            New Password
          </label>

          <div className="relative">

            <input
              type={
                showNew
                  ? "text"
                  : "password"
              }
              placeholder="Leave empty if not changing"
              className="w-full rounded-lg border p-3 pr-12"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowNew(!showNew)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showNew ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          <p className="mt-2 text-sm text-gray-500">
            Minimum 10 characters.
          </p>

        </div>

        {/* Confirm Password */}

        <div>

          <label className="mb-2 block font-medium">
            Confirm New Password
          </label>

          <div className="relative">

            <input
              type={
                showConfirm
                  ? "text"
                  : "password"
              }
              placeholder="Confirm New Password"
              className="w-full rounded-lg border p-3 pr-12"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(
                  !showConfirm
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirm ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Save Changes
        </button>

      </form>

    </div>
  );
}