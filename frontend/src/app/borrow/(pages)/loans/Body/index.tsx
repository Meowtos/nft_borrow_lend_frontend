"use client"
export function Body() {
    return (
        <>
            {/* Live/Current loans */}
            <h4>Current Loans</h4>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th className="text-end">Status</th>
                        <th className="text-end">Lender</th>
                        <th className="text-end">Duration</th>
                        <th className="text-end">Loan Value</th>
                        <th className="text-end">APR</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Legendsnft</td>
                        <td><p className="off-status">live</p></td>
                        <td className="text-end">Devil</td>
                        <td className="text-end">5 days</td>
                        <td className="text-end">20APT</td>
                        <td className="text-end">30%</td>
                    </tr>
                    <tr>
                        <td>Legendsnft</td>
                        <td><p className="off-status">live</p></td>
                        <td className="text-end">Devil</td>
                        <td className="text-end">5 days</td>
                        <td className="text-end">20APT</td>
                        <td className="text-end">30%</td>
                    </tr>
                    <tr>
                        <td>Legendsnft</td>
                        <td><p className="off-status">live</p></td>
                        <td className="text-end">Devil</td>
                        <td className="text-end">5 days</td>
                        <td className="text-end">20APT</td>
                        <td className="text-end">30%</td>
                    </tr>
                </tbody>
            </table>


            {/* Previous Loans */}
            <h4 className="mt-5">Previous Loans</h4>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th className="text-end">Status</th>
                        <th className="text-end">Lender</th>
                        <th className="text-end">Duration</th>
                        <th className="text-end">Loan Value</th>
                        <th className="text-end">APR</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Apes</td>
                        <td><p className="off-status">completed</p></td>
                        <td className="text-end">Devil</td>
                        <td className="text-end">5 days</td>
                        <td className="text-end">20APT</td>
                        <td className="text-end">30%</td>
                    </tr>
                    <tr>
                        <td>Legendsnft</td>
                        <td><p className="off-status">completed</p></td>
                        <td className="text-end">Devil</td>
                        <td className="text-end">5 days</td>
                        <td className="text-end">20APT</td>
                        <td className="text-end">30%</td>
                    </tr>
                    <tr>
                        <td>Apes</td>
                        <td><p className="off-status">completed</p></td>
                        <td className="text-end">Devil</td>
                        <td className="text-end">5 days</td>
                        <td className="text-end">20APT</td>
                        <td className="text-end">30%</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}