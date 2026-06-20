import { TOKEN_KEY } from './Constant';

function getAuthHeaders() {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

async function handleResponse(response) {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        const error = (data && (data.message || data.error)) || response.statusText || 'Something went wrong';
        throw new Error(error);
    }
    return data;
}

export async function apiGet(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
}

export async function apiPost(url, body) {
    const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(response);
}

export async function apiPut(url, body) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(response);
}

export async function apiDelete(url) {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => null);
        const error = (data && (data.message || data.error)) || response.statusText || 'Something went wrong';
        throw new Error(error);
    }
    return true;
}
