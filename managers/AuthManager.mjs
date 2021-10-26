import Got from 'got';

export default class AuthManager {
  constructor(client, clientSecret) {
    Object.defineProperties(
      this,
      {
        /**
         * The authorization header
         * @name AuthManager#authorization
         * @readonly
         * @type {?string}
         */
        authorization: { configurable: true, enumerable: true, value: null },

        /**
         * The client that this auth manager belongs to
         * @name AuthManager#client
         * @readonly
         * @type {Client}
         */
        client: { configurable: false, enumerable: true, value: client },

        /**
         * The client secret used for authorization
         * @name AuthManager#clientSecret
         * @readonly
         * @type {string}
         */
        clientSecret: { configurable: false, enumerable: true, value: clientSecret },

        /**
         * Whether the auth manager is ready - has a token
         * @name AuthManager#ready
         * @readonly
         * @type {boolean}
         */
        ready: {
          configurable: false,
          enumerable: true,
          get() {
            return this.authorization !== null;
          },
        },
      },
    );
  }

  /**
   * Get an authorization header
   * @async
   * @public
   * @returns {undefined}
   */
  async start() {
    try {
      const token = await Got.post(
        new URL('api/oauth2/token', 'https://discord.com/'),
        {
          form: {
            client_id: this.client.clientId,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials',
            scope: 'applications.commands.update',
          },
        },
      ).json();

      Object.defineProperties(
        this,
        {
          authorization: {
            configurable: false,
            enumerable: true,
            value: `${token.token_type} ${token.access_token}`,
          },
        },
      );
    } catch (error) {
      this.client.emit('authManagerError', error);

      throw error;
    }

    return this;
  }
}
