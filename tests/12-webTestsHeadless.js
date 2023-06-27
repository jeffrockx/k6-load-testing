import { chromium } from 'k6/experimental/browser' // https://k6.io/docs/javascript-api/k6-experimental/browser/

export const options = {
    vus: 1,
    duration: '5s'
}

// Para testes web, precisamos informar que a função é assíncrona
export default async function () {
    /*Definimos a formma como o browser será executado, para isso informando headless como true ou false
    em CI sempre devemos executar em modo headless como true, para que não seja aberta uma janela com o navegador e haja consumo excessivo de recurso*/
    const browser = chromium.launch({ headless: true })
    const context = browser.newContext() // Definimos que vamos abrir um browser e vamos iniciar uma inspeção
    const page = context.newPage() // Página que será carregada

    try {
        await page.goto('https://test.k6.io/my_messages.php', { waitUntil: 'networkidle' }) // Visitamos a página e aguardamos o tempo padrão que o navegador aguarda requisições
        page.locator('input[name="login"]').type('admin')
        page.locator('input[name="password"]').type('123')


    } finally {
        page.close() // Caso haja algum erro, o borwser será fechado
        browser.close() // Fecha o navegador
    }

}