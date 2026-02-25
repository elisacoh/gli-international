# 🔧 Netlify Functions

Ce dossier contient les Netlify Functions (serverless functions) pour GLI International.

## 📂 Structure

```
netlify/functions/
├── _lib/                         # Bibliothèques partagées
│   ├── auth.ts                  # Authentification et autorisations
│   ├── response.ts              # Helpers pour les réponses HTTP (CORS, JSON)
│   └── supabase.ts              # Client Supabase
│
├── submit-booking.ts            # 📧 Gestion des réservations + envoi d'emails
├── validate-promo-code.ts       # 🎟️ Validation des codes promo
├── record-promo-usage.ts        # 📊 Enregistrement d'usage de code promo
├── promo-codes.ts               # 🔐 CRUD codes promo (admin)
└── my-promo-usage.ts            # 📈 Stats d'usage codes promo (admin)
```

## 🚀 Functions disponibles

### 📧 submit-booking
**Endpoint** : `/.netlify/functions/submit-booking`
**Méthode** : `POST`

Gère les demandes de réservation :
- Reçoit les données de réservation
- Valide les informations des participants
- Envoie un email HTML à l'administrateur via Resend
- (Future) Enregistre la réservation dans la base de données

**Body** :
```json
{
  "seminarTitle": "Formation Géorgie",
  "destination": "Tbilissi - Géorgie",
  "tripDates": "01/06/2026 - 07/06/2026",
  "participantsCount": 2,
  "pricePerPerson": 2500,
  "totalAmount": 3750,
  "currency": "EUR",
  "promoCode": "SUMMER2026",
  "promoDiscount": 250,
  "participants": [
    {
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@example.com",
      "phone": "+33601020304",
      "profession": "Avocat",
      "companyName": "Cabinet Dupont",
      "address": "123 Rue de la Paix, Paris",
      "message": "Nous aimerions une chambre avec vue"
    }
  ]
}
```

**Response** :
```json
{
  "success": true,
  "message": "Booking request submitted successfully",
  "emailId": "abc123..."
}
```

### 🎟️ validate-promo-code
**Endpoint** : `/.netlify/functions/validate-promo-code`
**Méthode** : `POST`

Valide un code promotionnel :
- Vérifie que le code existe et est actif
- Vérifie les dates de validité
- Vérifie le nombre d'utilisations restantes
- Calcule le montant de la réduction

**Body** :
```json
{
  "code": "SUMMER2026",
  "formation_id": "georgia-formation",
  "amount": 2500
}
```

**Response** :
```json
{
  "is_valid": true,
  "promo_id": "uuid-...",
  "discount_type": "percentage",
  "discount_value": 10,
  "discount_amount": 250,
  "final_amount": 2250
}
```

### 📊 record-promo-usage
**Endpoint** : `/.netlify/functions/record-promo-usage`
**Méthode** : `POST`
**Auth** : Requis (Bearer token)

Enregistre l'utilisation d'un code promo après paiement.

### 🔐 promo-codes
**Endpoint** : `/.netlify/functions/promo-codes`
**Méthodes** : `GET`, `POST`, `PUT`, `DELETE`
**Auth** : Requis (Admin)

CRUD complet pour la gestion des codes promo.

### 📈 my-promo-usage
**Endpoint** : `/.netlify/functions/my-promo-usage`
**Méthode** : `GET`
**Auth** : Requis (Admin)

Récupère les statistiques d'utilisation des codes promo.

## 🔒 Authentification

Les functions utilisent JWT Bearer tokens pour l'authentification :

```typescript
import { requireAuth } from './_lib/auth';

export const handler: Handler = async (event) => {
  // Vérifier l'authentification
  const authResult = await requireAuth(event);
  if (!authResult.success) {
    return error(authResult.error, 401);
  }

  const user = authResult.user;
  // ... reste du code
};
```

## 🧪 Test en local

### Installation

```bash
npm install -g netlify-cli
```

### Configuration

Créer un fichier `.env` à la racine :

```bash
# Resend
RESEND_API_KEY=re_xxxxxxxxxx
ADMIN_EMAIL=admin@example.com
FROM_EMAIL=noreply@example.com

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
```

### Lancer le serveur

```bash
netlify dev
```

Les functions seront disponibles sur :
```
http://localhost:8888/.netlify/functions/submit-booking
http://localhost:8888/.netlify/functions/validate-promo-code
...
```

### Tester avec curl

```bash
# Test submit-booking
curl -X POST http://localhost:8888/.netlify/functions/submit-booking \
  -H "Content-Type: application/json" \
  -d '{
    "seminarTitle": "Test Formation",
    "destination": "Test Destination",
    "tripDates": "01/01/2026 - 07/01/2026",
    "participantsCount": 1,
    "pricePerPerson": 1000,
    "totalAmount": 1000,
    "currency": "EUR",
    "participants": [{
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "+33600000000",
      "profession": "Developer",
      "companyName": "Test Co",
      "address": "123 Test St"
    }]
  }'
```

## 📊 Monitoring

### Logs Netlify

Dashboard Netlify → **Functions** → Sélectionner une function → **Function log**

### Logs Resend

Dashboard Resend → **Emails** → Voir tous les emails envoyés

## 🐛 Dépannage

### Function ne démarre pas

- Vérifier la syntaxe TypeScript : `tsc --noEmit`
- Vérifier les imports et dépendances
- Voir les logs de build dans Netlify

### Variables d'environnement non définies

- Les variables locales : créer `.env` à la racine
- Les variables Netlify : Site settings → Environment variables

### Erreur CORS

Les headers CORS sont configurés dans `_lib/response.ts`. Pour restreindre les origines :

```typescript
'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
```

## 📚 Resources

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Netlify Functions TypeScript](https://docs.netlify.com/functions/typescript/)
- [Resend API Docs](https://resend.com/docs/api-reference/introduction)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

## 🔐 Sécurité

- ✅ Validation des inputs côté serveur
- ✅ Clés API jamais exposées au frontend
- ✅ CORS configuré
- ✅ Rate limiting (géré par Netlify)
- ✅ Authentification JWT pour les routes admin
- ✅ Sanitization des données avant envoi d'email

## 📈 Performance

- Les functions sont déployées sur le CDN Edge de Netlify
- Cold start : ~300-500ms
- Warm : ~50-100ms
- Timeout max : 10 secondes (Netlify Free) / 26 secondes (Pro)

## 💰 Limites

### Netlify (Free tier)
- 125,000 requêtes/mois
- 100 heures d'exécution/mois
- 10 secondes timeout

### Resend (Free tier)
- 100 emails/jour
- 3,000 emails/mois

## 🚀 Déploiement

Le déploiement est automatique via Git :

```bash
git add netlify/functions/
git commit -m "Update functions"
git push
```

Netlify va automatiquement :
1. Détecter les changements
2. Compiler TypeScript → JavaScript
3. Bundler avec esbuild
4. Déployer sur le CDN Edge

---

**Questions ?** Voir [EMAIL_SETUP.md](../../EMAIL_SETUP.md) pour la configuration des emails.
