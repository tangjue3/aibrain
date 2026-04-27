import type { WsMessage } from './types/websocket'

type MessageHandler = (payload: any) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string = ''
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private heartbeatInterval: number | null = null
  private handlers: Map<string, Set<MessageHandler>> = new Map()
  private messageQueue: WsMessage[] = []
  private isOpen = false
  private fallbackToPolling = false
  private pollingTimer: number | null = null

  connect(url: string = '/ws') {
    this.url = url
    this.doConnect()
  }

  private doConnect() {
    if (this.ws?.readyState === WebSocket.OPEN) return

    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      this.isOpen = true
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.flushQueue()
    }

    this.ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data)
        const handlers = this.handlers.get(msg.type)
        if (handlers) {
          handlers.forEach((h) => h(msg.payload))
        }
      } catch (e) {
        console.error('[WS] Parse error:', e)
      }
    }

    this.ws.onclose = () => {
      this.isOpen = false
      this.stopHeartbeat()
      this.reconnect()
    }

    this.ws.onerror = (e) => {
      console.error('[WS] Error:', e)
    }
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[WS] Max reconnect reached, switching to HTTP polling')
      this.fallbackToPolling = true
      this.startPolling()
      return
    }
    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000)
    setTimeout(() => this.doConnect(), delay)
  }

  private startHeartbeat() {
    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }))
      }
    }, 15000)
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private flushQueue() {
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift()!
      this.sendRaw(msg)
    }
  }

  private startPolling() {
    this.pollingTimer = window.setInterval(async () => {
      try {
        const { default: http } = await import('./http')
        const data = await http.get('/poll/status') as any
        if (data?.messages) {
          data.messages.forEach((m: WsMessage) => {
            const handlers = this.handlers.get(m.type)
            handlers?.forEach((h) => h(m.payload))
          })
        }
      } catch (e) {
        // ignore polling errors
      }
    }, 30000)
  }

  private sendRaw(msg: WsMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg))
    } else {
      this.messageQueue.push(msg)
    }
  }

  send(type: string, payload: any = {}) {
    this.sendRaw({
      type,
      payload,
      timestamp: Date.now()
    })
  }

  onMessage(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    this.handlers.get(type)!.add(handler)
    return () => {
      this.handlers.get(type)?.delete(handler)
    }
  }

  disconnect() {
    this.stopHeartbeat()
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer)
    }
    this.ws?.close()
    this.handlers.clear()
  }

  get isConnected() {
    return this.isOpen
  }

  get isWeakNetwork() {
    return this.fallbackToPolling
  }
}

export const wsClient = new WebSocketClient()
export default wsClient
