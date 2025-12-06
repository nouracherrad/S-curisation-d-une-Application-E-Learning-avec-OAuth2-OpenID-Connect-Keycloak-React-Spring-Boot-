# README.md - Projet E-Learning Sécurisé avec OAuth2/OIDC



## 📖 Introduction

Ce projet implémente une plateforme E-Learning sécurisée utilisant les protocoles **OAuth2** et **OpenID Connect**. L'architecture comprend trois composants principaux : un frontend React, un backend Spring Boot, et un serveur d'authentification Keycloak.

## 🏗️ Architecture

### Diagramme d'Architecture
<img width="867" height="415" alt="image" src="https://github.com/user-attachments/assets/fa904bec-50d3-4d26-af15-13d5941f80b4" />


### Composants
1. **Frontend React** (Port 3000) - Interface utilisateur
2. **Backend Spring Boot** (Port 8081) - API REST sécurisée
3. **Keycloak** (Port 8080) - Serveur d'authentification OIDC

### Flux d'Authentification
1. Utilisateur accède à React (localhost:3000)
2. Redirection vers Keycloak pour login
3. Keycloak retourne un token JWT
4. React utilise le token pour appeler l'API Spring Boot
5. Spring Boot valide le token avec Keycloak
6. Données retournées à React

## 🛠️ Technologies

### Backend
- **Spring Boot 3.x**
- **Spring Security**
- **OAuth2 Resource Server**
- **Java 17**

### Frontend
- **React 18**
- **keycloak-js**
- **JavaScript ES6+**

### Authentification
- **Keycloak 22+**
- **OAuth2 / OpenID Connect**
- **JWT (JSON Web Tokens)**



### 2. Configurer Keycloak
1. Accéder à http://localhost:8080
2. Créer un realm "elearning-realm"
3. Créer un client "react-client"
4. Créer les rôles: STUDENT et ADMIN
5. Créer les utilisateurs:
   - user1 (rôle STUDENT)
   - admin1 (rôle ADMIN)

### 4. Frontend React
```bash
cd leaning
npm start
```

## ⚙️ Configuration

### Keycloak (`keycloak.js`)
```javascript
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "elearning-realm",
    clientId: "react-client",
});

export default keycloak;
```

### Spring Boot (`application.properties`)
```properties
spring.application.name=OAuth2OpenIDConnectavecKeycloak
server.port=8081
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8080/realms/elearning-realm
```

## 🚀 Utilisation

### 1. Accès à l'application
- URL: http://localhost:3000
- Redirection automatique vers Keycloak
- Authentification avec:
  - **user1** (STUDENT)
  - **admin1** (ADMIN)



## 🔌 API Endpoints

| Endpoint | Méthode | Rôles | Description |
|----------|---------|-------|-------------|
| `/courses` | GET | STUDENT, ADMIN | Liste des cours |
| `/courses` | POST | ADMIN uniquement | Ajouter un cours |
| `/me` | GET | Authentifié | Infos utilisateur |
| `/public` | GET | Public | Test sans auth |

### Exemple de Controller
```java
@RestController
public class CourseController {
    
    @GetMapping("/courses")
    public List<String> getCourses() {
        return Arrays.asList("Mathématiques", "Informatique");
    }
    
    @PostMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addCourse(@RequestBody String course) {
        return ResponseEntity.ok("Cours ajouté");
    }
}
```

## 🔒 Sécurité

### Configuration Spring Security
```java
@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public").permitAll()
                .requestMatchers("/courses").hasAnyRole("STUDENT", "ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults())
            )
            .build();
    }
}
```


## 🧪 Tests

### 1. Obtention d'un Token avec Postman
```http
POST http://localhost:8080/realms/elearning-realm/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

client_id=react-client
&username=admin1
&password=password
&grant_type=password
```

<img width="1743" height="745" alt="image" src="https://github.com/user-attachments/assets/2f10df11-8ed0-49e1-b0e2-98c6ab417db9" />

### 2. Informations du Token
<img width="728" height="658" alt="image" src="https://github.com/user-attachments/assets/6bf5fd3d-f44a-4014-92d5-6ceb23b070f8" />

### 3. Interface React
<img width="1887" height="533" alt="image" src="https://github.com/user-attachments/assets/19ba3847-b449-45a7-a6ef-bdf25874e1e9" />

### 4. Page de Login Keycloak
<img width="1552" height="852" alt="image" src="https://github.com/user-attachments/assets/c4aac0ae-778c-49b4-9c3e-8be5c8042587" />





## 📊 Configuration Keycloak

| Élément | Valeur |
|---------|--------|
| Realm | elearning-realm |
| Client | react-client |
| Type | Public |
| Redirect URI | http://localhost:3000/* |
| Rôles | STUDENT, ADMIN |
| Utilisateurs | user1 (STUDENT), admin1 (ADMIN) |






---

