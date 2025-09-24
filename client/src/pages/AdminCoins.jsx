import React, { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2, Edit3, RefreshCw } from "lucide-react";
import {
  listCoinSettings,
  createCoinSetting,
  updateCoinSetting,
  deleteCoinSetting,
} from "../services/walletService.js";

export default function AdminCoins() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "LIT Coin",
    symbol: "LIT",
    coinToCurrencyRate: 1,
    maxDiscountPercentPerPurchase: 100,
    isMintingEnabled: true,
  });
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm({
      name: "LIT Coin",
      symbol: "LIT",
      coinToCurrencyRate: 1,
      maxDiscountPercentPerPurchase: 100,
      isMintingEnabled: true,
    });
    setEditingId(null);
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await listCoinSettings();
      setSettings(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateCoinSetting(editingId, form);
      } else {
        await createCoinSetting(form);
      }
      await fetchSettings();
      resetForm();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name ?? "",
      symbol: item.symbol ?? "",
      coinToCurrencyRate: item.coinToCurrencyRate ?? 1,
      maxDiscountPercentPerPurchase: item.maxDiscountPercentPerPurchase ?? 100,
      isMintingEnabled: !!item.isMintingEnabled,
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this coin setting?")) return;
    try {
      await deleteCoinSetting(id);
      await fetchSettings();
      if (editingId === id) resetForm();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl sm:text-2xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Coins
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Create, update and delete platform coin settings
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-1 p-4 rounded-xl border"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border)",
          }}
        >
          <h3
            className="text-lg font-medium mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {editingId ? "Edit Coin" : "Create Coin"}
          </h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md px-3 py-2 border"
                style={{
                  background: "var(--bg-primary)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Symbol
              </label>
              <input
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                className="w-full rounded-md px-3 py-2 border"
                style={{
                  background: "var(--bg-primary)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Coin to Currency Rate
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.coinToCurrencyRate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coinToCurrencyRate: Number(e.target.value),
                  })
                }
                className="w-full rounded-md px-3 py-2 border"
                style={{
                  background: "var(--bg-primary)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Max Discount % per Purchase
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.maxDiscountPercentPerPurchase}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxDiscountPercentPerPurchase: Number(e.target.value),
                  })
                }
                className="w-full rounded-md px-3 py-2 border"
                style={{
                  background: "var(--bg-primary)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="minting"
                type="checkbox"
                checked={form.isMintingEnabled}
                onChange={(e) =>
                  setForm({ ...form, isMintingEnabled: e.target.checked })
                }
              />
              <label
                htmlFor="minting"
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Minting enabled
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border"
                style={{
                  background: "var(--brand)",
                  borderColor: "var(--brand)",
                  color: "white",
                }}
              >
                <Save size={16} /> {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border"
                  style={{
                    background: "var(--bg-primary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div
          className="lg:col-span-2 p-4 rounded-xl border"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              All Coins
            </h3>
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {settings.length} items
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr
                  className="text-left"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Symbol</th>
                  <th className="py-2 pr-4">Rate</th>
                  <th className="py-2 pr-4">Max Discount %</th>
                  <th className="py-2 pr-4">Minting</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-6 text-center"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Loading...
                    </td>
                  </tr>
                ) : settings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-6 text-center"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      No coin settings found
                    </td>
                  </tr>
                ) : (
                  settings.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td
                        className="py-2 pr-4"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.name}
                      </td>
                      <td
                        className="py-2 pr-4"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.symbol}
                      </td>
                      <td
                        className="py-2 pr-4"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.coinToCurrencyRate}
                      </td>
                      <td
                        className="py-2 pr-4"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.maxDiscountPercentPerPurchase}%
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            item.isMintingEnabled
                              ? "bg-green-500/20 text-green-600"
                              : "bg-red-500/20 text-red-600"
                          }`}
                        >
                          {item.isMintingEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEdit(item)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-md border"
                            style={{
                              background: "var(--bg-primary)",
                              borderColor: "var(--border)",
                              color: "var(--text-primary)",
                            }}
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => onDelete(item._id)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-md border"
                            style={{
                              background: "#2b1a1a",
                              borderColor: "var(--border)",
                              color: "#fca5a5",
                            }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
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
