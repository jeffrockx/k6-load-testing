import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
    stages: [
        { duration: '10s', target: 100 } // 100 usuários por 10 segundos
    ],
    thresholds: {
        http_req_failed: ['rate < 0.01'], // Falhas de requisições devem ser inferiores a 1%
        http_req_duration: ['p(95) < 250'] // Duração das requisições devem ser inferiores a 250ms
    }
}

const BASE_URL = 'https://test-api.k6.io'

// Realiza requisição para buscar o token de autenticação
export function setup() {
    const loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
        username: '0.6044637714316331@mail.com',
        password: 'user123'
    })

    const token = loginRes.json('access')
    return token
}

// Passamos o token retornado da função anterior para a função de execução
export default function (token) {
    // Definimos parâmetros para a requisição
    const params = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }

    const res = http.get(`${BASE_URL}/my/crocodiles`, params)

    check(res, {
        'Status code 200': (r) => r.status === 200
    })

    sleep(1)

}