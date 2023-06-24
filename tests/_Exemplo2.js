import http from 'k6/http'; // Módulo que permite realizar as requisições http
import { check } from 'k6'; // Módulo que permite realizar validações
import { Counter } from 'k6/metrics'; // Módulo para configurar métricas do tipo "Contadores"
import { Gauge } from 'k6/metrics'; // Módulo para configurar métricas do tipo "Medidores"
import { Rate } from 'k6/metrics'; // Módulo para configurar métricas do tipo "Taxas"
import { Trend } from 'k6/metrics'; // // Módulo para configurar métricas do tipo "Tendência"

export const options = {
    vus: 1,
    duration: '3s'
}

// A descrição definida aqui será a exibida no console após execução
const chamadas = new Counter('Quantidade de chamadas')
const tempo = new Gauge('Tempo bloqueado')
const taxa = new Rate('Taxa de requisições com status 200')
const tendencia = new Trend('Taxa de espera')

export default function () {
    //Precisamos armazenar a resposta da requisição para utilizar em validações e métricas
    const res = http.get('http://test.k6.io')

    //Validações
    check(res, {
        'Status code é 200': (r) => r.status === 200
    })

    // Métricas
    chamadas.add(1)
    tempo.add(res.timings.blocked)
    taxa.add(res.status === 200)
    tendencia.add(res.timings.waiting)
}