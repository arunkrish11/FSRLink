"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Order } from "@/src/types/order";

export default function OrderForm() {
  const [form, setForm] = useState<Order>({
    customerName: "",
    place: "",
    item: "",
    quantity: 1,
    total: 0,
  });

  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data?.id) setSubmittedId(data.id);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Order Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Customer Name"
        />

        <input
          type="text"
          name="place"
          value={form.place}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Place Name"
        />

        <input
          type="text"
          name="item"
          value={form.item}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Item Name"
        />

        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Quantity"
        />

        <input
          type="number"
          name="total"
          value={form.total}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Total"
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded cursor-pointer "
        >
          Submit Order
        </button>
      </form>

{submittedId && (
  <div className="mt-4">
    <p className="p-3 bg-green-100 text-green-700 rounded">
      Order saved. ID: {submittedId}
    </p>

    <a
      href={`/api/orders/${submittedId}`}
      target="_blank"
      className="mt-2 inline-block bg-black text-white px-4 py-2 rounded"
    >
      Download Receipt
    </a>
  </div>
)}

    </div>
  );
}
