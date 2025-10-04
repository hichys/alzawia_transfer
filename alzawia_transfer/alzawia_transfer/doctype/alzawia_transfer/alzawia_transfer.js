// Copyright (c) 2025, awad mohamed & atta almanan and contributors
// For license information, please see license.txt

frappe.ui.form.on("Alzawia Transfer", {
    onload: function (frm) {
        frm.set_df_property("split_profit", "read_only", 1);
        frm.set_df_property("without_profit", "read_only", 1);
        //retrieve profit_per_thousand from_customer transfer setting doctype
        if (frm.is_new()) {
            frappe.db.get_single_value("transfer setting", "profit_per_thousand").then(value => {
                frm.doc.profit_per_thousand = value;
                frm.refresh_field('profit_per_thousand');
            });
        }
        frm.set_query("from_customer", function () {
            return {
                filters: [
                    ["name", "!=", frm.doc.to_customer]
                ]
            };
        });
        frm.set_query("to_customer", function () {
            return {
                filters: [
                    ["name", "!=", frm.doc.from_customer]
                ]
            };
        });
          toggle_alzawia_profit(frm);
    },
    refresh: function(frm){
       
	},
    amount: function (frm) {
        var valid = validate_float_fields(frm.doc.amount,"amount");

        if (valid) {
            calculate_profit(frm);
        }

        frm.trigger('split_profit');
        frm.set_df_property("without_profit", "read_only", 0)


    },
    total_profit: function (frm) {

        // frm.trigger('profit_per_thousand');

        if (frm.doc.total_profit > 0) {
            frm.set_df_property("split_profit", "read_only", 0);
            frm.refresh_field('split_profit')
        }
        var valid = validate_float_fields(frm.doc.total_profit);
        if (valid) {
            adjust_profits(frm, 'total_profit');
        }
        frm.set_value('sender_profit', frm.doc.total_profit);
        frm.trigger('split_profit');


    },
    sender_profit: function (frm) {
        var valid = validate_float_fields(frm.doc.sender_profit,"sender profit");
         
        if (valid) {
            adjust_profits(frm, 'sender_profit');
        }
        if (frm.doc.sender_profit !== frm.doc.receiver_profit) {
            frm.set_value('split_profit', 0);
        }
        else {
            if(!frm.doc.is_crossing)
            frm.set_value('split_profit', 1);
        }


    },
    receiver_profit: function (frm) {
        var valid = validate_float_fields(frm.doc.receiver_profit);
        if (valid) {
            adjust_profits(frm, 'receiver_profit');
        }
        if (frm.doc.sender_profit !== frm.doc.receiver_profit) {
            frm.set_value('split_profit', 0);
        }
        else {
            if (!frm.doc.is_crossing)
            frm.set_value('split_profit', 1);
        }
    },
    profit_per_thousand: function (frm) {

        if (frm.doc.profit_per_thousand === 0) {
            frm.trigger('without_profit');
        }
        else {
            var valid = validate_float_fields(frm.doc.profit_per_thousand);
            if (!valid) {
                profit_per_thousand = 0;
                frm.set_value('profit_per_thousand', 0);
                frm.refresh_field('profit_per_thousand');
            }

            // calculate_profit(frm);
            adjust_profits(frm, 'profit_per_thousand')
        }


    },
    without_profit: function (frm) {
        // 0 the profit fields if without_profit is checked
        // uncheck split profit
        // check without profit
        if (frm.doc.without_profit || frm.doc.profit_per_thousand === 0) {
            
            frm.set_value('sender_profit', 0);
            frm.set_value('receiver_profit', 0);
            frm.set_value('total_profit', 0);
            frm.set_value('profit_per_thousand', 0);
            frm.set_value('split_profit', 0);
        }
       
       if(frm.doc.amount > 0)
       {
           frm.set_df_property("without_profit", "read_only", 0)
       }

    },
    split_profit: function (frm) {


        if (frm.doc.split_profit) {

            //split profit
            if (frm.doc.split_profit && frm.doc.total_profit >= 0) {

                //recalculate profit
                if(!frm.doc.is_crossing)
                {
                    var original_profit = frm.doc.total_profit;
                    frm.set_value('sender_profit', original_profit / 2);
                    frm.set_value('receiver_profit', original_profit / 2);
                    frappe.show_alert({ message: 'العمولة مقسومة' + ': ' + frm.doc.sender_profit, indicator: 'green' });
                }
                else{
                    var split = frm.doc.total_profit / 3;
                    frm.set_value('alzawia_profit', Math.round(split));
                    frm.set_value('sender_profit', Math.round(split));
                    frm.set_value('receiver_profit', Math.round(split));
                    frappe.show_alert({ message: 'العمولة مقسومة' + ': ' + frm.doc.sender_profit, indicator: 'green' });
                }

            }
            else {
                if (frm.doc.split_profit && frm.doc.profit < 0) {
                    frappe.show_alert({ message: 'Profit must be greater than 0', indicator: 'red' });
                }
            }

        }
    },
    whatsapp_desc: function (frm) {
        clearTimeout(frm.delayTimeout);
        if (frm.doc.whatsapp_desc ) {
            frm.delayTimeout = setTimeout(() => {
                let phoneNumber = extract_phone_number(frm.doc.whatsapp_desc);
                if (phoneNumber !== "ادخل يدويا") {
                    frm.set_value("phone_number", phoneNumber);
                } // Set the phone number field
                frappe.show_alert({
                    message: phoneNumber === "ادخل يدويا" ? "لا يمكن استخراج الرقم. ادخله يدوياً" : `تم استخراج الرقم: ${phoneNumber}`,
                    indicator: phoneNumber === "ادخل يدويا" ? "red" : "green"
                });
            }, 1000);
        }
    },
    from_customer: function (frm) {
        toggle_alzawia_profit(frm);
    },
    to_customer: function (frm) {
        toggle_alzawia_profit(frm);
    },
    alzawia_profit: function(frm){
        adjust_profits(frm,"alzawia_profit");
        if (frm.doc.alzawia_profit) {
            if (frm.doc.alzawia_profit > frm.doc.total_profit) {
                frm.set_value('alzawia_profit', frm.doc.total_profit)
                frappe.show_alert(__("عمولة الزاوية لا يمكن ان تكون اكبر من العمولة الكلية"));
            }
        }
    }
});
 
function validate_float_fields(value,changed_field) {
    // Validate the amount and profit_per_thousand fields

    const floatRegex = /^-?\d+(\.\d+)?$/;
    if (!floatRegex.test(value)) {
        frappe.msgprint({
            title: __('خطا'),
            message: __(` ${changed_field}الرجاء ادخال قيمة صحيحة`),
            indicator: 'red'
        });
        frm.set_value('amount', 0);
        return false;
    }

    if (value < 0) {
        frappe.msgprint({
            title: __('خطا'),
            message: __('الرجاء ادخال قيمة اكبر من صفر'),
            indicator: 'red'
        });
        frm.set_value('amount', 0);
        return false;
    }

    return true;
}
function calculate_profit(frm) {

    if (frm.doc.profit_per_thousand === 0) {
        frm.set_value('without_profit', 1);
        frm.set_value('split_profit', 0);
        return 0;
    }
    else
        if (frm.doc.profit_per_thousand === 0 && frm.doc.amount === 0) {
            frm.set_value('without_profit', 1);
            frm.set_value('split_profit', 0);
            return 0;
        }

    if (frm.doc.amount && frm.doc.profit_per_thousand) {
        let profit = 0;

        if (frm.doc.amount < 1100) {
            profit = frm.doc.profit_per_thousand; // Fixed profit if amount is less than 1100
        } else {
            // Calculate profit for amounts >= 1100
            let rounded_amount = Math.ceil(frm.doc.amount / 1000); // Round up to_branch nearest 1000
            profit = rounded_amount * frm.doc.profit_per_thousand; // Use profit_per_thousand for calculation
        }

        // Set the calculated profit in the profit field
        frm.set_value('total_profit', profit);
        frm.set_value('receiver_profit', 0);
        return profit;
    }
    else {
        frm.set_value('total_profit', 0);

    }
}

function calculate_profit_per_thousand(frm) {
    if (!frm.doc.total_profit || !frm.doc.amount || frm.doc.amount === 0) {
        return 0;
    }

    if (frm.doc.total_profit === 0) {
        return 0;
    }

    let profit_per_thousand = 0;

    if (frm.doc.amount < 1100) {
        // For amounts less than 1100, profit_per_thousand equals total_profit
        profit_per_thousand = frm.doc.total_profit;
    } else {
        // For amounts >= 1100, reverse the calculation
        let rounded_amount = Math.ceil(frm.doc.amount / 1000);
        profit_per_thousand = frm.doc.total_profit / rounded_amount;
    }

    return profit_per_thousand;
}

function adjust_profits(frm, changed_field) {
    const total = frm.doc.total_profit || 0;
    let sender = frm.doc.sender_profit || 0;
    let receiver = frm.doc.receiver_profit || 0;
    let alzawia = frm.doc.alzawia_profit || 0;

    if (frm.doc.is_crossing) {
        if (changed_field === 'sender_profit') {
            if (alzawia > 0) {
                // 🔒 Alzawia fixed — only adjust receiver
                receiver = total - alzawia - sender;
                if (receiver < 0) receiver = 0;
            } else {
                // Normal balancing (when alzawia = 0)
                let remaining = total - sender;
                if (receiver === 0) receiver = remaining;
                else receiver = remaining - alzawia;
            }
        } else if (changed_field === 'receiver_profit') {
            if (alzawia > 0) {
                // 🔒 Alzawia fixed — only adjust sender
                sender = total - alzawia - receiver;
                if (sender < 0) sender = 0;
            } else {
                // Normal balancing (when alzawia = 0)
                let remaining = total - receiver;
                if (sender === 0) sender = remaining;
                else sender = remaining - alzawia;
            }
        } else if (changed_field === 'alzawia_profit') {
            // 🧭 Alzawia is source → adjust both others equally
            let remaining = total - alzawia;
            if (remaining < 0) remaining = 0;

            if (sender === 0 && receiver === 0) {
                // If both empty, split remaining 50/50
                sender = receiver = remaining / 2;
            } else {
                let sum = sender + receiver;
                if (sum > 0) {
                    // Adjust proportionally
                    sender = Math.round((sender / sum) * remaining);
                    receiver = remaining - sender;
                } else {
                    // Default split
                    sender = receiver = remaining / 2;
                }
            }
        } else if (changed_field === 'total_profit') {
            // Recalculate all based on proportions
            let sum = sender + receiver + alzawia;
            if (sum > 0) {
                sender = Math.round((sender / sum) * total);
                receiver = Math.round((receiver / sum) * total);
                alzawia = total - (sender + receiver);
            } else {
                alzawia = total;
                sender = 0;
                receiver = 0;
            }
        }
    }
 else {
        // ✅ Your non-crossing logic stays the same
        if (changed_field === 'total_profit') {
            frm.set_value('profit_per_thousand', calculate_profit_per_thousand(frm));
        } else if (changed_field === 'profit_per_thousand') {
            let rounded_amount = Math.ceil(frm.doc.amount / 1000);
            const profit = rounded_amount * frm.doc.profit_per_thousand;
            frm.set_value('total_profit', profit);
        } else if (changed_field === 'sender_profit') {
            receiver = total -  sender  ;
            if (receiver < 0) {
                receiver = 0;
                sender = total - alzawia;
            }
        } else if (changed_field === 'receiver_profit') {
            sender = total - receiver  ;
            if (sender < 0) {
                sender = 0;
                receiver = total;
            }
        }
    }

    // ✅ Update fields
    frm.set_value('sender_profit', sender);
    frm.set_value('receiver_profit', receiver);
    frm.set_value('alzawia_profit', alzawia);
    frm.refresh_fields();
}


function toggle_alzawia_profit(frm) {
    const fieldname = "alzawia_profit";

    if (!frm.doc.from_customer || !frm.doc.to_customer) {
        frm.toggle_display(fieldname, false);
        frm.set_df_property(fieldname, "read_only", 1);
        return;
    }

    check_external_status(frm).then(isBothExternal => {
        if (isBothExternal) {
            frm.toggle_display(fieldname, true);
            frm.set_df_property(fieldname, "read_only", 0);
            frm.set_value("is_crossing",1);
        } else {
            frm.toggle_display(fieldname, false);
            frm.set_df_property(fieldname, "read_only", 1);
            frm.set_value("is_crossing", 0);

        }
    });
}

function check_external_status(frm) {
    return frappe.db.get_doc("Transfer Setting").then(setting => {
        if (!setting) return false;

        const external_customers = (setting.external || []).map(r => r.customer);
        const fromIsExternal = external_customers.includes(frm.doc.from_customer);
        const toIsExternal = external_customers.includes(frm.doc.to_customer);

        return (fromIsExternal && toIsExternal);
    });
}

function extract_phone_number(whatsapp_desc) {
    try {
        // Clean the text to remove spaces and hyphens
        let cleanedText = whatsapp_desc.replace(/[\s-]/g, "");

        // Match a phone number pattern with or without the country code
        let match = cleanedText.match(/(?:\+?218)?0?(9[1234]\d{7})/);

        if (match) {
            console.log("Matched phone number:", match[1]);
            return '0' + match[1]; // Return the matched phone number
        } else {
            console.log("No valid phone number found.");
            return "ادخل يدويا"; // Fallback if no match
        }
    } catch (error) {
        console.error("Error in extract_phone_number:", error);
        return "ادخل يدويا"; // Fallback for unexpected errors
    }
} 