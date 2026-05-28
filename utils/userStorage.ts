import { UserProfile, getCurrentUser, updateCurrentUserProfile } from "./authStorage";

const DEFAULT_USER: UserProfile = {
  id: "DEFAULT_ADMIN",
  nama: "Revino Akhbar Susanto",
  email: "revino@mhs.unesa.ac.id",
  telepon: "0844-3724-8861",
  alamat: "Surabaya Barat",
  foto: null
};

// Re-export UserProfile for backwards compatibility if needed
export type { UserProfile };

export const getUserProfile = (): UserProfile => {
  if (typeof window === "undefined") return DEFAULT_USER;
  
  const currentUser = getCurrentUser();
  if (currentUser) {
    return currentUser;
  }
  
  return DEFAULT_USER; // Fallback jika belum login (walaupun seharusnya di-redirect)
};

export const saveUserProfile = (profile: Partial<UserProfile>) => {
  updateCurrentUserProfile(profile);
};
