// Test script pour vérifier l'intégration frontend-backend
const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function testBackendIntegration() {
    console.log('🧪 Test d\'intégration Frontend-Backend');
    console.log('=====================================\n');

    try {
        // Test 1: Inscription
        console.log('1️⃣ Test d\'inscription...');
        const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'testuser2',
                email: 'test2@example.com',
                password: 'TestPass123!'
            })
        });
        
        const registerData = await registerResponse.json();
        console.log('✅ Inscription:', registerResponse.status === 201 ? 'SUCCÈS' : 'ÉCHEC');
        console.log('   Réponse:', registerData.message || 'Erreur');
        
        // Test 2: Connexion (avec un utilisateur existant)
        console.log('\n2️⃣ Test de connexion...');
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'superadmin',
                password: 'admin123'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log('✅ Connexion:', loginResponse.status === 200 ? 'SUCCÈS' : 'ÉCHEC');
        
        if (loginResponse.ok) {
            const token = loginData.access;
            console.log('   Token reçu:', token ? 'OUI' : 'NON');
            
            // Test 3: Accès au profil (authentifié)
            console.log('\n3️⃣ Test d\'accès au profil...');
            const profileResponse = await fetch(`${API_BASE_URL}/auth/profil`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            const profileData = await profileResponse.json();
            console.log('✅ Profil:', profileResponse.status === 200 ? 'SUCCÈS' : 'ÉCHEC');
            console.log('   Données:', profileData.user || 'Erreur');
            
            // Test 4: Gestion des rôles (superadmin)
            console.log('\n4️⃣ Test de gestion des rôles...');
            const rolesResponse = await fetch(`${API_BASE_URL}/auth/roles`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            const rolesData = await rolesResponse.json();
            console.log('✅ Rôles:', rolesResponse.status === 200 ? 'SUCCÈS' : 'ÉCHEC');
            console.log('   Nombre d\'utilisateurs:', rolesData.data?.length || 0);
        }
        
        // Test 5: Réinitialisation de mot de passe
        console.log('\n5️⃣ Test de réinitialisation de mot de passe...');
        const resetResponse = await fetch(`${API_BASE_URL}/auth/password-reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com'
            })
        });
        
        const resetData = await resetResponse.json();
        console.log('✅ Reset password:', resetResponse.status === 200 ? 'SUCCÈS' : 'ÉCHEC');
        console.log('   Message:', resetData.detail || 'Erreur');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error.message);
    }
    
    console.log('\n🏁 Test terminé');
}

// Exécuter le test
testBackendIntegration();
