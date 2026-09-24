import { Link } from "react-router";
import ThemeModeToggle from "@/components/header/ThemeModeToggle";
import { routes } from "@/app/routes/routes";

const signInImg = "/signin.png";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <div data-qa-scope className="flex min-h-screen items-center justify-center bg-neutral-2 p-3 sm:p-5">
      <div className="flex w-full max-w-[1400px] gap-5 lg:h-[90vh]">
        <section className="flex w-full flex-col overflow-y-auto rounded-xl border border-neutral-6 bg-neutral-1 shadow-sm lg:w-[480px] lg:shrink-0">
          <header className="flex items-center justify-between gap-4 px-6 pt-6 sm:px-8">
            <Link to={routes.login} aria-label="LinguaTrack - Connexion">
              <img src="/linguatrack-logo.svg" alt="LinguaTrack" className="block size-10 object-contain" />
            </Link>
            <ThemeModeToggle />
          </header>

          <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </section>

        <div className="hidden flex-1 items-center justify-center overflow-hidden rounded-xl bg-(--lt-frame) shadow-sm lg:flex">
          <img
            src={signInImg}
            alt=""
            className="h-[95%] w-[95%] rounded-tl-[100px] rounded-tr-[10px] rounded-br-[100px] rounded-bl-[10px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
