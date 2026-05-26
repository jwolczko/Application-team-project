import './LandingHeader.css';

type LandingHeaderProps = {
  onOpenLogin: () => void;
  onOpenCreateAccount: () => void;
};

export function LandingHeader({ onOpenLogin, onOpenCreateAccount }: LandingHeaderProps) {
  return (
    <header className="landing-header">
      <div className="landing-header__inner">

        {/* LEFT */}
        <div className="landing-header__brand">
          <img className="landing-header__logo" src="/calisia_logo_transparent.png" alt="" aria-hidden="true" />
          <span>Calisia</span>
        </div>

        {/* RIGHT */}
        <div className="landing-header__actions">
          <button className="landing-header__link">
            Kontakt
          </button>

          <button
            className="landing-header__outline-btn"
            onClick={onOpenCreateAccount}
          >
            Załóż konto
          </button>

          <button
            className="landing-header__primary-btn"
            onClick={onOpenLogin}
          >
            Zaloguj
          </button>
        </div>

      </div>
    </header>
  );
}
