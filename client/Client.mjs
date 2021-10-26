import Events from 'events';

import AuthManager from '../managers/AuthManager';
import FastifyManager from '../managers/FastifyManager';

/**
 * The main hub for interacting with the Discord API
 * @extends {Events}
 * @example
 * const client = new Client({
 *   clientId: process.env.CLIENT_ID,
 *   clientSecret: process.env.CLIENT_SECRET,
 *   host: process.env.HOST,
 *   port: process.env.PORT,
 *   publicKey: process.env.PUBLIC_KEY,
 * });
 *
 * client.on('commandInteraction', console.log);
 */
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
