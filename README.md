# Aplikacja bankowa ***Calisia***

# Opis funkcjonalności systemu Calisia

## Cel systemu

Calisia to aplikacja bankowości internetowej dla klientów indywidualnych. System pozwala klientowi założyć profil, zalogować się do bankowości, przeglądać posiadane produkty finansowe oraz wykonywać podstawowe operacje na rachunkach, w tym przelewy i obciążenia konta.

Rozwiązanie składa się z aplikacji webowej dla klienta, API backendowego oraz dwóch baz danych: operacyjnej i odczytowej. Taki podział wspiera oddzielenie zapisu operacji bankowych od szybkiego prezentowania danych na dashboardzie klienta.

## Obsługa klienta

System umożliwia rejestrację nowego klienta z podaniem imienia, nazwiska, adresu e-mail, hasła oraz typu klienta. Dostępne są dwa typy klienta: Standard oraz Prestige.

Po poprawnej rejestracji system automatycznie tworzy startowy zestaw produktów:

- dla klienta Standard: konto standardowe w PLN oraz karta debetowa,
- dla klienta Prestige: konto Prestige w PLN, karta debetowa oraz karta kredytowa z limitem 10 000 PLN.

System wymaga, aby hasło miało co najmniej 8 znaków. Adres e-mail musi być unikalny, co zapobiega utworzeniu wielu profili dla tego samego loginu.

## Logowanie i bezpieczeństwo dostępu

Klient loguje się adresem e-mail oraz hasłem. Po poprawnym logowaniu otrzymuje token sesji, który jest wykorzystywany do autoryzacji dalszych operacji.

Dostęp do dashboardu, rachunków i przelewów wymaga zalogowania. System pilnuje również, aby klient mógł pobierać dane tylko swojego profilu. Próba pobrania dashboardu innego klienta jest blokowana.

Hasła nie są przechowywane w postaci jawnej. Backend korzysta z mechanizmu haszowania haseł oraz tokenów JWT.

## Dashboard klienta

Po zalogowaniu klient trafia do panelu głównego, w którym widzi:

- łączne saldo produktów,
- listę posiadanych produktów bankowych,
- dostępne środki lub limit dla każdego produktu,
- ostatnie zdarzenia finansowe,
- przycisk wykonania przelewu.

Dashboard pokazuje maksymalnie 20 najnowszych zdarzeń. Zdarzenia są sortowane od najnowszych do najstarszych.

## Produkty finansowe

System obsługuje trzy kategorie produktów:

- rachunki bankowe,
- karty,
- kredyty.

W obecnym przepływie rejestracji automatycznie tworzone są rachunki i karty. W modelu domenowym istnieje również obsługa kredytów, ale kod nie udostępnia jeszcze pełnego procesu zakładania kredytu przez interfejs użytkownika.

Rachunki bankowe mogą mieć typ Standard, Prestige lub Oszczędnościowy. Karty mogą być debetowe albo kredytowe. Dla karty kredytowej system kontroluje limit i nie pozwala przekroczyć dostępnego limitu.

## Operacje na środkach

System obsługuje wpłaty i wypłaty środków na produktach finansowych, przede wszystkim na rachunkach i kartach.

Najważniejsze reguły biznesowe:

- operacje są możliwe tylko na aktywnych produktach,
- kwota operacji musi być większa od zera,
- waluta operacji musi być zgodna z walutą produktu,
- system blokuje wypłatę, jeśli na produkcie nie ma wystarczających środków,
- dla kart kredytowych system blokuje zwiększenie salda ponad przyznany limit.

Każda operacja finansowa aktualizuje saldo produktu i tworzy zdarzenie widoczne w historii dashboardu.

## Przelewy

Klient może wykonać przelew z panelu klienta. System obsługuje dwa typy przelewów:

- przelew własny, czyli transfer pomiędzy produktami należącymi do tego samego klienta,
- przelew zewnętrzny, czyli transfer na wskazany numer rachunku i do wskazanego odbiorcy.

Dla przelewu własnego klient wybiera produkt źródłowy i produkt docelowy. System pilnuje, aby konto źródłowe i docelowe były różne oraz należały do tego samego klienta.

Dla przelewu zewnętrznego wymagane są numer rachunku odbiorcy, nazwa odbiorcy, kwota, waluta i tytuł przelewu. W obecnym modelu przelew zewnętrzny jest realizowany jako obciążenie produktu źródłowego klienta.

Po wykonaniu przelewu system oznacza go jako zakończony i aktualizuje dane prezentowane na dashboardzie.

## Historia i zdarzenia

System zapisuje zdarzenia biznesowe związane z produktami i operacjami finansowymi, m.in.:

- utworzenie produktu,
- wpłatę środków,
- wypłatę środków,
- utworzenie i zakończenie przelewu.

Zdarzenia dotyczące wpłat i wypłat są prezentowane klientowi w panelu "Wydarzenia". Dla każdego zdarzenia widoczny jest tytuł, kwota, waluta, data oraz informacja, czy operacja zwiększyła, czy zmniejszyła saldo.

## Aktualizacja danych dla dashboardu

System wykorzystuje mechanizm asynchronicznego przetwarzania zdarzeń. Operacje są zapisywane w bazie operacyjnej, a następnie przetwarzane do osobnego modelu odczytowego używanego przez dashboard.

Dzięki temu panel klienta może korzystać z danych przygotowanych specjalnie do szybkiego wyświetlania: listy produktów, sald oraz ostatnich zdarzeń.


## Zakres API

Backend udostępnia operacje biznesowe przez API:

- rejestracja klienta,
- logowanie klienta,
- pobranie dashboardu klienta,
- otwarcie rachunku bankowego,
- wypłata środków z rachunku,
- utworzenie przelewu,
- symulacja przelewu przychodzącego,
- endpoint zdrowia aplikacji.

## Podsumowanie biznesowe

Calisia realizuje podstawowy zakres bankowości internetowej: onboarding klienta, logowanie, prezentację majątku klienta, listę produktów, podstawową historię zdarzeń oraz przelewy. System jest przygotowany pod dalszy rozwój produktowy, szczególnie w obszarze pełnej historii operacji, dodawania nowych produktów, kredytów oraz bardziej rozbudowanej obsługi przelewów zewnętrznych.


## Wymagane narzędzia:

 * [Visual Studio 2026](https://visualstudio.microsoft.com/pl/thank-you-downloading-visual-studio/?sku=Community&channel=Stable&version=VS18&source=VSLandingPage&cid=2500&passive=false) lub [Ridder](https://www.jetbrains.com/rider/download/)
 * [Visual Studio Code](https://code.visualstudio.com/Download)
 * [SQL Server Management Studio](https://aka.ms/ssms/22/release/vs_SSMS.exe) lub inne narzędzie umożliwiające łączenie się z MS SQL Server
 * [Bruno](https://www.usebruno.com/downloads)
 * [Git](https://git-scm.com)


## Uruchomienie projektu:

### Frontend:

Wymagana jest instalacja NodeJs w wersji 25.8.1 lub nowszej:
[Obecna werjsa do pobrania](https://nodejs.org/en/download/current)

Po zainstalowaniu nodejs należy się upewnić że ścieżka została prawidłowo dodana do zmiennej środowiskowej **PATH**.
Można to zrobić po przez uruchomienie wiersz poleceń lub PowerShella i wpisanie : **npm --version** lub **node --version**.
Jeżeli zostanie zwrócona wersja to znaczy że jest ok.

W celu uruchomienia projektu należy w Visual Studio Code należy:
* kliknąć w menu *File* -> *Open Folder...*
* następnie wybrać folder: *..\Application-team-project\frontend*
* po otworzeniu projektu należy kliknąć w menu *Terminal* -> *New Teminal*
* w teminalu należy wpisać: **npm install**
* po zainstalowaniu wrzystkich pakietów można uruchomić projekt wpisując: **npm run dev** 


### Backend:
Do pełnego działania backendu wymagamane jest poprawne zainstalowanie Visula Studio 2026
oraz .NET 10.
W celu uruiichomienia projektu należy za pomocą Visula Studio lub Riddera uruchomić plik: **Calisia.slnx** z folderu : *..\Application-team-project\backend*

### Bazy danych:
Do baz danych należy zainstalować [**SQL Serve 2025 Developer**](https://go.microsoft.com/fwlink/?linkid=2344626&clcid=0x409&culture=en-us&country=us). Po poprawnym zainstalowaniu instancji SQL Servera należy uruchomić SQL Server Management Studio.
Następnie należy kliknąż w menu *Plik* -> *Otwórz* -> *Projekt/rozwiązanie*,
jak pojawi się okno dialogowe z wyborem projektu należy wskazać plik **CalisiaDb.slnx**
z folderu *..\Application-team-project\database*.
Po uwuchomieniu projektu należy wykonać 2 skrypty: **CalisiaReadDb.sql** i **CalisiaWriteDb.sql** które odtworzą bazy danych.

