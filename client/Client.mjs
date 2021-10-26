import Events from 'events';

import AuthManager from '../managers/AuthManager';
import FastifyManager from '../managers/FastifyManager';

export default class Client extends Events {
  constructor(data) {
    super();

    Object.defineProperties(
      this,
      {
        /**
         * The auth manager for this client
         * @name Client#authManager
         * @readonly
         * @type {AuthManager}
         */
        authManager: {
          configurable: false,
          enumerable: true,
          value: new AuthManager(this, data.clientSecret),
        },

        /**
         * The client id
         * @name Client#clientId
         * @readonly
         * @type {string}
         */
        clientId: { configurable: false, enumerable: true, value: data.clientId },

        /**
         * The fastify manager for this client
         * @name Client#fastifyManager
         * @readonly
         * @type {FastifyManager}
         */
        fastifyManager: {
          configurable: false,
          enumerable: true,
          value: new FastifyManager(
            this,
            { host: data.host, port: data.port, publicKey: data.publicKey },
          ),
        },
      },
    );
  }

  /**
   * Start the client:
   * * Start AuthManager
   * * Start FastifyManager
   */
  async start() {
    await Promise.all([
      this.authManager.start(),
      this.fastifyManager.start(),
    ]);

    this.emit('clientReady', this);

    return this;
  }
}
