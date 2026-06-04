import { useState } from 'react';
import './LandingHero.css';

type LandingHeroProps = {
  onOpenCreateAccount: () => void;
};

export function LandingHero({ onOpenCreateAccount }: LandingHeroProps) {
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

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
              <button className="landing__btn landing__btn--secondary" onClick={() => setIsOfferModalOpen(true)}>
                Oferta
              </button>

              <button className="landing__btn landing__btn--primary" onClick={onOpenCreateAccount}>
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

      {isOfferModalOpen && (
        <div
          className="offer-modal__overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Oferta banku Calisia"
          onClick={() => setIsOfferModalOpen(false)}
        >
          <article className="offer-modal" onClick={(event) => event.stopPropagation()}>
            <button
              className="offer-modal__close"
              type="button"
              aria-label="Zamknij ofertę"
              onClick={() => setIsOfferModalOpen(false)}
            >
              x
            </button>

            <div className="offer-modal__hero">
              <img src="/herobg.jpeg" alt="" aria-hidden="true" />
              <div className="offer-modal__hero-copy">
                <span>Oferta Calisia</span>
                <h2>Bankowość, która zostawia miejsce na spokój.</h2>
              </div>
            </div>

            <div className="offer-modal__body">
              <section className="offer-modal__article">
                <p className="offer-modal__lead">
                  Calisia łączy codzienne konto, wygodne płatności i narzędzia do oszczędzania w jednym, czytelnym miejscu. Oferta została zaprojektowana dla osób, które chcą widzieć pełny obraz finansów bez nadmiaru formalności.
                </p>

                <h3>Konto z jasnym rytmem dnia</h3>
                <p>
                  Konto osobiste pozwala szybko zarządzać przelewami, kontrolować saldo i otwierać kolejne produkty wtedy, gdy naprawdę są potrzebne. Wariant Prestige dodaje wyższy poziom obsługi oraz więcej przestrzeni dla większych planów.
                </p>

                <h3>Oszczędzanie i finansowanie</h3>
                <p>
                  Produkty oszczędnościowe pomagają odkładać środki w przewidywalny sposób, a kredyt gotówkowy może wesprzeć większe wydatki bez opuszczania panelu bankowości. Historia operacji i oś czasu ułatwiają sprawdzenie, co wydarzyło się na rachunku.
                </p>

                <h3>Bezpieczeństwo na pierwszym planie</h3>
                <p>
                  Sesja klienta jest chroniona automatycznym wylogowaniem, a najważniejsze działania wymagają świadomego potwierdzenia. Interfejs pokazuje najważniejsze informacje bez ukrywania ich za skomplikowanymi ekranami.
                </p>
              </section>

              <aside className="offer-modal__aside" aria-label="Najważniejsze elementy oferty">
                <div className="offer-modal__logo-tile">
                  <img src="/calisia_logo_transparent.png" alt="" aria-hidden="true" />
                  <strong>Calisia Premium</strong>
                  <span>Konto, karta i produkty dodatkowe w jednej aplikacji.</span>
                </div>

                <div className="offer-modal__feature">
                  <span>Konto</span>
                  <strong>0 PLN za prowadzenie w podstawowym wariancie</strong>
                </div>

                <div className="offer-modal__feature">
                  <span>Przelewy</span>
                  <strong>Wygodne operacje krajowe prosto z dashboardu</strong>
                </div>

                <div className="offer-modal__feature">
                  <span>Finanse</span>
                  <strong>Oś czasu, historia i produkty w jednym widoku</strong>
                </div>
              </aside>
            </div>
          </article>
        </div>
      )}
    </>
  );
}
