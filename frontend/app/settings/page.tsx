"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeIcon, ShieldCheckIcon } from "@/components/ui/icons";

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading: authLoading, logout, refreshUser } = useAuth();

  // Profile form state
  const [editedDisplayName, setEditedDisplayName] = React.useState<string | null>(null);
  const displayName = editedDisplayName ?? (user?.displayName || "");
  const [profileSaving, setProfileSaving] = React.useState(false);
  const [profileSuccess, setProfileSuccess] = React.useState<string | null>(null);
  const [profileError, setProfileError] = React.useState<string | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPass, setShowCurrentPass] = React.useState(false);
  const [showNewPass, setShowNewPass] = React.useState(false);
  const [passwordSaving, setPasswordSaving] = React.useState(false);
  const [passwordSuccess, setPasswordSuccess] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    if (displayName.trim().length < 2) {
      setProfileError("Display name must be at least 2 characters long.");
      return;
    }

    setProfileSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error || "Failed to update profile.");
      } else {
        setProfileSuccess("Account display name updated successfully.");
        setEditedDisplayName(null);
        await refreshUser();
      }
    } catch {
      setProfileError("Network error occurred while updating profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/users/me/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Failed to change password.");
      } else {
        setPasswordSuccess("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordError("Network error occurred while changing password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  // State 1: Guest / Unauthenticated Notice
  if (!authLoading && !isAuthenticated) {
    return (
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="max-w-md w-full border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]/95 text-slate-900 dark:text-white shadow-xl text-center">
          <CardHeader className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheckIcon size={24} className="text-teal-600 dark:text-teal-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Account Settings</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-sm">
              Sign in to manage your account details, security preferences, and report history.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/login" className="block w-full">
              <Button variant="primary" size="md" className="w-full font-bold">
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="block w-full">
              <Button variant="outline" size="md" className="w-full">
                Create an Account
              </Button>
            </Link>
            <div className="pt-2">
              <Link href="/tests" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline underline-offset-4">
                Continue browsing tests as Guest
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your personal information, credentials, and active session.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Account Information */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]/90 text-slate-900 dark:text-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</CardTitle>
            <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
              Update your display name and view your account identity.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
              {profileSuccess && (
                <div role="status" className="p-3 rounded-xl bg-teal-50 dark:bg-cyan-950/80 border border-teal-200 dark:border-cyan-800 text-teal-900 dark:text-cyan-200 text-xs">
                  {profileSuccess}
                </div>
              )}
              {profileError && (
                <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
                  {profileError}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="settings-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Display Name
                </label>
                <input
                  id="settings-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setEditedDisplayName(e.target.value)}
                  placeholder="e.g. Alex Smith"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-500">
                  Email addresses are permanently tied to screening records and cannot be changed.
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={profileSaving}
                className="font-semibold text-xs shadow-sm"
              >
                {profileSaving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Section 2: Password Management */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]/90 text-slate-900 dark:text-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Password &amp; Security</CardTitle>
            <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
              Change your password to maintain account security.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              {passwordSuccess && (
                <div role="status" className="p-3 rounded-xl bg-teal-50 dark:bg-cyan-950/80 border border-teal-200 dark:border-cyan-800 text-teal-900 dark:text-cyan-200 text-xs">
                  {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
                  {passwordError}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="current-pass" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="current-pass"
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    autoComplete="current-password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    aria-label={showCurrentPass ? "Hide current password" : "Show current password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                  >
                    <EyeIcon size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="new-pass" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-pass"
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    autoComplete="new-password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    aria-label={showNewPass ? "Hide new password" : "Show new password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                  >
                    <EyeIcon size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirm-pass" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <input
                  id="confirm-pass"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={passwordSaving}
                className="font-semibold text-xs shadow-sm"
              >
                {passwordSaving ? "Updating Password..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Section 3: Session & Sign Out */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]/90 text-slate-900 dark:text-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Active Session</CardTitle>
            <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
              Review your signed-in state or sign out of your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Signed in as {user?.displayName}
                </span>
                <span className="text-slate-600 dark:text-slate-400 mt-0.5 block">{user?.email}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900 self-start sm:self-center"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
