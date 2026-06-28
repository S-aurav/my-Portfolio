"use client";

import React, { createContext, useContext, useState } from "react";
import { ProfileEntry } from "@/lib/api";

type ProfileContextType = {
  profile: ProfileEntry | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileEntry | null>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: ProfileEntry | null;
}) {
  const [profile, setProfile] = useState<ProfileEntry | null>(initialData);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
