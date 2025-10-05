frappe.ready(function () {
    const el = document.getElementById('cash-balances');
    if (!el || el.dataset.loaded) return;  // Prevent multiple executions
    el.dataset.loaded = true;

    el.innerHTML = "";

    frappe.call({
        method: "alzawia_transfer.alzawia_transfer.api.get_cash_balances",
        callback: function (r) {
            const balances = r.message || [];
            if (!balances.length) {
                el.innerHTML = `<p style="color:#888; font-style:italic;">No balances found.</p>`;
                return;
            }

            balances.forEach(acc => {
                const div = document.createElement("div");
                div.className = "balance-card";

                const cash_balance = acc.balance.toLocaleString();
                const profit_balance = acc.profit_balance ? Math.abs(acc.profit_balance).toLocaleString() : null;

                div.innerHTML = `
                    <div class="card-header">${acc.account_name}</div>
                    <div class="card-balance">
                        <span class="balance">${cash_balance} LYD</span>
                    </div>
                    ${profit_balance ? `<div class="card-profit">Profit: +${profit_balance} LYD</div>` : ""}
                `;

                div.onclick = () => {
                    window.location.href = `/app/query-report/تقرير الارصده?account=${encodeURIComponent(acc.account)}`;
                };

                el.appendChild(div);
            });
        },
    });
});
