import requests
import time

BASE = 'http://127.0.0.1:8000'

def login(email, password, role=None):
    payload = {'email': email, 'password': password}
    if role:
        payload['role'] = role
    r = requests.post(f'{BASE}/auth/login', json=payload)
    r.raise_for_status()
    return r.json()['token'], r.json()['user']

def create_request(token):
    headers = {'Authorization': f'Bearer {token}'}
    payload = {
        'title': 'E2E Test Item',
        'category': 'Moveis',
        'item_description': 'Teste e2e',
        'dropoff_address': 'Rua Teste, 1',
        'distance_km': 5.0,
        'eta_minutes': 15,
        'price': 49.9,
        'helper_required': False,
    }
    r = requests.post(f'{BASE}/client/requests', json=payload, headers=headers)
    r.raise_for_status()
    return r.json()

def accept_request(token, request_id):
    headers = {'Authorization': f'Bearer {token}'}
    r = requests.post(f'{BASE}/driver/requests/{request_id}/accept', headers=headers)
    r.raise_for_status()
    return r.json()

def complete_request(token, request_id):
    headers = {'Authorization': f'Bearer {token}'}
    r = requests.post(f'{BASE}/driver/requests/{request_id}/complete', headers=headers)
    r.raise_for_status()
    return r.json()

if __name__ == '__main__':
    print('Logging in client...')
    client_token, client_user = login('cliente.teste@levaleve.com', 'Cliente123!', role='client')
    print('Creating request...')
    req = create_request(client_token)
    request_id = req['id']
    print('Request created:', request_id)
    print('Logging in driver...')
    driver_token, driver_user = login('motorista.teste@levaleve.com', 'Motorista123!', role='driver')
    print('Driver accepting request...')
    acc = accept_request(driver_token, request_id)
    print('Accepted:', acc['request']['status'])
    time.sleep(0.5)
    print('Driver completing request...')
    comp = complete_request(driver_token, request_id)
    print('Completed:', comp['request']['status'])
    print('E2E flow done')
