
export const sendBeacon = (dsn: string, body: string) => {
  if (typeof navigator === 'undefined') return
  navigator.sendBeacon && navigator.sendBeacon(dsn, body)
}

export const fetch = (dsn: string, body: string) => {
  // @ts-ignore
  fetch(dsn, {
    body,
    method: 'POST',
    keepalive: true
  });
}


export const xhr = (dsn: string, body: string) => {
  const client = new XMLHttpRequest()
  client.open('POST', dsn, false) // third parameter indicates sync xhr
  client.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8')
  client.send(body)
}
