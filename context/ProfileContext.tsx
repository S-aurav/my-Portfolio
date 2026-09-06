"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProfileEntry, publicApi } from "@/lib/api";

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

  // Sync state if initialData is provided/updated from server
  useEffect(() => {
    if (initialData) {
      setProfile(initialData);
      try {
        localStorage.setItem("cached_profile", JSON.stringify(initialData));
      } catch {}
    } else {
      // If server didn't have data, try loading immediately from localStorage
      try {
        const cached = localStorage.getItem("cached_profile");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            setProfile(parsed);
          }
        }
      } catch {}
    }
  }, [initialData]);

  // Client-side background fetch: ensures latest profile is always loaded
  // even if the server-rendered HTML was statically generated with fallbacks
  useEffect(() => {
    let mounted = true;
    publicApi.getProfile()
      .then((res) => {
        if (mounted && res?.success && res?.data) {
          setProfile(res.data);
          try {
            localStorage.setItem("cached_profile", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(() => {
        if (mounted) {
          try {
            const cached = localStorage.getItem("cached_profile");
            if (cached) {
              const parsed = JSON.parse(cached);
              if (parsed && typeof parsed === "object") {
                setProfile(parsed);
              }
            }
          } catch {}
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

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

