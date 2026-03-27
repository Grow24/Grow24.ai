import { EventEmitter } from 'events';

/**
 * Internal pub/sub system for broadcasting sheet update events
 * Uses Node.js EventEmitter for lightweight in-process messaging
 */
class PubSub extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50); // Increase limit for multiple subscribers
  }

  /**
   * Publish a sheet update event
   * @param {string} spreadsheetId - The ID of the updated spreadsheet
   * @param {object} metadata - Additional metadata (optional)
   */
  publishSheetUpdate(spreadsheetId, metadata = {}) {
    console.log(`📢 Publishing sheet.updated event for: ${spreadsheetId}`);
    this.emit('sheet.updated', {
      spreadsheetId,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  }

  /**
   * Subscribe to sheet update events
   * @param {function} handler - Callback function (receives { spreadsheetId, timestamp, ...metadata })
   */
  onSheetUpdate(handler) {
    this.on('sheet.updated', handler);
  }

  /**
   * Unsubscribe from sheet update events
   * @param {function} handler - The handler to remove
   */
  offSheetUpdate(handler) {
    this.off('sheet.updated', handler);
  }
}

// Export singleton instance
export const pubsub = new PubSub();
