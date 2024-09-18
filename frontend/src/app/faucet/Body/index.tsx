"use client"
export function Body() {
    return (
        <section className="inner-banner">
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="card shadow-lg p-4">
                        <h3 className="text-center mb-4">Faucet Request</h3>
                        <form id="faucetForm">
                            <div className="mb-3">
                                <label htmlFor="walletAddress" className="form-label">Wallet Address</label>
                                <input type="text" className="form-control" id="walletAddress" placeholder="Enter your wallet address" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tokenSelect" className="form-label">Select Token</label>
                                <select className="form-select" id="tokenSelect" required>
                                    <option value="" disabled selected>Select a token</option>
                                    <option value="token1">Token 1</option>
                                    <option value="token2">Token 2</option>
                                </select>
                            </div>
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-primary">Request Token</button>
                            </div>
                            <div id="responseMessage" className="mt-3 text-center"></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </section>
    )
}