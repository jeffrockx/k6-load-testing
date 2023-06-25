import http from 'k6/http'
import { check } from 'k6'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js" // Importamos um plugin externo para gerar os relatórios

export const options = {
    vus: 100,
    duration: '1m',
    thresholds: {
        http_req_failed: ['rate < 0.05'],
    }
}

export default function () {
    const BASE_URL = 'https://test-api.k6.io/public/crocodiles/'

    const res = http.get(BASE_URL);

    check(res, {
        'status code 200': (r) => r.status === 200
    })
}

// Na fase de desmontagem adicionamos a função para gerar o relatório que vai receber os dados de saída da fase de execução
export function handleSummary(data) {
    return {
        "index.html": htmlReport(data),
    }
}