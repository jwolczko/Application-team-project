import { useState } from 'react';
import { InfoPopup } from '../../../shared/ui/InfoPopup/InfoPopup';
import './LandingHero.css';

export function LandingHero() {
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);

  return (
    <>
      <section className="landing">

        {/* HERO */}
        <div className="landing__hero">
          <div className="landing__hero-overlay" />

          <div className="landing__hero-content">
            <h1 className="landing__brand">Calisia</h1>
            <p className="landing__tagline">
              Tam gdzie pieniądze znajdują spokój.
            </p>

            <div className="landing__hero-actions">
  <button className="landing__btn landing__btn--secondary">
    Oferta
  </button>

  <button className="landing__btn landing__btn--primary">
    Otwórz konto
  </button>
</div>
          </div>
        </div>

        {/* CARDS */}
        <div className="landing__cards">
          <div className="landing__card">
            <h3>Konto Premium</h3>
            <p>Pełna kontrola nad finansami w spokojnym rytmie.</p>
          </div>

          <div className="landing__card">
            <h3>Inwestycje</h3>
            <p>Długoterminowe strategie budowania kapitału.</p>
          </div>

          <div className="landing__card">
            <h3>Private Banking</h3>
            <p>Indywidualne podejście i dyskrecja.</p>
          </div>

          <div className="landing__card">
            <h3>Oszczędności</h3>
            <p>Bezpieczne miejsce dla Twoich środków.</p>
          </div>
        </div>

      </section>

      {isInfoPopupOpen && (
        <InfoPopup
          message="Funkcjonalność nie jest jeszcze zaimplementowana"
          onClose={() => setIsInfoPopupOpen(false)}
        />
      )}
    </>
  );
}