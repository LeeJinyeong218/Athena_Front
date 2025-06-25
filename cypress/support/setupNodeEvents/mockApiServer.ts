import { getLocal, type Mockttp } from 'mockttp';

class MockApiServer {
    private readonly server: Mockttp;
    private readonly port: number;
    private isRunning: boolean = false;
    
    constructor() {
      this.server = getLocal();
      this.port = 9000; // < Make sure this matches the port in your custom API_URL env url
    }
    
    reset() {
      if (this.isRunning) {
        this.server.reset();
      }
    }
    
    async start() {
      try {
        if (this.isRunning) {
          console.info(`📡 Mock API server already running on http://localhost:${this.port}`);
          return;
        }
        
        await this.server.start(this.port);
        this.isRunning = true;
        
        this.server
          .forGet('/')
          .thenReply(200, 'Mock API server is up')
          .then(() => {
            console.info(`\n📡 Mock API server running on http://localhost:${this.port}\n`);
          });
      } catch (error) {
        console.error('Failed to start mock API server:', error);
        throw error;
      }
    }
    
    async stop() {
      try {
        if (this.isRunning) {
          await this.server.stop();
          this.isRunning = false;
          console.info(`📡 Mock API server stopped`);
        }
      } catch (error) {
        console.error('Failed to stop mock API server:', error);
      }
    }
    
    mockResponse({ endpoint, data }: { endpoint: string; data: any }) {
      if (!this.isRunning) {
        console.warn('Mock API server is not running. Starting it now...');
        this.start();
      }
      
      this.server
        .forGet(endpoint)
        .thenJson(200, data);
    }
    
    mockErrorResponse({ endpoint, message }: { endpoint: string; message: string }) {
      if (!this.isRunning) {
        console.warn('Mock API server is not running. Starting it now...');
        this.start();
      }
      
      this.server
        .forGet(endpoint)
        .thenJson(500, { error: message });
    }
  }
  
  export default MockApiServer;