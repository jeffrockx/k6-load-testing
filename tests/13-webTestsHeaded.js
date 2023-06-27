import { chromium } from 'k6/experimental/browser' // https://k6.io/docs/javascript-api/k6-experimental/browser/
import { check } from 'k6'

export const options = {
    vus: 3,
    duration: '5s',
    thresholds: {
        checks: ['rate > 0.99']
    }
}

// Para testes web, precisamos informar que a função é assíncrona
export default async function () {
    /*Definimos a formma como o browser será executado, para isso informando headless como true ou false
    em CI sempre devemos executar em modo headless como true, para que não seja aberta uma janela com o navegador e haja consumo excessivo de recurso*/
    const browser = chromium.launch({ headless: false })
    const context = browser.newContext() // Definimos que vamos abrir um browser e vamos iniciar uma inspeção
    const page = context.newPage() // Página que será carregada

    try {
        await page.goto('https://test.k6.io/', { waitUntil: 'networkidle' }) // Visitamos a página e aguardamos o tempo padrão que o navegador aguarda requisições

        await Promise.all([
            page.waitForNavigation(), // Aguarda a navegação para a página
            page.locator('a[href="/my_messages.php"]').click() // Procura por este link e clica para acessar a página
        ])

        // Preenche os dados de login
        page.locator('input[name="login"]').type('admin')
        page.locator('input[name="password"]').type('123')

        await Promise.all([
            page.waitForNavigation(),
            page.locator('input[type="submit"]').click() // Clica no botão para logar
        ])

        // Validação
        check(page, {
            'header': page.locator('h2').textContent() == 'Welcome, admin!'
        })


    } finally {
        // Caso haja algum erro, fecha a página e o navegador.
        page.close()
        browser.close()
    }

}