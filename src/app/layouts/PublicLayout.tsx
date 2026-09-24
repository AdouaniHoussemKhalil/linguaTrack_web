import Navbar from "@/components/header/Navbar";

interface Props {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-2">
      <Navbar />
      <main className="flex-1 px-4 py-8 md:px-12">{children}</main>
    </div>
  );
};

export default PublicLayout;
