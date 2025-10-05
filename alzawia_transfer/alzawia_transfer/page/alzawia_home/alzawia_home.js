frappe.pages['alzawia_home'].on_page_load = function (wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Home - Alzawia',
        single_column: true
    });

    // Add a container for your cards
    const container = $('<div class="alzawia-card-container" style="display:flex; gap:1rem; flex-wrap:wrap; margin-top:1rem;"></div>');
    $(page.main).append(container);

    // Create the card for Cash Balances (website page)
    const card = $(`
        <div class="alzawia-card" style="
            background:#f5f5f5;
            border-radius:0.5rem;
            padding:1rem 1.5rem;
            box-shadow:0 2px 6px rgba(0,0,0,0.1);
            cursor:pointer;
            width:200px;
            text-align:center;
            transition: all 0.2s ease;
        ">
            <h4 style="margin:0 0 0.5rem 0;">Cash Balances</h4>
            <p style="margin:0; color:#007bff;">View Report</p>
        </div>
    `);

    // Hover effect
    card.hover(
        function () { $(this).css("transform", "translateY(-3px)").css("box-shadow", "0 4px 12px rgba(0,0,0,0.15)"); },
        function () { $(this).css("transform", "translateY(0)").css("box-shadow", "0 2px 6px rgba(0,0,0,0.1)"); }
    );

    // Click navigates to the website page
    card.on('click', function () {
        window.open('/alzawia_reports', '_blank'); // open in new tab
    });

    container.append(card);
};
