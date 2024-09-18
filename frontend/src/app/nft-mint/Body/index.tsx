"use client"
export function Body() {
    return (
        <section className="inner-banner">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="card shadow-lg p-4">
                            <h3 className="text-center mb-4 text-white">NFT mint Request</h3>
                            <form id="faucetForm">
                                <div className="mb-3">
                                    <label htmlFor="tokenSelect" className="form-label">Select Token Type</label>
                                    <select className="form-select" id="tokenSelect" required>
                                        <option value="" disabled selected>Select a token type</option>
                                        <option value="token1">V1</option>
                                        <option value="token2">V2</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="walletAddress" className="form-label">Token Name</label>
                                    <input type="text" className="form-control" id="walletAddress" placeholder="Enter your token name" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="walletAddress" className="form-label">Icon uri</label>
                                    <input type="text" className="form-control" id="walletAddress" placeholder="Enter your icon url" required />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">Mint</button>
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