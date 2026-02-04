# 📧 Guide d'installation du workflow n8n - Confirmation de rendez-vous

Ce workflow permet de contourner les limitations de Resend (compte gratuit) en envoyant les emails de confirmation via Gmail SMTP.

---

## 📋 Prérequis

1. **Compte n8n** (gratuit)
   - Option 1: n8n Cloud → https://n8n.io/cloud
   - Option 2: Self-hosted → https://docs.n8n.io/hosting/

2. **Compte Gmail** (existant)
   - `camilleosteopatia@gmail.com`

3. **Accès à la base de données PostgreSQL** (Prisma Postgres)
   - URL: Déjà configurée dans les variables d'environnement

---

## 🚀 Installation en 5 étapes

### **Étape 1: Importer le workflow dans n8n**

1. Connectez-vous à votre compte n8n
2. Cliquez sur **"+ Add workflow"**
3. Menu **"..."** (trois points) → **"Import from File"**
4. Sélectionnez le fichier `confirm-appointment.json`
5. Le workflow apparaît avec 8 nœuds

---

### **Étape 2: Configurer PostgreSQL**

1. Cliquez sur le nœud **"Get Appointment from DB"**
2. Dans "Credential to connect with", cliquez **"Create New Credential"**
3. Remplissez les informations:
   ```
   Credential Name: Prisma PostgreSQL
   Host: db.prisma.io
   Port: 5432
   Database: postgres
   User: 635eb7cf7273c02d09d58aa64ae2742bea5fcbe01a4a40f330203b6b9e1b5347
   Password: sk_IKNJ5NExWBAQpqdhIJ9Cm
   SSL: Enabled
   ```
4. Cliquez **"Save"**
5. **Testez la connexion** en cliquant sur "Test"

> ✅ **Important**: Répétez pour le nœud **"Update Status to CONFIRMED"** (sélectionnez la même credential)

---

### **Étape 3: Configurer Gmail OAuth**

1. Cliquez sur le nœud **"Send Confirmation Email"**
2. Dans "Credential to connect with", cliquez **"Create New Credential"**
3. Sélectionnez **"Gmail OAuth2"**
4. Cliquez **"Connect my account"**
5. Connectez-vous avec **camilleosteopatia@gmail.com**
6. Autorisez n8n à envoyer des emails
7. Cliquez **"Save"**

> 📧 Les emails seront envoyés depuis `camilleosteopatia@gmail.com`

---

### **Étape 4: Activer et tester le workflow**

1. Cliquez sur le bouton **"Active"** en haut à droite (passer de OFF à ON)
2. Cliquez sur le nœud **"Webhook Confirmation"**
3. Copiez l'URL du webhook (quelque chose comme):
   ```
   https://votre-instance.app.n8n.cloud/webhook/confirm-appointment
   ```
4. **Testez le webhook**:
   - Ouvrez un nouvel onglet
   - Allez sur: `https://votre-webhook-url?id=TEST_ID`
   - Vous devriez voir "Rendez-vous introuvable" (normal, l'ID n'existe pas)

---

### **Étape 5: Modifier le code Next.js pour utiliser le webhook**

Modifiez le fichier `lib/email-templates/camille-notification.ts`:

**Ligne à modifier (environ ligne 80):**

```typescript
// AVANT (API Next.js):
const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/reservations/${id}/confirm`;
const refuseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/reservations/${id}/refuse`;

// APRÈS (Webhook n8n):
const confirmUrl = `https://votre-instance.app.n8n.cloud/webhook/confirm-appointment?id=${id}`;
const refuseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/reservations/${id}/refuse`;
```

**Remplacez** `https://votre-instance.app.n8n.cloud` par **votre URL webhook réelle**.

---

## ✅ Vérification finale

### **Test complet du flux:**

1. **Créez un rendez-vous de test** via le formulaire
2. **Vérifiez** que vous recevez l'email de notification (à adpromo.media@gmail.com)
3. **Cliquez sur "Accepter le rendez-vous"**
4. **Vérifiez**:
   - ✅ Page de confirmation "Rendez-vous confirmé !" s'affiche
   - ✅ Email de confirmation envoyé au patient (vérifiez dans Gmail "Envoyés")
   - ✅ Statut mis à jour en BDD (vérifiez dans Prisma Studio)

---

## 🎨 Personnalisation

### **Modifier le template d'email:**

Dans le nœud **"Format Email Content"**, vous pouvez modifier:
- Les couleurs (cherchez `#10b981` pour le vert)
- Le texte (dans les objets `emailContent.fr`, `.pt`, `.en`)
- Le footer (adresse, téléphone)

### **Ajouter d'autres langues:**

Ajoutez une nouvelle clé dans `emailContent`:
```javascript
es: {
  subject: `✅ Cita confirmada - ${formattedDate}`,
  greeting: `Hola ${appointment.patientName},`,
  // ... etc
}
```

---

## 🐛 Dépannage

### **Le webhook ne fonctionne pas:**
- Vérifiez que le workflow est **activé** (bouton Active = ON)
- Testez l'URL directement dans le navigateur avec `?id=test`

### **Email non envoyé:**
- Vérifiez que Gmail OAuth est bien connecté
- Regardez les logs d'exécution dans n8n (onglet "Executions")
- Vérifiez que l'email du patient est valide

### **Erreur PostgreSQL:**
- Vérifiez que les credentials sont corrects
- Testez la connexion dans le nœud PostgreSQL

---

## 📊 Monitoring

### **Voir les exécutions:**
1. Dans n8n, allez dans **"Executions"**
2. Vous verrez toutes les confirmations de rendez-vous
3. Cliquez sur une exécution pour voir les détails

### **Statistiques:**
- Nombre de confirmations envoyées
- Taux de succès
- Emails envoyés par jour

---

## 🔐 Sécurité

### **Webhook sécurisé:**

Pour ajouter une authentification au webhook:

1. Dans le nœud **"Webhook Confirmation"**:
   - Ajoutez un paramètre `Authentication`: **Header Auth**
   - Name: `x-api-key`
   - Value: `votre-cle-secrete-ici`

2. Modifiez l'URL dans Next.js:
   ```typescript
   const confirmUrl = `https://votre-webhook?id=${id}`;

   // Ajoutez le header dans la requête
   headers: {
     'x-api-key': 'votre-cle-secrete-ici'
   }
   ```

---

## 💰 Coûts

- **n8n Cloud**: Gratuit jusqu'à 5 000 exécutions/mois
- **Gmail**: Gratuit (limite: 500 emails/jour)
- **PostgreSQL Prisma**: Déjà en place

**Total**: 100% gratuit pour vos besoins ! 🎉

---

## 📞 Support

Si vous avez des problèmes:
1. Vérifiez les logs dans n8n (onglet "Executions")
2. Consultez la documentation n8n: https://docs.n8n.io
3. Testez chaque nœud individuellement avec "Execute Node"

---

## 🎯 Prochaines améliorations possibles

- ✉️ Email de rappel 24h avant le rendez-vous
- 📊 Dashboard de statistiques des rendez-vous
- 💬 SMS de confirmation (via Twilio)
- 📅 Synchronisation Google Calendar automatique
- ⏰ Gestion des créneaux disponibles/indisponibles

Tous ces workflows peuvent être créés dans n8n ! 🚀
