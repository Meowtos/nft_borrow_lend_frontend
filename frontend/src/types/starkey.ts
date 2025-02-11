import { TxnBuilderTypes } from "supra-l1-sdk"
type TypeTag = TxnBuilderTypes.TypeTag;
/**
 * Represents the Optional transaction options.
 */
export interface OptionalTransactionPayloadArgs {
  maxGas?: number
  gasUnitPrice?: number
  txExpiryTime?: number
}

/**
 * Represents the transaction status.
 */
export enum TransactionStatus {
  Success = 'Success',
  Failed = 'Failed',
  Pending = 'Pending'
}

/**
 * Parameters for sending a transaction.
 */
export interface SendTransactionParams {
  from: string
  to: string
  value: string | number
  data?: string
  chainId?: string
}

/**
 * Represents the balance information.
 */
export interface Balance {
  balance: number
  formattedBalance: string
  decimal: number
  displayUnit: string
}

/**
 * Parameters for signing a message.
 */
export interface SignMessageParams {
  message: string
  nonce?: string
}

/**
 * Represents transaction hash.
 */
export interface TransactionHash {
  txHash: string
}

/**
 * Represents the response from a signed message.
 */
export interface SignMessageResponse {
  publicKey: string
  signature: string
  address: string
}

export type RawTxPayload = [
  string, // sender address
  number, // sender sequence number
  string, // module address
  string, // module name
  string, // function name
  TypeTag[], // function type arguments
  Uint8Array[], // function arguments
  OptionalTransactionPayloadArgs? // optional transaction payload arguments
]

/**
 * Defines the StarkeyProvider interface.
 */
export interface StarkeyProvider {
  connect(): Promise<string[]>
  disconnect(): Promise<void>
  account(): Promise<string[]>
  currentNetwork: string | null
  getChainId(): Promise<{ chainId: string } | null>
  sendTransaction(tx: SendTransactionParams): Promise<string>

  /**
   * Signs a message with the Starkey wallet.
   * Partially documented method.
   * @param params - The parameters required for signing a message.
   */
  signMessage(params: SignMessageParams): Promise<SignMessageResponse>

  /**
   * Signs a message with the Starkey wallet.
   * Partially documented method.
   * @param params - The parameters required for signing a message.
   */
  signMessageRaw(params: SignMessageParams): Promise<SignMessageResponse>

  /**
   * Signs and sends a transaction.
   * @param {RawTxPayload} RawTxPayload - The raw tx params object.
   * @param {string | number} [value=''] - The value to send with the transaction (optional).
   */
  signAndSendTransaction(
    rawTxPayload: RawTxPayload,
    value: string | number
  ): Promise<string>

  /**
   * Wait for a transaction by its txhash
   * @param txHash - Transaction hash.
   */
  waitForTransactionWithResult(txHash: string): Promise<null>

  /**
   * Creates raw transaction data.
   * @param params - the parameterse for creating Raw Transaction data
   */
  createRawTransactionData(params: RawTxPayload): Promise<string>

  balance(): Promise<Balance>
  getVersion(): Promise<string>
  changeNetwork(options: { chainId: string }): Promise<{ chainId: string }>

  /**
   * Registers a callback for accountChanged events.
   * @param event - The event name.
   * @param handler - The callback function.
   */
  on(event: 'accountChanged', handler: (accounts: string[]) => void): void

  /**
   * Registers a callback for disconnect events.
   * @param event - The event name.
   * @param handler - The callback function.
   */
  on(event: 'disconnect', handler: (info: unknown) => void): void

  /**
   * Registers a callback for networkChanged events.
   * @param event - The event name.
   * @param handler - The callback function.
   */
  on(
    event: 'networkChanged',
    handler: (networkInfo: { chainId: string }) => void
  ): void
}

/**
 * Extended StarkeyProvider interface that includes the 'off' method.
 * Someday Starkey will implement .off :P
 */
export interface StarkeyProviderWithOff extends StarkeyProvider {
  /**
   * Unregisters a callback for accountChanged events.
   * @param event - The event name.
   * @param handler - The callback function to unregister.
   */
  off(event: 'accountChanged', handler: (accounts: string[]) => void): void

  /**
   * Unregisters a callback for disconnect events.
   * @param event - The event name.
   * @param handler - The callback function to unregister.
   */
  off(event: 'disconnect', handler: (info: unknown) => void): void

  /**
   * Unregisters a callback for networkChanged events.
   * @param event - The event name.
   * @param handler - The callback function to unregister.
   */
  off(
    event: 'networkChanged',
    handler: (networkInfo: { chainId: string }) => void
  ): void
}

/**
 * Represents the Starkey object attached to the window.
 */
export interface StarkeyObject {
  supra: StarkeyProvider
  getVersion(): Promise<string>
}