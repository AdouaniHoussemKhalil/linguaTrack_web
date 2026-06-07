import { colors } from "@/components/common/Colors";
import Navbar from "@/components/header/Navbar";
import Sidebar from "@/components/side/Sidebar";
import { style } from "typestyle";

interface Props {
  children: React.ReactNode;
}

const PrivateLayout = ({ children }: Props) => {
  return (
    <div className={layoutStyle}>
      <Navbar />

      <div className={bodyStyle}>
        <Sidebar />

        <main className={contentStyle}>{children}</main>
      </div>
    </div>
  );
};

export default PrivateLayout;

const layoutStyle = style({
  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
});

const bodyStyle = style({
  display: "flex",
  flex: 1,
});

const contentStyle = style({
  flex: 1,
  padding: "50px",
  backgroundColor: colors.mywhite,
});
