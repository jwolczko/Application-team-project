# Backlog projektu Calisia - 7 sprintów

## Założenia

- Backlog opisuje implementację aplikacji od zera do obecnego stanu widocznego w kodzie.
- Story pointy są przypisane na poziomie historyjek.
- Historyjki mają krótki opis i listę zadań bez szczegółowej specyfikacji.

## Sprint 1 - Fundamenty projektu i architektura

| ID | Historyjka | SP |
| --- | --- | ---: |
| S1-01 | Jako zespół chcemy przygotować strukturę rozwiązania backendowego, aby rozwijać system modułowo. | 5 |
| S1-02 | Jako zespół chcemy przygotować podstawowy projekt frontendowy, aby rozpocząć budowę aplikacji webowej. | 3 |
| S1-03 | Jako zespół chcemy przygotować podstawową konfigurację API, aby aplikacja miała punkt startowy. | 5 |
| S1-04 | Jako zespół chcemy przygotować bazowe mechanizmy obsługi błędów, aby API zwracało spójne odpowiedzi. | 3 |
| S1-05 | Jako zespół chcemy przygotować dokumentację uruchomieniową projektu, aby środowisko było odtwarzalne. | 2 |

### Zadania

**S1-01**
- Utworzyć projekty `Domain`, `Application`, `Contracts`, `Infrastructure`, `ReadModel`, `Api`.
- Skonfigurować referencje między projektami.
- Dodać podstawowe abstrakcje domenowe.

**S1-02**
- Utworzyć aplikację React/Vite.
- Skonfigurować TypeScript, ESLint i strukturę katalogów.
- Dodać podstawowe style globalne i reset CSS.

**S1-03**
- Skonfigurować ASP.NET API.
- Dodać endpoint health check.
- Skonfigurować CORS dla frontendu.
- Dodać OpenAPI.

**S1-04**
- Dodać middleware obsługi wyjątków.
- Dodać typy wyjątków aplikacyjnych.
- Ujednolicić odpowiedzi błędów walidacji i autoryzacji.

**S1-05**
- Opisać wymagane narzędzia.
- Opisać uruchomienie frontendu.
- Opisać uruchomienie backendu.
- Opisać przygotowanie baz danych.

**Suma sprintu: 18 SP**

## Sprint 2 - Model domenowy klienta i produktów

| ID | Historyjka | SP |
| --- | --- | ---: |
| S2-01 | Jako klient chcę posiadać profil w systemie, aby korzystać z bankowości. | 5 |
| S2-02 | Jako bank chcę modelować produkty finansowe klienta, aby obsługiwać rachunki, karty i kredyty. | 8 |
| S2-03 | Jako bank chcę obsługiwać wartość pieniężną z walutą, aby poprawnie liczyć salda. | 5 |
| S2-04 | Jako bank chcę generować numery produktów, aby każdy rachunek i karta miały unikalny identyfikator biznesowy. | 3 |
| S2-05 | Jako zespół chcemy pokryć podstawowe reguły domenowe testami jednostkowymi. | 5 |

### Zadania

**S2-01**
- Dodać encję klienta.
- Dodać typ klienta Standard i Prestige.
- Dodać obiekty wartości dla imienia, nazwiska i e-maila.
- Dodać repozytorium klienta.

**S2-02**
- Dodać wspólny model produktu.
- Dodać rachunek bankowy.
- Dodać kartę debetową i kredytową.
- Dodać model kredytu.
- Dodać statusy i kategorie produktów.

**S2-03**
- Dodać obiekt `Money`.
- Dodać obsługę zaokrągleń.
- Dodać kontrolę zgodności walut.
- Dodać operacje dodawania i odejmowania środków.

**S2-04**
- Dodać generator numerów rachunków.
- Dodać generator numerów kart.
- Dodać sekwencję numeracji produktów.

**S2-05**
- Dodać testy dla `Money`.
- Dodać testy reguł rachunku.
- Dodać testy limitu karty kredytowej.
- Dodać testy walidacji produktów.

**Suma sprintu: 26 SP**

## Sprint 3 - Rejestracja, logowanie i bezpieczeństwo

| ID | Historyjka | SP |
| --- | --- | ---: |
| S3-01 | Jako klient chcę zarejestrować konto, aby rozpocząć korzystanie z aplikacji. | 8 |
| S3-02 | Jako klient chcę otrzymać produkty startowe po rejestracji, aby od razu widzieć ofertę banku. | 5 |
| S3-03 | Jako klient chcę zalogować się do systemu, aby uzyskać dostęp do swoich danych. | 8 |
| S3-04 | Jako bank chcę zabezpieczyć hasła i sesję klienta, aby chronić dostęp do danych. | 8 |
| S3-05 | Jako zespół chcemy przygotować API dla rejestracji i logowania. | 5 |
| S3-06 | Jako zespół chcemy pokryć rejestrację i logowanie testami. | 5 |

### Zadania

**S3-01**
- Dodać kontrakt rejestracji klienta.
- Dodać komendę rejestracji.
- Dodać walidację hasła.
- Dodać walidację unikalności e-maila.

**S3-02**
- Dodać tworzenie konta Standard.
- Dodać tworzenie konta Prestige.
- Dodać tworzenie karty debetowej.
- Dodać tworzenie karty kredytowej dla Prestige.

**S3-03**
- Dodać kontrakt logowania.
- Dodać komendę logowania.
- Dodać weryfikację hasła.
- Dodać zwracanie tokenu i daty wygaśnięcia.

**S3-04**
- Dodać haszowanie haseł PBKDF2.
- Dodać generowanie tokenów JWT.
- Dodać konfigurację autoryzacji w API.
- Dodać odczyt identyfikatora klienta z tokenu.

**S3-05**
- Dodać `CustomersController`.
- Udostępnić endpoint rejestracji.
- Udostępnić endpoint logowania.
- Podłączyć obsługę błędów.

**S3-06**
- Dodać testy rejestracji klienta.
- Dodać testy logowania klienta.
- Dodać testy haszowania hasła.
- Dodać testy generowania tokenu JWT.

**Suma sprintu: 39 SP**

## Sprint 4 - Rachunki, wpłaty, wypłaty i persystencja

| ID | Historyjka | SP |
| --- | --- | ---: |
| S4-01 | Jako klient chcę otworzyć rachunek bankowy, aby posiadać dodatkowy produkt. | 5 |
| S4-02 | Jako klient chcę wypłacić środki z rachunku, aby realizować obciążenia konta. | 5 |
| S4-03 | Jako system chcę obsłużyć wpłatę środków, aby zasilać produkty finansowe. | 5 |
| S4-04 | Jako zespół chcemy zapisywać dane w bazie operacyjnej, aby utrwalać stan systemu. | 8 |
| S4-05 | Jako zespół chcemy udostępnić operacje rachunkowe przez API. | 5 |
| S4-06 | Jako zespół chcemy przygotować skrypty baz danych. | 5 |
| S4-07 | Jako zespół chcemy pokryć przepływy rachunkowe testami. | 5 |

### Zadania

**S4-01**
- Dodać komendę otwarcia rachunku.
- Dodać handler otwarcia rachunku.
- Dodać walidację istnienia klienta.
- Dodać zapis nowego rachunku.

**S4-02**
- Dodać komendę wypłaty środków.
- Dodać handler wypłaty.
- Dodać kontrolę właściciela rachunku.
- Dodać kontrolę dostępnych środków.

**S4-03**
- Dodać komendę wpłaty środków.
- Dodać handler wpłaty.
- Dodać obsługę wpłat na rachunki i karty.
- Dodać walidację aktywnego produktu.

**S4-04**
- Dodać `WriteDbContext`.
- Dodać konfiguracje encji.
- Dodać repozytoria zapisu.
- Dodać `UnitOfWork`.

**S4-05**
- Dodać `AccountsController`.
- Udostępnić endpoint otwarcia rachunku.
- Udostępnić endpoint wypłaty.
- Zabezpieczyć endpointy autoryzacją.

**S4-06**
- Przygotować skrypt bazy zapisu.
- Przygotować projekt bazy danych.
- Dodać konfigurację połączenia z bazą.

**S4-07**
- Dodać testy otwarcia rachunku.
- Dodać testy wypłaty środków.
- Dodać testy wpłaty środków.
- Dodać testy integracyjne przepływu rachunku.

**Suma sprintu: 38 SP**

## Sprint 5 - Dashboard, model odczytowy i zdarzenia

| ID | Historyjka | SP |
| --- | --- | ---: |
| S5-01 | Jako klient chcę zobaczyć podsumowanie swoich produktów, aby znać stan finansów. | 8 |
| S5-02 | Jako klient chcę widzieć ostatnie zdarzenia finansowe, aby śledzić aktywność. | 5 |
| S5-03 | Jako system chcę przetwarzać zdarzenia domenowe do modelu odczytowego, aby szybko budować dashboard. | 8 |
| S5-04 | Jako zespół chcemy udostępnić dashboard przez API. | 5 |
| S5-05 | Jako zespół chcemy przygotować bazę odczytową. | 5 |
| S5-06 | Jako zespół chcemy pokryć dashboard i projekcje testami. | 8 |

### Zadania

**S5-01**
- Dodać DTO dashboardu.
- Dodać kafelki produktów.
- Dodać sumowanie sald.
- Dodać sortowanie produktów.

**S5-02**
- Dodać model zdarzeń osi czasu.
- Dodać prezentację wpłat jako zdarzeń dodatnich.
- Dodać prezentację wypłat jako zdarzeń ujemnych.
- Ograniczyć listę zdarzeń do 20 ostatnich.

**S5-03**
- Dodać Outbox.
- Dodać procesor komunikatów Outbox.
- Dodać dispatcher projekcji.
- Dodać obsługę idempotencji projekcji.

**S5-04**
- Dodać query pobrania dashboardu.
- Dodać handler query.
- Dodać `DashboardController`.
- Dodać kontrolę dostępu do danych klienta.

**S5-05**
- Dodać `ReadDbContext`.
- Dodać konfiguracje modeli odczytowych.
- Przygotować skrypt bazy odczytowej.
- Skonfigurować połączenie z bazą odczytową.

**S5-06**
- Dodać testy repozytorium dashboardu.
- Dodać testy handlera dashboardu.
- Dodać testy dispatcherów projekcji.
- Dodać testy integracyjne pobrania dashboardu.

**Suma sprintu: 39 SP**

## Sprint 6 - Przelewy i operacje między produktami

| ID | Historyjka | SP |
| --- | --- | ---: |
| S6-01 | Jako klient chcę wykonać przelew własny, aby przenieść środki między swoimi produktami. | 8 |
| S6-02 | Jako klient chcę wykonać przelew zewnętrzny, aby wysłać środki do odbiorcy. | 8 |
| S6-03 | Jako system chcę rejestrować status przelewu, aby śledzić jego realizację. | 5 |
| S6-04 | Jako zespół chcemy udostępnić przelewy przez API. | 5 |
| S6-05 | Jako zespół chcemy przygotować symulację przelewu przychodzącego. | 3 |
| S6-06 | Jako zespół chcemy pokryć przepływy przelewów testami. | 8 |

### Zadania

**S6-01**
- Dodać model przelewu własnego.
- Dodać komendę utworzenia przelewu.
- Dodać obciążenie produktu źródłowego.
- Dodać zasilenie produktu docelowego.
- Dodać walidację różnych produktów.

**S6-02**
- Dodać model przelewu zewnętrznego.
- Dodać walidację numeru rachunku odbiorcy.
- Dodać walidację nazwy odbiorcy.
- Dodać obciążenie produktu źródłowego.

**S6-03**
- Dodać statusy przelewu.
- Dodać zdarzenie utworzenia przelewu.
- Dodać zdarzenie zakończenia przelewu.
- Dodać datę utworzenia i zakończenia.

**S6-04**
- Dodać `TransfersController`.
- Udostępnić endpoint utworzenia przelewu.
- Zabezpieczyć endpoint autoryzacją.
- Podłączyć kontrakty requestów.

**S6-05**
- Dodać request przelewu przychodzącego.
- Dodać endpoint symulacji przelewu przychodzącego.
- Podłączyć mechanizm wpłaty środków.

**S6-06**
- Dodać testy przelewu własnego.
- Dodać testy przelewu zewnętrznego.
- Dodać testy walidacji przelewu.
- Dodać testy integracyjne przepływu przelewu.

**Suma sprintu: 37 SP**

## Sprint 7 - Frontend, integracja i stabilizacja

| ID | Historyjka | SP |
| --- | --- | ---: |
| S7-01 | Jako klient chcę zobaczyć stronę startową, aby rozpocząć korzystanie z bankowości. | 5 |
| S7-02 | Jako klient chcę założyć konto z poziomu UI, aby przejść onboarding bez użycia API. | 8 |
| S7-03 | Jako klient chcę zalogować się z poziomu UI, aby wejść do panelu klienta. | 8 |
| S7-04 | Jako klient chcę korzystać z dashboardu w aplikacji webowej, aby przeglądać produkty i zdarzenia. | 8 |
| S7-05 | Jako klient chcę wykonać przelew w aplikacji webowej, aby obsłużyć operację samodzielnie. | 8 |
| S7-06 | Jako zespół chcemy przygotować obsługę sesji i integrację API we frontendzie. | 5 |
| S7-07 | Jako zespół chcemy przygotować kolekcję Bruno, aby łatwo testować API ręcznie. | 3 |
| S7-08 | Jako zespół chcemy ustabilizować aplikację przed oddaniem obecnego zakresu. | 5 |

### Zadania

**S7-01**
- Dodać layout publiczny.
- Dodać landing page.
- Dodać nagłówek strony startowej.
- Dodać przejścia do logowania i rejestracji.

**S7-02**
- Dodać widok zakładania konta.
- Dodać formularz rejestracji.
- Dodać wybór typu klienta.
- Dodać automatyczne logowanie po rejestracji.

**S7-03**
- Dodać widok logowania.
- Dodać formularz logowania.
- Dodać obsługę błędów logowania.
- Dodać modal wsparcia logowania.

**S7-04**
- Dodać layout dashboardu.
- Dodać sekcję podsumowania środków.
- Dodać sekcję produktów.
- Dodać panel wydarzeń.
- Dodać formatowanie kwot i numerów produktów.

**S7-05**
- Dodać panel przelewów.
- Dodać przelew własny.
- Dodać przelew zewnętrzny.
- Dodać walidację formularza.
- Dodać odświeżanie dashboardu po przelewie.

**S7-06**
- Dodać klienta API.
- Dodać Redux store dla autoryzacji.
- Dodać React Query dla danych serwerowych.
- Dodać ochronę tras wymagających logowania.

**S7-07**
- Dodać kolekcję Bruno.
- Dodać requesty rejestracji i logowania.
- Dodać requesty rachunków.
- Dodać requesty dashboardu i przelewów.

**S7-08**
- Dodać testy integracyjne autoryzacji.
- Dodać testy endpointu health.
- Zweryfikować przepływy end-to-end przez API.
- Uporządkować README.

**Suma sprintu: 50 SP**

## Podsumowanie

| Sprint | Zakres | SP |
| --- | --- | ---: |
| Sprint 1 | Fundamenty projektu i architektura | 18 |
| Sprint 2 | Model domenowy klienta i produktów | 26 |
| Sprint 3 | Rejestracja, logowanie i bezpieczeństwo | 39 |
| Sprint 4 | Rachunki, wpłaty, wypłaty i persystencja | 38 |
| Sprint 5 | Dashboard, model odczytowy i zdarzenia | 39 |
| Sprint 6 | Przelewy i operacje między produktami | 37 |
| Sprint 7 | Frontend, integracja i stabilizacja | 50 |
| **Razem** |  | **247** |
