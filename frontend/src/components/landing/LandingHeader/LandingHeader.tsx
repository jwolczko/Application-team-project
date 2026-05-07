import { useNavigate } from 'react-router-dom';
import './LandingHeader.css';

type LandingHeaderProps = {
  onOpenLogin: () => void;
};

export function LandingHeader({ onOpenLogin }: LandingHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="landing-header">
      <div className="landing-header__inner">

        {/* LEFT */}
        <div className="landing-header__brand">
          <div className="landing-header__logo" />
          <span>Calisia</span>
        </div>

        {/* RIGHT */}
        <div className="landing-header__actions">
          <button className="landing-header__link">
            Kontakt
          </button>

          <button
            className="landing-header__outline-btn"
            onClick={() => navigate('/create-account')}
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