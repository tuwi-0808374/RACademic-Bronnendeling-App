# App RACademic

## Overzicht

De RACademic Bronnendeling App is een platform voor Hogeschool Rotterdam-studenten om studiematerialen zoals video’s, boeken en cursussen te delen en te vinden. Inloggen vereist een @hr.nl e-mail. Gebruikers kunnen bronnen delen, bekijken, beoordelen, favorieten en zoeken met filters. De app, gebouwd met React Native en Docker, werkt als website en mobiele app, met focus op veiligheid en gebruiksvriendelijkheid.

## Wie zijn wij?

Wij zijn team **Kiwi** en ons team bestaat uit:
- **Max Hofman** (1103166)
- **Tuwi Nannings** (0808374)
- **Noortje Vroegop** (1100338)
- **Jesper Edeling** (1103541)

---

## Installatie Stappen

# Met docker

### Software
- Docker
- Git

## Installatie
1. **Installeer Docker**:
   - Download en installeer [Docker Desktop](https://www.docker.com/products/docker-desktop/) voor jouw besturingssysteem en zorg dat het draait.

2. **Clone de repository**:
   ```bash
   git clone https://github.com/Rac-Software-Development/wp4-2025-react-1d2-kiwi-wip.git
   cd wp4-2025-react-1d2-kiwi-wip
   ```
3. ** Bouw en start de applicatie:
  ```bash
  docker-compose up --build -d
  ```

Wacht toch het installeren klaar is.
De app is nu bereikbaar vanaf http://localhost:19006
En het inlog scherm zou nu moeten verschijnen.

4. Optioneel: Bekijk logs met:
  ```bash
  docker-compose logs -f
  ```

Voor de mobile versie ga verder met deze stappen:

6. Installeer de Expo Go app op android of ios via de playstore

5. Ga naar de root van de react client folder
  ```bash
  cd .\react_client\
  ```

6. Start de dev omgeving met
  ```bash
  npx expo start
  ```

Wacht to je "Logs for your project will appear below. " ziet en scroll iets naar boven.
Scan de qr code met je telefoon en de website zal te zien zijn op je telefoon.
(zorg dat je telefoon op dezelfde netwerk is verbonden als je pc)


# Zonder docker
## Vereisten

### 1. Software en versievereisten
Voor het uitvoeren van dit project zijn de volgende vereisten van toepassing:

- **Python-versie:** 3.x
- **Git:**
- **Flask:** 
- **React:** 


### 2. Benodigde Python-packages
Je kunt deze afhankelijkheden installeren met behulp van het meegeleverde `requirements.txt`-bestand.
Of gebruik deze lijst om ze zelfs te installeren:
```bash
bcrypt==4.3.0
blinker==1.9.0
click==8.1.8
colorama==0.4.6
Flask==3.1.0
flask-cors==5.0.1
itsdangerous==2.2.0
Jinja2==3.1.6
MarkupSafe==3.0.2
Werkzeug==3.1.3
flask_jwt_extended
flask_cors
```

### 1. Clone de repository
Om te beginnen, clonen we de repository naar je lokale machine. Gebruik de volgende opdracht:

```bash
git clone https://github.com/Rac-Software-Development/wp3-2025-rest-1d2-wip.git
cd wp3-2025-rest-1d2-wip
```

### 2. Maak een virtual environment (venv) aan
Het gebruik van een virtual environment is aanbevolen om afhankelijkheden van dit project afzonderlijk te houden. Je kunt een virtual environment aanmaken via de **command line** of via **PyCharm**. Kies de methode die je wilt gebruiken.

#### Optie 1: Command Line
1. Maak een virtual environment aan:
   ```bash
   python -m venv venv
   ```
2. Activeer de virtual environment:
    
   - Op Windows (Git Bash):
     ```bash
     source venv/Scripts/activate
     ```

   - Op Windows (Command Prompt (CMD)):
     ```bash
     venv\Scripts\activate
     ```
   - Op macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

### 3. Installeer afhankelijkheden

#### Optie 1: Installeren met `requirements.txt` (Aanbevolen)
Zorg ervoor dat je virtual environment is geactiveerd. Installeer daarna de afhankelijkheden met:
```bash
pip install -r requirements.txt
```

#### Optie 2: Installeren zonder `requirements.txt`
Als je `requirements.txt` niet wilt gebruiken, installeer je de benodigde libraries handmatig:
```bash
pip install flask
pip install bcrypt==4.2.1
pip install blinker==1.9.0
pip install certifi==2025.1.31
pip install charset-normalizer==3.4.1
pip install click==8.1.8
pip install colorama==0.4.6
pip install Flask-Bcrypt==1.0.1
pip install flask-cors==5.0.1
pip install Flask-JWT-Extended==4.7.1
pip install flask-swagger-ui==4.11.1
pip install idna==3.10
pip install itsdangerous==2.2.0
pip install Jinja2==3.1.5
pip install mailersend==0.5.8
pip install MarkupSafe==3.0.2
pip install PyJWT==2.10.1
pip install requests==2.32.3
pip install urllib3==2.3.0
pip install Werkzeug==3.1.3
```

---

### 4. Omgevingsvariabele Instellen
Om de Flask-applicatie te starten met `main.py` als de hoofdapplicatie, moet je de `FLASK_APP`-omgevingsvariabele instellen. Gebruik de onderstaande commando's, afhankelijk van je besturingssysteem:

#### macOS/Linux
```bash
export FLASK_APP=main.py
```

#### Windows (Command Prompt - CMD)
```bash
set FLASK_APP=main.py
```

#### Windows (Git Bash)
```bash
export FLASK_APP=main.py
```

### 5. Start de flask server

#### Methode 1: Via de terminal
1. Navigeer naar de server map:
   ```bash
   cd .\flask_server\
   ```
2. Start de applicatie:
   ```bash
   flask --app main.py run
   ```
De flask server is nu toegankelijk via [http://127.0.0.1:5000](http://127.0.0.1:5000).

3. Ga naar de root van de react client folder
  ```bash
  cd .\react_client\
  ```

4. Start de dev omgeving met
  ```bash
  npx expo start
  ```

Wacht to je "Logs for your project will appear below. "
Druk op W en je browser laat de website zien.


---

## Inloggegevens

Je kunt inloggen met het standaard account:

*Student*\
**Gebruikersnaam:** student@hr.nl
**Wachtwoord:** 1

*Beheerder*\
**Gebruikersnaam:** admin@hr.nl
**Wachtwoord:** 1

### Registratiepagina

Op de **Registratiepagina** kunt u een account aanmaken als **Student**. Tijdens het registratieproces wordt u gevraagd om de volgende gegevens in te vullen:

- **Persoonlijke gegevens**:
  - Voornaam
  - Achternaam
  - Wachtwoord
  - E-mailadres

---



## **Screenshots**
 


## **Assets**
- bron

## **Code Bronnen**
- **Web Resources**
  - bron

 <br>

 - **YouTube Tutorials**
   - bron 

