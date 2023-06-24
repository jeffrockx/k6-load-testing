import http from 'k6/http'; // Módulo que permite realizar as requisições http.
import { check } from 'k6'; // Módulo que permite realizar validações

export const options = {
    vus: 1,
    duration: '3s',
    thresholds: {
        http_req_failed: ['rate < 0.01'], // Aqui estamos definindo que a taxa de falhas para este teste seja inferior a 1%
        http_req_duration: [
            {
                threshold: 'p(95) < 200', // Aqui estamos definindo que 95% das requisições terão que ser abaixo de 200ms
                abortOnFail: true // Aqui estamos definindo que os testes serão abortados caso esse limite seja rompido
            }
        ],
        checks: ['rate > 0.9'] // Aqui estamos definindo um limite vinculado a métrica de verificação configurada na etapa de execução
    }
}

export default function () {
    // Precisamos armazenar a resposta da requisição
    const res = http.get('http://test.k6.io')
    check(res, {
        'Status code é 200': (r) => r.status === 200
    })
}