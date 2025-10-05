import frappe


@frappe.whitelist()
def get_cash_balances():
    """
    Return merged cash balances for internal and external accounts.
    Internal accounts include profit balance.
    Display names are cleaned: remove 'خزنة' and '- A'.
    """
    try:
        settings = frappe.get_single("Transfer Setting")
    except frappe.DoesNotExistError:
        frappe.log_error("Transfer Setting not found", "Alzawia Reports Error")
        return []

    company = (
        frappe.defaults.get_global_default("company")
        or frappe.get_all("Company", limit=1)[0].name
    )

    balances_dict = {}  # key: base account name, value: merged dict

    def get_balance(account):
        if not account:
            return 0
        res = frappe.db.sql(
            """
            SELECT IFNULL(SUM(debit),0) - IFNULL(SUM(credit),0)
            FROM `tabGL Entry`
            WHERE account=%s AND company=%s
        """,
            (account, company),
        )
        return res[0][0] if res else 0

    all_accounts = (settings.get("internal") or []) + (settings.get("external") or [])

    for row in all_accounts:
        account = row.cash_account
        if not account:
            continue

        account_data = frappe.db.get_value(
            "Account", account, ["account_name", "account_currency"], as_dict=True
        )
        if not account_data:
            continue

        # Clean display name
        base_name = (
            account_data.account_name.replace("- خزنة", "")
            .replace("- A", "")
            .strip()
        )
        balance = get_balance(account)
        profit_balance = (
            get_balance(getattr(row, "profit_account", None))
            if getattr(row, "profit_account", None)
            else 0
        )
        acc_type = "Internal" if row in (settings.get("internal") or []) else "External"

        if base_name in balances_dict:
            # Merge balances for same base name
            balances_dict[base_name]["balance"] += balance
            balances_dict[base_name]["profit_balance"] += profit_balance
        else:
            balances_dict[base_name] = {
                "account": account,
                "account_name": base_name,
                "currency": account_data.account_currency or "LYD",
                "balance": balance,
                "type": acc_type,
                "profit_balance": profit_balance,
            }

    return list(balances_dict.values())
