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
      <div className="flex w-full max-w-[1400px] flex-col-reverse gap-3 md:h-[90vh] md:flex-row md:gap-5">
        <section className="flex w-full flex-col overflow-y-auto rounded-xl border border-neutral-6 bg-neutral-1 shadow-sm md:w-[400px] md:shrink-0 lg:w-[480px]">
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

        {/* Bandeau compact sur mobile, panneau à côté du formulaire à partir de md */}
        <div className="flex h-40 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-(--lt-frame) p-2 shadow-sm sm:h-56 md:h-auto md:flex-1 md:p-0">
          <img
            src={signInImg}
            alt=""
            className="h-full w-full rounded-tl-[40px] rounded-tr-[8px] rounded-br-[40px] rounded-bl-[8px] object-cover md:h-[95%] md:object-[70%_50%] lg:object-center md:w-[95%] md:rounded-tl-[100px] md:rounded-tr-[10px] md:rounded-br-[100px] md:rounded-bl-[10px]"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
