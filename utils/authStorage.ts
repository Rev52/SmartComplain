export interface UserProfile {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  password?: string;
  alamat: string;
  foto: string | null;
}

const USERS_KEY = "smartcomplain_users";
const SESSION_KEY = "smartcomplain_currentUser";

export const getAllUsers = (): UserProfile[] => {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: UserProfile[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

export const getCurrentUser = (): UserProfile | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(SESSION_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: UserProfile | null) => {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    window.dispatchEvent(new Event("userProfileUpdated"));
  }
};

export const registerUser = (userData: Partial<UserProfile>): { success: boolean; message: string } => {
  const users = getAllUsers();
  
  if (users.find(u => u.email === userData.email)) {
    return { success: false, message: "Email sudah terdaftar!" };
  }

  const newUser: UserProfile = {
    id: `USER-${Date.now()}`,
    nama: userData.nama || "",
    email: userData.email || "",
    telepon: userData.telepon || "",
    password: userData.password || "",
    alamat: "",
    foto: null
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, message: "Registrasi berhasil!" };
};

export const loginUser = (email: string, password: string): { success: boolean; message: string } => {
  const users = getAllUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    setCurrentUser(user);
    return { success: true, message: "Login berhasil!" };
  }

  return { success: false, message: "Email atau password salah!" };
};

export const logoutUser = () => {
  setCurrentUser(null);
};

export const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const updatedUser = { ...currentUser, ...updates };
  
  // Update in session
  setCurrentUser(updatedUser);
  
  // Update in users array
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === currentUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
  }
};
