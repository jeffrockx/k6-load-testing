import http from 'k6/http'
import { check, sleep } from 'k6'
import { SharedArray } from 'k6/data';

export const options = {
    stages: [
        { duration: '5s', target: 5 },
        { duration: '5s', target: 5 },
        { duration: '2s', target: 50 },
        { duration: '2s', target: 50 },
        { duration: '5s', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate < 0.01'],
    }
}

const users = new SharedArray('users', function () {
    const data = JSON.parse(open('../fixtures/users.json'))
    return data
})

export default function () {
    const BASE_URL = 'https://test-api.k6.io'

    // Selecionar um usuário aleatório do arquivo
    const randomUser = users[Math.floor(Math.random() * users.length)]

    console.log(randomUser.email)

    const res = http.post(`${BASE_URL}/auth/token/login/`, {
        username: randomUser.email,
        password: randomUser.senha
    })

    check(res, {
        'Login com sucesso!': (r) => r.status === 200,
        'Token gerado!': (r) => r.json('access') !== ''
    })

    sleep(1)

}