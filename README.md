# TechInnoventia

## 🔐 Authentication & User Management API

Toutes les routes sont préfixées par `/api/auth/`.

---

## 🚀 Inscription

**POST** `/api/auth/register/`

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"12345678"}'
```
- fetch:
```js
fetch("/api/auth/register/", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({username: "john", email: "john@example.com", password: "12345678"})
}).then(r => r.json()).then(console.log);
```
- axios:
```js
axios.post("/api/auth/register/", {
  username: "john",
  email: "john@example.com",
  password: "12345678"
}).then(res => console.log(res.data));
``

## 🔑 Connexion (JWT)
```bash
POST /api/auth/login/`
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"12345678"}'
```
- Réponse → access et refresh tokens.


## 👤 Profil utilisateur

GET /api/auth/profile/ (JWT obligatoire)
```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" \
  http://localhost:8000/api/auth/profile/
```
PUT /api/auth/profile/
```bash
curl -X PUT http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"bio":"I love Django!"}'
```

##📧 Vérification d’email

POST /api/auth/verify-email/
``bash
curl -X POST http://localhost:8000/api/auth/verify-email/ \
  -H "Content-Type: application/json" \
  -d '{"uid":"<UID>","token":"<TOKEN>"}'
```

##🔄 Renvoyer email de vérification

POST /api/auth/resend-verification/
```bash
curl -X POST http://localhost:8000/api/auth/resend-verification/ \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

## 🔐 Réinitialisation du mot de passe

POST /api/auth/password-reset/
```bash
curl -X POST http://localhost:8000/api/auth/password-reset/ \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

POST /api/auth/password-reset/confirm/
```bash
curl -X POST http://localhost:8000/api/auth/password-reset/confirm/ \
  -H "Content-Type: application/json" \
  -d '{"uid":"<UID>","token":"<TOKEN>","new_password":"newStrongPass123"}'
```

##🛠 Gestion des rôles (Admin seulement)

GET /api/auth/roles/
```bash
curl -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  http://localhost:8000/api/auth/roles/
```

POST /api/auth/roles/
```bash
curl -X POST http://localhost:8000/api/auth/roles/ \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 2, "new_role": "admin"}'
```
#3📋 Liste des utilisateurs (Admin seulement)

GET /api/auth/users/
```bash
curl -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  http://localhost:8000/api/auth/users/
```
