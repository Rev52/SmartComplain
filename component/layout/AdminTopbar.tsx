"use client";

import { Profile } from "@/types/user";

interface AdminTopbarProps {
  profile: Profile | null;
}

function getInitial(name?: string | null): string {
  return name?.charAt(0)?.toUpperCase() ?? "A";
}

export default function AdminTopbar({ profile }: AdminTopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-divider" />

        <div className="topbar-avatar">{getInitial(profile?.full_name)}</div>
        <div className="topbar-text">
          <span className="topbar-name">{profile?.full_name ?? "Admin"}</span>
          <span className="topbar-role">Administrator</span>
        </div>

        <div className="topbar-divider" />
      </div>
    </header>
  );
}
