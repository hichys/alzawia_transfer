# alzawia_transfer/alzawia_transfer/api.py
import frappe


@frappe.whitelist()
def get_cash_accounts_with_balance():
    """
    Return list of cash accounts from Transfer Setting (internal + external)
    with their closing balance (debit - credit) for the default company.
    """
    company = frappe.defaults.get_global_default("company")
    if not company:
        company = frappe.get_single("Company").name

    try:
        ts = frappe.get_single("Transfer Setting")
    except frappe.DoesNotExistError:
        return []

    def _balance(account):
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
        return res and res[0][0] or 0

    out = []
    for row in getattr(ts, "internal", []) or []:
        if row.cash_account:
            out.append(
                {
                    "account": row.cash_account,
                    "label": getattr(row, "customer") or row.cash_account,
                    "type": "Internal",
                    "balance": _balance(row.cash_account),
                }
            )

    for row in getattr(ts, "external", []) or []:
        if row.cash_account:
            out.append(
                {
                    "account": row.cash_account,
                    "label": getattr(row, "customer") or row.cash_account,
                    "type": "External",
                    "balance": _balance(row.cash_account),
                }
            )

    return out


@frappe.whitelist()
def get_cash_balances():
    """
    Return cash balances for internal and external accounts.
    For internal accounts, also include profit account balance.
    """
    try:
        settings = frappe.get_single("Transfer Setting")
    except frappe.DoesNotExistError:
        frappe.log_error("Transfer Setting not found", "Alzawia Reports Error")
        return []

    company = frappe.defaults.get_global_default("company")
    if not company:
        company = frappe.get_all("Company", limit=1)[0].name

    balances = []

    def get_balance(account):
        """Return closing balance for an account."""
        if not account:
            return 0
        res = frappe.db.sql(
            """
            SELECT IFNULL(SUM(debit), 0) - IFNULL(SUM(credit), 0)
            FROM `tabGL Entry`
            WHERE account = %s AND company = %s
            """,
            (account, company),
        )
        return res[0][0] if res else 0

    internal_cash = settings.get("internal") or []
    external_cash = settings.get("external") or []

    # Internal accounts with profit
    for row in internal_cash:
        account = row.cash_account
        if not account:
            continue

        account_data = frappe.db.get_value(
            "Account", account, ["account_name", "account_currency"], as_dict=True
        )
        if not account_data:
            continue

        balance = get_balance(account)
        profit_balance = (
            get_balance(row.profit_account)
            if getattr(row, "profit_account", None)
            else 0
        )

        balances.append(
            {
                "account": account,
                "account_name": account_data.account_name,
                "currency": account_data.account_currency or "LYD",
                "balance": balance,
                "type": "Internal",
                "profit_balance": profit_balance,
            }
        )

    # External accounts
    for row in external_cash:
        account = row.cash_account
        if not account:
            continue

        account_data = frappe.db.get_value(
            "Account", account, ["account_name", "account_currency"], as_dict=True
        )
        if not account_data:
            continue

        balance = get_balance(account)
        balances.append(
            {
                "account": account,
                "account_name": account_data.account_name,
                "currency": account_data.account_currency or "LYD",
                "balance": balance,
                "type": "External",
            }
        )

    return balances
