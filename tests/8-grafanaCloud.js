import http from 'k6/http'
import { sleep } from 'k6'

export const options = {
    vus: 10,
    duration: '30s',
    ext: {
        loadimpact: {
            // Project: Default project
            projectID: 3647212,
            // Test runs with the same name groups test runs together
            name: 'Grafana Cloud'
        }
    }
};

export default function () {
    http.get('http://test.k6.io')
    sleep(1)
}