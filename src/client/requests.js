const baseURL = 'http://localhost:8080/api/1.0';

export async function getRequest(url, options = {}) {
  let fullUrl = baseURL + url;

  const token = localStorage.getItem('token');

  if (options.params) {
    const query = new URLSearchParams(options.params).toString();
    fullUrl += `?${query}`;
  }

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text(); 
}

export async function postRequest(url, data, options = {}) {
  let fullUrl = baseURL + url;

  const token = localStorage.getItem('token');


  if (options.params) {
    const query = new URLSearchParams(options.params).toString();
    fullUrl += `?${query}`;
  }

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}


export async function putRequest(url, data, options = {}) {
  let fullUrl = baseURL + url;

  const token = localStorage.getItem('token');

  if (options.params) {
    const query = new URLSearchParams(options.params).toString();
    fullUrl += `?${query}`;
  }

  const response = await fetch(fullUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}


export async function deleteRequest(url, options = {}) {
    let fullUrl = baseURL + url;

    const token = localStorage.getItem('token');

    if (options.params) {
        const query = new URLSearchParams(options.params).toString();
        fullUrl += `?${query}`;
    }

    const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }        return response.json();
    });
};

export async function postRequestBlob(url, data, options = {}) {
  let fullUrl = baseURL + url;

  if (options.params) {
    const query = new URLSearchParams(options.params).toString();
    fullUrl += `?${query}`;
  }

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.blob();
}

export async function postRequestLogin(url, data, options = {}) {

  if (options.params) {
    const query = new URLSearchParams(options.params).toString();
    url += `?${query}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
