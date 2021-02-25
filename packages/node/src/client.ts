import { BaseClient } from '@sentry/core';
import { Event, EventHint, Options, Severity } from '@sentry/types';
import { HTTPTransport } from '@sentry/transport-http';

import { eventFromException, eventFromMessage } from './eventbuilder';

/**
 * Configuration options for the Sentry Node SDK.
 * @see NodeClient for more information.
 */
export interface NodeOptions extends Options {
  /** Sets an optional server name (device name) */
  serverName?: string;

  /** Maximum time in milliseconds to wait to drain the request queue, before the process is allowed to exit. */
  shutdownTimeout?: number;

  /** Set a HTTP proxy that should be used for outbound requests. */
  httpProxy?: string;

  /** Set a HTTPS proxy that should be used for outbound requests. */
  httpsProxy?: string;

  /** HTTPS proxy certificates path */
  caCerts?: string;

  /** Sets the number of context lines for each frame when loading a file. */
  frameContextLines?: number;

  /** Callback that is executed when a fatal global error occurs. */
  onFatalError?(error: Error): void;
}

/**
 * The Sentry Node SDK Client.
 *
 * @see NodeOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
export class NodeClient extends BaseClient<NodeOptions> {
  /**
   * Creates a new Node SDK instance.
   * @param options Configuration options for this SDK.
   */
  public constructor(options: NodeOptions) {
    options.transport = options.transport ?? HTTPTransport;
    super(options);
  }

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  protected _eventFromException(exception: any, hint?: EventHint): PromiseLike<Event> {
    return eventFromException(this._options, exception, hint);
  }

  /**
   * @inheritDoc
   */
  protected _eventFromMessage(message: string, level: Severity = Severity.Info, hint?: EventHint): PromiseLike<Event> {
    return eventFromMessage(this._options, message, level, hint);
  }
}
