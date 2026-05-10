# Backlog produktu Calisia - 7 sprintów

## Założenia

Calisia to aplikacja bankowości internetowej dla klientów indywidualnych. Backlog został przygotowany na podstawie istniejącego kodu: backendu .NET z CQRS, domeną klientów, rachunków i przelewów, API REST, osobnych baz write/read, projekcji dashboardu, frontendem React/Vite oraz kolekcją Bruno do testowania API.

Estymacja używa ciągu Fibonacciego w zakresie 0-13 SP: 0, 1, 2, 3, 5, 8, 13.

## Sprint 1 - Fundamenty architektury i środowiska

Cel sprintu: przygotować techniczny fundament aplikacji, aby zespół mógł rozwijać backend, frontend i bazy danych w jednym spójnym projekcie.

| ID | Historyjka | SP |
| --- | --- | ---: |
| S1-01 | Jako zespół chcemy przygotować solucję backendową z warstwami Api, Application, Domain, Infrastructure, Contracts i ReadModel, aby rozdzielić odpowiedzialności w systemie. | 8 |
| S1-02 | Jako zespół chcemy wdrożyć wzorzec CQRS dla komend i zapytań, aby oddzielić operacje zapisu od odczytu danych. | 8 |
| S1-03 | Jako zespół chcemy skonfigurować projekt frontendowy React/Vite z routingiem, stylami globalnymi i podstawowymi layoutami, aby mieć bazę pod interfejs klienta. | 5 |
| S1-04 | Jako zespół chcemy przygotować skrypty baz CalisiaWriteDb i CalisiaReadDb, aby aplikacja mogła przechowywać dane operacyjne oraz model odczytowy. | 5 |
| S1-05 | Jako zespół chcemy dodać dokumentację uruchomieniową w README, aby nowa osoba mogła uruchomić frontend, backend i bazy danych. | 3 |
| S1-06 | Jako zespół chcemy przygotować kolekcję Bruno dla podstawowych endpointów, aby łatwo weryfikować API podczas prac developerskich. | 3 |

Suma sprintu: 32 SP

## Sprint 2 - Klient, rejestracja i bezpieczne hasła

Cel sprintu: umożliwić klientowi założenie profilu oraz przygotować bezpieczne przechowywanie danych logowania.

| ID | Historyjka | SP |
| --- | --- | ---: |
| S2-01 | Jako klient chcę zarejestrować profil, podając imię, nazwisko, e-mail, hasło i typ klienta, aby rozpocząć korzystanie z bankowości. | 8 |
| S2-02 | Jako system chcę walidować dane rejestracyjne, aby odrzucać niepełne lub niepoprawne dane klienta. | 5 |
| S2-03 | Jako system chcę bezpiecznie hashować hasła z użyciem PBKDF2, aby nie przechowywać haseł w postaci jawnej. | 5 |
| S2-04 | Jako klient chcę otrzymać jednoznaczną odpowiedź po rejestracji, aby wiedzieć, że mój profil został utworzony. | 3 |
| S2-05 | Jako zespół chcemy pokryć rejestrację testami jednostkowymi i integracyjnymi, aby ograniczyć ryzyko regresji. | 5 |
| S2-06 | Jako tester chcę mieć scenariusz rejestracji w Bruno, aby szybko sprawdzić endpoint z poziomu kolekcji API. | 2 |

Suma sprintu: 28 SP

## Sprint 3 - Logowanie, JWT i ochrona API

Cel sprintu: zapewnić mechanizm uwierzytelniania oraz zabezpieczyć operacje klienta przed dostępem anonimowym.

| ID | Historyjka | SP |
| --- | --- | ---: |
| S3-01 | Jako klient chcę zalogować się e-mailem i hasłem, aby uzyskać dostęp do swojej bankowości. | 8 |
| S3-02 | Jako system chcę generować token JWT z identyfikatorem klienta i czasem wygaśnięcia, aby frontend mógł wykonywać autoryzowane zapytania. | 8 |
| S3-03 | Jako system chcę zabezpieczyć endpointy rachunków, przelewów i dashboardu atrybutem autoryzacji, aby chronić dane klientów. | 5 |
| S3-04 | Jako frontend chcę zapisywać sesję klienta w stanie aplikacji, aby utrzymać kontekst zalogowanego użytkownika. | 5 |
| S3-05 | Jako klient chcę widzieć komunikat błędu przy nieudanym logowaniu, aby poprawić dane i ponowić próbę. | 3 |
| S3-06 | Jako zespół chcemy przetestować logowanie, generowanie tokenu i odmowę dostępu, aby potwierdzić poprawne działanie bezpieczeństwa. | 8 |

Suma sprintu: 37 SP

## Sprint 4 - Rachunki bankowe i operacje pieniężne

Cel sprintu: udostępnić klientowi podstawowe produkty bankowe oraz operacje zmieniające saldo.

| ID | Historyjka | SP |
| --- | --- | ---: |
| S4-01 | Jako klient chcę otworzyć rachunek bankowy z nazwą, numerem, walutą i typem konta, aby mieć produkt do operacji finansowych. | 8 |
| S4-02 | Jako system chcę walidować numer rachunku, walutę i typ konta, aby zapisywać tylko poprawne produkty. | 5 |
| S4-03 | Jako klient chcę wypłacić środki z rachunku, aby wykonać obciążenie konta. | 8 |
| S4-04 | Jako system chcę zablokować wypłatę przekraczającą saldo, aby nie dopuścić do niedozwolonego debetu. | 5 |
| S4-05 | Jako system chcę obsłużyć wpływ przychodzący na rachunek, aby można było zasymulować zasilenie konta. | 5 |
| S4-06 | Jako zespół chcemy zapisywać wpisy transakcyjne dla wpłat i wypłat, aby później prezentować historię zdarzeń. | 8 |
| S4-07 | Jako zespół chcemy pokryć rachunki, wpłaty i wypłaty testami, aby potwierdzić poprawne reguły domenowe. | 5 |

Suma sprintu: 44 SP

## Sprint 5 - Dashboard i model odczytowy

Cel sprintu: pokazać klientowi aktualny stan produktów, saldo łączne i ostatnie zdarzenia w panelu bankowości.

| ID | Historyjka | SP |
| --- | --- | ---: |
| S5-01 | Jako klient chcę zobaczyć dashboard po zalogowaniu, aby szybko sprawdzić stan swoich finansów. | 8 |
| S5-02 | Jako klient chcę widzieć kafelki produktów z nazwą, numerem, typem, walutą i saldem, aby rozpoznać swoje rachunki. | 5 |
| S5-03 | Jako klient chcę widzieć łączne saldo produktów, aby znać całkowitą wartość środków. | 3 |
| S5-04 | Jako klient chcę widzieć oś czasu zdarzeń, aby śledzić najnowsze operacje na produktach. | 5 |
| S5-05 | Jako system chcę aktualizować model odczytowy na podstawie zdarzeń domenowych, aby dashboard nie obciążał modelu zapisu. | 13 |
| S5-06 | Jako system chcę obsługiwać outbox i oznaczanie przetworzonych wiadomości, aby projekcje były odporne na ponowne przetwarzanie. | 8 |
| S5-07 | Jako zespół chcemy przetestować repozytorium odczytowe, dispatcher projekcji i endpoint dashboardu, aby mieć pewność spójności danych. | 8 |

Suma sprintu: 50 SP

## Sprint 6 - Przelewy własne i zewnętrzne

Cel sprintu: pozwolić klientowi wykonywać przelewy z rachunku oraz odzwierciedlać je w saldach i historii.

| ID | Historyjka | SP |
| --- | --- | ---: |
| S6-01 | Jako klient chcę wykonać przelew własny między moimi rachunkami, aby przenosić środki wewnątrz bankowości. | 13 |
| S6-02 | Jako klient chcę wykonać przelew zewnętrzny na numer rachunku odbiorcy, aby zapłacić osobie lub firmie spoza moich produktów. | 13 |
| S6-03 | Jako system chcę walidować rachunek źródłowy, kwotę, walutę, tytuł i odbiorcę, aby odrzucać niepoprawne przelewy. | 8 |
| S6-04 | Jako system chcę zmniejszać saldo rachunku źródłowego i zapisywać transfer, aby operacja była trwała w modelu zapisu. | 8 |
| S6-05 | Jako frontend chcę udostępnić panel przelewu z wyborem typu przelewu, rachunku źródłowego i danych odbiorcy, aby klient mógł wykonać operację z UI. | 8 |
| S6-06 | Jako klient chcę zobaczyć szybką aktualizację dashboardu po przelewie, aby od razu widzieć zmianę salda i nowe zdarzenie. | 5 |
| S6-07 | Jako zespół chcemy przetestować przepływ przelewu jednostkowo i integracyjnie, aby potwierdzić działanie API oraz projekcji. | 8 |

Suma sprintu: 63 SP

## Sprint 7 - Integracja frontendu, stabilizacja i oddanie produktu

Cel sprintu: dopracować cały przepływ klienta, usunąć niespójności i przygotować produkt do prezentacji.

| ID | Historyjka | SP |
| --- | --- | ---: |
| S7-01 | Jako klient chcę przejść cały proces od strony startowej, przez rejestrację lub logowanie, do dashboardu, aby korzystać z aplikacji bez używania narzędzi developerskich. | 8 |
| S7-02 | Jako klient chcę mieć czytelne formularze i komunikaty błędów w logowaniu, rejestracji oraz przelewach, aby wiedzieć, jak poprawić dane. | 5 |
| S7-03 | Jako klient chcę korzystać z responsywnego interfejsu, aby aplikacja była wygodna na komputerze i mniejszych ekranach. | 8 |
| S7-04 | Jako zespół chcemy ujednolicić nazewnictwo produktu w UI i dokumentacji, aby aplikacja konsekwentnie komunikowała markę Calisia. | 3 |
| S7-05 | Jako zespół chcemy rozszerzyć testy integracyjne najważniejszych flow: rejestracja, logowanie, rachunek, dashboard i przelew, aby przygotować stabilne demo. | 13 |
| S7-06 | Jako zespół chcemy uruchomić lint/build frontendu oraz testy backendu, aby zweryfikować gotowość techniczną projektu. | 5 |
| S7-07 | Jako zespół chcemy zaktualizować kolekcję Bruno i instrukcję uruchomienia, aby tester lub prowadzący mógł samodzielnie sprawdzić aplikację. | 5 |
| S7-08 | Jako zespół chcemy przygotować scenariusz prezentacji produktu, aby pokazać najważniejsze funkcje w logicznej kolejności. | 3 |

Suma sprintu: 50 SP

## Podsumowanie

| Sprint | Zakres | SP |
| --- | --- | ---: |
| Sprint 1 | Fundamenty architektury i środowiska | 32 |
| Sprint 2 | Klient, rejestracja i bezpieczne hasła | 28 |
| Sprint 3 | Logowanie, JWT i ochrona API | 37 |
| Sprint 4 | Rachunki bankowe i operacje pieniężne | 44 |
| Sprint 5 | Dashboard i model odczytowy | 50 |
| Sprint 6 | Przelewy własne i zewnętrzne | 63 |
| Sprint 7 | Integracja frontendu, stabilizacja i oddanie produktu | 50 |
| **Razem** |  | **304** |

## Uwagi produktowe

- Sprinty 1-6 odzwierciedlają funkcjonalności widoczne w istniejącym kodzie backendu, frontendu, baz danych, testów oraz kolekcji Bruno.
- Sprint 7 porządkuje prace stabilizacyjne i demo, w tym testy, build, dokumentację oraz ujednolicenie nazewnictwa produktu.
- Największe historyjki otrzymały 13 SP, ponieważ obejmują wiele elementów naraz: reguły domenowe, API, persystencję, projekcje lub UI.
