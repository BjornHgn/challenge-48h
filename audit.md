# 📋 Rapport d'Audit - TBC

## 🧾 En-têtes HTTP retournés

```
HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.11.12
Date: Mon, 02 Jun 2025 13:02:27 GMT
Content-type: text/html
Content-Length: 8168
Last-Modified: Wed, 28 May 2025 14:36:17 GMT
``` 

---

## 🌐 Informations réseau


---

## 🛰️ Détails de la cible

| Élément        | Détail                            |
|----------------|------------------------------------|
| IP             | `10.33.70.223`                     |
| Port           | `8000/tcp`                         |
| Service        | `SimpleHTTP/0.6` (Python 3.11.12)  |
| TLS            | ❌ Non pris en charge              |
| Date du scan   | 2 juin 2025                        |

---

## 🔒 Headers de sécurité manquants

| Header                      | Risque associé                                 |
|-----------------------------|------------------------------------------------|
| `Content-Security-Policy`   | Protection contre les attaques XSS             |
| `X-Content-Type-Options`    | Empêche le "MIME sniffing" (XSS)               |
| `Permissions-Policy`        | Contrôle des API navigateur (caméra, micro...) |
| `Strict-Transport-Security` | Force HTTPS si activé (non pertinent ici)      |
| `Referrer-Policy`           | Contrôle la fuite d'URL dans les liens         |

---

## 🛡️ Recommandations

- ❌ **Ne pas utiliser `SimpleHTTPServer` en production.**  
  Il ne gère ni TLS, ni les logs, ni les headers de sécurité.

- ✅ **Migrer vers un serveur web robuste** comme **Nginx** ou **Apache**.

- ✅ **Mettre en place des headers HTTP de sécurité**, par exemple via Nginx :

```nginx
add_header Content-Security-Policy "default-src 'self'";
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header Referrer-Policy no-referrer;
add_header Permissions-Policy "camera=(), microphone=()";
``` 

## 📦 Outils utilisés

| Outil   | Description                                   |
| ------- | --------------------------------------------- |
| `curl`  | Récupération des en-têtes HTTP                |
| `nmap`  | Scan de port et identification des services   |
| `nikto` | Audit des vulnérabilités et headers manquants |

