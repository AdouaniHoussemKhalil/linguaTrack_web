import { useState } from "react";
import { DashboardLayout } from "@quickadui/shell";
import Navbar from "@/components/header/Navbar";
import Sidebar from "@/components/side/Sidebar";
import { useSignOut } from "@/features/auth/hooks/UseAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface Props {
  children: React.ReactNode;
}

const SMALL_SCREEN_QUERY = "(max-width: 900px)";

const PrivateLayout = ({ children }: Props) => {
  const signOut = useSignOut();
  const isSmallScreen = useMediaQuery(SMALL_SCREEN_QUERY);

  // Replié par défaut sur petit écran ; l'utilisateur peut ensuite basculer
  // librement, jusqu'au prochain franchissement du point de rupture.
  const [collapsed, setCollapsed] = useState(isSmallScreen);
  const [wasSmallScreen, setWasSmallScreen] = useState(isSmallScreen);
  if (wasSmallScreen !== isSmallScreen) {
    setWasSmallScreen(isSmallScreen);
    setCollapsed(isSmallScreen);
  }

  return (
    <DashboardLayout
      className="bg-neutral-2 font-[Inter,'Helvetica_Neue',Arial,sans-serif]"
      navbar={<Navbar showSidebarTrigger onLogout={signOut} />}
      sidebar={<Sidebar />}
      sidebarCollapsed={collapsed}
      onSidebarCollapsedChange={setCollapsed}
    >
      <div className="px-2 md:px-6">{children}</div>
    </DashboardLayout>
  );
};

export default PrivateLayout;
