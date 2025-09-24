import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getUserWallet,
  adminAssignCoins,
  adminRevokeCoins,
} from "../services/walletService.js";

export default function DashboardWallet() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);

  async function load() {
    const uid = user?.id || user?._id;
    if (!uid) return;
    setLoading(true);
    try {
      const data = await getUserWallet(uid);
      setWallet(data?.wallet || null);
      setTransactions(data?.transactions || []);
    } catch (e) {
      console.error("Wallet fetch error", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?._id]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">My Wallet</h2>
        <p className="text-sm text-gray-400">
          View your coin balance and recent activity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card-premium p-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <div className="text-sm text-gray-400 mb-1">Current Balance</div>
              <div className="text-3xl font-bold">
                {wallet?.balance ?? 0} coins
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3 border border-white/10 bg-white/5">
                  <div className="text-xs text-gray-400">Total Assigned</div>
                  <div className="text-lg font-semibold">
                    {wallet?.totalAssigned ?? 0}
                  </div>
                </div>
                <div className="rounded-lg p-3 border border-white/10 bg-white/5">
                  <div className="text-xs text-gray-400">Total Revoked</div>
                  <div className="text-lg font-semibold">
                    {wallet?.totalRevoked ?? 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 card-premium p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Recent Transactions</h3>
            <button
              onClick={load}
              className="text-sm px-3 py-1.5 rounded border border-white/10 hover:bg-white/10"
            >
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Balance After</th>
                  <th className="py-2 pr-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-400">
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t._id} className="border-t border-white/10">
                      <td className="py-2 pr-4">
                        {new Date(t.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 pr-4 capitalize">{t.type}</td>
                      <td className="py-2 pr-4">{t.amount}</td>
                      <td className="py-2 pr-4">{t.balanceAfter}</td>
                      <td className="py-2 pr-4 text-gray-300">
                        {t?.metadata?.reason || t?.metadata?.notes || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
