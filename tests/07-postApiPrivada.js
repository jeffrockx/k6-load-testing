import http from 'k6/http'
import { check, sleep } from 'k6'
import { userData } from '../fixtures/data.js'

export const options = {
    stages: [
        { duration: '1s', target: 1 } // 100 usuários por 10 segundos
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
        username: '0.32790148289724097@mail.com',
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
        },
    }

    // Definimos o body ra requisição 
    const user = userData()
    const payload = JSON.stringify(user) // https://k6.io/docs/using-k6/http-requests/

    const res = http.post(`${BASE_URL}/my/crocodiles/`, payload, params) // https://k6.io/docs/javascript-api/k6-http/post/

    check(res, {
        'Status code 201': (r) => r.status === 201
    })

    sleep(1)

}